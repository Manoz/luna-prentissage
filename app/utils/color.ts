const WCAG_AA_NORMAL_TEXT = 4.5

function relativeLuminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.2126 * channel(r!) + 0.7152 * channel(g!) + 0.0722 * channel(b!)
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = relativeLuminance(foregroundHex)
  const l2 = relativeLuminance(backgroundHex)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

/**
 * Pick a text colour that stays readable on an arbitrary background.
 * Prefers white when it reaches WCAG AA for normal text, otherwise black
 * (a softer near-black fails on mid-tone purples such as #A855F7).
 * Falls back to white for malformed input.
 */
export function readableTextOn(backgroundHex: string): '#ffffff' | '#000000' {
  if (!/^#[0-9a-f]{6}$/i.test(backgroundHex)) return '#ffffff'
  return contrastRatio('#ffffff', backgroundHex) >= WCAG_AA_NORMAL_TEXT ? '#ffffff' : '#000000'
}
