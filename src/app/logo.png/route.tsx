import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#000000",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ width: 18, height: 120, background: "#00f0ff", borderRadius: 4 }} />
        <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: "-0.02em" }}>WillowVibe</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
