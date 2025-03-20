const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add any custom webpack configurations here
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    // Use absolute paths for web fallbacks
    'expo-av': path.resolve(__dirname, 'src/utils/expo-av.web.js'),
    'expo-device': path.resolve(__dirname, 'src/utils/expo-device.web.js'),
    'expo-file-system': path.resolve(__dirname, 'src/utils/expo-file-system.web.js'),
    'expo-sharing': path.resolve(__dirname, 'src/utils/expo-sharing.web.js'),
    'expo-speech': path.resolve(__dirname, 'src/utils/expo-speech.web.js'),
    'expo-notifications': path.resolve(__dirname, 'src/utils/expo-notifications.web.js'),
    'expo-updates': path.resolve(__dirname, 'src/utils/expo-updates.web.js'),
  };

  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    path: false,
    crypto: false,
    stream: false,
    http: false,
    https: false,
    zlib: false,
  };

  // Prevent circular dependencies
  config.resolve.symlinks = false;

  // Add module resolution rules
  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Add externals for Expo packages
  config.externals = {
    ...config.externals,
    'expo-av': 'expo-av',
    'expo-device': 'expo-device',
    'expo-file-system': 'expo-file-system',
    'expo-sharing': 'expo-sharing',
    'expo-speech': 'expo-speech',
    'expo-notifications': 'expo-notifications',
    'expo-updates': 'expo-updates',
  };

  // Add support for environment variables
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    })
  );

  return config;
}; 