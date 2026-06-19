"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Eye,
  Clock,
  Gavel,
  ShoppingCart,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";

function ChainBadge({ chain }: { chain: string }) {
  const colors: Record<string, string> = {
    ethereum: "bg-purple-50 text-purple-700 border-purple-200",
    solana: "bg-teal-50 text-teal-700 border-teal-200",
    polygon: "bg-indigo-50 text-indigo-700 border-indigo-200",
    bitcoin: "bg-orange-50 text-orange-700 border-orange-200",
    arbitrum: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
        colors[chain.toLowerCase()] || colors.ethereum
      }`}
    >
      {chain}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const timeLeftColor =
    product.auction && product.auction.timeLeft.includes("m")
      ? "text-red-600 bg-red-50"
      : "text-gray-600 bg-gray-50";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ExternalLink className="w-10 h-10" />
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <ChainBadge chain={product.chain} />
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-400 text-yellow-900">
              <Flame className="w-2.5 h-2.5" />
              Hot
            </span>
          )}
        </div>

        {/* Like button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Auction timer overlay */}
        {product.auction && (
          <div className="absolute bottom-3 left-3 right-3">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm ${timeLeftColor}`}
            >
              <Clock className="w-3.5 h-3.5" />
              {product.auction.timeLeft} left
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Seller */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 overflow-hidden">
            <img
              src={product.seller.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {product.seller.displayName}
          </span>
          {product.seller.verified && (
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          )}
        </div>

        {/* Title */}
        <a href={`/product/${product.id}`} className="block group/title">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover/title:text-[#36648F] transition-colors leading-snug">
            {product.title}
          </h3>
        </a>

        {/* Condition + Views */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="capitalize">{product.condition.replace("_", " ")}</span>
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="mt-4 pt-3 border-t border-gray-50">
          {product.auction && product.listingType === "auction" ? (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Current Bid
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${product.auction.currentBid.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400">
                  {product.auction.bidsCount} bids
                </p>
              </div>
              <button className="p-2.5 rounded-xl bg-[#36648F] text-white hover:bg-[#2a5073] transition-colors">
                <Gavel className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                  Price
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </p>
                {product.shipping.free ? (
                  <p className="text-[10px] text-green-600 font-semibold">Free shipping</p>
                ) : (
                  <p className="text-[10px] text-gray-400">
                    +${product.shipping.price} shipping
                  </p>
                )}
              </div>
              <button className="p-2.5 rounded-xl bg-[#36648F] text-white hover:bg-[#2a5073] transition-colors">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.products
      .getFeatured()
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">
                Featured
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Trending Now
            </h2>
            <p className="text-gray-500 mt-1">The most watched items this week</p>
          </div>
          <a
            href="/search?featured=true"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#36648F] hover:text-[#2a5073] transition-colors"
          >
            See All
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#36648F]" />
            <span className="ml-3 text-sm text-gray-400">Loading featured items...</span>
          </div>
        )}

        {/* Empty */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <Flame className="w-10 h-10 text-gray-200 mx-auto" />
            <p className="mt-3 text-gray-400 text-sm">No featured items right now</p>
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
