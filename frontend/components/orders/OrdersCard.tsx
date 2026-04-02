import Link from "next/link";

export default function OrdersCard({ order }: any) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const statusStyles: Record<string, string> = {
    PAID: "bg-green-500 text-white",
    PENDING: "bg-yellow-500 text-black",
    CANCELLED: "bg-red-500 text-white",
    REFUNDED: "bg-gray-500 text-white",
  };

  return (
    <Link
      key={order.id}
      href={`/orders/${order.id}`}
      aria-label={`View details for order ${order.id}`}
      className="
        block bg-neutral-900 border border-neutral-800 rounded-xl p-6
        hover:bg-neutral-800 hover:scale-[1.01] hover:shadow-lg transition-all duration-200
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="font-medium">Order ID: {order.id.slice(0, 8)}</p>
        <p className="text-sm text-neutral-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Product Images */}
      <div className="my-4 flex flex-wrap gap-2">
        {order.orderItems.slice(0, 3).map((item: any) => (
          <div key={item.id} className="w-20 h-20 sm:w-24 sm:h-24 relative">
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
        {order.orderItems.length > 3 && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-neutral-700 rounded text-sm">
            +{order.orderItems.length - 3} more
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-center text-sm text-neutral-300">
        <p>Total Paid: {formatCurrency(order.totalPaid)}</p>
        <span
          className={`px-2 py-1 rounded text-xs ${statusStyles[order.orderStatus] || "bg-neutral-700 text-white"}`}
        >
          {order.orderStatus}
        </span>
      </div>
    </Link>
  );
}
