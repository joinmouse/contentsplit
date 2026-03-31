import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Recast — AI Content Repurposing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f1117 0%, #1a1b2e 50%, #2d1b69 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "#fff", marginBottom: 16, display: "flex" }}>
          Re<span style={{ color: "#818cf8" }}>cast</span>
        </div>
        <div style={{ fontSize: 32, color: "#9ca3af", maxWidth: 700, textAlign: "center", display: "flex" }}>
          Repurpose Any Content for Every Platform
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
          <div style={{ padding: "12px 24px", background: "rgba(99,102,241,0.2)", borderRadius: 12, color: "#a5b4fc", fontSize: 20, display: "flex" }}>Twitter Threads</div>
          <div style={{ padding: "12px 24px", background: "rgba(99,102,241,0.2)", borderRadius: 12, color: "#a5b4fc", fontSize: 20, display: "flex" }}>LinkedIn Posts</div>
          <div style={{ padding: "12px 24px", background: "rgba(99,102,241,0.2)", borderRadius: 12, color: "#a5b4fc", fontSize: 20, display: "flex" }}>Video Scripts</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
