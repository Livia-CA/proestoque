import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, type Resolver } from 'react-hook-form';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Button } from '@/src/components/Button';
import { ImagePickerField } from '@/src/components/ImagePickerField';
import { Input } from '@/src/components/Input';
import { ProEstoqueTheme } from '@/src/constants/theme';
import { useProducts } from '@/src/contexts/ProductsContext';
import { CATEGORIAS_MOCK } from '@/src/data/mockData';
import { produtoSchema, unidadesProduto, type ProdutoFormData } from '@/src/schemas/produtoSchema';

type ProductFormProps = {
  produtoId?: string;
};

const defaultValues: any = {
  nome: '',
  categoriaId: '',
  quantidade: undefined,
  quantidadeMinima: undefined,
  preco: undefined,
  foto: undefined,
  unidade: 'un',
  observacao: '',
};

export function ProductForm({ produtoId }: ProductFormProps) {
  const modoEdicao = Boolean(produtoId);
  const { adicionarProduto, editarProduto, deletarProduto, getProdutoById, isLoading } = useProducts();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema) as unknown as Resolver<ProdutoFormData>,
    defaultValues,
    mode: 'onTouched',
  });

  const produtoAtual = useMemo(
    () => (produtoId ? getProdutoById(produtoId) : undefined),
    [getProdutoById, produtoId],
  );

  useEffect(() => {
    if (!modoEdicao || !produtoAtual) {
      return;
    }

    reset({
      nome: produtoAtual.nome,
      categoriaId: produtoAtual.categoriaId,
      quantidade: produtoAtual.quantidade,
      quantidadeMinima: produtoAtual.quantidadeMinima,
      preco: produtoAtual.preco,
        foto: produtoAtual.foto ?? undefined,
      unidade: produtoAtual.unidade as ProdutoFormData['unidade'],
      observacao: produtoAtual.observacao ?? '',
    });
  }, [modoEdicao, produtoAtual, reset]);

  const onSubmit = async (data: ProdutoFormData) => {
    if (modoEdicao && produtoId) {
      await editarProduto(produtoId, data);
    } else {
      await adicionarProduto(data);
    }

    router.back();
  };

  const confirmarExclusao = () => {
    if (!produtoId) {
      return;
    }

    Alert.alert('Excluir produto', 'Esta ação não pode ser desfeita. Deseja continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await deletarProduto(produtoId);
          router.back();
        },
      },
    ]);
  };

  if (modoEdicao && !isLoading && !produtoAtual) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="alert-circle-outline" size={40} color={ProEstoqueTheme.colors.danger} />
        <Text style={styles.emptyTitle}>Produto não encontrado</Text>
        <Text style={styles.emptyText}>Verifique o item selecionado e volte para a lista.</Text>
        <Button title="Voltar" onPress={() => router.back()} fullWidth />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <Controller
        control={control}
        name="nome"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nome do produto *"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.nome?.message}
            autoCapitalize="sentences"
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Categoria *</Text>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field: { value, onChange } }) => (
            <View style={styles.chipsWrap}>
              {CATEGORIAS_MOCK.map((categoria) => {
                const isActive = value === categoria.id;

                return (
                  <TouchableOpacity
                    key={categoria.id}
                    activeOpacity={0.85}
                    onPress={() => onChange(categoria.id)}
                    style={[styles.chip, isActive && styles.chipActive]}>
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {categoria.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.categoriaId?.message ? <Text style={styles.errorText}>{errors.categoriaId.message}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Foto do produto</Text>
        <Controller
          control={control}
          name="foto"
          render={({ field: { value, onChange } }) => (
            <ImagePickerField value={value ?? null} onChange={(uri) => onChange(uri ?? undefined)} />
          )}
        />
      </View>

      <Controller
        control={control}
        name="quantidade"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Quantidade em estoque *"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange((text === '' ? undefined : Number(text)) as any)}
            onBlur={onBlur}
            error={errors.quantidade?.message}
            keyboardType="numeric"
          />
        )}
      />

      <Controller
        control={control}
        name="quantidadeMinima"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Quantidade mínima *"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange((text === '' ? undefined : Number(text)) as any)}
            onBlur={onBlur}
            error={errors.quantidadeMinima?.message}
            keyboardType="numeric"
          />
        )}
      />

      <Controller
        control={control}
        name="preco"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Preço (R$) *"
            value={value === undefined ? '' : String(value)}
            onChangeText={(text) => onChange((text === '' ? undefined : Number(text.replace(',', '.'))) as any)}
            onBlur={onBlur}
            error={errors.preco?.message}
            keyboardType="decimal-pad"
          />
        )}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Unidade *</Text>
        <Controller
          control={control}
          name="unidade"
          render={({ field: { value, onChange } }) => (
            <View style={styles.chipsWrap}>
              {unidadesProduto.map((unidade) => {
                const isActive = value === unidade;

                return (
                  <TouchableOpacity
                    key={unidade}
                    activeOpacity={0.85}
                    onPress={() => onChange(unidade)}
                    style={[styles.chip, isActive && styles.chipActive]}>
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{unidade}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        />
        {errors.unidade?.message ? <Text style={styles.errorText}>{errors.unidade.message}</Text> : null}
      </View>

      <Controller
        control={control}
        name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Observação (opcional)"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.observacao?.message}
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />
        )}
      />

      <View style={styles.actions}>
        <Button
          title={modoEdicao ? 'Salvar alterações' : 'Cadastrar produto'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />

        {modoEdicao ? (
          <Button title="Excluir produto" onPress={confirmarExclusao} variant="outline" fullWidth />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  container: {
    padding: ProEstoqueTheme.spacing.lg,
    gap: ProEstoqueTheme.spacing.md,
    paddingBottom: ProEstoqueTheme.spacing.xxl,
  },
  section: {
    gap: ProEstoqueTheme.spacing.sm,
  },
  sectionLabel: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '700',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ProEstoqueTheme.spacing.sm,
  },
  chip: {
    paddingHorizontal: ProEstoqueTheme.spacing.md,
    paddingVertical: ProEstoqueTheme.spacing.sm,
    borderRadius: ProEstoqueTheme.radius.pill,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    backgroundColor: ProEstoqueTheme.colors.surface,
  },
  chipActive: {
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
    borderColor: ProEstoqueTheme.colors.brandPrimary,
  },
  chipText: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    fontWeight: '700',
  },
  chipTextActive: {
    color: ProEstoqueTheme.colors.textInverse,
  },
  textArea: {
    minHeight: 96,
    paddingTop: ProEstoqueTheme.spacing.md,
  },
  actions: {
    gap: ProEstoqueTheme.spacing.sm,
    marginTop: ProEstoqueTheme.spacing.sm,
  },
  errorText: {
    color: ProEstoqueTheme.colors.danger,
    fontSize: ProEstoqueTheme.typography.caption,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ProEstoqueTheme.spacing.xl,
    gap: ProEstoqueTheme.spacing.sm,
    backgroundColor: ProEstoqueTheme.colors.background,
  },
  emptyTitle: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h3,
    fontWeight: '700',
  },
  emptyText: {
    color: ProEstoqueTheme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: ProEstoqueTheme.spacing.md,
  },
});