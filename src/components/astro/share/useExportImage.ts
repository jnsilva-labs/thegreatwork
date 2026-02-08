"use client";

import { useCallback } from "react";

const triggerDownload = (url: string, filename: string): void => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const imageFromUrl = async (url: string): Promise<HTMLImageElement> => {
  const image = new Image();
  image.decoding = "async";

  const loaded = new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to decode SVG image"));
  });

  image.src = url;

  if (typeof image.decode === "function") {
    try {
      await image.decode();
    } catch {
      await loaded;
    }
  } else {
    await loaded;
  }

  return image;
};

export function useExportImage() {
  const exportSvg = useCallback(async (svgString: string, filename: string) => {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    try {
      triggerDownload(url, filename.endsWith(".svg") ? filename : `${filename}.svg`);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }, []);

  const exportPngFromSvg = useCallback(
    async (svgString: string, width: number, height: number, filename: string) => {
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      try {
        const image = await imageFromUrl(svgUrl);
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.floor(width));
        canvas.height = Math.max(1, Math.floor(height));

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas 2D context not available");
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("PNG export failed: canvas blob unavailable"));
                return;
              }

              resolve(blob);
            },
            "image/png",
            1
          );
        });

        const pngUrl = URL.createObjectURL(pngBlob);
        try {
          triggerDownload(pngUrl, filename.endsWith(".png") ? filename : `${filename}.png`);
        } finally {
          setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
        }
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    },
    []
  );

  return {
    exportSvg,
    exportPngFromSvg
  };
}
