import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { DADOS } from '../data/constants';
import { formatCurrency, formatNumber } from '../lib/formatters';
import SectionCard from '../components/ui/SectionCard';
import KPICard from '../components/ui/KPICard';
import Badge from '../components/ui/Badge';
import DateRangePicker from '../components/ui/DateRangePicker';

/* ─── Fallback CRM data ─── */
const CRM_FALLBACK = {
  total_criadas: 284,
  total_vendidas: 132,
  total_perdidas: 266,
  valor_vendido: 58935,
  valor_perdido: 169000,
  valor_pipeline: 47500,
  ticket_medio: 447,
  ciclo_medio_dias: 12,
  win_rate: 33.2,
  funil_stages: [
    { stage_name: 'Qualificacao', stage_order: 1, deals_count: 45, valor: 22500 },
    { stage_name: 'Proposta', stage_order: 2, deals_count: 28, valor: 14000 },
    { stage_name: 'Negociacao', stage_order: 3, deals_count: 15, valor: 11000 },
    { stage_name: 'Fechamento', stage_order: 4, deals_count: 8, valor: 6400 },
  ],
  perdas_por_motivo: [
    { motivo: 'Preco', qtd: 89, valor: 56430 },
    { motivo: 'Sem resposta', qtd: 72, valor: 45360 },
    { motivo: 'Concorrente', qtd: 48, valor: 30240 },
    { motivo: 'Sem interesse', qtd: 33, valor: 20790 },
    { motivo: 'Outros', qtd: 24, valor: 16180 },
  ],
  por_vendedor: [
    { user_name: 'Arnaldo', total_deals: 184, vendidas: 88, perdidas: 96, win_rate: 47.8, receita: 39336, ciclo_medio: 10 },
    { user_name: 'Equipe Online', total_deals: 100, vendidas: 44, perdidas: 170, win_rate: 20.6, receita: 19599, ciclo_medio: 15 },
  ],
  evolucao_mensal: [
    { mes: '2025-12', criadas: 62, vendidas: 28, receita: 12516 },
    { mes: '2026-01', criadas: 78, vendidas: 38, receita: 16986 },
    { mes: '2026-02', criadas: 85, vendidas: 42, receita: 18774 },
    { mes: '2026-03', criadas: 59, vendidas: 24, receita: 10728 },
  ],
  total_contatos: 49088,
  contatos_com_deal: 682,
  top_contatos: [
    { contact_name: 'Alzira B. Goncalves', contact_email: 'alzira@email.com', deals: 3, valor: 2901 },
    { contact_name: 'Farmacia Pharmacorum', contact_email: 'contato@pharmacorum.com', deals: 2, valor: 1345 },
    { contact_name: 'Murilo Tulio', contact_email: 'murilo@email.com', deals: 2, valor: 2448 },
  ],
  por_source: [
    { source: 'Shopify', qtd: 157 },
    { source: 'WhatsApp', qtd: 68 },
    { source: 'Indicacao', qtd: 34 },
    { source: 'Instagram', qtd: 25 },
  ],
  total_tarefas: 45,
  tarefas_abertas: 18,
  tarefas_atrasadas: 7,
  taxa_conclusao: 60,
  top_perdidos: [
    { name: 'Kit Oleos Granel 20L', amount: 8500, contact_name: 'Industria Nova', loss_reason: 'Preco', closed_at: '2026-03-10' },
    { name: 'Revenda Atacado SP', amount: 6200, contact_name: 'Loja Natural SP', loss_reason: 'Concorrente', closed_at: '2026-03-08' },
    { name: 'Pedido Aromaterapia', amount: 4800, contact_name: 'SPA Brasilia', loss_reason: 'Sem resposta', closed_at: '2026-03-05' },
  ],
};

const BREAKEVEN = DADOS.custos.totalFixo + DADOS.custos.totalVariavel +
  DADOS.custos.totalFinanceiro + DADOS.custos.impostos;

/* ═══════════════════════════════════════════ */
/* 1. KPIs DO PIPELINE                        */
/* ═══════════════════════════════════════════ */
function KPIsPipeline({ d }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard label="Negocios Criados" value={formatNumber(d.total_criadas)} subvalue="No periodo" color="blue" />
      <KPICard label="Vendidos" value={formatNumber(d.total_vendidas)} subvalue={formatCurrency(d.valor_vendido)} trend="up" color="green" />
      <KPICard label="Perdidos" value={formatNumber(d.total_perdidas)} subvalue={formatCurrency(d.valor_perdido)} trend="down" color="red" />
      <KPICard label="Win Rate" value={`${d.win_rate}%`} subvalue={`${d.total_vendidas} de ${d.total_vendidas + d.total_perdidas} fechados`} color={d.win_rate >= 40 ? 'green' : d.win_rate >= 25 ? 'orange' : 'red'} />
      <KPICard label="Ciclo Medio" value={`${Math.round(d.ciclo_medio_dias)}d`} subvalue="Criacao a fechamento" color="blue" />
      <KPICard label="Pipeline Aberto" value={formatCurrency(d.valor_pipeline)} subvalue="Valor em aberto" color="orange" />
      <KPICard label="Ticket CRM" value={formatCurrency(d.ticket_medio)} subvalue={`vs Site ${formatCurrency(177)}`} color="green" />
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* 2. FUNIL DE VENDAS CRM                     */
/* ═══════════════════════════════════════════ */
function FunilCRM({ stages }) {
  const maxDeals = Math.max(...stages.map(s => s.deals_count), 1);

  return (
    <SectionCard title="Funil de Vendas CRM">
      <div className="space-y-3">
        {stages.map((stage, i) => {
          const pct = (stage.deals_count / maxDeals) * 100;
          const prevDeals = i > 0 ? stages[i - 1].deals_count : null;
          const convRate = prevDeals ? ((stage.deals_count / prevDeals) * 100).toFixed(0) : null;
          const isBiggestDrop = i > 0 && prevDeals && (prevDeals - stage.deals_count) ===
            Math.max(...stages.slice(1).map((s, j) => stages[j].deals_count - s.deals_count));

          return (
            <div key={stage.stage_name}>
              {convRate && (
                <div className="flex items-center gap-2 mb-1 ml-2">
                  <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                  </svg>
                  <span className={`text-xs font-medium ${isBiggestDrop ? 'text-red-500' : 'text-gray-400'}`}>
                    {convRate}% conversao {isBiggestDrop && '— gargalo'}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="w-28 text-xs font-medium text-gray-600 dark:text-gray-400 text-right shrink-0">
                  {stage.stage_name}
                </span>
                <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg flex items-center px-3 transition-all duration-500 ${isBiggestDrop ? 'bg-red-400' : 'bg-purple-500'}`}
                    style={{ width: `${Math.max(pct, 8)}%` }}
                  >
                    <span className="text-xs font-semibold text-white whitespace-nowrap">
                      {stage.deals_count} deals
                    </span>
                  </div>
                </div>
                <span className="w-24 text-xs text-right text-gray-500 dark:text-gray-400 shrink-0">
                  {formatCurrency(stage.valor)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* 3. ANALISE DE PERDAS                       */
/* ═══════════════════════════════════════════ */
function AnalisePerdas({ perdas, topPerdidos, valorPerdido }) {
  const maxPerdaValor = Math.max(...perdas.map(p => p.valor), 1);

  const cenarios = [10, 20, 30, 50].map(pct => ({
    pct,
    acao: `Recuperar ${pct}% das perdas`,
    ganho: valorPerdido * pct / 100,
    receitaTotal: DADOS.receita.bruta + (valorPerdido * pct / 100),
    atingeBreakeven: (DADOS.receita.bruta + valorPerdido * pct / 100) >= BREAKEVEN
  }));

  return (
    <SectionCard title="Analise de Perdas">
      {/* Motivos */}
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Perdas por Motivo</h4>
      <div className="space-y-2 mb-6">
        {perdas.map(p => (
          <div key={p.motivo} className="flex items-center gap-3">
            <span className="w-28 text-xs text-gray-600 dark:text-gray-400 text-right shrink-0">{p.motivo}</span>
            <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div className="h-full bg-red-400 rounded" style={{ width: `${(p.valor / maxPerdaValor) * 100}%` }} />
            </div>
            <span className="w-28 text-xs text-right text-gray-500 shrink-0">{p.qtd} deals — {formatCurrency(p.valor)}</span>
          </div>
        ))}
      </div>

      {/* Top deals perdidos */}
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Top Negocios Perdidos</h4>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {['Negocio', 'Valor', 'Contato', 'Motivo'].map(h => (
                <th key={h} className="text-left py-2 px-2 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topPerdidos.slice(0, 10).map((d, i) => (
              <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-1.5 px-2 text-xs text-gray-700 dark:text-gray-300">{d.name}</td>
                <td className="py-1.5 px-2 text-xs text-red-600 dark:text-red-400 font-medium">{formatCurrency(d.amount)}</td>
                <td className="py-1.5 px-2 text-xs text-gray-500">{d.contact_name || '—'}</td>
                <td className="py-1.5 px-2"><Badge type={d.loss_reason === 'Preco' ? 'critico' : 'alto'}>{d.loss_reason || 'N/A'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cenarios de recuperacao */}
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Cenarios de Recuperacao</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Acao</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Ganho</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-gray-500">Receita Total</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-gray-500">Breakeven?</th>
            </tr>
          </thead>
          <tbody>
            {cenarios.map(c => (
              <tr key={c.pct} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 text-gray-700 dark:text-gray-300">{c.acao}</td>
                <td className="py-2 px-3 text-right text-green-600 dark:text-green-400 font-medium">{formatCurrency(c.ganho)}</td>
                <td className="py-2 px-3 text-right text-gray-700 dark:text-gray-300">{formatCurrency(c.receitaTotal)}</td>
                <td className="py-2 px-3 text-center">
                  {c.atingeBreakeven
                    ? <span className="text-green-600 font-bold">&#10003;</span>
                    : <span className="text-red-500 font-bold">&#10007;</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* 4. PERFORMANCE POR VENDEDOR                */
/* ═══════════════════════════════════════════ */
function PerformanceVendedores({ vendedores }) {
  return (
    <SectionCard title="Performance por Vendedor">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {['Vendedor', 'Total', 'Vendidas', 'Perdidas', 'Win Rate', 'Receita', 'Ciclo'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendedores.map(v => (
              <tr key={v.user_name} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 px-3 text-sm font-medium text-gray-800 dark:text-gray-200">{v.user_name}</td>
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{v.total_deals}</td>
                <td className="py-2 px-3 text-sm text-green-600 dark:text-green-400 font-medium">{v.vendidas}</td>
                <td className="py-2 px-3 text-sm text-red-500">{v.perdidas}</td>
                <td className="py-2 px-3">
                  <span className={`text-sm font-semibold ${v.win_rate >= 40 ? 'text-green-600 dark:text-green-400' : v.win_rate >= 25 ? 'text-orange-500' : 'text-red-500'}`}>
                    {v.win_rate}%
                  </span>
                </td>
                <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{formatCurrency(v.receita)}</td>
                <td className="py-2 px-3 text-sm text-gray-500">{Math.round(v.ciclo_medio)}d</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* 5. EVOLUCAO TEMPORAL                       */
/* ═══════════════════════════════════════════ */
function EvolucaoTemporal({ evolucao }) {
  const maxReceita = Math.max(...evolucao.map(e => e.receita), 1);
  const maxCriadas = Math.max(...evolucao.map(e => e.criadas), 1);

  return (
    <SectionCard title="Evolucao Temporal">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deals criados vs vendidos */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Deals Criados vs Vendidos</h4>
          <div className="space-y-2">
            {evolucao.map(e => {
              const label = e.mes.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
                const meses = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return `${meses[parseInt(m)]}/${y.slice(2)}`;
              });
              return (
                <div key={e.mes}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                    <span className="text-gray-500">{e.criadas} criados / {e.vendidas} vendidos</span>
                  </div>
                  <div className="flex gap-1 h-4">
                    <div className="bg-purple-400 rounded" style={{ width: `${(e.criadas / maxCriadas) * 100}%` }} />
                    <div className="bg-green-500 rounded" style={{ width: `${(e.vendidas / maxCriadas) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-purple-400" /> Criados</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded bg-green-500" /> Vendidos</span>
          </div>
        </div>

        {/* Receita por mes */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Receita CRM / Mes</h4>
          <div className="space-y-2">
            {evolucao.map(e => {
              const label = e.mes.replace(/^(\d{4})-(\d{2})$/, (_, y, m) => {
                const meses = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                return `${meses[parseInt(m)]}/${y.slice(2)}`;
              });
              return (
                <div key={e.mes + 'r'}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600 dark:text-gray-400">{label}</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">{formatCurrency(e.receita)}</span>
                  </div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    <div className="h-full bg-green-500 rounded" style={{ width: `${(e.receita / maxReceita) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* 6. ANALISE DE CONTATOS                     */
/* ═══════════════════════════════════════════ */
function AnaliseContatos({ d }) {
  const maxSource = Math.max(...(d.por_source || []).map(s => s.qtd), 1);

  return (
    <SectionCard title="Analise de Contatos">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 text-center">
          <p className="text-xs text-gray-500">Total Contatos</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatNumber(d.total_contatos)}</p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 text-center">
          <p className="text-xs text-gray-500">Com Negociacao</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatNumber(d.contatos_com_deal)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 text-center">
          <p className="text-xs text-gray-500">Sem Negociacao</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{formatNumber(d.total_contatos - d.contatos_com_deal)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top contatos */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Top Contatos por Valor</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  {['Contato', 'Deals', 'Valor'].map(h => (
                    <th key={h} className="text-left py-2 px-2 text-xs font-medium text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(d.top_contatos || []).map((c, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-1.5 px-2 text-xs text-gray-700 dark:text-gray-300">{c.contact_name}</td>
                    <td className="py-1.5 px-2 text-xs text-gray-500">{c.deals}</td>
                    <td className="py-1.5 px-2 text-xs text-green-600 dark:text-green-400 font-medium">{formatCurrency(c.valor || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fonte dos deals */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Origem dos Negocios</h4>
          <div className="space-y-2">
            {(d.por_source || []).map(s => (
              <div key={s.source} className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-600 dark:text-gray-400 text-right shrink-0">{s.source}</span>
                <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                  <div className="h-full bg-purple-500 rounded" style={{ width: `${(s.qtd / maxSource) * 100}%` }} />
                </div>
                <span className="w-10 text-xs text-right text-gray-500">{s.qtd}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* 7. TAREFAS E FOLLOW-UP                     */
/* ═══════════════════════════════════════════ */
function TarefasFollowup({ d }) {
  return (
    <SectionCard title="Tarefas e Follow-up">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{d.total_tarefas}</p>
        </div>
        <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-3 text-center">
          <p className="text-xs text-gray-500">Abertas</p>
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">{d.tarefas_abertas}</p>
        </div>
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-center">
          <p className="text-xs text-gray-500">Atrasadas</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{d.tarefas_atrasadas}</p>
        </div>
        <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-center">
          <p className="text-xs text-gray-500">Conclusao</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{d.taxa_conclusao}%</p>
        </div>
      </div>

      {d.tarefas_atrasadas > 0 && (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 p-4">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            {d.tarefas_atrasadas} tarefas atrasadas precisam de atencao imediata.
          </p>
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">
            Cada follow-up perdido e uma oportunidade de venda que esfria. Priorize ligacoes para deals com valor acima de R$ 500.
          </p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Taxa de Conclusao</span>
          <span className="text-gray-600 dark:text-gray-400 font-medium">{d.taxa_conclusao}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${d.taxa_conclusao >= 80 ? 'bg-green-500' : d.taxa_conclusao >= 50 ? 'bg-orange-400' : 'bg-red-500'}`}
            style={{ width: `${d.taxa_conclusao}%` }}
          />
        </div>
      </div>
    </SectionCard>
  );
}

/* ═══════════════════════════════════════════ */
/* PAGINA PRINCIPAL CRM                       */
/* ═══════════════════════════════════════════ */
export default function CRMPage() {
  const [dataIni, setDataIni] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useFallback, setUseFallback] = useState(true);

  const fetchData = useCallback(async () => {
    if (!dataIni || !dataFim) {
      // Try a full range to check if data exists
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('rdstation_dashboard_periodo', {
          data_ini: '2020-01-01',
          data_fim: new Date().toISOString().slice(0, 10)
        });
        if (!error && data && data.total_criadas > 0) {
          setDashData(data);
          setUseFallback(false);
        } else {
          setUseFallback(true);
        }
      } catch {
        setUseFallback(true);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('rdstation_dashboard_periodo', {
        data_ini: dataIni,
        data_fim: dataFim
      });
      if (!error && data && data.total_criadas > 0) {
        setDashData(data);
        setUseFallback(false);
      } else {
        setUseFallback(true);
      }
    } catch {
      setUseFallback(true);
    }
    setLoading(false);
  }, [dataIni, dataFim]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const d = useFallback ? CRM_FALLBACK : dashData;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Performance CRM</h2>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${useFallback
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
            : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
          }`}>
            {useFallback ? 'Dados estaticos' : 'RD Station ao vivo'}
          </span>
        </div>
        <DateRangePicker
          dataIni={dataIni}
          dataFim={dataFim}
          onChange={({ dataIni: di, dataFim: df }) => { setDataIni(di); setDataFim(df); }}
        />
      </div>

      {/* Fallback banner */}
      {useFallback && (
        <div className="rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 p-4 flex items-start gap-3">
          <span className="text-lg">📞</span>
          <div>
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Dados estaticos — RD Station ainda nao sincronizado
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Configure o token da API no Supabase e clique em "Sincronizar RD Station" no Dashboard para ver dados ao vivo.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Carregando dados CRM...</p>
        </div>
      ) : (
        <>
          <KPIsPipeline d={d} />
          <FunilCRM stages={d.funil_stages || []} />
          <AnalisePerdas perdas={d.perdas_por_motivo || []} topPerdidos={d.top_perdidos || []} valorPerdido={d.valor_perdido || 0} />
          <PerformanceVendedores vendedores={d.por_vendedor || []} />
          <EvolucaoTemporal evolucao={d.evolucao_mensal || []} />
          <AnaliseContatos d={d} />
          <TarefasFollowup d={d} />
        </>
      )}
    </div>
  );
}
