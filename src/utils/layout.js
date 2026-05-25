/**
 * Archetype cluster layout for Spirelink
 * Positions nodes in named cluster zones arranged on the canvas
 */

const CLUSTER_CENTERS = {
  frost_engine: { x: 0.35, y: 0.40 },
  mechanics: { x: 0.55, y: 0.25 },
  scaling: { x: 0.70, y: 0.50 },
  finishers: { x: 0.40, y: 0.70 },
  relics: { x: 0.20, y: 0.60 },
  conflicts: { x: 0.80, y: 0.75 },
};

const CLUSTER_RADIUS = 70; // px — radius of circle around cluster centre
const RANDOM_OFFSET = 10; // px — ±random offset per node

/**
 * Calculate layout positions for all nodes
 * @param {Array} nodes - array of node objects with id and cluster properties
 * @param {number} width - canvas width in pixels
 * @param {number} height - canvas height in pixels
 * @returns {Object} positions object mapping node.id to { x, y }
 */
export function calculateClusterLayout(nodes, width, height) {
  const positions = {};

  // Group nodes by cluster
  const clusterGroups = {};
  Object.values(CLUSTER_CENTERS).forEach((centre) => {
    clusterGroups[centre] = [];
  });

  nodes.forEach((node) => {
    const cluster = node.cluster;
    if (!cluster || !CLUSTER_CENTERS[cluster]) {
      // Nodes without a cluster or invalid cluster are positioned at canvas center
      positions[node.id] = {
        x: width / 2,
        y: height / 2,
      };
      return;
    }

    const centreKey = cluster;
    if (!clusterGroups[centreKey]) {
      clusterGroups[centreKey] = [];
    }
    clusterGroups[centreKey].push(node);
  });

  // Position nodes within each cluster
  Object.entries(CLUSTER_CENTERS).forEach(([clusterName, normCentre]) => {
    const nodesInCluster = nodes.filter((n) => n.cluster === clusterName);

    const centreX = normCentre.x * width;
    const centreY = normCentre.y * height;

    nodesInCluster.forEach((node, index) => {
      // Arrange nodes in a circle around the cluster centre
      const angle =
        (index / Math.max(nodesInCluster.length, 1)) * Math.PI * 2;
      const x =
        centreX +
        Math.cos(angle) * CLUSTER_RADIUS +
        (Math.random() - 0.5) * RANDOM_OFFSET * 2;
      const y =
        centreY +
        Math.sin(angle) * CLUSTER_RADIUS +
        (Math.random() - 0.5) * RANDOM_OFFSET * 2;

      positions[node.id] = { x, y };
    });
  });

  return positions;
}

/**
 * Get cluster metadata for rendering backgrounds and labels
 * @returns {Object} cluster info with centers, names, and colors
 */
export function getClusterMetadata() {
  return Object.entries(CLUSTER_CENTERS).map(([name, normCentre]) => ({
    name,
    label: name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    normCentre,
    radius: CLUSTER_RADIUS + 30, // slightly larger for background rectangle
  }));
}
