import OrdersList from "@/components/orders/OrdersList";

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-white">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <OrdersList />
    </div>
  );
}
