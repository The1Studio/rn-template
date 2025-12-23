import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Spacer, Spacing, Text } from "../../lib";
import { colors, formatCurrency, formatDate } from "../../core";

export default function ExploreScreen() {
  const samplePrice = formatCurrency(99.99);
  const sampleDate = formatDate(new Date());

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="h1">Explore</Text>
        <Text variant="caption">Discover features from @repo/core</Text>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">Format Utils</Text>
          <Spacer size={Spacing.sm} />
          <Text variant="body">Price: {samplePrice}</Text>
          <Text variant="body">Date: {sampleDate}</Text>
        </Card>

        <Spacer size={Spacing.md} />

        <Card style={styles.card}>
          <Text variant="h2">Color Palette</Text>
          <Spacer size={Spacing.sm} />
          <View style={styles.colorGrid}>
            <ColorSwatch name="Primary" color={colors.primary} />
            <ColorSwatch name="Secondary" color={colors.secondary} />
            <ColorSwatch name="Success" color={colors.success} />
            <ColorSwatch name="Warning" color={colors.warning} />
            <ColorSwatch name="Error" color={colors.error} />
          </View>
        </Card>

        <Spacer size={Spacing.md} />

        <Card style={styles.card}>
          <Text variant="h2">Spacing System</Text>
          <Spacer size={Spacing.sm} />
          <SpacingDemo name="xs" size={Spacing.xs} />
          <SpacingDemo name="sm" size={Spacing.sm} />
          <SpacingDemo name="md" size={Spacing.md} />
          <SpacingDemo name="lg" size={Spacing.lg} />
          <SpacingDemo name="xl" size={Spacing.xl} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  return (
    <View style={styles.colorSwatch}>
      <View style={[styles.colorBox, { backgroundColor: color }]} />
      <Text variant="caption">{name}</Text>
    </View>
  );
}

function SpacingDemo({ name, size }: { name: string; size: number }) {
  return (
    <View style={styles.spacingRow}>
      <Text variant="caption" style={styles.spacingLabel}>
        {name}
      </Text>
      <View style={[styles.spacingBar, { width: size * 3 }]} />
      <Text variant="caption">{size}px</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  colorSwatch: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  spacingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginVertical: Spacing.xs,
  },
  spacingLabel: {
    width: 30,
  },
  spacingBar: {
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
