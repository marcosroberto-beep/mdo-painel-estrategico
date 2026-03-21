# Mundo dos Óleos — Painel Estratégico de Consultoria

Painel interativo React para consultoria estratégica da empresa **Mundo dos Óleos** (MOL Comércio Var. de Prod. Naturais).

## Visão Geral

Dashboard completo com dados financeiros reais para análise e tomada de decisão, construído em React + Tailwind CSS via CDN (sem build tools).

### Seções do Painel

| Seção | Descrição |
|-------|-----------|
| **Dashboard** | KPIs principais, alertas, receita vs despesa, sparklines |
| **Fluxo de Caixa** | Evolução saldo bancário, DRE simplificado, despesas por categoria |
| **Clientes** | Análise completa: ranking, segmentação B2B/B2C, scoring, oportunidades |
| **Canais B2B** | Canais atuais, potenciais B2B, projeção de receita |
| **Produtos** | Top 10 produtos, mix de categorias, vendas por estado |
| **Metas 90 dias** | 3 fases com KPIs e barras de progresso, tracker de tarefas |
| **Alertas** | Diagnósticos críticos/altos/positivos, plano de ação |

### Funcionalidades

- Dark mode (toggle no header)
- Sparklines SVG nos KPI cards
- Gráficos de pizza (CSS conic-gradient)
- Scoring automático de clientes (Gold/Silver/Bronze)
- Impressão/export PDF
- Responsivo (mobile-friendly)
- Autenticação por senha

## Como usar

1. Abra `mdo_painel.html` em qualquer navegador
2. Digite a senha de acesso
3. Navegue pelas abas

> Não requer Node.js, npm ou qualquer build tool. Tudo via CDN.

## Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `mdo_painel.html` | Painel completo standalone (React + Tailwind via CDN) |
| `mdo_painel_completo.jsx` | Componente React original (para uso em projetos React) |
| `mdo_dados_consultoria.js` | Dados consolidados exportáveis |

## Stack

- React 18 (CDN)
- Tailwind CSS (CDN)
- Babel Standalone (transpilação no browser)
- Zero dependências locais

## Dados

Período de análise: **Março/2026 (01-21)**
- Fonte: Extratos CEF, Relatórios Bling, Shopify, RD Station
- Empresa: MOL Comércio — Mundo dos Óleos (CNPJ: 33.460.511/0001-45)

---

Consultoria Estratégica 90 dias | v3.0
