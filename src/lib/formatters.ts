export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export const formatPercent = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return '0,0%'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}

export const formatNumber = (value: number | null | undefined): string => {
  if (value == null || isNaN(value)) return '0'
  return new Intl.NumberFormat('pt-BR').format(value)
}

const MESES_LABEL: Record<string, string> = {
  '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr',
  '05': 'Mai', '06': 'Jun', '07': 'Jul', '08': 'Ago',
  '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez',
}

export const formatMesLabel = (m: string | null | undefined): string => {
  if (!m) return ''
  const [y, mo] = m.split('-')
  return `${MESES_LABEL[mo] || mo}/${y.slice(2)}`
}

export const parseMoney = (v: string | number | null | undefined): number => {
  if (v == null) return 0
  const s = String(v).replace(/R\$|\s|\xa0/g, '').replace(/\./g, '').replace(',', '.').trim()
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

export const parsePercent = (v: string | number | null | undefined): number => {
  if (v == null) return 0
  const s = String(v).replace('%', '').replace(',', '.').trim()
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}
