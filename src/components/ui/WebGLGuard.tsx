"use client";

import { useMemo } from "react";

type WebGLGuardProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

export function WebGLGuard({ fallback, children }: WebGLGuardProps) {
  const supported = useMemo(() => {
    if (typeof document === "undefined") return true;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  }, []);

  return <>{supported ? children : fallback}</>;
}
