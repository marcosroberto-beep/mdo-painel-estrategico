// ─── Dashboard TanStack Query Hooks ──────────────────────────
// Wraps dashboard service functions with caching and state management.

import { useQuery } from '@tanstack/react-query'
import { fetchResumoMensal, fetchDadosMes, fetchConnectionStatus } from '../api/dashboard'

export function useResumoMensal() {
  return useQuery({
    queryKey: ['resumo-mensal'],
    queryFn: fetchResumoMensal,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDadosMes(mes: string | null) {
  return useQuery({
    queryKey: ['dados-mes', mes],
    queryFn: () => fetchDadosMes(mes!),
    enabled: !!mes,
    staleTime: 5 * 60 * 1000,
  })
}

export function useConnectionStatus() {
  return useQuery({
    queryKey: ['connection-status'],
    queryFn: fetchConnectionStatus,
    staleTime: 30 * 1000,
  })
}
