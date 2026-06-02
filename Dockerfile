# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY apresentacao/banco2.html /usr/share/nginx/html/slide.html

# Modo local: usa nginx.conf com proxy para container "api"
# Modo AWS: usa template com envsubst para substituir API_HOST
COPY nginx.conf                       /etc/nginx/conf.d/default.conf
COPY deploy/frontend/nginx.template.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
# nginx 1.19+ processa automaticamente /etc/nginx/templates/*.template via envsubst
# Se API_HOST estiver definido, o template substitui o default.conf
CMD ["/bin/sh", "-c", \
  "if [ -n \"$API_HOST\" ]; then \
     envsubst '${API_HOST}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf; \
   fi && nginx -g 'daemon off;'"]
