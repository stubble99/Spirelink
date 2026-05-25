import { useState, useEffect, useRef, useCallback } from "react";
import GraphCanvas from "./components/GraphCanvas.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useForceGraph } from "./hooks/useForceGraph.js";
import { DEFAULT_OWNED } from "./utils/constants.js";
import nodesData from "../data/defect/nodes.json";
import edgesData from "../data/defect/edges.json";

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
      width: "100vw", height: "100vh", background: "#060d14",
      fontFamily: "'Courier New', monospace",
      display: "flex", flexDirection: "column", overflow: "hidden",
      color: "#8baab8",
    }}>
      {/* Header */}
      <header style={{
        padding: "10px 20px", borderBottom: "1px solid #0e2233",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "linear-gradient(90deg, #060d14 0%, #091826 100%)",
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: 14, letterSpacing: "0.35em", color: "#38bdf8",
            textTransform: "uppercase", fontWeight: "bold",
          }}>
            SPIRELINK
          </div>
          <div style={{ fontSize: 9, color: "#1a3344", marginTop: 1, letterSpacing: "0.2em" }}>
            ORBWEAVER · DEFECT ORB ARCHETYPES · EA v0.1
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 9, color: "#1a3344", letterSpacing: "0.1em" }}>
            <span style={{ color: "#34d399" }}>{ownedCount} OWNED</span>
            {" · "}
            <span style={{ color: "#2a4a5e" }}>{ghostCount} SYNERGY TARGETS</span>
            {" · "}
            {visibleEdges.length} EDGES
          </div>
          <button
            onClick={() => setShowAll((v) => !v)}
            style={{
              background: showAll ? "#0e2233" : "transparent",
              border: "1px solid #0e2233",
              color: showAll ? "#38bdf8" : "#2a4a5e",
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
              background: "transparent", border: "1px solid #0e2233",
              color: "#2a4a5e", padding: "4px 12px", fontSize: 9,
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
