import { useEffect } from "react";
import { useLocation } from "wouter";
import { BASE } from "@/lib/api";

export function usePageTracker() {
  const [location] = useLocation();

  useEffect(() => {
    fetch(`${BASE}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location }),
    }).catch(() => {});
  }, [location]);
}
