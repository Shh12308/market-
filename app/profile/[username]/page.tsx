"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

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

// ─── API Client ──────────────────────────────────────────────
const API_BASE = "/api";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// ─── Icons ───────────────────────────────────────────────────
function IconHome({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
function IconPurchase({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}
function IconSell({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  );
}
function IconStar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
    </svg>
  );
}
function IconStarOutline({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}
function IconWatch({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}
function IconFeedback({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}
function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconLocation({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}
function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
function IconLoading({ className = "animate-spin w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
function IconAlert({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Feedback Rating Stars ───────────────────────────────────
function RatingBadge({ rating }: { rating: FeedbackEntry["rating"] }) {
  const styles: Record<string, string> = {
    positive: "bg-green-50 text-green-700 border-green-200",
    neutral: "bg-yellow-50 text-yellow-700 border-yellow-200",
    negative: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${styles[rating]}`}>
      {rating === "positive" ? "+" : rating === "negative" ? "−" : "±"}
    </span>
  );
}

// ─── Skeleton Loader ─────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
        <div className="flex-1 space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <IconAlert />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6 max-w-md">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#36648F] text-white rounded-lg hover:bg-[#2a5073] transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar Navigation ──────────────────────────────────────
const navItems = [
  { id: "overview", label: "Overview", icon: IconHome },
  { id: "purchases", label: "Purchase History", icon: IconPurchase },
  { id: "selling", label: "Selling", icon: IconSell },
  { id: "watchlist", label: "Watchlist", icon: IconWatch },
  { id: "feedback", label: "Feedback", icon: IconFeedback },
  { id: "settings", label: "Settings", icon: IconSettings },
];

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
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h3>
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
                <Icon />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === "feedback" && feedbackCount > 0 && (
                  <span className="bg-[#36648F] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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

// ─── Profile Header Card ─────────────────────────────────────
function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-[#36648F] via-[#4a7fa8] to-[#6b9fc4] relative">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
          {/* Avatar */}
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
                  <IconShield />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">@{profile.username}</p>
          </div>

          <button className="self-start sm:self-end px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <IconSettings />
            Edit Profile
          </button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">{profile.bio}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <IconLocation />
            {profile.location}
          </span>
          <span>Member since {profile.memberSince}</span>
          <span className="inline-flex items-center gap-1">
            <IconStar className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold text-gray-900">{profile.feedbackScore}</span> feedback score
          </span>
          <span className="inline-flex items-center gap-1">
            <span className={`font-semibold ${profile.positivePercent >= 99 ? "text-green-600" : profile.positivePercent >= 95 ? "text-yellow-600" : "text-red-600"}`}>
              {profile.positivePercent}%
            </span>
            positive
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Cards ─────────────────────────────────────────────
function StatsGrid({ stats }: { stats: UserProfile["stats"] }) {
  const cards = [
    { label: "Total Sales", value: stats.totalSales, color: "text-green-600", bg: "bg-green-50", icon: IconSell },
    { label: "Total Purchases", value: stats.totalPurchases, color: "text-blue-600", bg: "bg-blue-50", icon: IconPurchase },
    { label: "Active Listings", value: stats.activeListings, color: "text-purple-600", bg: "bg-purple-50", icon: IconHome },
    { label: "Total Watchers", value: stats.watchers, color: "text-rose-600", bg: "bg-rose-50", icon: IconWatch },
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
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center ${card.color}`}>
                <Icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
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

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          <span className="text-xs text-gray-400">Last 30 days</span>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{tx.itemTitle}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {tx.type === "sale" ? `Sold to ${tx.buyerOrSeller}` : `Bought from ${tx.buyerOrSeller}`} · {tx.date}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">${tx.price.toFixed(2)}</p>
                <StatusBadge status={tx.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Listings Preview */}
      {activeListings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Active Listings</h2>
            <span className="text-xs font-medium text-[#36648F]">{activeListings.length} items</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {activeListings.slice(0, 4).map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">${item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{item.timeLeft} left</p>
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

  const filtered = filter === "all" ? purchases : purchases.filter((t) => t.status === filter);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
        <h2 className="font-semibold text-gray-900">Purchase History</h2>
        <div className="flex gap-2">
          {["all", "completed", "shipped", "pending"].map((f) => (
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
          <IconPurchase />
          <p className="mt-2 text-sm">No purchases found</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((tx) => (
            <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{tx.itemTitle}</p>
                <p className="text-xs text-gray-500 mt-1">From {tx.buyerOrSeller} · {tx.date}</p>
                <p className="text-xs text-gray-400 mt-0.5">Order #{tx.id}</p>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col items-end gap-1.5">
                <p className="text-base font-bold text-gray-900">${tx.price.toFixed(2)}</p>
                <StatusBadge status={tx.status} />
              </div>
              <IconChevronRight className="text-gray-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Selling Tab ─────────────────────────────────────────────
function SellingTab({ transactions, listings }: { transactions: Transaction[]; listings: Listing[] }) {
  const sales = transactions.filter((t) => t.type === "sale");

  return (
    <div className="space-y-6">
      {/* Selling Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Listings</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{listings.filter((l) => l.status === "active").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Sold</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{sales.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${sales.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Sales</h2>
        </div>
        {sales.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <IconSell />
            <p className="mt-2 text-sm">No sales yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sales.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img src={tx.itemImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{tx.itemTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Buyer: {tx.buyerOrSeller} · {tx.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-green-600">+${tx.price.toFixed(2)}</p>
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

// ─── Feedback Tab ────────────────────────────────────────────
function FeedbackTab({ feedback, profile }: { feedback: FeedbackEntry[]; profile: UserProfile }) {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? feedback : feedback.filter((f) => f.rating === filter);

  const positive = feedback.filter((f) => f.rating === "positive").length;
  const neutral = feedback.filter((f) => f.rating === "neutral").length;
  const negative = feedback.filter((f) => f.rating === "negative").length;
  const total = feedback.length;

  return (
    <div className="space-y-6">
      {/* Feedback Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={profile.positivePercent >= 99 ? "#16a34a" : profile.positivePercent >= 95 ? "#eab308" : "#dc2626"}
                  strokeWidth="8"
                  strokeDasharray={`${(profile.positivePercent / 100) * 326.73} 326.73`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">{profile.positivePercent}%</span>
                <span className="text-[10px] text-gray-400">positive</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900 mt-2">{profile.feedbackScore} score</p>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            {[
              { label: "Positive", count: positive, color: "bg-green-500", textColor: "text-green-700" },
              { label: "Neutral", count: neutral, color: "bg-yellow-500", textColor: "text-yellow-700" },
              { label: "Negative", count: negative, color: "bg-red-500", textColor: "text-red-700" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`text-sm font-medium ${row.textColor} w-20`}>{row.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-500`}
                    style={{ width: total > 0 ? `${(row.count / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{row.count}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium text-gray-700 w-20">Total</span>
              <div className="flex-1" />
              <span className="text-sm font-semibold text-gray-900 w-12 text-right">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-gray-100 gap-3">
          <h2 className="font-semibold text-gray-900">Feedback Comments</h2>
          <div className="flex gap-2">
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
            <IconFeedback />
            <p className="mt-2 text-sm">No feedback found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((fb) => (
              <div key={fb.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{fb.fromUser}</span>
                    <RatingBadge rating={fb.rating} />
                  </div>
                  <span className="text-xs text-gray-400">{fb.date}</span>
                </div>
                <p className="text-sm text-gray-600">{fb.comment}</p>
                <p className="text-xs text-gray-400 mt-1">Item: {fb.itemTitle}</p>
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
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Watchlist</h2>
        <span className="text-xs font-medium text-[#36648F]">{listings.length} items</span>
      </div>
      {listings.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <IconWatch />
          <p className="mt-2 text-sm">Your watchlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {listings.map((item) => (
            <div key={item.id} className="group cursor-pointer border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white shadow-sm transition-colors">
                  <IconWatch />
                </button>
                {item.timeLeft && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded font-medium">
                    {item.timeLeft}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-base font-bold text-gray-900">${item.price.toFixed(2)}</p>
                  {item.bids > 0 && (
                    <span className="text-xs text-gray-500">{item.bids} bids</span>
                  )}
                </div>
                {item.watchers > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{item.watchers} watchers</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
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
            { label: "Personal Information", desc: "Name, email, phone number", value: "Edit" },
            { label: "Address Book", desc: "Shipping and billing addresses", value: "Manage" },
            { label: "Payment Methods", desc: "Cards, bank accounts, PayPal", value: "Manage" },
            { label: "Security", desc: "Password, 2FA, login activity", value: "Update" },
            { label: "Notification Preferences", desc: "Email, push, SMS alerts", value: "Configure" },
            { label: "Privacy Settings", desc: "Who can see your profile and activity", value: "Adjust" },
            { label: "Selling Preferences", desc: "Defaults for new listings, shipping", value: "Edit" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm font-medium text-[#36648F]">{item.value}</span>
                <IconChevronRight className="text-[#36648F]" />
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
            Once you deactivate your account, there is no going back. All your data, listings, and feedback will be permanently removed.
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
export default function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = useParams();

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
        fetchJSON<UserProfile>(`${API_BASE}/users/${username}/profile`),
        fetchJSON<Transaction[]>(`${API_BASE}/users/${username}/transactions`),
        fetchJSON<FeedbackEntry[]>(`${API_BASE}/users/${username}/feedback`),
        fetchJSON<Listing[]>(`${API_BASE}/users/${username}/listings`),
      ]);
      setProfile(profileData);
      setTransactions(txData);
      setFeedback(fbData);
      setListings(listData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) fetchData();
  }, [username, fetchData]);

  if (loading) return <ProfileSkeleton />;
  if (error || !profile) return <ErrorState message={error || "Profile not found"} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-[#36648F] tracking-tight">myBay</span>
            <span className="text-gray-300">|</span>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
              <a href="/" className="hover:text-gray-900 transition-colors">Saved</a>
              <span className="text-[#36648F] font-medium">My Account</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors">
              <IconFeedback />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
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
                <Icon />
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
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <Sidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                feedbackCount={feedback.length}
              />
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            <ProfileHeader profile={profile} />

            {activeTab === "overview" && (
              <OverviewTab
                profile={profile}
                recentTransactions={transactions}
                activeListings={listings.filter((l) => l.status === "active")}
              />
            )}

            {activeTab === "purchases" && <PurchasesTab transactions={transactions} />}

            {activeTab === "selling" && <SellingTab transactions={transactions} listings={listings} />}

            {activeTab === "watchlist" && <WatchlistTab listings={listings.filter((l) => l.status === "active")} />}

            {activeTab === "feedback" && <FeedbackTab feedback={feedback} profile={profile} />}

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
              <a href="/" className="hover:text-gray-600 transition-colors">Privacy</a>
              <a href="/" className="hover:text-gray-600 transition-colors">Terms</a>
              <a href="/" className="hover:text-gray-600 transition-colors">Help & Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
