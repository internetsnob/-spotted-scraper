"use client";
/**
 * Dashboard — Spotted In & Around Scraper
 *
 * This is your Monday morning interface.
 *
 * WHAT IT SHOWS:
 *   - When the last scrape ran
 *   - All events found, grouped by venue
 *   - A "Select as Spotlight" button on each event
 *   - Your current spotlight pick (if any)
 *
 * HOW IT WORKS:
 *   1. On load, it fetches /api/scrape-results (the JSON the scraper wrote)
 *   2. It renders the data into cards
 *   3. When you click "Select as Spotlight," it saves your pick to the server
 *
 * "use client" at the top means this page runs in the browser (not on the server).
 * We need that because it uses React state (useState) and fetches data on load (useEffect).
 */

import { useState, useEffect } from "react";
import type { ScrapeRun, ScrapedEvent, VenueResult } from "@/lib/types";

// --- CATEGORY COLORS ---------------------------------------------------------
const CATEGORY_COLORS: Record<string, string> = {
  "Live Music": "bg-green-100 text-green-800",
  "Food & Drink": "bg-amber-100 text-amber-800",
  "Arts & Culture": "bg-purple-100 text-purple-800",
  Outdoors: "bg-blue-100 text-blue-800",
};

// --- COMPONENT ---------------------------------------------------------------
export default function Dashboard() {
  const [data, setData] = useState<ScrapeRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState<ScrapedEvent | null>(null);
  const [filter, setFilter] = useState<string>("All");

  // -- Fetch scrape results on page load --
  useEffect(() => {
    fetch("/api/scrape-results")
      .then((res) => {
        if (!res.ok) throw new Error("No scrape data yet");
        return res.json();
      })
      .then((json: ScrapeRun) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });

    // Load the current spotlight from the server
    fetch("/api/spotlight")
      .then((res) => res.json())
      .then((data) => {
        if (data.event) {
          setSpotlight(data.event);
        }
      })
      .catch(() => {
        // No spotlight saved yet, that's fine
      });
  }, []);

  // -- Save spotlight to server when selected --
  const handleSelectSpotlight = (event: ScrapedEvent) => {
    setSpotlight(event);
    fetch("/api/spotlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    }).catch((err) => {
      console.error("Failed to save spotlight:", err);
      alert("Failed to save spotlight. Check console for details.");
    });
  };

  // -- Clear spotlight --
  const handleClearSpotlight = () => {
    setSpotlight(null);
    // Optionally delete the spotlight file on server
    // For now, just clear it locally
  };

  // -- Filter results --
  const filteredResults = data?.results.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Has Events") return r.events.length > 0;
    if (filter === "Errors") return r.status === "error";
    return r.venue.category === filter;
  }) ?? [];

  // --- RENDER ----------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">??</div>
          <p>Loading scrape results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">??</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No data yet</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-1">Run the scraper first:</p>
            <code className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
              npm run scrape
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* -- Header -- */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ?? Spotted Scraper Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Review what the scraper found. Pick your weekly spotlight.
            </p>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Last scrape: {data ? new Date(data.completedAt).toLocaleString() : "—"}</p>
            <p>Events found: {data?.totalEvents ?? 0} | Errors: {data?.totalErrors ?? 0}</p>
          </div>
        </div>
      </div>

      {/* -- Current Spotlight -- */}
      {spotlight && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
                ? Current Spotlight
              </p>
              <h3 className="text-lg font-bold text-gray-900">{spotlight.title}</h3>
              <p className="text-sm text-gray-600">
                {spotlight.venueName} · {spotlight.date}
                {spotlight.timeStart && ` · ${spotlight.timeStart}`}
              </p>
            </div>
            <button
              onClick={handleClearSpotlight}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear ?
            </button>
          </div>
        </div>
      )}

      {/* -- Filters -- */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Has Events", "Live Music", "Food & Drink", "Arts & Culture", "Outdoors", "Errors"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {f}
            </button>
          )
        )}
      </div>

      {/* -- Venue Cards -- */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <VenueCard
            key={result.venue.id}
            result={result}
            isSpotlight={spotlight?.venueId === result.venue.id && spotlight?.title !== undefined}
            onSelectSpotlight={handleSelectSpotlight}
            currentSpotlight={spotlight}
          />
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No venues match this filter.</p>
        </div>
      )}
    </div>
  );
}

// --- VENUE CARD COMPONENT ----------------------------------------------------

function VenueCard({
  result,
  onSelectSpotlight,
  currentSpotlight,
}: {
  result: VenueResult;
  isSpotlight: boolean;
  onSelectSpotlight: (event: ScrapedEvent) => void;
  currentSpotlight: ScrapedEvent | null;
}) {
  const [expanded, setExpanded] = useState(result.events.length > 0);
  const { venue, events, status, error } = result;
  const colorClass = CATEGORY_COLORS[venue.category] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Venue header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            {venue.category}
          </span>
          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
          {status === "error" && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Error</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {events.length} event{events.length !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-300">{expanded ? "?" : "?"}</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100">
          {status === "error" && (
            <div className="p-4 bg-red-50">
              <p className="text-sm text-red-600">?? {error}</p>
            </div>
          )}

          {events.length === 0 && status !== "error" && (
            <div className="p-4 text-sm text-gray-400 italic">
              No upcoming events found on their site.
            </div>
          )}

          {events.map((event, i) => {
            const isCurrentSpotlight =
              currentSpotlight?.venueId === event.venueId &&
              currentSpotlight?.title === event.title &&
              currentSpotlight?.date === event.date;

            return (
              <div
                key={i}
                className={`p-4 border-t border-gray-100 flex items-start justify-between ${
                  isCurrentSpotlight ? "bg-green-50" : ""
                }`}
              >
                <div className="flex-1 pr-4">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <div className="flex gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                    <span>?? {event.date}</span>
                    {event.timeStart && (
                      <span>?? {event.timeStart}{event.timeEnd ? ` – ${event.timeEnd}` : ""}</span>
                    )}
                    {event.coverCharge && <span>?? {event.coverCharge}</span>}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{event.description}</p>
                  )}
                  
                    href={event.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                  >
                    View source ?
                  </a>
                </div>
                <button
                  onClick={() => onSelectSpotlight(event)}
                  disabled={isCurrentSpotlight}
                  className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    isCurrentSpotlight
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-800"
                  }`}
                >
                  {isCurrentSpotlight ? "? Spotlight" : "Select as Spotlight"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
