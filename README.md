# Spirelink

**Community synergy map for Slay the Spire 2.**

Spirelink is a force-directed graph tool for tracking card and relic synergies across a run. It's designed to help players learn *why* certain cards work together, not just *that* they do.

---

## Character modules

Spirelink is organized by **character**, then by **module** (playstyle cluster) within each character. Multiple modules can exist per character as the game and community knowledge expand.

| Character | Module | Coverage |
|-----------|--------|----------|
| **Defect** | Orbweaver | Orb archetypes (Wall of Ice, Lord of Darkness, Pure Lightning) |
| **Ironclad** | Crucible | Strength, Exhaust, Block, Self-damage, Vulnerable archetypes |
| **Silent** | Slipstream | Poison, Shiv, Sly archetypes |
| **Necrobinder** | Deathknell | Osty, Doom, Soul, Ethereal archetypes |
| **Regent** | Starforge | Stars, Sovereign Blade, Hand/Draw Control archetypes |

**Current focus:** Orbweaver (Defect) is fully detailed. Other modules are planned.

---

## What it does

- Shows your current deck as a living graph — owned cards as solid nodes, synergy targets as ghost nodes
- Edges explain relationships: what generates what, what amplifies what, what conflicts with what
- Click any node to see all its relationships with explanations
- Mark cards as owned as your run evolves
- Filter by edge type to isolate e.g. conflict edges (anti-synergies)
- Force-directed layout naturally clusters related cards together

---

## Layout Variants

Spirelink supports multiple layout algorithms. Each is maintained on its own branch.

| Branch | Layout | Best for |
|--------|--------|----------|
| `main` | Archetype clusters | First-time users, clean screenshots |
| `layout/hierarchical` | Rows by type & cost | Learning card roles and relationships |
| `layout/hybrid` | Clusters + light physics | Organic feel, daily use |
| `layout/force-directed` | Full physics simulation | Exploratory analysis, interactive discovery |
| `layout/solar-system` | Deck-relative orbital rings | Learning spatial memory |

Branch as `layout/{your-name}` and open a PR to contribute a new layout variant.

---

## Running locally

**Requirements:** Node.js 18+

```bash
git clone https://github.com/your-org/spirelink.git
cd spirelink
npm install
npm run dev
```

Open `http://localhost:5173`

**Build for production:**

```bash
npm run build
# Output in /dist — deploy to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.)
```

---

## Deploying

Spirelink builds to static files. Deploy the `/dist` folder to any static host:

| Host | Command / Notes |
|------|----------------|
| Netlify | Drag `/dist` to Netlify drop, or connect repo with build command `npm run build` |
| Vercel | `vercel` CLI, or connect repo — auto-detects Vite |
| Cloudflare Pages | Build command: `npm run build`, output: `dist` |
| GitHub Pages | Use `gh-pages` package or GitHub Actions to publish `/dist` |
| Self-hosted | Serve `/dist` with any static file server (nginx, caddy, etc.) |

No backend required.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) — especially if you want to update card data as EA patches land. You don't need to know how to code to contribute.

---

## Data sources

Card and relic data sourced from [sts2.untapped.gg](https://sts2.untapped.gg) and community knowledge. Synergy relationships are community-curated.

Slay the Spire 2 is in Early Access — data will change. See CONTRIBUTING.md for how to flag outdated information.

---

## Roadmap

- [ ] Ironclad/Crucible module
- [ ] Silent/Slipstream module
- [ ] Necrobinder/Deathknell module
- [ ] Regent/Starforge module
- [ ] Run state persistence (local storage)
- [ ] Shareable run URLs
- [ ] Multi-module selector UI (switch between characters/modules in-app)
- [ ] Patch changelog tracking

---

*Not affiliated with Mega Crit. Fan project.*
