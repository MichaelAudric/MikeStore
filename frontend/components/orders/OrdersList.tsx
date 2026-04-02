"use client";

import { useOrderStore } from "@/store/order";
import { useEffect } from "react";
import OrdersCard from "./OrdersCard";

export default function OrdersList() {
  const fetchOrders = useOrderStore((state) => state.fetchMyOrders);
  const orders = useOrderStore((state) => state.myOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="animate-pulse bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-24 bg-neutral-700 rounded"></div>
        <div className="h-4 w-16 bg-neutral-700 rounded"></div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-20 w-20 bg-neutral-700 rounded"></div>
        <div className="h-20 w-20 bg-neutral-700 rounded"></div>
        <div className="h-20 w-20 bg-neutral-700 rounded"></div>
      </div>
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-neutral-700 rounded"></div>
        <div className="h-4 w-16 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );

  if (!orders) {
    // show 3 skeleton cards while loading
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (orders.length === 0)
    return <div className="text-center py-20">You have no past orders.</div>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrdersCard key={order.id} order={order} />
      ))}
    </div>
  );
}
