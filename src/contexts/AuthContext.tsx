import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
};

const STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  USER: '@proestoque:user',
} as const;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const bootStartedAt = Date.now();
    let isMounted = true;

    async function carregarSessao() {
      try {
        const [tokenSalvo, userString] = await AsyncStorage.multiGet([
          STORAGE_KEYS.TOKEN,
          STORAGE_KEYS.USER,
        ]);

        const tokenValor = tokenSalvo[1];
        const userValor = userString[1] ? JSON.parse(userString[1]) : null;

        if (tokenValor && userValor) {
          setToken(tokenValor);
          setUser(userValor);
        }
      } catch (error) {
        console.warn('Erro ao carregar sessão:', error);
      } finally {
        const elapsed = Date.now() - bootStartedAt;
        const remaining = Math.max(1500 - elapsed, 0);

        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, remaining);
      }
    }

    carregarSessao();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!email.trim() || !senha.trim()) {
        throw new Error('Preencha e-mail e senha');
      }

      const tokenSimulado = `token_${Date.now()}_${Math.random()}`;
      const userSimulado: User = {
        id: `user_${Date.now()}`,
        nome: email.split('@')[0],
        email,
      };

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.TOKEN, tokenSimulado],
        [STORAGE_KEYS.USER, JSON.stringify(userSimulado)],
      ]);

      setToken(tokenSimulado);
      setUser(userSimulado);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggingIn,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
  }
  return context;
}
