import { CatmullRomCurve3, Vector3 } from "three";

export function vesicaPiscis(radius: number, segments = 120) {
  const points: Vector3[] = [];
  const offset = radius * 0.6;

  for (let i = 0; i <= segments; i += 1) {
    const t = (Math.PI * 2 * i) / segments;
    points.push(new Vector3(Math.cos(t) * radius - offset, Math.sin(t) * radius, 0));
  }
  for (let i = 0; i <= segments; i += 1) {
    const t = (Math.PI * 2 * i) / segments;
    points.push(new Vector3(Math.cos(t) * radius + offset, Math.sin(t) * radius, 0));
  }

  return points;
}

export function flowerOfLife(radius: number, petals = 6) {
  const points: Vector3[] = [];
  const circleSegments = 80;
  const angleStep = (Math.PI * 2) / petals;

  for (let p = 0; p < petals; p += 1) {
    const center = new Vector3(
      Math.cos(angleStep * p) * radius,
      Math.sin(angleStep * p) * radius,
      0
    );
    for (let i = 0; i <= circleSegments; i += 1) {
      const t = (Math.PI * 2 * i) / circleSegments;
      points.push(
        new Vector3(Math.cos(t) * radius + center.x, Math.sin(t) * radius + center.y, 0)
      );
    }
  }

  return points;
}

export function metatronsCube(radius: number) {
  const points: Vector3[] = [];
  const nodes: Vector3[] = [];
  const layers = [0, 1, 2];
  const step = (Math.PI * 2) / 6;

  layers.forEach((layer) => {
    const r = radius * (layer + 1) * 0.45;
    for (let i = 0; i < 6; i += 1) {
      nodes.push(new Vector3(Math.cos(step * i) * r, Math.sin(step * i) * r, 0));
    }
  });
  nodes.push(new Vector3(0, 0, 0));

  nodes.forEach((start, i) => {
    nodes.forEach((end, j) => {
      if (i >= j) return;
      points.push(start.clone(), end.clone());
    });
  });

  return points;
}

export function goldenSpiral(turns = 3.5, pointsCount = 260) {
  const points: Vector3[] = [];
  const a = 0.2;
  const b = 0.306349;

  for (let i = 0; i <= pointsCount; i += 1) {
    const t = (turns * Math.PI * 2 * i) / pointsCount;
    const r = a * Math.exp(b * t);
    points.push(new Vector3(Math.cos(t) * r, Math.sin(t) * r, 0));
  }

  return points;
}

export function fibonacciRectangles(size = 0.5, steps = 6) {
  const points: Vector3[] = [];
  let a = size;
  let b = size;
  let x = -size;
  let y = -size;

  for (let i = 0; i < steps; i += 1) {
    points.push(
      new Vector3(x, y, 0),
      new Vector3(x + a, y, 0),
      new Vector3(x + a, y + b, 0),
      new Vector3(x, y + b, 0),
      new Vector3(x, y, 0)
    );

    const next = a + b;
    x = x + (i % 2 === 0 ? a : -b);
    y = y + (i % 2 === 0 ? 0 : b);
    a = b;
    b = next;
  }

  return points;
}

export function curveFromPoints(points: Vector3[]) {
  return new CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

export function applyEtchingJitter(points: Vector3[], amount: number, seed = 8) {
  const rand = mulberry32(seed);
  return points.map((point) => {
    const jitter = () => (rand() - 0.5) * amount;
    return new Vector3(
      point.x + jitter(),
      point.y + jitter(),
      point.z + jitter() * 0.2
    );
  });
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
