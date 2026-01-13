import { Vector3 } from "three";

export type Polyline = Vector3[];
export type LineSet = Polyline[];

type CircleOptions = {
  center?: Vector3;
  segments?: number;
};

export function circlePoints(radius: number, options: CircleOptions = {}) {
  const center = options.center ?? new Vector3(0, 0, 0);
  const segments = options.segments ?? 128;
  const points: Vector3[] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = (Math.PI * 2 * i) / segments;
    points.push(
      new Vector3(
        center.x + Math.cos(t) * radius,
        center.y + Math.sin(t) * radius,
        center.z
      )
    );
  }

  return points;
}

export function vesicaPiscis(radius: number, segments = 128): LineSet {
  const offset = radius / 2;
  return [
    circlePoints(radius, { center: new Vector3(-offset, 0, 0), segments }),
    circlePoints(radius, { center: new Vector3(offset, 0, 0), segments }),
  ];
}

export function seedOfLife(radius: number, segments = 128): LineSet {
  const centers = [new Vector3(0, 0, 0)];
  const step = (Math.PI * 2) / 6;
  for (let i = 0; i < 6; i += 1) {
    centers.push(new Vector3(Math.cos(step * i) * radius, Math.sin(step * i) * radius, 0));
  }
  return centers.map((center) => circlePoints(radius, { center, segments }));
}

export function flowerOfLife(radius: number, segments = 128): LineSet {
  const centers = [new Vector3(0, 0, 0)];
  const step = (Math.PI * 2) / 6;
  for (let i = 0; i < 6; i += 1) {
    centers.push(new Vector3(Math.cos(step * i) * radius, Math.sin(step * i) * radius, 0));
  }
  for (let i = 0; i < 6; i += 1) {
    const angle = step * i;
    const ringCenter = new Vector3(
      Math.cos(angle) * radius * 2,
      Math.sin(angle) * radius * 2,
      0
    );
    centers.push(ringCenter);
    centers.push(
      new Vector3(
        ringCenter.x + Math.cos(angle + step) * radius,
        ringCenter.y + Math.sin(angle + step) * radius,
        0
      )
    );
  }
  const lines = centers.map((center) => circlePoints(radius, { center, segments }));
  lines.push(circlePoints(radius * 3, { segments }));
  return lines;
}

export function metatronsCube(radius: number, includePlatonic = false): LineSet {
  const nodes: Vector3[] = [new Vector3(0, 0, 0)];
  const step = (Math.PI * 2) / 6;
  for (let i = 0; i < 6; i += 1) {
    nodes.push(new Vector3(Math.cos(step * i) * radius, Math.sin(step * i) * radius, 0));
  }
  for (let i = 0; i < 6; i += 1) {
    nodes.push(
      new Vector3(Math.cos(step * i) * radius * 2, Math.sin(step * i) * radius * 2, 0)
    );
  }

  const lines: LineSet = [];
  nodes.forEach((start, i) => {
    nodes.forEach((end, j) => {
      if (i >= j) return;
      lines.push([start, end]);
    });
  });

  if (includePlatonic) {
    lines.push(...platonicSolids(radius * 1.2));
  }

  return lines;
}

export function goldenSpiral(turns = 3.5, pointsCount = 240): LineSet {
  const points: Vector3[] = [];
  const a = 0.15;
  const b = 0.306349;
  for (let i = 0; i <= pointsCount; i += 1) {
    const t = (turns * Math.PI * 2 * i) / pointsCount;
    const r = a * Math.exp(b * t);
    points.push(new Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
  }
  return [points];
}

export function fibonacciRectangles(size = 0.4, steps = 6): LineSet {
  const lines: LineSet = [];
  let a = size;
  let b = size;
  let x = -size;
  let y = -size;

  for (let i = 0; i < steps; i += 1) {
    lines.push([
      new Vector3(x, y, 0),
      new Vector3(x + a, y, 0),
      new Vector3(x + a, y + b, 0),
      new Vector3(x, y + b, 0),
      new Vector3(x, y, 0),
    ]);

    const next = a + b;
    x = x + (i % 2 === 0 ? a : -b);
    y = y + (i % 2 === 0 ? 0 : b);
    a = b;
    b = next;
  }

  return lines;
}

export function torusRings(major = 1.2, minor = 0.4, segments = 96, rings = 8): LineSet {
  const lines: LineSet = [];
  for (let i = 0; i < rings; i += 1) {
    const v = (Math.PI * 2 * i) / rings;
    const ring: Vector3[] = [];
    for (let j = 0; j <= segments; j += 1) {
      const u = (Math.PI * 2 * j) / segments;
      const x = (major + minor * Math.cos(v)) * Math.cos(u);
      const y = (major + minor * Math.cos(v)) * Math.sin(u);
      const z = minor * Math.sin(v);
      ring.push(new Vector3(x, y, z));
    }
    lines.push(ring);
  }
  return lines;
}

export function sphereLattice(radius = 1.8, rings = 7, segments = 96): LineSet {
  const lines: LineSet = [];
  for (let i = 1; i < rings; i += 1) {
    const phi = (Math.PI * i) / rings;
    const ringRadius = Math.sin(phi) * radius;
    const y = Math.cos(phi) * radius;
    const ring: Vector3[] = [];
    for (let j = 0; j <= segments; j += 1) {
      const t = (Math.PI * 2 * j) / segments;
      ring.push(new Vector3(Math.cos(t) * ringRadius, y, Math.sin(t) * ringRadius));
    }
    lines.push(ring);
  }
  lines.push(circlePoints(radius, { segments, center: new Vector3(0, 0, 0) }));
  return lines;
}

export function platonicSolids(radius = 1): LineSet {
  const lines: LineSet = [];
  const tetra = [
    new Vector3(1, 1, 1),
    new Vector3(-1, -1, 1),
    new Vector3(-1, 1, -1),
    new Vector3(1, -1, -1),
  ].map((v) => v.multiplyScalar(radius * 0.6));

  const cube = [
    new Vector3(-1, -1, -1),
    new Vector3(1, -1, -1),
    new Vector3(1, 1, -1),
    new Vector3(-1, 1, -1),
    new Vector3(-1, -1, 1),
    new Vector3(1, -1, 1),
    new Vector3(1, 1, 1),
    new Vector3(-1, 1, 1),
  ].map((v) => v.multiplyScalar(radius * 0.5));

  const tetraEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  tetraEdges.forEach(([a, b]) => lines.push([tetra[a], tetra[b]]));

  const cubeEdges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ];
  cubeEdges.forEach(([a, b]) => lines.push([cube[a], cube[b]]));

  return lines;
}
