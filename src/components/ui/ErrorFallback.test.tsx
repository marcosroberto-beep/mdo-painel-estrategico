import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorFallback from './ErrorFallback'

describe('ErrorFallback', () => {
  it('renders default error message', () => {
    render(<ErrorFallback />)

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
    expect(screen.getByText('Erro inesperado')).toBeInTheDocument()
  })

  it('renders custom error message from Error object', () => {
    render(<ErrorFallback error={new Error('Database connection failed')} />)

    expect(screen.getByText('Database connection failed')).toBeInTheDocument()
  })

  it('renders custom message prop', () => {
    render(<ErrorFallback message="Servico indisponivel" />)

    expect(screen.getByText('Servico indisponivel')).toBeInTheDocument()
  })

  it('renders retry button when resetErrorBoundary is provided', () => {
    const handleRetry = vi.fn()
    render(<ErrorFallback resetErrorBoundary={handleRetry} />)

    const button = screen.getByRole('button', { name: /tentar novamente/i })
    expect(button).toBeInTheDocument()
  })

  it('calls resetErrorBoundary when retry button is clicked', async () => {
    const handleRetry = vi.fn()
    const user = userEvent.setup()

    render(<ErrorFallback resetErrorBoundary={handleRetry} />)

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }))
    expect(handleRetry).toHaveBeenCalledOnce()
  })

  it('does not render retry button when resetErrorBoundary is not provided', () => {
    render(<ErrorFallback />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
