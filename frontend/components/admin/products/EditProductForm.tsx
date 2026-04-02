"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || 0,
    stock: product.stock || 0,
    imageUrl: product.imageUrl || "",
    description: product.description || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "price" || e.target.name === "stock"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  // ✅ UPDATE PRODUCT
  const handleUpdate = async () => {
    try {
      setLoading(true);

      await apiFetch(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });

      router.push("/admin/products");
    } catch (e) {
      console.error(e);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE PRODUCT
  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this product?");
    if (!confirmDelete) return;

    try {
      setLoading(true);

      await apiFetch(`/products/${product.id}`, {
        method: "DELETE",
      });

      router.push("/admin/products");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-semibold mt-8">Edit Product</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 flex gap-8 mb-6">
        {/* IMAGE PREVIEW */}
        <div className="w-[30%]">
          <img src={form.imageUrl} className="object-cover rounded w-full" />
        </div>
        <div className="space-y-6 flex flex-col w-[70%]">
          {/* NAME */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />

          {/* PRICE */}
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />

          {/* STOCK */}
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />

          {/* IMAGE URL */}
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />

          {/* ACTIONS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 rounded hover:opacity-90 cursor-pointer"
              disabled={loading}
            >
              Delete
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-white text-black rounded hover:opacity-90 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
