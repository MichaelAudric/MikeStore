"use client";

import { useOrderStore } from "@/store/order";
import { useEffect } from "react";

export default function OrderDetails({ orderId }: { orderId: string }) {
  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  if (!selectedOrder) {
    return <p>Loading order details...</p>;
  }

  return (
    <>
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4 shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white">Order Details</h1>

        <div className="flex justify-between items-center">
          <p className="text-neutral-400 text-sm">Order ID</p>
          <p className="text-white font-medium">{selectedOrder.id}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-neutral-400 text-sm">Created At</p>
          <p className="text-white font-medium">
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-neutral-400 text-sm">Status</p>
          <p className="text-white font-medium">{selectedOrder.orderStatus}</p>
        </div>

        <div className="flex justify-between items-start">
          <p className="text-neutral-400 text-sm">Shipping Address</p>
          <p className="text-white font-medium max-w-xs break-words">
            {selectedOrder.address}
          </p>
        </div>
      </div>
    </>
  );
}
