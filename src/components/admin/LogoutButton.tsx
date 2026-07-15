"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="w-full rounded-md bg-ink-100 px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-ink-200 disabled:opacity-60"
    >
      {loading ? "Odhlasujem…" : "Odhlásiť sa"}
    </button>
  );
}
