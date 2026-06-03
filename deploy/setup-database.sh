#!/bin/bash
# Rodar como root na instância EC2 de banco de dados (Amazon Linux 2023 / Ubuntu)
set -e

# Instalar Docker
apt-get update -y && apt-get install -y docker.io docker-compose-plugin || \
  (yum update -y && yum install -y docker && curl -SL https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose)

systemctl enable docker && systemctl start docker

# Copiar arquivos para a instância (rode antes: scp deploy/database/ e database/schema_mysql.sql)
mkdir -p /opt/agroplace
cd /opt/agroplace

# Criar .env se não existir
if [ ! -f .env ]; then
  cat > .env <<EOF
MYSQL_ROOT_PASSWORD=TROQUE_ROOT_SENHA_FORTE
MYSQL_PASSWORD=TROQUE_SENHA_FORTE
EOF
  echo ".env criado — edite as senhas antes de continuar!"
  exit 1
fi

docker compose up -d
echo "MySQL rodando na porta 3306"
