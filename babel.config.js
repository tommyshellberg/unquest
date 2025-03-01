module.exports = function (api) {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);

  const plugins = [];

  // Only include this in production builds
  if (process.env.NODE_ENV === "production") {
    plugins.push([
      "babel-plugin-transform-remove-imports",
      {
        test: "\\.(test|spec)\\.(js|jsx|ts|tsx)$",
        removeAll: true,
      },
    ]);
  }

  return {
    presets: ["babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin", ...plugins],
    // Only ignore test files during production builds
    ignore:
      process.env.NODE_ENV === "production"
        ? ["**/*.test.ts", "**/*.test.tsx", "**/__tests__/**"]
        : [],
  };
};
