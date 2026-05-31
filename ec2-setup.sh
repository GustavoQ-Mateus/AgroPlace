#!/bin/bash
# Run this ONCE on the EC2 instance after launch
# Usage: ssh into the instance and run: bash ec2-setup.sh

set -e

echo "→ Updating system..."
sudo dnf update -y

echo "→ Installing Docker..."
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

echo "→ Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "→ Creating app directory..."
mkdir -p ~/agroplace

echo "✓ EC2 setup complete. Log out and back in for Docker group to take effect."
