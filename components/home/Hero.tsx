"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, Shield, Zap, ArrowRight, ChevronDown, Globe, Lock } from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/lib/types";

export default function Hero() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [trendingSearches] = useState([
    "CryptoPunks",
    "BAYC Ape #412",
    "RTFKT Pod",
    "Azuki Elementals",
    "Pudgy Penguins",
  ]);

  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams({ q: searchQuery });
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    window.location.href = `/search?${params.toString()}`;
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--primary)]/[0.07] rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[var(--accent)]/[0.05] rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Live badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-[var(--border)] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
            </span>
            <span className="text-xs font-medium text-[var(--text-muted)]">
              2,847 items ending soon
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="text-white">Discover, Buy &</span>
          <br />
          <span className="gradient-text">Sell Digital Assets</span>
        </h1>

        <p className="mt-6 text-center text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          The premier decentralized marketplace for NFTs, crypto collectibles,
          and digital goods. Secure, on-chain, trustless.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mt-12 max-w-3xl mx-auto">
          <div className="search-wrapper !rounded-[var(--radius-xl)]">
            <Search className="search-icon w-5 h-5" />
            <div className="absolute left-[52px] top-0 bottom-0 hidden sm:flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="dark-input !border-0 !bg-transparent !p-0 !shadow-none !rounded-none !pl-0 !pr-6 text-sm font-medium text-[var(--text-muted)] appearance-none cursor-pointer"
                style={{ background: "transparent" }}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug} style={{ background: "var(--surface-2)" }}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-dim)] -ml-4 pointer-events-none" />
              <div className="w-px h-6 bg-[var(--border)] ml-3" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NFTs, collectibles, digital art..."
              className="search-bar !pl-14 sm:!pl-44"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 primary-btn !py-2.5 !px-6 !rounded-[var(--radius-lg)] flex items-center gap-2"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[var(--text-dim)]" />
            <span className="text-[var(--text-dim)]">Trending:</span>
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-[var(--text-dim)] hover:text-[var(--primary)] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </form>

        {/* Trust row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {[
            { icon: Lock, label: "Escrow Protected", sub: "Smart contract secured" },
            { icon: Zap, label: "Instant Settlements", sub: "On-chain delivery" },
            { icon: Globe, label: "24/7 Trading", sub: "Global marketplace" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-[var(--border)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-[var(--text-dim)]">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
