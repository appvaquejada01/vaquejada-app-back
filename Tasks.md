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

- [ ] Implementar sistema de senhas das vaquejadas
- [ ] Implementar sistema de pagamento das senhas
- [ ] Implementar inscrição dos corredores na vaquejada com escolha de evento, categoria e senhas
- [ ] Implementar sistema de notas para cada corredor dada por um juiz (Opções de votos do Juiz: Valeu o Boi / Nulo / TV / Boi não quis correr)
- [ ] Documentação das APIs com Swagger

# Tarefas a serem feitas

1. Sistema de Senhas e Mapa de Senhas

- Entidades necessárias:
- [ ] Password (Senha) - com status: available, reserved, sold, used
- [ ] PasswordBlock (Lote de senhas) - agrupamento por categoria/área
- [ ] PasswordPurchase (Compra de senha)

- Endpoints necessários:
- [ ] GET /events/:id/passwords - Listar senhas disponíveis com mapa
- [ ] POST /events/:id/passwords/reserve - Reservar senha temporariamente
- [ ] POST /events/:id/passwords/purchase - Comprar sen- h a
- [ ] GET /users/:userId/purchased-passwords - Senhas compradas por usuário

2. Sistema de Inscrição Completo

- Entidades:
- [ ] - Registration (Inscrição) - relaciona usuário, evento, categoria, senhas

- Endpoints:
- [ ] POST /events/:eventId/register - Inscrever competidor
- [ ] GET /events/:eventId/registrations - Listar inscrições (apropriado por perfil)

3. Sistema de Julgamento (Juízes)

- Entidades:
- [ ] - Score (Nota) - com: value, type, judge_id, registration_id
- [ ] - ScoreType (Tipo de nota) - Valeu o Boi, Nulo, TV, Boi não quis correr

- Endpoints específicos para juízes:
- [ ] GET /judge/active-event - Evento ativo do juiz
- [ ] GET /judge/registrations - Inscrições para julgar
- [ ] POST /judge/scores - Registrar nota
- [ ] PUT /judge/scores/:scoreId - Atualizar nota (para TV temporária)

4. Sistema de Controle de Acesso Temporal

- Middleware para verificar acesso por data:
- [ ] Juízes só acessam no dia do evento
- [ ] Locutores com restrição similar

- Implementar em:
- [ ] Rotas de juízes (/judge/\*\*)
- [ ] Rotas de locutores (/announcer/\*\*)

5. Sistema de Relatórios

- Endpoints para organizadores:
- [ ] GET /events/:id/reports/password-sales - Relatório de vendas de senhas
- [ ] GET /events/:id/reports/competitors - Relatório de competidores
- [ ] GET /events/:id/reports/scores - Relatório de notas e classificações
