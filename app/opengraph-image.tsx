import { ImageResponse } from "next/og";
import { business } from "@/lib/config";

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
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #060e1c 0%, #0b1f3a 55%, #122a4d 100%)",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            color: "#d4af37",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Study Abroad &amp; Overseas Education Consultancy
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {business.name}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#c9cfd9", marginTop: 28, maxWidth: 820 }}>
          Your Gateway to Global Education
        </div>
      </div>
    ),
    { ...size }
  );
}
