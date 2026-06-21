'use client';

import {
  LayoutDashboard, Package, ShoppingBag, MessageSquare, BarChart3,
  Wallet, ArrowDownToLine, Settings, FileText, LogOut,
  ChevronLeft, Zap, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ✅ FIX: proper prop typing
type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const navSections = [
  {
    title: 'MAIN',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
      { icon: Package, label: 'Listings', href: '/seller/listings', badge: 47 },
      { icon: ShoppingBag, label: 'Orders', href: '/seller/orders', badge: 12 },
      { icon: MessageSquare, label: 'Messages', href: '/seller/messages', badge: 3 },
      { icon: BarChart3, label: 'Analytics', href: '/seller/analytics' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { icon: Wallet, label: 'Revenue', href: '/seller/revenue' },
      { icon: ArrowDownToLine, label: 'Payouts', href: '/seller/payouts' },
      { icon: Zap, label: 'Wallet', href: '/seller/wallet' },
    ],
  },
  {
    title: 'STORE',
    items: [
      { icon: Settings, label: 'Settings', href: '/seller/settings' },
      { icon: FileText, label: 'Policies', href: '/seller/policies' },
    ],
  },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50
          bg-[var(--surface)] border-r border-[var(--border)]
          flex flex-col
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)] flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              Nexus<span className="text-[var(--primary)]">Market</span>
            </span>
          </Link>

          <button
            onClick={onToggle}
            className="lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-dim)] hover:text-white hover:bg-[var(--surface-3)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="px-3 mb-2 text-[0.65rem] font-bold text-[var(--text-faint)] tracking-[0.08em] uppercase">
                {section.title}
              </div>

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`profile-nav-btn ${isActive ? 'active' : ''}`}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <span className="text-[0.65rem] font-bold min-w-[20px] text-center px-1.5 py-0.5 rounded-md bg-[var(--primary-muted)] text-[var(--primary)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Wallet Card */}
        <div className="p-3 border-t border-[var(--border)] flex-shrink-0">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(34,211,238,0.03)] border border-[rgba(99,102,241,0.12)]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[0.65rem] font-bold text-[var(--text-faint)] tracking-[0.06em] uppercase">
                Wallet
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_6px_var(--success-glow)]" />
                <span className="text-[0.65rem] font-semibold text-[var(--success)]">
                  Connected
                </span>
              </span>
            </div>

            <div className="font-mono text-[0.78rem] text-[var(--text-dim)] mb-1.5 tracking-wide">
              0x7a3d...f4e2
            </div>

            <div className="text-lg font-bold text-white leading-tight">
              2.45 ETH
            </div>

            <div className="text-[0.72rem] text-[var(--text-faint)] mt-0.5">
              ≈ $8,234.50
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
