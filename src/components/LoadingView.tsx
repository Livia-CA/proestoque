import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type LoadingViewProps = {
  mensagem?: string;
};

export function LoadingView({ mensagem = 'Carregando...' }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={ProEstoqueTheme.colors.brandPrimary} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ProEstoqueTheme.spacing.md,
    padding: ProEstoqueTheme.spacing.xl,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  texto: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '600',
  },
});
