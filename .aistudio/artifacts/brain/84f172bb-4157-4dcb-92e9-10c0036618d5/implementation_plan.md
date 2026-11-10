# Conexão: Cadastro Passo a Passo & Matches com Notificação WhatsApp

Plataforma simplificada e acolhedora para conectar membros com base em afinidades reais, ala/estaca, critérios indispensáveis e notificações diretas pelo WhatsApp com dupla confirmação de privacidade.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas e regras de negócio atualizadas:**
> - **Regra Estrita de Gênero**: Matches são permitidos **exclusivamente entre Homem e Mulher** (homens só recebem matches com mulheres e vice-versa). O Passo 1 do cadastro incluirá a seleção clara do gênero.
> - **Aviso no WhatsApp**: Utilizaremos links diretos oficiais `https://wa.me/{numero}?text={mensagem}`, abrindo o WhatsApp com mensagem amigável e pronta.
> - **Painel de Administração / Testes**: Aba de organizador/admin no rodapé para visualizar todos os perfis cadastrados, verificar matches calculados e testar os disparos de mensagens.
> - **Contato WhatsApp Obrigatório**: O campo de número de WhatsApp com DDD será obrigatório no Passo 1 para viabilizar as notificações de match.
> - **Privacidade Estrita**: O @ do Instagram e dados de contato só são compartilhados quando ambas as partes aceitam o match mútuo.

---

### 1. Overview & Core Concept

- **O que o app faz**: Permite que a pessoa crie seu perfil em etapas simples e objetivas (dados básicos com Gênero, Ala e Estaca, seleção de gostos por botões, preferências do que procura em alguém e aceite de termos). O sistema salva os dados, cruza as afinidades com a regra estrita Homem x Mulher e gera avisos automáticos via WhatsApp com opção de revelar o perfil seguro mediante consentimento de ambos.
- **Público-alvo**: Jovens e solteiros da comunidade (membros de Alas e Estacas) que buscam relacionamentos com pessoas de valores e interesses alinhados.
- **Proposta de Valor**: Elimina a sobrecarga dos aplicativos convencionais com um formulário focado, sem distrações, respeito às diretrizes e proteção total de privacidade.

---

### 2. User Experience & Visual Design

#### Fluxo do Usuário Passo a Passo

```
┌─────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│   TELA INICIAL  │       │ PASSO 1: MEU PERFIL   │       │ PASSO 2: SOBRE MIM    │
│  "Começar e     │ ────> │ Foto, Nome, Idade,    │ ────> │ Seleção de gostos em  │
│  Criar Perfil"  │       │ Gênero (Homem/Mulher),│       │ botões + O que estuda │
│                 │       │ Ala, Estaca, WhatsApp,│       │ ou trabalha           │
│                 │       │ Instagram e Frase     │       │                       │
└─────────────────┘       └───────────────────────┘       └───────────────────────┘
                                                                      │
                                                                      ▼
┌─────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ MATCH & WHATSAPP│       │ PASSO 4: TERMOS       │       │ PASSO 3: O QUE PROCURA│
│ Notificação     │ <──── │ Permissão de dados,   │ <──── │ Faixa etária,         │
│ wa.me + Perfil  │       │ aviso de match e      │       │ Indispensáveis e      │
│ Seguro Revelado │       │ botão Finalizar       │       │ O que é legal ter     │
└─────────────────┘       └───────────────────────┘       └───────────────────────┘
```

#### Identidade Visual & Estilo

- **Direção Estética**: Minimalista, amigável e calorosa, sem elementos visuais poluídos ou abas desnecessárias.
- **Paleta de Cores**:
  - Fundo neutro e arejado: branco suave (`#FAFAFA`) no tema claro e ardósia escuro (`#0F172A`) no tema escuro.
  - Cor primária: Rose/Terracota acolhedor (`#E11D48` e `#F43F5E`) combinado com toques suaves de verde WhatsApp (`#22C55E`) nas ações de contato.
- **Tipografia**: *Plus Jakarta Sans*, legível, moderna e com espaçamentos confortáveis em dispositivos móveis e desktop.
- **Ergonomia Móvel**: Botões com área de toque de no mínimo 44px, barra de progresso em 4 etapas claras e feedback visual instantâneo ao selecionar opções.

---

### 3. Key Product Decisions & Trade-Offs

- **Regra de Gênero Obrigatória**:
  - *Decisão*: Inclusão do campo Gênero no Passo 1 com botões de seleção clara ("Homem" / "Mulher").
  - *Regra de Match*: O motor de compatibilidade rejeita automaticamente qualquer par que não seja Homem e Mulher, garantindo o cumprimento estrito da diretriz.
- **Etapas Guiadas (Wizard)**:
  - *Decisão*: Dividir o preenchimento em 4 etapas curtas em vez de um formulário longo único.
  - *Por que*: Reduz o cansaço do usuário, tornando a experiência rápida e agradável pelo celular.
- **Opções de Gostos em Botões Clicáveis**:
  - *Decisão*: Oferecer uma lista curada de gostos por botões selecionáveis (Dançar, Cantar, Tocar instrumento, Cozinhar, Esportes, Trilhas, Cinema, Leitura, Jogos, etc.).
  - *Por que*: Facilita o cruzamento exato no algoritmo de match e evita digitações divergentes.
- **Notificação Direta via WhatsApp (`wa.me`)**:
  - *Decisão*: Gerar links `https://wa.me/{numero}?text={mensagem_codificada}` com o texto formatado:
    > *"Olá [Nome]! Encontramos um match para você no Conexão! 🎉 A pessoa é da [Ala/Estaca] e tem gostos super parecidos com os seus. Você aceita compartilhar seu perfil e @ do Instagram para se conhecerem?"*
  - *Por que*: Funciona diretamente em qualquer dispositivo, abre o WhatsApp nativo da pessoa e não depende de servidores externos caros de SMS.
- **Painel de Administração Integrado**:
  - *Decisão*: Aba de administração no rodapé para o organizador visualizar os membros cadastrados, disparar o algoritmo de match e acompanhar confirmações mútuas.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   App.tsx (Root View)                  │
├──────────────────────────┬─────────────────────────────┤
│   StartHero (Tela 1)     │  OnboardingWizard (Passos)  │
│   - Começar Cadastro     │  - Step 1: Dados & Contato  │
│   - Acesso Admin         │    (Inclui Homem/Mulher)    │
│                          │  - Step 2: Gostos Pessoais  │
│                          │  - Step 3: O que Procura    │
│                          │  - Step 4: Termos & Salvar  │
├──────────────────────────┴─────────────────────────────┤
│              MatchEngine & WhatsApp Notifier           │
│   - Filtro ESTRITO: Homem x Mulher                     │
│   - Validação de faixa etária cruzada                  │
│   - Intersecção de itens Indispensáveis                │
│   - Geração de link wa.me com mensagem personalizada   │
├────────────────────────────────────────────────────────┤
│          AdminDashboard & Local Storage Store          │
│   - Perfis salvos em localStorage com seed inicial     │
│   - Visualização de pares compatíveis                  │
│   - Revelação de perfil com @Instagram pós-aceite      │
└────────────────────────────────────────────────────────┘
```

#### Modelo de Dados do Perfil

```typescript
export type Gender = 'homem' | 'mulher';

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender; // 'homem' | 'mulher' (estrito)
  age: number;
  ward: string; // Ala
  stake: string; // Estaca
  whatsapp: string; // DDD + Número
  instagram?: string; // @ do Instagram (revelado apenas após match duplo)
  photoUrl?: string;
  aboutMePhrase?: string; // Frase sobre mim
  occupation?: string; // O que estuda ou trabalha
  interests: string[]; // Gostos selecionados (dançar, cantar, etc.)
  preferences: {
    minAge: number;
    maxAge: number;
    indispensable: string[]; // O que é indispensável
    niceToHave: string[]; // É legal, mas tudo bem se não tiver
  };
  consentGiven: boolean;
  createdAt: string;
}
```

---

### 5. Plano de Execução

1. **Atualizar os tipos de dados e seed de perfis de teste** incluindo o gênero Homem / Mulher com alas e estacas reais brasileiras.
2. **Construir a Tela Inicial Minimalista**: layout direto focado no botão "Começar e Criar Perfil".
3. **Desenvolver o Wizard de Cadastro em 4 Passos**:
   - Passo 1: Foto, Nome, Idade, Gênero (Homem / Mulher), Ala, Estaca, WhatsApp, Instagram e Frase.
   - Passo 2: O que você gosta de fazer (botões de seleção rápida) + Estudo/Trabalho.
   - Passo 3: O que procura em alguém (faixa etária, indispensáveis e desejáveis).
   - Passo 4: Termos de consentimento e confirmação.
4. **Implementar o Motor de Matches com Regra Estrita Homem x Mulher**:
   - Só cruza homem com mulher e mulher com homem.
   - Valida faixa etária recíproca e critérios indispensáveis.
   - Gera o link `wa.me` do WhatsApp com a mensagem pronta de autorização.
   - Revelação de perfil mútuo com Nome, Foto, Idade, Ala, Estaca e @ do Instagram.
5. **Implementar o Painel do Organizador**:
   - Visualização dos cadastrados filtrados por gênero/estaca, simulação de matches e visualização dos resultados.
