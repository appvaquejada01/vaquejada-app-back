# Tarefas Básicas da API

- [x] Configuração do banco de dados Postgres e TypeORM
- [x] Implementação do sistema de autenticação JWT
- [x] Criação do guard de autenticação nas rotas
- [x] Implementação das relações entre entidades
- [x] Criação dos endpoints de usuário (criar, atualizar, listar, buscar por id)
- [x] Criação dos endpoints de evento (criar, atualizar, listar, buscar por id)
- [x] Implementação dos DTOs de entrada e resposta para usuário, evento e categoria
- [x] Criação dos endpoints de categorias (criar, listar, buscar por id)
- [x] Criação de seeds para usuários, categorias e eventos

- [x] Documentação da API com Swagger
- [x] Implementar sistema de senhas das vaquejadas
- [x] Implementar inscrição dos corredores na vaquejada com escolha de evento, categoria e senhas
- [ ] Implementar sistema de notas para cada corredor dada por um juiz (Opções de votos do Juiz: Valeu o Boi / Nulo / TV / Boi não quis correr)
- [ ] Implementar sistema de pagamento das senhas

# Tasks a serem feitas

1. Sistema de gerenciamento de usuários e login/autenticação

- Endpoints necessários:

- [x] POST /users — Criar usuário
- [x] GET /users — Listar usuários
- [x] GET /users/:userId — Buscar usuário por id
- [x] PUT /users/:userId — Atualizar usuário

- [x] POST /auth/login — Login

2. Sistema de gerenciamento de eventos

- Endpoints necessários:

- [x] POST /events — Criar evento
- [x] GET /events — Listar eventos
- [x] GET /events/:id — Buscar evento por id
- [x] PUT /events/:id — Atualizar evento
- [x] DELETE /events/:id — Remover evento
- [x] PATCH /events/:id/status — Alterar status do evento

3. Sistema de gerenciamento de categorias

- Endpoints necessários:

- [x] POST /categories — Criar categoria
- [x] GET /categories — Listar categorias
- [x] GET /categories/:id — Buscar categoria por id
- [x] PUT /categories/:id — Atualizar categoria

4. Sistema de gerenciamento de categorias de evento

- Endpoints necessários:

- [x] POST /event-categories — Adicionar categoria ao evento
- [x] GET /event-categories — Listar categorias de evento
- [x] GET /event-categories/:eventId/:eventCategoryId — Buscar categoria de evento por id
- [x] PUT /event-categories/:eventCategoryId — Atualizar categoria de evento

5. Sistema de Senhas e Mapa de Senhas

- Entidades necessárias:
- [x] Password (Senha)

- Endpoints necessários:
- [x] POST /passwords — Criar senha (admin/organizer)
- [x] GET /passwords?eventId=uuid&categoryId=uuid&status=available — Listar senhas com filtros necessários
- [x] POST /passwords/purchase — Comprar senha / Inscrever competidor

6. Sistema de Inscrição Completo

- Entidades:
- [x] - Subscription (Inscrição) - relaciona usuário, evento, categoria, senhas

- Endpoints:
- [x] GET /subscriptions?eventId=uuid&userId=uuid&category=professional - Listar inscrições e senhas por evento, corredor ou categoria
- [x] GET /subscriptions/subscritionId - Busca uma inscrição

7. Sistema de Julgamento (Juízes)

- Entidades:
- [x] - Score (Nota) - com: value, type, judge_id, registration_id
- [ ] - ScoreType (Tipo de nota) - Valeu o Boi, Nulo, TV, Boi não quis correr

- Endpoints específicos para juízes:
- [ ] GET /judge/active-event - Evento ativo do juiz
- [ ] GET /judge/registrations - Inscrições para julgar
- [ ] POST /judge/scores - Registrar nota
- [ ] PUT /judge/scores/:scoreId - Atualizar nota (para TV temporária)

8. Sistema de Controle de Acesso Temporal

- Middleware para verificar acesso por data:
- [ ] Juízes só acessam no dia do evento
- [ ] Locutores com restrição similar

- Implementar em:
- [ ] Rotas de juízes (/judge/\*\*)
- [ ] Rotas de locutores (/announcer/\*\*)

9. Sistema de Relatórios

- Endpoints para organizadores:
- [ ] GET /events/:id/reports/password-sales - Relatório de vendas de senhas
- [ ] GET /events/:id/reports/competitors - Relatório de competidores
- [ ] GET /events/:id/reports/scores - Relatório de notas e classificações
