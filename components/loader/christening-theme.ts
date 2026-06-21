/** LoveShackFancy-inspired christening palette */
export const C = {
  ivory:        "#FFFBF7",
  champagne:    "#F7EFE4",
  cream:        "#F3E8DC",
  blush:        "#F5DDE0",
  blushSoft:    "#FAE8EC",
  blushDeep:    "#E8C4CC",
  dustyRose:    "#C4A0A8",
  dustyRoseMid: "#A87888",
  roseText:     "#7D4A5A",
  roseDeep:     "#6B3D4F",
  mauve:        "#9B7080",
  gold:         "#C9A86C",
  goldLight:    "#E8D4A8",
  goldDeep:     "#B8924E",
  pearl:        "#FFFDF9",
  peony:        "#E8B4C0",
  peonySoft:    "#F0C8D4",
  rosePetal:    "#D4909A",
  sageMuted:    "#A8B89C",
} as const

/** High-contrast text — avoid low-opacity rgba on decorative backgrounds */
export const text = {
  label:      C.dustyRoseMid,
  caption:    C.mauve,
  body:       C.roseText,
  emphasis:   C.roseDeep,
} as const

export const contentPanel = {
  background: `linear-gradient(180deg, ${C.pearl} 0%, ${C.ivory} 52%, ${C.champagne} 100%)`,
  border: `1px solid ${C.blushDeep}`,
  borderRadius: "clamp(1.25rem, 4vw, 1.75rem)",
  boxShadow: "0 20px 56px rgba(107,61,79,0.11), 0 2px 8px rgba(232,196,204,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
  padding: "clamp(1.6rem, 5vw, 2.6rem) clamp(1.2rem, 4vw, 2rem)",
} as const

export const sparkleDots = [
  { top: "14%", left: "8%",   size: 3,   op: 0.50, delay: "1.2s" },
  { top: "22%", left: "14%",  size: 2,   op: 0.35, delay: "1.5s" },
  { top: "10%", right: "28%", size: 2.5, op: 0.42, delay: "1.8s" },
  { top: "35%", left: "5%",   size: 2,   op: 0.30, delay: "2.0s" },
  { top: "18%", right: "15%", size: 3,   op: 0.45, delay: "1.4s" },
  { top: "62%", right: "7%",  size: 2.5, op: 0.36, delay: "2.2s" },
  { top: "70%", left: "10%",  size: 2,   op: 0.32, delay: "1.9s" },
] as const

export const nameStyles = {
  given: {
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    fontSize: "clamp(3.4rem, 14.5vw, 7.5rem)",
    color: C.roseDeep,
    lineHeight: 1.0,
    letterSpacing: "0.14em",
    textShadow: `0 2px 20px rgba(107,61,79,0.14), 0 4px 40px rgba(196,160,168,0.14), 0 0 60px rgba(232,196,204,0.08)`,
  },
  script: {
    fontFamily: '"LeJourScript", cursive',
    fontSize: "clamp(2.4rem, 9.5vw, 5rem)",
    color: C.goldDeep,
    lineHeight: 1.08,
    letterSpacing: "0.02em",
    marginTop: "clamp(0.2rem,0.8vw,0.5rem)",
    filter: "drop-shadow(0 2px 8px rgba(201,168,108,0.22))",
  },
  subtitle: {
    fontFamily: '"Cinzel", serif',
    fontWeight: 700,
    fontSize: "clamp(1.0rem, 3.8vw, 1.9rem)",
    color: C.roseText,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
    textShadow: "0 1px 8px rgba(125,74,90,0.10)",
  },
  invite: {
    fontFamily: '"Cinzel", serif',
    fontSize: "clamp(0.65rem, 2.4vw, 0.82rem)",
    letterSpacing: "0.32em",
    textTransform: "uppercase" as const,
    color: C.dustyRoseMid,
    fontWeight: 600,
    margin: 0,
  },
  parentLabel: {
    fontFamily: '"Cinzel", serif',
    fontSize: "clamp(0.55rem,1.9vw,0.68rem)",
    letterSpacing: "0.36em",
    textTransform: "uppercase" as const,
    color: C.mauve,
    marginBottom: "4px",
  },
  parentNames: {
    fontFamily: '"Fahkwang", sans-serif',
    fontWeight: 400,
    fontSize: "clamp(0.85rem,2.9vw,1.05rem)",
    color: C.roseText,
    letterSpacing: "0.03em",
    lineHeight: 1.6,
  },
}

export const goldLine = (dir: "right" | "left", opacity = 0.45) =>
  `linear-gradient(to ${dir}, transparent, rgba(201,168,108,${opacity}))`

export const roseLine = (dir: "right" | "left", opacity = 0.40) =>
  `linear-gradient(to ${dir}, transparent, rgba(196,160,168,${opacity}))`

/** Pre-tinted pink floral assets live at /decoration/*-pink.png (see scripts/tint-florals-pink.ts) */
export const PINK_FLORAL_PATH = (base: string) => base.replace(/\.png$/, "-pink.png")
