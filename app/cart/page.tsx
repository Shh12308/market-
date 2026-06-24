"use client";

import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setItems(data.items);
      } finally {
        setLoading(false);
      }
    }

    loadCart();
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <p>Loading cart...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border p-4 rounded">
                <p className="font-semibold">{item.name}</p>
                <p>
                  £{item.price} × {item.quantity}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-xl font-bold">
            Total: £{total}
          </div>
        </>
      )}
    </main>
  );
}
