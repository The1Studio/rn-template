import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  Spacer,
  Spacing,
  Text,
  Typography,
  toast,
} from '../../lib';
import { colors, useCounter } from '../../core';

export default function HomeScreen() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text variant="h1">Home</Text>
        <Text variant="caption">Welcome to the app</Text>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">Counter Example</Text>
          <Text variant="caption">Using useCounter hook from @repo/core</Text>

          <Spacer size={Spacing.md} />

          <Text style={Typography.h1}>{count}</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.row}>
            <Button title="-" onPress={decrement} variant="outline" />
            <Spacer size={Spacing.sm} horizontal />
            <Button title="Reset" onPress={reset} variant="secondary" />
            <Spacer size={Spacing.sm} horizontal />
            <Button title="+" onPress={increment} />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        <Card style={styles.card}>
          <Text variant="h2">Toast Demo</Text>
          <Text variant="caption">Test toast notifications</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.row}>
            <Button
              title="Success"
              onPress={() =>
                toast.success({
                  title: 'Operation completed!',
                  position: 'bottom',
                })
              }
            />
            <Spacer size={Spacing.sm} horizontal />
            <Button
              title="Error"
              onPress={() => toast.error({ title: 'Something went wrong' })}
              variant="secondary"
            />
            <Spacer size={Spacing.sm} horizontal />
            <Button
              title="Info"
              onPress={() =>
                toast.info({
                  title: 'Here is some information',
                  position: 'bottom',
                })
              }
              variant="outline"
            />
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
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
