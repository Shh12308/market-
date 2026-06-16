"use client";

import { useState } from "react";

export default function SellPage() {
  const [productType, setProductType] = useState("physical");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sell Product</h1>

      <form className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 font-medium">
            Product Name
          </label>
          <input
            type="text"
            placeholder="Awesome Product"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows={6}
            placeholder="Describe your product..."
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium">
            Category
          </label>

          <select className="w-full border rounded-lg p-3">
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
        </div>

        {/* Product Type */}
        <div>
          <label className="block mb-2 font-medium">
            Product Type
          </label>

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
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium">
            Price (USDC)
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="10.00"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block mb-2 font-medium">
            Product Thumbnail
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full"
          />
        </div>

        {/* Digital Upload */}
        {productType !== "physical" && (
          <div>
            <label className="block mb-2 font-medium">
              Product Files
            </label>

            <input
              type="file"
              multiple
              className="w-full"
            />

            <p className="text-sm text-gray-500 mt-2">
              Upload ZIP, PDF, MP4, JPG, PNG, MP3, or other supported
              files.
            </p>
          </div>
        )}

        {/* Physical Product Fields */}
        {productType === "physical" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">
                Inventory
              </label>

              <input
                type="number"
                min="1"
                placeholder="100"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Weight (kg)
              </label>

              <input
                type="number"
                step="0.01"
                placeholder="1.5"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Shipping Cost (USDC)
              </label>

              <input
                type="number"
                step="0.01"
                placeholder="5.00"
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Ships From
              </label>

              <input
                type="text"
                placeholder="United States"
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <label className="block mb-2 font-medium">
            Tags
          </label>

          <input
            type="text"
            placeholder="design, template, digital"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
          />

          <span className="text-sm">
            I confirm I own the rights to sell this product.
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 font-semibold"
        >
          List Product
        </button>
      </form>
    </div>
  );
}
