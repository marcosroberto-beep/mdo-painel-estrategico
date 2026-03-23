import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPercent, formatNumber, formatMesLabel, parseMoney, parsePercent } from './formatters'

describe('formatCurrency', () => {
  it('formats positive values in BRL', () => {
    const result = formatCurrency(1234.56)
    expect(result).toContain('1.234,56')
    expect(result).toContain('R$')
  })

  it('returns R$ 0,00 for null/undefined/NaN', () => {
    expect(formatCurrency(null)).toContain('0,00')
    expect(formatCurrency(undefined)).toContain('0,00')
    expect(formatCurrency(NaN)).toContain('0,00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0,00')
  })

  it('formats negative values', () => {
    const result = formatCurrency(-500.25)
    expect(result).toContain('500,25')
  })
})

describe('formatPercent', () => {
  it('formats positive values with + prefix', () => {
    expect(formatPercent(12.5)).toBe('+12.5%')
  })

  it('formats negative values', () => {
    expect(formatPercent(-38.1)).toBe('-38.1%')
  })

  it('returns 0,0% for null', () => {
    expect(formatPercent(null)).toBe('0,0%')
  })

  it('returns 0,0% for undefined', () => {
    expect(formatPercent(undefined)).toBe('0,0%')
  })

  it('returns 0,0% for NaN', () => {
    expect(formatPercent(NaN)).toBe('0,0%')
  })

  it('formats zero without prefix', () => {
    expect(formatPercent(0)).toBe('0.0%')
  })
})

describe('formatNumber', () => {
  it('formats integer with thousand separators', () => {
    expect(formatNumber(28275)).toBe('28.275')
  })

  it('returns 0 for null/undefined/NaN', () => {
    expect(formatNumber(null)).toBe('0')
    expect(formatNumber(undefined)).toBe('0')
    expect(formatNumber(NaN)).toBe('0')
  })

  it('formats decimal values', () => {
    const result = formatNumber(1234.5)
    expect(result).toContain('1.234')
  })
})

describe('formatMesLabel', () => {
  it('formats YYYY-MM to Mmm/YY', () => {
    expect(formatMesLabel('2026-03')).toBe('Mar/26')
    expect(formatMesLabel('2025-12')).toBe('Dez/25')
  })

  it('returns empty string for null/undefined/empty', () => {
    expect(formatMesLabel(null)).toBe('')
    expect(formatMesLabel(undefined)).toBe('')
    expect(formatMesLabel('')).toBe('')
  })

  it('returns raw month if not in lookup', () => {
    expect(formatMesLabel('2026-99')).toBe('99/26')
  })
})

describe('parseMoney', () => {
  it('parses BRL formatted string', () => {
    expect(parseMoney('R$ 1.234,56')).toBe(1234.56)
  })

  it('parses plain number', () => {
    expect(parseMoney(500)).toBe(500)
  })

  it('returns 0 for null/undefined', () => {
    expect(parseMoney(null)).toBe(0)
    expect(parseMoney(undefined)).toBe(0)
  })

  it('returns 0 for non-numeric string', () => {
    expect(parseMoney('abc')).toBe(0)
  })
})

describe('parsePercent', () => {
  it('parses percentage string', () => {
    expect(parsePercent('12,5%')).toBe(12.5)
  })

  it('parses plain number', () => {
    expect(parsePercent(42)).toBe(42)
  })

  it('returns 0 for null/undefined', () => {
    expect(parsePercent(null)).toBe(0)
    expect(parsePercent(undefined)).toBe(0)
  })

  it('returns 0 for non-numeric string', () => {
    expect(parsePercent('abc')).toBe(0)
  })
})
