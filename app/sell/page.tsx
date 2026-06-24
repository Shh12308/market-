"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const router = useRouter();

  const [productType, setProductType] = useState("physical");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Art",
    price: "",
    thumbnail: "",
    tags: "",
    inventory: "",
    weight: "",
    shippingCost: "",
    shipsFrom: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          productType,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");

      const data = await res.json();

      router.push(`/item/${data.id}`);
    } catch (err) {
      alert("Failed to list product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border rounded-lg p-3"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          placeholder="Description"
          className="w-full border rounded-lg p-3"
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option>Art</option>
          <option>Photography</option>
          <option>Videos</option>
          <option>Templates</option>
          <option>Software</option>
          <option>Music</option>
          <option>Documents</option>
          <option>E-books</option>
          <option>Collectibles</option>
          <option>Electronics</option>
          <option>Other</option>
        </select>

        {/* Product Type */}
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="physical">Physical Product</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
          <option value="audio">Audio</option>
          <option value="software">Software</option>
          <option value="other">Other Digital Product</option>
        </select>

        {/* Price */}
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="Price"
          className="w-full border rounded-lg p-3"
        />

        {/* Thumbnail */}
        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          placeholder="Thumbnail URL"
          className="w-full border rounded-lg p-3"
        />

        {/* Tags */}
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="tags (comma separated)"
          className="w-full border rounded-lg p-3"
        />

        {/* Physical only */}
        {productType === "physical" && (
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="inventory"
              value={form.inventory}
              onChange={handleChange}
              placeholder="Inventory"
              className="border rounded-lg p-3"
            />

            <input
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Weight"
              className="border rounded-lg p-3"
            />

            <input
              name="shippingCost"
              value={form.shippingCost}
              onChange={handleChange}
              placeholder="Shipping Cost"
              className="border rounded-lg p-3"
            />

            <input
              name="shipsFrom"
              value={form.shipsFrom}
              onChange={handleChange}
              placeholder="Ships From"
              className="border rounded-lg p-3"
            />
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg p-4 font-semibold"
        >
          {loading ? "Listing..." : "List Product"}
        </button>
      </form>
    </div>
  );
}
