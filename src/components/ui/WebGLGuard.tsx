"use client";

import { useEffect, useState } from "react";

type WebGLGuardProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

export function WebGLGuard({ fallback, children }: WebGLGuardProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    const isLowPowerDevice =
      Boolean(connection?.saveData) ||
      Boolean(connection?.effectiveType && ["slow-2g", "2g"].includes(connection.effectiveType)) ||
      (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const frame = window.requestAnimationFrame(() => {
      setSupported(Boolean(gl) && !prefersReducedMotion && !isLowPowerDevice);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <>{supported ? children : fallback}</>;
}
