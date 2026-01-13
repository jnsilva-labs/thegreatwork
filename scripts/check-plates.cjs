/* eslint-disable @typescript-eslint/no-require-imports */
require("ts-node/register");
require("tsconfig-paths/register");

const { GEOMETRY } = require("../src/data/geometryCatalog");
const { generateGeometry } = require("../src/lib/geometry/generators");
const { renderPlateSvg } = require("../src/lib/plates/renderPlateSvg");
const { assertGeometryCatalog } = require("../src/lib/geometry/assertCatalog");

let failed = false;

try {
  assertGeometryCatalog();
} catch (error) {
  console.error("Geometry catalog assertion failed:", error);
  process.exit(1);
}

GEOMETRY.forEach((item) => {
  try {
    const geometry = generateGeometry(item.generatorId, { size: 2, detail: 140 });
    renderPlateSvg(geometry, {
      width: 320,
      height: 240,
      padding: 24,
      strokeWidth: 1.2,
      styleVariant: "thumbnail",
      seed: 1,
    });
  } catch (error) {
    failed = true;
    console.error(`Plate generation failed for ${item.slug}:`, error);
  }
});

if (failed) {
  process.exit(1);
}

console.log("Plate generation OK");
