# What Spirelink Is

Spirelink is a visual learning system for Slay the Spire 2. It helps players build an intuitive understanding of card and relic synergies through consistent spatial representation.

It is not a reference tool. It is not a tier list. It is not a Reddit thread.

The distinction matters: a reference tool assumes you already know what you're looking for. Spirelink is for players who don't yet see the synergy web that experienced players carry intuitively — and who want to build that understanding without needing hundreds of hours of runs to get there.

---

## The Problem It Solves

Expert StS2 players look at a hand of cards and immediately perceive a web of relationships — what feeds what, what scales with what, what conflicts with what. This perception is largely automatic, built through repetition until the patterns are encoded in memory.

Beginners don't have this. The cognitive load of a single combat — tracking HP, enemy intent, energy, hand cards — leaves no spare capacity to also perceive meta-patterns and scaling relationships. The result is that card choices feel arbitrary, synergies are missed, and runs fail for reasons that aren't visible.

Text-based community knowledge (Reddit threads, tier lists, Discord discussions) doesn't solve this. It transfers conclusions — "Ice Lance is good" — without transferring the structural understanding of why. Every piece of advice is run-specific anecdote that doesn't generalise.

Spirelink's answer is to make the system visible.

---

## The Target User

An engaged beginner. Someone who:

* Genuinely wants to improve and understand the game deeply
* Can follow strategic reasoning once it's explained
* Struggles to perceive synergy relationships intuitively in the moment
* Doesn't yet have the mental model that expert players carry automatically

Spirelink is explicitly not built for expert players who already see the web. It's built for the player who looks at their cards and feels lost despite caring about the game.

This is an underserved user. Most community knowledge is created by experts for experts.

---

## Core Design Principle: Spatial Memory

The central insight driving every design decision is this:

**A strong visual spatial memory is more useful than information you have to look up.**

If a player sees the same layout consistently across 10 runs, they begin to internalise it. The frost cluster is always in the same region. Loop is always in the same position relative to Frost Orb. Defragment always sits in the scaling zone.

Over time, the player stops consulting the tool because the map exists in their head. They open their card reward screen and think "that pulls toward my scaling cluster" without needing to check. That moment — when the tool is no longer needed — is Spirelink's actual success metric.

This principle has direct consequences for every design decision:

* Layout positions must be fixed and consistent. A node that moves between sessions breaks spatial memory formation.
* Drag-to-reposition must not be available in learning-focused layouts. User rearrangement defeats the purpose.
* The same layout should persist across runs. The deck changes; the map stays constant.

---

## Why Edges Explain Reasoning

Every synergy edge in Spirelink includes a description of why the connection exists, not just that it exists.

Bad: "Ice Lance → Hailstorm"

Good: "Each Frost channeled by Ice Lance feeds Hailstorm's end-of-turn AoE condition — the more you channel in a turn, the more reliably Hailstorm fires."

The description is where learning happens. Seeing a connection is pattern recognition. Understanding why it exists is transferable knowledge that applies to future runs and future decisions.

Edge descriptions should:

* Explain the mechanical reason for the connection
* Quantify where possible ("3 Frost channels = 15 more damage from Barrage at 5 slots")
* Flag when a connection is conditional ("only fires if you've played fewer than 3 cards this turn")
* For conflict edges, explain the specific cost ("Hyperbeam's -3 Focus reduces every Frost passive by 3 block per orb — permanently, for the rest of the run")

---

## Layout Philosophy

Spirelink maintains multiple layout variants as named branches. Each represents a different hypothesis about how to make synergies visually learnable.

The current primary layout (`main`) is archetype clusters — nodes grouped by build role, with consistent positions that reinforce spatial memory.

The experimental priority is solar system / orbital (`layout/solar-system`) — a deck-relative layout where nodes orbit a central "your deck" point at distances determined by how many connections they share with your currently owned cards. As you add cards, synergy targets pull closer to centre. The visual shift is the information.

What a good layout does:

* Makes the most important relationships visually dominant
* Groups related cards spatially so clusters are perceivable at a glance
* Remains consistent across sessions so spatial memory can form
* Shows what's missing from a deck as clearly as what's present

What a good layout does not do:

* Optimise for visual novelty over legibility
* Allow user rearrangement that breaks consistency
* Show everything at equal visual weight
* Require prior knowledge to interpret

---

## What Spirelink Is Not

**Not a tier list.** Cards aren't rated in isolation. A card's value is always relative to the deck it lives in and the archetype it supports.

**Not a Reddit thread.** Anecdote and run-specific advice don't transfer. Spirelink shows structure, not conclusions.

**Not an expert reference.** Experts already carry this knowledge. Spirelink is for building the mental model, not consulting one you already have.

**Not exhaustive.** Completeness is less important than accuracy and clarity. A smaller, well-curated dataset teaches better than an overwhelming one.

---

## Data Philosophy

Synergy data lives in plain JSON files, separate from application code. This is intentional:

* Players who understand the game but don't code can contribute
* Data can be updated as EA patches change cards without touching application logic
* The community owns the knowledge, not the codebase

Edge descriptions are the most valuable contribution. Anyone can add a node. Writing a description that genuinely explains why a connection exists — clearly enough that a beginner understands it — is the harder and more important work.

---

## Module Naming

Spirelink organises knowledge by character, then by module (archetype group) within each character:

```
Defect/
  Orbweaver     — Orb archetypes (Wall of Ice, Lord of Darkness, Pure Lightning)
Ironclad/
  Crucible      — Strength, Exhaust, Block, Self-damage, Vulnerable
Silent/
  Slipstream    — Poison, Shiv, Sly
Necrobinder/
  Deathknell    — Osty, Doom, Soul, Ethereal
Regent/
  Starforge     — Stars, Sovereign Blade, Hand/Draw Control
```

Module names identify the playstyle cluster, not the character. Multiple modules can exist per character as community knowledge develops. New modules should be named to communicate the playstyle feel, not just describe the mechanics.

---

## Success Metrics

Spirelink succeeds when:

1. A player opens it during a run and immediately understands what their deck is missing
2. A player stops opening it because the map is already in their head
3. A community contributor adds accurate edge descriptions without needing to ask what format to use
4. The layout is consistent enough that a returning player recognises where everything lives without reorienting

Spirelink fails when:

* It becomes a reference tool people consult without learning from
* Layout inconsistency prevents spatial memory formation
* Edge descriptions state connections without explaining them
* The tool is only useful to players who already understand the game

---

## Adding a New Layout

If you want to experiment with a new layout approach:

1. Branch from `main` using the naming convention `layout/{your-layout-name}`
2. Implement your layout in `src/utils/layout.js`
3. Document the layout's hypothesis — what specific learning problem does it solve better than existing layouts?
4. Add it to the Layout Variants table in `README.md`
5. Open a PR against `main` with a screenshot and explanation

A layout contribution without a stated hypothesis is hard to evaluate. The question is never "does it look good" — it's "does it help a beginner build spatial memory faster."

---

Spirelink is a community project. This document reflects founding design intent — not permanent law. If the community finds better answers to these problems, the document should change. The goal is always the same: help players see what experts see, faster.
