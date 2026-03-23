import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContext, type ReactNode } from 'react'

// Mock supabase before importing AuthContext
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
  supabaseUrl: 'https://test.supabase.co',
}))

vi.mock('../services/api/auth', () => ({
  fetchUserProfile: vi.fn().mockResolvedValue(null),
}))

import { AuthProvider, AuthContext, type AuthContextType } from './AuthContext'

function useAuthDirect(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

describe('AuthContext', () => {
  it('starts unauthenticated', async () => {
    const { result } = renderHook(() => useAuthDirect(), { wrapper })

    // Wait for async getSession effect to settle
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isAdmin).toBe(false)
  })

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuthDirect())
    }).toThrow('useAuth must be used within AuthProvider')
  })
})
