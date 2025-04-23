import { NextResponse } from "next/server";
import { chromium } from "playwright";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
    }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const fontFamilies = new Set();
    const fontFiles = new Set();
    const fontFileTypes = {};

    // Listen for font file network requests
    page.on("requestfinished", request => {
      const url = request.url();
      if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url)) {
        fontFiles.add(url);
        const ext = url.split('.').pop().split('?')[0].toUpperCase();
        fontFileTypes[url] = ext;
      }
    });

    // Timeout after 45 seconds
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

    // Collect all computed font families from all frames (main frame + iframes)
    async function collectFamiliesFromFrame(frame) {
      return await frame.evaluate(() => {
        const fams = new Set();
        function collectFonts(node) {
          if (node.nodeType === 1) {
            const style = window.getComputedStyle(node);
            fams.add(style.fontFamily);
            for (const child of node.children) collectFonts(child);
          }
        }
        collectFonts(document.body);
        return Array.from(fams).filter(Boolean);
      });
    }

    // Main frame
    const mainFamilies = await collectFamiliesFromFrame(page.mainFrame());
    mainFamilies.forEach(f => fontFamilies.add(f));

    // All iframes
    for (const frame of page.frames()) {
      if (frame !== page.mainFrame()) {
        try {
          const frameFamilies = await collectFamiliesFromFrame(frame);
          frameFamilies.forEach(f => fontFamilies.add(f));
        } catch {}
      }
    }

    await browser.close();

    return NextResponse.json({
      analyzedUrl: url,
      fontFamilies: Array.from(fontFamilies),
      fontFiles: Array.from(fontFiles).map(f => ({ url: f, type: fontFileTypes[f] || "Unknown" })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed to analyze fonts." }, { status: 500 });
  }
}
