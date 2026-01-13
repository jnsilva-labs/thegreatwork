import type { GeometrySlug } from "@/data/geometryCatalog";
import {
  emptyGeometry,
  type Circle2D,
  type GeometryOutput,
  type GeneratorInput,
  type Point2D,
  type Polyline2D,
  type Segment2D,
} from "./types";

const DEFAULT_SIZE = 2;
const DEFAULT_DETAIL = 120;

export type GeneratorFn = (input?: GeneratorInput) => GeometryOutput;
export type { GeometryOutput, GeneratorInput } from "./types";

export const generatorRegistry: Record<GeometrySlug, GeneratorFn> = {
  "seed-of-life": seedOfLife,
  "flower-of-life": flowerOfLife,
  "metatrons-cube": metatronsCube,
  "vesica-piscis": vesicaPiscis,
  "golden-spiral": goldenSpiral,
  "fibonacci-rectangles": fibonacciRectangles,
  torus: torus,
  "sphere-lattice": sphereLattice,
};

export function generateGeometry(slug: GeometrySlug, input?: GeneratorInput) {
  const generator = generatorRegistry[slug];
  if (!generator) {
    throw new Error(`Missing generator for geometry slug: ${slug}`);
  }
  const geometry = generator(input);
  validateGeometry(geometry, input?.size ?? DEFAULT_SIZE);
  return geometry;
}

function seedOfLife(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const radius = size / 3;
  const circles: Circle2D[] = [{ cx: 0, cy: 0, r: radius }];
  const step = (Math.PI * 2) / 6;

  for (let i = 0; i < 6; i += 1) {
    circles.push({
      cx: Math.cos(step * i) * radius,
      cy: Math.sin(step * i) * radius,
      r: radius,
    });
  }

  return { ...emptyGeometry, circles };
}

function flowerOfLife(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const radius = size / 3.1;
  const circles: Circle2D[] = [{ cx: 0, cy: 0, r: radius }];
  const step = (Math.PI * 2) / 6;

  for (let ring = 1; ring <= 2; ring += 1) {
    for (let i = 0; i < 6; i += 1) {
      circles.push({
        cx: Math.cos(step * i) * radius * ring,
        cy: Math.sin(step * i) * radius * ring,
        r: radius,
      });
    }
  }

  circles.push({ cx: 0, cy: 0, r: radius * 3 });

  return { ...emptyGeometry, circles };
}

function vesicaPiscis(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const radius = size / 2.2;
  const offset = radius / 2;
  const circles: Circle2D[] = [
    { cx: -offset, cy: 0, r: radius },
    { cx: offset, cy: 0, r: radius },
  ];

  return { ...emptyGeometry, circles };
}

function metatronsCube(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const radius = size / 3;
  const points: Point2D[] = [{ x: 0, y: 0 }];
  const step = (Math.PI * 2) / 6;

  for (let i = 0; i < 6; i += 1) {
    points.push({
      x: Math.cos(step * i) * radius,
      y: Math.sin(step * i) * radius,
    });
  }
  for (let i = 0; i < 6; i += 1) {
    points.push({
      x: Math.cos(step * i) * radius * 2,
      y: Math.sin(step * i) * radius * 2,
    });
  }

  const segments: Segment2D[] = [];
  points.forEach((start, i) => {
    points.forEach((end, j) => {
      if (i >= j) return;
      segments.push({ a: start, b: end });
    });
  });

  return { ...emptyGeometry, segments };
}

function goldenSpiral(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const detail = input?.detail ?? DEFAULT_DETAIL;
  const points: Point2D[] = [];
  const turns = 3;
  const tMax = turns * Math.PI * 2;
  const rStart = size * 0.05;
  const rEnd = size * 0.45;
  const k = Math.log(rEnd / rStart) / tMax;

  for (let i = 0; i <= detail; i += 1) {
    const t = (tMax * i) / detail;
    const r = rStart * Math.exp(k * t);
    points.push({ x: Math.cos(t) * r, y: Math.sin(t) * r });
  }

  const rectangles = fibonacciRectangles(input).polylines;

  return {
    circles: [],
    segments: [],
    polylines: [{ points }, ...rectangles],
  };
}

function fibonacciRectangles(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const steps = 6;
  const polylines: Polyline2D[] = [];
  let a = 1;
  let b = 1;
  let x = -a;
  let y = -b;

  for (let i = 0; i < steps; i += 1) {
    polylines.push({
      points: [
        { x, y },
        { x: x + a, y },
        { x: x + a, y: y + b },
        { x, y: y + b },
        { x, y },
      ],
      closed: true,
    });

    const next = a + b;
    if (i % 2 === 0) {
      x = x + a;
    } else {
      y = y + b;
    }
    a = b;
    b = next;
  }

  const scaled = scalePolylines(polylines, size * 0.45);
  return { ...emptyGeometry, polylines: scaled };
}

function torus(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const major = size * 0.55;
  const minor = size * 0.18;
  const circles: Circle2D[] = [];

  for (let i = -3; i <= 3; i += 1) {
    const offset = (i / 3) * minor * 1.2;
    circles.push({ cx: offset, cy: 0, r: major - Math.abs(offset) * 0.6 });
  }

  for (let i = -2; i <= 2; i += 1) {
    const offset = (i / 2) * major * 0.4;
    circles.push({ cx: 0, cy: offset, r: minor + Math.abs(offset) * 0.2 });
  }

  return { ...emptyGeometry, circles };
}

function sphereLattice(input?: GeneratorInput): GeometryOutput {
  const size = input?.size ?? DEFAULT_SIZE;
  const rings = 6;
  const circles: Circle2D[] = [];
  const polylines: Polyline2D[] = [];

  for (let i = 1; i < rings; i += 1) {
    const t = i / rings;
    const r = Math.sin(Math.PI * t) * size * 0.5;
    circles.push({ cx: 0, cy: 0, r });
  }

  const points: Point2D[] = [];
  const count = 48;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * radius * size * 0.45, y: y * size * 0.45 });
  }

  polylines.push({ points, closed: false });

  return { circles, polylines, segments: [] };
}

function validateGeometry(geometry: GeometryOutput, size: number) {
  const limit = size * 1.6;
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
    throw new Error("Geometry generator returned no points.");
  }

  points.forEach((point) => {
    if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
      throw new Error("Geometry generator produced NaN values.");
    }
    if (Math.abs(point.x) > limit || Math.abs(point.y) > limit) {
      throw new Error("Geometry generator produced out-of-bounds values.");
    }
  });
}

function scalePolylines(polylines: Polyline2D[], targetRadius: number) {
  const points = polylines.flatMap((polyline) => polyline.points);
  const bounds = points.reduce(
    (acc, point) => ({
      minX: Math.min(acc.minX, point.x),
      maxX: Math.max(acc.maxX, point.x),
      minY: Math.min(acc.minY, point.y),
      maxY: Math.max(acc.maxY, point.y),
    }),
    { minX: points[0].x, maxX: points[0].x, minY: points[0].y, maxY: points[0].y }
  );
  const maxRadius = Math.max(
    Math.abs(bounds.minX),
    Math.abs(bounds.maxX),
    Math.abs(bounds.minY),
    Math.abs(bounds.maxY)
  );
  const scale = maxRadius > 0 ? targetRadius / maxRadius : 1;
  return polylines.map((polyline) => ({
    ...polyline,
    points: polyline.points.map((point) => ({ x: point.x * scale, y: point.y * scale })),
  }));
}
