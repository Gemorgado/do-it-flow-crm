
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@/test/utils'; // Use our custom utils
import { useAuth } from '../AuthProvider';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthProvider';
import { loginApi, getUserApi, logoutApi } from '../api';

// Mock the API calls
vi.mock('../api', () => ({
  loginApi: vi.fn(),
  getUserApi: vi.fn(),
  logoutApi: vi.fn(),
}));

// Mock the toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const wrapper = ({ children }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    mockNavigate.mockReset();
  });

  it('should return null user and loading state initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  it('should authenticate user on successful login', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      team: 'comercial',
      allowedTabs: ['PIPELINE'],
      createdAt: '2023-01-01'
    };

    (loginApi as any).mockResolvedValue({ 
      user: mockUser, 
      token: 'mock-token' 
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password',
      });
    });

    expect(loginApi).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
    expect(result.current.user).toEqual(mockUser);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should logout the user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(() => {
      result.current.logout();
    });

    expect(logoutApi).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should handle login errors', async () => {
    (loginApi as any).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      try {
        await result.current.login({
          email: 'invalid@example.com',
          password: 'wrong',
        });
      } catch (error) {
        // Error expected
      }
    });

    expect(loginApi).toHaveBeenCalled();
    expect(result.current.user).toBe(null);
  });
});
