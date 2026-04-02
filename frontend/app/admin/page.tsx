import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

async function getStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return { totalOrders: 0, totalRevenue: 0, pending: 0 };
  }

  const orders = await res.json();

  const activeOrders = orders.filter((o: any) => o.orderStatus !== "CANCELLED");

  return {
    totalOrders: activeOrders.length,
    totalRevenue: activeOrders.reduce(
      (sum: number, o: any) => sum + o.totalPaid,
      0,
    ),
    pending: activeOrders.filter((o: any) => o.orderStatus === "PENDING")
      .length,
  };
}

export default async function AdminPage() {
  const incomingHeaders = await headers();

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      cookie: incomingHeaders.get("cookie") || "",
    },
    cache: "no-store",
  });

  if (!meRes.ok) {
    redirect("/login");
  }

  const user = await meRes.json();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const stats = await getStats();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-white space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Monitor your store performance and manage operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-b border-gray-700 py-10">
        {/* Total Orders */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
          <p className="text-sm text-neutral-400">Total Orders</p>
          <p className="text-3xl font-semibold mt-2">{stats.totalOrders}</p>
        </div>

        {/* Revenue */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
          <p className="text-sm text-neutral-400">Revenue</p>
          <p className="text-3xl font-semibold mt-2">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition">
          <p className="text-sm text-neutral-400">Pending Orders</p>
          <p className="text-3xl font-semibold mt-2">{stats.pending}</p>

          {/* subtle status hint */}
          {stats.pending > 0 && (
            <p className="text-xs text-yellow-400 mt-2">Needs attention</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/orders"
          className="
            group
            bg-neutral-900 border border-neutral-800
            rounded-2xl p-6
            hover:border-neutral-700
            hover:-translate-y-[1px]
            transition-all
          "
        >
          <h3 className="text-lg font-medium mb-2">Manage Orders</h3>
          <p className="text-sm text-neutral-400">
            View, update, and track all customer orders.
          </p>

          <span className="text-sm text-white mt-4 inline-block group-hover:underline">
            Go to orders →
          </span>
        </Link>

        <Link
          href="/admin/products"
          className="
            group
            bg-neutral-900 border border-neutral-800
            rounded-2xl p-6
            hover:border-neutral-700
            hover:-translate-y-[1px]
            transition-all
          "
        >
          <h3 className="text-lg font-medium mb-2">Manage Products</h3>
          <p className="text-sm text-neutral-400">
            Add, edit, and organize your product catalog.
          </p>

          <span className="text-sm text-white mt-4 inline-block group-hover:underline">
            Go to products →
          </span>
        </Link>
      </div>
    </div>
  );
}
