"use client";

import { useEffect, useState } from "react";
import { FaEye, FaUsers } from "react-icons/fa";

interface ViewCounterProps {
  pageId: string;
  showLabel?: boolean;
}

interface ViewStats {
  totalViews: number;
  uniqueViews: number;
}

export default function ViewCounter({ pageId, showLabel = true }: ViewCounterProps) {
  const [stats, setStats] = useState<ViewStats>({ totalViews: 0, uniqueViews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackView = async () => {
      try {
        const namespace = "rgndunes-portfolio";
        const baseUrl = "https://api.counterapi.dev/v1";
        const localStorageKey = `portfolio_visited_${pageId}`;

        const totalResponse = await fetch(
          `${baseUrl}/${namespace}/${pageId}-total/up`
        );
        if (!totalResponse.ok) throw new Error("Total views API failed");
        const totalData = await totalResponse.json();
        const totalViews = totalData.count || 0;

        const cachedData = localStorage.getItem(localStorageKey);
        let uniqueViews = 0;

        if (!cachedData) {
          const uniqueResponse = await fetch(
            `${baseUrl}/${namespace}/${pageId}-unique/up`
          );
          if (!uniqueResponse.ok) throw new Error("Unique views API failed");
          const uniqueData = await uniqueResponse.json();
          uniqueViews = uniqueData.count || 0;

          localStorage.setItem(
            localStorageKey,
            JSON.stringify({
              firstVisit: Date.now(),
              uniqueCount: uniqueViews,
            })
          );
        } else {
          const parsed = JSON.parse(cachedData);
          uniqueViews = parsed.uniqueCount || 0;
        }

        setStats({ totalViews, uniqueViews });
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    trackView();
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
        <span className="flex items-center gap-1.5">
          <FaEye className="h-3 w-3 animate-pulse" />
          Loading
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
      <span className="flex items-center gap-1.5">
        <FaEye className="h-3 w-3" />
        <span className="text-ink">{stats.totalViews.toLocaleString()}</span>
        {showLabel && <span>views</span>}
      </span>
      <span className="flex items-center gap-1.5">
        <FaUsers className="h-3 w-3" />
        <span className="text-ink">{stats.uniqueViews.toLocaleString()}</span>
        {showLabel && <span>visitors</span>}
      </span>
    </div>
  );
}
