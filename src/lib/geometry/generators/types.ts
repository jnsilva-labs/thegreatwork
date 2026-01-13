export type Point2D = { x: number; y: number };

export type Circle2D = { cx: number; cy: number; r: number };
export type Polyline2D = { points: Point2D[]; closed?: boolean };
export type Segment2D = { a: Point2D; b: Point2D };

export type GeometryOutput = {
  circles: Circle2D[];
  polylines: Polyline2D[];
  segments: Segment2D[];
};

export type GeneratorInput = {
  size?: number;
  detail?: number;
};

export const emptyGeometry: GeometryOutput = {
  circles: [],
  polylines: [],
  segments: [],
};
