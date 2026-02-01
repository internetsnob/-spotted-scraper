import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "data", "scrape-results.json");
  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No scrape data yet. Path checked: " + filePath }, { status: 404 });
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read scrape results" }, { status: 500 });
  }
}
