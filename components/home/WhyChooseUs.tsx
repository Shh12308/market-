import {
  ShieldCheck,
  Zap,
  Wallet,
  Globe,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Escrow Protection",
    description:
      "Every transaction is secured through our smart contract escrow. Funds are only released when you confirm delivery.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    description:
      "On-chain transfers settle in seconds, not days. Get paid immediately after a successful transaction.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Wallet,
    title: "Multi-Chain Support",
    description:
      "Buy and sell across Ethereum, Solana, Polygon, Arbitrum, and more. Connect your preferred wallet.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    description:
      "Access buyers and sellers from 190+ countries. List once, sell worldwide with automatic currency conversion.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock via live chat, email, and dispute resolution.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your sales, views, and watcher trends with real-time analytics. Make data-driven pricing decisions.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#0B1221] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#36648F]/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Our Platform
            </span>
          </h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            Built for traders who demand security, speed, and transparency.
            Here&apos;s what sets us apart.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <p className="text-sm text-gray-300 px-4">
              Ready to start trading?
            </p>
            <a
              href="/sell"
              className="px-6 py-2.5 bg-[#36648F] hover:bg-[#2a5073] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Start Selling
            </a>
            <a
              href="/register"
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
