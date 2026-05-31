# Guia de Deploy — AgroPlace na AWS EC2

## Pré-requisitos

- Conta AWS ativa
- Docker instalado localmente ([docker.com](https://docker.com))
- AWS CLI instalado ([aws.amazon.com/cli](https://aws.amazon.com/cli))
- Chave SSH `.pem` gerada na AWS

---

## 1. Criar instância EC2

1. Acesse **EC2 → Launch Instance** no Console AWS
2. Configurações recomendadas:
   - **AMI**: Amazon Linux 2023
   - **Instance type**: `t3.micro` (free tier) ou `t3.small` para produção
   - **Key pair**: Criar ou usar existente — salvar o `.pem`
   - **Security Group** — liberar as portas:
     | Tipo | Protocolo | Porta | Origem |
     |------|-----------|-------|--------|
     | SSH  | TCP       | 22    | Seu IP |
     | HTTP | TCP       | 80    | 0.0.0.0/0 |
     | HTTPS | TCP      | 443   | 0.0.0.0/0 |
3. Anotar o **Public DNS** da instância (ex: `ec2-54-123-45-67.compute-1.amazonaws.com`)

---

## 2. Configurar a instância (primeira vez)

Copie o script para a instância e execute:

```bash
# Do seu computador local:
scp -i ~/.ssh/sua-chave.pem ec2-setup.sh ec2-user@SEU-EC2-DNS:~/
ssh -i ~/.ssh/sua-chave.pem ec2-user@SEU-EC2-DNS

# Na instância:
bash ec2-setup.sh

# Fazer logout e login novamente para o grupo Docker ter efeito
exit
```

---

## 3. Configurar variáveis de ambiente

Na raiz do projeto, criar o arquivo `.env.production`:

```bash
cp .env.production.example .env.production
```

Editar `.env.production` com os valores do Supabase:
```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

> **Onde encontrar:** Supabase Dashboard → Project Settings → API

---

## 4. Fazer deploy

```bash
# Dar permissão de execução (só na primeira vez)
chmod +x deploy.sh

# Exportar credenciais para o build
export VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
export VITE_SUPABASE_ANON_KEY="sua-anon-key"

# Executar deploy
./deploy.sh SEU-EC2-DNS ~/.ssh/sua-chave.pem
```

O script irá:
1. Buildar a imagem Docker com as variáveis de ambiente
2. Enviar a imagem para o EC2
3. Reiniciar o container automaticamente

---

## 5. Verificar o deploy

```bash
# Verificar se está rodando
curl http://SEU-EC2-DNS

# Ou abrir no browser:
# http://SEU-EC2-DNS
```

---

## 6. Deploy subsequentes

Basta rodar `./deploy.sh` novamente — o processo é idempotente.

---

## 7. Domínio personalizado (opcional)

Para usar um domínio próprio (ex: `agroplace.com.br`):

1. **Route 53** ou DNS do seu registrador: criar registro A apontando para o IP público EC2
2. **HTTPS com Certbot**:
   ```bash
   sudo dnf install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d agroplace.com.br -d www.agroplace.com.br
   ```
3. Atualizar `nginx.conf` para redirecionar HTTP → HTTPS

---

## Estrutura dos arquivos de deploy

```
AgroPlace/
├── Dockerfile              # Build multi-stage (Node → nginx)
├── nginx.conf              # Config nginx para SPA
├── docker-compose.yml      # Orquestração do container
├── .dockerignore           # Arquivos excluídos do build
├── deploy.sh               # Script de deploy automatizado
├── ec2-setup.sh            # Setup inicial da instância EC2
├── .env.production.example # Template das variáveis de ambiente
└── deploy/
    └── AWS_DEPLOYMENT_GUIDE.md  # Este arquivo
```
