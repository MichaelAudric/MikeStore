import { cookies } from "next/headers";
import OrderDetailClient from "@/components/admin/orders/OrderDetailClient";

async function getOrder(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return <div className="p-6 text-white">Order not found</div>;
  }

  return <OrderDetailClient order={order} />;
}
