"use client";

import { useState, useEffect } from "react";
import {
  Image,
  Gamepad2,
  Music,
  Palette,
  Gem,
  Landmark,
  Shirt,
  Cpu,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Category } from "@/lib/types";

const iconMap: Record<string, React.ElementType> = {
  Image,
  Gamepad2,
  Music,
  Palette,
  Gem,
  Landmark,
  Shirt,
  Cpu,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    api.categories
      .getAll()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#36648F]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Browse Categories
            </h2>
            <p className="text-gray-500 mt-1">Explore by type to find what you&apos;re looking for</p>
          </div>
          <a
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#36648F] hover:text-[#2a5073] transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Gem;
            const isHovered = hoveredId === cat.id;
            return (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 hover:border-[#36648F]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {/* Background image */}
                <div className="aspect-[4/3] relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 transition-colors duration-300 ${
                      isHovered
                        ? "bg-gradient-to-t from-[#0B1221]/90 via-[#0B1221]/40 to-transparent"
                        : "bg-gradient-to-t from-[#0B1221]/70 via-[#0B1221]/20 to-transparent"
                    }`}
                  />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          isHovered ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-white/60 ml-[42px]">
                      {cat.productCount.toLocaleString()} items
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden mt-6 text-center">
          <a
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#36648F]"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
