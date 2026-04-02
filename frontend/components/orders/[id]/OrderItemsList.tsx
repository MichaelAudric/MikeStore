"use client";

import { useOrderStore } from "@/store/order";
import Link from "next/link";
import { useEffect } from "react";

export default function OrderItemsList({ orderId }: { orderId: string }) {
  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);

  useEffect(() => {
    if (orderId) fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  if (!selectedOrder)
    return <div className="text-center py-20">Loading order...</div>;

  return (
    <>
      <div className="space-y-4">
        {selectedOrder.orderItems?.map((item: any) => (
          <Link
            href={`/products/${item.product.id}`}
            key={item.id}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-white hover:shadow-lg transition-all duration-200"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-semibold text-white">{item.product.name}</p>
              <div className="flex gap-3 mt-1 text-sm text-neutral-400">
                <span className="px-2 py-0.5 bg-neutral-800 rounded-full">
                  Qty: {item.quantity}
                </span>
                <span className="px-2 py-0.5 bg-neutral-800 rounded-full">
                  Price: ${item.price}
                </span>
              </div>
            </div>
            <p className="font-bold text-white text-lg">
              ${item.price * item.quantity}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-right text-xl font-bold text-white border-t border-neutral-700 pt-4">
        Total Paid: ${selectedOrder.totalPaid}
      </div>
    </>
  );
}
