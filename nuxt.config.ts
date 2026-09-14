import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      script: [
        {
          // Apply the stored theme before first paint to avoid a flash of the wrong theme
          innerHTML:
            "(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})()",
          tagPosition: 'head',
        },
      ],
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
      },
    },
  },
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [
      { name: 'Public Sans', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Source Serif 4', provider: 'google', weights: [500, 600] },
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@vercel/analytics',
    '@vercel/speed-insights',
  ],
  vite: {
    optimizeDeps: {
      include: ['canvas-confetti'],
    },
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    // Private keys (server-side only)
    databaseUrl: process.env.DATABASE_URL || '',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    // Public keys (exposed to client)
    public: {
      apiBase: '/api',
      // The tutor UI is only offered when the server can actually call the model
      tutorEnabled: Boolean(process.env.ANTHROPIC_API_KEY),
    },
  },
})
