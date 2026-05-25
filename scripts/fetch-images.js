import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nodesPath = path.join(__dirname, "../data/defect/orbweaver/nodes.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchImageUrl(wikiUrl) {
  try {
    const response = await fetch(wikiUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    // Try og:image meta tag first (most reliable)
    let imageUrl = $('meta[property="og:image"]').attr("content");
    if (imageUrl) return imageUrl;

    // Fall back to og:image:url
    imageUrl = $('meta[property="og:image:url"]').attr("content");
    if (imageUrl) return imageUrl;

    // Try twitter:image
    imageUrl = $('meta[name="twitter:image"]').attr("content");
    if (imageUrl) return imageUrl;

    // Look for prominent img elements (typically in header or card display area)
    const images = $("img[src*='card'], img[src*='art'], img[src*='image']");
    if (images.length > 0) {
      imageUrl = $(images[0]).attr("src");
      if (imageUrl) {
        // Make URL absolute if relative
        if (imageUrl.startsWith("/")) {
          const urlObj = new URL(wikiUrl);
          return `${urlObj.origin}${imageUrl}`;
        }
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error(`  ✗ Failed to fetch ${wikiUrl}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log("📸 Fetching card images from Untapped.GG...\n");

  // Read nodes
  let nodes;
  try {
    const data = fs.readFileSync(nodesPath, "utf-8");
    nodes = JSON.parse(data);
  } catch (error) {
    console.error(`✗ Failed to read nodes.json: ${error.message}`);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  // Process each node
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // Only process cards with wiki_url and empty image_url
    if (!node.wiki_url) {
      continue;
    }

    if (node.image_url && node.image_url.length > 0) {
      console.log(`⊘ ${node.label} (already has image)`);
      skipped++;
      continue;
    }

    console.log(`→ ${node.label}...`);

    const imageUrl = await fetchImageUrl(node.wiki_url);
    if (imageUrl) {
      node.image_url = imageUrl;
      console.log(`  ✓ Found: ${imageUrl.substring(0, 60)}...`);
      updated++;
    } else {
      console.log(`  ✗ No image found`);
      failed++;
    }

    // Be polite to the server — 1 second delay between requests
    if (i < nodes.length - 1) {
      await delay(1000);
    }
  }

  // Write updated nodes back to disk
  try {
    fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2) + "\n");
    console.log(`\n✅ Complete!\n`);
    console.log(`Updated:  ${updated}`);
    console.log(`Skipped:  ${skipped}`);
    console.log(`Failed:   ${failed}`);
  } catch (error) {
    console.error(`✗ Failed to write nodes.json: ${error.message}`);
    process.exit(1);
  }
}

main();
