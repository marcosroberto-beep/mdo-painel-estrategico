import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KPICard from './KPICard'

// Mock SparklineChart since it uses Recharts which may not render in jsdom
vi.mock('../charts/SparklineChart', () => ({
  default: () => <div data-testid="sparkline" />,
}))

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Receita" value="R$ 50.000" />)

    expect(screen.getByText('Receita')).toBeInTheDocument()
    expect(screen.getByText('R$ 50.000')).toBeInTheDocument()
  })

  it('renders numeric value', () => {
    render(<KPICard label="Pedidos" value={142} />)

    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })

  it('renders subvalue when provided', () => {
    render(<KPICard label="Ticket Medio" value="R$ 350" subvalue="vs R$ 300 anterior" />)

    expect(screen.getByText('vs R$ 300 anterior')).toBeInTheDocument()
  })

  it('renders trend indicator when provided', () => {
    render(<KPICard label="Receita" value="R$ 50.000" trend="up" />)

    expect(screen.getByText('up')).toBeInTheDocument()
  })

  it('renders as button when onClick is provided', () => {
    const handleClick = vi.fn()
    render(<KPICard label="Clientes" value={80} onClick={handleClick} />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
