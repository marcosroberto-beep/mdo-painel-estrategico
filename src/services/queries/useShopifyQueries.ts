// ─── Shopify TanStack Query Hooks ────────────────────────────
// Wraps Shopify service functions with caching and state management.

import { useQuery } from '@tanstack/react-query'
import {
  fetchShopifyPedidos,
  fetchShopifyClientes,
  fetchShopifyProdutos,
  fetchAllShopifyData,
} from '../api/shopify'

export function useShopifyPedidos() {
  return useQuery({
    queryKey: ['shopify', 'pedidos'],
    queryFn: fetchShopifyPedidos,
    staleTime: 5 * 60 * 1000,
  })
}

export function useShopifyClientes() {
  return useQuery({
    queryKey: ['shopify', 'clientes'],
    queryFn: fetchShopifyClientes,
    staleTime: 5 * 60 * 1000,
  })
}

export function useShopifyProdutos() {
  return useQuery({
    queryKey: ['shopify', 'produtos'],
    queryFn: fetchShopifyProdutos,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAllShopifyData() {
  return useQuery({
    queryKey: ['shopify', 'all'],
    queryFn: fetchAllShopifyData,
    staleTime: 5 * 60 * 1000,
  })
}
