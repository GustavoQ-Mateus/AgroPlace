#!/bin/bash
# Rodar como root na instância EC2 de backend
set -e

apt-get update -y && apt-get install -y docker.io docker-compose-plugin || \
  (yum update -y && yum install -y docker && curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose)

systemctl enable docker && systemctl start docker

mkdir -p /opt/agroplace
cd /opt/agroplace

if [ ! -f .env ]; then
  cat > .env <<EOF
DB_HOST=IP_PRIVADO_DA_EC2_BANCO
DB_PASS=MESMA_SENHA_DO_BANCO
JWT_SECRET=GERE_UM_SECRET_FORTE_AQUI
FRONTEND_URL=http://IP_PUBLICO_OU_DOMINIO_DO_FRONTEND
EOF
  echo ".env criado — preencha os valores antes de continuar!"
  exit 1
fi

# Build e sobe a API
docker build -t agroplace-api:latest /opt/agroplace/api
docker compose up -d
echo "API rodando na porta 3001"
