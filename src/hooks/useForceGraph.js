import { useRef, useState, useEffect } from "react";
import { calculateClusterLayout } from "../utils/layout.js";

export function useForceGraph(nodes, edges, width, height) {
  const posRef = useRef({});
  const [positions, setPositions] = useState({});

  useEffect(() => {
    if (!nodes.length || !width || !height) return;

    // Calculate cluster-based layout
    const newPositions = calculateClusterLayout(nodes, width, height);
    posRef.current = newPositions;
    setPositions(newPositions);
  }, [nodes.length, width, height]);

  return { positions, posRef };
}
