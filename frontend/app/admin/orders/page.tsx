"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import OrdersTable from "@/components/admin/orders/OrdersTable";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await apiFetch("/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      // check user
      const meRes = await apiFetch("/auth/me");
      const me = await meRes.json();
      console.log(meRes);
      if (me.user.role !== "ADMIN") {
        router.push("/");
        return;
      }

      await fetchOrders();
    };

    init();
  }, []);

  // Filtered orders based on search & status
  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || o.orderStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Admin Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search by ID or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md bg-neutral-800 text-white placeholder-neutral-400 w-full sm:w-1/2"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-md bg-neutral-800 text-white w-full sm:w-1/4 cursor-pointer"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-white text-black rounded-md hover:opacity-90 w-full sm:w-auto cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="text-white mt-4">Loading orders...</div>
      ) : (
        <OrdersTable orders={filteredOrders} refresh={fetchOrders} />
      )}
    </div>
  );
}
