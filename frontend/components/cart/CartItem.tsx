"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface CartItemProps {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export default function CartItem({
  productId,
  quantity,
  product,
}: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async (oldQty: number, newQty: number) => {
    if (newQty < 1) return;

    setLoading(true);
    await updateQuantity(productId, oldQty, newQty);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeItem(productId);
    setLoading(false);
  };

  return (
    <div
      className="
grid grid-cols-[80px_1fr_auto_auto_auto]
items-center
gap-6
bg-neutral-900/80 backdrop-blur
border border-neutral-800
rounded-xl
p-4
transition-all duration-300
hover:shadow-lg hover:shadow-black/30
hover:border-neutral-700
"
    >
      {/* Image */}
      <div className="w-20 h-20">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between h-20">
        <h2 className="text-sm font-medium text-white line-clamp-2 leading-tight">
          {product.name}
        </h2>
        <p className="text-sm text-neutral-400">${product.price.toFixed(2)}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdate(quantity, quantity - 1)}
          disabled={loading}
          className={`w-8 h-8 flex items-center justify-center border border-neutral-700 rounded-full transition
${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800 cursor-pointer"}`}
        >
          -
        </button>

        <span className="w-8 text-center text-white text-sm font-medium">
          {quantity}
        </span>

        <button
          onClick={() => handleUpdate(quantity, quantity + 1)}
          disabled={loading}
          className={`w-8 h-8 flex items-center justify-center border border-neutral-700 rounded-full transition
${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-800 cursor-pointer"}`}
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-white font-semibold text-sm text-right min-w-[80px]">
        ${(quantity * product.price).toFixed(2)}
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        disabled={loading}
        className="
text-xs text-neutral-500
hover:text-red-400
transition-colors duration-200
cursor-pointer
"
      >
        Remove
      </button>
    </div>
  );
}
