// Mirrors the stored theme preference into shared state once hydration is
// fully resolved (the layout hydrates asynchronously under Suspense), so the
// hydrated markup matches the server render, which cannot know the stored
// choice. The attribute itself is set before first paint by the inline head
// script in nuxt.config.ts, so there is no flash of the wrong theme.
export default defineNuxtPlugin(() => {
  const { loadPreference } = useTheme()
  onNuxtReady(loadPreference)
})
