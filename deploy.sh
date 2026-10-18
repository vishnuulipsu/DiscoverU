#!/usr/bin/env bash
# ==============================================================================
# DiscoverU Production Deployment Script
# Domain: https://evalsmart.kidvento.com/
# ==============================================================================

set -e

echo "🚀 [1/6] Starting deployment for evalsmart.kidvento.com..."

# Navigate to project directory (if called from elsewhere)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Ensure logs directory exists for PM2
mkdir -p logs

echo "📥 [2/6] Pulling latest code changes..."
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git pull origin main || echo "⚠️ Git pull skipped or not on main branch."
else
    echo "ℹ️ Not a git repo or working in standalone directory."
fi

echo "📦 [3/6] Installing dependencies..."
npm install --legacy-peer-deps

echo "🏗️ [4/6] Building Next.js production bundle..."
npm run build

# Optional DB Seed check
if [ "$1" == "--seed" ]; then
    echo "🌱 Seeding benchmark assessment data..."
    npm run seed
fi

echo "🔄 [5/6] Starting / Reloading PM2 cluster..."
# Check if PM2 app is already running
if pm2 describe evalsmart > /dev/null 2>&1; then
    echo "Reloading existing PM2 process with zero downtime..."
    pm2 reload ecosystem.config.js --env production
else
    echo "Starting PM2 application process..."
    pm2 start ecosystem.config.js --env production
fi

# Save PM2 state for system reboot resilience
pm2 save

echo "✅ [6/6] Deployment finished successfully!"
echo "🌐 Your application is live at https://evalsmart.kidvento.com/"
echo "📊 Run 'pm2 logs evalsmart' to inspect live server logs."
