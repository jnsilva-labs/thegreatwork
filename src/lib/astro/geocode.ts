import tzLookup from "tz-lookup";
import type { GeocodeResult } from "./types";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const geocodeCache = new Map<string, { expiresAt: number; value: GeocodeResult }>();

const normalizeQuery = (query: string): string => query.trim().toLowerCase();

const fetchJsonWithTimeout = async <T>(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Geocode provider failed (${response.status}): ${detail.slice(0, 180)}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Geocode provider timed out");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

interface ProviderResult {
  lat: number;
  lon: number;
  displayName: string;
}

interface GeocodeProvider {
  id: string;
  geocode(place: string): Promise<ProviderResult>;
}

class OpenCageProvider implements GeocodeProvider {
  id = "opencage";

  constructor(private readonly apiKey: string) {}

  async geocode(place: string): Promise<ProviderResult> {
    const url = new URL("https://api.opencagedata.com/geocode/v1/json");
    url.searchParams.set("q", place);
    url.searchParams.set("limit", "1");
    url.searchParams.set("no_annotations", "1");
    url.searchParams.set("key", this.apiKey);

    const payload = await fetchJsonWithTimeout<{
      results?: Array<{
        formatted?: string;
        geometry?: { lat?: number; lng?: number };
      }>;
    }>(url.toString(), { method: "GET" }, 6000);

    const first = payload.results?.[0];
    const lat = first?.geometry?.lat;
    const lon = first?.geometry?.lng;

    if (typeof lat !== "number" || typeof lon !== "number") {
      throw new Error("Geocode provider returned no coordinates");
    }

    return {
      lat,
      lon,
      displayName: first?.formatted ?? place
    };
  }
}

class NominatimProvider implements GeocodeProvider {
  id = "nominatim";

  async geocode(place: string): Promise<ProviderResult> {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", place);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("limit", "1");
    url.searchParams.set("addressdetails", "0");

    const payload = await fetchJsonWithTimeout<
      Array<{
        lat?: string;
        lon?: string;
        display_name?: string;
      }>
    >(
      url.toString(),
      {
        method: "GET",
        headers: {
          "User-Agent": "AwarenessParadoxAstro/1.0"
        }
      },
      7000
    );

    const first = payload[0];
    const lat = Number(first?.lat);
    const lon = Number(first?.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      throw new Error("Geocode provider returned no coordinates");
    }

    return {
      lat,
      lon,
      displayName: first?.display_name ?? place
    };
  }
}

const getProvider = (): GeocodeProvider => {
  const preferred = process.env.ASTRO_GEOCODE_PROVIDER?.toLowerCase();
  const openCageKey = process.env.OPENCAGE_API_KEY;

  if ((preferred === "opencage" || !preferred) && openCageKey) {
    return new OpenCageProvider(openCageKey);
  }

  if (preferred === "nominatim" || !preferred) {
    return new NominatimProvider();
  }

  if (preferred === "opencage" && !openCageKey) {
    throw new Error("ASTRO_GEOCODE_PROVIDER is opencage but OPENCAGE_API_KEY is missing");
  }

  return new NominatimProvider();
};

export const geocodeBirthPlace = async (place: string): Promise<GeocodeResult> => {
  const key = normalizeQuery(place);
  const now = Date.now();

  const cached = geocodeCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const provider = getProvider();
  const coords = await provider.geocode(place);

  let timezone: string;
  try {
    timezone = tzLookup(coords.lat, coords.lon);
  } catch {
    throw new Error("Failed to derive timezone from geocoded coordinates");
  }

  const result: GeocodeResult = {
    lat: coords.lat,
    lon: coords.lon,
    timezone,
    provider: provider.id,
    displayName: coords.displayName
  };

  geocodeCache.set(key, {
    expiresAt: now + CACHE_TTL_MS,
    value: result
  });

  return result;
};

export const clearGeocodeCache = (): void => {
  geocodeCache.clear();
};
