import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { apiFetch } from "@/lib/api";
import SearchBar from "@/components/product/SearchBar";

async function getProducts(search: string, page: number) {
  const res = await apiFetch(
    `/products?search=${encodeURIComponent(search)}&page=${page}&limit=8`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products.");
  }

  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;

  const data = await getProducts(search, page);
  const products = data.products;
  const totalPages = data.totalPages;

  return (
    <div className="max-w-7xl mx-auto px-6 py-15">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          All Items
        </h1>
        <p className="text-neutral-400 mt-2">Explore what we have in store</p>
      </div>

      <SearchBar />

      {/* Empty state */}
      {products.length === 0 ? (
        <p className="text-neutral-400">No products found.</p>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="transition-all duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-4 items-center text-white">
            <Link
              href={`/products?search=${search}&page=${Math.max(page - 1, 1)}`}
              className={`px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 transition ${
                page === 1 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Prev
            </Link>

            <span className="text-neutral-300">
              Page {page} of {totalPages}
            </span>

            <Link
              href={`/products?search=${search}&page=${Math.min(
                page + 1,
                totalPages,
              )}`}
              className={`px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 transition ${
                page === totalPages ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Next
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
