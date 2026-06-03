#!/bin/bash
# Rodar como root na instância EC2 de frontend
set -e

apt-get update -y && apt-get install -y docker.io docker-compose-plugin || \
  (yum update -y && yum install -y docker && curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose)

systemctl enable docker && systemctl start docker

mkdir -p /opt/agroplace
cd /opt/agroplace

if [ ! -f .env ]; then
  cat > .env <<EOF
API_HOST=IP_PRIVADO_DA_EC2_BACKEND
EOF
  echo ".env criado — preencha o IP privado do backend!"
  exit 1
fi

# Build a imagem do frontend a partir do repositório
docker build -t agroplace-frontend:latest /opt/agroplace
docker compose up -d
echo "Frontend rodando na porta 80"
