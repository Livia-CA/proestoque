import type { Categoria } from './categorias';

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  categoria?: Categoria;
  foto?: string | null;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao?: string | null;
  ultimaMovimentacao: string;
  criadoEm?: string;
  atualizadoEm?: string;
};
