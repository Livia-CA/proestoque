import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '@/src/services/api';

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
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
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

  const salvarSessao = useCallback(async (usuario: User, tokenAutenticacao: string) => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.TOKEN, tokenAutenticacao],
      [STORAGE_KEYS.USER, JSON.stringify(usuario)],
    ]);

    setToken(tokenAutenticacao);
    setUser(usuario);
  }, []);

  const obterMensagemErro = useCallback((error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { erro?: string; detalhes?: Array<{ campo?: string; mensagem?: string }> }
        | undefined;

      if (error.response?.status === 422 && data?.detalhes?.length) {
        const detalhes = data.detalhes
          .filter((item) => item.campo && item.mensagem)
          .map((item) => `${item.campo}: ${item.mensagem}`)
          .join('\n');

        return detalhes ? `Dados inválidos:\n${detalhes}` : data.erro ?? fallback;
      }

      return data?.erro ?? fallback;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }, []);

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
      const response = await api.post('/auth/login', { email, senha });
      const { usuario, token: tokenAutenticacao } = response.data as {
        usuario: User;
        token: string;
      };

      await salvarSessao(usuario, tokenAutenticacao);
    } catch (error) {
      throw new Error(obterMensagemErro(error, 'Falha ao fazer login'));
    } finally {
      setIsLoggingIn(false);
    }
  }, [obterMensagemErro, salvarSessao]);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    try {
      const response = await api.post('/auth/registro', { nome, email, senha });
      const { usuario, token: tokenAutenticacao } = response.data as {
        usuario: User;
        token: string;
      };

      await salvarSessao(usuario, tokenAutenticacao);
    } catch (error) {
      throw new Error(obterMensagemErro(error, 'Falha ao criar conta'));
    }
  }, [salvarSessao]);

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
        registrar,
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
