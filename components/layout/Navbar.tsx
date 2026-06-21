"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  Zap,
} from "lucide-react";

export default function Navbar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const navItems: string[] = ["Explore", "Collections", "Auctions", "Drops"];

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight gradient-text">
              myBay
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item}
                href="/"
                className="px-4 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="search-wrapper">
            <Search className="search-icon w-[18px] h-[18px]" />
            <input
              type="text"
              placeholder="Search NFTs, collections, users..."
              className="search-bar !py-2.5 !text-sm !pl-10 !pr-4"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button type="button" className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--danger)] rounded-full" />
          </button>

          <button type="button" className="p-2.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          <button
            type="button"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <img
                src="https://picsum.photos/seed/navuser/100/100.jpg"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2.5 rounded-xl text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border)] px-4 py-4 space-y-1">
          
          {/* Mobile Search */}
          <div className="md:hidden mb-3">
            <div className="search-wrapper">
              <Search className="search-icon w-[18px] h-[18px]" />
              <input
                type="text"
                placeholder="Search..."
                className="search-bar !py-2.5 !text-sm !pl-10 !pr-4"
              />
            </div>
          </div>

          {navItems.concat("Sell").map((item) => (
            <Link
              key={item}
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-all"
            >
              {item}
            </Link>
          ))}

          <div className="pt-3 border-t border-[var(--border)] flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <img
                src="https://picsum.photos/seed/navuser/100/100.jpg"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">shh12308</p>
              <p className="text-xs text-[var(--text-dim)]">View Profile</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
