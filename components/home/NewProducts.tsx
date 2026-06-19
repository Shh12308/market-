"use client";

import { useState, useEffect } from "react";
import {
  Heart, Eye, Clock, Gavel, ShoppingCart, Loader2, ExternalLink, ShieldCheck, Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";

function ChainBadge({ chain }: { chain: string }) {
  const colors: Record<string, string> = {
    ethereum: "badge-premium",
    solana: "bg-[rgba(6,182,212,0.1)] text-[var(--accent)] border border-[rgba(6,182,212,0.2)]",
    polygon: "bg-[rgba(99,102,241,0.1)] text-indigo-400 border border-[rgba(99,102,241,0.2)]",
    bitcoin: "bg-[rgba(249,115,22,0.1)] text-orange-400 border border-[rgba(249,115,22,0.2)]",
    arbitrum: "bg-[rgba(79,70,229,0.1)] text-[var(--primary)] border border-[rgba(79,70,229,0.2)]",
  };
  return <span className={`badge ${colors[chain.toLowerCase()] || colors.ethereum}`}>{chain}</span>;
}

function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="card flex flex-col">
      <div className="relative aspect-square bg-[var(--surface-2)] overflow-hidden">
        {!imgError ? (
          <img src={product.image} alt={product.title} className="product-image !h-full" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-dim)]">
            <ExternalLink className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <ChainBadge chain={product.chain} />
          <span className="badge badge-new flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> New
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all z-10"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-[var(--danger)] text-[var(--danger)]" : "text-white/60"}`} />
        </button>
        {product.auction && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className={`badge flex items-center gap-1.5 ${product.auction.timeLeft.includes("m") ? "bg-[rgba(239,68,68,0.15)] text-[var(--danger)] border border-[rgba(239,68,68,0.3)]" : "bg-black/50 text-white/80 border border-transparent backdrop-blur-sm"}`}>
              <Clock className="w-3 h-3" /> {product.auction.timeLeft}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="seller">
          <div className="w-5 h-5 rounded-full bg-[var(--surface-3)] overflow-hidden">
            <img src={product.seller.avatar} alt="" className="w-full h-full object-cover" />
          </div>
          <span>{product.seller.displayName}</span>
          {product.seller.verified && <ShieldCheck className="verified-icon" />}
        </div>
        <a href={`/product/${product.id}`} className="block group/title mt-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover/title:text-[var(--primary)] transition-colors leading-snug">
            {product.title}
          </h3>
        </a>
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-dim)]">
          <span className="capitalize">{product.condition.replace("_", " ")}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{product.views}</span>
        </div>
        <div className="flex-1" />
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          {product.auction && product.listingType === "auction" ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">Starting Bid</p>
                <p className="price crypto">${product.auction.currentBid.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--text-dim)]">{product.auction.bidsCount} bids</p>
              </div>
              <button className="bid-btn flex items-center gap-1.5"><Gavel className="w-3.5 h-3.5" /> Bid</button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">Price</p>
                <p className="price">${product.price.toLocaleString()}</p>
                {product.shipping.free ? (
                  <p className="text-[10px] text-[var(--success)] font-semibold">Free shipping</p>
                ) : (
                  <p className="text-[10px] text-[var(--text-dim)]">+${product.shipping.price} shipping</p>
                )}
              </div>
              <button className="primary-btn !py-2 !px-3"><ShoppingCart className="w-4 h-4" /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products.getNew().then((res) => setProducts(res.data)).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 border-t border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[var(--success)]" />
              <span className="text-xs font-bold text-[var(--success)] uppercase tracking-wider">Just Listed</span>
            </div>
            <h2 className="section-title !mb-1">New Arrivals</h2>
            <p className="text-[var(--text-dim)] text-sm">Fresh listings you don&apos;t want to miss</p>
          </div>
          <a href="/search?new=true" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors">
            See All <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
            <span className="ml-3 text-sm text-[var(--text-dim)]">Loading new arrivals...</span>
          </div>
        )}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="w-10 h-10 text-[var(--text-dim)] mx-auto" />
            <p className="mt-3 text-sm text-[var(--text-dim)]">No new listings yet</p>
          </div>
        )}
        {!loading && products.length > 0 && (
          <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
      </div>
    </section>
  );
}
