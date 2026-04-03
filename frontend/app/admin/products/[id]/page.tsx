"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import EditProductForm from "@/components/admin/products/EditProductForm";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await apiFetch(`/products/${id}`, { method: "GET" });

        if (!res.ok) {
          setProduct(null);
          return;
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading product...</div>;
  if (!product) return <div className="p-6 text-white">Product not found</div>;

  return <EditProductForm product={product} />;
}
