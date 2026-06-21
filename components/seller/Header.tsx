'use client';

import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type HeaderProps = {
  onMenuToggle: () => void;
};

export default function Header({ onMenuToggle }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[var(--border)] glass-strong flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-3)] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4 lg:mx-auto">
          <div className="input-with-icon">
            <Search className="input-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, listings, buyers..."
              className="!h-9 !py-0 !text-sm !pl-10 !pr-4 !rounded-lg"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 ml-4">
          {/* Notifications */}
          <button className="notification-btn">
            <Bell className="w-[18px] h-[18px]" />
            <span className="notification-badge">3</span>
          </button>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-[var(--surface-3)] transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                N
              </div>
              <span className="hidden md:block text-sm font-medium text-[var(--text-secondary)]">
                NexusStore
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)]" />
            </button>

            {profileOpen && (
              <div className="dropdown-menu right-0 w-52 mt-2">
                <button className="dropdown-item">My Store</button>
                <button className="dropdown-item">Store Settings</button>
                <button className="dropdown-item">Billing</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
