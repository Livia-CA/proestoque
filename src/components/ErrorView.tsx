import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type ErrorViewProps = {
  mensagem: string;
  onRetry?: () => void;
};

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={ProEstoqueTheme.colors.textSecondary} />
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>

      {onRetry ? (
        <TouchableOpacity style={styles.botao} activeOpacity={0.85} onPress={onRetry}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ProEstoqueTheme.spacing.sm,
    padding: ProEstoqueTheme.spacing.xl,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  titulo: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h3,
    fontWeight: '700',
  },
  mensagem: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    lineHeight: 20,
    textAlign: 'center',
  },
  botao: {
    marginTop: ProEstoqueTheme.spacing.sm,
    borderRadius: ProEstoqueTheme.radius.md,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    paddingHorizontal: ProEstoqueTheme.spacing.lg,
    paddingVertical: ProEstoqueTheme.spacing.sm,
  },
  botaoTexto: {
    color: ProEstoqueTheme.colors.textInverse,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '700',
  },
});
