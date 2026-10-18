module.exports = {
  apps: [
    {
      name: 'evalsmart',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4070',
      cwd: './',
      instances: 'max', // or 1 for single instance
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
        PORT: 4070,
        NEXT_PUBLIC_APP_URL: 'https://evalsmart.kidvento.com',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4070,
        NEXT_PUBLIC_APP_URL: 'https://evalsmart.kidvento.com',
      },
    },
  ],
};
