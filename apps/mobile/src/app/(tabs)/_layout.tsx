import { Tabs, Redirect } from 'expo-router';
import {
  Platform,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { colors } from '../../core';
import { useAuthStore } from '@/stores';

export default function TabLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Storage',
          tabBarIcon: ({ color }) => <TabIcon name="storage" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Stores',
          tabBarIcon: ({ color }) => <TabIcon name="stores" color={color} />,
        }}
      />
      <Tabs.Screen
        name="api-test"
        options={{
          title: 'API',
          tabBarIcon: ({ color }) => <TabIcon name="api" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Simple text-based icon component (replace with actual icons later)
function TabIcon({ name, color: _color }: { name: string; color: string }) {
  const icons: Record<string, string> = {
    home: '🏠',
    storage: '💾',
    stores: '📦',
    api: '🌐',
  };

  return <Text style={{ fontSize: 24 }}>{icons[name] || '📱'}</Text>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});
