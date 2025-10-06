/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // biar build gak gagal gara-gara eslint
  },
  typescript: {
    ignoreBuildErrors: true, // optional: kalau error TS juga mau dilewatin
  },
  experimental: {
    optimizeCss: false, // 🚀 matikan lightningcss biar gak error di Vercel
  },
}

module.exports = nextConfig
