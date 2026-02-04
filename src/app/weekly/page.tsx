import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import type { SpotlightEntry, ScrapedEvent } from "@/lib/types";

const SPOTLIGHT_FILE = path.resolve(process.cwd(), "data", "spotlight.json");

export async function GET() {
  try {
    if (!fs.existsSync(SPOTLIGHT_FILE)) {
      return NextResponse.json({ spotlight: null });
    }
    const raw = fs.readFileSync(SPOTLIGHT_FILE, "utf-8");
    const data: SpotlightEntry = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read spotlight" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event: ScrapedEvent = body.event;
    if (!event) {
      return NextResponse.json({ error: "Missing event data" }, { status: 400 });
    }
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const weekOf = monday.toISOString().split("T")[0];
    const spotlightEntry: SpotlightEntry = {
      event,
      selectedAt: new Date().toISOString(),
      weekOf,
      status: "pending",
    };
    fs.writeFileSync(SPOTLIGHT_FILE, JSON.stringify(spotlightEntry, null, 2));
    return NextResponse.json({ success: true, spotlight: spotlightEntry });
  } catch (err) {
    return NextResponse.json({ error: "Failed to save spotlight" }, { status: 500 });
  }
}