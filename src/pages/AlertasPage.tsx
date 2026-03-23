import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DADOS } from '../data/seed';
import type { Alerta, AlertTipo, PlanoAcao } from '../types/domain';
import SectionCard from '../components/ui/SectionCard';
import DateRangePicker from '../components/ui/DateRangePicker';
import Badge from '../components/ui/Badge';

interface TipoConfig {
  emoji: string;
  label: string;
  order: number;
}

const tipoConfig: Record<AlertTipo, TipoConfig> = {
  critico: { emoji: '\uD83D\uDD34', label: 'Critico', order: 0 },
  alto:    { emoji: '\uD83D\uDFE0', label: 'Alto', order: 1 },
  medio:   { emoji: '\uD83D\uDFE1', label: 'Medio', order: 2 },
  positivo:{ emoji: '\uD83D\uDFE2', label: 'Positivo', order: 3 },
};

const planoAcao: PlanoAcao[] = [
  {
    numero: 1,
    titulo: 'Renegociar Webi',
    desc: 'Migrar para modelo success fee ou reduzir escopo',
    economia: 'Economia R$ 5-6K/mes',
  },
  {
    numero: 2,
    titulo: 'Refinanciar dividas',
    desc: 'Consolidar emprestimo + cartao em parcelas menores',
    economia: 'R$ 8K \u2192 R$ 3K/mes',
  },
  {
    numero: 3,
    titulo: 'Campanha reativacao base 28K',
    desc: 'E-mail marketing + WhatsApp para clientes inativos',
    economia: 'R$ 163K receita potencial',
  },
  {
    numero: 4,
    titulo: 'Prospeccao 10 farmacias B2B',
    desc: 'Kit amostras + visita comercial para farmacias de manipulacao',
    economia: 'R$ 25K/mes receita recorrente',
  },
];

interface DateRange {
  dataIni: string;
  dataFim: string;
}

export default function AlertasPage() {
  const [searchParams] = useSearchParams();
  const fonteAtiva: string | null = searchParams.get('fonte');

  const [range, setRange] = useState<DateRange>({ dataIni: '', dataFim: '' });

  const alertas: Alerta[] = DADOS.alertas;

  // Group alerts by tipo
  const grupos = alertas.reduce<Record<string, Alerta[]>>((acc, alerta) => {
    if (!acc[alerta.tipo]) acc[alerta.tipo] = [];
    acc[alerta.tipo].push(alerta);
    return acc;
  }, {});

  // Sort groups by severity order
  const gruposOrdenados: [string, Alerta[]][] = Object.entries(grupos).sort(
    ([a], [b]) => (tipoConfig[a as AlertTipo]?.order ?? 99) - (tipoConfig[b as AlertTipo]?.order ?? 99)
  );

  return (
    <div className="space-y-6">
      {/* Header + Date Range */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Alertas e Plano de Acao
          {fonteAtiva && (
            <span className="ml-2 text-sm font-normal text-gray-500">({fonteAtiva})</span>
          )}
        </h2>
        <DateRangePicker dataIni={range.dataIni} dataFim={range.dataFim} onChange={setRange} />
      </div>

      {/* Alert Groups */}
      {gruposOrdenados.map(([tipo, items]) => {
        const config = tipoConfig[tipo as AlertTipo] || { emoji: '\u26A0\uFE0F', label: tipo };
        return (
          <SectionCard
            key={tipo}
            title={`${config.emoji} ${config.label}`}
          >
            <div className="space-y-3">
              {items.map((alerta: Alerta, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {alerta.titulo}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {alerta.desc}
                    </p>
                  </div>
                  <Badge type={tipo} className="shrink-0 self-start sm:self-center">
                    {alerta.acao}
                  </Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        );
      })}

      {/* Plano de Acao Prioritario */}
      <SectionCard title="Plano de Acao Prioritario">
        <div className="space-y-4">
          {planoAcao.map((item: PlanoAcao) => (
            <div
              key={item.numero}
              className="flex gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500">
                {item.numero}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.titulo}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
                <p className="mt-1 text-sm font-semibold text-green-600 dark:text-green-400">
                  {item.economia}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
