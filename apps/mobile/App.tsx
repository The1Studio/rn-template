import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

// Import from @repo/core
import { useCounter, useToggle, formatCurrency, colors } from "@repo/core";
import {
  Button,
  Card,
  heightPercentageToDP,
  Spacer,
  Spacing,
  Text,
  Typography,
} from "@repo/ui";

export default function App() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  const price = formatCurrency(99.99);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1e293b" : colors.background },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      <Text variant="h1" color={isDarkMode ? "#fff" : undefined}>
        Monorepo Demo
      </Text>

      <Spacer size={Spacing.lg} />

      <Card style={styles.card}>
        <Text variant="h2">Counter Example</Text>
        <Text variant="caption">Using useCounter hook from @repo/core</Text>

        <Spacer size={Spacing.md} />

        <Text style={Typography.h1}>{count}</Text>

        {/* <Spacer size={Spacing.md} /> */}

        <View style={styles.row}>
          <Button title="-" onPress={decrement} variant="outline" />
          <Spacer size={Spacing.sm} horizontal />
          <Button title="Reset" onPress={reset} variant="secondary" />
          <Spacer size={Spacing.sm} horizontal />
          <Button title="+" onPress={increment} />
        </View>
      </Card>

      <Spacer size={Spacing.md} />

      <Card style={styles.card}>
        <Text variant="h2">Format Utils</Text>
        <Text variant="caption">Using formatCurrency from @repo/core</Text>
        <Spacer size={Spacing.sm} />
        <Text variant="body">Price: {price}</Text>
      </Card>

      <Spacer size={Spacing.md} />

      <Button
        title={isDarkMode ? "Light Mode" : "Dark Mode"}
        onPress={toggleDarkMode}
        variant="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
