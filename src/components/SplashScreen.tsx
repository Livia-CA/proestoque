import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { LogoProEstoque } from '@/src/components/LogoProEstoque';
import { ProEstoqueTheme } from '@/src/constants/theme';

export function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
      progress.setValue(0);
    };
  }, [progress]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['18%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <LogoProEstoque size="lg" />
          <View style={styles.brandTextWrap}>
            <Text style={styles.title}>ProEstoque</Text>
            <Text style={styles.subtitle}>Organizando seu estoque com clareza</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: barWidth }]} />
        </View>

        <Text style={styles.caption}>Carregando sua sessão...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ProEstoqueTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ProEstoqueTheme.spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: ProEstoqueTheme.colors.surface,
    borderRadius: ProEstoqueTheme.radius.lg,
    borderWidth: 1,
    borderColor: ProEstoqueTheme.colors.borderDefault,
    padding: ProEstoqueTheme.spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ProEstoqueTheme.spacing.md,
    marginBottom: ProEstoqueTheme.spacing.xl,
  },
  brandTextWrap: {
    flex: 1,
  },
  title: {
    color: ProEstoqueTheme.colors.textPrimary,
    fontSize: ProEstoqueTheme.typography.h2,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: ProEstoqueTheme.spacing.xs,
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
  },
  progressTrack: {
    height: 12,
    borderRadius: ProEstoqueTheme.radius.pill,
    backgroundColor: ProEstoqueTheme.colors.brandPrimarySoft,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: ProEstoqueTheme.radius.pill,
    backgroundColor: ProEstoqueTheme.colors.brandPrimary,
  },
  caption: {
    marginTop: ProEstoqueTheme.spacing.md,
    color: ProEstoqueTheme.colors.textSecondary,
    fontSize: ProEstoqueTheme.typography.bodySm,
    textAlign: 'center',
  },
});
