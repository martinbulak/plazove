import { ImageResponse } from "next/og";
import { OG_PHOTO } from "./og-photo";

export const runtime = "nodejs";
export const alt =
  "Za Pláž – ktorá nebude hanbou. Nezávislý občiansky projekt o plážovom kúpalisku v Banskej Bystrici.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0e2733";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: INK,
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Fotografia areálu vpravo */}
        <img
          src={OG_PHOTO}
          width={600}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 630,
            objectFit: "cover",
          }}
        />
        {/* Prechod do tmavého panela, aby text zostal čitateľný */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 600,
            height: 630,
            background:
              "linear-gradient(90deg, #0e2733 0%, rgba(14,39,51,0.94) 24%, rgba(14,39,51,0.18) 72%, rgba(14,39,51,0) 100%)",
          }}
        />

        {/* Textový panel */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 730,
            height: "100%",
            padding: 64,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                borderRadius: 15,
                background: "#2b8fa8",
                fontSize: 38,
                fontWeight: 700,
              }}
            >
              ~
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.4 }}>
                Za Pláž
              </div>
              <div style={{ fontSize: 16, letterSpacing: 2, color: "#7fc4d6" }}>
                KTORÁ NEBUDE HANBOU
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.05 }}>
              Zachráňme plážové kúpalisko v Banskej Bystrici
            </div>
            <div style={{ fontSize: 27, lineHeight: 1.35, color: "#c8dbe3" }}>
              Dokumenty, fakty a stav areálu na jednom mieste.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{ width: 42, height: 4, borderRadius: 2, background: "#f4b400" }}
            />
            <div style={{ fontSize: 21, color: "#9fb9c4" }}>
              Nezávislý občiansky projekt · zaplaz.sk
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
