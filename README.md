# Encontre sua Conexão 💌

Frontend: https://shellenorteney.github.io/Encontro-Marcado/

MVP com perguntas extraídas do [Forms de referência](https://docs.google.com/forms/d/e/1FAIpQLSdbCiG5nbjdTiGU39DUet_WsK9CniI6_aWuemxML6cEt_L1eg/viewform), foto opcional, perfis compartilhados no Supabase e consentimento bilateral para divulgar o campo e-mail. Não envia respostas ao Forms e não agenda encontros no baile.

## Executar e testar

Node 24; sem dependências externas para construir o frontend:

```
node --test tests/*.test.mjs
node --check site/web/app.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

Abra http://localhost:3000. `dist` é a publicação; os links relativos funcionam no caminho `/Encontro-Marcado/`. `site/` contém o frontend ativo. O código antigo em `src/` é histórico e não é incluído na publicação (não usar seus dados fictícios ou painel de administração).

`node tests/live.mjs` testa o backend hospedado com dois registros sintéticos e os exclui no final. Não usar endereços reais nesse teste.

## Backend e privacidade

Projeto Supabase `kcejmkympweqmfdlglaz`, função `connection-v2`. `backend/schema.sql` contém a definição aditiva aplicada e `backend/index.ts` a função hospedada. A versão anterior `encontro-marcado` e seu esquema permanecem preservados; não há migração automática das perguntas antigas.

As tabelas ficam em `connection_private`, fora do Data API público, com RLS sem políticas públicas (bloqueio intencional). A RPC é SECURITY INVOKER, executável apenas por `service_role`. Somente o servidor possui essa chave. A função valida um código aleatório de 256 bits, salvo no banco apenas como SHA-256. A verificação JWT do gateway está desligada porque a autenticação própria é validada dentro da função.

O código de acesso deve ser guardado pelo participante e permite abrir o mesmo perfil em outro aparelho. Não existe recuperação por e-mail ou verificação da titularidade do endereço neste MVP. O navegador guarda apenas esse código, não a base de participantes. Não divulgar esse código em links ou logs. O consentimento de cadastro é registrado com versão; a autorização para contato é direcional e fica em uma tabela separada. Só o próprio participante pode aceitar por si. O servidor nunca devolve o campo e-mail do parceiro antes das duas autorizações. Foto e apresentação são visíveis a matches, conforme consentimento de cadastro. Exclusão remove os dados e dependências por cascata.

Perfis expiram após 90 dias e deixam de ser retornados; limpeza física de expirados ocorre no próximo cadastro. Limite inicial de 1.000 perfis ativos e 30 cadastros/hora por hash da rede. Sem CAPTCHA, identidade verificada ou moderação: monitorar abuso antes de escalar.

## Cálculo

Preferências de gênero e idade são recíprocas e eliminatórias. Até 70 pontos pelo coeficiente Dice dos hobbies separados por vírgula (normalizando acentos e caixa), 15 por resposta igual à condição de membro e 15 por resposta igual a ter servido missão. Os dois campos booleanos são complementos identificados no app. Match somente se a pontuação bruta for **>70**, antes de arredondar. Os demais textos são armazenados e apresentados, sem inferências psicológicas ou comparação semântica. Não há interpretação automática de sinônimos. O percentual é uma estimativa simples e explicada na interface.

## Notificações por e-mail — ativação pendente

A função suporta Resend, com fila persistente, reivindicação concorrente e chave de idempotência por par/destinatário. Um match põe ambos os participantes na fila. As mensagens são genéricas, sem respostas nem contato da outra pessoa. A configuração é indicada pelo endpoint `status`; não afirma entrega. A fila é processada após ações de cadastro/consulta/aceite em segundo plano; não existe agendador periódico de retry. Falhas podem ser repetidas após 5 minutos, até 5 tentativas, acionadas por nova consulta. Falta observabilidade e retry administrativo para operar em escala.

Defina **somente nos Secrets do Supabase**:

- `RESEND_API_KEY`: chave do provedor.
- `MAIL_FROM`: remetente com domínio verificado no Resend.

Não colocar essas variáveis no GitHub Pages, nem usar prefixo VITE_. O endpoint retorna `emailConfigured:false` enquanto faltarem. Depois de configurar, realizar teste de entrega com um destinatário autorizado e validar o domínio/remetente. Nenhum envio real de e-mail foi testado nesta entrega.

## Publicação

`.github/workflows/deploy.yml` verifica sintaxe, executa os testes, constrói o site estático e publica com GitHub Pages Actions na branch `main`. Nenhum npm install ou lockfile é necessário, porque o produto ativo não tem pacotes de execução/build. O Pages deve usar a origem GitHub Actions nas configurações do repositório.
