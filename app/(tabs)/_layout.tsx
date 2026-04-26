import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colors, ProEstoqueTheme } from '@/src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: ProEstoqueTheme.colors.surface,
          borderTopColor: ProEstoqueTheme.colors.borderDefault,
          borderTopWidth: 1,
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        sceneStyle: {
          backgroundColor: ProEstoqueTheme.colors.background,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons size={size} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size }) => <Ionicons size={size} name="folder" color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => <Ionicons size={size} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
