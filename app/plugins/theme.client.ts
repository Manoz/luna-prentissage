// Mirrors the stored theme preference into shared state after hydration.
// The attribute itself is set before first paint by the inline head script
// in nuxt.config.ts, so there is no flash of the wrong theme.
export default defineNuxtPlugin(() => {
  const { loadPreference } = useTheme()
  loadPreference()
})
