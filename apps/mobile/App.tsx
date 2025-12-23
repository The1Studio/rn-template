import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

// Import from @repo/core
import { useCounter, useToggle, formatCurrency, colors } from '@repo/core';

// Import from @repo/ui
import { Button, Card, Text, Spacer } from '@repo/ui';

export default function App() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [isDarkMode, toggleDarkMode] = useToggle(false);

  const price = formatCurrency(99.99);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#1e293b' : colors.background },
      ]}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      <Text variant="h1" color={isDarkMode ? '#fff' : undefined}>
        Monorepo Demo
      </Text>

      <Spacer size={24} />

      <Card style={styles.card}>
        <Text variant="h2">Counter Example</Text>
        <Text variant="caption">Using useCounter hook from @repo/core</Text>

        <Spacer size={16} />

        <Text variant="h1" style={styles.counter}>
          {count}
        </Text>

        <Spacer size={16} />

        <View style={styles.row}>
          <Button title="-" onPress={decrement} variant="outline" />
          <Spacer size={12} horizontal />
          <Button title="Reset" onPress={reset} variant="secondary" />
          <Spacer size={12} horizontal />
          <Button title="+" onPress={increment} />
        </View>
      </Card>

      <Spacer size={16} />

      <Card style={styles.card}>
        <Text variant="h2">Format Utils</Text>
        <Text variant="caption">Using formatCurrency from @repo/core</Text>
        <Spacer size={8} />
        <Text variant="body">Price: {price}</Text>
      </Card>

      <Spacer size={16} />

      <Button
        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        onPress={toggleDarkMode}
        variant="outline"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  counter: {
    fontSize: 48,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
