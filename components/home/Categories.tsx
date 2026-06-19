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
  Image, Gamepad2, Music, Palette, Gem, Landmark, Shirt, Cpu,
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories
      .getAll()
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title">Browse Categories</h2>
            <p className="text-[var(--text-dim)] text-sm mt-1">
              Explore by type to find what you&apos;re looking for
            </p>
          </div>
          <a
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--accent)] transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Gem;
            return (
              <a
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="card group cursor-pointer"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="product-image !h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 relative z-10">
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-[var(--text-dim)] ml-[42px]">
                      {cat.productCount.toLocaleString()} items
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
