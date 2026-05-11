# AgroPlace

Interface mockada do marketplace AgroPlace com backend parcial focado em entrada e cadastro.

## Rodar

```bash
npm install
npm run dev
```

## Gerar build

```bash
npm run build
```

## Banco de autenticação

Importe `database/esquema_autenticacao.sql` no phpMyAdmin do XAMPP.

## Backend parcial

```bash
cd backend
mvn spring-boot:run
```

Rotas:

- `POST /api/autenticacao/cadastro`
- `POST /api/autenticacao/entrada`

Tipos de conta:

- `PRODUTOR`
- `CORPORATIVA`
- `TRANSPORTADORA`
