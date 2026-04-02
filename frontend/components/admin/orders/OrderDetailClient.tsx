"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500 text-black",
  SHIPPED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function OrderDetailClient({ order }: { order: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      console.log(status);
      await apiFetch(`/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ orderStatus: status }),
      });

      // Redirect to admin orders page after saving
      router.push("/admin/orders");
    } catch (e) {
      console.error(e);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12 text-white">
      <h1 className="text-3xl font-bold">Order Detail</h1>

      {/* Top Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <p className="text-sm text-neutral-400 mb-2">Order ID</p>
          <p className="font-mono text-xs break-all">{order.id}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <p className="text-sm text-neutral-400 mb-2">Customer</p>
          <p className="truncate">{order.user?.email}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <p className="text-sm text-neutral-400 mb-2">Total</p>
          <p className="font-semibold text-lg">${order.totalPaid}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border border-neutral-800 rounded-lg bg-neutral-950"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.imageUrl}
                  className="w-14 h-14 object-cover rounded"
                  alt={item.product.name}
                />
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-neutral-400">
                    {item.quantity} {item.quantity > 1 ? "items" : "item"}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-white text-right">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-400 mb-1">Order Status</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              STATUS_COLORS[status] || "bg-neutral-700 text-white"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 cursor-pointer text-sm"
            disabled={STATUS_TRANSITIONS[status].length === 0} // disable if no transitions allowed
          >
            {/* Current status always visible */}
            <option value={status}>{status}</option>

            {/* Only allow valid transitions */}
            {STATUS_TRANSITIONS[status].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleUpdateStatus}
            disabled={loading}
            className="px-4 py-2 bg-white text-black rounded hover:bg-neutral-300 transition cursor-pointer"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
