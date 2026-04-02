"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(currentSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      router.push(`/products?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, router]);

  return (
    <div className="mb-10">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full rounded-lg bg-neutral-900 border border-neutral-800 px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-purple-500 transition"
      />
    </div>
  );
}
