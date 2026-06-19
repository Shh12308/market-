import { ShieldCheck, Zap, Wallet, Globe, HeadphonesIcon, BarChart3 } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Escrow Protection", description: "Every transaction is secured through smart contract escrow. Funds released only on confirmation.", color: "text-[var(--primary)]" },
  { icon: Zap, title: "Instant Settlements", description: "On-chain transfers settle in seconds. Get paid immediately after a successful transaction.", color: "text-[var(--warning)]" },
  { icon: Wallet, title: "Multi-Chain Support", description: "Buy and sell across Ethereum, Solana, Polygon, Arbitrum. Connect your preferred wallet.", color: "text-[var(--accent)]" },
  { icon: Globe, title: "Global Marketplace", description: "Access buyers and sellers from 190+ countries with automatic currency conversion.", color: "text-[var(--success)]" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated support team available around the clock via live chat and dispute resolution.", color: "text-[var(--danger)]" },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Track sales, views, and watcher trends with real-time analytics and insights.", color: "text-indigo-400" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[var(--primary)]/[0.04] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-[var(--accent)]/[0.03] rounded-full blur-[120px]" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Why Choose{" "}
            <span className="gradient-text">Our Platform</span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] max-w-2xl mx-auto">
            Built for traders who demand security, speed, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-6 rounded-[var(--radius-lg)] bg-white/[0.02] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-white/[0.04] transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-white/[0.05] border border-[var(--border)] flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--text-dim)] leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 rounded-[var(--radius-xl)] bg-white/[0.02] border border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)] px-4">Ready to start trading?</p>
            <a href="/sell" className="primary-btn !py-2.5">Start Selling</a>
            <a href="/register" className="secondary-btn !py-2.5">Create Account</a>
          </div>
        </div>
      </div>
    </section>
  );
}
