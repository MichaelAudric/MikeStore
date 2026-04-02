import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "./cart";
import { useAuthStore } from "./auth";

interface OrderStore {
  loading: boolean;
  error: string | null;
  myOrders: any[];
  selectedOrder?: any;
  placeOrder: (address: string) => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  clearOrderUI: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  loading: false,
  error: null,
  myOrders: [],
  selectedOrder: undefined,

  placeOrder: async (address: string) => {
    const cartItems = useCartStore.getState().items;
    const user = useAuthStore.getState().user;

    if (cartItems.length === 0) return;

    set({ loading: true, error: null });

    try {
      const response = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: cartItems.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
          address,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Checkout failed");
      }

      const order = await response.json(); //get created order

      //Clear cart
      useCartStore.getState().clearCartDB();
      useCartStore.getState().clearCartUI();

      //Redirect to success page
      window.location.href = `/orders/success?orderId=${order.id}`;
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  fetchMyOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiFetch("/orders/my", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      console.log(response);
      set({ myOrders: data });
    } catch (err: any) {
      set({ error: err.message || "Something went wrong" });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id: string) => {
    try {
      const res = await apiFetch(`/orders/${id}`);
      const data = await res.json();
      set({ selectedOrder: data });
    } catch (err) {
      console.error("Failed to fetch order", err);
    }
  },

  clearOrderUI: () => {
    set({ myOrders: [], selectedOrder: undefined });
  },
}));
