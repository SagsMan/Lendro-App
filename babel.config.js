module.exports = function (api) {
    api.cache(true);
    const isDev = process.env.NODE_ENV !== "production";
    return {
      presets: [
        [
          "babel-preset-expo",
          {
            unstable_transformImportMeta: true,
            // React Compiler adds heavy transform time — skip in dev for faster reloads
            reactCompiler: !isDev,
          },
        ],
      ],
    };
  };
  