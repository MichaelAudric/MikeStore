"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import OrderDetailClient from "@/components/admin/orders/OrderDetailClient";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await apiFetch(`/orders/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          setOrder(null);
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <div className="p-6 text-white">Loading order...</div>;
  if (!order) return <div className="p-6 text-white">Order not found</div>;

  return <OrderDetailClient order={order} />;
}
