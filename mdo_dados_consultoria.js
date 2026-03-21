/**
 * MUNDO DOS ÓLEOS - DADOS CONSOLIDADOS PARA CONSULTORIA
 * Gerado em: 21/03/2026
 * Fonte: Extratos CEF, Relatórios Bling, Análise Financeira
 */

export const dadosMdO = {
  // ==========================================
  // INFORMAÇÕES DA EMPRESA
  // ==========================================
  empresa: {
    razaoSocial: "MOL COMERCIO VAR DE PROD NAT LTD",
    nomeFantasia: "Mundo dos Óleos",
    cnpj: "33.460.511/0001-45",
    endereco: "CLSW 504, Bl. B, Lj. 46 - Brasília/DF",
    banco: {
      nome: "Caixa Econômica Federal",
      agencia: "01502",
      conta: "000578237293-8"
    },
    equipe: 3,
    anosOperacao: 20,
    totalSKUs: 3000,
    baseClientes: 49000,
    taxaRecompra: 0.44
  },

  // ==========================================
  // DADOS FINANCEIROS - MARÇO 2026 (01-21)
  // ==========================================
  financeiro: {
    periodo: "MAR/2026 (01-21)",
    
    // Receitas do Bling
    receita: {
      bruta: 43890.65,
      pedidos: 264,
      ticketMedio: 166.25,
      custoMercadoria: 9977.58,
      lucroBruto: 33913.07,
      markupMedio: 77.3
    },

    // Fluxo de Caixa (Extrato Bancário)
    fluxoCaixa: {
      saldoInicial: 25829.68,
      saldoFinal: 5896.21,
      variacaoPeriodo: -19933.47
    },

    // Comparativo Mensal
    comparativoMensal: [
      { mes: "DEZ/2025", saldoInicial: 1904.63, saldoFinal: 23440.83, variacao: 21536.20, aportesSocios: 61570.21 },
      { mes: "JAN/2026", saldoInicial: 23440.83, saldoFinal: 27653.69, variacao: 4212.86, aportesSocios: 41125.51 },
      { mes: "FEV/2026", receita: 70923.25, pedidos: 370, ticket: 191.68 },
      { mes: "MAR/2026", saldoInicial: 25829.68, saldoFinal: 5896.21, variacao: -19933.47, aportesSocios: 15593.17, receita: 43890.65, pedidos: 264, ticket: 166.25 }
    ],

    // DRE Simplificado
    dre: {
      receitaBruta: 43890.65,
      impostosSobreVendas: -6716.13,
      receitaLiquida: 37174.52,
      cmv: -16462.27,
      lucroBruto: 20712.25,
      despesasOperacionais: {
        marketingTecnologia: -15780.52,
        ocupacao: -4089.15,
        logistica: -7273.63,
        pessoal: -6999.18,
        financeiras: -13614.84,
        outras: -1420.73
      },
      resultadoOperacional: -28466.80
    }
  },

  // ==========================================
  // ESTRUTURA DE CUSTOS
  // ==========================================
  custos: {
    // Custos Fixos Mensais
    fixos: [
      { categoria: "Marketing", item: "Webi Marketing Digital", valor: 8850.00, percentualReceita: 20.2, criticidade: "alta" },
      { categoria: "Tecnologia", item: "RD Station (RD Gestão)", valor: 6072.01, percentualReceita: 13.8, criticidade: "media" },
      { categoria: "Ocupação", item: "Aluguel (Alpha Brasília)", valor: 2665.10, percentualReceita: 6.1, criticidade: "baixa" },
      { categoria: "Ocupação", item: "Condomínio", valor: 1059.13, percentualReceita: 2.4, criticidade: "baixa" },
      { categoria: "Administrativo", item: "Contabilidade (Arbrent)", valor: 1150.00, percentualReceita: 2.6, criticidade: "baixa" },
      { categoria: "Utilities", item: "Energia (Neoenergia)", valor: 236.60, percentualReceita: 0.5, criticidade: "baixa" },
      { categoria: "Utilities", item: "Água (CAESB)", valor: 128.32, percentualReceita: 0.3, criticidade: "baixa" },
      { categoria: "Utilities", item: "Telefone/Internet", valor: 408.51, percentualReceita: 0.9, criticidade: "baixa" },
      { categoria: "Bancário", item: "Cesta de Serviços CEF", valor: 189.00, percentualReceita: 0.4, criticidade: "baixa" },
      { categoria: "Seguro", item: "Caixa Vida e Previdência", valor: 133.00, percentualReceita: 0.3, criticidade: "baixa" }
    ],
    totalFixo: 20891.67,

    // Custos Variáveis (Fornecedores)
    variaveis: [
      { fornecedor: "EBPM Comercial", tipo: "Embalagens/Insumos", valorMar: 10338.98, cnpj: "59.258.863/0001-06" },
      { fornecedor: "Sta Efigênia", tipo: "Matéria-prima/Óleos", valorMar: 2895.97, cnpj: "36.872.596/0001-67" },
      { fornecedor: "Via Aroma", tipo: "Óleos Essenciais", valorMar: 2241.54, cnpj: "04.612.952/0001-17" },
      { fornecedor: "Correios", tipo: "Frete/Envios", valorMar: 4859.05, cnpj: "34.028.316/0001-03" },
      { fornecedor: "Casa da Química", tipo: "Insumos", valorMar: 659.00, cnpj: "05.823.296/0001-64" },
      { fornecedor: "China Atacadista", tipo: "Embalagens", valorMar: 256.18, cnpj: "13.970.820/0003-10" }
    ],
    totalVariavel: 21250.72,

    // Despesas Financeiras (CRÍTICO)
    financeiras: [
      { item: "Empréstimo SIEMP", valor: 5365.30, tipo: "debito_automatico", criticidade: "alta" },
      { item: "Cartão CAIXA VISA", valor: 7980.58, tipo: "fatura", criticidade: "alta" },
      { item: "Tarifas CEF", valor: 268.96, tipo: "tarifas", criticidade: "baixa" }
    ],
    totalFinanceiro: 13614.84,

    // Impostos
    impostos: [
      { item: "Receita Federal (DARF)", valor: 6518.86 },
      { item: "ICMS/ISS (Secretaria Fazenda)", valor: 197.27 }
    ],
    totalImpostos: 6716.13
  },

  // ==========================================
  // CANAIS DE VENDA
  // ==========================================
  canais: {
    atual: [
      { canal: "Shopify", pedidos: 257, receita: 43535.67, percentual: 99.2, ticket: 169.44, status: "ativo" },
      { canal: "Mercado Livre", pedidos: 6, receita: 249.63, percentual: 0.6, ticket: 41.61, status: "ativo" },
      { canal: "TikTok Shop", pedidos: 1, receita: 105.35, percentual: 0.2, ticket: 105.35, status: "ativo" },
      { canal: "WhatsApp", pedidos: 0, receita: 0, percentual: 0, status: "potencial" }
    ],
    
    // Canais B2B Potenciais para Análise
    b2b: {
      potenciais: [
        {
          canal: "Farmácias de Manipulação",
          descricao: "Farmácias que manipulam fórmulas magistrais",
          potencial: "alto",
          ticketEstimado: 2500,
          frequencia: "quinzenal",
          produtosFoco: ["Óleos vegetais granel", "Extratos", "Manteigas"],
          estrategia: "Prospecção ativa + kit de amostras",
          clienteAtual: "Pharmacorum (R$ 1.345)"
        },
        {
          canal: "Clínicas de Estética",
          descricao: "Clínicas de estética facial e corporal",
          potencial: "alto",
          ticketEstimado: 1800,
          frequencia: "mensal",
          produtosFoco: ["Óleos de massagem", "Rosa Mosqueta", "Jojoba"],
          estrategia: "Parceria + desconto profissional"
        },
        {
          canal: "SPAs e Day SPAs",
          descricao: "Estabelecimentos de relaxamento e bem-estar",
          potencial: "medio",
          ticketEstimado: 1200,
          frequencia: "mensal",
          produtosFoco: ["Óleos essenciais", "Blends", "Aromaterapia"],
          estrategia: "Degustação + programa de fidelidade"
        },
        {
          canal: "Lojas de Produtos Naturais",
          descricao: "Varejos especializados em naturais/orgânicos",
          potencial: "medio",
          ticketEstimado: 3500,
          frequencia: "quinzenal",
          produtosFoco: ["Linha completa revenda"],
          estrategia: "Atacado com margem 30%"
        },
        {
          canal: "Salões de Beleza",
          descricao: "Salões de cabelo e beleza",
          potencial: "medio",
          ticketEstimado: 800,
          frequencia: "mensal",
          produtosFoco: ["Óleos capilares", "Argan", "Coco"],
          estrategia: "Representante regional"
        },
        {
          canal: "Indústria Cosmética",
          descricao: "Fabricantes de cosméticos (OEM/B2B2C)",
          potencial: "alto",
          ticketEstimado: 8000,
          frequencia: "mensal",
          produtosFoco: ["Óleos vegetais 5L/20L", "Matéria-prima"],
          estrategia: "Contrato fornecimento + preço escalonado"
        },
        {
          canal: "Terapeutas/Aromaterapeutas",
          descricao: "Profissionais autônomos de terapias",
          potencial: "medio",
          ticketEstimado: 500,
          frequencia: "mensal",
          produtosFoco: ["Óleos essenciais", "Kits terapêuticos"],
          estrategia: "Certificação + desconto profissional"
        },
        {
          canal: "Academias/Studios",
          descricao: "Academias de yoga, pilates, wellness",
          potencial: "baixo",
          ticketEstimado: 600,
          frequencia: "bimestral",
          produtosFoco: ["Óleos relaxantes", "Aromaterapia"],
          estrategia: "Parceria pós-treino"
        }
      ],
      metricas: {
        potencialReceitaMensal: 45000,
        clientesMetaAno1: 50,
        ticketMedioB2B: 2200
      }
    }
  },

  // ==========================================
  // VENDAS POR REGIÃO
  // ==========================================
  regioes: [
    { uf: "DF", pedidos: 331, receita: 117584.15, percentual: 42.0 },
    { uf: "SP", pedidos: 160, receita: 38522.12, percentual: 20.3 },
    { uf: "AM", pedidos: 13, receita: 12982.11, percentual: 1.6 },
    { uf: "MG", pedidos: 49, receita: 11736.20, percentual: 6.2 },
    { uf: "RJ", pedidos: 41, receita: 10186.63, percentual: 5.2 },
    { uf: "SC", pedidos: 20, receita: 9499.23, percentual: 2.5 },
    { uf: "RS", pedidos: 20, receita: 7521.79, percentual: 2.5 },
    { uf: "GO", pedidos: 26, receita: 7347.61, percentual: 3.3 },
    { uf: "PR", pedidos: 27, receita: 6966.22, percentual: 3.4 }
  ],

  // ==========================================
  // TOP PRODUTOS
  // ==========================================
  topProdutos: [
    { rank: 1, sku: "08488", nome: "Blend Facial 60ml", qtd: 14, receita: 1398.60, markup: 100.0, categoria: "Blends" },
    { rank: 2, sku: "05091", nome: "Óleo Essencial Lavanda Mont Blanc 10ml", qtd: 17, receita: 882.30, markup: 78.0, categoria: "Óleos Essenciais" },
    { rank: 3, sku: "00500", nome: "Óleo Semente de Uva 5L", qtd: 2, receita: 807.80, markup: 71.87, categoria: "Óleos Vegetais" },
    { rank: 4, sku: "05074", nome: "Óleo Essencial Gerânio 10ml", qtd: 7, receita: 741.30, markup: 77.83, categoria: "Óleos Essenciais" },
    { rank: 5, sku: "00205", nome: "Óleo de Jojoba 1L", qtd: 2, receita: 725.80, markup: 78.19, categoria: "Óleos Vegetais" },
    { rank: 6, sku: "01065", nome: "Óleo de Moringa 250ml", qtd: 6, receita: 661.90, markup: 69.15, categoria: "Óleos Vegetais" },
    { rank: 7, sku: "05062", nome: "Óleo Essencial Alecrim 10ml", qtd: 21, receita: 648.90, markup: 83.50, categoria: "Óleos Essenciais" },
    { rank: 8, sku: "05090", nome: "Óleo Essencial Olíbano 10ml", qtd: 6, receita: 647.40, markup: 77.95, categoria: "Óleos Essenciais" },
    { rank: 9, sku: "00177", nome: "Óleo de Mamona (Rícino) 1L", qtd: 4, receita: 603.60, markup: 75.37, categoria: "Óleos Vegetais" },
    { rank: 10, sku: "06892", nome: "Óleo Essencial Jambu 5ml", qtd: 1, receita: 535.90, markup: 100.0, categoria: "Óleos Essenciais" }
  ],

  // ==========================================
  // TOP CLIENTES
  // ==========================================
  topClientes: [
    { nome: "Consumidor Final", valor: 47836.35, produtos: 1076, tipo: "B2C", loja: "Shopify" },
    { nome: "ALZIRA DE BRITO GONCALVES", valor: 2901.57, produtos: 8, tipo: "B2B", loja: "Shopify", telefone: "92981228735" },
    { nome: "Murilo Tulio", valor: 2448.70, produtos: 3, tipo: "B2C", loja: "Shopify", telefone: "67998552921" },
    { nome: "Hélio Henrique Silva Oliveira", valor: 1975.60, produtos: 13, tipo: "B2C", loja: "Shopify", telefone: "61981595661" },
    { nome: "Israel Almeida de Brito Gonçalves", valor: 1836.17, produtos: 17, tipo: "B2C", loja: "Shopify" },
    { nome: "Farmacia de manipulação Pharmacorum", valor: 1345.00, produtos: 10, tipo: "B2B", loja: "Shopify", telefone: "11976009" },
    { nome: "Neusa de Sousa Leonardo", valor: 1098.98, produtos: 5, tipo: "B2C", loja: "Shopify" },
    { nome: "Andrea Coelho de Sousa", valor: 1029.25, produtos: 9, tipo: "B2C", loja: "Shopify", telefone: "6192586617" },
    { nome: "Sara costa de Souza Giotti", valor: 934.70, produtos: 8, tipo: "B2C", loja: "Shopify" },
    { nome: "Luciano de paula costa da Silva", valor: 840.47, produtos: 3, tipo: "B2C", loja: "Shopify" }
  ],

  // ==========================================
  // FORNECEDORES CADASTRADOS
  // ==========================================
  fornecedores: [
    { nome: "Via Aroma", cidade: "Porto Alegre", uf: "RS", tipo: "Óleos Essenciais", cnpj: "04.612.952/0002-06" },
    { nome: "Laszlo", cidade: "Belo Horizonte", uf: "MG", tipo: "Aromaterapia", cnpj: "07.997.093/0001-10" },
    { nome: "Terra Flor (Cerrado Essencial)", cidade: "Brasília", uf: "DF", tipo: "Óleos Essenciais", cnpj: "34.210.851/0001-80" },
    { nome: "BioEssência (Florananda)", cidade: "Jaú", uf: "SP", tipo: "Cosméticos Naturais", cnpj: "08.599.269/0001-48" },
    { nome: "Arte dos Aromas", cidade: "Diadema", uf: "SP", tipo: "Óleos/Aromas", cnpj: "00.005.459/0001-88" },
    { nome: "EBPM Comercial", cidade: "São Paulo", uf: "SP", tipo: "Embalagens", cnpj: "59.258.863/0001-06" },
    { nome: "By Samia", cidade: "São Paulo", uf: "SP", tipo: "Aromaterapia", cnpj: null },
    { nome: "Quinari", cidade: "São Paulo", uf: "SP", tipo: "Fragrâncias", cnpj: null },
    { nome: "Natural Link", cidade: "São Paulo", uf: "SP", tipo: "Cosméticos", cnpj: null },
    { nome: "Qualicoco", cidade: "São Paulo", uf: "SP", tipo: "Óleos de Coco", cnpj: null }
  ],

  // ==========================================
  // ALERTAS E DIAGNÓSTICOS
  // ==========================================
  alertas: [
    {
      tipo: "critico",
      titulo: "Déficit Operacional",
      descricao: "Empresa opera com prejuízo de R$ 28.467/mês",
      impacto: "Dependência de aportes de sócios para sobreviver",
      acao: "Reduzir custos fixos e aumentar receita"
    },
    {
      tipo: "critico",
      titulo: "Marketing Caro",
      descricao: "Webi Marketing: R$ 8.850/mês = 20% da receita",
      impacto: "Custo fixo alto sem resultado proporcional",
      acao: "Renegociar para modelo success fee ou trocar"
    },
    {
      tipo: "critico",
      titulo: "Dívidas Elevadas",
      descricao: "Empréstimo + Cartão = R$ 13.346/mês (30% receita)",
      impacto: "Compromete fluxo de caixa",
      acao: "Refinanciar para parcelas menores"
    },
    {
      tipo: "alto",
      titulo: "Queda de Receita",
      descricao: "Receita caiu 38% (Fev → Mar)",
      impacto: "De R$ 70.923 para R$ 43.890",
      acao: "Reativar base de clientes + campanhas"
    },
    {
      tipo: "alto",
      titulo: "Dependência de Canal",
      descricao: "Shopify representa 99,2% das vendas",
      impacto: "Risco de paralisação total",
      acao: "Diversificar para ML, WhatsApp, B2B"
    },
    {
      tipo: "medio",
      titulo: "Concentração Regional",
      descricao: "DF representa 42% dos pedidos",
      impacto: "Dependência de mercado local",
      acao: "Expandir para SP, MG, RJ"
    },
    {
      tipo: "positivo",
      titulo: "Markup Saudável",
      descricao: "Markup médio de 77,3%",
      impacto: "Boa margem por produto",
      acao: "Manter estratégia de precificação"
    },
    {
      tipo: "positivo",
      titulo: "Base de Clientes Grande",
      descricao: "49.000 clientes cadastrados, 44% recompra",
      impacto: "Ativo subexplorado",
      acao: "Campanhas de reativação (custo zero)"
    }
  ],

  // ==========================================
  // METAS E PLANO 90 DIAS
  // ==========================================
  metas: {
    fase1: {
      nome: "CRM + CRO",
      periodo: "Dias 1-30",
      objetivo: "Recuperar receita com base existente",
      kpis: [
        { metrica: "Taxa conversão site", atual: 1.8, meta: 2.5 },
        { metrica: "Reativação base", atual: 0, meta: 2000 },
        { metrica: "Negociações fechadas CRM", atual: 35, meta: 60 }
      ]
    },
    fase2: {
      nome: "B2B + Portfólio",
      periodo: "Dias 31-60",
      objetivo: "Expandir para clientes B2B",
      kpis: [
        { metrica: "Novos clientes B2B", atual: 2, meta: 10 },
        { metrica: "Ticket médio B2B", atual: 1345, meta: 2500 },
        { metrica: "Receita B2B", atual: 4246, meta: 25000 }
      ]
    },
    fase3: {
      nome: "Escala",
      periodo: "Dias 61-90",
      objetivo: "Crescimento sustentável",
      kpis: [
        { metrica: "Receita total", atual: 43890, meta: 90000 },
        { metrica: "Breakeven", atual: false, meta: true },
        { metrica: "Canais ativos", atual: 3, meta: 5 }
      ]
    }
  },

  // ==========================================
  // TAREFAS PENDENTES
  // ==========================================
  tarefas: [
    { id: 1, texto: "Extratos bancários (PDF ou CSV)", prioridade: "alta", status: "concluido" },
    { id: 2, texto: "Relatórios Bling - Faturamento", prioridade: "alta", status: "concluido" },
    { id: 3, texto: "Relatórios Bling - Estoque", prioridade: "media", status: "concluido" },
    { id: 4, texto: "Planilha custos operacionais", prioridade: "alta", status: "concluido" },
    { id: 5, texto: "Export RD Station - Negociações", prioridade: "alta", status: "pendente" },
    { id: 6, texto: "Relatório Shopify - Conversão", prioridade: "alta", status: "concluido" },
    { id: 7, texto: "Lista de fornecedores", prioridade: "baixa", status: "concluido" },
    { id: 8, texto: "Export RD Station - Base contatos", prioridade: "media", status: "pendente" },
    { id: 9, texto: "Relatório Shopify - Carrinho abandonado", prioridade: "media", status: "pendente" },
    { id: 10, texto: "Custos de embalagem detalhado", prioridade: "baixa", status: "pendente" }
  ]
};

// Helper para formatar moeda
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

// Helper para calcular variação percentual
export const calcVariacao = (atual, anterior) => {
  return ((atual - anterior) / anterior * 100).toFixed(1);
};

export default dadosMdO;
