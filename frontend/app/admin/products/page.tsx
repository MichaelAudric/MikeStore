"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await apiFetch(`/products/my`, { method: "GET" });

        if (!res.ok) {
          setProducts([]);
          return;
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p className="p-6 text-white">Loading products...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Manage Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-block px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:opacity-90"
        >
          + Create Product
        </Link>
      </div>

      <div className="border border-neutral-800 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 bg-neutral-900 text-neutral-400 text-sm font-medium">
          <div className="p-4 text-left">Image</div>
          <div className="p-4 text-center">Name</div>
          <div className="p-4 text-right">Price</div>
          <div className="p-4 text-right">Stock</div>
        </div>

        {/* Product Rows */}
        <div className="divide-y divide-neutral-800">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="grid grid-cols-4 items-center hover:bg-neutral-900 transition cursor-pointer p-4 gap-2"
            >
              {/* Image */}
              <div className="flex justify-start">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>

              {/* Name */}
              <div className="truncate text-center">{p.name}</div>

              {/* Price */}
              <div className="text-right font-medium">${p.price}</div>

              {/* Stock */}
              <div className="text-right font-medium">{p.stock}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
