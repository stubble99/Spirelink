import { useRef, useState, useEffect } from "react";

export function useForceGraph(nodes, edges, width, height) {
  const posRef = useRef({});
  const velRef = useRef({});
  const [positions, setPositions] = useState({});
  const frameRef = useRef(null);

  useEffect(() => {
    if (!nodes.length || !width || !height) return;

    // Initialise new nodes only — start closer to centre for stability
    nodes.forEach((n, i) => {
      if (!posRef.current[n.id]) {
        const angle = (i / nodes.length) * Math.PI * 2;
        const r = Math.min(width, height) * 0.15; // Reduced from 0.28
        posRef.current[n.id] = {
          x: width / 2 + r * Math.cos(angle) + (Math.random() - 0.5) * 50,
          y: height / 2 + r * Math.sin(angle) + (Math.random() - 0.5) * 50,
        };
        velRef.current[n.id] = { x: 0, y: 0 };
      }
    });

    let iteration = 0;
    const MAX_ITER = 400;

    const tick = () => {
      if (iteration++ > MAX_ITER) return;

      const pos = posRef.current;
      const vel = velRef.current;
      const k = Math.sqrt((width * height) / Math.max(nodes.length, 1)) * 1.1; // Increased from 0.9
      const padding = 65;

      // Helper function to get node radius by type
      const getNodeRadius = (node) => {
        if (node.type === "mechanic") return 26;
        if (node.type === "relic") return 24;
        return 28; // card
      };

      // Repulsion between all nodes
      nodes.forEach((a) => {
        let fx = 0, fy = 0;
        nodes.forEach((b) => {
          if (a.id === b.id) return;
          const dx = (pos[a.id]?.x ?? 0) - (pos[b.id]?.x ?? 0);
          const dy = (pos[a.id]?.y ?? 0) - (pos[b.id]?.y ?? 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = (k * k) / dist;
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        });
        if (vel[a.id]) {
          vel[a.id].x = (vel[a.id].x + fx) * 0.45;
          vel[a.id].y = (vel[a.id].y + fy) * 0.45;
        }
      });

      // Collision detection — prevent nodes from overlapping
      nodes.forEach((a, i) => {
        const aRadius = getNodeRadius(a);
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const bRadius = getNodeRadius(b);
          const minDist = aRadius + bRadius + 20;

          const dx = (pos[b.id]?.x ?? 0) - (pos[a.id]?.x ?? 0);
          const dy = (pos[b.id]?.y ?? 0) - (pos[a.id]?.y ?? 0);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          if (dist < minDist) {
            const pushDist = (minDist - dist) / 2;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * pushDist;
            const pushY = Math.sin(angle) * pushDist;

            if (vel[a.id]) {
              vel[a.id].x -= pushX * 0.5;
              vel[a.id].y -= pushY * 0.5;
            }
            if (vel[b.id]) {
              vel[b.id].x += pushX * 0.5;
              vel[b.id].y += pushY * 0.5;
            }
          }
        }
      });

      // Attraction along edges
      edges.forEach((e) => {
        if (!pos[e.from] || !pos[e.to]) return;
        const dx = pos[e.to].x - pos[e.from].x;
        const dy = pos[e.to].y - pos[e.from].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = e.type === "conflict" ? k * 2.0 : k * 0.85;
        const force = ((dist - targetDist) / dist) * 0.15; // Reduced from 0.28
        const fx = dx * force;
        const fy = dy * force;
        if (vel[e.from]) { vel[e.from].x += fx; vel[e.from].y += fy; }
        if (vel[e.to])   { vel[e.to].x   -= fx; vel[e.to].y   -= fy; }
      });

      // Centre gravity — stronger for first 100 iterations to settle nodes
      const gravityStrength = iteration < 100 ? 0.02 : 0.006; // Increased from constant 0.006
      nodes.forEach((n) => {
        if (!vel[n.id] || !pos[n.id]) return;
        vel[n.id].x += (width  / 2 - pos[n.id].x) * gravityStrength;
        vel[n.id].y += (height / 2 - pos[n.id].y) * gravityStrength;
      });

      // Apply velocity + clamp to bounds — reduce damping for first 50 iterations
      const dampingFactor = iteration < 50 ? 0.6 : 0.82; // Lower damping early for faster settling
      nodes.forEach((n) => {
        if (!pos[n.id] || !vel[n.id]) return;
        pos[n.id].x = Math.max(padding, Math.min(width  - padding, pos[n.id].x + vel[n.id].x));
        pos[n.id].y = Math.max(padding, Math.min(height - padding, pos[n.id].y + vel[n.id].y));
        vel[n.id].x *= dampingFactor;
        vel[n.id].y *= dampingFactor;
      });

      setPositions({ ...pos });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [nodes.length, edges.length, width, height]);

  return { positions, posRef };
}
