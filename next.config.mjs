/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: ESLint is configured separately. Run `npm run lint` to check linting.
  // TypeScript errors in test files don't affect production builds.
  // Consider fixing test file types for better type safety.

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Cache control for static assets
  generateEtags: true,

  // Image optimization
  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
  },

  // Configuración para GitHub Pages
  ...(process.env.GITHUB_ACTIONS && {
    output: "export",
    trailingSlash: true,
    distDir: "out",
  }),
};

export default nextConfig;
