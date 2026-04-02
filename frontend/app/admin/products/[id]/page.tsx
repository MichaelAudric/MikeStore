import { cookies } from "next/headers";
import EditProductForm from "@/components/admin/products/EditProductForm";

async function getProduct(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    headers: {
      Cookie: `token=${token}`,
    },
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) return null;

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return <div className="p-6 text-white">Product not found</div>;
  }

  return <EditProductForm product={product} />;
}
