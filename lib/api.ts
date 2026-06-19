import { ApiResponse, Product, Category, Seller } from "./types";

const API_BASE = "/api";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  products: {
    getFeatured: () =>
      fetchJSON<ApiResponse<Product[]>>(
        `${API_BASE}/products?featured=true&limit=8`
      ),
    getNew: () =>
      fetchJSON<ApiResponse<Product[]>>(
        `${API_BASE}/products?new=true&limit=8`
      ),
    getAll: (params?: Record<string, string>) => {
      const qs = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return fetchJSON<ApiResponse<Product[]>>(
        `${API_BASE}/products${qs}`
      );
    },
    getByCategory: (slug: string) =>
      fetchJSON<ApiResponse<Product[]>>(
        `${API_BASE}/products?category=${slug}`
      ),
    getById: (id: string) => fetchJSON<Product>(`${API_BASE}/products/${id}`),
  },

  categories: {
    getAll: () => fetchJSON<Category[]>(`${API_BASE}/categories`),
  },

  sellers: {
    getTop: () => fetchJSON<Seller[]>(`${API_BASE}/sellers/top`),
  },
};
