import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { useAuth } from '@/src/contexts/AuthContext';
import { api } from '@/src/services/api';
import type { ProdutoFormData } from '@/src/schemas/produtoSchema';
import type { Produto } from '@/src/types';

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string }
  | { type: 'CLEAR' };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

function ordenarProdutos(produtos: Produto[]): Produto[] {
  return [...produtos].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOAD_SUCCESS':
      return {
        produtos: ordenarProdutos(action.payload),
        isLoading: false,
        error: null,
      };
    case 'LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD':
      return {
        ...state,
        produtos: ordenarProdutos([action.payload, ...state.produtos]),
      };
    case 'UPDATE':
      return {
        ...state,
        produtos: ordenarProdutos(
          state.produtos.map((produto) =>
            produto.id === action.payload.id ? action.payload : produto,
          ),
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((produto) => produto.id !== action.payload),
      };
    case 'CLEAR':
      return {
        produtos: [],
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: false,
    error: null,
  });

  const carregarProdutos = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    dispatch({ type: 'LOAD_START' });

    try {
      const { data } = await api.get<Produto[]>('/produtos');
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Falha ao carregar produtos';
      dispatch({ type: 'LOAD_ERROR', payload: mensagem });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      dispatch({ type: 'CLEAR' });
      return;
    }

    carregarProdutos();
  }, [carregarProdutos, isAuthenticated, isAuthLoading]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const { data: novoProduto } = await api.post<Produto>('/produtos', data);
    dispatch({ type: 'ADD', payload: novoProduto });
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const { data: produtoAtualizado } = await api.put<Produto>(`/produtos/${id}`, data);
    dispatch({ type: 'UPDATE', payload: produtoAtualizado });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((produto) => produto.id === id),
    [state.produtos],
  );

  const value = useMemo(
    () => ({
      produtos: state.produtos,
      isLoading: state.isLoading,
      error: state.error,
      carregarProdutos,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }),
    [
      adicionarProduto,
      carregarProdutos,
      deletarProduto,
      editarProduto,
      getProdutoById,
      state.error,
      state.isLoading,
      state.produtos,
    ],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um <ProductsProvider>');
  }

  return context;
}
