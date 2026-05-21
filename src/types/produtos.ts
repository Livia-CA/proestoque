export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  foto?: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  unidade: string;
  observacao?: string;
  ultimaMovimentacao: string;
};
