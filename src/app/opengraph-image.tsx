import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0c10",
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(37,36,53,0.45), transparent 50%), radial-gradient(circle at 80% 15%, rgba(43,111,106,0.25), transparent 55%), linear-gradient(180deg, #0b0c10 0%, #09090d 40%, #07070a 100%)",
          color: "#e8e3d8",
          fontFamily: "Times New Roman, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "80px",
            border: "1px solid rgba(184,155,94,0.35)",
            borderRadius: "28px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "120px",
            border: "1px solid rgba(184,155,94,0.15)",
            borderRadius: "22px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "26px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Awareness Paradox
          </div>
          <div
            style={{
              fontSize: "22px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(232,227,216,0.7)",
              maxWidth: "760px",
              lineHeight: 1.4,
            }}
          >
            Principles, symbols, and the physics of the inner world.
          </div>
          <svg width="360" height="140" viewBox="0 0 360 140" fill="none">
            <circle cx="180" cy="70" r="46" stroke="#b89b5e" strokeWidth="1.5" />
            <circle cx="140" cy="70" r="46" stroke="rgba(232,227,216,0.5)" strokeWidth="1" />
            <circle cx="220" cy="70" r="46" stroke="rgba(232,227,216,0.5)" strokeWidth="1" />
            <path
              d="M180 24L205 70L180 116L155 70Z"
              stroke="#b89b5e"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M140 70H220"
              stroke="rgba(232,227,216,0.55)"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
