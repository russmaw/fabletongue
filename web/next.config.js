/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Static HTML export
  images: {
    unoptimized: true, // Required for static export
    domains: ['localhost'],
  },
  trailingSlash: true,
  // Handle Expo and React Native Web
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ]
    // Enable source maps in development
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map'
    }
    return config
  },
  // Disable server components since we're doing static export
  experimental: {
    appDir: false,
  },
}

export default nextConfig 