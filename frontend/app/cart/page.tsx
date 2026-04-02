import CartItemsList from "@/components/cart/CartItemsList";
import CartTotal from "@/components/cart/CartTotal";
import CheckoutButton from "@/components/cart/CheckoutButton";

export default async function CartPage() {
  return (
    <div className="max-w-6xl mx-auto mt-16 px-6">
      <h1 className="text-3xl font-semibold text-white mb-10 tracking-tight">
        Shopping Cart
      </h1>

      <CartItemsList />

      <div className="flex flex-col items-end mt-12 gap-4 mb-16">
        <CartTotal />
        <CheckoutButton />
      </div>
    </div>
  );
}
