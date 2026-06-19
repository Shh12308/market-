"use client";

import { useState, useEffect } from "react";
import { Search, TrendingUp, Shield, Zap, ArrowRight, ChevronDown } from "lucide-react";
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
    api.categories
      .getAll()
      .then(setCategories)
      .catch(() => {});
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1221] via-[#132038] to-[#0B1221]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#36648F]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-medium text-gray-300">
              Live auctions · 2,847 items ending soon
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
          Discover, Buy & Sell
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Digital Assets
          </span>
        </h1>

        <p className="mt-5 text-center text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The premier marketplace for NFTs, crypto collectibles, and digital goods.
          Secure transactions powered by blockchain.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-10 max-w-3xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Category dropdown */}
            <div className="relative hidden sm:block">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none h-full pl-4 pr-10 py-4 bg-gray-50 border-r border-gray-200 text-sm font-medium text-gray-700 cursor-pointer focus:outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4 sm:ml-5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for NFTs, collectibles, digital art..."
                className="flex-1 px-4 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="m-2 px-6 sm:px-8 py-2.5 bg-[#36648F] hover:bg-[#2a5073] text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trending */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500">Trending:</span>
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </form>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: Shield, label: "Escrow Protected", sub: "Secure payments" },
            { icon: Zap, label: "Instant Transfers", sub: "On-chain delivery" },
            { icon: TrendingUp, label: "24/7 Trading", sub: "Global marketplace" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
