"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { WebGLGuard } from "@/components/ui/WebGLGuard";

const AmbientVeil = dynamic(() => import("@/components/scene/AmbientVeil"), {
  ssr: false,
});

/**
 * Routes that mount their own full-screen RitualCanvas; the ambient layer
 * stays out of their way.
 */
const IMMERSIVE_ROUTES = new Set(["/", "/ripley-scroll"]);

/**
 * Site-wide atmosphere behind every content page: a themeable glow wash,
 * the paper grain, and (where WebGL is welcome) a slow starfield.
 * Purely decorative; content sits above at z-10.
 */
export function AmbientBackdrop() {
  const pathname = usePathname();

  if (IMMERSIVE_ROUTES.has(pathname)) {
    return null;
  }

  return (
    <div aria-hidden="true" className="ambient-backdrop fixed inset-0 -z-10 pointer-events-none">
      <div className="ambient-glow absolute inset-0" />
      <WebGLGuard fallback={null}>
        <div className="absolute inset-0">
          <AmbientVeil />
        </div>
      </WebGLGuard>
      <div className="grain-overlay absolute inset-0 opacity-25" />
    </div>
  );
}
