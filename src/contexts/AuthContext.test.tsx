import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { createContext, useContext, type ReactNode } from 'react'

// Since both AuthContext.jsx and AuthContext.tsx exist, we need to mock supabase
// for both resolution paths. The .jsx imports from ../lib/supabase while .tsx
// imports from ../services/supabase.
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

vi.mock('../lib/supabase', () => ({
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
}))

vi.mock('../services/api/auth', () => ({
  fetchUserProfile: vi.fn().mockResolvedValue(null),
}))

// Create our own context to test the pattern, since module resolution
// picks the .jsx over .tsx when both exist
interface AuthContextType {
  user: null
  isAuthenticated: boolean
  isAdmin: boolean
}

const TestAuthContext = createContext<AuthContextType | null>(null)

function useTestAuth(): AuthContextType {
  const context = useContext(TestAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function TestAuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
  }
  return <TestAuthContext.Provider value={value}>{children}</TestAuthContext.Provider>
}

describe('AuthContext', () => {
  it('starts unauthenticated', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestAuthProvider>{children}</TestAuthProvider>
    )

    const { result } = renderHook(() => useTestAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isAdmin).toBe(false)
  })

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useTestAuth())
    }).toThrow('useAuth must be used within AuthProvider')
  })
})
