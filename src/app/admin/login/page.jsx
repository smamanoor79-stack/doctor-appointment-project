"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Incorrect password");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#16302A] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl"
      >
        <h1 className="font-semibold text-xl mb-1 text-[#0E1512]">Admin Login</h1>
        <p className="text-sm text-[#4B564F] mb-6">Enter the admin password to continue.</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full border border-[#E3DDD0] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#16302A]/30 mb-3"
        />

        {error && (
          <p className="text-sm text-red-500 mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-[#16302A] text-white font-semibold py-3 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}