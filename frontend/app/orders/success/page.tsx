"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-white px-6">
      <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-10 text-center max-w-md w-full shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Order Successful 🎉</h1>

        {orderId && (
          <p className="text-sm text-neutral-400 mb-2">
            Order ID: <span className="font-mono">{orderId}</span>
          </p>
        )}

        <p className="text-neutral-300 mb-6 mt-4">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="flex gap-4 justify-center mt-6">
          <a
            href="/orders"
            className="px-5 py-2 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition"
          >
            View Orders
          </a>

          <a
            href="/products"
            className="px-5 py-2 bg-neutral-700 rounded-xl font-medium hover:bg-neutral-600 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
