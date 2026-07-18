const backendOrigin =
  process.env.BACKEND_API_URL?.replace(/\/api\/?$/, '') ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: `${backendOrigin}/media/:path*`,
      },
    ]
  },
  output: 'standalone',
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_ENABLE_OTP: process.env.NEXT_PUBLIC_ENABLE_OTP || 'false',
    NEXT_PUBLIC_ENABLE_PASSWORD_RESET: process.env.NEXT_PUBLIC_ENABLE_PASSWORD_RESET || 'false',
    NEXT_PUBLIC_ORDER_TAX_RATE: process.env.NEXT_PUBLIC_ORDER_TAX_RATE || '0.09',
    NEXT_PUBLIC_ORDER_SHIPPING_FLAT: process.env.NEXT_PUBLIC_ORDER_SHIPPING_FLAT || '50000',
    NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD:
      process.env.NEXT_PUBLIC_ORDER_FREE_SHIPPING_THRESHOLD || '500000',
  },
}

export default nextConfig
