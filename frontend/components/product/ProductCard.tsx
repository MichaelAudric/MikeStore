import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="
        group
        bg-neutral-900/80 backdrop-blur
        rounded-2xl
        overflow-hidden
        border border-neutral-800
        transition-all duration-300
        hover:border-neutral-700
        hover:-translate-y-1
        hover:shadow-xl hover:shadow-black/40
      "
    >
      {/* Image */}
      <div className="relative aspect-square bg-neutral-800 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="
              w-full h-full
              object-cover
              transition-all duration-500
              group-hover:scale-105
              group-hover:brightness-110
            "
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">
            No Image
          </div>
        )}

        {/* Subtle gradient overlay (premium feel) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white rounded">
            Out of stock
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-between min-h-[100px]">
        {/* Name */}
        <h3 className="text-sm font-medium text-neutral-200 leading-tight line-clamp-2">
          {product.name}
        </h3>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-semibold text-white">
            ${product.price.toFixed(2)}
          </p>

          {product.stock > 0 ? (
            <span className="text-xs text-neutral-400">
              {product.stock} {product.stock > 1 ? "items" : "item"}
            </span>
          ) : (
            <span className="text-xs text-red-400">Unavailable</span>
          )}
        </div>
      </div>
    </Link>
  );
}
