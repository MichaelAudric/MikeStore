"use client";
import { useCartStore } from "@/store/cart";

export default function CartTotal() {
  const totalPrice = useCartStore((state) => state.totalPrice);

  return (
    <div className="text-right w-full md:w-auto">
      <span className="text-2xl font-semibold text-white">
        Total: ${totalPrice.toFixed(2)}
      </span>
    </div>
  );
}
