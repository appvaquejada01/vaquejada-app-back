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

- [x] Implementar sistema de senhas das vaquejadas
- [ ] Implementar sistema de pagamento das senhas
- [x] Implementar inscrição dos corredores na vaquejada com escolha de evento, categoria e senhas
- [ ] Implementar sistema de notas para cada corredor dada por um juiz (Opções de votos do Juiz: Valeu o Boi / Nulo / TV / Boi não quis correr)
- [x] Documentação das APIs com Swagger

# Tarefas a serem feitas

1. Sistema de Senhas e Mapa de Senhas

- Entidades necessárias:
- [x] Password (Senha) - com status: available, reserved, sold, used
- [x] PasswordPurchase (Compra de senha)

- Endpoints necessários:
- [x] GET /passwords?eventId=uuid&categoryId=uuid - Listar senhas disponíveis com mapa por categoria
- [x] POST /passwords/purchase - Comprar senha / Inscrever competidor
- [ ] GET /passwords? - Senhas compradas por usuário, categoria ou evento

2. Sistema de Inscrição Completo

- Entidades:
- [x] - Subscription (Inscrição) - relaciona usuário, evento, categoria, senhas

- Endpoints:
- [ ] GET /events/:eventId/registrations - Listar inscrições (apropriado por perfil)

3. Sistema de Julgamento (Juízes)

- Entidades:
- [x] - Score (Nota) - com: value, type, judge_id, registration_id
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

6. Endpoints de EventCategory

- [x] GET /events/:id/event-categories - Listar categorias do evento
- [x] POST /events/:id/event-categories - Adicionar categoria ao evento
- [x] GET /event-categories/:id - Buscar categoria de evento por id
- [x] PUT /event-categories/:id - Atualizar categoria de evento
