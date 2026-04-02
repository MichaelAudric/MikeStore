import { create } from "zustand";
import { apiFetch } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;

  fetchCart: () => Promise<void>;
  addItems: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    oldQuantity: number,
    newQuantity: number,
  ) => Promise<void>;
  clearCartUI: () => void;
  clearCartDB: () => Promise<void>;
}

const computeTotals = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce(
    (sum, i) => sum + i.quantity * i.product.price,
    0,
  );
  return { totalQuantity, totalPrice };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalQuantity: 0,
  totalPrice: 0,

  fetchCart: async () => {
    try {
      const cart = await apiFetch(`/cart`, {
        method: "GET",
      });

      const cartJson = await cart.json();

      const items = cartJson.items;

      if (Array.isArray(items)) {
        set({ items, ...computeTotals(items) });
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  },

  addItems: async (productId, quantity) => {
    try {
      const updatedCart = await apiFetch(`/cart/items`, {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      });

      console.log("Hello world");

      const updatedCartJson = await updatedCart.json();

      const items = updatedCartJson.items;

      if (Array.isArray(items)) {
        set({ items, ...computeTotals(items) });
      }
    } catch (err) {
      console.error("Failed to add items:", err);
    }
  },

  removeItem: async (productId) => {
    try {
      const updatedCart = await apiFetch(`/cart/items/${productId}`, {
        method: "DELETE",
      });

      const updatedCartJson = await updatedCart.json();

      const items = updatedCartJson.items;

      if (Array.isArray(items)) {
        set({ items, ...computeTotals(items) });
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  },

  updateQuantity: async (productId, oldQuantity, newQuantity) => {
    try {
      const updatedCart = await apiFetch(`/cart/items/${productId}`, {
        method: "PATCH",
        body: JSON.stringify({ oldQuantity, newQuantity }),
      });

      const updatedCartJson = await updatedCart.json();

      const items = updatedCartJson.items;

      if (Array.isArray(items)) {
        set({ items, ...computeTotals(items) });
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  },

  clearCartUI: () => set({ items: [], totalQuantity: 0, totalPrice: 0 }),

  clearCartDB: async () => {
    try {
      await apiFetch("/cart/clear", {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to clear cart");
    }
  },
}));
