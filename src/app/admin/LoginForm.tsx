"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stone-900 rounded-2xl p-8 space-y-5 border border-stone-800">
      <div>
        <label className="block text-sm font-medium text-stone-400 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password"
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-torii-700 focus:border-transparent"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="w-full py-3 bg-torii-700 text-white rounded-xl font-semibold hover:bg-torii-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
