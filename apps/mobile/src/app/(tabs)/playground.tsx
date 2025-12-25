import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  Button,
  Card,
  FormSelectField,
  FormSelectMultiple,
  SelectField,
  SelectMultiple,
  Spacer,
  Spacing,
  Text,
  Typography,
  toast,
} from '../../lib';
import { colors, useCounter } from '../../core';

interface FormData {
  language: string;
  experience: string;
}

interface MultiSelectFormData {
  technologies: string[];
  frameworks: string[];
}

export default function PlaygroundScreen() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showScrollableSheet, setShowScrollableSheet] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const countryOptions = [
    { label: 'Vietnam', value: 'vn' },
    { label: 'United States', value: 'us' },
    { label: 'Japan', value: 'jp' },
    { label: 'South Korea', value: 'kr' },
    { label: 'Singapore', value: 'sg' },
  ];

  const languageOptions = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
  ];

  const experienceOptions = [
    { label: 'Junior (0-2 years)', value: 'junior' },
    { label: 'Mid-level (2-5 years)', value: 'mid' },
    { label: 'Senior (5+ years)', value: 'senior' },
  ];

  const skillOptions = [
    { label: 'React', value: 'react' },
    { label: 'React Native', value: 'rn' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Node.js', value: 'node' },
    { label: 'GraphQL', value: 'graphql' },
    { label: 'Docker', value: 'docker' },
  ];

  const technologyOptions = [
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'DevOps', value: 'devops' },
    { label: 'Database', value: 'database' },
  ];

  const frameworkOptions = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Next.js', value: 'nextjs' },
    { label: 'Express', value: 'express' },
    { label: 'NestJS', value: 'nestjs' },
  ];

  const { control, handleSubmit } = useForm<FormData>();
  const {
    control: multiControl,
    handleSubmit: handleMultiSubmit,
  } = useForm<MultiSelectFormData>();

  const onSubmit = (data: FormData) => {
    toast.success({
      title: 'Form Submitted!',
      message: `Language: ${data.language}, Experience: ${data.experience}`,
    });
  };

  const onMultiSubmit = (data: MultiSelectFormData) => {
    toast.success({
      title: 'Multi-Select Form Submitted!',
      message: `Technologies: ${data.technologies?.join(', ') || 'None'}, Frameworks: ${data.frameworks?.join(', ') || 'None'}`,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="h1">Playground</Text>
        <Text variant="caption">Component demos and examples</Text>

        <Spacer size={Spacing.lg} />

        {/* Counter Demo */}
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

        {/* Toast Demo */}
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

        <Spacer size={Spacing.lg} />

        {/* Bottom Sheet Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Bottom Sheet Demo</Text>
          <Text variant="caption">Test bottom sheet modal</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.row}>
            <Button title="Simple" onPress={() => setShowBottomSheet(true)} />
            <Spacer size={Spacing.sm} horizontal />
            <Button
              title="Scrollable"
              onPress={() => setShowScrollableSheet(true)}
              variant="secondary"
            />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Select Field Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Select Field Demo</Text>
          <Text variant="caption">Generic select component</Text>

          <Spacer size={Spacing.md} />

          <SelectField
            label="Country"
            placeholder="Select a country"
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            containerStyle={styles.selectContainer}
          />

          <Spacer size={Spacing.sm} />

          <Text variant="caption">Selected: {selectedCountry || 'None'}</Text>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form Select Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form Select Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <FormSelectField
            control={control}
            name="language"
            label="Programming Language"
            placeholder="Select a language"
            options={languageOptions}
            rules={{ required: 'Language is required' }}
            containerStyle={styles.selectContainer}
          />

          <Spacer size={Spacing.sm} />

          <FormSelectField
            control={control}
            name="experience"
            label="Experience Level"
            placeholder="Select your experience"
            options={experienceOptions}
            rules={{ required: 'Experience level is required' }}
            containerStyle={styles.selectContainer}
            clearable={false}
          />

          <Spacer size={Spacing.md} />

          <Button title="Submit Form" onPress={handleSubmit(onSubmit)} />
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Select Multiple Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Select Multiple Demo</Text>
          <Text variant="caption">Select multiple options</Text>

          <Spacer size={Spacing.md} />

          <SelectMultiple
            label="Skills"
            placeholder="Select your skills"
            options={skillOptions}
            value={selectedSkills}
            onChange={setSelectedSkills}
            containerStyle={styles.selectContainer}
          />

          <Spacer size={Spacing.sm} />

          <Text variant="caption">
            Selected:{' '}
            {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'None'}
          </Text>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form Multi-Select Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form Multi-Select Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <FormSelectMultiple
            control={multiControl}
            name="technologies"
            label="Technologies"
            placeholder="Select technologies"
            options={technologyOptions}
            rules={{
              required: 'Please select at least one technology',
            }}
            containerStyle={styles.selectContainer}
          />

          <Spacer size={Spacing.sm} />

          <FormSelectMultiple
            control={multiControl}
            name="frameworks"
            label="Frameworks"
            placeholder="Select frameworks (max 2)"
            options={frameworkOptions}
            maxSelected={2}
            rules={{
              required: 'Please select at least one framework',
            }}
            containerStyle={styles.selectContainer}
          />

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Multi-Select Form"
            onPress={handleMultiSubmit(onMultiSubmit)}
          />
        </Card>

        <Spacer size={Spacing.lg} />
      </ScrollView>

      <BottomSheetModal
        modalVisible={showBottomSheet}
        setModalVisible={setShowBottomSheet}
        title="Example Bottom Sheet"
        renderContent={() => (
          <View style={styles.bottomSheetContent}>
            <Text variant="body">
              This is a bottom sheet modal with improved animations!
            </Text>
            <Spacer size={Spacing.md} />
            <Text variant="caption">
              Features: spring animation, animated backdrop, drag handle
            </Text>
            <Spacer size={Spacing.lg} />
            <Button
              title="Close"
              onPress={() => setShowBottomSheet(false)}
              variant="secondary"
            />
          </View>
        )}
      />

      <BottomSheetModal
        modalVisible={showScrollableSheet}
        setModalVisible={setShowScrollableSheet}
        title="Scrollable Content"
        renderContent={() => (
          <ScrollView
            style={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.bottomSheetContent}>
              <Text variant="h2">Long Content Example</Text>
              <Spacer size={Spacing.md} />

              {Array.from({ length: 15 }).map((_, index) => (
                <View key={index}>
                  <Card style={styles.listItem}>
                    <Text variant="body">Item {index + 1}</Text>
                    <Text variant="caption">
                      This is a sample item in the scrollable list. You can
                      scroll up and down to see more items.
                    </Text>
                  </Card>
                  <Spacer size={Spacing.sm} />
                </View>
              ))}

              <Spacer size={Spacing.md} />
              <Button
                title="Close"
                onPress={() => setShowScrollableSheet(false)}
                variant="secondary"
              />
              <Spacer size={Spacing.lg} />
            </View>
          </ScrollView>
        )}
      />
    </SafeAreaView>
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
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetContent: {
    padding: Spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  scrollableContent: {
    maxHeight: 400,
    width: '100%',
  },
  listItem: {
    width: '100%',
  },
  selectContainer: {
    width: '100%',
  },
});
