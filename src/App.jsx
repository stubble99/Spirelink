import { useState, useEffect, useRef, useCallback } from "react";
import GraphCanvas from "./components/GraphCanvas.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useForceGraph } from "./hooks/useForceGraph.js";
import { DEFAULT_OWNED } from "./utils/constants.js";

// Module loader: currently loading Defect/Orbweaver
// To switch modules, change the imports below to point to a different character/module:
// - data/defect/orbweaver/* (Defect Orb archetypes)
// - data/ironclad/crucible/* (Ironclad Strength/Exhaust/Block archetypes — when available)
// - data/silent/slipstream/* (Silent Poison/Shiv/Sly archetypes — when available)
// etc.
import nodesData from "../data/defect/orbweaver/nodes.json";
import edgesData from "../data/defect/orbweaver/edges.json";

// Detect dark/light mode preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Theme variables
const themeVars = prefersDark ? {
  bgPrimary: "#060d14",
  bgSecondary: "#07111a",
  border: "#0e2233",
  textPrimary: "#8baab8",
  textMuted: "#2a4a5e",
  textWeak: "#1a3344",
  accentCyan: "#38bdf8",
  accentGreen: "#34d399",
  accentRed: "#f87171",
} : {
  bgPrimary: "#f0f4f8",
  bgSecondary: "#e8ecf1",
  border: "#d0d8e0",
  textPrimary: "#0a1f2e",
  textMuted: "#4a5f7a",
  textWeak: "#7a8fa5",
  accentCyan: "#0066cc",
  accentGreen: "#228822",
  accentRed: "#cc2222",
};

export default function App() {
  const [ownedIds, setOwnedIds] = useState(DEFAULT_OWNED);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [filterRel, setFilterRel] = useState(null);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const obs = new ResizeObserver(([e]) => {
      setDims({ width: e.contentRect.width, height: e.contentRect.height });
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const visibleNodes = nodesData.filter((n) => {
    if (showAll) return true;
    if (ownedIds.has(n.id)) return true;
    return edgesData.some(
      (e) =>
        (e.from === n.id && ownedIds.has(e.to)) ||
        (e.to === n.id && ownedIds.has(e.from))
    );
  });

  const visibleEdges = edgesData.filter((e) => {
    const fromVis = visibleNodes.some((n) => n.id === e.from);
    const toVis   = visibleNodes.some((n) => n.id === e.to);
    if (!fromVis || !toVis) return false;
    if (filterRel && e.type !== filterRel) return false;
    return true;
  });

  const { positions, posRef } = useForceGraph(visibleNodes, visibleEdges, dims.width, dims.height);

  const toggleOwned = useCallback((id) => {
    setOwnedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleFilterRel = useCallback((type) => {
    setFilterRel((prev) => (prev === type ? null : type));
  }, []);

  const activeId = selectedId || hoveredId;
  const activeNode = activeId ? nodesData.find((n) => n.id === activeId) : null;
  const activeEdges = activeNode
    ? edgesData.filter((e) => e.from === activeNode.id || e.to === activeNode.id)
    : [];

  const ownedCount   = visibleNodes.filter((n) => ownedIds.has(n.id)).length;
  const ghostCount   = visibleNodes.filter((n) => !ownedIds.has(n.id)).length;

  return (
    <div style={{
      width: "100vw", height: "100vh", background: themeVars.bgPrimary,
      fontFamily: "'Courier New', monospace",
      display: "flex", flexDirection: "column", overflow: "hidden",
      color: themeVars.textPrimary,
      transition: "background-color 0.3s ease, color 0.3s ease",
    }}>
      {/* Header */}
      <header style={{
        padding: "10px 20px", borderBottom: `1px solid ${themeVars.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: prefersDark ? "linear-gradient(90deg, #060d14 0%, #091826 100%)" : "linear-gradient(90deg, #f0f4f8 0%, #eef2f7 100%)",
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: 14, letterSpacing: "0.35em", color: themeVars.accentCyan,
            textTransform: "uppercase", fontWeight: "bold",
          }}>
            SPIRELINK
          </div>
          <div style={{ fontSize: 9, color: themeVars.textWeak, marginTop: 1, letterSpacing: "0.2em" }}>
            ORBWEAVER · DEFECT ORB ARCHETYPES · EA v0.1
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 9, color: themeVars.textWeak, letterSpacing: "0.1em" }}>
            <span style={{ color: themeVars.accentGreen }}>{ownedCount} OWNED</span>
            {" · "}
            <span style={{ color: themeVars.textMuted }}>{ghostCount} SYNERGY TARGETS</span>
            {" · "}
            {visibleEdges.length} EDGES
          </div>
          <button
            onClick={() => setShowAll((v) => !v)}
            style={{
              background: showAll ? themeVars.bgSecondary : "transparent",
              border: `1px solid ${themeVars.border}`,
              color: showAll ? themeVars.accentCyan : themeVars.textMuted,
              padding: "4px 12px", fontSize: 9, cursor: "pointer",
              letterSpacing: "0.12em", transition: "all 0.2s",
            }}>
            {showAll ? "CONNECTED ONLY" : "SHOW ALL"}
          </button>
          <button
            onClick={() => {
              setSelectedId(null);
              setHoveredId(null);
              setFilterRel(null);
            }}
            style={{
              background: "transparent", border: `1px solid ${themeVars.border}`,
              color: themeVars.textMuted, padding: "4px 12px", fontSize: 9,
              cursor: "pointer", letterSpacing: "0.12em",
            }}>
            RESET VIEW
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Graph area */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <GraphCanvas
            nodes={visibleNodes}
            edges={visibleEdges}
            positions={positions}
            posRef={posRef}
            ownedIds={ownedIds}
            hoveredId={hoveredId}
            selectedId={selectedId}
            filterRel={filterRel}
            onHover={setHoveredId}
            onSelect={handleSelect}
            dims={dims}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          allNodes={nodesData}
          activeNode={activeNode}
          activeEdges={activeEdges}
          ownedIds={ownedIds}
          onToggleOwned={toggleOwned}
          filterRel={filterRel}
          onFilterRel={handleFilterRel}
        />
      </div>
    </div>
  );
}
