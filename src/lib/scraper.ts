/**
 * scraper.ts — Core scraping engine for Spotted In & Around
 *
 * HOW IT WORKS (plain English):
 *   1. Reads the venue list from venues.ts
 *   2. For each venue, fetches their events/website page
 *   3. Parses the HTML looking for event-like content (dates, titles, times)
 *   4. Writes all results to data/scrape-results.json
 *
 * HOW TO RUN IT:
 *   npm run scrape
 *
 * WHY THIS APPROACH:
 *   - No API keys needed to start (just HTTP fetches + HTML parsing)
 *   - Works on any venue with a public website
 *   - Results are plain JSON — easy to read, easy to feed into the dashboard
 *   - When you're ready to add Google Places API or Facebook Events API later,
 *     you just add another scrape function here and call it in the same loop.
 */

import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { VENUES, Venue } from "../data/venues";
import { ScrapedEvent, VenueResult, ScrapeRun } from "./types";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

/** How long (ms) to wait between requests so we don't hammer venue servers */
const DELAY_MS = 1500;

/** Where results get written */
const OUTPUT_PATH = path.resolve(__dirname, "../../data/scrape-results.json");

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Sleep for N milliseconds. Used between requests to be a good citizen. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Tries to parse a date string into a clean ISO date (YYYY-MM-DD).
 * Returns null if it can't figure it out — we skip those rather than guess wrong.
 */
function parseDate(raw: string): string | null {
  const cleaned = raw.trim().replace(/[,]/g, "");
  const attempt = new Date(cleaned);
  if (isNaN(attempt.getTime())) return null;
  return attempt.toISOString().split("T")[0];
}

/**
 * Tries to extract a time like "6:00 PM" or "18:00" from a string.
 * Returns 24-hour format or null.
 */
function parseTime(raw: string): string | null {
  // Match patterns like "6:00 PM", "6pm", "18:00"
  const match = raw.match(/(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const period = match[3]?.toLowerCase();

  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

// ─── SCRAPER ─────────────────────────────────────────────────────────────────

/**
 * Scrapes one venue's website for events.
 *
 * STRATEGY: Most local venue sites use one of a few patterns:
 *   - A dedicated /events page with event cards
 *   - An embedded calendar widget (Facebook, Eventbrite, etc.)
 *   - A simple list of upcoming dates in text
 *
 * We look for common HTML patterns: elements containing date-like text
 * near event-title-like text. This is intentionally loose — better to
 * pull in a few false positives than miss real events. The human curation
 * step on the dashboard catches anything weird.
 */
async function scrapeVenue(venue: Venue): Promise<VenueResult> {
  const scrapedAt = new Date().toISOString();

  try {
    const response = await axios.get(venue.website, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SpottedBot/1.0; +https://spottedwhathappens.com)",
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(response.data);
    const events: ScrapedEvent[] = [];

    // ── Strategy 1: Look for elements with common event-page classes/attributes ──
    // Many venue sites use classes like "event", "event-card", "event-item", etc.
    const eventSelectors = [
      ".event",
      ".event-card",
      ".event-item",
      ".events-list-item",
      '[class*="event"]',
      ".tribe-events-calendar-day",       // The Events Calendar plugin (very common)
      ".tribe-events-list-event-title",
      ".eventbrite-widget-iframe",
    ];

    eventSelectors.forEach((selector) => {
      $(selector).each((_, el) => {
        const $el = $(el);
        const text = $el.text().trim();
        if (!text || text.length < 10) return; // skip empty/tiny elements

        // Try to find a date in this block
        const dateMatch = text.match(
          /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,?\s+\d{4})?)\b/i
        );
        if (!dateMatch) return;

        const date = parseDate(dateMatch[1]);
        if (!date) return;

        // Only include future events (or today)
        const today = new Date().toISOString().split("T")[0];
        if (date < today) return;

        // Extract title — usually the first heading or strong text
        const title =
          $el.find("h1, h2, h3, h4, h5, strong, .event-title").first().text().trim() ||
          text.split("\n")[0].trim();

        // Extract time if present
        const timeMatch = text.match(/(\d{1,2}:\d{2}\s*(?:am|pm))\s*[-–]?\s*(\d{1,2}:\d{2}\s*(?:am|pm))?/i);
        const timeStart = timeMatch ? parseTime(timeMatch[1]) : undefined;
        const timeEnd = timeMatch?.[2] ? parseTime(timeMatch[2]) : undefined;

        // Extract cover charge if mentioned
        const coverMatch = text.match(/(?:cover|admission|entry)[:\s]*\$?(\d+)|(\$\d+)\s*(?:cover|admission)/i);
        const coverCharge = coverMatch
          ? coverMatch[1]
            ? `$${coverMatch[1]}`
            : coverMatch[2]
          : text.toLowerCase().includes("free")
          ? "Free"
          : undefined;

        // Avoid duplicates (same title + same date)
        const isDupe = events.some(
          (e) => e.title === title && e.date === date
        );
        if (isDupe) return;

        events.push({
          venueId: venue.id,
          venueName: venue.name,
          title: title.substring(0, 100), // cap length
          date,
          timeStart,
          timeEnd,
          description: text.substring(0, 200).replace(/\s+/g, " ").trim(),
          coverCharge,
          sourceUrl: venue.website,
        });
      });
    });

    // ── Strategy 2: If Strategy 1 found nothing, do a looser full-page scan ──
    if (events.length === 0) {
      const fullText = $("body").text();
      const lines = fullText.split("\n").map((l) => l.trim()).filter(Boolean);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const dateMatch = line.match(
          /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,?\s+\d{4})?)\b/i
        );
        if (!dateMatch) continue;

        const date = parseDate(dateMatch[1]);
        if (!date) continue;

        const today = new Date().toISOString().split("T")[0];
        if (date < today) continue;

        // Use this line + next line as the event description
        const context = [line, lines[i + 1] || ""].join(" ").trim();
        const title = line.substring(0, 80);

        const isDupe = events.some((e) => e.title === title && e.date === date);
        if (isDupe) continue;

        events.push({
          venueId: venue.id,
          venueName: venue.name,
          title,
          date,
          description: context.substring(0, 200),
          sourceUrl: venue.website,
        });

        // Cap at 5 events per venue from loose scanning
        if (events.length >= 5) break;
      }
    }

    return {
      venue,
      status: events.length > 0 ? "success" : "no-events",
      events,
      scrapedAt,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      venue,
      status: "error",
      events: [],
      error: message,
      scrapedAt,
    };
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function runScrape(): Promise<void> {
  const startedAt = new Date().toISOString();
  console.log(`\n🔍 Spotted scraper starting at ${startedAt}`);
  console.log(`   Scraping ${VENUES.length} venues...\n`);

  const results: VenueResult[] = [];

  for (const venue of VENUES) {
    console.log(`  → ${venue.name}...`);
    const result = await scrapeVenue(venue);

    if (result.status === "success") {
      console.log(`    ✓ Found ${result.events.length} event(s)`);
    } else if (result.status === "no-events") {
      console.log(`    — No events found`);
    } else {
      console.log(`    ✗ Error: ${result.error}`);
    }

    results.push(result);

    // Polite delay between requests
    await sleep(DELAY_MS);
  }

  const completedAt = new Date().toISOString();
  const totalEvents = results.reduce((sum, r) => sum + r.events.length, 0);
  const totalErrors = results.filter((r) => r.status === "error").length;

  const scrapeRun: ScrapeRun = {
    runId: startedAt,
    startedAt,
    completedAt,
    results,
    totalEvents,
    totalErrors,
  };

  // Write results to JSON
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(scrapeRun, null, 2));

  console.log(`\n✅ Scrape complete.`);
  console.log(`   Total events found: ${totalEvents}`);
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Results saved to: ${OUTPUT_PATH}\n`);
}

// Run it
runScrape().catch(console.error);
