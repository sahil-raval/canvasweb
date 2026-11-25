import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Email templates are read from disk by the enquiry route.
  outputFileTracingIncludes: {'/api/enquiry': ['./email-templates/*.html']},
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      // Sanity Studio is a single-page app built into public/studio.
      fallback: [
        {source: '/studio', destination: '/studio/index.html'},
        {source: '/studio/:path*', destination: '/studio/index.html'},
      ],
    }
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}],
      },
      {
        source: '/:path*',
        headers: [
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
        ],
      },
    ]
  },
}

export default nextConfig
