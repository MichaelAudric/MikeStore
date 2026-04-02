import { apiFetch } from "@/lib/api";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiFetch(`/products/${id}`, {
    cache: "no-store",
    method: "GET",
  });

  console.log(res);

  if (!res.ok) {
    return <div>Product not found</div>;
  }

  const product = await res.json();

  return (
    <div className="max-w-5xl mx-auto pt-6 px-4 mb-10">
      {/* Back link on top-left */}
      <div className="mb-10">
        <Link
          href="/products"
          className="text-lg font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          &larr; Back to Products
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Product Image */}
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-xl max-h-[520px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="
                w-full h-full object-cover
                transition-transform duration-500
                hover:scale-105 hover:brightness-110
              "
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>

            <p className="text-2xl font-semibold text-white">
              ${product.price.toFixed(2)}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-neutral-400">
                Sold by: {product.createdBy?.name || "Unknown"}
              </p>
              <p
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-400" : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            </div>

            <p className="text-neutral-400 leading-relaxed mt-12">
              {product.description}
            </p>
          </div>

          {/* Action Section */}
          <div className="pt-6 border-t border-neutral-800">
            {product.stock > 0 ? (
              <AddToCartButton productId={product.id} quantity={1} />
            ) : (
              <button
                disabled
                className="w-full bg-neutral-700 text-neutral-400 py-3 rounded-lg cursor-not-allowed"
              >
                Out of stock
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
