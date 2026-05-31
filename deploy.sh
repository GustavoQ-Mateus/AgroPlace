#!/bin/bash
set -e

# ─────────────────────────────────────────
# AgroPlace — Deploy to AWS EC2
# Usage: ./deploy.sh [EC2_HOST] [KEY_FILE]
# Example: ./deploy.sh ec2-54-123-45-67.compute-1.amazonaws.com ~/.ssh/my-key.pem
# ─────────────────────────────────────────

EC2_HOST="${1:-your-ec2-public-dns.amazonaws.com}"
KEY_FILE="${2:-~/.ssh/agroplace.pem}"
EC2_USER="ec2-user"
APP_DIR="/home/ec2-user/agroplace"

echo "→ Deploying AgroPlace to $EC2_HOST"

# 1. Build locally first
echo "→ Building Docker image..."
docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  -t agroplace:latest .

# 2. Save image to tar
echo "→ Saving image..."
docker save agroplace:latest | gzip > agroplace-image.tar.gz

# 3. Copy to EC2
echo "→ Uploading to EC2..."
scp -i "$KEY_FILE" -o StrictHostKeyChecking=no \
  agroplace-image.tar.gz \
  docker-compose.yml \
  .env.production \
  "$EC2_USER@$EC2_HOST:$APP_DIR/"

# 4. SSH and run
echo "→ Starting application on EC2..."
ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" << 'REMOTE'
  cd ~/agroplace
  docker load < agroplace-image.tar.gz
  docker-compose down --remove-orphans
  docker-compose up -d
  docker system prune -f
  echo "✓ Application running"
REMOTE

# 5. Cleanup local tar
rm -f agroplace-image.tar.gz

echo "✓ Deployment complete! → http://$EC2_HOST"
