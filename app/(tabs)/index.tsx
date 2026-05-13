import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, type ComponentProps } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/contexts/AuthContext';
import { ProEstoqueTheme } from '@/src/constants/theme';
import {
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  PRODUTOS_MOCK,
} from '@/src/data/mockData';
import type { Produto } from '@/src/types';

type StatusProduto = 'normal' | 'baixo' | 'sem-estoque';
type CardIconName = ComponentProps<typeof Ionicons>['name'];

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

const formatarDataHoje = (): string => {
  const data = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());

  return data.charAt(0).toUpperCase() + data.slice(1);
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const nomeUsuario = user?.nome?.split(' ')[0] ?? 'Usuário';

  const produtosComEstoqueBaixo = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotalEstoque = useMemo(() => getValorTotalEstoque(), []);
  const produtosRecentes = useMemo(
    () =>
      [...PRODUTOS_MOCK]
        .sort(
          (a, b) =>
            new Date(b.ultimaMovimentacao).getTime() -
            new Date(a.ultimaMovimentacao).getTime(),
        )
        .slice(0, 8),
    [],
  );

  const cardsResumo = useMemo(
    () => [
      {
        id: 'total',
        label: 'Produtos',
        valor: String(PRODUTOS_MOCK.length),
        icon: 'cube-outline' as CardIconName,
      },
      {
        id: 'alertas',
        label: 'Alertas',
        valor: String(produtosComEstoqueBaixo.length),
        icon: 'warning-outline' as CardIconName,
      },
      {
        id: 'categorias',
        label: 'Categorias',
        valor: '5',
        icon: 'grid-outline' as CardIconName,
      },
      {
        id: 'valor',
        label: 'Em estoque',
        valor: formatarPreco(valorTotalEstoque),
        icon: 'cash-outline' as CardIconName,
      },
    ],
    [produtosComEstoqueBaixo.length, valorTotalEstoque],
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

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
        data={produtosRecentes}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ProEstoqueTheme.colors.brandPrimary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={styles.topAccent} />
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{saudacao}, {nomeUsuario} 👋</Text>
                <Text style={styles.subtitle}>{formatarDataHoje()}</Text>
              </View>

              <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                <Ionicons name="add" size={22} color={ProEstoqueTheme.colors.textInverse} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardsGrid}>
              {cardsResumo.map((card) => (
                <View key={card.id} style={styles.card}>
                  <Ionicons name={card.icon} size={18} color={ProEstoqueTheme.colors.brandPrimary} />
                  <Text style={styles.cardValor}>{card.valor}</Text>
                  <Text style={styles.cardLabel}>{card.label}</Text>
                </View>
              ))}
            </View>

            {produtosComEstoqueBaixo.length > 0 ? (
              <View style={styles.alertBox}>
                <Text style={styles.alertTitle}>
                  Estoque critico ({produtosComEstoqueBaixo.length})
                </Text>

                {produtosComEstoqueBaixo.slice(0, 3).map((produto) => (
                  <View key={produto.id} style={styles.alertRow}>
                    <Text style={styles.alertProdutoNome}>{produto.nome}</Text>
                    <Text style={styles.alertQtd}>
                      {produto.quantidade}/{produto.quantidadeMinima}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>Produtos recentes</Text>
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
  },
  subtitle: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    marginTop: ProEstoqueTheme.spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: ProEstoqueTheme.radius.pill,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsGrid: {
    marginTop: ProEstoqueTheme.spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: ProEstoqueTheme.spacing.sm,
  },
  card: {
    width: '48.5%',
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderRadius: ProEstoqueTheme.radius.md,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    padding: ProEstoqueTheme.spacing.md,
  },
  cardValor: {
    marginTop: ProEstoqueTheme.spacing.sm,
    color: ProEstoqueTheme.colors.textPrimary,
    fontWeight: '700',
    fontSize: ProEstoqueTheme.typography.h3,
  },
  cardLabel: {
    marginTop: ProEstoqueTheme.spacing.xs,
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  alertBox: {
    marginTop: ProEstoqueTheme.spacing.lg,
    borderRadius: ProEstoqueTheme.radius.md,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    padding: ProEstoqueTheme.spacing.md,
  },
  alertTitle: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: ProEstoqueTheme.typography.body,
  },
  alertRow: {
    marginTop: ProEstoqueTheme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertProdutoNome: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    flexShrink: 1,
    marginRight: ProEstoqueTheme.spacing.md,
  },
  alertQtd: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  sectionTitle: {
    marginTop: ProEstoqueTheme.spacing.xl,
    marginBottom: ProEstoqueTheme.spacing.md,
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h3,
    fontWeight: '700',
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
});
