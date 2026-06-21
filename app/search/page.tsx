"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  Eye,
  Clock,
  Gavel,
  ShoppingCart,
  ShieldCheck,
  Loader2,
  Flame,
  Sparkles,
  ExternalLink,
  ArrowUpDown,
  PackageOpen,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Product, Category } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────
const CHAIN_COLORS: Readonly<Record<string, string>> = {
  ethereum: "badge-premium",
  solana:
    "bg-[rgba(6,182,212,0.1)] text-[var(--accent)] border border-[rgba(6,182,212,0.2)]",
  polygon:
    "bg-[rgba(99,102,241,0.1)] text-indigo-400 border border-[rgba(99,102,241,0.2)]",
  bitcoin:
    "bg-[rgba(249,115,22,0.1)] text-orange-400 border border-[rgba(249,115,22,0.2)]",
  arbitrum:
    "bg-[rgba(79,70,229,0.1)] text-[var(--primary)] border border-[rgba(79,70,229,0.2)]",
} as const;

const LISTING_TYPES = [
  { value: "all", label: "All Types" },
  { value: "buy_now", label: "Buy Now" },
  { value: "auction", label: "Auction" },
  { value: "both", label: "Buy Now / Auction" },
] as const;

const PRICE_OPTIONS = [
  { value: "all", label: "Any Price" },
  { value: "0-500", label: "Under $500" },
  { value: "500-5000", label: "$500 – $5,000" },
  { value: "5000-25000", label: "$5,000 – $25,000" },
  { value: "25000-999999", label: "$25,000+" },
] as const;

const PRICE_LABELS: Readonly<Record<string, string>> = {
  "0-500": "Under $500",
  "500-5000": "$500–$5k",
  "5000-25000": "$5k–$25k",
  "25000-999999": "$25k+",
};

const SKELETON_COUNT = 8;

// ─── Hooks ───────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debounced;
}

// ─── Chain Badge ─────────────────────────────────────────────
const ChainBadge = memo(function ChainBadge({ chain }: { chain: string }) {
  const colorClass = CHAIN_COLORS[chain.toLowerCase()] ?? CHAIN_COLORS.ethereum;
  return <span className={`badge ${colorClass}`}>{chain}</span>;
});

// ─── Product Card ────────────────────────────────────────────
const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Safe property access
  const isUrgent = (product.auction?.timeLeft ?? "").includes("m");
  const sellerAvatar = product.seller?.avatar;
  const sellerName = product.seller?.displayName ?? "Unknown";
  const isVerified = product.seller?.verified ?? false;
  const condition = product.condition?.replace("_", " ") ?? "N/A";
  const views = product.views ?? 0;
  const watchers = product.watchers ?? 0;
  const currentBid = product.auction?.currentBid ?? 0;
  const bidsCount = product.auction?.bidsCount ?? 0;
  const timeLeft = product.auction?.timeLeft;
  const isFreeShipping = product.shipping?.free ?? false;
  const shippingPrice = product.shipping?.price ?? 0;

  return (
    <div className="card flex flex-col">
      <div className="relative aspect-square bg-[var(--surface-2)] overflow-hidden">
        {!imgError && product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="product-image !h-full"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-dim)]">
            <ExternalLink className="w-10 h-10" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <ChainBadge chain={product.chain} />
          {product.featured && (
            <span className="badge badge-auction flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          )}
          {product.isNew && (
            <span className="badge badge-new flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked((prev) => !prev);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all z-10"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked
                ? "fill-[var(--danger)] text-[var(--danger)]"
                : "text-white/60"
            }`}
          />
        </button>

        {timeLeft && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`badge flex items-center gap-1.5 ${
                isUrgent
                  ? "bg-[rgba(239,68,68,0.15)] text-[var(--danger)] border border-[rgba(239,68,68,0.3)]"
                  : "bg-black/50 text-white/80 border border-transparent backdrop-blur-sm"
              }`}
            >
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="seller">
          {sellerAvatar && (
            <div className="w-5 h-5 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <Image
                src={sellerAvatar}
                alt=""
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <span>{sellerName}</span>
          {isVerified && <ShieldCheck className="verified-icon" />}
        </div>

        <Link href={`/product/${product.id}`} className="block group/title mt-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover/title:text-[var(--primary)] transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-dim)]">
          <span className="capitalize">{condition}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views}
          </span>
          {watchers > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {watchers}
            </span>
          )}
        </div>

        <div className="flex-1" />

        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          {product.auction && product.listingType === "auction" ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">
                  Current Bid
                </p>
                <p className="price crypto">
                  ${currentBid.toLocaleString()}
                </p>
                <p className="text-[10px] text-[var(--text-dim)]">
                  {bidsCount} bids
                </p>
              </div>
              <button className="bid-btn flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5" /> Bid
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">
                  Price
                </p>
                <p className="price">
                  ${(product.price ?? 0).toLocaleString()}
                </p>
                {isFreeShipping ? (
                  <p className="text-[10px] text-[var(--success)] font-semibold">
                    Free shipping
                  </p>
                ) : (
                  <p className="text-[10px] text-[var(--text-dim)]">
                    +${shippingPrice} shipping
                  </p>
                )}
              </div>
              <button
                className="primary-btn !py-2 !px-3"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ─── Filter Panel ────────────────────────────────────────────
const FilterPanel = memo(function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  priceRange,
  onPriceChange,
  onClear,
  hasFilters,
}: {
  categories: readonly Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  priceRange: string;
  onPriceChange: (value: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Filters
        </h3>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-[var(--primary)] hover:text-[var(--accent)] transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-1">
          <FilterButton
            active={selectedCategory === "all"}
            onClick={() => onCategoryChange("all")}
          >
            All Categories
          </FilterButton>
          {categories.map((cat) => (
            <FilterButton
              key={cat.id}
              active={selectedCategory === cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
            >
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-[var(--text-dim)]">
                {cat.productCount}
              </span>
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Listing Type
        </h4>
        <div className="space-y-1">
          {LISTING_TYPES.map((opt) => (
            <FilterButton
              key={opt.value}
              active={selectedType === opt.value}
              onClick={() => onTypeChange(opt.value)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Price Range
        </h4>
        <div className="space-y-1">
          {PRICE_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.value}
              active={priceRange === opt.value}
              onClick={() => onPriceChange(opt.value)}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>
      </div>
    </div>
  );
});

// ─── Filter Button (extracted for consistency) ───────────────
const FilterButton = memo(function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center ${
        active
          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
          : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
      }`}
    >
      {children}
    </button>
  );
});

// ─── Skeleton Grid ───────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      <div className="dark-skeleton h-14 !rounded-[var(--radius-xl)] mb-8" />
      <div className="dark-skeleton h-10 w-64 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <div key={i}>
            <div className="dark-skeleton aspect-square !rounded-[var(--radius-lg)] mb-4" />
            <div className="dark-skeleton h-4 w-3/4 mb-2" />
            <div className="dark-skeleton h-6 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inner Search ────────────────────────────────────────────
function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Derived URL params (memoized) ──
  const initialQuery = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const initialCategory = useMemo(() => searchParams.get("category") ?? "all", [searchParams]);
  const initialFeatured = useMemo(() => searchParams.get("featured") === "true", [searchParams]);
  const initialNew = useMemo(() => searchParams.get("new") === "true", [searchParams]);

  // ── Filter state ──
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // ── UI state (separated: mobile drawer vs desktop sidebar) ──
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showDesktopFilters, setShowDesktopFilters] = useState(true);

  // ── Data state ──
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // ── Debounced query for search input ──
  const debouncedQuery = useDebounce(query, 250);

  // ── Fetch categories (once) ──
  useEffect(() => {
    let cancelled = false;
    api.categories
      .getAll()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Fetch products ──
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        limit: "50",
      };

      // Base filters → API
      if (debouncedQuery) params.q = debouncedQuery;
      if (selectedCategory && selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (initialFeatured) params.featured = "true";
      if (initialNew) params.new = "true";

      // Advanced filters → try API first
      if (selectedType !== "all") params.type = selectedType;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        params.minPrice = String(min);
        params.maxPrice = String(max);
      }
      if (sortBy !== "relevance") params.sort = sortBy;

      const res = await api.products.getAll(params);
      let filtered = res.data;

      // ── Client-side fallback if API didn't filter ──
      if (selectedType !== "all") {
        const hasApiFilter = filtered.every(
          (p) => p.listingType === selectedType
        );
        if (!hasApiFilter) {
          filtered = filtered.filter((p) => p.listingType === selectedType);
        }
      }

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        const needsClientFilter = filtered.some(
          (p) => (p.price ?? 0) < min || (p.price ?? 0) > max
        );
        if (needsClientFilter) {
          filtered = filtered.filter((p) => {
            const price = p.price ?? 0;
            return price >= min && price <= max;
          });
        }
      }

      // ── Client-side sorting ──
      const sorted = [...filtered];
      switch (sortBy) {
        case "price_low":
          sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
          break;
        case "price_high":
          sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
          break;
        case "newest":
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );
          break;
        case "popular":
          sorted.sort((a, b) => (b.watchers ?? 0) - (a.watchers ?? 0));
          break;
      }

      setProducts(sorted);
      setTotal(sorted.length);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedCategory, selectedType, priceRange, sortBy, initialFeatured, initialNew]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Handlers ──
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedCategory && selectedCategory !== "all") {
        params.set("category", selectedCategory);
      }
      router.push(`/search?${params.toString()}`);
    },
    [query, selectedCategory, router]
  );

  const clearFilters = useCallback(() => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setPriceRange("all");
    setSortBy("relevance");
    router.push("/search");
  }, [router]);

  // ── Derived UI state ──
  const hasFilters = useMemo(
    () =>
      !!(
        query ||
        (selectedCategory && selectedCategory !== "all") ||
        selectedType !== "all" ||
        priceRange !== "all"
      ),
    [query, selectedCategory, selectedType, priceRange]
  );

  const activePills = useMemo(() => {
    const pills: { id: string; label: string; onRemove: () => void }[] = [];

    if (query) {
      pills.push({ id: "query", label: `"${query}"`, onRemove: () => setQuery("") });
    }
    if (selectedCategory && selectedCategory !== "all") {
      const cat = categories.find((c) => c.slug === selectedCategory);
      pills.push({
        id: "category",
        label: cat?.name ?? selectedCategory,
        onRemove: () => setSelectedCategory("all"),
      });
    }
    if (selectedType !== "all") {
      pills.push({
        id: "type",
        label: selectedType.replace("_", " "),
        onRemove: () => setSelectedType("all"),
      });
    }
    if (priceRange !== "all") {
      pills.push({
        id: "price",
        label: PRICE_LABELS[priceRange] ?? priceRange,
        onRemove: () => setPriceRange("all"),
      });
    }

    return pills;
  }, [query, selectedCategory, selectedType, priceRange, categories]);

  const pageTitle = useMemo(() => {
    if (query) return `Results for "${query}"`;
    if (initialFeatured) return "Featured Items";
    if (initialNew) return "New Arrivals";
    return "Browse Marketplace";
  }, [query, initialFeatured, initialNew]);

  const emptyMessage = useMemo(() => {
    if (query) {
      return `We couldn't find anything matching "${query}". Try adjusting your search or filters.`;
    }
    return "No items match your current filters. Try removing some filters.";
  }, [query]);

  // ── Filter panel props (memoized) ──
  const filterPanelProps = useMemo(
    () => ({
      categories,
      selectedCategory,
      onCategoryChange: setSelectedCategory,
      selectedType,
      onTypeChange: setSelectedType,
      priceRange,
      onPriceChange: setPriceRange,
      onClear: clearFilters,
      hasFilters,
    }),
    [categories, selectedCategory, selectedType, priceRange, clearFilters, hasFilters]
  );

  // ── Render ──
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="search-wrapper !rounded-[var(--radius-xl)]">
          <Search className="search-icon w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search NFTs, collections, users, chains..."
            className="search-bar !pl-14"
          />
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="absolute right-[72px] top-1/2 -translate-y-1/2 lg:hidden p-2 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 primary-btn !py-2.5 !px-6 !rounded-[var(--radius-lg)] flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Title + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {initialFeatured && (
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-[var(--warning)]" />
              <span className="text-xs font-bold text-[var(--warning)] uppercase tracking-wider">
                Featured Items
              </span>
            </div>
          )}
          {initialNew && (
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[var(--success)]" />
              <span className="text-xs font-bold text-[var(--success)] uppercase tracking-wider">
                New Arrivals
              </span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {pageTitle}
          </h1>
          {!loading && (
            <p className="text-sm text-[var(--text-dim)] mt-1">
              {total} {total === 1 ? "item" : "items"} found
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dark-input !pr-9 !py-2.5 !text-sm appearance-none cursor-pointer min-w-[160px]"
              style={{ background: "var(--surface-2)" }}
            >
              {[
                { value: "relevance", label: "Relevance" },
                { value: "newest", label: "Newest First" },
                { value: "price_low", label: "Price: Low to High" },
                { value: "price_high", label: "Price: High to Low" },
                { value: "popular", label: "Most Watched" },
              ].map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  style={{ background: "var(--surface-2)" }}
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
          </div>

          <button
            onClick={() => setShowDesktopFilters((prev) => !prev)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all border ${
              showDesktopFilters || hasFilters
                ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                : "bg-white/[0.03] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-white"
            }`}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white text-[10px] font-bold flex items-center justify-center">
                {activePills.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activePills.map((pill) => (
            <span
              key={pill.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium border border-[var(--primary)]/20"
            >
              {pill.label}
              <button
                onClick={pill.onRemove}
                className="hover:text-white transition-colors"
                aria-label={`Remove filter: ${pill.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="text-xs text-[var(--text-dim)] hover:text-[var(--danger)] transition-colors font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Layout */}
      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside
          className={`hidden lg:block w-56 flex-shrink-0 transition-all duration-300 ${
            showDesktopFilters
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8 pointer-events-none absolute"
          }`}
        >
          <div className="sticky top-20 profile-card p-5">
            <FilterPanel {...filterPanelProps} />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 lg:hidden overflow-y-auto">
              <div className="min-h-full profile-card p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel {...filterPanelProps} />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="primary-btn w-full mt-6"
                >
                  Show {total} results
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Content Grid */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              <p className="mt-4 text-sm text-[var(--text-dim)]">
                Searching the marketplace...
              </p>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">
                No items found
              </h2>
              <p className="text-sm text-[var(--text-dim)] max-w-md mb-6">
                {emptyMessage}
              </p>
              <div className="flex gap-3">
                {hasFilters && (
                  <button onClick={clearFilters} className="secondary-btn !py-2.5">
                    Clear Filters
                  </button>
                )}
                <Link href="/" className="primary-btn !py-2.5">
                  Browse Marketplace
                </Link>
              </div>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={<SkeletonGrid />}>
      <SearchInner />
    </Suspense>
  );
}
