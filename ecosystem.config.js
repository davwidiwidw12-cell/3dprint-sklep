module.exports = {
  apps: [
    {
      name: 'sklep-3d',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
