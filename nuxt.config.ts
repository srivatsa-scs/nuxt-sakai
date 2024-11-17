// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@pinia/nuxt'
  ],
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/tailwind.css',  // Tailwind CSS (if you're using it)
    '~/assets/styles.scss'    // Any other global styles you may have
  ],
  primevue: {
    autoImport: true,
    options: {
      ripple: true,
      theme: {
        preset: Aura,
options:{
  darkModeSelector: '.app-dark'
}
      }
    }
  },
  googleFonts: {
    families: {
      Poppins: true
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern',
        },
      },
    },
  }
})