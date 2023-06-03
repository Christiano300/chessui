// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        'nuxt-icons',
        '@pinia/nuxt'
    ],
    ssr: false,
    runtimeConfig: {
        public: {
            API_Base: process.env.NODE_ENV === "production" ? "ws://dapatzl.ddns.net/api" : "ws://localhost:8080"
        }
    }
})
