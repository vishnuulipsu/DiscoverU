# 🚀 Deployment Guide: https://evalsmart.kidvento.com/

Complete instructions for deploying the DiscoverU platform with **PM2** and **Nginx** reverse proxy on your server.

---

## 1. Prerequisites on Target Server

Ensure the server has:
- **Node.js**: v20.x or v22.x LTS (`node -v`)
- **PM2**: `sudo npm install -g pm2`
- **Nginx**: `sudo apt update && sudo apt install -y nginx`
- **Certbot (Let's Encrypt SSL)**: `sudo apt install -y certbot python3-certbot-nginx`
- **MongoDB**: Local MongoDB service running (`systemctl status mongod`) or MongoDB Atlas URI

---

## 2. Server Setup & Repository Clone

```bash
# Navigate to deployment directory (e.g., /var/www or /home/ubuntu)
cd /var/www

# Clone repository
git clone <YOUR_GIT_REPO_URL> evalsmart
cd evalsmart

# Create logs directory
mkdir -p logs
```

---

## 3. Environment Variables

Verify or configure `.env.production`:

```bash
cp .env.production .env
```

Ensure `.env` contains:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/v8hak_talentpulse
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-pro
NEXT_PUBLIC_APP_URL=https://evalsmart.kidvento.com
PORT=4070
NODE_ENV=production
```

---

## 4. Install Dependencies & Build

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the Next.js production bundle
npm run build

# (Optional) Seed initial benchmark assessment cases
npm run seed
```

---

## 5. PM2 Process Management

Start the application with PM2 using the configured `ecosystem.config.js`:

```bash
# Start cluster in production mode
pm2 start ecosystem.config.js --env production

# Check status
pm2 status

# Save PM2 process list to restore automatically on server reboot
pm2 save
pm2 startup
```

### Useful PM2 Commands:
| Action | Command |
|---|---|
| **Zero-Downtime Reload** | `npm run pm2:reload` or `pm2 reload ecosystem.config.js --env production` |
| **View Live Logs** | `npm run pm2:logs` or `pm2 logs evalsmart` |
| **Check Process Metrics** | `pm2 monit` |
| **Stop Process** | `npm run pm2:stop` or `pm2 stop evalsmart` |

---

## 6. Nginx & SSL Configuration

1. Copy the included Nginx configuration to your sites-available directory:

```bash
sudo cp nginx-evalsmart.conf /etc/nginx/sites-available/evalsmart.kidvento.com
sudo ln -s /etc/nginx/sites-available/evalsmart.kidvento.com /etc/nginx/sites-enabled/
```

2. Test Nginx syntax and obtain an SSL Certificate via Certbot:

```bash
# Check syntax
sudo nginx -t

# Obtain Let's Encrypt SSL certificate
sudo certbot --nginx -d evalsmart.kidvento.com

# Reload Nginx
sudo systemctl reload nginx
```

---

## 7. Fast Automated Deployments (`deploy.sh`)

Whenever you make future code updates, deploy with one command:

```bash
chmod +x deploy.sh
./deploy.sh
```

Or deploy with benchmark data re-seeding:
```bash
./deploy.sh --seed
```
