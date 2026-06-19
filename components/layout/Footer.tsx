import { Zap, Github, Twitter } from "lucide-react";
import Link from "next/link";

const links = {
  Marketplace: ["Explore", "Collections", "Auctions", "Drops", "How it Works"],
  Resources: ["Help Center", "Blog", "API Docs", "Status", "Partners"],
  Company: ["About", "Careers", "Press", "Brand Assets"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg crypto-gradient flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">myBay</span>
            </Link>
            <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-4">
              The premier decentralized marketplace for digital assets and NFTs.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] hover:text-white hover:border-[var(--border-hover)] transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 border border-[var(--border)] flex items-center justify-center text-[var(--text-dim)] hover:text-white hover:border-[var(--border-hover)] transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-dim)] hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-dim)]">
            © 2025 myBay Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
            <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
