// Adds the one setting that only the deployed site needs. app.json stays the main config.
// GitHub Pages serves the site under /dramaflash-mockup, so the deploy build sets EXPO_BASE_URL.
// Locally it is not set, and the dev server keeps serving at the root.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
