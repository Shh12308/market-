"use client";

import { useState } from "react";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  async function pay() {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: "current-cart",
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Checkout
        </h1>

        <p className="text-[var(--text-dim)] mb-8">
          Secure payment powered by Stripe.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span>Secure encrypted payment</span>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span>
              Visa, Mastercard, Apple Pay, Google Pay
            </span>
          </div>
        </div>

        <button
          onClick={pay}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay Securely
            </>
          )}
        </button>
      </div>
    </div>
  );
}
