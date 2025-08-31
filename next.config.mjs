/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuración para GitHub Pages solamente
  ...(process.env.GITHUB_ACTIONS && {
    output: "export",
    trailingSlash: true,
    distDir: "out",
  }),
  // Asegurar que Analytics funcione en Vercel
  ...(process.env.VERCEL && {
    experimental: {
      webVitalsAttribution: ["CLS", "LCP"],
    },
  }),
};

export default nextConfig;
