/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    esmExternals: true, // Enable ESM
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: ['react-native-web'],
  },
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
}

export default nextConfig 