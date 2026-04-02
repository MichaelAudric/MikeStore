"use client";

import { useOrderStore } from "@/store/order";
import { useCartStore } from "@/store/cart";

export default function OrderSummary({ address }: any) {
  const items = useCartStore((state) => state.items);
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const loading = useOrderStore((state) => state.loading);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-sm">
      <h2 className="text-xl font-semibold text-white">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex items-center gap-4
              bg-neutral-800/60
              border border-neutral-700
              rounded-xl p-3
            "
          >
            {/* Image */}
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-14 h-14 object-cover rounded-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-xs text-neutral-400">
                {item.quantity} × ${item.product.price}
              </p>
            </div>

            {/* Price */}
            <p className="text-sm font-semibold text-white">
              ${(item.quantity * item.product.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-700 text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {/* Button */}
      <button
        onClick={() => placeOrder(address)}
        disabled={loading || !address}
        className={`
          w-full mt-2 px-6 py-3
          rounded-xl font-medium
          transition-all duration-200
          ${
            loading || !address
              ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-neutral-300 cursor-pointer"
          }
        `}
      >
        {loading ? "Processing..." : "Place Order"}
      </button>

      {/* Small UX note */}
      <p className="text-xs text-neutral-500 text-center">
        By placing your order, you agree to our terms and conditions.
      </p>
    </div>
  );
}
