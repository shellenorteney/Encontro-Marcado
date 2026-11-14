# Encontre sua Conexão 💌

MVP baseado nas perguntas do Forms de referência:
https://docs.google.com/forms/d/e/1FAIpQLSdbCiG5nbjdTiGU39DUet_WsK9CniI6_aWuemxML6cEt_L1eg/viewform

## Fluxo

1. Participante preenche o perfil no site (foto opcional).
2. Um match estritamente acima de 70% gera um aviso por e-mail para cada pessoa, com link pessoal para abrir o site e aceitar. O perfil da outra pessoa permanece oculto.
3. Cada pessoa aceita por si. Só depois dos dois aceites, cada uma recebe outro e-mail com as respostas, o contato e a foto opcional do outro perfil. O perfil também fica disponível no site.

Match apenas entre homem e mulher, respeitando as faixas etárias dos dois. A regra é validada no servidor; campos adulterados no navegador não a alteram. Não há WhatsApp nem agendamento de encontros.

## Estado da entrega

Backend hospedado no Supabase: projeto kcejmkympweqmfdlglaz, função connection-v2, versão 3. Cadastro compartilhado, privacidade, aceite bilateral, aceite simultâneo e regra homem/mulher testados com registros sintéticos excluídos ao final. Os 11 testes locais passaram, incluindo conteúdo dos dois e-mails e bloqueio de divulgação antecipada. A fila no banco foi testada: dois avisos por par; zero mensagens com perfil após um aceite; duas após os dois; sem duplicação ao repetir o aceite.

Envio real de e-mails ainda NÃO configurado/testado. Faltam RESEND_API_KEY e MAIL_FROM de um domínio verificado, configurados apenas nos Secrets do Supabase. O endpoint status informa emailConfigured:false; a interface avisa essa pendência. Ter credenciais configuradas não comprova entrega: testar com destinatário autorizado após ativar.

A publicação do frontend no GitHub Pages continua bloqueada: a conexão do GitHub retornou 403 ao gravar e o Git local não possui autenticação. O endereço pretendido é https://shellenorteney.github.io/Encontro-Marcado/ ; não é uma afirmação de que esta versão esteja publicada.

## Executar

Node 24, sem dependências de build:

```
node --test tests/*.test.mjs
node --check site/web/app.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

Abra http://localhost:3000. site/ é a fonte do frontend; build gera dist/ e sincroniza index.html, .nojekyll e web/ na raiz para compatibilidade com Pages por branch. Os links relativos suportam /Encontro-Marcado/. O código antigo de src/ é histórico, não é utilizado no produto nem publicado pelo workflow. Não usar seu painel administrativo ou dados fictícios.

node tests/live.mjs executa teste integrado no backend hospedado com endereços example.invalid e limpa os registros criados. Não substituir por e-mails reais durante testes.

## Dados e segurança

backend/schema.sql contém o esquema aditivo aplicado. Dados antigos em app_private foram preservados. Tabelas connection_private têm RLS sem políticas públicas (bloqueio intencional) e não ficam no Data API público. A RPC é SECURITY INVOKER e só service_role pode executá-la. Os segredos nunca são enviados ao frontend.

A função usa autenticação própria: código aleatório de 256 bits, guardado no banco como SHA-256. A verificação JWT do gateway está desligada porque o código é validado no servidor. O participante pode guardar o código para outro aparelho. Os links enviados por e-mail usam um segundo código derivado por HMAC, também armazenado como hash; não invalidam o código original. O código viaja no fragmento da URL e é removido imediatamente da barra de endereço, sem autoaceitar o match. Quem possuir um código ou link pessoal pode acessar esse perfil; não encaminhá-los.

Não há verificação da titularidade do endereço nem recuperação por e-mail. O consentimento para compartilhar o perfil é direcional e separado do consentimento inicial. Aceites antigos de compartilhar só e-mail não autorizam enviar perfis: share_profile começa false, e exige novo aceite explícito. Aceites concorrentes usam bloqueio por par para gerar as duas mensagens corretamente.

A fila mail_jobs distingue match e profile, com chave única por tipo/par/destinatário. O banco exige ambos os aceites share_profile para liberar uma mensagem com perfil. O primeiro e-mail não contém dados do parceiro, mesmo que algum dado adicional seja incluído internamente. O segundo usa apenas uma lista explícita de respostas e a foto JPG opcional anexada. Textos são enviados como texto simples. Consultas do site só retornam o perfil do parceiro após os dois aceites.

Perfis expiram em 90 dias e deixam de ser retornados; limpeza física ocorre no próximo cadastro. Exclusão explícita remove o perfil, autorizações e filas por cascata. Limite de 1.000 perfis e 30 cadastros/hora por hash da rede. Sem CAPTCHA, moderação ou identidade verificada; requer acompanhamento antes de ampliar o uso.

## Compatibilidade

Idade recíproca e homem/mulher são eliminatórios. Até 70 pontos pelo coeficiente Dice dos hobbies separados por vírgulas, 15 por condição de membro igual, 15 por condição de missão igual. Apenas resultado bruto >70 gera match. Maiúsculas e acentos são normalizados; sinônimos não são interpretados. O restante das respostas ajuda na apresentação, mas não recebe pontuação. O método é explicado no site; não é uma previsão de relacionamento.

## E-mails e publicação

RESEND_API_KEY e MAIL_FROM devem existir somente nos Secrets do Supabase. Seguir a documentação oficial de envio e verificar o domínio no Resend. Nunca usar prefixos VITE_ para segredos.

As filas são processadas em segundo plano após cadastro, consulta e aceite. Uma falha no envio não impede salvar o perfil. Há reivindicação concorrente de até 20 mensagens, até cinco tentativas com intervalo mínimo de cinco minutos e idempotência por tipo/par/destinatário. Repetições dependem de novas ações no app; não existe agendador periódico nem comprovação de entrega via webhook. Isso permanece como limitação operacional.

.github/workflows/deploy.yml verifica sintaxe e testes, constrói dist e publica com GitHub Pages Actions na branch main. Exige autenticação de escrita (incluindo workflows) e configuração do Pages. Nenhum pacote externo/lockfile é necessário para o frontend ativo.
