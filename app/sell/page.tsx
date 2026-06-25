"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellPage() {
  const router = useRouter();

  const [productType, setProductType] = useState("physical");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electronics",
    price: "",
    tags: "",
    inventory: "",
    weight: "",
    shippingCost: "",
    shipsFrom: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const uploadForm = new FormData();
        uploadForm.append("file", image);

        const uploadRes = await fetch(
          "/api/upload",
          {
            method: "POST",
            body: uploadForm,
          }
        );

        const uploadData =
          await uploadRes.json();

        imageUrl = uploadData.url;
      }

      const res = await fetch(
        "/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            productType,
            imageUrl,
          }),
        }
      );

      if (!res.ok)
        throw new Error(
          "Failed to create product"
        );

      const product = await res.json();

      router.push(
        `/item/${product.id}`
      );
    } catch (err) {
      console.error(err);
      alert("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">
        Sell an Item
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What are you selling?"
          className="w-full border rounded-lg p-3"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          placeholder="Describe your item..."
          className="w-full border rounded-lg p-3"
          required
        />

        <div>
          <label className="block mb-2 font-medium">
            Photos
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-48 w-48 object-cover rounded-lg border"
            />
          )}
        </div>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Collectibles</option>
          <option>Home & Garden</option>
          <option>Sports</option>
          <option>Art</option>
          <option>Books</option>
          <option>Other</option>
        </select>

        <select
          value={productType}
          onChange={(e) =>
            setProductType(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-3"
        >
          <option value="physical">
            Physical Item
          </option>
          <option value="digital">
            Digital Product
          </option>
        </select>

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border rounded-lg p-3"
          required
        />

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border rounded-lg p-3"
        />

        {productType === "physical" && (
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="inventory"
              value={form.inventory}
              onChange={handleChange}
              placeholder="Quantity Available"
              className="border rounded-lg p-3"
            />

            <input
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
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
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg p-4 font-semibold"
        >
          {loading
            ? "Creating Listing..."
            : "List Item"}
        </button>
      </form>
    </div>
  );
}
