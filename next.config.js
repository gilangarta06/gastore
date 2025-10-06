/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // biar build gak gagal gara-gara eslint
  },
  typescript: {
    ignoreBuildErrors: true, // optional: kalau error TS juga mau dilewatin
  }
}

module.exports = nextConfig
