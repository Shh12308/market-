'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Search */}
        <div className="flex-1 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
          <input
            type="text"
            placeholder="Search orders, products, or customers..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-full py-2.5 pl-11 pr-4 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-[var(--text-dim)]"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors">
            <Bell className="w-5 h-5 text-[var(--text-muted)]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full border-2 border-[var(--background)]"></span>
          </button>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse"></div>
            <span className="text-xs font-semibold text-[var(--success)]">System Operational</span>
          </div>

          {/* Profile / Dropdown */}
          <div className="flex items-center gap-3 pl-6 border-l border-[var(--border)] cursor-pointer hover:opacity-80 transition-opacity">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">Store: CryptoGoods</p>
              <p className="text-xs text-[var(--primary)] font-medium">+12.5% this week</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
        </div>
      </div>
    </header>
  );
}
