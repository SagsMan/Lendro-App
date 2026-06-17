const { getDefaultConfig } = require("expo/metro-config");

  const config = getDefaultConfig(__dirname);

  // Inline requires: modules load lazily on first use instead of all at boot
  // This is the single biggest startup speed improvement (~40-60% faster)
  config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: {
        inlineRequires: true,
      },
    }),
  };

  // Use more CPU cores for faster bundling
  config.maxWorkers = 4;

  // Faster module resolution
  config.resolver = {
    ...config.resolver,
    unstable_enablePackageExports: true,
  };

  module.exports = config;
  