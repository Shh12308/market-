'use client';

import { Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

const products = [
  { 
    id: 1, 
    name: 'Genesis NFT Collection', 
    price: '0.5 ETH', 
    stock: 'Unlimited', 
    views: '12.4k', 
    sales: 342,
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 2, 
    name: 'DeFi Trading Course', 
    price: '$199', 
    stock: 'Unlimited', 
    views: '8.1k', 
    sales: 120,
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=100&q=80' 
  },
  { 
    id: 3, 
    name: 'Premium 3D Assets', 
    price: '$45', 
    stock: '50 left', 
    views: '3.2k', 
    sales: 15,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80' 
  },
];

export default function ProductsTable() {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Your Products</h3>
        <button className="primary-btn flex items-center gap-2 text-sm">
          + New Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-muted)]">
          <thead className="bg-[var(--surface-2)] text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Views</th>
              <th className="px-6 py-4">Sales</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-3)] overflow-hidden border border-[var(--border)]">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-medium text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white font-mono">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock === 'Unlimited' ? 'text-[var(--success)] bg-[var(--success)]/10' : 'text-[var(--warning)] bg-[var(--warning)]/10'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {product.views}
                </td>
                <td className="px-6 py-4 font-medium text-white">{product.sales}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-[var(--surface-3)] text-[var(--text-muted)] hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
