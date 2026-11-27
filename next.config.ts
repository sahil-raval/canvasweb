import type {NextConfig} from 'next'

const securityHeaders = [
  {key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload'},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()'},
  {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'},
]

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js needs inline scripts for page data; no external scripts are allowed.
  "script-src 'self' 'unsafe-inline'" + (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' https://cdn.sanity.io",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Email templates are read from disk by the enquiry route.
  outputFileTracingIncludes: {'/api/enquiry': ['./email-templates/*.html']},
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },
  async redirects() {
    // Old WordPress addresses -> new pages, so links and Google rankings carry over.
    // (Old blog post addresses are redirected one by one in app/[slug]/page.tsx.)
    return [
      {source: '/blog', destination: '/journal', permanent: true},
      {source: '/news', destination: '/journal', permanent: true},
      {source: '/category/:path*', destination: '/journal', permanent: true},
      {source: '/tag/:path*', destination: '/journal', permanent: true},
      {source: '/author/:path*', destination: '/journal', permanent: true},
      {source: '/feed', destination: '/journal', permanent: true},
    ]
  },
  async rewrites() {
    // Sanity Studio is a single-page app built into public/studio. Its files are served first;
    // every other /studio URL loads the Studio app (before the /[slug] page route can match).
    return {
      beforeFiles: [],
      afterFiles: [
        {source: '/studio', destination: '/studio/index.html'},
        {source: '/studio/:path*', destination: '/studio/index.html'},
      ],
      fallback: [],
    }
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}],
      },
      {source: '/:path*', headers: securityHeaders},
      // The website only loads its own code and Sanity images. Studio is excluded: it talks to the Sanity API.
      {source: '/((?!studio).*)', headers: [{key: 'Content-Security-Policy', value: contentSecurityPolicy}]},
    ]
  },
}

export default nextConfig
