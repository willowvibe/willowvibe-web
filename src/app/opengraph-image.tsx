import { ImageResponse } from "next/og";

export const alt = "WillowVibe | Data Synapse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "sans-serif",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#00f0ff",
            textAlign: "center",
          }}
        >
          WillowVibe | Data Synapse
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Data engineering, PLM and observability
        </div>
      </div>
    ),
    { ...size }
  );
}
