/** Footer certification badges (images in /public/footer/licenses/). */
export const licenses = [
  {
    id: "gli",
    icon: "/footer/licenses/gli.png",
  },
  {
    id: "mga",
    icon: "/footer/licenses/mga.png",
  },
  {
    id: "pagcor",
    icon: "/footer/licenses/pagcor.png",
  },
  {
    id: "ukgc",
    icon: "/footer/licenses/ukgc.png",
  },
] as const;

export type LicenseId = (typeof licenses)[number]["id"];
