import { useEffect } from "react";
import { useLocation } from "wouter";

export function usePageTracker() {
  const [location] = useLocation();

  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location }),
    }).catch(() => {});
  }, [location]);
}
