import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { ProEstoqueTheme } from '@/src/constants/theme';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ProEstoqueTheme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={ProEstoqueTheme.colors.brandPrimary} />
      </View>
    );
  }

  const estaNoGrupoAuth = segments[0] === '(auth)';

  if (!isAuthenticated && !estaNoGrupoAuth) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isAuthenticated && estaNoGrupoAuth) {
    return <Redirect href="/(tabs)" />;
  }

  return null;
}

function AppShell() {
  const { isLoading } = useAuth();

  return (
    <>
      <NavigationGuard />
      {!isLoading ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      ) : null}
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <AppShell />
        <StatusBar style="dark" />
      </ThemeProvider>
    </AuthProvider>
  );
}
