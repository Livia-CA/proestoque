export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  criadoEm?: string;
  _count?: {
    produtos: number;
  };
};
