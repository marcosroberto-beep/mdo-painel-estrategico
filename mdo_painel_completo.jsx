import React, { useState, useMemo } from 'react';

/**
 * MUNDO DOS ÓLEOS - PAINEL ESTRATÉGICO DE CONSULTORIA
 * Versão: 2.0 - Integrado com dados financeiros reais
 * Data: 21/03/2026
 * 
 * Para usar no Claude Code:
 * 1. Cole este arquivo inteiro
 * 2. Renderize com: <App />
 */

// ==========================================
// DADOS CONSOLIDADOS
// ==========================================
const DADOS = {
  empresa: {
    razaoSocial: "MOL COMERCIO VAR DE PROD NAT LTD",
    nomeFantasia: "Mundo dos Óleos",
    cnpj: "33.460.511/0001-45",
    endereco: "CLSW 504, Bl. B, Lj. 46 - Brasília/DF",
    banco: { nome: "CEF", agencia: "01502", conta: "000578237293-8" },
    equipe: 3,
    anosOperacao: 20,
    totalSKUs: 3000,
    baseClientes: 49000,
    taxaRecompra: 44
  },

  // Fluxo de Caixa - Extratos Bancários
  fluxoCaixa: {
    periodoAtual: "MAR/2026 (01-21)",
    saldoInicial: 25829.68,
    saldoFinal: 5896.21,
    variacao: -19933.47,
    historico: [
      { mes: "DEZ/25", saldoInicial: 1904.63, saldoFinal: 23440.83, variacao: 21536.20, aportes: 61570.21 },
      { mes: "JAN/26", saldoInicial: 23440.83, saldoFinal: 27653.69, variacao: 4212.86, aportes: 41125.51 },
      { mes: "FEV/26", receita: 70923.25, pedidos: 370, ticket: 191.68 },
      { mes: "MAR/26", saldoInicial: 25829.68, saldoFinal: 5896.21, variacao: -19933.47, aportes: 15593.17, receita: 43890.65, pedidos: 264, ticket: 166.25 }
    ]
  },

  // Receitas Março
  receita: {
    bruta: 43890.65,
    pedidos: 264,
    ticketMedio: 166.25,
    cmv: 9977.58,
    lucroBruto: 33913.07,
    markup: 77.3
  },

  // Comparativo com mês anterior
  comparativo: {
    receitaAnterior: 70923.25,
    receitaAtual: 43890.65,
    variacaoReceita: -38.1,
    pedidosAnterior: 370,
    pedidosAtual: 264,
    variacaoPedidos: -28.6,
    ticketAnterior: 191.68,
    ticketAtual: 166.25,
    variacaoTicket: -13.3
  },

  // Estrutura de Custos (do extrato bancário)
  custos: {
    fixos: [
      { categoria: "Marketing", item: "Webi Marketing Digital", valor: 8850.00, percent: 20.2, criticidade: "alta" },
      { categoria: "Tecnologia", item: "RD Station", valor: 6072.01, percent: 13.8, criticidade: "media" },
      { categoria: "Ocupação", item: "Aluguel + Condomínio", valor: 3724.23, percent: 8.5, criticidade: "baixa" },
      { categoria: "Administrativo", item: "Contabilidade", valor: 1150.00, percent: 2.6, criticidade: "baixa" },
      { categoria: "Utilities", item: "Energia/Água/Tel", valor: 773.43, percent: 1.8, criticidade: "baixa" }
    ],
    totalFixo: 20569.67,

    variaveis: [
      { fornecedor: "EBPM Comercial", tipo: "Embalagens", valor: 10338.98 },
      { fornecedor: "Sta Efigênia", tipo: "Matéria-prima", valor: 2895.97 },
      { fornecedor: "Via Aroma", tipo: "Óleos Essenciais", valor: 2241.54 },
      { fornecedor: "Correios", tipo: "Frete", valor: 4859.05 },
      { fornecedor: "Outros", tipo: "Diversos", valor: 1126.73 }
    ],
    totalVariavel: 21462.27,

    financeiras: [
      { item: "Empréstimo SIEMP", valor: 5365.30, tipo: "debito_auto" },
      { item: "Cartão CAIXA VISA", valor: 7980.58, tipo: "fatura" },
      { item: "Tarifas bancárias", valor: 268.96, tipo: "tarifas" }
    ],
    totalFinanceiro: 13614.84,

    impostos: 6716.13
  },

  // DRE Simplificado
  dre: {
    receitaBruta: 43890.65,
    impostos: -6716.13,
    receitaLiquida: 37174.52,
    cmv: -16462.27,
    lucroBruto: 20712.25,
    despesasOp: {
      marketing: -15780.52,
      ocupacao: -4089.15,
      logistica: -7273.63,
      pessoal: -6999.18,
      financeiras: -13614.84,
      outras: -1420.73
    },
    resultado: -28466.80
  },

  // Canais de Venda
  canais: {
    atuais: [
      { canal: "Shopify", pedidos: 257, receita: 43535.67, percent: 99.2, ticket: 169.44 },
      { canal: "Mercado Livre", pedidos: 6, receita: 249.63, percent: 0.6, ticket: 41.61 },
      { canal: "TikTok Shop", pedidos: 1, receita: 105.35, percent: 0.2, ticket: 105.35 }
    ],
    b2b: [
      { canal: "Farmácias de Manipulação", potencial: "alto", ticketEst: 2500, freq: "quinzenal", produtos: "Óleos vegetais granel, Extratos", estrategia: "Prospecção + kit amostras", clienteRef: "Pharmacorum (R$ 1.345)" },
      { canal: "Clínicas de Estética", potencial: "alto", ticketEst: 1800, freq: "mensal", produtos: "Rosa Mosqueta, Jojoba, Massagem", estrategia: "Parceria + desconto profissional", clienteRef: null },
      { canal: "SPAs e Day SPAs", potencial: "medio", ticketEst: 1200, freq: "mensal", produtos: "Óleos essenciais, Blends", estrategia: "Degustação + fidelidade", clienteRef: null },
      { canal: "Lojas Naturais", potencial: "medio", ticketEst: 3500, freq: "quinzenal", produtos: "Linha completa revenda", estrategia: "Atacado margem 30%", clienteRef: null },
      { canal: "Salões de Beleza", potencial: "medio", ticketEst: 800, freq: "mensal", produtos: "Óleos capilares, Argan", estrategia: "Representante regional", clienteRef: null },
      { canal: "Indústria Cosmética", potencial: "alto", ticketEst: 8000, freq: "mensal", produtos: "Óleos 5L/20L, B2B2C", estrategia: "Contrato + escala de preço", clienteRef: null },
      { canal: "Terapeutas/Aromaterautas", potencial: "medio", ticketEst: 500, freq: "mensal", produtos: "Óleos essenciais, Kits", estrategia: "Certificação + desconto", clienteRef: null },
      { canal: "Academias/Studios", potencial: "baixo", ticketEst: 600, freq: "bimestral", produtos: "Óleos relaxantes", estrategia: "Parceria pós-treino", clienteRef: null }
    ]
  },

  // Regiões
  regioes: [
    { uf: "DF", pedidos: 331, receita: 117584.15, percent: 42.0 },
    { uf: "SP", pedidos: 160, receita: 38522.12, percent: 20.3 },
    { uf: "AM", pedidos: 13, receita: 12982.11, percent: 1.6 },
    { uf: "MG", pedidos: 49, receita: 11736.20, percent: 6.2 },
    { uf: "RJ", pedidos: 41, receita: 10186.63, percent: 5.2 }
  ],

  // Top Produtos
  topProdutos: [
    { sku: "08488", nome: "Blend Facial 60ml", qtd: 14, receita: 1398.60, markup: 100.0 },
    { sku: "05091", nome: "Óleo Essencial Lavanda MB 10ml", qtd: 17, receita: 882.30, markup: 78.0 },
    { sku: "00500", nome: "Óleo Semente de Uva 5L", qtd: 2, receita: 807.80, markup: 71.9 },
    { sku: "05074", nome: "Óleo Essencial Gerânio 10ml", qtd: 7, receita: 741.30, markup: 77.8 },
    { sku: "00205", nome: "Óleo de Jojoba 1L", qtd: 2, receita: 725.80, markup: 78.2 }
  ],

  // Top Clientes
  topClientes: [
    { nome: "ALZIRA DE BRITO GONCALVES", valor: 2901.57, tipo: "B2B" },
    { nome: "Murilo Tulio", valor: 2448.70, tipo: "B2C" },
    { nome: "Hélio Henrique Silva Oliveira", valor: 1975.60, tipo: "B2C" },
    { nome: "Farmacia Pharmacorum", valor: 1345.00, tipo: "B2B" },
    { nome: "Neusa de Sousa Leonardo", valor: 1098.98, tipo: "B2C" }
  ],

  // Alertas
  alertas: [
    { tipo: "critico", titulo: "Déficit Operacional", desc: "Prejuízo de R$ 28.467/mês", acao: "Reduzir custos + aumentar receita" },
    { tipo: "critico", titulo: "Marketing Caro", desc: "Webi: R$ 8.850/mês = 20% receita", acao: "Renegociar para success fee" },
    { tipo: "critico", titulo: "Dívidas Elevadas", desc: "R$ 13.346/mês = 30% receita", acao: "Refinanciar parcelas menores" },
    { tipo: "alto", titulo: "Queda de Receita", desc: "Receita caiu 38% vs Fev", acao: "Reativar base + campanhas" },
    { tipo: "medio", titulo: "Dependência Shopify", desc: "99,2% das vendas", acao: "Diversificar canais" },
    { tipo: "positivo", titulo: "Markup Saudável", desc: "77,3% médio", acao: "Manter precificação" },
    { tipo: "positivo", titulo: "Base Grande", desc: "49K clientes, 44% recompra", acao: "Campanhas reativação" }
  ],

  // Aportes de Sócios
  aportes: {
    total4Meses: 118288.89,
    detalhes: [
      { mes: "DEZ/25", valor: 61570.21 },
      { mes: "JAN/26", valor: 41125.51 },
      { mes: "MAR/26", valor: 15593.17 }
    ]
  }
};

// ==========================================
// HELPERS
// ==========================================
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatPercent = (value) => {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
};

// ==========================================
// COMPONENTES
// ==========================================

// Card KPI
const KPICard = ({ label, value, subvalue, trend, color = "gray", onClick }) => {
  const colors = {
    green: "bg-green-50 border-green-200",
    red: "bg-red-50 border-red-200",
    orange: "bg-orange-50 border-orange-200",
    gray: "bg-white border-gray-200"
  };
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500"
  };

  return (
    <div 
      className={`rounded-xl p-4 border ${colors[color]} ${onClick ? 'cursor-pointer hover:shadow-md transition' : ''}`}
      onClick={onClick}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      {subvalue && (
        <p className={`text-sm mt-1 ${trendColors[trend] || 'text-gray-500'}`}>
          {subvalue}
        </p>
      )}
    </div>
  );
};

// Barra de Progresso
const ProgressBar = ({ value, max, color = "green", label, showPercent = true }) => {
  const percent = Math.min((value / max) * 100, 100);
  const colors = {
    green: "bg-green-500",
    red: "bg-red-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500"
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        {showPercent && <span className="text-gray-500">{percent.toFixed(1)}%</span>}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

// Badge de Status
const Badge = ({ type, children }) => {
  const styles = {
    critico: "bg-red-100 text-red-700 border-red-200",
    alto: "bg-orange-100 text-orange-700 border-orange-200",
    medio: "bg-yellow-100 text-yellow-700 border-yellow-200",
    baixo: "bg-gray-100 text-gray-600 border-gray-200",
    positivo: "bg-green-100 text-green-700 border-green-200"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[type] || styles.baixo}`}>
      {children}
    </span>
  );
};

// Gráfico de Barras Simples (CSS)
const BarChart = ({ data, labelKey, valueKey, maxValue, color = "green" }) => {
  const max = maxValue || Math.max(...data.map(d => d[valueKey]));
  const colors = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    orange: "bg-orange-500"
  };

  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-24 text-sm text-gray-600 truncate">{item[labelKey]}</span>
          <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
            <div 
              className={`h-full ${colors[color]} flex items-center justify-end pr-2`}
              style={{ width: `${(item[valueKey] / max) * 100}%` }}
            >
              <span className="text-xs text-white font-medium">
                {formatCurrency(item[valueKey])}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Gráfico de Pizza (CSS)
const PieChart = ({ data, size = 120 }) => {
  let cumulative = 0;
  const colors = ['#22c55e', '#3b82f6', '#f97316', '#eab308', '#8b5cf6', '#ec4899'];
  
  const segments = data.map((item, i) => {
    const start = cumulative;
    cumulative += item.percent;
    return {
      ...item,
      color: colors[i % colors.length],
      start,
      end: cumulative
    };
  });

  const gradientStr = segments.map(s => 
    `${s.color} ${s.start}% ${s.end}%`
  ).join(', ');

  return (
    <div className="flex items-center gap-4">
      <div 
        className="rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${gradientStr})`
        }}
      />
      <div className="space-y-1">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ background: s.color }} />
            <span className="text-gray-600">{s.canal || s.categoria}: {s.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// SEÇÕES DO PAINEL
// ==========================================

// Dashboard Principal
const DashboardSection = () => {
  return (
    <div className="space-y-6">
      {/* Alerta de Déficit */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800">Alerta: Déficit Operacional</h3>
            <p className="text-red-700 text-sm mt-1">
              A empresa opera com prejuízo de <strong>{formatCurrency(Math.abs(DADOS.dre.resultado))}/mês</strong>. 
              Saldo caiu de {formatCurrency(DADOS.fluxoCaixa.saldoInicial)} para {formatCurrency(DADOS.fluxoCaixa.saldoFinal)} em 21 dias.
            </p>
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">KPIs do Período</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard 
            label="Receita Bruta" 
            value={formatCurrency(DADOS.receita.bruta)}
            subvalue={`${formatPercent(DADOS.comparativo.variacaoReceita)} vs Fev`}
            trend="down"
            color="red"
          />
          <KPICard 
            label="Pedidos" 
            value={DADOS.receita.pedidos}
            subvalue={`${formatPercent(DADOS.comparativo.variacaoPedidos)} vs Fev`}
            trend="down"
          />
          <KPICard 
            label="Ticket Médio" 
            value={formatCurrency(DADOS.receita.ticketMedio)}
            subvalue={`${formatPercent(DADOS.comparativo.variacaoTicket)} vs Fev`}
            trend="down"
          />
          <KPICard 
            label="Markup" 
            value={`${DADOS.receita.markup}%`}
            subvalue="Saudável"
            trend="up"
            color="green"
          />
        </div>
      </div>

      {/* Indicador de Dependência de Aportes */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-orange-800">Dependência de Aportes de Sócios</h3>
          <Badge type="alto">Alto Risco</Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          {DADOS.aportes.detalhes.map((a, i) => (
            <div key={i}>
              <p className="text-xs text-orange-600">{a.mes}</p>
              <p className="text-lg font-bold text-orange-800">{formatCurrency(a.valor)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-orange-200 text-center">
          <p className="text-sm text-orange-700">Total últimos 4 meses: <strong>{formatCurrency(DADOS.aportes.total4Meses)}</strong></p>
          <p className="text-xs text-orange-600 mt-1">⚠️ Operação não se sustenta sozinha</p>
        </div>
      </div>

      {/* Comparativo Receita x Despesa */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Receita vs Despesa (Março)</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Entradas</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(DADOS.receita.bruta)}</p>
              <div className="h-4 bg-green-500 rounded mt-2" style={{ width: '100%' }} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Saídas</p>
              <p className="text-3xl font-bold text-red-600">{formatCurrency(DADOS.custos.totalFixo + DADOS.custos.totalVariavel + DADOS.custos.totalFinanceiro + DADOS.custos.impostos)}</p>
              <div className="h-4 bg-red-500 rounded mt-2" style={{ width: `${((DADOS.custos.totalFixo + DADOS.custos.totalVariavel + DADOS.custos.totalFinanceiro + DADOS.custos.impostos) / DADOS.receita.bruta) * 100}%` }} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">Resultado Operacional</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(DADOS.dre.resultado)}</p>
          </div>
        </div>
      </div>

      {/* Snapshot do Negócio */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Snapshot do Negócio</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard label="SKUs ativos" value="3.000+" />
          <KPICard label="Base de clientes" value="~49K" />
          <KPICard label="Taxa recompra" value="44%" color="green" />
          <KPICard label="Anos no mercado" value="20+" />
        </div>
      </div>
    </div>
  );
};

// Seção Fluxo de Caixa
const FluxoCaixaSection = () => {
  return (
    <div className="space-y-6">
      {/* Evolução do Saldo */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Evolução do Saldo Bancário</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Período</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Saldo Inicial</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Saldo Final</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Variação</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Aportes Sócios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DADOS.fluxoCaixa.historico.filter(h => h.saldoInicial).map((h, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{h.mes}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(h.saldoInicial)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(h.saldoFinal)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${h.variacao >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {h.variacao >= 0 ? '+' : ''}{formatCurrency(h.variacao)}
                  </td>
                  <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(h.aportes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gráfico de Despesas por Categoria */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Despesas por Categoria</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Custos Fixos */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Custos Fixos ({formatCurrency(DADOS.custos.totalFixo)})</h3>
              {DADOS.custos.fixos.map((c, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{c.item}</span>
                    <span className={`font-medium ${c.criticidade === 'alta' ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatCurrency(c.valor)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${c.criticidade === 'alta' ? 'bg-red-500' : c.criticidade === 'media' ? 'bg-orange-400' : 'bg-blue-400'}`}
                      style={{ width: `${(c.valor / DADOS.custos.fixos[0].valor) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Custos Variáveis */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Fornecedores/CMV ({formatCurrency(DADOS.custos.totalVariavel)})</h3>
              {DADOS.custos.variaveis.map((c, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{c.fornecedor}</span>
                    <span className="font-medium text-gray-700">{formatCurrency(c.valor)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400"
                      style={{ width: `${(c.valor / DADOS.custos.variaveis[0].valor) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Despesas Financeiras */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-red-700 mb-3">⚠️ Despesas Financeiras ({formatCurrency(DADOS.custos.totalFinanceiro)})</h3>
            <div className="grid grid-cols-3 gap-4">
              {DADOS.custos.financeiras.map((f, i) => (
                <div key={i} className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-600">{f.item}</p>
                  <p className="text-lg font-bold text-red-700">{formatCurrency(f.valor)}</p>
                  <p className="text-xs text-red-500">{f.tipo === 'debito_auto' ? 'Débito automático' : f.tipo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRE Simplificado */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">DRE Simplificado - Março/2026</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Receita Bruta</span>
              <span className="font-medium">{formatCurrency(DADOS.dre.receitaBruta)}</span>
            </div>
            <div className="flex justify-between py-2 text-red-600">
              <span>(-) Impostos s/ Vendas</span>
              <span>{formatCurrency(DADOS.dre.impostos)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
              <span>= Receita Líquida</span>
              <span>{formatCurrency(DADOS.dre.receitaLiquida)}</span>
            </div>
            <div className="flex justify-between py-2 text-red-600">
              <span>(-) CMV</span>
              <span>{formatCurrency(DADOS.dre.cmv)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-200 font-medium text-green-600">
              <span>= Lucro Bruto</span>
              <span>{formatCurrency(DADOS.dre.lucroBruto)}</span>
            </div>
            {Object.entries(DADOS.dre.despesasOp).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1 text-sm text-red-500">
                <span className="pl-4">(-) {key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span>{formatCurrency(val)}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
              <span>= RESULTADO</span>
              <span className={DADOS.dre.resultado >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(DADOS.dre.resultado)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seção Canais B2B
const CanaisB2BSection = () => {
  const [selectedCanal, setSelectedCanal] = useState(null);

  return (
    <div className="space-y-6">
      {/* Canais Atuais */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Canais Atuais de Venda</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {DADOS.canais.atuais.map((c, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-700">{c.canal}</span>
                    <span className="text-gray-600">{c.percent}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${i === 0 ? 'bg-green-500' : 'bg-blue-400'}`}
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{c.pedidos} pedidos</span>
                    <span>{formatCurrency(c.receita)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-red-600 font-medium mb-2">⚠️ Dependência Crítica</p>
                <p className="text-4xl font-bold text-red-600">99,2%</p>
                <p className="text-gray-500">das vendas via Shopify</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canais B2B Potenciais */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Canais B2B Potenciais para Análise</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {DADOS.canais.b2b.map((canal, i) => (
            <div 
              key={i}
              className={`bg-white rounded-xl border p-4 cursor-pointer transition ${
                selectedCanal === i ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCanal(selectedCanal === i ? null : i)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{canal.canal}</h3>
                <Badge type={canal.potencial === 'alto' ? 'positivo' : canal.potencial === 'medio' ? 'medio' : 'baixo'}>
                  {canal.potencial}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Ticket estimado</p>
                  <p className="font-medium text-green-600">{formatCurrency(canal.ticketEst)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Frequência</p>
                  <p className="font-medium text-gray-700">{canal.freq}</p>
                </div>
              </div>

              {selectedCanal === i && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Produtos foco</p>
                    <p className="text-sm text-gray-700">{canal.produtos}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estratégia sugerida</p>
                    <p className="text-sm text-gray-700">{canal.estrategia}</p>
                  </div>
                  {canal.clienteRef && (
                    <div className="bg-green-50 rounded p-2 mt-2">
                      <p className="text-xs text-green-600">Cliente referência: {canal.clienteRef}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projeção B2B */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-semibold text-green-800 mb-3">📈 Projeção de Receita B2B</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-green-600">Ticket médio B2B</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(2200)}</p>
          </div>
          <div>
            <p className="text-sm text-green-600">Meta clientes Ano 1</p>
            <p className="text-2xl font-bold text-green-700">50</p>
          </div>
          <div>
            <p className="text-sm text-green-600">Receita potencial/mês</p>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(45000)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Seção Alertas e Insights
const AlertasSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Alertas e Diagnósticos</h2>
      
      {/* Alertas Críticos */}
      <div className="space-y-3">
        {DADOS.alertas.filter(a => a.tipo === 'critico').map((alerta, i) => (
          <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔴</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-red-800">{alerta.titulo}</h3>
                  <Badge type="critico">Crítico</Badge>
                </div>
                <p className="text-red-700 text-sm mt-1">{alerta.desc}</p>
                <p className="text-red-600 text-sm mt-2 font-medium">→ Ação: {alerta.acao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas Altos */}
      <div className="space-y-3">
        {DADOS.alertas.filter(a => a.tipo === 'alto').map((alerta, i) => (
          <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🟠</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-orange-800">{alerta.titulo}</h3>
                  <Badge type="alto">Alto</Badge>
                </div>
                <p className="text-orange-700 text-sm mt-1">{alerta.desc}</p>
                <p className="text-orange-600 text-sm mt-2 font-medium">→ Ação: {alerta.acao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas Positivos */}
      <div className="space-y-3">
        {DADOS.alertas.filter(a => a.tipo === 'positivo').map((alerta, i) => (
          <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">🟢</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-green-800">{alerta.titulo}</h3>
                  <Badge type="positivo">Positivo</Badge>
                </div>
                <p className="text-green-700 text-sm mt-1">{alerta.desc}</p>
                <p className="text-green-600 text-sm mt-2 font-medium">→ Ação: {alerta.acao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plano de Ação Resumido */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-3">📋 Plano de Ação Prioritário</h3>
        <div className="space-y-2">
          {[
            { num: 1, acao: "Renegociar contrato Webi (success fee)", impacto: "Economia de R$ 5-6K/mês" },
            { num: 2, acao: "Refinanciar dívidas (SIEMP + Cartão)", impacto: "Reduzir R$ 8K/mês → R$ 3K/mês" },
            { num: 3, acao: "Campanha reativação base 49K", impacto: "Recuperar 10% = R$ 20K receita" },
            { num: 4, acao: "Prospecção 10 farmácias B2B", impacto: "Adicionar R$ 25K/mês" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-medium">
                {item.num}
              </span>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{item.acao}</p>
                <p className="text-xs text-blue-600">{item.impacto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Seção Produtos e Clientes
const ProdutosClientesSection = () => {
  return (
    <div className="space-y-6">
      {/* Top Produtos */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top 5 Produtos por Receita</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Produto</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Qtd</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Receita</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Markup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DADOS.topProdutos.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-800">{p.nome}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.qtd}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(p.receita)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${p.markup >= 90 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.markup}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Clientes */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Top 5 Clientes por Valor</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cliente</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Valor</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DADOS.topClientes.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{c.nome}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(c.valor)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${c.tipo === 'B2B' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Por Região */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Vendas por Estado</h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {DADOS.regioes.map((r, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{r.uf}</span>
                <span className="text-gray-600">{r.pedidos} pedidos • {formatCurrency(r.receita)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${r.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// APP PRINCIPAL
// ==========================================
const PASSWORD = 'MdO2024@estrategia';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'fluxo', label: 'Fluxo de Caixa', icon: '💰' },
    { id: 'b2b', label: 'Canais B2B', icon: '🏢' },
    { id: 'alertas', label: 'Alertas', icon: '⚠️' },
    { id: 'produtos', label: 'Produtos', icon: '📦' }
  ];

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xl font-bold">
              MdO
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">Mundo dos Óleos</h1>
          <p className="text-center text-gray-500 mb-6">Painel Estratégico de Consultoria</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha de acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Digite a senha"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Entrar
            </button>
          </form>
          
          <p className="text-center text-xs text-gray-400 mt-6">Consultoria Estratégica 90 dias • Março 2026</p>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
              MdO
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">Mundo dos Óleos</h1>
              <p className="text-xs text-gray-500">Painel Estratégico • {DADOS.fluxoCaixa.periodoAtual}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${DADOS.dre.resultado < 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {DADOS.dre.resultado < 0 ? '⚠️ Déficit' : '✓ Lucro'}: {formatCurrency(DADOS.dre.resultado)}
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex gap-1 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                  activeSection === section.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'fluxo' && <FluxoCaixaSection />}
        {activeSection === 'b2b' && <CanaisB2BSection />}
        {activeSection === 'alertas' && <AlertasSection />}
        {activeSection === 'produtos' && <ProdutosClientesSection />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400">
          Consultoria Estratégica 90 dias • Dados atualizados em 21/03/2026 • {DADOS.empresa.nomeFantasia}
        </div>
      </footer>
    </div>
  );
};

export default App;
