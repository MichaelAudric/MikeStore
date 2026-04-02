"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { useOrderStore } from "@/store/order";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const clearCartUI = useCartStore((state) => state.clearCartUI);
  const clearOrderUI = useOrderStore((state) => state.clearOrderUI);
  const userLogout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await apiFetch(`/auth/logout`, {
      method: "POST",
    });
    setUser(null);
    clearCartUI();
    clearOrderUI();
    userLogout();
    router.push("/");
  };

  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) return null;

  return (
    <nav className="w-full border-b border-neutral-800 bg-black text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-neutral-200 transition"
          >
            Mike's Store
          </Link>

          {user?.role === "USER" && (
            <Link
              href="/products"
              className="text-neutral-400 hover:text-neutral-200 transition"
            >
              Shop
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-8 text-sm ml-4">
          {user ? (
            <>
              {/* Cart or Admin */}
              {user?.role === "USER" ? (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-full hover:bg-neutral-800 transition text-base"
                >
                  🛒
                  {totalQuantity > 0 && (
                    <span className="absolute -top-0 -right-1.5 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  href="/admin"
                  className="relative p-2 rounded-full hover:bg-neutral-800 transition text-base"
                >
                  📊
                </Link>
              )}

              {/* User name */}
              <Link
                href="/profile"
                className="text-neutral-400 hover:text-neutral-200 transition text-base"
              >
                {user.name}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-500 transition hover:cursor-pointer text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-neutral-400 hover:text-neutral-200 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
