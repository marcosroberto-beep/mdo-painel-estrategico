import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AlertasPage from './AlertasPage'

describe('AlertasPage', () => {
  it('renders the page heading', () => {
    render(
      <MemoryRouter>
        <AlertasPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Alertas e Plano de Acao')).toBeInTheDocument()
  })

  it('renders the priority action plan section', () => {
    render(
      <MemoryRouter>
        <AlertasPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Plano de Acao Prioritario')).toBeInTheDocument()
  })

  it('renders individual action plan items', () => {
    render(
      <MemoryRouter>
        <AlertasPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Renegociar Webi')).toBeInTheDocument()
    expect(screen.getByText('Refinanciar dividas')).toBeInTheDocument()
    expect(screen.getByText('Campanha reativacao base 28K')).toBeInTheDocument()
  })

  it('renders alert items from seed data', () => {
    render(
      <MemoryRouter>
        <AlertasPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Deficit Operacional')).toBeInTheDocument()
  })
})
