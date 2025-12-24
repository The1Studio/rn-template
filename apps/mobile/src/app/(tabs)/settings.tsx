import {
  StyleSheet,
  View,
  ScrollView,
  Switch,
  Pressable,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore, useAuthStore, useSettingsStore } from '@/stores';

export default function SettingsScreen() {
  // Auth Store (persisted with expo-secure-store)
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);

  // App Store (in-memory)
  const theme = useAppStore((state) => state.theme);
  const isLoading = useAppStore((state) => state.isLoading);
  const setTheme = useAppStore((state) => state.setTheme);
  const setLoading = useAppStore((state) => state.setLoading);

  // Settings Store (in-memory)
  const language = useSettingsStore((state) => state.language);
  const notificationsEnabled = useSettingsStore(
    (state) => state.notificationsEnabled
  );
  const biometricEnabled = useSettingsStore((state) => state.biometricEnabled);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const toggleNotifications = useSettingsStore(
    (state) => state.toggleNotifications
  );
  const toggleBiometric = useSettingsStore((state) => state.toggleBiometric);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          // Redirect will happen automatically via tabs _layout.tsx
        },
      },
    ]);
  };

  const handleLoadingDemo = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Zustand Stores</Text>
        <Text style={styles.subtitle}>
          Demo of state management with Zustand
        </Text>

        {/* Auth Store Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>useAuthStore</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Persisted</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            User authentication state persisted with expo-secure-store
          </Text>

          <View style={styles.stateList}>
            <StateRow label="isHydrated" value={String(isHydrated)} />
            <StateRow label="isAuthenticated" value={String(isAuthenticated)} />
            <StateRow label="user.name" value={user?.name || 'null'} />
            <StateRow label="user.email" value={user?.email || 'null'} />
            <StateRow
              label="token"
              value={token ? `${token.substring(0, 15)}...` : 'null'}
            />
          </View>

          {isAuthenticated && (
            <Pressable style={styles.dangerButton} onPress={handleLogout}>
              <Text style={styles.dangerButtonText}>Logout</Text>
            </Pressable>
          )}
        </View>

        {/* App Store Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>useAppStore</Text>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeTextSecondary}>In-Memory</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            App-wide state like theme, loading, online status
          </Text>

          <View style={styles.stateList}>
            <StateRow label="theme" value={theme} />
            <StateRow label="isLoading" value={String(isLoading)} />
          </View>

          <Text style={styles.sectionLabel}>Select Theme</Text>
          <View style={styles.chipRow}>
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Pressable
                key={t}
                style={[styles.chip, theme === t && styles.chipActive]}
                onPress={() => setTheme(t)}
              >
                <Text
                  style={[
                    styles.chipText,
                    theme === t && styles.chipTextActive,
                  ]}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLoadingDemo}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Test Loading State (2s)'}
            </Text>
          </Pressable>
        </View>

        {/* Settings Store Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>useSettingsStore</Text>
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeTextSecondary}>In-Memory</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            User preferences like language, notifications
          </Text>

          <View style={styles.stateList}>
            <StateRow label="language" value={language} />
            <StateRow
              label="notificationsEnabled"
              value={String(notificationsEnabled)}
            />
            <StateRow
              label="biometricEnabled"
              value={String(biometricEnabled)}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingValue}>
                {language === 'en' ? 'English' : 'Vietnamese'}
              </Text>
            </View>
            <Pressable
              style={styles.toggleButton}
              onPress={() => setLanguage(language === 'en' ? 'vi' : 'en')}
            >
              <Text style={styles.toggleButtonText}>
                Switch to {language === 'en' ? 'VI' : 'EN'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Biometric Login</Text>
              <Text style={styles.settingValue}>
                {biometricEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={toggleBiometric}
              trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
            />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Zustand Stores</Text>
          <Text style={styles.infoText}>
            - useAuthStore: Persisted with expo-secure-store{'\n'}- useAppStore:
            In-memory (resets on app restart){'\n'}- useSettingsStore: In-memory
            (add persist if needed)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stateRow}>
      <Text style={styles.stateLabel}>{label}:</Text>
      <Text style={styles.stateValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  badgeSecondary: {
    backgroundColor: '#6c757d',
  },
  badgeTextSecondary: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  stateList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  stateLabel: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'monospace',
  },
  stateValue: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
    fontFamily: 'monospace',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  chipActive: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  chipTextActive: {
    color: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  settingValue: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  toggleButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#e7f3ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#b3d7ff',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004085',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#004085',
    lineHeight: 20,
  },
});
