import { StyleSheet, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Spacer, Spacing, Text, Button } from "../../lib";
import { colors, useToggle } from "../../core";

export default function SettingsScreen() {
  const [notifications, toggleNotifications] = useToggle(true);
  const [darkMode, toggleDarkMode] = useToggle(false);
  const [analytics, toggleAnalytics] = useToggle(true);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text variant="h1">Settings</Text>
        <Text variant="caption">Configure your preferences</Text>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">Preferences</Text>
          <Spacer size={Spacing.md} />

          <SettingRow
            title="Notifications"
            description="Receive push notifications"
            value={notifications}
            onToggle={toggleNotifications}
          />

          <Spacer size={Spacing.sm} />

          <SettingRow
            title="Dark Mode"
            description="Enable dark theme"
            value={darkMode}
            onToggle={toggleDarkMode}
          />

          <Spacer size={Spacing.sm} />

          <SettingRow
            title="Analytics"
            description="Help improve the app"
            value={analytics}
            onToggle={toggleAnalytics}
          />
        </Card>

        <Spacer size={Spacing.md} />

        <Card style={styles.card}>
          <Text variant="h2">About</Text>
          <Spacer size={Spacing.sm} />
          <Text variant="body">Version: 1.0.0</Text>
          <Text variant="caption">Built with Expo Router + Monorepo</Text>
        </Card>

        <Spacer size={Spacing.md} />

        <Button title="Sign Out" variant="outline" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

function SettingRow({
  title,
  description,
  value,
  onToggle,
}: {
  title: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text variant="body">{title}</Text>
        <Text variant="caption">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  settingInfo: {
    flex: 1,
  },
});
