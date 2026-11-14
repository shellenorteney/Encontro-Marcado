# Encontro Marcado — conexões

Site com perfil, alternativas e consentimento bilateral. O frontend usa o cartaz fornecido (creme, vermelho e azul-petróleo), com Oswald nos destaques e Caveat nos títulos manuscritos. Não há referência ao Forms na interface.

## Cadastro

1. Perfil: nome, idade, homem/mulher, e-mail, membro/não membro. Ala e estaca são obrigatórias somente para membros. Profissão, estudos e foto são opcionais.
2. Sobre você: hobbies com alternativas e opções próprias; missão sim/não (local somente se sim); exatamente três pontos fortes, incluindo opções próprias; curiosidade aberta. Sem venda seu peixe.
3. O que procura: as mesmas alternativas de hobbies, qualidades (até três), condição de membro e missão; faixa etária desejada; profissão, estudos, ala e estaca opcionais. Ao menos uma característica deve ser escolhida.
4. Autorização: preserva o consentimento de uso dos dados e exige aceite separado de cada match antes de divulgar perfil/contato.

Somente homem/mulher, idade recíproca e afinidade bruta >70 geram match. O servidor valida todos os limites. No cadastro novo, comparamos as preferências de cada pessoa com o perfil da outra. Hobbies têm peso 40, qualidades 30, membro 15 e missão 15; profissão/estudos/ala/estaca opcionais têm peso 5 cada. Somente critérios escolhidos entram no denominador; hobbies e qualidades usam a proporção atendida. Textos opcionais exigem igualdade normalizada, sem interpretação semântica. O score final é o menor dos dois scores direcionais. Cadastros antigos continuam armazenados e usam o cálculo anterior (hobbies 70, condição de membro 15, missão 15) na sua direção de comparação.

## Notificações

O primeiro e-mail avisa do match e dá acesso ao site sem revelar o perfil. Só após ambos aceitarem, um segundo e-mail leva as respostas, o contato e a foto opcional anexada. Não há WhatsApp nem agendamento de encontros. O código de acesso e os links pessoais não devem ser encaminhados.

A conexão de e-mail está preparada, mas ainda não está ativa para participantes: faltam um domínio verificado no Resend e os Secrets RESEND_API_KEY e MAIL_FROM no Supabase. O login do Resend com GitHub e um primeiro envio de teste não comprovam envio geral. Nunca colocar chaves no frontend ou no GitHub. O endpoint status informa emailConfigured. Testar envio real somente com destinatário autorizado após configurar o domínio/remetente.

## Backend

Supabase kcejmkympweqmfdlglaz, função connection-v2. Tabelas em connection_private com RLS sem políticas públicas (bloqueio intencional); RPC SECURITY INVOKER executável só por service_role. Chaves de servidor não são incluídas no cliente. Autenticação própria por código aleatório de 256 bits salvo como SHA-256; a função verifica o código (JWT do gateway desligado). E-mails usam código HMAC separado, enviado no fragmento e removido da barra pelo site. Não há verificação da titularidade do e-mail nem recuperação de acesso por e-mail neste MVP.

O perfil, a foto e as respostas ficam ocultos até aceites direcionais share_profile dos dois participantes. Aceites simultâneos são serializados por par. A fila distingue avisos e perfis, com deduplicação por par/tipo/destinatário. Os envios acontecem em segundo plano após ações no app; retries dependem de novas ações, até cinco tentativas espaçadas em pelo menos cinco minutos. Não há scheduler periódico nem webhook de entrega. Dados expiram em 90 dias; limpeza física de expirados ocorre no próximo cadastro. Exclusão explícita remove perfil, consents e filas por cascata. Limites de 1.000 perfis e 30 cadastros/hora por hash de rede.

## Desenvolvimento e publicação

Node 24; sem dependências de instalação:

```
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/serve.mjs
```

Fonte em site/; dist/ é o artefato estático. O build também sincroniza index.html e web/ para compatibilidade com Pages na raiz. src/ contém o protótipo antigo e não entra no artefato ativo. GitHub Actions verifica sintaxe, testes e publica em Pages. O código continua no repositório Encontro-Marcado. Uma segunda hospedagem Sites está sendo preparada para usar endereço sem o nome pessoal.

node tests/live.mjs testa o fluxo antigo. node tests/live-choices.mjs testa o cadastro novo e o novo Origin com registros sintéticos removidos ao final. Não usar endereços reais nessas fixtures. Os testes de templates de e-mail não enviam mensagens.
