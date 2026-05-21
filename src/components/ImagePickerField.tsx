import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProEstoqueTheme } from '@/src/constants/theme';

type ImagePickerFieldProps = {
  value: string | null;
  onChange: (uri: string | null) => void;
};

export function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  const [isLoading, setIsLoading] = useState(false);

  const solicitarPermissaoGaleria = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para adicionar uma foto.');
      return false;
    }

    return true;
  };

  const abrirGaleria = async () => {
    if (!(await solicitarPermissaoGaleria())) {
      return;
    }

    setIsLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    setIsLoading(false);

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const abrirCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar uma foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const abrirOpcoes = () => {
    Alert.alert('Foto do produto', 'Escolha uma ação', [
      { text: 'Câmera', onPress: abrirCamera },
      { text: 'Galeria', onPress: abrirGaleria },
      value ? { text: 'Remover foto', style: 'destructive', onPress: () => onChange(null) } : undefined,
      { text: 'Cancelar', style: 'cancel' },
    ].filter(Boolean) as never[]);
  };

  return (
    <Pressable onPress={abrirOpcoes} style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      {value ? (
        <Image source={{ uri: value }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="camera-outline" size={32} color={ProEstoqueTheme.colors.textSecondary} />
          <Text style={styles.placeholderText}>{isLoading ? 'Carregando...' : 'Adicionar foto'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 112,
    height: 112,
    borderRadius: ProEstoqueTheme.radius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    borderStyle: 'dashed',
    backgroundColor: ProEstoqueTheme.colors.surface,
  },
  pressed: {
    opacity: 0.88,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: ProEstoqueTheme.spacing.xs,
    padding: ProEstoqueTheme.spacing.sm,
    backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
  },
  placeholderText: {
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.caption,
    fontWeight: '700',
    textAlign: 'center',
  },
});