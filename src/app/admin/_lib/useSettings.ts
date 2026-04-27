"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Settings } from "@/lib/data";

export function useSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401) { router.push("/admin"); return; }
      const j = await res.json();
      if (!cancelled) { setSettings(j); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const patch = useCallback((updater: (s: Settings) => Settings) => {
    setSettings(prev => (prev ? updater(prev) : prev));
  }, []);

  const save = useCallback(async () => {
    if (!settings) return;
    setSaving(true); setSaveError(""); setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else {
        const j = await res.json().catch(() => ({}));
        setSaveError(j.error ? `Failed: ${j.error}` : "Failed to save settings.");
      }
    } finally {
      setSaving(false);
    }
  }, [settings]);

  return { settings, loading, saving, saved, saveError, patch, save };
}
