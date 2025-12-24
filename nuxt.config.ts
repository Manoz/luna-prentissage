// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/tailwindcss'
  ],
  runtimeConfig: {
    // Private keys (server-side only)
    databaseUrl: process.env.DATABASE_URL || '',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    // Public keys (exposed to client)
    public: {
      apiBase: '/api'
    }
  }
})
