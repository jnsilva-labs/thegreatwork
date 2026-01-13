import { GEOMETRY } from "@/data/geometryCatalog";
import { generatorRegistry } from "@/lib/geometry/generators";

export function assertGeometryCatalog() {
  if (process.env.NODE_ENV === "production") return;

  GEOMETRY.forEach((item) => {
    if (!generatorRegistry[item.generatorId]) {
      throw new Error(`Missing generatorId for geometry item: ${item.generatorId}`);
    }
  });
}
