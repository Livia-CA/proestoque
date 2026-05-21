import { useLocalSearchParams } from 'expo-router';

import { ProductForm } from '@/src/components/ProductForm';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ProductForm produtoId={id} />;
}