"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Stars, useCursor } from "@react-three/drei";
import { SIGN_GLYPHS, planetGlyph, type ChartMarker } from "@/lib/astro/display";
import type { ThemeColors } from "@/lib/themeStore";

// The Celestial Instrument: an engraved ecliptic ring in space. Planets sit at
// their true longitudes, house cusps etch the disc, aspects run as chords.
// Chart convention: Ascendant on the left, zodiac counterclockwise.

const RAD = Math.PI / 180;
const RING_INNER = 1.9;
const RING_OUTER = 2.0;
const PLANET_RADIUS = 1.62;
const PLANET_Y = 0.1;

interface AspectLike {
  a: string;
  b: string;
  type: string;
}

interface SceneProps {
  markers: ChartMarker[];
  cusps: number[] | null;
  aspects: AspectLike[];
  ascLon: number;
  colors: ThemeColors;
  activeKey: string | null;
  onSelect: (key: string | null) => void;
}

const lonToAngle = (lon: number, ascLon: number) => Math.PI + (lon - ascLon) * RAD;

const lonToPosition = (lon: number, ascLon: number, radius: number, y = 0): [number, number, number] => {
  const angle = lonToAngle(lon, ascLon);
  return [radius * Math.cos(angle), y, -radius * Math.sin(angle)];
};

/** Crisp text drawn once onto a canvas texture; avoids 3D font fetching. */
const makeGlyphTexture = (text: string, color: string) => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = color;
    ctx.font = `400 84px "Cormorant Garamond", "Times New Roman", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // U+FE0E forces the text presentation so zodiac/planet glyphs never
    // fall through to the color emoji font.
    ctx.fillText(`${text}︎`, size / 2, size / 2 + 6);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 2;
  return texture;
};

const makeGlowTexture = (color: string) => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.35, `${color}66`);
    gradient.addColorStop(1, `${color}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
};

function GlyphSprite({
  text,
  color,
  position,
  scale = 0.3,
  opacity = 1
}: {
  text: string;
  color: string;
  position: [number, number, number];
  scale?: number;
  opacity?: number;
}) {
  const texture = useMemo(() => makeGlyphTexture(text, color), [text, color]);
  return (
    <sprite position={position} scale={[scale, scale, scale]}>
      <spriteMaterial map={texture} transparent opacity={opacity} depthWrite={false} />
    </sprite>
  );
}

function Planet({
  marker,
  ascLon,
  colors,
  isActive,
  isDimmed,
  onSelect
}: {
  marker: ChartMarker;
  ascLon: number;
  colors: ThemeColors;
  isActive: boolean;
  isDimmed: boolean;
  onSelect: (key: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const glowTexture = useMemo(() => makeGlowTexture(colors.glow), [colors.glow]);
  const position = lonToPosition(marker.lon, ascLon, PLANET_RADIUS, PLANET_Y);
  const emphasis = isActive || hovered;
  const baseOpacity = isDimmed ? 0.35 : 1;

  return (
    <group position={position}>
      {/* stem from the disc up to the body */}
      <Line
        points={[
          [0, -PLANET_Y, 0],
          [0, 0, 0]
        ]}
        color={colors.accent}
        transparent
        opacity={0.3 * baseOpacity}
        lineWidth={1}
      />
      <sprite scale={emphasis ? [0.62, 0.62, 0.62] : [0.42, 0.42, 0.42]}>
        <spriteMaterial
          map={glowTexture}
          transparent
          opacity={(emphasis ? 0.9 : 0.55) * baseOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          onSelect(marker.key);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(isActive ? null : marker.key);
        }}
      >
        {/* generous invisible hit area */}
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh scale={emphasis ? 1.4 : 1}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={baseOpacity} />
      </mesh>
      <GlyphSprite
        text={planetGlyph[marker.key] ?? marker.key.slice(0, 1).toUpperCase()}
        color={colors.line}
        position={[0, 0.26, 0]}
        scale={emphasis ? 0.34 : 0.26}
        opacity={(emphasis ? 1 : 0.8) * baseOpacity}
      />
    </group>
  );
}

function InstrumentScene({ markers, cusps, aspects, ascLon, colors, activeKey, onSelect }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !activeKey) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  const markerByKey = useMemo(() => new Map(markers.map((m) => [m.key, m])), [markers]);

  const aspectLines = useMemo(() => {
    return aspects
      .filter((aspect) => aspect.type !== "conjunction")
      .map((aspect) => {
        const a = markerByKey.get(aspect.a);
        const b = markerByKey.get(aspect.b);
        if (!a || !b) return null;
        return {
          id: `${aspect.a}-${aspect.b}-${aspect.type}`,
          involves: (key: string) => key === aspect.a || key === aspect.b,
          from: lonToPosition(a.lon, ascLon, PLANET_RADIUS, 0.02),
          to: lonToPosition(b.lon, ascLon, PLANET_RADIUS, 0.02)
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      involves: (key: string) => boolean;
      from: [number, number, number];
      to: [number, number, number];
    }>;
  }, [aspects, markerByKey, ascLon]);

  return (
    <group ref={groupRef}>
      {/* ecliptic ring */}
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[RING_INNER, RING_OUTER, 128]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.28, 2.3, 128]} />
        <meshBasicMaterial color={colors.accent} transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.18, 1.2, 96]} />
        <meshBasicMaterial color={colors.line} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* sign boundaries and glyphs */}
      {Array.from({ length: 12 }, (_, index) => {
        const boundary = index * 30;
        const mid = boundary + 15;
        return (
          <group key={`sign-${index}`}>
            <Line
              points={[lonToPosition(boundary, ascLon, RING_INNER, 0), lonToPosition(boundary, ascLon, 2.3, 0)]}
              color={colors.line}
              transparent
              opacity={0.25}
              lineWidth={1}
            />
            <GlyphSprite
              text={SIGN_GLYPHS[index]}
              color={colors.line}
              position={lonToPosition(mid, ascLon, 2.16, 0.02)}
              scale={0.24}
              opacity={0.75}
            />
          </group>
        );
      })}

      {/* house cusps */}
      {cusps?.map((cusp, index) => (
        <Line
          key={`cusp-${index}`}
          points={[lonToPosition(cusp, ascLon, 0.55, 0), lonToPosition(cusp, ascLon, RING_INNER, 0)]}
          color={index === 0 || index === 9 ? colors.glow : colors.line}
          transparent
          opacity={index === 0 || index === 9 ? 0.5 : 0.14}
          lineWidth={index === 0 || index === 9 ? 1.5 : 1}
        />
      ))}

      {/* aspect chords */}
      {aspectLines.map((line) => {
        const highlighted = activeKey ? line.involves(activeKey) : false;
        return (
          <Line
            key={line.id}
            points={[line.from, line.to]}
            color={highlighted ? colors.glow : colors.line}
            transparent
            opacity={activeKey ? (highlighted ? 0.65 : 0.05) : 0.16}
            lineWidth={highlighted ? 1.5 : 1}
          />
        );
      })}

      {/* planets */}
      {markers.map((marker) => (
        <Planet
          key={marker.key}
          marker={marker}
          ascLon={ascLon}
          colors={colors}
          isActive={activeKey === marker.key}
          isDimmed={Boolean(activeKey && activeKey !== marker.key)}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export interface NatalChartSceneProps {
  markers: ChartMarker[];
  cusps: number[] | null;
  aspects: AspectLike[];
  colors: ThemeColors;
  activeKey: string | null;
  onSelect: (key: string | null) => void;
}

export default function NatalChartScene({ markers, cusps, aspects, colors, activeKey, onSelect }: NatalChartSceneProps) {
  // Ascendant sits on the left when known; otherwise 0° Aries takes its place.
  const ascLon = cusps && cusps.length > 0 ? cusps[0] : 180;

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.7, 5.1], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
      onPointerMissed={() => onSelect(null)}
      aria-label="Three-dimensional natal chart"
      role="img"
    >
      <Stars radius={14} depth={10} count={700} factor={1.6} saturation={0} fade speed={0.3} />
      <InstrumentScene
        markers={markers}
        cusps={cusps}
        aspects={aspects}
        ascLon={ascLon}
        colors={colors}
        activeKey={activeKey}
        onSelect={onSelect}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={0.85}
        maxPolarAngle={1.35}
        rotateSpeed={0.6}
      />
    </Canvas>
  );
}
