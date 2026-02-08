"use client";

import { useEffect, useMemo, useState } from "react";
import type { AstroChart } from "@/lib/astro/types";
import { longitudeToSign } from "@/lib/astro/derive";
import {
  generateConstellationSvg,
  type ShareCardBackground
} from "@/lib/astro/sharecards";
import { useExportImage } from "./useExportImage";

interface SharePanelProps {
  chart: AstroChart;
}

type ExtendedShareStyle = "bigThree" | "constellation";

const cardSize = {
  constellation: { width: 1080, height: 1080 },
  bigThree: { width: 1080, height: 1920 }
} as const;

const triggerBlobDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export function SharePanel({ chart }: SharePanelProps) {
  const [style, setStyle] = useState<ExtendedShareStyle>("bigThree");
  const [watermark, setWatermark] = useState(true);
  const [background, setBackground] = useState<ShareCardBackground>("dark");
  const [includeAspects, setIncludeAspects] = useState(true);
  const [status, setStatus] = useState<string>("");
  const [bigThreePreviewUrl, setBigThreePreviewUrl] = useState<string | null>(null);
  const [bigThreePreviewLoading, setBigThreePreviewLoading] = useState(false);

  const { exportSvg, exportPngFromSvg } = useExportImage();

  const dimensions = cardSize[style];

  const bigThreePayload = useMemo(() => {
    const sunValue = chart.points.sun;
    const moonValue = chart.points.moon;
    const ascValue = chart.points.asc;

    if (typeof sunValue !== "number" || typeof moonValue !== "number") {
      return null;
    }

    const sunSign = longitudeToSign(sunValue).sign.toLowerCase();
    const moonSign = longitudeToSign(moonValue).sign.toLowerCase();
    const timeUnknown = typeof ascValue !== "number";
    const risingSign = !timeUnknown ? longitudeToSign(ascValue).sign.toLowerCase() : null;

    return {
      chart: {
        sunSign,
        moonSign,
        risingSign,
        timeUnknown
      },
      options: {
        watermark
      }
    };
  }, [chart, watermark]);

  const svgString = useMemo(() => {
    if (style === "bigThree") {
      return "";
    }

    const opts = {
      width: dimensions.width,
      height: dimensions.height,
      watermark,
      background,
      includeAspects
    };

    return generateConstellationSvg(chart, opts);
  }, [style, chart, dimensions.width, dimensions.height, watermark, background, includeAspects]);

  useEffect(() => {
    if (style !== "bigThree") {
      setBigThreePreviewLoading(false);
      setBigThreePreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return null;
      });
      return;
    }

    if (!bigThreePayload) {
      setStatus("Big Three preview unavailable: missing Sun/Moon.");
      return;
    }

    let cancelled = false;
    let nextUrl: string | null = null;

    const loadPreview = async () => {
      try {
        setBigThreePreviewLoading(true);
        const response = await fetch("/api/astro/share/big-three", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bigThreePayload)
        });

        if (!response.ok) {
          throw new Error(`Preview failed (${response.status})`);
        }

        const blob = await response.blob();
        nextUrl = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(nextUrl);
          return;
        }

        setBigThreePreviewUrl((previousUrl) => {
          if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
          }
          return nextUrl;
        });
      } catch {
        if (!cancelled) {
          setStatus("Could not render Big Three preview.");
        }
      } finally {
        if (!cancelled) {
          setBigThreePreviewLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl);
      }
    };
  }, [style, bigThreePayload]);

  const filenameBase = `awarenessparadox-${style}-${dimensions.width}x${dimensions.height}`;

  const onDownloadSvg = async () => {
    try {
      await exportSvg(svgString, filenameBase);
      setStatus("SVG downloaded.");
    } catch {
      setStatus("SVG export failed.");
    }
  };

  const onDownloadPng = async () => {
    if (style === "bigThree") {
      await onDownloadBigThreePng();
      return;
    }

    try {
      await exportPngFromSvg(svgString, dimensions.width, dimensions.height, filenameBase);
      setStatus("PNG downloaded.");
    } catch {
      setStatus("PNG export failed.");
    }
  };

  const onDownloadBigThreePng = async () => {
    if (!bigThreePayload) {
      setStatus("Big Three export failed: missing Sun/Moon.");
      return;
    }

    try {
      setStatus("Generating Big Three PNG...");
      const response = await fetch("/api/astro/share/big-three", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bigThreePayload)
      });

      if (!response.ok) {
        let errorText = `Big Three export failed (${response.status})`;
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload?.error) {
            errorText = payload.error;
          }
        } catch {
          // Ignore parse failures and keep generic status text.
        }
        throw new Error(errorText);
      }

      const imageBlob = await response.blob();
      const risingLabel = bigThreePayload.chart.risingSign ?? "unknown";
      const sunSign = bigThreePayload.chart.sunSign;
      const moonSign = bigThreePayload.chart.moonSign;
      const filename = `big-three-${sunSign}-${moonSign}-${risingLabel}.png`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");

      triggerBlobDownload(imageBlob, filename);
      setStatus("Big Three PNG downloaded.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Big Three export failed.");
    }
  };

  return (
    <section className="astro-reveal rounded-2xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/55 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[10px] uppercase tracking-[0.32em] text-[color:var(--mist)]">Share</h3>
        <p className="text-[11px] text-[color:var(--mist)]">Deterministic export from chart facts</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[color:var(--mist)]">Style</p>
            <div className="flex gap-2">
              <button
                type="button"
                className={`min-h-[44px] rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                  style === "bigThree"
                    ? "border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 text-[color:var(--bone)]"
                    : "border-[color:var(--copper)]/35 text-[color:var(--mist)]"
                }`}
                onClick={() => setStyle("bigThree")}
              >
                Big Three
              </button>
              <button
                type="button"
                className={`min-h-[44px] rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                  style === "constellation"
                    ? "border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 text-[color:var(--bone)]"
                    : "border-[color:var(--copper)]/35 text-[color:var(--mist)]"
                }`}
                onClick={() => setStyle("constellation")}
              >
                Constellation
              </button>
            </div>
          </div>

          <label className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[color:var(--copper)]/35 px-3 py-2 text-sm text-[color:var(--bone)]">
            <input
              type="checkbox"
              checked={watermark}
              onChange={(event) => setWatermark(event.target.checked)}
              className="h-4 w-4 accent-[color:var(--gilt)]"
            />
            Watermark (@awarenessparadox)
          </label>

          <label className="flex min-h-[44px] items-center gap-3 rounded-xl border border-[color:var(--copper)]/35 px-3 py-2 text-sm text-[color:var(--bone)]">
            <input
              type="checkbox"
              checked={includeAspects}
              onChange={(event) => setIncludeAspects(event.target.checked)}
              className="h-4 w-4 accent-[color:var(--gilt)]"
              disabled={style !== "constellation"}
            />
            Include aspect lines ({style === "constellation" ? "on" : "constellation only"})
          </label>

          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[color:var(--mist)]">Background</p>
            <div className="flex flex-wrap gap-2">
              {(["dark", "light", "transparent"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBackground(mode)}
                  disabled={style !== "constellation"}
                  className={`min-h-[44px] rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${
                    background === mode
                      ? "border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 text-[color:var(--bone)]"
                      : "border-[color:var(--copper)]/35 text-[color:var(--mist)]"
                  } disabled:cursor-not-allowed disabled:opacity-55`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={onDownloadPng}
              className="min-h-[44px] rounded-full border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/16 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--bone)]"
            >
              {style === "bigThree" ? "Download Big Three (PNG)" : "Download PNG"}
            </button>
            <button
              type="button"
              onClick={onDownloadSvg}
              disabled={style === "bigThree"}
              className="min-h-[44px] rounded-full border border-[color:var(--copper)]/45 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[color:var(--bone)]"
            >
              Download SVG
            </button>
          </div>

          <p className="text-xs text-[color:var(--mist)]" aria-live="polite">
            {dimensions.width}x{dimensions.height} • {status}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[color:var(--copper)]/35 bg-[color:var(--bg)]/45 p-2">
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-lg border border-[color:var(--copper)]/20 bg-[color:var(--bg)]/70">
            <div
              className="relative w-full"
              style={{ aspectRatio: `${dimensions.width} / ${dimensions.height}` }}
            >
              {style === "bigThree" ? (
                bigThreePreviewUrl ? (
                  <img
                    src={bigThreePreviewUrl}
                    alt="Big Three preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-[color:var(--mist)]">
                    {bigThreePreviewLoading ? "Rendering preview..." : "Preview unavailable."}
                  </div>
                )
              ) : (
                <div
                  className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: svgString }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
