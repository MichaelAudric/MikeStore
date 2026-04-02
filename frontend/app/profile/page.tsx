"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");

  if (!user) {
    return (
      <div className="text-center py-20 text-white">You are not logged in.</div>
    );
  }

  const handleSave = async () => {
    const res = await apiFetch("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({ name, address }),
    });
    const profile = await res.json();
    setUser(profile);
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>

      {/* Profile Info Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-lg">
        {/* Email */}
        <div>
          <p className="text-neutral-400 text-sm">Email</p>
          <p className="text-lg">{user.email}</p>
        </div>

        {/* Name */}
        <div>
          <p className="text-neutral-400 text-sm">
            {user.role === "USER" ? "Name" : "Store Name"}
          </p>
          {editing ? (
            <input
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="text-lg">{user.name}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <p className="text-neutral-400 text-sm">
            {user.role === "USER" ? "Address" : "Store Address"}
          </p>
          {editing ? (
            <textarea
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-lg">{user.address}</p>
          )}
        </div>

        {/* Edit / Save Button */}
        {editing ? (
          <button
            type="button"
            onClick={handleSave}
            className="w-full mt-4 py-3 bg-white text-black rounded-lg font-semibold hover:bg-neutral-300 transition cursor-pointer"
          >
            Save
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="w-full mt-4 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

      {/* My Orders Button */}
      {user.role === "USER" && (
        <div className="mt-6 text-center">
          <Link
            href="/orders"
            className="inline-block w-full max-w-xs px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition cursor-pointer"
          >
            My Orders
          </Link>
        </div>
      )}
    </div>
  );
}
