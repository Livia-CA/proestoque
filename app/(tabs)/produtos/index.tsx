import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/src/components/Button';
import { Input } from '@/src/components/Input';
import { Colors, ProEstoqueTheme } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { CATEGORIAS_MOCK } from '@/src/data/mockData';
import type { Produto } from '@/src/types';

type StatusProduto = 'normal' | 'baixo' | 'sem-estoque';

const getStatusProduto = (produto: Produto): StatusProduto => {
  if (produto.quantidade === 0) {
    return 'sem-estoque';
  }

  if (produto.quantidade < produto.quantidadeMinima) {
    return 'baixo';
  }

  return 'normal';
};

const STATUS_STYLE: Record<StatusProduto, { label: string; backgroundColor: string; color: string }> = {
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

export default function ProdutosScreen() {
  const { produtos } = useProducts();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return produtos
      .filter((produto) => {
        const correspondeBusca = !termo || produto.nome.toLowerCase().includes(termo);
        const correspondeCategoria = categoriaAtiva ? produto.categoriaId === categoriaAtiva : true;

        return correspondeBusca && correspondeCategoria;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [busca, categoriaAtiva, produtos]);

  const renderItem = ({ item }: { item: Produto }) => {
    const status = getStatusProduto(item);
    const statusStyle = STATUS_STYLE[status];

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={styles.card}
        onPress={() => router.push(`/produtos/${item.id}`)}>
        <View style={styles.cardInfo}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.subtitulo}>
            {item.quantidade} {item.unidade}
          </Text>
        </View>

        <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}> 
          <Text style={[styles.badgeText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Input
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar produto..."
              leftIcon="search-outline"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.chipsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setCategoriaAtiva(null)}
                style={[styles.chip, !categoriaAtiva && styles.chipActive]}>
                <Text style={[styles.chipText, !categoriaAtiva && styles.chipTextActive]}>
                  Todas
                </Text>
              </TouchableOpacity>

              {CATEGORIAS_MOCK.map((categoria) => {
                const isActive = categoriaAtiva === categoria.id;

                return (
                  <TouchableOpacity
                    key={categoria.id}
                    activeOpacity={0.85}
                    onPress={() => setCategoriaAtiva((current) => (current === categoria.id ? null : categoria.id))}
                    style={[styles.chip, isActive && styles.chipActive]}>
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={44} color={Colors.light.tabIconDefault} />
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyText}>Tente ajustar a busca ou o filtro de categoria.</Text>
            <Button title="Cadastrar produto" onPress={() => router.push('/produtos/novo')} />
          </View>
        }
        ListFooterComponent={<View style={{ height: 110 }} />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={() => router.push('/produtos/novo')}>
        <Ionicons name="add" size={28} color={ProEstoqueTheme.colors.textInverse} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  content: {
    padding: ProEstoqueTheme.spacing.lg,
    paddingBottom: ProEstoqueTheme.spacing.xxl,
  },
  header: {
    gap: ProEstoqueTheme.spacing.md,
    marginBottom: ProEstoqueTheme.spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ProEstoqueTheme.spacing.sm,
  },
  chip: {
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.xs,
    borderRadius: ProEstoqueTheme.radius.pill,
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
  },
  chipActive: {
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    borderColor: ProEstoqueTheme.colors.brandPrimary,
  },
  chipText: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.caption,
    fontWeight: '700',
  },
  chipTextActive: {
    color: ProEstoqueTheme.colors.textInverse,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ProEstoqueTheme.spacing.md,
    borderRadius: ProEstoqueTheme.radius.md,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    backgroundColor: ProEstoqueTheme.colors.surface,
    marginBottom: ProEstoqueTheme.spacing.sm,
  },
  cardInfo: {
    flex: 1,
    paddingRight: ProEstoqueTheme.spacing.md,
  },
  nome: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.body,
    fontWeight: '700',
  },
  subtitulo: {
    marginTop: 4,
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  badge: {
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.xs,
    borderRadius: ProEstoqueTheme.radius.pill,
  },
  badgeText: {
    fontSize: ProEstoqueTheme.typography.caption,
    fontWeight: '700',
  },
  emptyState: {
    paddingTop: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ProEstoqueTheme.spacing.sm,
  },
  emptyTitle: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h3,
    fontWeight: '700',
  },
  emptyText: {
    color: ProEstoqueTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: ProEstoqueTheme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 92,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
});