"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
import { Product, Category } from "@/lib/types";

// ─── Chain Badge ─────────────────────────────────────────────
function ChainBadge({ chain }: { chain: string }) {
  const colors: Record<string, string> = {
    ethereum: "badge-premium",
    solana:
      "bg-[rgba(6,182,212,0.1)] text-[var(--accent)] border border-[rgba(6,182,212,0.2)]",
    polygon:
      "bg-[rgba(99,102,241,0.1)] text-indigo-400 border border-[rgba(99,102,241,0.2)]",
    bitcoin:
      "bg-[rgba(249,115,22,0.1)] text-orange-400 border border-[rgba(249,115,22,0.2)]",
    arbitrum:
      "bg-[rgba(79,70,229,0.1)] text-[var(--primary)] border border-[rgba(79,70,229,0.2)]",
  };
  return (
    <span className={`badge ${colors[chain.toLowerCase()] || colors.ethereum}`}>
      {chain}
    </span>
  );
}

// ─── Product Card ────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isUrgent = product.auction?.timeLeft.includes("m");

  return (
    <div className="card flex flex-col">
      <div className="relative aspect-square bg-[var(--surface-2)] overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
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
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked
                ? "fill-[var(--danger)] text-[var(--danger)]"
                : "text-white/60"
            }`}
          />
        </button>

        {product.auction && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`badge flex items-center gap-1.5 ${
                isUrgent
                  ? "bg-[rgba(239,68,68,0.15)] text-[var(--danger)] border border-[rgba(239,68,68,0.3)]"
                  : "bg-black/50 text-white/80 border border-transparent backdrop-blur-sm"
              }`}
            >
              <Clock className="w-3 h-3" />
              {product.auction.timeLeft}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="seller">
          <div className="w-5 h-5 rounded-full bg-[var(--surface-3)] overflow-hidden">
            <img
              src={product.seller.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span>{product.seller.displayName}</span>
          {product.seller.verified && (
            <ShieldCheck className="verified-icon" />
          )}
        </div>

        <Link href={`/product/${product.id}`} className="block group/title mt-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover/title:text-[var(--primary)] transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-dim)]">
          <span className="capitalize">
            {product.condition.replace("_", " ")}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {product.views}
          </span>
          {product.watchers > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {product.watchers}
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
                  ${product.auction.currentBid.toLocaleString()}
                </p>
                <p className="text-[10px] text-[var(--text-dim)]">
                  {product.auction.bidsCount} bids
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
                <p className="price">${product.price.toLocaleString()}</p>
                {product.shipping.free ? (
                  <p className="text-[10px] text-[var(--success)] font-semibold">
                    Free shipping
                  </p>
                ) : (
                  <p className="text-[10px] text-[var(--text-dim)]">
                    +${product.shipping.price} shipping
                  </p>
                )}
              </div>
              <button className="primary-btn !py-2 !px-3">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Filter Sidebar ──────────────────────────────────────────
function FilterPanel({
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
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (v: string) => void;
  selectedType: string;
  onTypeChange: (v: string) => void;
  priceRange: string;
  onPriceChange: (v: string) => void;
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

      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
              selectedCategory === "all"
                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[var(--text-dim)]">
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Listing Type
        </h4>
        <div className="space-y-1">
          {[
            { value: "all", label: "All Types" },
            { value: "buy_now", label: "Buy Now" },
            { value: "auction", label: "Auction" },
            { value: "both", label: "Buy Now / Auction" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTypeChange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedType === opt.value
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-[var(--text-dim)] uppercase tracking-wider mb-3">
          Price Range
        </h4>
        <div className="space-y-1">
          {[
            { value: "all", label: "Any Price" },
            { value: "0-500", label: "Under $500" },
            { value: "500-5000", label: "$500 – $5,000" },
            { value: "5000-25000", label: "$5,000 – $25,000" },
            { value: "25000-999999", label: "$25,000+" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPriceChange(opt.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                priceRange === opt.value
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                  : "text-[var(--text-muted)] hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Inner Search ────────────────────────────────────────────
function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialFeatured = searchParams.get("featured") === "true";
  const initialNew = searchParams.get("new") === "true";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.categories
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.q = query;
      if (selectedCategory && selectedCategory !== "all")
        params.category = selectedCategory;
      if (initialFeatured) params.featured = "true";
      if (initialNew) params.new = "true";
      params.limit = "50";

      const res = await api.products.getAll(params);
      let filtered = res.data;

      if (selectedType !== "all") {
        filtered = filtered.filter((p) => p.listingType === selectedType);
      }

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        filtered = filtered.filter((p) => p.price >= min && p.price <= max);
      }

      const sorted = [...filtered];
      switch (sortBy) {
        case "price_low":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "price_high":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );
          break;
        case "popular":
          sorted.sort((a, b) => b.watchers - a.watchers);
          break;
        default:
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
  }, [query, selectedCategory, selectedType, priceRange, sortBy, initialFeatured, initialNew]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setPriceRange("all");
    setSortBy("relevance");
    router.push("/search");
  };

  const hasFilters = !!(
    query ||
    (selectedCategory && selectedCategory !== "all") ||
    selectedType !== "all" ||
    priceRange !== "all"
  );

  const activePills: { label: string; onRemove: () => void }[] = [];
  if (query)
    activePills.push({ label: `"${query}"`, onRemove: () => setQuery("") });
  if (selectedCategory && selectedCategory !== "all") {
    const cat = categories.find((c) => c.slug === selectedCategory);
    activePills.push({
      label: cat?.name || selectedCategory,
      onRemove: () => setSelectedCategory("all"),
    });
  }
  if (selectedType !== "all")
    activePills.push({
      label: selectedType.replace("_", " "),
      onRemove: () => setSelectedType("all"),
    });
  if (priceRange !== "all") {
    const labels: Record<string, string> = {
      "0-500": "Under $500",
      "500-5000": "$500–$5k",
      "5000-25000": "$5k–$25k",
      "25000-999999": "$25k+",
    };
    activePills.push({
      label: labels[priceRange] || priceRange,
      onRemove: () => setPriceRange("all"),
    });
  }

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
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-[72px] top-1/2 -translate-y-1/2 lg:hidden p-2 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all"
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
            {query
              ? `Results for "${query}"`
              : initialFeatured
              ? "Featured Items"
              : initialNew
              ? "New Arrivals"
              : "Browse Marketplace"}
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
              <option value="relevance" style={{ background: "var(--surface-2)" }}>
                Relevance
              </option>
              <option value="newest" style={{ background: "var(--surface-2)" }}>
                Newest First
              </option>
              <option value="price_low" style={{ background: "var(--surface-2)" }}>
                Price: Low to High
              </option>
              <option value="price_high" style={{ background: "var(--surface-2)" }}>
                Price: High to Low
              </option>
              <option value="popular" style={{ background: "var(--surface-2)" }}>
                Most Watched
              </option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)] pointer-events-none" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-all border ${
              showFilters || hasFilters
                ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                : "bg-white/[0.03] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-white"
            }`}
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

      {/* Active filter pills */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activePills.map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-medium border border-[var(--primary)]/20"
            >
              {pill.label}
              <button
                onClick={pill.onRemove}
                className="hover:text-white transition-colors"
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
        {/* Desktop Filters */}
        <aside
          className={`hidden lg:block w-56 flex-shrink-0 transition-all duration-300 ${
            showFilters
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-8 pointer-events-none absolute"
          }`}
        >
          <div className="sticky top-20 profile-card p-5">
            <FilterPanel
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onClear={clearFilters}
              hasFilters={hasFilters}
            />
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {showFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
            <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 lg:hidden overflow-y-auto">
              <div className="min-h-full profile-card p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  onClear={clearFilters}
                  hasFilters={hasFilters}
                />
                <button
                  onClick={() => setShowFilters(false)}
                  className="primary-btn w-full mt-6"
                >
                  Show {total} results
                </button>
              </div>
            </div>
          </>
        )}

        {/* Main Grid */}
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
                {query
                  ? `We couldn't find anything matching "${query}". Try adjusting your search or filters.`
                  : "No items match your current filters. Try removing some filters."}
              </p>
              <div className="flex gap-3">
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="secondary-btn !py-2.5"
                  >
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
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
          <div className="dark-skeleton h-14 !rounded-[var(--radius-xl)] mb-8" />
          <div className="dark-skeleton h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="dark-skeleton aspect-square !rounded-[var(--radius-lg)] mb-4" />
                <div className="dark-skeleton h-4 w-3/4 mb-2" />
                <div className="dark-skeleton h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
