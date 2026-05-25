# Getting Started with Spirelink

Two paths depending on what you want to do:
- [I want to use Spirelink during my runs](#using-spirelink)
- [I want to contribute card data or code](#contributing)

---

## Using Spirelink

### What you're looking at

Spirelink shows your deck as a graph — cards, relics, and mechanics as 
nodes, synergy relationships as edges between them.

**Solid nodes** — cards and relics you currently own  
**Dashed nodes** — synergy targets you don't have yet  
**Edge colours** — what kind of relationship connects two nodes:
  - Blue — Generates (this card produces that resource)
  - Purple — Amplifies (this card increases that card's power)
  - Green — Triggers (this card activates that mechanic)
  - Orange — Scales with (this card grows stronger as that resource grows)
  - Red dashed — Conflicts with (these two work against each other)

### Starting a run

1. Open Spirelink at [deployed URL]
2. Your starter cards are pre-loaded for the Defect
3. As you pick up new cards, click their node and hit "Add to Run"
4. Ghost nodes that pull into your cluster are your next priority picks
5. Red conflict edges tell you what to avoid

### Reading the graph

Click any node to see all its relationships explained in the sidebar.
The explanation tells you *why* the connection exists, not just that it does.

Hover without clicking to preview connections without locking the selection.

Use the edge type filters in the sidebar to isolate specific relationship 
types — filtering to "Conflicts with" immediately shows you what to avoid 
in your current build.

### What the graph can't tell you

Spirelink shows structural synergies, not situational value. 
A card might be theoretically synergistic but wrong for your 
specific run state, HP situation, or Act. Use the graph to 
understand *why* things connect — use your judgment for *whether* 
to take them in a given moment.

---

## Contributing

### Quickest useful contribution — fix stale data

If a card's cost, effect text, or rarity has changed in a recent EA patch:

1. Open `data/defect/orbweaver/nodes.json`
2. Find the card by its `id` field
3. Update the relevant field
4. Open a PR with the "Stale Data" issue template

No local setup needed — GitHub's web editor works fine for JSON changes.

### Add a missing card

If a card that belongs in a module isn't there yet:

1. Add a node entry to the relevant `nodes.json`
2. Add edge entries to the relevant `edges.json`  
3. Follow the schema in CONTRIBUTING.md
4. The edge `desc` field is the most important part — explain *why* 
   the connection exists, not just that it does

### Run locally

Requirements: Node.js 18+

```bash
git clone https://github.com/stubble99/Spirelink.git
cd Spirelink
npm install
npm run dev
```

Open http://localhost:5173

### Build for production

```bash
npm run build
```

Deploy the `/dist` folder to any static host.

### Project structure

```
data/                   ← all synergy data lives here, plain JSON
  defect/orbweaver/     ← reference implementation, copy this structure
    nodes.json          ← cards, relics, mechanics
    edges.json          ← synergy relationships

src/                    ← React application
  components/           ← UI components
  hooks/                ← graph physics and layout hooks
  utils/                ← layout algorithms and constants

DESIGN.md               ← why decisions were made, read this first
CONTRIBUTING.md         ← detailed data contribution guide
ROADMAP.md              ← what's planned and what needs help
CHANGELOG.md            ← what changed and when
```

### Before you open a PR

- Read DESIGN.md — it explains the principles behind decisions
- Check the PR template checklist
- Edge descriptions should explain *why*, not just *that*
- Verify card text against current StS2 EA version

### Questions

Open an issue or post in r/Spirelink.
