// app/components/cart/CheckoutButton.tsx (server component)
import Link from "next/link";

export default function CheckoutButton() {
  return (
    <div className="mt-4 w-full md:w-auto">
      <Link
        href="/cart/checkout"
        className="
          w-full md:w-auto px-6 py-3
          bg-white text-black
          rounded-lg
          font-medium
          hover:bg-neutral-200
          transition-all duration-200
          inline-block text-center
        "
      >
        Checkout
      </Link>
    </div>
  );
}
