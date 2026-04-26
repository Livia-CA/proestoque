export type Movimentacao = {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  observacao?: string;
};
