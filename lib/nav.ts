/** Shared between the desktop header and the mobile drawer so they cannot drift. */
export const NAV_LINKS = [
  { href: "/#builds", label: "Products" },
  { href: "/#platforms", label: "Platforms" },
  { href: "/#systems", label: "Systems" },
  { href: "/work", label: "All work" },
  { href: "/#hiring", label: "For hiring teams" },
] as const;
