module.exports = {
  apps: [
    {
      name: "yingzi-api",
      cwd: "D:/yingzi/apps/api",
      script: "dist/index.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 3002,
        JWT_SECRET: "replace-with-your-production-secret"
      }
    }
  ]
};
