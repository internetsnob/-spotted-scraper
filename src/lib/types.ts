/**
 * Shared types for Spotted In & Around scraper system.
 *
 * ScrapedEvent   — one event pulled from a venue's website
 * VenueResult    — the full scrape output for one venue (status + any events found)
 * ScrapeRun      — the top-level result of one full scrape cycle (all venues)
 * SpotlightEntry — a selected event the user picked from the dashboard
 */

import { Venue } from "@/data/venues";

/** A single event found on a venue's site */
export interface ScrapedEvent {
  venueId: string;
  venueName: string;
  title: string;           // e.g. "Live Music: The Drifters"
  date: string;            // ISO date string: "2026-02-07"
  timeStart?: string;      // "18:00" (6 PM)
  timeEnd?: string;        // "21:00" (9 PM)
  description?: string;    // short blurb pulled from the page
  coverCharge?: string;    // e.g. "$5" or "Free"
  sourceUrl: string;       // the exact URL this was scraped from
}

/** Result of scraping one venue */
export interface VenueResult {
  venue: Venue;
  status: "success" | "error" | "no-events";
  events: ScrapedEvent[];
  error?: string;          // error message if status === "error"
  scrapedAt: string;       // ISO timestamp
}

/** The full output of one scrape run */
export interface ScrapeRun {
  runId: string;           // e.g. "2026-02-02T06:00:00Z"
  startedAt: string;
  completedAt: string;
  results: VenueResult[];
  totalEvents: number;
  totalErrors: number;
}

/** A user-selected spotlight event (saved to disk) */
export interface SpotlightEntry {
  event: ScrapedEvent;
  selectedAt: string;      // when the user clicked "Select as Spotlight"
  weekOf: string;          // ISO date of the Monday of that week
  status: "pending" | "posted";
}
