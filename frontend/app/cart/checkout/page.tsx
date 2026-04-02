"use client";

import { useState } from "react";
import CheckoutForm from "@/components/cart/checkout/CheckoutForm";
import OrderSummary from "@/components/cart/checkout/OrderSummary";
import { useAuthStore } from "@/store/auth";

export default function CheckoutPage() {
  const user = useAuthStore((state) => state.user);

  const [address, setAddress] = useState(user?.address);
  const [paymentMethod, setPaymentMethod] = useState("Card");

  return (
    <div className="max-w-6xl mx-auto px-6 pt-14 pb-16 text-white">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 text-sm text-neutral-500 mb-3">
          <span>Cart</span>
          <span>›</span>
          <span className="text-neutral-300">Checkout</span>
          <span>›</span>
          <span>Success</span>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>

        <p className="text-neutral-400 mt-3 text-sm max-w-md">
          Review your order and complete your purchase securely.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        {/* LEFT */}
        <div className="space-y-8">
          {/* Section label */}
          <div className="text-sm text-neutral-500 uppercase tracking-wide">
            Shipping & Payment
          </div>

          <CheckoutForm
            address={address}
            setAddress={setAddress}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-24 space-y-6">
            {/* Section label */}
            <div className="text-sm text-neutral-500 uppercase tracking-wide">
              Summary
            </div>

            <OrderSummary address={address} paymentMethod={paymentMethod} />

            {/* Extra info (adds realism) */}
            <div className="text-xs text-neutral-500 leading-relaxed">
              <p>Estimated delivery: 3–5 business days</p>
              <p className="mt-1">
                Taxes and shipping fees will be calculated at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
