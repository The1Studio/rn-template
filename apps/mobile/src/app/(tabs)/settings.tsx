// import { StyleSheet, View, Switch } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Card, Spacer, Spacing, Text, Button } from "../../lib";
// import { colors, useToggle } from "../../core";

// export default function SettingsScreen() {
//   const [notifications, toggleNotifications] = useToggle(true);
//   const [darkMode, toggleDarkMode] = useToggle(false);
//   const [analytics, toggleAnalytics] = useToggle(true);

//   return (
//     <SafeAreaView style={styles.container} edges={["top"]}>
//       <View style={styles.content}>
//         <Text variant="h1">Settings</Text>
//         <Text variant="caption">Configure your preferences</Text>

//         <Spacer size={Spacing.lg} />

//         <Card style={styles.card}>
//           <Text variant="h2">Preferences</Text>
//           <Spacer size={Spacing.md} />

//           <SettingRow
//             title="Notifications"
//             description="Receive push notifications"
//             value={notifications}
//             onToggle={toggleNotifications}
//           />

//           <Spacer size={Spacing.sm} />

//           <SettingRow
//             title="Dark Mode"
//             description="Enable dark theme"
//             value={darkMode}
//             onToggle={toggleDarkMode}
//           />

//           <Spacer size={Spacing.sm} />

//           <SettingRow
//             title="Analytics"
//             description="Help improve the app"
//             value={analytics}
//             onToggle={toggleAnalytics}
//           />
//         </Card>

//         <Spacer size={Spacing.md} />

//         <Card style={styles.card}>
//           <Text variant="h2">About</Text>
//           <Spacer size={Spacing.sm} />
//           <Text variant="body">Version: 1.0.0</Text>
//           <Text variant="caption">Built with Expo Router + Monorepo</Text>
//         </Card>

//         <Spacer size={Spacing.md} />

//         <Button title="Sign Out" variant="outline" onPress={() => {}} />
//       </View>
//     </SafeAreaView>
//   );
// }

// function SettingRow({
//   title,
//   description,
//   value,
//   onToggle,
// }: {
//   title: string;
//   description: string;
//   value: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <View style={styles.settingRow}>
//       <View style={styles.settingInfo}>
//         <Text variant="body">{title}</Text>
//         <Text variant="caption">{description}</Text>
//       </View>
//       <Switch
//         value={value}
//         onValueChange={onToggle}
//         trackColor={{ false: colors.border, true: colors.primary }}
//         thumbColor={colors.surface}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   content: {
//     flex: 1,
//     padding: Spacing.lg,
//   },
//   card: {
//     width: "100%",
//   },
//   settingRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: Spacing.xs,
//   },
//   settingInfo: {
//     flex: 1,
//   },
// });

import { View, Text, Switch, Pressable, StyleSheet } from "react-native";
import { useAppStore, useAuthStore, useSettingsStore } from "@/stores";

export default function SettingsScreen() {
  // App Store
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  // Auth Store
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  // Settings Store
  const { language, notificationsEnabled, toggleNotifications, setLanguage } =
    useSettingsStore();

  // Mock login
  const handleLogin = () => {
    login(
      { id: "1", email: "user@example.com", name: "John Doe" },
      "mock-token-123"
    );
  };

  return (
    <View style={styles.container}>
      {/* Auth Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {isAuthenticated ? (
          <>
            <Text>Welcome, {user?.name}</Text>
            <Text>Email: {user?.email}</Text>
            <Pressable style={styles.button} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </>
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>
        )}
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme: {theme}</Text>
        <View style={styles.row}>
          {(["light", "dark", "system"] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.chip, theme === t && styles.chipActive]}
              onPress={() => setTheme(t)}
            >
              <Text>{t}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.row}>
          <Text>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
          />
        </View>

        <View style={styles.row}>
          <Text>Language: {language}</Text>
          <Pressable
            onPress={() => setLanguage(language === "en" ? "vi" : "en")}
          >
            <Text style={styles.link}>
              Switch to {language === "en" ? "VI" : "EN"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#007AFF" },
  link: { color: "#007AFF" },
});
