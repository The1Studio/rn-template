import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CollapsibleCard, Spacer, Spacing, Text } from '../../lib';
import {
  colors,
  // Format functions
  formatCurrency,
  formatNumber,
  formatPercentage,
  capitalize,
  truncate,
  // Date functions
  DateFormats,
  formatDate,
  formatRelative,
  formatCalendar,
  formatDuration,
  formatSmart,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addTime,
  subtractTime,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  isValidDate,
  getDiff,
  getAge,
  now,
} from '../../core';

export default function HomeScreen() {
  const currentDate = now();
  const pastDate = subtractTime(currentDate, 2, 'days');
  const futureDate = addTime(currentDate, 5, 'days');
  const birthDate = new Date('1995-05-20');
  const longText =
    'This is a very long text that should be truncated to show the truncate function working properly';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1">Home</Text>
        <Text variant="caption">Core Utilities Demo</Text>

        <Spacer size={Spacing.lg} />

        {/* Format Utilities */}
        <CollapsibleCard title="Format Utilities" defaultExpanded>
          <View style={styles.demoList}>
            <Text variant="body" style={styles.sectionTitle}>
              Number Formatting
            </Text>

            <DemoRow
              label="formatCurrency(1234.5)"
              value={formatCurrency(1234.5)}
            />
            <DemoRow
              label="formatCurrency(1234.5, 'EUR')"
              value={formatCurrency(1234.5, 'EUR')}
            />
            <DemoRow
              label="formatNumber(1234567)"
              value={formatNumber(1234567)}
            />
            <DemoRow
              label="formatNumber(1234.567, 2)"
              value={formatNumber(1234.567, 2)}
            />
            <DemoRow
              label="formatPercentage(75)"
              value={formatPercentage(75)}
            />
            <DemoRow
              label="formatPercentage(33.33, 1)"
              value={formatPercentage(33.33, 1)}
            />

            <Spacer size={Spacing.md} />
            <Text variant="body" style={styles.sectionTitle}>
              String Formatting
            </Text>

            <DemoRow
              label="capitalize('hello WORLD')"
              value={capitalize('hello WORLD')}
            />
            <DemoRow
              label="truncate(longText, 30)"
              value={truncate(longText, 30)}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Date Formatting */}
        <CollapsibleCard title="Date Formatting">
          <View style={styles.demoList}>
            <DemoRow
              label="DATE_SHORT"
              value={formatDate(currentDate, DateFormats.DATE_SHORT)}
            />
            <DemoRow
              label="DATE_MEDIUM"
              value={formatDate(currentDate, DateFormats.DATE_MEDIUM)}
            />
            <DemoRow
              label="DATE_LONG"
              value={formatDate(currentDate, DateFormats.DATE_LONG)}
            />
            <DemoRow
              label="DATE_US"
              value={formatDate(currentDate, DateFormats.DATE_US)}
            />
            <DemoRow
              label="DATE_ISO"
              value={formatDate(currentDate, DateFormats.DATE_ISO)}
            />
            <DemoRow
              label="TIME_12H"
              value={formatDate(currentDate, DateFormats.TIME_12H)}
            />
            <DemoRow
              label="TIME_24H"
              value={formatDate(currentDate, DateFormats.TIME_24H)}
            />
            <DemoRow
              label="DATETIME_12H"
              value={formatDate(currentDate, DateFormats.DATETIME_12H)}
            />
            <DemoRow
              label="WEEKDAY"
              value={formatDate(currentDate, DateFormats.WEEKDAY)}
            />
            <DemoRow
              label="MONTH_YEAR"
              value={formatDate(currentDate, DateFormats.MONTH_YEAR)}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Smart Date Functions */}
        <CollapsibleCard title="Smart Date Functions">
          <View style={styles.demoList}>
            <DemoRow
              label="formatSmart(now)"
              value={formatSmart(currentDate)}
            />
            <DemoRow
              label="formatSmart(yesterday)"
              value={formatSmart(subtractTime(currentDate, 1, 'day'))}
            />
            <DemoRow
              label="formatRelative(2 days ago)"
              value={formatRelative(pastDate)}
            />
            <DemoRow
              label="formatRelative(in 5 days)"
              value={formatRelative(futureDate)}
            />
            <DemoRow
              label="formatCalendar(now)"
              value={formatCalendar(currentDate)}
            />
            <DemoRow
              label="formatDuration(now, +3h)"
              value={formatDuration(
                currentDate,
                addTime(currentDate, 3, 'hours')
              )}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Date Boundaries */}
        <CollapsibleCard title="Date Boundaries">
          <View style={styles.demoList}>
            <DemoRow
              label="startOfDay"
              value={formatDate(
                startOfDay(currentDate),
                DateFormats.DATETIME_SHORT
              )}
            />
            <DemoRow
              label="endOfDay"
              value={formatDate(
                endOfDay(currentDate),
                DateFormats.DATETIME_SHORT
              )}
            />
            <DemoRow
              label="startOfMonth"
              value={formatDate(
                startOfMonth(currentDate),
                DateFormats.DATE_MEDIUM
              )}
            />
            <DemoRow
              label="endOfMonth"
              value={formatDate(
                endOfMonth(currentDate),
                DateFormats.DATE_MEDIUM
              )}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Date Manipulation */}
        <CollapsibleCard title="Date Manipulation">
          <View style={styles.demoList}>
            <DemoRow
              label="addTime(now, 7, 'days')"
              value={formatDate(
                addTime(currentDate, 7, 'days'),
                DateFormats.DATE_MEDIUM
              )}
            />
            <DemoRow
              label="addTime(now, 2, 'months')"
              value={formatDate(
                addTime(currentDate, 2, 'months'),
                DateFormats.DATE_MEDIUM
              )}
            />
            <DemoRow
              label="subtractTime(now, 1, 'year')"
              value={formatDate(
                subtractTime(currentDate, 1, 'year'),
                DateFormats.DATE_MEDIUM
              )}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Date Checks */}
        <CollapsibleCard title="Date Checks">
          <View style={styles.demoList}>
            <DemoRow
              label="isToday(now)"
              value={isToday(currentDate) ? 'Yes' : 'No'}
            />
            <DemoRow
              label="isYesterday(yesterday)"
              value={
                isYesterday(subtractTime(currentDate, 1, 'day')) ? 'Yes' : 'No'
              }
            />
            <DemoRow
              label="isTomorrow(tomorrow)"
              value={isTomorrow(addTime(currentDate, 1, 'day')) ? 'Yes' : 'No'}
            />
            <DemoRow
              label="isPast(2 days ago)"
              value={isPast(pastDate) ? 'Yes' : 'No'}
            />
            <DemoRow
              label="isFuture(5 days later)"
              value={isFuture(futureDate) ? 'Yes' : 'No'}
            />
            {/* <DemoRow
              label="isValidDate('invalid')"
              value={isValidDate('invalid') ? 'Yes' : 'No'}
            /> */}
            <DemoRow
              label="isValidDate(now)"
              value={isValidDate(currentDate) ? 'Yes' : 'No'}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.md} />

        {/* Date Calculations */}
        <CollapsibleCard title="Date Calculations">
          <View style={styles.demoList}>
            <DemoRow
              label="getDiff(now, pastDate, 'days')"
              value={`${getDiff(currentDate, pastDate, 'days')} days`}
            />
            <DemoRow
              label="getDiff(futureDate, now, 'days')"
              value={`${getDiff(futureDate, currentDate, 'days')} days`}
            />
            <DemoRow
              label="getAge('1995-05-20')"
              value={`${getAge(birthDate)} years`}
            />
          </View>
        </CollapsibleCard>

        <Spacer size={Spacing.lg} />

        {/* Features List */}
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
            <Text variant="body">• Collapsible/expandable cards</Text>
            <Text variant="body">• Radio buttons with form support</Text>
            <Text variant="body">• Date & Format utilities</Text>
          </View>
        </Card>

        <Spacer size={Spacing.lg} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for demo rows
function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.demoRow}>
      <Text variant="caption" style={styles.demoLabel}>
        {label}
      </Text>
      <Text variant="body" style={styles.demoValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
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
  demoList: {
    width: '100%',
    gap: 8,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  demoLabel: {
    flex: 1,
    marginRight: 8,
  },
  demoValue: {
    fontWeight: '600',
    textAlign: 'right',
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 4,
  },
});
