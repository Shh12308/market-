"use client";

import { useState, useEffect } from "react";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Loader2,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import { api } from "@/lib/api";
import { Seller } from "@/lib/types";

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-yellow-500", "text-gray-400", "text-amber-700"];

function SellerCard({ seller, rank }: { seller: Seller; rank: number }) {
  const RankIcon = rank < 3 ? rankIcons[rank] : null;

  return (
    <a
      href={`/seller/${seller.username}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#36648F]/20 hover:shadow-lg transition-all duration-300 bg-white"
    >
      {/* Rank */}
      <div className="w-8 flex-shrink-0 flex justify-center">
        {RankIcon ? (
          <RankIcon className={`w-6 h-6 ${rankColors[rank]}`} />
        ) : (
          <span className="text-sm font-bold text-gray-400">#{rank + 1}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 ring-2 ring-gray-100 group-hover:ring-[#36648F]/20 transition-all">
        <img
          src={seller.avatar}
          alt={seller.displayName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#36648F] transition-colors">
            {seller.displayName}
          </h4>
          {seller.verified && <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-400">@{seller.username}</p>
      </div>

      {/* Stats */}
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-gray-900">{seller.feedbackScore}</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">
          <span
            className={
              seller.positivePercent >= 99
                ? "text-green-600"
                : seller.positivePercent >= 95
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {seller.positivePercent}%
          </span>{" "}
          positive
        </p>
        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5 justify-end">
          <TrendingUp className="w-2.5 h-2.5" />
          {seller.totalSales.toLocaleString()} sales
        </p>
      </div>
    </a>
  );
}

export default function TopSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.sellers
      .getTop()
      .then((data) => setSellers(data))
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">
                Top Rated
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Top Sellers
            </h2>
            <p className="text-gray-500 mt-1">Trusted by the community with highest ratings</p>
          </div>
          <a
            href="/sellers"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#36648F] hover:text-[#2a5073] transition-colors"
          >
            View All
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#36648F]" />
            <span className="ml-3 text-sm text-gray-400">Loading top sellers...</span>
          </div>
        )}

        {!loading && sellers.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-10 h-10 text-gray-200 mx-auto" />
            <p className="mt-3 text-gray-400 text-sm">No seller data available</p>
          </div>
        )}

        {!loading && sellers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sellers.map((seller, i) => (
              <SellerCard key={seller.id} seller={seller} rank={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
