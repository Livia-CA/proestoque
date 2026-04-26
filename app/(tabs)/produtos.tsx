import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
    FlatList,
    ScrollView,
    SectionList,
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
type LayoutSimples = 'lista' | 'grade';
type Agrupamento = 'none' | 'categoria' | 'status';

type ProdutoSecao = {
  id: string;
  titulo: string;
  data: Produto[];
};

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
  const [layoutSimples, setLayoutSimples] = useState<LayoutSimples>('lista');
  const [agrupamento, setAgrupamento] = useState<Agrupamento>('none');
  const [menuAgrupamentoAberto, setMenuAgrupamentoAberto] = useState(false);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return PRODUTOS_MOCK.filter((produto) => {
      const passouCategoria =
        categoriaSelecionada === 'todos' || produto.categoriaId === categoriaSelecionada;
      const passouBusca = !termo || produto.nome.toLowerCase().includes(termo);

      return passouCategoria && passouBusca;
    }).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [busca, categoriaSelecionada]);

  const secoesProdutos = useMemo<ProdutoSecao[]>(() => {
    if (agrupamento === 'none') {
      return [];
    }

    if (agrupamento === 'categoria') {
      return CATEGORIAS_MOCK.map((categoria) => ({
        id: categoria.id,
        titulo: categoria.nome,
        data: produtosFiltrados.filter((produto) => produto.categoriaId === categoria.id),
      })).filter((secao) => secao.data.length > 0);
    }

    const secoesStatus: Array<{ id: StatusProduto; titulo: string }> = [
      { id: 'sem-estoque', titulo: 'Sem estoque' },
      { id: 'baixo', titulo: 'Estoque baixo' },
      { id: 'normal', titulo: 'Estoque normal' },
    ];

    return secoesStatus
      .map((status) => ({
        id: status.id,
        titulo: status.titulo,
        data: produtosFiltrados.filter((produto) => getStatusProduto(produto) === status.id),
      }))
      .filter((secao) => secao.data.length > 0);
  }, [agrupamento, produtosFiltrados]);

  const labelAgrupamento = useMemo(() => {
    if (agrupamento === 'categoria') {
      return 'Categoria';
    }

    if (agrupamento === 'status') {
      return 'Status';
    }

    return 'Não agrupar';
  }, [agrupamento]);

  const renderBadgeStatus = (produto: Produto) => {
    const status = getStatusProduto(produto);
    const statusStyle = STATUS_STYLE[status];

    return (
      <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
        <Text style={[styles.badgeText, { color: statusStyle.color }]}>{statusStyle.label}</Text>
      </View>
    );
  };

  const renderProdutoLista = ({ item }: { item: Produto }) => {
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

        {renderBadgeStatus(item)}
      </View>
    );
  };

  const renderProdutoGrade = ({ item }: { item: Produto }) => {
    return (
      <View style={styles.produtoCardGrade}>
        <View style={styles.produtoIconeGrade}>
          <Ionicons name="cube-outline" size={18} color={ProEstoqueTheme.colors.brandPrimary} />
        </View>

        <Text style={styles.produtoNomeGrade} numberOfLines={2}>
          {item.nome}
        </Text>
        <Text style={styles.produtoQtdGrade}>
          {item.quantidade} {item.unidade}
        </Text>

        <View style={styles.badgeGrade}>{renderBadgeStatus(item)}</View>
      </View>
    );
  };

  const listHeader = (
    <View>
      <View style={styles.topAccent} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>Produtos</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setMenuAgrupamentoAberto((prev) => !prev)}
            style={[
              styles.iconToggle,
              agrupamento !== 'none' && styles.iconToggleAtivo,
            ]}>
            <Ionicons
              name={menuAgrupamentoAberto ? 'options' : 'options-outline'}
              size={18}
              color={
                agrupamento !== 'none'
                  ? ProEstoqueTheme.colors.textInverse
                  : ProEstoqueTheme.colors.textSecondary
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={agrupamento !== 'none'}
            onPress={() => setLayoutSimples((prev) => (prev === 'lista' ? 'grade' : 'lista'))}
            style={[
              styles.iconToggle,
              layoutSimples === 'grade' && styles.iconToggleAtivo,
              agrupamento !== 'none' && styles.iconToggleDesabilitado,
            ]}>
            <Ionicons
              name={layoutSimples === 'grade' ? 'grid' : 'list'}
              size={18}
              color={
                agrupamento !== 'none'
                  ? ProEstoqueTheme.colors.borderDefault
                  : layoutSimples === 'grade'
                  ? ProEstoqueTheme.colors.textInverse
                  : ProEstoqueTheme.colors.textSecondary
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      {menuAgrupamentoAberto ? (
        <View style={styles.agrupamentoMenu}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setAgrupamento('none');
              setMenuAgrupamentoAberto(false);
            }}
            style={styles.agrupamentoOpcao}>
            <Text style={styles.agrupamentoOpcaoTexto}>Não agrupar</Text>
            {agrupamento === 'none' ? (
              <Ionicons name="checkmark" size={16} color={ProEstoqueTheme.colors.brandPrimary} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setAgrupamento('categoria');
              setMenuAgrupamentoAberto(false);
            }}
            style={styles.agrupamentoOpcao}>
            <Text style={styles.agrupamentoOpcaoTexto}>Agrupar por categoria</Text>
            {agrupamento === 'categoria' ? (
              <Ionicons name="checkmark" size={16} color={ProEstoqueTheme.colors.brandPrimary} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setAgrupamento('status');
              setMenuAgrupamentoAberto(false);
            }}
            style={styles.agrupamentoOpcao}>
            <Text style={styles.agrupamentoOpcaoTexto}>Agrupar por status</Text>
            {agrupamento === 'status' ? (
              <Ionicons name="checkmark" size={16} color={ProEstoqueTheme.colors.brandPrimary} />
            ) : null}
          </TouchableOpacity>
        </View>
      ) : null}

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
          <Text style={categoriaSelecionada === 'todos' ? styles.chipTextoAtivo : styles.chipTextoInativo}>
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
                categoriaSelecionada === categoria.id ? styles.chipTextoAtivo : styles.chipTextoInativo
              }>
              {categoria.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.viewHint}>
        {agrupamento !== 'none'
          ? `Agrupamento: ${labelAgrupamento}`
          : layoutSimples === 'grade'
            ? 'Visualizacao em grade'
            : 'Visualizacao em lista'}
      </Text>
    </View>
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
      <Text style={styles.emptySubtitle}>Tente ajustar a busca ou o filtro de categoria.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {agrupamento === 'none' ? (
        <FlatList
          key={`simples-${layoutSimples}`}
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={layoutSimples === 'grade' ? renderProdutoGrade : renderProdutoLista}
          numColumns={layoutSimples === 'grade' ? 2 : 1}
          columnWrapperStyle={layoutSimples === 'grade' ? styles.gradeRow : undefined}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyComponent}
        />
      ) : (
        <SectionList
          sections={secoesProdutos}
          keyExtractor={(item) => item.id}
          renderItem={renderProdutoLista}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={listHeader}
          ListEmptyComponent={emptyComponent}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.titulo}</Text>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCountText}>{section.data.length}</Text>
              </View>
            </View>
          )}
        />
      )}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ProEstoqueTheme.spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ProEstoqueTheme.spacing.sm,
  },
  iconToggle: {
    width: 36,
    height: 36,
    borderRadius: ProEstoqueTheme.radius.pill,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    backgroundColor: ProEstoqueTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconToggleAtivo: {
    borderColor: ProEstoqueTheme.colors.brandPrimary,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
  },
  iconToggleDesabilitado: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  agrupamentoMenu: {
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    borderRadius: ProEstoqueTheme.radius.md,
    marginBottom: ProEstoqueTheme.spacing.md,
    overflow: 'hidden',
  },
  agrupamentoOpcao: {
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agrupamentoOpcaoTexto: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  viewHint: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.caption,
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
  gradeRow: {
    justifyContent: 'space-between',
  },
  produtoCardGrade: {
    width: '48.5%',
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderRadius: ProEstoqueTheme.radius.md,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    padding: ProEstoqueTheme.spacing.md,
    marginBottom: ProEstoqueTheme.spacing.sm,
  },
  produtoIconeGrade: {
    width: 34,
    height: 34,
    borderRadius: ProEstoqueTheme.radius.sm,
    backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ProEstoqueTheme.spacing.sm,
  },
  produtoNomeGrade: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '700',
    minHeight: 34,
  },
  produtoQtdGrade: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.caption,
    marginTop: ProEstoqueTheme.spacing.xs,
  },
  badgeGrade: {
    marginTop: ProEstoqueTheme.spacing.sm,
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    backgroundColor: ProEstoqueTheme.colors.background,
    paddingVertical: ProEstoqueTheme.spacing.sm,
    marginTop: ProEstoqueTheme.spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.body,
    fontWeight: '700',
  },
  sectionCountBadge: {
    backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
    borderRadius: ProEstoqueTheme.radius.pill,
    paddingHorizontal: ProEstoqueTheme.spacing.sm,
    paddingVertical: 2,
  },
  sectionCountText: {
    color: ProEstoqueTheme.colors.brandPrimaryDark,
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
