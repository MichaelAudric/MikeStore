"use client";

import { useParams } from "next/navigation";
import OrderDetails from "@/components/orders/[id]/OrderDetails";
import OrderItemsList from "@/components/orders/[id]/OrderItemsList";

export default function OrderDetailPage() {
  const params = useParams();

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-white space-y-12">
      {/* Order Details Card */}
      <OrderDetails orderId={params.id as string} />

      {/* Items Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Items in this Order</h2>
        <OrderItemsList orderId={params.id as string} />
      </div>
    </div>
  );
}
