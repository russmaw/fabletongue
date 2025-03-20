/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    '@react-native-async-storage/async-storage',
    '@react-navigation/native',
    '@react-navigation/native-web',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-native-gesture-handler',
    '@expo/vector-icons'
  ],
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      '@expo/vector-icons': 'react-native-vector-icons',
    };

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
  // Handle images and fonts
  images: {
    domains: ['localhost'],
    disableStaticImages: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
}

module.exports = nextConfig 