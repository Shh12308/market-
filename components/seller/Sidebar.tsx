'use client';

import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  BarChart3,
  CreditCard,
  Landmark,
  Settings,
  FileText,
  Store,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const navSections = [
  {
    title: 'SELLER',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
      { icon: Package, label: 'Listings', href: '/seller/listings', badge: 47 },
      { icon: ShoppingBag, label: 'Orders', href: '/seller/orders', badge: 12 },
      { icon: MessageSquare, label: 'Messages', href: '/seller/messages', badge: 3 },
      { icon: BarChart3, label: 'Analytics', href: '/seller/analytics' },
    ],
  },
  {
    title: 'PAYMENTS',
    items: [
      { icon: CreditCard, label: 'Revenue', href: '/seller/revenue' },
      { icon: Landmark, label: 'Payouts', href: '/seller/payouts' },
      { icon: CreditCard, label: 'Bank Accounts', href: '/seller/bank-accounts' },
    ],
  },
  {
    title: 'STORE',
    items: [
      { icon: Store, label: 'Store Settings', href: '/seller/settings' },
      { icon: FileText, label: 'Policies', href: '/seller/policies' },
      { icon: Settings, label: 'Account Settings', href: '/seller/account' },
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
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold text-white text-sm tracking-tight">
              myBay
            </span>
          </Link>

          <button
            onClick={onToggle}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--surface-3)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section) => (
            <div key={section.title} className="mb-6">
              <div className="px-3 mb-2 text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
                {section.title}
              </div>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`profile-nav-btn ${
                        isActive ? 'active' : ''
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px]" />
                      <span className="flex-1">{item.label}</span>

                      {item.badge && (
                        <span className="text-[11px] font-bold min-w-[20px] text-center px-1.5 py-0.5 rounded-md bg-[var(--primary-muted)] text-[var(--primary)]">
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

        {/* Seller Summary */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="text-[11px] uppercase tracking-wider text-[var(--text-faint)] font-semibold mb-2">
              Seller Balance
            </div>

            <div className="text-2xl font-bold text-white">
              $12,450.00
            </div>

            <div className="text-sm text-[var(--text-muted)] mt-1">
              Available for payout
            </div>

            <button className="w-full mt-4 primary-btn">
              Withdraw Funds
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
