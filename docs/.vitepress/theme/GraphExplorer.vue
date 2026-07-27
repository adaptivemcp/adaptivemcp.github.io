<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as d3 from "d3";

interface GraphNode {
  id: string;
  tool: string;
  server?: string;
  parent?: string;
  children: string[];
  duration_ms?: number;
  status: string;
  cost?: number;
  model?: string;
  x?: number;
  y?: number;
}
interface GraphEdge {
  from: string;
  to: string;
}
interface ExecutionGraphResource {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const props = withDefaults(defineProps<{ src?: string }>(), {
  src: "/sample-execution-graph.json",
});

const container = ref<HTMLDivElement | null>(null);
const selected = ref<GraphNode | null>(null);
const error = ref<string | null>(null);

const STATUS_COLORS: Record<string, string> = {
  completed: "#2ecc71",
  failed: "#e74c3c",
  started: "#f1c40f",
  cancelled: "#95a5a6",
};

function colorFor(status: string): string {
  return STATUS_COLORS[status] ?? "#3498db";
}

/**
 * Force-directed layout via d3-force, rendered as SVG, with drag-to-reposition
 * and scroll/pinch zoom (d3-zoom). Runs only client-side (`onMounted` never
 * fires during VitePress's SSR build pass), since D3 here manipulates the DOM
 * directly rather than through Vue's reactivity.
 */
async function render(): Promise<void> {
  if (!container.value) return;
  container.value.innerHTML = "";

  let data: ExecutionGraphResource;
  try {
    const res = await fetch(props.src);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    data = await res.json();
  } catch (e) {
    error.value = `Failed to load ${props.src}: ${(e as Error).message}`;
    return;
  }
  error.value = null;

  const width = container.value.clientWidth || 800;
  const height = 480;

  const svg = d3
    .select(container.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`);

  const g = svg.append("g");

  svg.call(
    d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => g.attr("transform", event.transform)),
  );

  const nodes = data.nodes.map((n) => ({ ...n })) as (GraphNode & d3.SimulationNodeDatum)[];
  const links = data.edges.map((e) => ({ source: e.from, target: e.to }));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d: any) => d.id)
        .distance(90),
    )
    .force("charge", d3.forceManyBody().strength(-250))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide(36));

  const link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 1.5);

  const nodeGroup = g
    .append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("cursor", "pointer")
    .on("click", (_event, d: any) => {
      selected.value = d;
    })
    .call(
      d3
        .drag<any, any>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }),
    );

  nodeGroup.append("circle").attr("r", 22).attr("fill", (d: any) => colorFor(d.status)).attr("stroke", "#fff").attr("stroke-width", 2);

  nodeGroup
    .append("text")
    .text((d: any) => d.tool.split(".").pop() ?? d.tool)
    .attr("text-anchor", "middle")
    .attr("dy", 4)
    .attr("font-size", 9)
    .attr("fill", "#111")
    .attr("pointer-events", "none");

  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);
    nodeGroup.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
  });
}

onMounted(() => {
  render();
});

watch(() => props.src, render);
</script>

<template>
  <div class="graph-explorer">
    <div class="legend">
      <span class="legend-item"><span class="dot" style="background: #2ecc71" />completed</span>
      <span class="legend-item"><span class="dot" style="background: #e74c3c" />failed</span>
      <span class="legend-item"><span class="dot" style="background: #f1c40f" />started</span>
      <span class="hint">drag to reposition · scroll/pinch to zoom · click a node for details</span>
    </div>
    <div ref="container" class="canvas" />
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="selected" class="details">
      <button class="close" @click="selected = null">×</button>
      <h4>{{ selected.tool }}</h4>
      <table>
        <tr>
          <td>Status</td>
          <td>{{ selected.status }}</td>
        </tr>
        <tr v-if="selected.server">
          <td>Server</td>
          <td>{{ selected.server }}</td>
        </tr>
        <tr v-if="selected.model">
          <td>Model</td>
          <td>{{ selected.model }}</td>
        </tr>
        <tr v-if="selected.duration_ms != null">
          <td>Duration</td>
          <td>{{ selected.duration_ms }}ms</td>
        </tr>
        <tr v-if="selected.cost != null">
          <td>Cost</td>
          <td>${{ selected.cost.toFixed(4) }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.graph-explorer {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  margin: 24px 0;
}
.legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
.hint {
  margin-left: auto;
  font-style: italic;
  opacity: 0.8;
}
.canvas {
  width: 100%;
  min-height: 480px;
}
.canvas svg {
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}
.error {
  color: var(--vp-c-danger-1);
}
.details {
  position: absolute;
  top: 48px;
  right: 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: var(--vp-shadow-3);
  min-width: 200px;
}
.details h4 {
  margin: 0 0 8px;
}
.details table td {
  padding: 2px 8px 2px 0;
  font-size: 13px;
}
.details table td:first-child {
  color: var(--vp-c-text-2);
}
.close {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--vp-c-text-2);
}
</style>
