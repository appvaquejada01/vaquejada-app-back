# Vaquejada App - Backend

API do sistema de vaquejada. Cuida de todo o fluxo: desde o cadastro do vaqueiro ate a inscricao no evento, compra de senhas, pagamento e apuracao dos juizes.

## Tecnologias

- **NestJS 11** com TypeScript
- **PostgreSQL** com TypeORM e migrations
- **Autenticacao JWT** via Passport
- **Pagamentos** com MercadoPago (Checkout Pro e Pix)
- **Upload de imagens** via Cloudinary
- **Documentacao** automatica com Swagger

## Como o projeto esta organizado

| Modulo | O que faz |
|---|---|
| `auth` | Login, registro e geracao de token JWT |
| `user` | Gerenciamento de usuarios — suporta 4 perfis: admin, juiz, locutor e vaqueiro |
| `event` | Criacao de eventos com controle de status (aberto, fechado, cancelado, encerrado) |
| `category` | Categorias da competicao (amador, profissional, etc.) |
| `password` | Senhas de participacao — cada senha representa uma vaga no evento |
| `subscription` | Inscricoes dos vaqueiros nos eventos, vinculando senhas a categorias |
| `staff` | Escala de juizes e locutores por evento |
| `payments` | Processamento de pagamentos pelo MercadoPago |
| `cloudinary` | Upload e armazenamento de arquivos na nuvem |

## Configuracao

1. Instale as dependencias:
```bash
npm install
```

2. Crie o arquivo `.env` com as variaveis necessarias:

| Variavel | Para que serve |
|---|---|
| `DATABASE_URL` | Conexao com o PostgreSQL |
| `JWT_SECRET` | Chave usada para assinar os tokens |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de acesso da conta MercadoPago |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciais do Cloudinary |

3. Rode o projeto:
```bash
# modo dev (roda migrations automaticamente antes de iniciar)
npm run start:dev

# modo dev sem rodar migrations
npm run dev
```

## Outros comandos

```bash
npm run migrate           # roda as migrations pendentes
npm run migrate:generate  # gera uma nova migration a partir das entidades
npm run build             # compila para producao
npm run start:prod        # inicia o servidor compilado
```

## Deploy

O deploy esta configurado para o **Render**, com o arquivo `render.yaml` ja incluido no repositorio.
