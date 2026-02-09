export interface WatermarkOptions {
  enabled?: boolean;
  width: number;
  height: number;
  color?: string;
}

export const renderWatermark = ({
  enabled = true,
  width,
  height,
  color = "rgba(232,227,216,0.3)"
}: WatermarkOptions): string => {
  if (!enabled) return "";

  const x = width - 48;
  const y = height - 48;

  return `
    <g transform="translate(${x}, ${y})" fill="${color}" stroke="none">
      <circle cx="-182" cy="-6" r="4" fill="${color}" opacity="0.75" />
      <polygon points="-194,-1 -188,-11 -182,-1" fill="${color}" opacity="0.55" />
      <text
        x="0"
        y="0"
        text-anchor="end"
        dominant-baseline="baseline"
        font-family="Arial, Helvetica, sans-serif"
        font-size="22"
        letter-spacing="4"
        opacity="0.92"
      >@awarenessparadox</text>
    </g>
  `;
};
