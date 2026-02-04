"use client";
/**
 * /weekly — Public Spotlight Page
 * 
 * This is the shareable link you post on Instagram.
 * Shows the current week's featured event in a mobile-optimized card.
 */

import { useState, useEffect } from "react";
import type { SpotlightEntry } from "@/lib/types";

export default function WeeklyPage() {
  const [spotlight, setSpotlight] = useState<SpotlightEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotlight")
      .then((res) => res.json())
      .then((data) => {
        if (data.event) {
          setSpotlight(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!spotlight) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">??</div>
          <h1 className="text-2xl font-bold text-white mb-2">No spotlight yet</h1>
          <p className="text-gray-300">Check back soon for this week's featured event!</p>
        </div>
      </div>
    );
  }

  const { event } = spotlight;
  const eventDate = new Date(event.date);
  const dayName = eventDate.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">??</div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            Spotted This Week
          </h1>
          <p className="text-green-200 text-sm mt-1">
            {spotlight.weekOf ? `Week of ${new Date(spotlight.weekOf).toLocaleDateString("en-US", { month: "long", day: "numeric" })}` : ""}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
              {event.venueName}
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {event.title}
            </h2>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-xl">??</span>
                <span className="font-medium">{dayName}, {monthDay}</span>
              </div>
              {event.timeStart && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">??</span>
                  <span className="font-medium">
                    {event.timeStart}{event.timeEnd ? ` – ${event.timeEnd}` : ""}
                  </span>
                </div>
              )}
              {event.coverCharge && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-xl">??</span>
                  <span className="font-medium">{event.coverCharge}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {event.description}
              </p>
            )}

            
              href={event.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              View Details ?
            </a>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-green-100 text-sm">
            Spotted In & Around • Hill Country Events
          </p>
        </div>
      </div>
    </div>
  );
}
