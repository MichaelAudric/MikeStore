"use client";

import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import HeroBanner from "@/components/home/HeroBanner";

// Reuse your existing ProductCard
import ProductCard from "@/components/product/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiFetch("/products", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products.slice(0, 3)); // Take top 3 only
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <HeroBanner></HeroBanner>

      {/* Featured Products */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-8">
          Featured Products
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/40"
              >
                <ProductCard product={product} />
              </div>
            ))}

            {/* "And more" card */}
            <Link
              href="/products"
              className="flex flex-col items-center justify-center border border-neutral-800 rounded-2xl p-6 text-white hover:bg-neutral-900 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-4xl mb-2">✨</div>
              <p className="font-semibold">And more...</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
