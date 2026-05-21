import { Stack } from 'expo-router';

import { ProEstoqueTheme } from '@/src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: ProEstoqueTheme.colors.brandPrimary,
        },
        headerTintColor: ProEstoqueTheme.colors.textInverse,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Produto' }} />
    </Stack>
  );
}