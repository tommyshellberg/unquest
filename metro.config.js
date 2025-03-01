// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// metro.config.js
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Add test file patterns to exclude from the bundle
config.resolver.blacklistRE = [
  /node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\.test\.tsx?$/,
  /.*\.test\.jsx?$/,
  /.*\/__tests__\/.*/,
  /.*\/node_modules\/@testing-library\/.*/
];

module.exports = wrapWithReanimatedMetroConfig(config);
