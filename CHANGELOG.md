# Changelog

All notable changes to Spirelink are documented here. Data changes are tied to StS2 EA patch versions where known.

Format: `[Spirelink Version] — [Date] — [StS2 Patch if applicable]`

---

## [0.1.0] — 2026-05-25 — StS2 EA Initial

### Added
- Initial release — Defect Orbweaver module
- Force-directed graph layout (`layout/force-directed` branch)
- Archetype cluster layout (main branch)
- Hierarchical layout (`layout/hierarchical` branch)
- Hybrid layout (`layout/hybrid` branch)
- Solar system orbital layout (`layout/solar-system` branch)
- Full Defect orb archetype node and edge data
  - Wall of Ice archetype
  - Lord of Darkness archetype
  - Pure Lightning archetype
- Card portrait images via sts2json.untapped.gg CDN
- Wiki links to sts2.untapped.gg for all card nodes
- Sidebar with edge explanations and wiki links
- Dark/light mode support
- Image fetch script for card portrait population
- DESIGN.md — design philosophy and principles
- CONTRIBUTING.md — community data contribution guide
- MIT License

### Data notes
- Card data verified against StS2 EA as of 2026-05-25
- Relic data is partial — community contributions welcome
- Lightning Orb archetype edges are incomplete pending community knowledge

---

## How to log a data change

When a StS2 EA patch changes a card, relic, or mechanic:

1. Update the relevant JSON files
2. Add an entry under a new `[Unreleased]` heading at the top of this file
3. Note the card name, what changed, and the patch version if known
4. When the change is merged, move it from `[Unreleased]` to a versioned release

### Entry format for data changes

```
### Changed
- [Card Name] — cost changed from X to Y (StS2 patch 0.x.x)
- [Card Name] — effect text updated: "old text" → "new text"

### Added
- [Card Name] — new card added in patch 0.x.x

### Removed  
- [Card Name] — removed from game in patch 0.x.x
```

---

## Stale data

If you notice card data that no longer matches the current EA version, please open an issue using the "Stale Data" issue template. Include the card name, what's wrong, and the current correct text.

EA moves fast. Stale data is expected and not a criticism of prior contributors.
