"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export const AddToCartButton = ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  const addItems = useCartStore((state) => state.addItems);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await addItems(productId, quantity);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      {user && user.role === "USER" ? (
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className={`
        w-full flex items-center justify-center
        px-5 py-3 rounded-lg font-medium text-white
        bg-neutral-700 hover:bg-neutral-600
        transition-all duration-200
        active:scale-[0.97]
        disabled:opacity-60 disabled:cursor-not-allowed
        hover:cursor-pointer
      `}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};
