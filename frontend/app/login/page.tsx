"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      const user = await apiFetch(`/auth/me`);
      const userJson = await user.json();
      setUser(userJson.user);

      router.push("/profile");
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-white text-center tracking-wide">
          Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
          />

          <button
            type="submit"
            className="w-full py-3 bg-white text-black rounded-lg hover:bg-neutral-300 transition font-semibold text-lg cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
