export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

function isPreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

/**
 * Theme preference shared across the app. "system" removes the data-theme
 * attribute so the prefers-color-scheme media query decides; an explicit
 * choice pins it and is persisted for the next visit.
 */
export function useTheme() {
  const preference = useState<ThemePreference>('theme-preference', () => 'system')

  function apply(value: ThemePreference) {
    const root = document.documentElement
    if (value === 'system') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = value
    }
  }

  function setPreference(value: ThemePreference) {
    preference.value = value
    apply(value)
    try {
      if (value === 'system') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, value)
      }
    } catch {
      // Storage can be unavailable (private mode); the choice still applies to this page
    }
  }

  function loadPreference() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      preference.value = isPreference(stored) ? stored : 'system'
    } catch {
      preference.value = 'system'
    }
  }

  return {
    preference: readonly(preference),
    setPreference,
    loadPreference,
  }
}
