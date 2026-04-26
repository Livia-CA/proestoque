import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProEstoqueTheme } from '@/src/constants/theme';
import { CATEGORIAS_MOCK, PRODUTOS_MOCK } from '@/src/data/mockData';
import type { Produto } from '@/src/types';

type StatusProduto = 'normal' | 'baixo' | 'sem-estoque';

const STATUS_STYLE: Record<
  StatusProduto,
  { label: string; backgroundColor: string; color: string }
> = {
  normal: {
    label: 'Normal',
    backgroundColor: ProEstoqueTheme.colors.successBg,
    color: ProEstoqueTheme.colors.successText,
  },
  baixo: {
    label: 'Baixo',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  'sem-estoque': {
    label: 'Sem estoque',
    backgroundColor: '#FEE2E2',
    color: ProEstoqueTheme.colors.danger,
  },
};

const getStatusProduto = (produto: Produto): StatusProduto => {
  if (produto.quantidade === 0) {
    return 'sem-estoque';
  }

  if (produto.quantidade < produto.quantidadeMinima) {
    return 'baixo';
  }

  return 'normal';
};

export default function ProdutosScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return PRODUTOS_MOCK.filter((produto) => {
      const passouCategoria =
        categoriaSelecionada === 'todos' || produto.categoriaId === categoriaSelecionada;
      const passouBusca = !termo || produto.nome.toLowerCase().includes(termo);

      return passouCategoria && passouBusca;
    }).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [busca, categoriaSelecionada]);

  const renderProduto = ({ item }: { item: Produto }) => {
    const status = getStatusProduto(item);
    const statusStyle = STATUS_STYLE[status];

    return (
      <View style={styles.produtoItem}>
        <View style={styles.produtoIcone}>
          <Ionicons name="cube-outline" size={18} color={ProEstoqueTheme.colors.brandPrimary} />
        </View>

        <View style={styles.produtoInfo}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoQtd}>
            {item.quantidade} {item.unidade}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <View style={styles.topAccent} />
            <Text style={styles.title}>Produtos</Text>

            <TextInput
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar produto..."
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputBusca}
              placeholderTextColor={ProEstoqueTheme.colors.textSecondary}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setCategoriaSelecionada('todos')}
                style={[
                  styles.chip,
                  categoriaSelecionada === 'todos' ? styles.chipAtivo : styles.chipInativo,
                ]}>
                <Text
                  style={
                    categoriaSelecionada === 'todos' ? styles.chipTextoAtivo : styles.chipTextoInativo
                  }>
                  Todos
                </Text>
              </TouchableOpacity>

              {CATEGORIAS_MOCK.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  activeOpacity={0.8}
                  onPress={() => setCategoriaSelecionada(categoria.id)}
                  style={[
                    styles.chip,
                    categoriaSelecionada === categoria.id ? styles.chipAtivo : styles.chipInativo,
                  ]}>
                  <Text
                    style={
                      categoriaSelecionada === categoria.id
                        ? styles.chipTextoAtivo
                        : styles.chipTextoInativo
                    }>
                    {categoria.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptySubtitle}>Tente ajustar a busca ou o filtro de categoria.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: ProEstoqueTheme.spacing.lg,
    paddingTop: ProEstoqueTheme.spacing.sm,
    paddingBottom: ProEstoqueTheme.spacing.xxl,
    flexGrow: 1,
  },
  topAccent: {
    height: 30,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    borderBottomLeftRadius: ProEstoqueTheme.radius.lg,
    borderBottomRightRadius: ProEstoqueTheme.radius.lg,
    marginTop: ProEstoqueTheme.spacing.xs,
    marginBottom: ProEstoqueTheme.spacing.lg,
  },
  title: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h2,
    fontWeight: '700',
    marginBottom: ProEstoqueTheme.spacing.md,
  },
  inputBusca: {
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    borderRadius: ProEstoqueTheme.radius.md,
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.md,
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.body,
  },
  chipsContainer: {
    paddingTop: ProEstoqueTheme.spacing.md,
    paddingBottom: ProEstoqueTheme.spacing.md,
    paddingRight: ProEstoqueTheme.spacing.md,
  },
  chip: {
    borderRadius: ProEstoqueTheme.radius.pill,
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.sm,
    marginRight: ProEstoqueTheme.spacing.sm,
    borderWidth: 1,
  },
  chipAtivo: {
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    borderColor: ProEstoqueTheme.colors.brandPrimary,
  },
  chipInativo: {
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderColor: ProEstoqueTheme.colors.borderDefault,
  },
  chipTextoAtivo: {
    color: ProEstoqueTheme.colors.textInverse,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '700',
  },
  chipTextoInativo: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '600',
  },
  produtoItem: {
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderRadius: ProEstoqueTheme.radius.md,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    padding: ProEstoqueTheme.spacing.md,
    marginBottom: ProEstoqueTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  produtoIcone: {
    width: 36,
    height: 36,
    borderRadius: ProEstoqueTheme.radius.sm,
    backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ProEstoqueTheme.spacing.md,
  },
  produtoInfo: {
    flex: 1,
  },
  produtoNome: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.body,
    fontWeight: '700',
  },
  produtoQtd: {
    color: ProEstoqueTheme.colors.textSecondary,
    marginTop: ProEstoqueTheme.spacing.xs,
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  badge: {
    borderRadius: ProEstoqueTheme.radius.pill,
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.xs,
  },
  badgeText: {
    fontSize: ProEstoqueTheme.typography.caption,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ProEstoqueTheme.spacing.xl,
    paddingHorizontal: ProEstoqueTheme.spacing.lg,
  },
  emptyTitle: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h3,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    marginTop: ProEstoqueTheme.spacing.sm,
    textAlign: 'center',
  },
});
