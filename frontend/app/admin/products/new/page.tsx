"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    description: "",
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

  const handleCreate = async () => {
    try {
      setLoading(true);

      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(form),
      });

      router.push("/admin/products");
    } catch (e) {
      console.error(e);
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6 text-white">
      <h1 className="text-2xl font-semibold">Create Product</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 flex flex-col gap-5">
        {/* NAME */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>

        {/* PRICE */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>

        {/* STOCK */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Stock</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>

        {/* IMAGE URL */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="p-2 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>

        <button
          onClick={handleCreate}
          className="mt-4 px-4 py-2 bg-white text-black rounded hover:opacity-85 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </div>
  );
}
