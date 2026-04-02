"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Order = {
  id: string;
  user: { email: string };
  totalPaid: number;
  orderStatus: "PENDING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500 text-black",
  SHIPPED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
  CANCELLED: "bg-red-500 text-white",
};

export default function OrdersTable({
  orders,
  refresh,
}: {
  orders: Order[];
  refresh: () => void;
}) {
  const router = useRouter();

  const updateStatus = async (id: string, status: string) => {
    await apiFetch(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ orderStatus: status }),
    });
    refresh();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-800 shadow-sm">
      <table className="w-full text-sm border-collapse">
        {/* Sticky Header */}
        <thead className="bg-neutral-900 text-neutral-300 sticky top-0 z-10">
          <tr>
            <th className="p-4 text-left font-medium">Order ID</th>
            <th className="p-4 text-left font-medium">User</th>
            <th className="p-4 text-left font-medium">Total</th>
            <th className="p-4 text-left font-medium">Status</th>
            <th className="p-4 text-left font-medium">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              onClick={() => router.push(`/admin/orders/${o.id}`)}
              className="transition-colors cursor-pointer hover:bg-neutral-900/60"
            >
              <td className="p-3 py-6 font-mono text-xs text-neutral-300 truncate">
                {o.id}
              </td>
              <td className="p-3 text-neutral-200 truncate">{o.user?.email}</td>
              <td className="p-3 font-medium text-white">${o.totalPaid}</td>
              <td className="p-3" onClick={(e) => e.stopPropagation()}>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    STATUS_COLORS[o.orderStatus]
                  }`}
                >
                  {o.orderStatus}
                </span>
              </td>
              <td className="p-3 text-xs text-neutral-400">
                {new Date(o.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
