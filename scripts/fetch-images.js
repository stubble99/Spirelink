import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const nodesPath = path.join(__dirname, "../data/defect/orbweaver/nodes.json");

function main() {
  console.log("🖼️  Constructing card portrait URLs...\n");

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

  // Process each node
  for (const node of nodes) {
    // Only process cards (skip mechanics and relics)
    if (node.type !== "card") {
      continue;
    }

    // Skip if already has image_url
    if (node.image_url && node.image_url.length > 0) {
      console.log(`⊘ ${node.label} (already has image)`);
      skipped++;
      continue;
    }

    // Construct image URL using the pattern
    const imageUrl = `https://sts2json.untapped.gg/art/card_portraits/defect/${node.id}.png`;
    node.image_url = imageUrl;

    console.log(`→ ${node.label}`);
    console.log(`  ✓ ${imageUrl}`);
    updated++;
  }

  // Write updated nodes back to disk
  try {
    fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2) + "\n");
    console.log(`\n✅ Complete!\n`);
    console.log(`Updated:  ${updated}`);
    console.log(`Skipped:  ${skipped}`);
  } catch (error) {
    console.error(`✗ Failed to write nodes.json: ${error.message}`);
    process.exit(1);
  }
}

main();
