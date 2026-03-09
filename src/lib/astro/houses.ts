const normalizeDegrees = (value: number): number => {
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
};

export const resolveTransitHouse = (longitude: number, cusps: number[]): number | null => {
  if (!Array.isArray(cusps) || cusps.length !== 12) {
    return null;
  }

  const normalizedLongitude = normalizeDegrees(longitude);

  for (let index = 0; index < cusps.length; index += 1) {
    const start = normalizeDegrees(cusps[index]);
    const end = normalizeDegrees(cusps[(index + 1) % cusps.length]);
    const inHouse =
      start <= end
        ? normalizedLongitude >= start && normalizedLongitude < end
        : normalizedLongitude >= start || normalizedLongitude < end;

    if (inHouse) {
      return index + 1;
    }
  }

  return 12;
};

export const describeHouseSystem = (houseSystem: "wholeSign" | "placidus"): string => {
  return houseSystem === "wholeSign"
    ? "Whole Sign maps one full sign to each house."
    : "Placidus divides houses by time and quadrant."
};
