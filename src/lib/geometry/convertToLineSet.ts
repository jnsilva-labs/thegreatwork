import { Vector3 } from "three";
import type { GeometryOutput } from "@/lib/geometry/generators/types";
import type { LineSet } from "@/lib/geometry";

export function geometryToLineSet(geometry: GeometryOutput, detail = 160): LineSet {
  const lines: LineSet = [];

  geometry.circles.forEach((circle) => {
    const points: Vector3[] = [];
    for (let i = 0; i <= detail; i += 1) {
      const t = (Math.PI * 2 * i) / detail;
      points.push(
        new Vector3(
          circle.cx + Math.cos(t) * circle.r,
          circle.cy + Math.sin(t) * circle.r,
          0
        )
      );
    }
    lines.push(points);
  });

  geometry.polylines.forEach((polyline) => {
    const points = polyline.points.map((point) => new Vector3(point.x, point.y, 0));
    lines.push(points);
  });

  geometry.segments.forEach((segment) => {
    lines.push([
      new Vector3(segment.a.x, segment.a.y, 0),
      new Vector3(segment.b.x, segment.b.y, 0),
    ]);
  });

  return lines;
}
