import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
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
            "radial-gradient(circle at 18% 25%, rgba(37,36,53,0.4), transparent 55%), radial-gradient(circle at 78% 18%, rgba(43,111,106,0.22), transparent 58%), linear-gradient(180deg, #0b0c10 0%, #09090d 45%, #07070a 100%)",
          color: "#e8e3d8",
          fontFamily: "Times New Roman, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "90px",
            border: "1px solid rgba(184,155,94,0.3)",
            borderRadius: "26px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "140px",
            border: "1px solid rgba(184,155,94,0.12)",
            borderRadius: "20px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "58px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Awareness Paradox
          </div>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(232,227,216,0.7)",
              maxWidth: "740px",
              lineHeight: 1.4,
            }}
          >
            Principles, symbols, and the physics of the inner world.
          </div>
          <svg width="320" height="120" viewBox="0 0 320 120" fill="none">
            <circle cx="160" cy="60" r="40" stroke="#b89b5e" strokeWidth="1.5" />
            <circle cx="125" cy="60" r="40" stroke="rgba(232,227,216,0.5)" strokeWidth="1" />
            <circle cx="195" cy="60" r="40" stroke="rgba(232,227,216,0.5)" strokeWidth="1" />
            <path
              d="M160 22L182 60L160 98L138 60Z"
              stroke="#b89b5e"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M125 60H195"
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
