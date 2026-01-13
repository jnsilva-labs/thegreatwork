import type {
  Circle2D,
  GeometryOutput,
  Point2D,
  Polyline2D,
  Segment2D,
} from "@/lib/geometry/generators/types";

export type PlateVariant = "thumbnail" | "detail";

export type PlateOptions = {
  width: number;
  height: number;
  padding: number;
  strokeWidth: number;
  styleVariant: PlateVariant;
  seed?: number;
};

type Bounds = { minX: number; maxX: number; minY: number; maxY: number };

export function renderPlateSvg(geometry: GeometryOutput, options: PlateOptions) {
  const bounds = getBounds(geometry);
  const safeBounds = expandBounds(bounds, 0.05);
  const scale = getScale(safeBounds, options.width, options.height, options.padding);
  const offset = getOffset(safeBounds, options.width, options.height, options.padding, scale);
  const rand = mulberry32(options.seed ?? 1);

  const stroke = options.styleVariant === "thumbnail" ? "#b89b5e" : "#e8e3d8";
  const accent = options.styleVariant === "thumbnail" ? "#e8e3d8" : "#b89b5e";

  const circlePaths = geometry.circles
    .map((circle) => circleToSvg(circle, scale, offset, options, rand, stroke))
    .join("\n");

  const polylinePaths = geometry.polylines
    .map((polyline) => polylineToSvg(polyline, scale, offset, options, rand, accent))
    .join("\n");

  const segmentPaths = geometry.segments
    .map((segment) => segmentToSvg(segment, scale, offset, options, rand, accent))
    .join("\n");

  const grain = options.styleVariant === "detail" ? createGrainFilter() : "";
  const filterRef = options.styleVariant === "detail" ? "filter=\"url(#grain)\"" : "";

  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${options.width} ${options.height}" preserveAspectRatio="xMidYMid meet" style="display:block">\n  <defs>\n    ${grain}\n  </defs>\n  <g ${filterRef} stroke-linecap="round" stroke-linejoin="round" fill="none">\n    ${circlePaths}\n    ${polylinePaths}\n    ${segmentPaths}\n  </g>\n</svg>`;
}

function circleToSvg(
  circle: Circle2D,
  scale: number,
  offset: Point2D,
  options: PlateOptions,
  rand: () => number,
  stroke: string
) {
  const opacity = 0.55 + jitter(rand, 0.2);
  const cx = circle.cx * scale + offset.x;
  const cy = circle.cy * scale + offset.y;
  const r = circle.r * scale;
  return `<circle cx="${cx.toFixed(3)}" cy="${cy.toFixed(3)}" r="${r.toFixed(3)}" stroke="${stroke}" stroke-width="${options.strokeWidth}" opacity="${opacity.toFixed(3)}" />`;
}

function polylineToSvg(
  polyline: Polyline2D,
  scale: number,
  offset: Point2D,
  options: PlateOptions,
  rand: () => number,
  stroke: string
) {
  const opacity = 0.6 + jitter(rand, 0.2);
  const path = polyline.points
    .map((point, idx) => {
      const jittered = applyJitter(point, rand, 0.002);
      const x = jittered.x * scale + offset.x;
      const y = jittered.y * scale + offset.y;
      return `${idx === 0 ? "M" : "L"}${x.toFixed(3)} ${y.toFixed(3)}`;
    })
    .join(" ");
  const closed = polyline.closed ? " Z" : "";
  return `<path d="${path}${closed}" stroke="${stroke}" stroke-width="${options.strokeWidth}" opacity="${opacity.toFixed(3)}" />`;
}

function segmentToSvg(
  segment: Segment2D,
  scale: number,
  offset: Point2D,
  options: PlateOptions,
  rand: () => number,
  stroke: string
) {
  const opacity = 0.5 + jitter(rand, 0.2);
  const a = applyJitter(segment.a, rand, 0.002);
  const b = applyJitter(segment.b, rand, 0.002);
  const x1 = a.x * scale + offset.x;
  const y1 = a.y * scale + offset.y;
  const x2 = b.x * scale + offset.x;
  const y2 = b.y * scale + offset.y;
  return `<line x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}" stroke="${stroke}" stroke-width="${options.strokeWidth}" opacity="${opacity.toFixed(3)}" />`;
}

function getBounds(geometry: GeometryOutput): Bounds {
  const points: Point2D[] = [];
  geometry.circles.forEach((circle) => {
    points.push({ x: circle.cx + circle.r, y: circle.cy });
    points.push({ x: circle.cx - circle.r, y: circle.cy });
    points.push({ x: circle.cx, y: circle.cy + circle.r });
    points.push({ x: circle.cx, y: circle.cy - circle.r });
  });
  geometry.polylines.forEach((polyline) => {
    points.push(...polyline.points);
  });
  geometry.segments.forEach((segment) => {
    points.push(segment.a, segment.b);
  });

  if (points.length === 0) {
    return { minX: -1, maxX: 1, minY: -1, maxY: 1 };
  }

  return points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: points[0].x, maxX: points[0].x, minY: points[0].y, maxY: points[0].y }
  );
}

function expandBounds(bounds: Bounds, padding: number): Bounds {
  const dx = bounds.maxX - bounds.minX;
  const dy = bounds.maxY - bounds.minY;
  return {
    minX: bounds.minX - dx * padding,
    maxX: bounds.maxX + dx * padding,
    minY: bounds.minY - dy * padding,
    maxY: bounds.maxY + dy * padding,
  };
}

function getScale(bounds: Bounds, width: number, height: number, padding: number) {
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;
  const scaleX = availableWidth / (bounds.maxX - bounds.minX || 1);
  const scaleY = availableHeight / (bounds.maxY - bounds.minY || 1);
  return Math.min(scaleX, scaleY);
}

function getOffset(bounds: Bounds, width: number, height: number, padding: number, scale: number): Point2D {
  const contentWidth = (bounds.maxX - bounds.minX) * scale;
  const contentHeight = (bounds.maxY - bounds.minY) * scale;
  return {
    x: padding + (width - padding * 2 - contentWidth) / 2 - bounds.minX * scale,
    y: padding + (height - padding * 2 - contentHeight) / 2 - bounds.minY * scale,
  };
}

function jitter(rand: () => number, amplitude: number) {
  return (rand() - 0.5) * amplitude;
}

function applyJitter(point: Point2D, rand: () => number, amplitude: number): Point2D {
  return {
    x: point.x + jitter(rand, amplitude),
    y: point.y + jitter(rand, amplitude),
  };
}

function createGrainFilter() {
  return `\n    <filter id="grain" x="0" y="0" width="100%" height="100%">\n      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" result="noise" />\n      <feColorMatrix type="saturate" values="0" />\n      <feComponentTransfer>\n        <feFuncA type="table" tableValues="0 0.08" />\n      </feComponentTransfer>\n      <feBlend in="SourceGraphic" in2="noise" mode="soft-light" />\n    </filter>`;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
