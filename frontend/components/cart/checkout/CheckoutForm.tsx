"use client";

export default function CheckoutForm({
  address,
  setAddress,
  paymentMethod,
  setPaymentMethod,
}: {
  address: any;
  setAddress: (val: string) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Shipping Address
        </h2>

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full shipping address"
          rows={4}
          className="
            w-full px-4 py-3
            bg-neutral-800 border border-neutral-700
            rounded-lg text-white
            placeholder:text-neutral-500
            focus:outline-none focus:ring-1 focus:ring-neutral-500
            transition
          "
        />
      </div>

      {/* Payment Method */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="
            w-full px-4 py-3
            bg-neutral-800 border border-neutral-700
            rounded-lg text-white
            focus:outline-none focus:ring-1 focus:ring-neutral-500
            hover:bg-neutral-700
            transition cursor-pointer
          "
        >
          <option value="Card">💳 Card</option>
          <option value="PayPal">🅿️ PayPal</option>
          <option value="Cash">💵 Cash on Delivery</option>
        </select>

        {/* Small UX note */}
        <p className="text-xs text-neutral-500 mt-3">
          This is a mock payment method for demo purposes.
        </p>
      </div>
    </div>
  );
}
