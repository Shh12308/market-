"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Home, ShoppingCart, Tag, Heart, MessageSquare, Settings,
  Star, MapPin, ShieldCheck, ChevronRight, Loader2,
  AlertTriangle, ExternalLink, Eye, Clock, Gavel,
  X, Zap, Package, TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────
interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  memberSince: string;
  location: string;
  feedbackScore: number;
  positivePercent: number;
  verified: boolean;
  bio: string;
  stats: { totalSales: number; totalPurchases: number; activeListings: number; watchers: number };
}

interface Transaction {
  id: string;
  type: "sale" | "purchase";
  itemTitle: string;
  itemImage: string;
  price: number;
  date: string;
  status: "completed" | "shipped" | "pending" | "cancelled";
  buyerOrSeller: string;
}

interface FeedbackEntry {
  id: string;
  fromUser: string;
  comment: string;
  rating: "positive" | "neutral" | "negative";
  date: string;
  itemTitle: string;
}

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  bids: number;
  watchers: number;
  timeLeft: string;
  status: "active" | "ended" | "sold";
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: Transaction["status"] }) {
  return <span className={`badge status-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

function RatingBadge({ rating }: { rating: FeedbackEntry["rating"] }) {
  const m: Record<string, string> = { positive: "status-completed", neutral: "status-pending", negative: "status-cancelled" };
  const l: Record<string, string> = { positive: "+", neutral: "±", negative: "−" };
  return <span className={`badge ${m[rating]}`}>{l[rating]}</span>;
}

// ─── Skeleton ────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <header className="glass h-14" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block w-60 flex-shrink-0"><div className="dark-skeleton h-[500px]" /></div>
          <div className="flex-1 space-y-6">
            <div className="dark-skeleton h-44" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="dark-skeleton h-24" />)}
            </div>
            <div className="dark-skeleton h-80" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen">
      <header className="glass h-14" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-24 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center text-[var(--danger)] mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
        <p className="text-[var(--text-muted)] mb-6 max-w-md">{message}</p>
        <button onClick={onRetry} className="primary-btn">Try again</button>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────
const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "purchases", label: "Purchases", icon: ShoppingCart },
  { id: "selling", label: "Selling", icon: Tag },
  { id: "watchlist", label: "Watchlist", icon: Heart },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

function Sidebar({ activeTab, onTabChange, feedbackCount }: { activeTab: string; onTabChange: (t: string) => void; feedbackCount: number }) {
  return (
    <nav className="profile-card">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="text-[11px] font-semibold text-[var(--text-dim)] uppercase tracking-wider">Navigation</h3>
      </div>
      <ul className="p-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button onClick={() => onTabChange(item.id)} className={`profile-nav-btn ${activeTab === item.id ? "active" : ""}`}>
                <Icon className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "feedback" && feedbackCount > 0 && (
                  <span className="bg-[var(--primary)] text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {feedbackCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Profile Header ──────────────────────────────────────────
function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <div className="profile-card">
      <div className="h-28 crypto-gradient relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
          <div className="w-20 h-20 rounded-xl border-4 border-[var(--surface)] shadow-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0">
            <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white truncate">{profile.displayName}</h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(6,182,212,0.1)] text-[var(--accent)] text-xs font-semibold border border-[rgba(6,182,212,0.2)]">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-dim)] mt-0.5">@{profile.username}</p>
          </div>
          <button className="secondary-btn !py-2 !px-4 !text-sm flex items-center gap-2 self-start sm:self-end">
            <Settings className="w-4 h-4" /> Edit Profile
          </button>
        </div>
        {profile.bio && <p className="text-sm text-[var(--text-muted)] mt-4 leading-relaxed">{profile.bio}</p>}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-[var(--text-dim)]">
          <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
          <span>Since {profile.memberSince}</span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-[var(--warning)] fill-[var(--warning)]" />
            <span className="font-semibold text-white">{profile.feedbackScore}</span> feedback
          </span>
          <span className="inline-flex items-center gap-1">
            <span className={`font-semibold ${profile.positivePercent >= 99 ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
              {profile.positivePercent}%
            </span> positive
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Stats ───────────────────────────────────────────────────
function StatsGrid({ stats }: { stats: UserProfile["stats"] }) {
  const cards = [
    { label: "Total Sales", value: stats.totalSales, color: "text-[var(--success)]", icon: Tag },
    { label: "Purchases", value: stats.totalPurchases, color: "text-[var(--primary)]", icon: ShoppingCart },
    { label: "Active Listings", value: stats.activeListings, color: "text-[var(--accent)]", icon: Package },
    { label: "Watchers", value: stats.watchers, color: "text-[var(--danger)]", icon: Heart },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="stat-card">
            <Icon className={`w-5 h-5 ${c.color} mb-3`} />
            <p className="text-2xl font-bold text-white">{c.value.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-dim)] mt-0.5">{c.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Overview ────────────────────────────────────────────────
function OverviewTab({ profile, recentTransactions, activeListings }: { profile: UserProfile; recentTransactions: Transaction[]; activeListings: Listing[] }) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={profile.stats} />
      <div className="profile-card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-white">Recent Activity</h2>
          <span className="text-xs text-[var(--text-dim)]">Last 30 days</span>
        </div>
        <div className="divide-y dark-divider">
          {recentTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0">
                <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{tx.itemTitle}</p>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">
                  {tx.type === "sale" ? `Sold to ${tx.buyerOrSeller}` : `Bought from ${tx.buyerOrSeller}`} · {tx.date}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-white">${tx.price.toLocaleString()}</p>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeListings.length > 0 && (
        <div className="profile-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-white">Active Listings</h2>
            <span className="text-xs font-medium text-[var(--primary)]">{activeListings.length} items</span>
          </div>
          <div className="product-grid !gap-4 p-4">
            {activeListings.slice(0, 4).map((item) => (
              <div key={item.id} className="card cursor-pointer">
                <div className="aspect-square overflow-hidden relative">
                  <img src={item.image} alt="" className="product-image !h-full" />
                  <span className="absolute bottom-2 left-2 badge bg-black/50 text-white/80 border border-transparent backdrop-blur-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />{item.timeLeft}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <p className="price !text-base mt-1">${item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Purchases ───────────────────────────────────────────────
function PurchasesTab({ transactions }: { transactions: Transaction[] }) {
  const purchases = transactions.filter((t) => t.type === "purchase");
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? purchases : purchases.filter((t) => t.status === filter);
  return (
    <div className="profile-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[var(--border)] gap-3">
        <h2 className="font-semibold text-white">Purchase History</h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "completed", "shipped", "pending", "cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filter === f
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                  : "bg-transparent text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-white"
              }`}
            >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-dim)]">
          <ShoppingCart className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">No purchases found</p>
        </div>
      ) : (
        <div className="divide-y dark-divider">
          {filtered.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0">
                <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{tx.itemTitle}</p>
                <p className="text-xs text-[var(--text-dim)] mt-1">From {tx.buyerOrSeller} · {tx.date}</p>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">Order #{tx.id}</p>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                <p className="text-base font-bold text-white">${tx.price.toLocaleString()}</p>
                <StatusBadge status={tx.status} />
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-dim)] flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Selling ─────────────────────────────────────────────────
function SellingTab({ transactions, listings }: { transactions: Transaction[]; listings: Listing[] }) {
  const sales = transactions.filter((t) => t.type === "sale");
  const revenue = sales.filter((s) => s.status === "completed" || s.status === "shipped").reduce((a, s) => a + s.price, 0);
  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Listings", value: activeCount, color: "text-[var(--accent)]" },
          { label: "Total Sold", value: sales.length, color: "text-[var(--success)]" },
          { label: "Revenue", value: `$${revenue.toLocaleString()}`, color: "text-white" },
        ].map((c) => (
          <div key={c.label} className="stat-card">
            <p className="text-[11px] text-[var(--text-dim)] uppercase tracking-wider font-semibold">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {activeCount > 0 && (
        <div className="profile-card">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-white">Active Listings</h2>
          </div>
          <div className="product-grid !gap-4 p-4">
            {listings.filter((l) => l.status === "active").map((item) => (
              <div key={item.id} className="card cursor-pointer">
                <div className="aspect-square overflow-hidden relative">
                  <img src={item.image} alt="" className="product-image !h-full" />
                  <span className="absolute bottom-2 left-2 badge bg-black/50 text-white/80 border border-transparent backdrop-blur-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />{item.timeLeft}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="price !text-base">${item.price.toLocaleString()}</p>
                    {item.bids > 0 && <span className="text-xs text-[var(--text-dim)] flex items-center gap-0.5"><Gavel className="w-3 h-3" />{item.bids}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="profile-card">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-white">Recent Sales</h2>
        </div>
        {sales.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-dim)]">
            <Tag className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No sales yet</p>
          </div>
        ) : (
          <div className="divide-y dark-divider">
            {sales.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="w-14 h-14 rounded-lg bg-[var(--surface-2)] overflow-hidden flex-shrink-0">
                  <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.itemTitle}</p>
                  <p className="text-xs text-[var(--text-dim)] mt-0.5">Buyer: {tx.buyerOrSeller} · {tx.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-[var(--success)]">+${tx.price.toLocaleString()}</p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Watchlist ───────────────────────────────────────────────
function WatchlistTab({ listings }: { listings: Listing[] }) {
  const [items, setItems] = useState(listings);
  const removeItem = (id: string) => setItems((p) => p.filter((l) => l.id !== id));

  return (
    <div className="profile-card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-white">Watchlist</h2>
        <span className="text-xs font-medium text-[var(--primary)]">{items.length} items</span>
      </div>
      {items.length === 0 ? (
        <div className="py-16 text-center text-[var(--text-dim)]">
          <Heart className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">Your watchlist is empty</p>
          <a href="/" className="inline-flex items-center gap-1 text-sm text-[var(--primary)] font-medium mt-2 hover:underline">
            Browse marketplace <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <div className="product-grid !gap-4 p-4">
          {items.map((item) => (
            <div key={item.id} className="card">
              <div className="aspect-square bg-[var(--surface-2)] overflow-hidden relative">
                <img src={item.image} alt="" className="product-image !h-full" />
                <button onClick={() => removeItem(item.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-[var(--danger)] hover:bg-black/70 transition-all z-10">
                  <X className="w-4 h-4" />
                </button>
                {item.status === "sold" && <span className="absolute top-2 left-2 badge bg-[rgba(239,68,68,0.2)] text-[var(--danger)] border border-[rgba(239,68,68,0.3)] font-bold uppercase z-10">Sold</span>}
                {item.status === "ended" && <span className="absolute top-2 left-2 badge bg-white/10 text-[var(--text-dim)] border border-[var(--border)] font-bold uppercase z-10">Ended</span>}
                {item.status === "active" && <span className="absolute bottom-2 left-2 badge bg-black/50 text-white/80 border border-transparent backdrop-blur-sm flex items-center gap-1 z-10"><Clock className="w-3 h-3" />{item.timeLeft}</span>}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="price !text-base">${item.price.toLocaleString()}</p>
                  {item.bids > 0 && <span className="text-xs text-[var(--text-dim)]">{item.bids} bids</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Feedback ────────────────────────────────────────────────
function FeedbackTab({ feedback, profile }: { feedback: FeedbackEntry[]; profile: UserProfile }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? feedback : feedback.filter((f) => f.rating === filter);
  const pos = feedback.filter((f) => f.rating === "positive").length;
  const neu = feedback.filter((f) => f.rating === "neutral").length;
  const neg = feedback.filter((f) => f.rating === "negative").length;
  const total = feedback.length;

  return (
    <div className="space-y-6">
      <div className="profile-card p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-3)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={profile.positivePercent >= 99 ? "var(--success)" : "var(--warning)"} strokeWidth="8" strokeDasharray={`${(profile.positivePercent / 100) * 326.73} 326.73`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{profile.positivePercent}%</span>
                <span className="text-[10px] text-[var(--text-dim)]">positive</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-white mt-2">{profile.feedbackScore} score</p>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: "Positive", count: pos, color: "bg-[var(--success)]", tc: "text-[var(--success)]" },
              { label: "Neutral", count: neu, color: "bg-[var(--warning)]", tc: "text-[var(--warning)]" },
              { label: "Negative", count: neg, color: "bg-[var(--danger)]", tc: "text-[var(--danger)]" },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className={`text-sm font-medium ${r.tc} w-20`}>{r.label}</span>
                <div className="flex-1 h-3 bg-[var(--surface-3)] rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: total > 0 ? `${(r.count / total) * 100}%` : "0%" }} />
                </div>
                <span className="text-sm text-[var(--text-dim)] w-12 text-right">{r.count}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium text-[var(--text-muted)] w-20">Total</span>
              <div className="flex-1" />
              <span className="text-sm font-semibold text-white w-12 text-right">{total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-[var(--border)] gap-3">
          <h2 className="font-semibold text-white">Feedback Comments</h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "positive", "neutral", "negative"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filter === f
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30"
                    : "bg-transparent text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--border-hover)] hover:text-white"
                }`}
              >{f.charAt(0).toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-dim)]">
            <MessageSquare className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No feedback found</p>
          </div>
        ) : (
          <div className="divide-y dark-divider">
            {filtered.map((fb) => (
              <div key={fb.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{fb.fromUser}</span>
                    <RatingBadge rating={fb.rating} />
                  </div>
                  <span className="text-xs text-[var(--text-dim)]">{fb.date}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)]">{fb.comment}</p>
                <p className="text-xs text-[var(--text-dim)] mt-1">Item: {fb.itemTitle}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────────────
function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="profile-card">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-white">Account Settings</h2>
        </div>
        <div className="divide-y dark-divider">
          {[
            { label: "Personal Information", desc: "Name, email, phone number", action: "Edit" },
            { label: "Address Book", desc: "Shipping and billing addresses", action: "Manage" },
            { label: "Payment Methods", desc: "Cards, wallets, crypto addresses", action: "Manage" },
            { label: "Security", desc: "Password, 2FA, login activity", action: "Update" },
            { label: "Notification Preferences", desc: "Email, push, SMS alerts", action: "Configure" },
            { label: "Privacy Settings", desc: "Profile visibility and activity", action: "Adjust" },
            { label: "Selling Preferences", desc: "Defaults for new listings", action: "Edit" },
            { label: "Connected Wallets", desc: "Manage blockchain wallet connections", action: "Manage" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors text-left">
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-[var(--text-dim)] mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-[var(--primary)]">{item.action}</span>
                <ChevronRight className="w-4 h-4 text-[var(--primary)]" />
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="profile-card !border-[rgba(239,68,68,0.2)]">
        <div className="px-6 py-4 border-b border-[rgba(239,68,68,0.15)]">
          <h2 className="font-semibold text-[var(--danger)]">Danger Zone</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-[var(--text-muted)] mb-4">Once you deactivate your account, there is no going back. All data, listings, and feedback will be permanently removed.</p>
          <button className="px-4 py-2 border border-[rgba(239,68,68,0.3)] text-[var(--danger)] rounded-[var(--radius-md)] text-sm font-medium hover:bg-[rgba(239,68,68,0.1)] transition-colors">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────
export default function Profile() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, t, f, l] = await Promise.all([
        fetchJSON<UserProfile>(`/api/users/${username}/profile`),
        fetchJSON<Transaction[]>(`/api/users/${username}/transactions`),
        fetchJSON<FeedbackEntry[]>(`/api/users/${username}/feedback`),
        fetchJSON<Listing[]>(`/api/users/${username}/listings`),
      ]);
      setProfile(p); setTransactions(t); setFeedback(f); setListings(l);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { if (username) fetchData(); }, [username, fetchData]);

  if (loading) return <ProfileSkeleton />;
  if (error || !profile) return <ErrorState message={error || "Profile not found"} onRetry={fetchData} />;

  const activeListings = listings.filter((l) => l.status === "active");

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg crypto-gradient flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">myBay</span>
            </a>
            <span className="text-[var(--border)]">|</span>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-[var(--text-dim)]">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span className="text-[var(--primary)] font-medium">My Account</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[var(--text-dim)] hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[var(--danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="lg:hidden glass border-b border-[var(--border)] overflow-x-auto">
        <div className="flex min-w-max px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--text-dim)] hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />{item.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} feedbackCount={feedback.length} />
            </div>
          </aside>
          <div className="flex-1 min-w-0 space-y-6">
            <ProfileHeader profile={profile} />
            {activeTab === "overview" && <OverviewTab profile={profile} recentTransactions={transactions} activeListings={activeListings} />}
            {activeTab === "purchases" && <PurchasesTab transactions={transactions} />}
            {activeTab === "selling" && <SellingTab transactions={transactions} listings={listings} />}
            {activeTab === "watchlist" && <WatchlistTab listings={activeListings} />}
            {activeTab === "feedback" && <FeedbackTab feedback={feedback} profile={profile} />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-dim)]">
            <p>© 2025 myBay Inc. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Tag,
  Heart,
  MessageSquare,
  Settings,
  Star,
  MapPin,
  ShieldCheck,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Eye,
  Clock,
  Gavel,
  Flame,
  Sparkles,
  Package,
  TrendingUp,
  X,
} from "lucide-react";

// ─── Types (matches API responses exactly) ───────────────────
interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  memberSince: string;
  location: string;
  feedbackScore: number;
  positivePercent: number;
  verified: boolean;
  bio: string;
  stats: {
    totalSales: number;
    totalPurchases: number;
    activeListings: number;
    watchers: number;
  };
}

interface Transaction {
  id: string;
  type: "sale" | "purchase";
  itemTitle: string;
  itemImage: string;
  price: number;
  date: string;
  status: "completed" | "shipped" | "pending" | "cancelled";
  buyerOrSeller: string;
}

interface FeedbackEntry {
  id: string;
  fromUser: string;
  comment: string;
  rating: "positive" | "neutral" | "negative";
  date: string;
  itemTitle: string;
}

interface Listing {
  id: string;
  title: string;
  image: string;
  price: number;
  bids: number;
  watchers: number;
  timeLeft: string;
  status: "active" | "ended" | "sold";
}

// ─── Fetch helper ────────────────────────────────────────────
async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: Transaction["status"] }) {
  const styles: Record<string, string> = {
    completed: "bg-green-50 text-green-700 border-green-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Rating Badge ────────────────────────────────────────────
function RatingBadge({ rating }: { rating: FeedbackEntry["rating"] }) {
  const styles: Record<string, string> = {
    positive: "bg-green-50 text-green-700 border-green-200",
    neutral: "bg-yellow-50 text-yellow-700 border-yellow-200",
    negative: "bg-red-50 text-red-700 border-red-200",
  };
  const labels: Record<string, string> = {
    positive: "+",
    neutral: "±",
    negative: "−",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${styles[rating]}`}
    >
      {labels[rating]}
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="h-14 bg-white border-b border-gray-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block w-60 flex-shrink-0">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
          <div className="flex-1 space-y-6">
            <Skeleton className="h-44 w-full rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────
function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="h-14 bg-white border-b border-gray-200" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 mb-6 max-w-md">{message}</p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-[#36648F] text-white rounded-lg hover:bg-[#2a5073] transition-colors font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Nav items ───────────────────────────────────────────────
const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "purchases", label: "Purchases", icon: ShoppingCart },
  { id: "selling", label: "Selling", icon: Tag },
  { id: "watchlist", label: "Watchlist", icon: Heart },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Sidebar ─────────────────────────────────────────────────
function Sidebar({
  activeTab,
  onTabChange,
  feedbackCount,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  feedbackCount: number;
}) {
  return (
    <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Navigation
        </h3>
      </div>
      <ul className="p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#36648F]/10 text-[#36648F]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "feedback" && feedbackCount > 0 && (
                  <span className="bg-[#36648F] text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {feedbackCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Profile Header ──────────────────────────────────────────
function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-[#36648F] via-[#4a7fa8] to-[#6b9fc4] relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
          <div className="w-20 h-20 rounded-xl border-4 border-white shadow-lg bg-white overflow-hidden flex-shrink-0">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {profile.displayName}
              </h1>
              {profile.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-200">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              @{profile.username}
            </p>
          </div>
          <button className="self-start sm:self-end px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
        {profile.bio && (
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            {profile.bio}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {profile.location}
          </span>
          <span>Member since {profile.memberSince}</span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-gray-900">
              {profile.feedbackScore}
            </span>{" "}
            feedback
          </span>
          <span className="inline-flex items-center gap-1">
            <span
              className={`font-semibold ${
                profile.positivePercent >= 99
                  ? "text-green-600"
                  : profile.positivePercent >= 95
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {profile.positivePercent}%
            </span>{" "}
            positive
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Grid ──────────────────────────────────────────────
function StatsGrid({ stats }: { stats: UserProfile["stats"] }) {
  const cards = [
    {
      label: "Total Sales",
      value: stats.totalSales,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: Tag,
    },
    {
      label: "Purchases",
      value: stats.totalPurchases,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: ShoppingCart,
    },
    {
      label: "Active Listings",
      value: stats.activeListings,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: Package,
    },
    {
      label: "Watchers",
      value: stats.watchers,
      color: "text-rose-600",
      bg: "bg-rose-50",
      icon: Heart,
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color} mb-3`}
            >
              <Icon className="w-[18px] h-[18px]" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {card.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────
function OverviewTab({
  profile,
  recentTransactions,
  activeListings,
}: {
  profile: UserProfile;
  recentTransactions: Transaction[];
  activeListings: Listing[];
}) {
  return (
    <div className="space-y-6">
      <StatsGrid stats={profile.stats} />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTransactions.slice(0, 5).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={tx.itemImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {tx.itemTitle}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {tx.type === "sale"
                    ? `Sold to ${tx.buyerOrSeller}`
                    : `Bought from ${tx.buyerOrSeller}`}
                  {" · "}
                  {tx.date}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  ${tx.price.toLocaleString()}
                </p>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeListings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Active Listings</h2>
            <span className="text-xs font-medium text-[#36648F]">
              {activeListings.length} items
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {activeListings.slice(0, 4).map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={item.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">
                  ${item.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {item.timeLeft}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Purchases Tab ───────────────────────────────────────────
function PurchasesTab({ transactions }: { transactions: Transaction[] }) {
  const purchases = transactions.filter((t) => t.type === "purchase");
  const [filter, setFilter] = useState<string>("all");
  const filtered =
    filter === "all" ? purchases : purchases.filter((t) => t.status === filter);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
        <h2 className="font-semibold text-gray-900">Purchase History</h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "completed", "shipped", "pending", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[#36648F] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <ShoppingCart className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">No purchases found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={tx.itemImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {tx.itemTitle}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {tx.buyerOrSeller} · {tx.date}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Order #{tx.id}
                </p>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                <p className="text-base font-bold text-gray-900">
                  ${tx.price.toLocaleString()}
                </p>
                <StatusBadge status={tx.status} />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Selling Tab ─────────────────────────────────────────────
function SellingTab({
  transactions,
  listings,
}: {
  transactions: Transaction[];
  listings: Listing[];
}) {
  const sales = transactions.filter((t) => t.type === "sale");
  const totalRevenue = sales
    .filter((s) => s.status === "completed" || s.status === "shipped")
    .reduce((sum, s) => sum + s.price, 0);
  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
            Active Listings
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
            Total Sold
          </p>
          <p className="text-3xl font-bold text-green-600 mt-1">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
            Revenue
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Active listings grid */}
      {activeCount > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Your Active Listings</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {listings
              .filter((l) => l.status === "active")
              .map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 relative">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded font-medium">
                      <Clock className="w-3 h-3" />
                      {item.timeLeft}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold text-gray-900">
                      ${item.price.toLocaleString()}
                    </p>
                    {item.bids > 0 && (
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Gavel className="w-3 h-3" />
                        {item.bids}
                      </span>
                    )}
                  </div>
                  {item.watchers > 0 && (
                    <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <Eye className="w-3 h-3" />
                      {item.watchers} watching
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Sales history */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Sales</h2>
        </div>
        {sales.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No sales yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sales.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={tx.itemImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {tx.itemTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Buyer: {tx.buyerOrSeller} · {tx.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-green-600">
                    +${tx.price.toLocaleString()}
                  </p>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Watchlist Tab ───────────────────────────────────────────
function WatchlistTab({ listings }: { listings: Listing[] }) {
  const [items, setItems] = useState(listings);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Watchlist</h2>
        <span className="text-xs font-medium text-[#36648F]">
          {items.length} items
        </span>
      </div>
      {items.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Heart className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm">Your watchlist is empty</p>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#36648F] font-medium mt-2 hover:underline"
          >
            Browse marketplace <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white shadow-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {item.status === "active" && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded font-medium">
                    {item.timeLeft}
                  </span>
                )}
                {item.status === "sold" && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] rounded font-bold uppercase">
                    Sold
                  </span>
                )}
                {item.status === "ended" && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-gray-600 text-white text-[10px] rounded font-bold uppercase">
                    Ended
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-base font-bold text-gray-900">
                    ${item.price.toLocaleString()}
                  </p>
                  {item.bids > 0 && (
                    <span className="text-xs text-gray-500">{item.bids} bids</span>
                  )}
                </div>
                {item.watchers > 0 && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {item.watchers} watchers
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Feedback Tab ────────────────────────────────────────────
function FeedbackTab({
  feedback,
  profile,
}: {
  feedback: FeedbackEntry[];
  profile: UserProfile;
}) {
  const [filter, setFilter] = useState<string>("all");
  const filtered =
    filter === "all" ? feedback : feedback.filter((f) => f.rating === filter);

  const positive = feedback.filter((f) => f.rating === "positive").length;
  const neutral = feedback.filter((f) => f.rating === "neutral").length;
  const negative = feedback.filter((f) => f.rating === "negative").length;
  const total = feedback.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    profile.positivePercent >= 99
                      ? "#16a34a"
                      : profile.positivePercent >= 95
                      ? "#eab308"
                      : "#dc2626"
                  }
                  strokeWidth="8"
                  strokeDasharray={`${
                    (profile.positivePercent / 100) * 326.73
                  } 326.73`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {profile.positivePercent}%
                </span>
                <span className="text-[10px] text-gray-400">positive</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-2">
              {profile.feedbackScore} score
            </p>
          </div>
          <div className="flex-1 space-y-3">
            {[
              {
                label: "Positive",
                count: positive,
                color: "bg-green-500",
                textColor: "text-green-700",
              },
              {
                label: "Neutral",
                count: neutral,
                color: "bg-yellow-500",
                textColor: "text-yellow-700",
              },
              {
                label: "Negative",
                count: negative,
                color: "bg-red-500",
                textColor: "text-red-700",
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${row.textColor} w-20`}
                >
                  {row.label}
                </span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-500`}
                    style={{
                      width:
                        total > 0
                          ? `${(row.count / total) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {row.count}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium text-gray-700 w-20">
                Total
              </span>
              <div className="flex-1" />
              <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                {total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
          <h2 className="font-semibold text-gray-900">Feedback Comments</h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "positive", "neutral", "negative"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-[#36648F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <MessageSquare className="w-10 h-10 mx-auto mb-2" />
            <p className="text-sm">No feedback found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((fb) => (
              <div key={fb.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {fb.fromUser}
                    </span>
                    <RatingBadge rating={fb.rating} />
                  </div>
                  <span className="text-xs text-gray-400">{fb.date}</span>
                </div>
                <p className="text-sm text-gray-600">{fb.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Item: {fb.itemTitle}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────
function SettingsTab({ profile }: { profile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Account Settings</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            {
              label: "Personal Information",
              desc: "Name, email, phone number",
              action: "Edit",
            },
            {
              label: "Address Book",
              desc: "Shipping and billing addresses",
              action: "Manage",
            },
            {
              label: "Payment Methods",
              desc: "Cards, wallets, crypto addresses",
              action: "Manage",
            },
            {
              label: "Security",
              desc: "Password, 2FA, login activity",
              action: "Update",
            },
            {
              label: "Notification Preferences",
              desc: "Email, push, SMS alerts",
              action: "Configure",
            },
            {
              label: "Privacy Settings",
              desc: "Profile visibility and activity",
              action: "Adjust",
            },
            {
              label: "Selling Preferences",
              desc: "Defaults for new listings",
              action: "Edit",
            },
            {
              label: "Connected Wallets",
              desc: "Manage blockchain wallet connections",
              action: "Manage",
            },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-[#36648F]">
                  {item.action}
                </span>
                <ChevronRight className="w-4 h-4 text-[#36648F]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200">
        <div className="px-6 py-4 border-b border-red-100">
          <h2 className="font-semibold text-red-700">Danger Zone</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Once you deactivate your account, there is no going back. All your
            data, listings, and feedback will be permanently removed.
          </p>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Profile Component ──────────────────────────────────
export default function Profile() {
  const params = useParams();
  const username = params.username as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileData, txData, fbData, listData] = await Promise.all([
        fetchJSON<UserProfile>(`/api/users/${username}/profile`),
        fetchJSON<Transaction[]>(`/api/users/${username}/transactions`),
        fetchJSON<FeedbackEntry[]>(`/api/users/${username}/feedback`),
        fetchJSON<Listing[]>(`/api/users/${username}/listings`),
      ]);
      setProfile(profileData);
      setTransactions(txData);
      setFeedback(fbData);
      setListings(listData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) fetchData();
  }, [username, fetchData]);

  if (loading) return <ProfileSkeleton />;
  if (error || !profile)
    return <ErrorState message={error || "Profile not found"} onRetry={fetchData} />;

  const activeListings = listings.filter((l) => l.status === "active");

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-[#36648F] tracking-tight">
              myBay
            </a>
            <span className="text-gray-300">|</span>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-900 transition-colors">
                Home
              </a>
              <span className="text-[#36648F] font-medium">My Account</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
              <img
                src={profile.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === item.id
                    ? "border-[#36648F] text-[#36648F]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                feedbackCount={feedback.length}
              />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <ProfileHeader profile={profile} />

            {activeTab === "overview" && (
              <OverviewTab
                profile={profile}
                recentTransactions={transactions}
                activeListings={activeListings}
              />
            )}
            {activeTab === "purchases" && (
              <PurchasesTab transactions={transactions} />
            )}
            {activeTab === "selling" && (
              <SellingTab transactions={transactions} listings={listings} />
            )}
            {activeTab === "watchlist" && <WatchlistTab listings={activeListings} />}
            {activeTab === "feedback" && (
              <FeedbackTab feedback={feedback} profile={profile} />
            )}
            {activeTab === "settings" && <SettingsTab profile={profile} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2025 myBay Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/" className="hover:text-gray-600 transition-colors">
                Privacy
              </a>
              <a href="/" className="hover:text-gray-600 transition-colors">
                Terms
              </a>
              <a href="/" className="hover:text-gray-600 transition-colors">
                Help & Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
