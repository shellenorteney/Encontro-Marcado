# Encontro Marcado

Aplicação para a atividade de compatibilidade do Aulão e Baile. Foto opcional, compatibilidade estritamente acima de 70%, critérios recíprocos e nenhum agendamento de encontros.

## Dados e consentimento

Os perfis ficam no Supabase, em tabelas privadas com RLS e sem acesso direto de visitantes. O navegador guarda apenas um token de acesso aleatório, válido por 30 dias. O participante deve voltar pelo mesmo navegador; limpar os dados ou trocar de aparelho não recupera esse acesso.

Os resultados são calculados no servidor. Nome, foto, ala/estaca e contatos do par só são retornados quando cada participante, em sua própria sessão, aceita compartilhar. Não há perfis pré-carregados, aceite simulado ou envio automático de WhatsApp. Os organizadores acessam os cadastros pelo painel do projeto Supabase; não há senha administrativa no site.

## Desenvolvimento

Com Node.js 24:

```sh
npm ci
npm run lint
npm test
npm run build
npm run dev
```

O cliente usa a função `encontro-marcado` do projeto Supabase `kcejmkympweqmfdlglaz`. Nenhuma chave de serviço é incluída no cliente. O código da função e o SQL estão em `supabase/`.

## Publicação no GitHub Pages

Em Settings → Pages, selecione **GitHub Actions**. O workflow `.github/workflows/deploy.yml` valida os tipos e as regras de compatibilidade, compila e publica `dist` após alterações na branch `main`.

Endereço previsto: https://shellenorteney.github.io/Encontro-Marcado/

Antes da divulgação, confirme o deploy concluído e teste o fluxo completo no endereço público em computador e celular. A existência do endereço, por si só, não confirma uma publicação funcional.
