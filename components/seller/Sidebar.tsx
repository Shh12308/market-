'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Wallet, 
  BarChart3, 
  AlertCircle, 
  Settings,
  Store
} from 'lucide-react';

const menuItems = [
  { href: '/seller', icon: LayoutDashboard, label: 'Overview' },
  { href: '/seller/products', icon: Package, label: 'Products' },
  { href: '/seller/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/seller/wallets', icon: Wallet, label: 'Wallets' },
  { href: '/seller/payouts', icon: DollarSign, label: 'Payouts' },
  { href: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/seller/disputes', icon: AlertCircle, label: 'Disputes' },
  { href: '/seller/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[var(--border)] bg-[var(--background)] z-50 flex flex-col">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">NEXUS<span className="text-[var(--primary)]">MARKET</span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary-glow)]'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-2)]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-[var(--primary)]'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border border-[var(--border)]"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Alex Seller</p>
            <p className="text-xs text-[var(--text-muted)] truncate">Premium Tier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
