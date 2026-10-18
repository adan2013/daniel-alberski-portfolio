import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Daniel Alberski — portfolio",
    short_name: "D. Alberski",
    description:
      "Software Developer · React & TypeScript. Projekty software, hardware, AI i druku 3D.",
    start_url: "/",
    display: "browser",
    background_color: "#f6f7fa",
    theme_color: "#f6f7fa",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
