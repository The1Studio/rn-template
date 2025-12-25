import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Spacer, Spacing, Text } from '../../lib';
import { colors } from '../../core';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text variant="h1">Home</Text>
        <Text variant="caption">Welcome to the app</Text>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">React Native Template</Text>
          <Spacer size={Spacing.sm} />
          <Text variant="body">
            A monorepo template with shared packages for UI components and core
            utilities.
          </Text>
          <Spacer size={Spacing.md} />
          <Text variant="caption">
            Check out the Playground tab for component demos!
          </Text>
        </Card>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">Features</Text>
          <Spacer size={Spacing.sm} />
          <View style={styles.featureList}>
            <Text variant="body">• Expo Router for navigation</Text>
            <Text variant="body">• React Query for data fetching</Text>
            <Text variant="body">• Zustand for state management</Text>
            <Text variant="body">• React Hook Form for forms</Text>
            <Text variant="body">• Shared UI components</Text>
            <Text variant="body">• Toast notifications</Text>
            <Text variant="body">• Bottom sheet modals</Text>
            <Text variant="body">• Select fields (single & multiple)</Text>
            <Text variant="body">• Confirm & Delete modals</Text>
            <Text variant="body">• Loading skeleton components</Text>
            <Text variant="body">• Checkbox with form validation</Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
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
    alignItems: 'center',
  },
  card: {
    width: '100%',
  },
  featureList: {
    alignItems: 'flex-start',
    gap: 4,
  },
});
