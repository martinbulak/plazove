import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt =
  "Aqualand BB – verejná kontrola. Nezávislý občiansky informačný projekt.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #245e73 0%, #102a37 100%)",
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#2b8fa8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            ~
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
            Aqualand BB — verejná kontrola
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>
            Čo sa deje s plážovým kúpaliskom v Banskej Bystrici?
          </div>
          <div style={{ fontSize: 30, opacity: 0.85 }}>
            Dokumenty, právne analýzy a fakty na jednom mieste.
          </div>
        </div>

        <div style={{ fontSize: 22, opacity: 0.75 }}>
          Nezávislý občiansky informačný projekt — nie je to web prevádzkovateľa ani mesta.
        </div>
      </div>
    ),
    { ...size },
  );
}
