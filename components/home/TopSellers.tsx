"use client";

import { useState, useEffect } from "react";
import { Star, ShieldCheck, TrendingUp, ExternalLink, Loader2, Trophy, Medal, Award } from "lucide-react";
import { api } from "@/lib/api";
import { Seller } from "@/lib/types";

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-[var(--warning)]", "text-[var(--text-muted)]", "text-amber-700"];

function SellerCard({ seller, rank }: { seller: Seller; rank: number }) {
  const RankIcon = rank < 3 ? rankIcons[rank] : null;

  return (
    <a
      href={`/seller/${seller.username}`}
      className="card flex items-center gap-4 p-4 !rounded-[var(--radius-md)]"
    >
      <div className="w-8 flex-shrink-0 flex justify-center">
        {RankIcon ? (
          <RankIcon className={`w-6 h-6 ${rankColors[rank]}`} />
        ) : (
          <span className="text-sm font-bold text-[var(--text-dim)]">#{rank + 1}</span>
        )}
      </div>
      <div className="w-12 h-12 rounded-full bg-[var(--surface-3)] overflow-hidden flex-shrink-0 ring-2 ring-[var(--border)]">
        <img src={seller.avatar} alt={seller.displayName} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-sm font-semibold text-white truncate group-hover:text-[var(--primary)] transition-colors">
            {seller.displayName}
          </h4>
          {seller.verified && <ShieldCheck className="verified-icon flex-shrink-0" />}
        </div>
        <p className="text-xs text-[var(--text-dim)]">@{seller.username}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Star className="w-3.5 h-3.5 text-[var(--warning)] fill-[var(--warning)]" />
          <span className="text-sm font-bold text-white">{seller.feedbackScore}</span>
        </div>
        <p className="text-[10px] text-[var(--text-dim)] mt-0.5">
          <span className={seller.positivePercent >= 99 ? "text-[var(--success)]" : "text-[var(--warning)]"}>
            {seller.positivePercent}%
          </span>{" "}
          positive
        </p>
        <p className="text-[10px] text-[var(--text-dim)] mt-0.5 flex items-center gap-0.5 justify-end">
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
    api.sellers.getTop().then(setSellers).catch(() => setSellers([])).finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 border-t border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[var(--warning)]" />
              <span className="text-xs font-bold text-[var(--warning)] uppercase tracking-wider">Top Rated</span>
            </div>
            <h2 className="section-title !mb-1">Top Sellers</h2>
            <p className="text-[var(--text-dim)] text-sm">Trusted by the community</p>
          </div>
          <a href="/sellers" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors">
            View All <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
          </div>
        )}
        {!loading && sellers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sellers.map((s, i) => <SellerCard key={s.id} seller={s} rank={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
