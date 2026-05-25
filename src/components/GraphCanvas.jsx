import { useCallback } from "react";
import { REL_COLOR, REL_LABEL, RARITY_COLOR } from "../utils/constants.js";

export default function GraphCanvas({
  nodes, edges, positions, posRef,
  ownedIds, hoveredId, selectedId, filterRel,
  onHover, onSelect, dims,
  isDark = true,
  themeVars = {},
}) {
  const highlightIds = selectedId || hoveredId
    ? (() => {
        const activeId = selectedId || hoveredId;
        const connected = edges
          .filter(e => e.from === activeId || e.to === activeId)
          .map(e => e.from === activeId ? e.to : e.from);
        return new Set([activeId, ...connected]);
      })()
    : null;

  const onMouseDown = useCallback((e, id) => {
    e.stopPropagation();
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;

    const onMove = (me) => {
      const dx = me.clientX - start.x;
      const dy = me.clientY - start.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;
      start.x = me.clientX;
      start.y = me.clientY;
      if (posRef.current[id]) {
        posRef.current[id].x += dx;
        posRef.current[id].y += dy;
      }
    };

    const onUp = () => {
      if (!moved) onSelect(id);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [posRef, onSelect]);

  // Default theme if not provided
  const defaultTheme = isDark ? {
    canvasBg: "#111f2e",
    nodeFillOwned: "#162535",
  } : {
    canvasBg: "#e8edf4",
    nodeFillOwned: "#1a2f42",
  };

  const theme = Object.keys(themeVars).length > 0 ? themeVars : defaultTheme;

  return (
    <svg width={dims.width} height={dims.height} style={{ position: "absolute", inset: 0, background: theme.canvasBg }}>
      <defs>
        {Object.entries(REL_COLOR).map(([type, color]) => (
          <marker key={type} id={`arr-${type}`} markerWidth="6" markerHeight="6"
            refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={color} opacity="0.8" />
          </marker>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Edges */}
      {edges.map((e, i) => {
        const fp = positions[e.from];
        const tp = positions[e.to];
        if (!fp || !tp) return null;

        const activeId = selectedId || hoveredId;
        const isActive = activeId && (e.from === activeId || e.to === activeId);
        const dimmed = (filterRel && e.type !== filterRel) || (highlightIds && !isActive);
        const color = REL_COLOR[e.type];
        const mx = (fp.x + tp.x) / 2;
        const my = (fp.y + tp.y) / 2;

        // Increase edge opacity in light mode since edges wash out
        const edgeOpacity = isDark ? 0.35 : 0.45;
        return (
          <g key={i} opacity={dimmed ? 0.06 : isActive ? 1 : edgeOpacity}>
            <line
              x1={fp.x} y1={fp.y} x2={tp.x} y2={tp.y}
              stroke={color}
              strokeWidth={isActive ? 2.5 : 1}
              strokeDasharray={e.type === "conflict" ? "5,3" : undefined}
              markerEnd={`url(#arr-${e.type})`}
              filter={isActive ? "url(#glow)" : undefined}
            />
            {isActive && (
              <text x={mx} y={my - 6} textAnchor="middle"
                fontSize="9" fill={color} opacity="0.9" letterSpacing="0.06em"
                style={{ pointerEvents: "none", userSelect: "none" }}>
                {REL_LABEL[e.type].toUpperCase()}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const p = positions[n.id];
        if (!p) return null;

        const owned = ownedIds.has(n.id);
        const isMechanic = n.type === "mechanic";
        const isRelic = n.type === "relic";
        const color = isMechanic ? "#38bdf8" : n.rarity ? RARITY_COLOR[n.rarity] : "#888";
        const isHovered  = hoveredId  === n.id;
        const isSelected = selectedId === n.id;
        const dimmed = highlightIds && !highlightIds.has(n.id);
        const r = isMechanic ? 26 : isRelic ? 24 : 28;
        const hasImage = n.image_url && n.image_url.length > 0;
        const clipPathId = `clip-${n.id}`;

        return (
          <g key={n.id}
            opacity={dimmed ? 0.15 : 1}
            style={{ cursor: "grab" }}
            onMouseEnter={() => onHover(n.id)}
            onMouseLeave={() => onHover(null)}
            onMouseDown={(e) => onMouseDown(e, n.id)}
          >
            {/* Define clipPath for image if it exists */}
            {hasImage && (
              <defs>
                <clipPath id={clipPathId}>
                  <circle cx={p.x} cy={p.y} r={r} />
                </clipPath>
              </defs>
            )}

            {/* Glow halo for owned */}
            {owned && (isHovered || isSelected) && (
              <circle cx={p.x} cy={p.y} r={r + 8}
                fill="none" stroke={color} strokeWidth="1"
                strokeOpacity="0.4" filter="url(#softglow)" />
            )}

            {/* Outer ring */}
            {owned && (
              <circle cx={p.x} cy={p.y} r={r + 5}
                fill="none" stroke={color} strokeWidth="1"
                strokeOpacity={isHovered || isSelected ? 0.5 : 0.15} />
            )}

            {/* Image if available */}
            {hasImage && (
              <image
                x={p.x - r} y={p.y - r}
                width={r * 2} height={r * 2}
                href={n.image_url}
                clipPath={`url(#${clipPathId})`}
              />
            )}

            {/* Body — node fill uses theme color for better contrast against canvas */}
            <circle cx={p.x} cy={p.y} r={r}
              fill={owned ? `${color}1a` : theme.nodeFillOwned}
              stroke={color}
              strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.5}
              strokeOpacity={owned ? 1 : 0.3}
              strokeDasharray={!owned ? "3,2" : undefined}
              filter={(isSelected || isHovered) ? "url(#glow)" : undefined}
            />

            {/* Mechanic triangle */}
            {isMechanic && !hasImage && (
              <polygon
                points={`${p.x},${p.y - 10} ${p.x + 10},${p.y + 6} ${p.x - 10},${p.y + 6}`}
                fill={color} opacity={owned ? 0.55 : 0.18}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Energy cost badge */}
            {n.type === "card" && n.cost !== undefined && owned && (
              <>
                <circle cx={p.x + r - 1} cy={p.y - r + 1} r={7} fill={color} />
                <text x={p.x + r - 1} y={p.y - r + 5} textAnchor="middle"
                  fontSize="8" fill="#060d14" fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}>
                  {n.cost}
                </text>
              </>
            )}

            {/* Label — increased font size and letter-spacing for better readability */}
            <text x={p.x} y={p.y + r + 14} textAnchor="middle"
              fontSize={isMechanic ? "11" : "10"}
              fill={isDark ? color : "#1a3344"}
              opacity={owned ? 0.95 : 0.38}
              letterSpacing="0.05em"
              style={{ pointerEvents: "none", userSelect: "none" }}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
