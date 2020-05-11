
# gobarber-node

**RF** Requisitos Funcionais

**RFN** Requisitos Não-Funcionais ==> Qual BD? Qual Lib? Que recurso usarei pra prover uma funcionalidade

**RN** Regras de Negócio
_____________________________________________________

# Recuperação de Senha

**RF**
- O usuário deve poder recuperar sua senha informando o seu email
- O usuário deve receber email com instruções de recuperação de email
- O usuário deve poder resetar sua senha

**RFN**
- Utilizar mailtrap para testar envio de emails em fase de desenvolvimento
- Utilizar Amazon SES para envios de emails em produção
- Envio de emails deve acontecer em segundo plano (background job)*

**RN**
- O Link enviado por Email pra restar senha deve expirar em 2h
- O usuário precisa confirmar a nova senha ao resetar a senha

# Atualização do Perfil

**RF**
- O usuário deve poder alterar seu nome, email e senha (e avatar?)

**RFN**

**RN**
- O usuário não pode alterar email para um email já utilizado
- Para atualizar a senha, usuário precisa informar a senha antiga
- Para atualizar a senha, usuário precisa confirmar a nova senha

# Painel do Prestador

**RF**
- Usuário deve poder listar seus agendamentos de um dia específico
- O prestador deve receber uma notificação sempre que tiver um novo atendimento
- O prestador deve poder visualizar as notificações não lidas

**RFN**
- Os agendamentos do prestador em um dia devem ser armazenados em cache
- as notificações do prestador devem ser armazenadas no mongoDB
- as notificações do prestadpr devem ser enviadas em tempo real usando socket.io

**RN**
- A notificação deve ter um status "lida" X "não lida" para o prestador controlar

# Agendamento de Serviços

**RF**
- O usuário deve poder listar todos os prestadores cadastrados
- O usuário deve poder listar os dias de um mês com horários pelo menos um horário disponível de um determinado Prestador
- O usuário deve poder listar horários disponíveis em um dia de determinado Prestador
- O usuário deve poder marcar um novo atendimento com um prestador

**RFN**
- A listagem de prestadores deve ser armazenada em cache

**RN**
- Cada agendamento deve durar 1h
- Agendamentos devem estar disponíveis entre 08:00 e 18:00 (primeiro 8h e último às 17h)
- Usuário não pode agendar em um horário já ocupado
- Usuário não pode agendar em um horário que já passou
- Usuário não pode agendar serviços pra si próprio
-



# OBS

* emails demoram pra serem enviados, usamos uma fila para que o backend os envie a medida em que consegue
* cache - um mini BD que armazena dados mais recentes
* O mongoDB é muito performático. Informações podem ter formatos diferentes que tá de boas
