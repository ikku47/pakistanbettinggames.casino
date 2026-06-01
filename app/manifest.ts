import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pakistan Betting Games",
    short_name: "PBG Casino",
    description:
      "Online betting games in Pakistan — slots, live casino, sports, fishing, and card games.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f7",
    theme_color: "#1ebe57",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
