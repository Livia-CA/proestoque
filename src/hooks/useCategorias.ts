import { useCallback, useEffect, useState } from 'react';

import { api } from '@/src/services/api';
import type { Categoria } from '@/src/types';

type UseCategoriasResult = {
  categorias: Categoria[];
  isLoading: boolean;
  error: string | null;
  carregarCategorias: () => Promise<void>;
};

export function useCategorias(): UseCategoriasResult {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get<Categoria[]>('/categorias');
      setCategorias(data);
    } catch (err) {
      const mensagem = err instanceof Error ? err.message : 'Falha ao carregar categorias';
      setError(mensagem);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCategorias();
  }, [carregarCategorias]);

  return { categorias, isLoading, error, carregarCategorias };
}
