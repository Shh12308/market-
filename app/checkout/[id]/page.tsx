"use client";

export default function Checkout() {
  async function pay() {
    await fetch("/api/orders", {
      method: "POST",
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Checkout
      </h1>

      <button
        onClick={pay}
        className="bg-green-600 text-white px-5 py-3 mt-6"
      >
        Pay With Crypto
      </button>
    </div>
  );
}
