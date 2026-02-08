import { describe, expect, it } from "vitest";
import { convertBirthLocalToUtc, isValidIanaTimezone } from "../lib/astro/time";

describe("convertBirthLocalToUtc", () => {
  it("converts local time to UTC for known timezone", () => {
    const result = convertBirthLocalToUtc({
      birthDate: "1990-01-01",
      birthTime: "07:30",
      timeUnknown: false,
      timezone: "America/New_York"
    });

    expect(result.datetimeUtc).toBe("1990-01-01T12:30:00Z");
    expect(result.assumedNoon).toBe(false);
  });

  it("uses noon when timeUnknown is true", () => {
    const result = convertBirthLocalToUtc({
      birthDate: "1990-07-04",
      timeUnknown: true,
      timezone: "America/Los_Angeles"
    });

    expect(result.localTimeUsed).toBe("12:00");
    expect(result.assumedNoon).toBe(true);
    expect(result.datetimeUtc.endsWith("Z")).toBe(true);
  });

  it("validates IANA timezone", () => {
    expect(isValidIanaTimezone("America/New_York")).toBe(true);
    expect(isValidIanaTimezone("Not/A_Zone")).toBe(false);
  });

  it("throws on invalid timezone", () => {
    expect(() =>
      convertBirthLocalToUtc({
        birthDate: "1990-01-01",
        birthTime: "10:00",
        timeUnknown: false,
        timezone: "Not/A_Zone"
      })
    ).toThrow("Invalid timezone");
  });
});
