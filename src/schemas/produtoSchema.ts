import { z } from 'zod';

export const unidadesProduto = ['un', 'kg', 'cx', 'L', 'm'] as const;

const toNumberOrUndefined = (val: unknown) => {
  if (typeof val === 'string') {
    const v = val.trim();
    if (v === '') return undefined;
    const n = Number(v.replace(',', '.'));
    return Number.isNaN(n) ? val : n;
  }
  return val;
};

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(80, 'Nome muito longo'),
  categoriaId: z.string().min(1, 'Selecione uma categoria'),

  quantidade: z
    .preprocess(toNumberOrUndefined, z.union([z.number(), z.undefined()]))
    .refine((val) => typeof val === 'number', { message: 'Informe a quantidade' })
    .refine((val) => Number.isInteger(val as number), { message: 'Quantidade deve ser um número inteiro' })
    .refine((val) => (val as number) >= 0, { message: 'Quantidade não pode ser negativa' }),

  quantidadeMinima: z
    .preprocess(toNumberOrUndefined, z.union([z.number(), z.undefined()]))
    .refine((val) => typeof val === 'number', { message: 'Informe a quantidade mínima' })
    .refine((val) => Number.isInteger(val as number), { message: 'Deve ser um número inteiro' })
    .refine((val) => (val as number) >= 0, { message: 'Não pode ser negativa' }),

  preco: z
    .preprocess(toNumberOrUndefined, z.union([z.number(), z.undefined()]))
    .refine((val) => typeof val === 'number', { message: 'Informe o preço' })
    .refine((val) => (val as number) > 0, { message: 'Preço deve ser maior que zero' }),

  unidade: z.enum(unidadesProduto),
  observacao: z.string().max(200, 'Máximo 200 caracteres').optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;