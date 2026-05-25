import { REL_COLOR, REL_LABEL, RARITY_COLOR } from "../utils/constants.js";

export default function Sidebar({
  allNodes, activeNode, activeEdges,
  ownedIds, onToggleOwned, filterRel, onFilterRel,
  isDark = true,
  themeVars = {},
}) {
  // Default theme vars if not provided
  const defaultThemeVars = isDark ? {
    bgPrimary: "#060d14",
    sidebarBg: "#07111a",
    border: "#0e2233",
    textPrimary: "#8baab8",
    textMuted: "#2a4a5e",
    textWeak: "#1a3344",
  } : {
    bgPrimary: "#f0f4f8",
    sidebarBg: "#e8eef4",
    border: "#d0d8e0",
    textPrimary: "#1a3344",
    textMuted: "#4a5f7a",
    textWeak: "#1a3344",
  };

  const theme = Object.keys(themeVars).length > 0 ? themeVars : defaultThemeVars;

  const nodeColor = (n) =>
    n.type === "mechanic" ? "#38bdf8" : n.rarity ? RARITY_COLOR[n.rarity] : "#888";

  return (
    <div style={{
      width: 270, background: theme.sidebarBg, borderLeft: `1px solid ${theme.border}`,
      display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0,
    }}>

      {/* Node detail panel */}
      <div style={{
        padding: "14px 16px", borderBottom: `1px solid ${theme.border}`, minHeight: 160,
        overflow: "auto", maxHeight: "40vh",
      }}>
        {activeNode ? (
          <>
            {/* Image if available */}
            {activeNode.image_url && activeNode.image_url.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <img
                  src={activeNode.image_url}
                  alt={activeNode.label}
                  style={{
                    width: "100%", borderRadius: "4px", display: "block",
                    border: `1px solid ${nodeColor(activeNode)}33`,
                  }}
                />
              </div>
            )}
            <div style={{
              fontSize: 12, fontWeight: "bold", letterSpacing: "0.15em",
              color: nodeColor(activeNode), textTransform: "uppercase", marginBottom: 5,
            }}>
              {activeNode.label}
            </div>
            <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: "0.1em", marginBottom: 8 }}>
              {activeNode.type === "mechanic" ? "MECHANIC" :
               activeNode.type === "relic" ? "RELIC" :
               `${activeNode.rarity?.toUpperCase()} CARD · COST ${activeNode.cost}`}
              {" · "}
              <span style={{ color: ownedIds.has(activeNode.id) ? "#34d399" : "#f87171" }}>
                {ownedIds.has(activeNode.id) ? "OWNED" : "NOT ACQUIRED"}
              </span>
            </div>
            <div style={{ fontSize: 10, color: theme.textPrimary, lineHeight: 1.65, marginBottom: 12 }}>
              {activeNode.desc}
            </div>
            {/* Wiki link if available */}
            {activeNode.wiki_url && (
              <div style={{ marginBottom: 12 }}>
                <a
                  href={activeNode.wiki_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 9, color: "#38bdf8", textDecoration: "none",
                    letterSpacing: "0.08em", border: "1px solid #38bdf833",
                    padding: "4px 8px", display: "inline-block", borderRadius: "2px",
                    transition: "all 0.2s", background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#38bdf811";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  VIEW ON UNTAPPED.GG ↗
                </a>
              </div>
            )}
            {activeNode.type !== "mechanic" && (
              <button
                onClick={() => onToggleOwned(activeNode.id)}
                style={{
                  background: ownedIds.has(activeNode.id) ? "#0a1f2e" : "#38bdf811",
                  border: `1px solid ${ownedIds.has(activeNode.id) ? "#0e2233" : "#38bdf8"}`,
                  color: ownedIds.has(activeNode.id) ? "#2a4a5e" : "#38bdf8",
                  padding: "5px 12px", fontSize: 9, cursor: "pointer",
                  letterSpacing: "0.12em", width: "100%", transition: "all 0.2s",
                }}>
                {ownedIds.has(activeNode.id) ? "MARK AS NOT OWNED" : "+ ADD TO RUN"}
              </button>
            )}
          </>
        ) : (
          <div style={{ fontSize: 10, color: theme.textWeak, lineHeight: 1.8, letterSpacing: "0.05em" }}>
            HOVER a node to preview.<br />
            CLICK to lock selection.<br />
            DRAG to rearrange.<br /><br />
            <span style={{ color: theme.border }}>
              Solid ring = owned · Dashed = not acquired<br />
              ▲ triangle = mechanic node
            </span>
          </div>
        )}
      </div>

      {/* Relationships */}
      {activeNode && activeEdges.length > 0 && (
        <div style={{ flex: 1, overflow: "auto", padding: "10px 16px" }}>
          <div style={{
            fontSize: 9, color: theme.textWeak, letterSpacing: "0.15em", marginBottom: 10,
          }}>
            RELATIONSHIPS ({activeEdges.length})
          </div>
          {activeEdges.map((e, i) => {
            const otherId = e.from === activeNode.id ? e.to : e.from;
            const other = allNodes.find(n => n.id === otherId);
            if (!other) return null;
            const color = REL_COLOR[e.type];
            const dir = e.from === activeNode.id ? "→" : "←";
            return (
              <div key={i} style={{
                marginBottom: 10, paddingBottom: 10,
                borderBottom: "1px solid #0a1a24",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ color, fontSize: 9, letterSpacing: "0.1em" }}>
                    {REL_LABEL[e.type].toUpperCase()}
                  </span>
                  <span style={{ color: "#1a3344", fontSize: 9 }}>{dir}</span>
                  <span style={{
                    fontSize: 9, fontWeight: "bold", letterSpacing: "0.05em",
                    color: nodeColor(other),
                  }}>
                    {other.label}
                  </span>
                  {!ownedIds.has(otherId) && other.type !== "mechanic" && (
                    <span style={{ fontSize: 8, color: "#f87171", letterSpacing: "0.05em" }}>
                      [NOT OWNED]
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 9, color: theme.textMuted, lineHeight: 1.65 }}>
                  {e.desc}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend + filter */}
      <div style={{
        padding: "12px 16px", borderTop: `1px solid ${theme.border}`, flexShrink: 0,
      }}>
        <div style={{ fontSize: 9, color: theme.textWeak, letterSpacing: "0.15em", marginBottom: 8 }}>
          FILTER BY EDGE TYPE
        </div>
        {Object.entries(REL_LABEL).map(([type, label]) => (
          <div key={type}
            onClick={() => onFilterRel(type)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              cursor: "pointer", marginBottom: 5,
              opacity: filterRel && filterRel !== type ? 0.25 : 1,
              transition: "opacity 0.15s",
            }}>
            <div style={{
              width: 22, height: 0,
              borderTop: `2px ${type === "conflict" ? "dashed" : "solid"} ${REL_COLOR[type]}`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 9, color: REL_COLOR[type], letterSpacing: "0.08em" }}>
              {label.toUpperCase()}
            </span>
          </div>
        ))}

        <div style={{ marginTop: 10, fontSize: 9, color: theme.textWeak, letterSpacing: "0.08em", lineHeight: 1.7 }}>
          RARITY: <span style={{ color: RARITY_COLOR.common }}>COMMON</span>{" · "}
          <span style={{ color: RARITY_COLOR.uncommon }}>UNCOMMON</span>{" · "}
          <span style={{ color: RARITY_COLOR.rare }}>RARE</span>
        </div>
      </div>
    </div>
  );
}
