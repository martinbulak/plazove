import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Placeholder-obrázky sú lokálne (SVG/PNG v /public). Pre externé zdroje
    // (napr. archív fotiek na CDN) doplňte remotePatterns nižšie.
    remotePatterns: [
      // Fotografie nahrané cez administráciu do Vercel Blob.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Po zlúčení sekcií presmerúvame pôvodné URL na nové (trvalé presmerovanie).
  async redirects() {
    return [
      { source: "/casova-os", destination: "/pripad#chronologia", permanent: true },
      { source: "/zmluva", destination: "/otazky-a-odpovede", permanent: true },
      { source: "/cookies", destination: "/podmienky", permanent: true },
      { source: "/ochrana-osobnych-udajov", destination: "/podmienky", permanent: true },
      { source: "/nazory", destination: "/aktualny-stav#hodnotenia", permanent: true },
      { source: "/co-urobilo-mesto", destination: "/aktualny-stav", permanent: true },
      {
        source: "/otvorene-otazky",
        destination: "/aktualny-stav#otvorene-otazky",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
