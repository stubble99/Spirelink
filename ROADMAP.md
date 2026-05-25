# Roadmap

This document reflects current priorities and future directions for Spirelink. It's a living document — community interest and EA patch changes will shift priorities.

Status indicators:
- ✅ Done
- 🔄 In progress
- 📋 Planned
- 💭 Speculative — needs community interest or design work

---

## Foundation

- ✅ Defect Orbweaver module — Wall of Ice, Lord of Darkness, Pure Lightning archetypes
- ✅ Force-directed graph layout
- ✅ Archetype cluster layout
- ✅ Hierarchical layout
- ✅ Hybrid layout
- ✅ Solar system orbital layout
- ✅ Card portrait images
- ✅ Wiki links to sts2.untapped.gg
- ✅ Dark/light mode
- ✅ Community contribution structure (CONTRIBUTING.md, issue templates, PR template)
- ✅ Design philosophy documented (DESIGN.md)
- ✅ MIT License

---

## Near term

- 📋 Deploy to public URL (Netlify / Cloudflare Pages)
- 📋 Run state persistence — save owned card state between sessions (localStorage)
- 📋 Shareable run URLs — encode deck state in URL for sharing
- 📋 Complete Defect relic data — current relic coverage is partial
- 📋 Complete Lightning Orb archetype edges
- 📋 Ironclad Crucible module — first non-Defect module

---

## Medium term

- 📋 Silent Slipstream module
- 📋 Necrobinder Deathknell module
- 📋 Regent Starforge module
- 📋 Multi-module support — switch between modules within a character
- 📋 Archetype filter — show only nodes relevant to a specific archetype
- 📋 Upgrade state — mark cards as upgraded, show upgraded effect text
- 📋 Card search — find a node by name without knowing where it lives in the graph

---

## Layout experiments

- 💭 Animated orbital transitions in solar system layout — smooth ring changes when owned state updates
- 💭 Importance-weighted edges — line thickness reflects synergy strength
- 💭 Turn sequence view — cards arranged by ideal play order in a typical turn
- 💭 "What does this unlock" mode — select a card, see only what it enables

---

## Community features

- 💭 Patch tracking — automated or community-flagged alerts when EA patches may affect data
- 💭 Confidence ratings on edges — flag synergies that are disputed or unverified
- 💭 Run journal — log which cards you saw, took, and skipped across multiple runs
- 💭 Archetype voting — community rates which archetype a card belongs to

---

## Out of scope

These are explicitly not planned for Spirelink:

- **Tier lists** — cards are not rated in isolation
- **Win rate statistics** — Spirelink is a learning tool, not an analytics platform
- **AI card recommendations** — the goal is building human intuition, not replacing it
- **Mobile app** — web-first, responsive design is sufficient

---

## How to influence the roadmap

Open an issue with the label `roadmap` describing what you'd like to see and why. Features with clear learning value for the target user (engaged beginners) take priority over features that primarily serve expert players.

If you want to build something on the speculative list, open an issue first to discuss approach before building — avoids duplicate effort and ensures it fits the design principles in DESIGN.md.
