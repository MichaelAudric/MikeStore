"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import CartItem from "./CartItem";
import Link from "next/link";

export default function CartItemsList() {
  const items = useCartStore((state) => state.items);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <h1 className="text-2xl font-semibold text-white mb-2">
          Your cart is empty
        </h1>
        <p className="text-neutral-400">
          Looks like you haven’t added anything yet.
        </p>
        <Link
          href="/products"
          className="inline-block mt-6 px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-neutral-200 transition"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {items.map((item: any) => (
        <CartItem key={item.id} {...item} />
      ))}
    </div>
  );
}
