const hex = (h) => {
  h = h.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const lin = (c) => {
  c /= 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}
const L = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
const ratio = (a, b) => {
  const l1 = L(a),
    l2 = L(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}
const blend = (fg, bg, a) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)))
const fmt = (label, a, b) => {
  const r = ratio(a, b)
  console.log(
    `${r.toFixed(2).padStart(6)}  ${r >= 4.5 ? 'AA ' : r >= 3 ? 'AA-large only' : 'FAIL'}  ${label}`,
  )
}

const teal = hex('#2d5f5d'),
  cream = hex('#faf9f6'),
  terra = hex('#c1666b'),
  white = hex('#ffffff')
const g900 = hex('#111827'),
  g700 = hex('#374151'),
  g500 = hex('#6b7280'),
  g300 = hex('#d1d5db'),
  g200 = hex('#e5e7eb'),
  g50 = hex('#f9fafb')
const green700 = hex('#15803d'),
  green50 = hex('#f0fdf4'),
  red700 = hex('#b91c1c'),
  red50 = hex('#fef2f2'),
  red600 = hex('#dc2626'),
  green600 = hex('#16a34a'),
  green100 = hex('#dcfce7'),
  yellow600 = hex('#ca8a04'),
  yellow100 = hex('#fef9c3'),
  red100 = hex('#fee2e2'),
  green900 = hex('#14532d'),
  red900 = hex('#7f1d1d')

console.log('=== Charte de base ===')
fmt('deep-teal on warm-cream', teal, cream)
fmt('deep-teal on white', teal, white)
fmt('white on deep-teal', white, teal)
fmt('terracotta on warm-cream', terra, cream)
fmt('terracotta on white', terra, white)
fmt('white on terracotta', white, terra)
fmt('warm-cream on terracotta', cream, terra)
fmt('gray-900 on warm-cream', g900, cream)
fmt('gray-700 on white', g700, white)
fmt('gray-500 on white (placeholders/helper)', g500, white)
fmt('gray-500 on gray-50 (quiz disabled options)', g500, g50)
fmt('gray-700 on gray-200 (Annuler btn)', g700, g200)
console.log('\n=== Opacités composées ===')
fmt('deep-teal/60 on warm-cream', blend(teal, cream, 0.6), cream)
fmt('deep-teal/60 on white', blend(teal, white, 0.6), white)
fmt('deep-teal/70 on warm-cream', blend(teal, cream, 0.7), cream)
fmt('deep-teal/70 on white', blend(teal, white, 0.7), white)
fmt('deep-teal/40 on white (chevron icons)', blend(teal, white, 0.4), white)
fmt('deep-teal/20 on warm-cream (404 number)', blend(teal, cream, 0.2), cream)
fmt('terracotta/60 on white (delete icon terms.vue)', blend(terra, white, 0.6), white)
fmt('white/70 on deep-teal (flashcard hint, best case)', blend(white, teal, 0.7), teal)
fmt('white/80 on deep-teal', blend(white, teal, 0.8), teal)
console.log('\n=== Feedback quiz ===')
fmt('green-700 on green-50', green700, green50)
fmt('red-700 on red-50', red700, red50)
fmt('green-900 on green-50', green900, green50)
fmt('red-900 on red-50', red900, red50)
fmt('green-600 on green-100 (results circle, 6xl = large)', green600, green100)
fmt('yellow-600 on yellow-100 (results circle)', yellow600, yellow100)
fmt('red-600 on red-100 (results circle)', red600, red100)
fmt('red-600 on white (form errors)', red600, white)
console.log('\n=== Bordures / UI non-texte (1.4.11 >= 3:1) ===')
fmt('gray-300 border on white', g300, white)
fmt('deep-teal/20 border on white', blend(teal, white, 0.2), white)
fmt('deep-teal/20 border on warm-cream', blend(teal, cream, 0.2), cream)
fmt('deep-teal/10 progress track on warm-cream', blend(teal, cream, 0.1), cream)
fmt('gray-200 progress track on white', g200, white)
console.log('\n=== Blanc sur couleurs de catégorie (docs/categories.json) ===')
const cats = {
  '#D97706': 'Amber',
  '#E11D48': 'Rose',
  '#F59E0B': 'Amber-500',
  '#DC2626': 'Red',
  '#A855F7': 'Purple',
  '#84CC16': 'Lime',
  '#3B82F6': 'Blue',
  '#0EA5E9': 'Sky',
  '#10B981': 'Emerald',
  '#22C55E': 'Green',
  '#F97316': 'Orange',
}
for (const [c, n] of Object.entries(cats)) {
  fmt(`white on ${c} ${n}`, white, hex(c))
}
console.log('\n--- white/70 and white/80 on category colors ---')
for (const [c, n] of Object.entries(cats)) {
  const bg = hex(c)
  fmt(`white/80 on ${c} ${n}`, blend(white, bg, 0.8), bg)
}
console.log('\n--- category color dot on white (1.4.11) ---')
for (const [c, n] of Object.entries(cats)) {
  fmt(`${c} ${n} on white`, hex(c), white)
}
console.log('\n=== Slider ===')
fmt('slider track deep-teal 12.5% (#2d5f5d20) on white', blend(teal, white, 0.125), white)
