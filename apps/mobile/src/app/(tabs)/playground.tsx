import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BottomSheetModal,
  Button,
  Card,
  Checkbox,
  CollapsibleCard,
  ConfirmModal,
  DeleteConfirmModal,
  FormCheckbox,
  FormRadioGroup,
  FormSelectField,
  FormSelectMultiple,
  RadioGroup,
  SelectField,
  SelectMultiple,
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonList,
  SkeletonText,
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

interface CheckboxFormData {
  termsAccepted: boolean;
  newsletterSubscribed: boolean;
}

interface RadioFormData {
  gender: string;
  plan: string;
}

export default function PlaygroundScreen() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showScrollableSheet, setShowScrollableSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | undefined>();

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

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const planOptions = [
    { label: 'Free Plan', value: 'free' },
    { label: 'Pro Plan ($9.99/mo)', value: 'pro' },
    { label: 'Enterprise (Contact us)', value: 'enterprise' },
  ];

  const { control, handleSubmit } = useForm<FormData>();
  const { control: multiControl, handleSubmit: handleMultiSubmit } =
    useForm<MultiSelectFormData>();
  const { control: checkboxControl, handleSubmit: handleCheckboxSubmit } =
    useForm<CheckboxFormData>();
  const { control: radioControl, handleSubmit: handleRadioSubmit } =
    useForm<RadioFormData>();

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

  const onCheckboxSubmit = (data: CheckboxFormData) => {
    toast.success({
      title: 'Checkbox Form Submitted!',
      message: `Terms: ${data.termsAccepted ? 'Yes' : 'No'}, Newsletter: ${data.newsletterSubscribed ? 'Yes' : 'No'}`,
    });
  };

  const onRadioSubmit = (data: RadioFormData) => {
    toast.success({
      title: 'Radio Form Submitted!',
      message: `Gender: ${data.gender || 'Not selected'}, Plan: ${data.plan || 'Not selected'}`,
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

        {/* Confirm Modal Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Confirm Modal Demo</Text>
          <Text variant="caption">Delete and custom confirmations</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.row}>
            <Button
              title="Delete"
              onPress={() => setShowDeleteModal(true)}
              variant="secondary"
            />
            <Spacer size={Spacing.sm} horizontal />
            <Button
              title="Custom"
              onPress={() => setShowConfirmModal(true)}
              variant="outline"
            />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Skeleton Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Skeleton Demo</Text>
          <Text variant="caption">Loading placeholder components</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.skeletonSection}>
            <Text variant="body">Basic Skeleton:</Text>
            <Spacer size={Spacing.xs} />
            <Skeleton height={16} width="80%" />
            <Spacer size={Spacing.xs} />
            <Skeleton height={16} width="60%" />
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.skeletonSection}>
            <Text variant="body">Avatar + Text:</Text>
            <Spacer size={Spacing.xs} />
            <View style={styles.row}>
              <SkeletonAvatar size={40} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <SkeletonText lines={2} lineHeight={12} spacing={8} />
              </View>
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.skeletonSection}>
            <Text variant="body">Card Skeleton:</Text>
            <Spacer size={Spacing.xs} />
            <SkeletonCard />
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.skeletonSection}>
            <Text variant="body">List Skeleton:</Text>
            <Spacer size={Spacing.xs} />
            <SkeletonList count={3} />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Checkbox Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Checkbox Demo</Text>
          <Text variant="caption">Checkbox with different sizes</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.checkboxSection}>
            <Checkbox
              checked={isChecked}
              onChange={setIsChecked}
              label="Accept terms and conditions"
            />

            <Spacer size={Spacing.sm} />

            <Checkbox
              checked={true}
              label="Small checkbox"
              size="small"
              disabled
            />

            <Spacer size={Spacing.sm} />

            <Checkbox checked={false} label="Large checkbox" size="large" />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form Checkbox Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form Checkbox Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.checkboxSection}>
            <FormCheckbox
              control={checkboxControl}
              name="termsAccepted"
              label="I accept the terms and conditions"
              rules={{ required: 'You must accept the terms' }}
            />

            <Spacer size={Spacing.sm} />

            <FormCheckbox
              control={checkboxControl}
              name="newsletterSubscribed"
              label="Subscribe to newsletter"
            />
          </View>

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Checkbox Form"
            onPress={handleCheckboxSubmit(onCheckboxSubmit)}
          />
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Radio Button Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Radio Button Demo</Text>
          <Text variant="caption">Single selection from options</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.radioSection}>
            <RadioGroup
              label="Gender"
              options={genderOptions}
              value={selectedGender}
              onChange={setSelectedGender}
            />

            <Spacer size={Spacing.md} />

            <Text variant="caption">
              Selected: {selectedGender || 'None'}
            </Text>
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form Radio Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form Radio Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.radioSection}>
            <FormRadioGroup
              control={radioControl}
              name="gender"
              label="Gender"
              options={genderOptions}
              rules={{ required: 'Please select a gender' }}
            />

            <Spacer size={Spacing.md} />

            <FormRadioGroup
              control={radioControl}
              name="plan"
              label="Subscription Plan"
              options={planOptions}
              rules={{ required: 'Please select a plan' }}
            />
          </View>

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Radio Form"
            onPress={handleRadioSubmit(onRadioSubmit)}
          />
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Collapsible Card Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Collapsible Card Demo</Text>
          <Text variant="caption">Expandable/collapsible sections</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.collapsibleSection}>
            <CollapsibleCard title="What is React Native?" defaultExpanded>
              <Text variant="body">
                React Native is a JavaScript framework for building native
                mobile apps. It uses React along with native platform
                capabilities to create truly native applications.
              </Text>
            </CollapsibleCard>

            <Spacer size={Spacing.sm} />

            <CollapsibleCard title="How does it work?">
              <Text variant="body">
                React Native bridges JavaScript and native code, allowing you to
                write components in JavaScript that render as native UI
                elements. This provides the performance of native apps with the
                development speed of JavaScript.
              </Text>
            </CollapsibleCard>

            <Spacer size={Spacing.sm} />

            <CollapsibleCard title="Disabled Section" disabled>
              <Text variant="body">This content is not accessible.</Text>
            </CollapsibleCard>
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

      <DeleteConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          toast.success({ title: 'Item deleted successfully!' });
        }}
        itemName="Sample Item"
      />

      <ConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          toast.info({ title: 'Action confirmed!' });
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        confirmText="Yes, proceed"
        cancelText="No, cancel"
        variant="warning"
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
  skeletonSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  checkboxSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  radioSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  collapsibleSection: {
    width: '100%',
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
