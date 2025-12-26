import { useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Text as RNText,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Avatar,
  AvatarWithName,
  BottomSheetModal,
  Button,
  Card,
  Checkbox,
  CollapsibleCard,
  ConfirmModal,
  DatePicker,
  DateRange,
  DateRangePicker,
  DeleteConfirmModal,
  FormCheckbox,
  FormDatePicker,
  FormDateRangePicker,
  FormPasswordInput,
  FormRadioGroup,
  FormSelectField,
  FormSelectMultiple,
  FormTextInput,
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
  SwipeableCard,
  SwipeableCardProvider,
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

interface DateFormData {
  birthDate: Date;
  appointmentDate: Date;
}

interface DateRangeFormData {
  vacationPeriod: DateRange;
  projectTimeline: DateRange;
}

// Comprehensive form with all field types
interface ComprehensiveFormData {
  // Text inputs
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Select fields
  country: string;
  skills: string[];
  // Checkbox
  agreeTerms: boolean;
  receiveUpdates: boolean;
  // Radio
  gender: string;
  // Date fields
  birthDate: Date;
  eventDateRange: DateRange;
}

// Reanimated Demo Component
function ReanimatedDemo() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const backgroundColor = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    backgroundColor: interpolateColor(
      backgroundColor.value,
      [0, 1, 2],
      ['#3b82f6', '#22c55e', '#ef4444']
    ),
  }));

  const animatedSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const handleSpringPress = () => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );
  };

  const handleRotatePress = () => {
    rotation.value = withTiming(rotation.value + 360, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  const handleColorPress = () => {
    backgroundColor.value = withTiming((backgroundColor.value + 1) % 3, {
      duration: 300,
    });
  };

  const handleSlidePress = () => {
    translateX.value = withSequence(
      withTiming(100, { duration: 200 }),
      withTiming(-100, { duration: 400 }),
      withTiming(0, { duration: 200 })
    );
  };

  const handlePulsePress = () => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 200 }),
        withTiming(1, { duration: 200 })
      ),
      3,
      false
    );
  };

  return (
    <Card style={demoStyles.card}>
      <Text variant="h2">Reanimated Demo</Text>
      <Text variant="caption">
        Smooth animations with react-native-reanimated
      </Text>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.animationSection}>
        <Text variant="body" style={demoStyles.label}>
          Animated Box:
        </Text>
        <Animated.View style={[demoStyles.animatedBox, animatedBoxStyle]} />
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.buttonRow}>
        <Button title="Spring" onPress={handleSpringPress} variant="outline" />
        <Spacer size={Spacing.xs} horizontal />
        <Button title="Rotate" onPress={handleRotatePress} variant="outline" />
        <Spacer size={Spacing.xs} horizontal />
        <Button title="Color" onPress={handleColorPress} variant="outline" />
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.animationSection}>
        <Text variant="body" style={demoStyles.label}>
          Slide Animation:
        </Text>
        <Animated.View style={[demoStyles.slideBox, animatedSlideStyle]} />
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.buttonRow}>
        <Button title="Slide" onPress={handleSlidePress} variant="secondary" />
        <Spacer size={Spacing.xs} horizontal />
        <Button title="Pulse" onPress={handlePulsePress} variant="secondary" />
      </View>
    </Card>
  );
}

// Gesture Handler Demo Component
function GestureHandlerDemo() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [tapCount, setTapCount] = useState(0);
  const [gestureInfo, setGestureInfo] = useState('Tap or drag the boxes');

  const updateGestureInfo = useCallback((info: string) => {
    setGestureInfo(info);
  }, []);

  const incrementTap = useCallback(() => {
    setTapCount((prev) => prev + 1);
  }, []);

  // Pan gesture for draggable box
  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(updateGestureInfo)('Dragging...');
    })
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(updateGestureInfo)('Drag ended');
    });

  // Tap gesture
  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(0.9);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      runOnJS(incrementTap)();
      runOnJS(updateGestureInfo)('Tapped!');
    });

  // Double tap gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSequence(withSpring(1.5), withSpring(1));
      runOnJS(updateGestureInfo)('Double tapped!');
    });

  // Combine tap gestures
  const combinedTapGesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  const draggableStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const tappableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resetDraggable = () => {
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    setGestureInfo('Position reset');
  };

  // Swipeable render actions
  const renderLeftActions = (_progress: any, _drag: any, close: () => void) => (
    <Pressable
      onPress={() => {
        toast.info({ title: 'Archived!' });
        close();
      }}
      style={demoStyles.swipeActionLeft}
    >
      <RNText style={demoStyles.swipeActionText}>Archive</RNText>
    </Pressable>
  );

  const renderRightActions = (
    _progress: any,
    _drag: any,
    close: () => void
  ) => (
    <View style={demoStyles.swipeActionsRight}>
      <Pressable
        onPress={() => {
          toast.info({ title: 'Edit!' });
          close();
        }}
        style={demoStyles.swipeActionEdit}
      >
        <RNText style={demoStyles.swipeActionText}>Edit</RNText>
      </Pressable>
      <Pressable
        onPress={() => {
          toast.error({ title: 'Deleted!' });
          close();
        }}
        style={demoStyles.swipeActionDelete}
      >
        <RNText style={demoStyles.swipeActionText}>Delete</RNText>
      </Pressable>
    </View>
  );

  // Sample list items
  const listItems = [
    { id: '1', title: 'Item 1', subtitle: 'Swipe to see actions' },
    { id: '2', title: 'Item 2', subtitle: 'Only one item can be open' },
    { id: '3', title: 'Item 3', subtitle: 'Opening another closes previous' },
  ];

  return (
    <Card style={demoStyles.card}>
      <Text variant="h2">Gesture Handler Demo</Text>
      <Text variant="caption">
        Touch gestures with react-native-gesture-handler
      </Text>

      <Spacer size={Spacing.md} />

      <Text variant="body" style={demoStyles.gestureInfo}>
        {gestureInfo}
      </Text>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.gestureSection}>
        <Text variant="body" style={demoStyles.label}>
          Draggable Box (Pan Gesture):
        </Text>
        <View style={demoStyles.gestureArea}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[demoStyles.draggableBox, draggableStyle]}>
              <Text style={demoStyles.boxText}>Drag me</Text>
            </Animated.View>
          </GestureDetector>
        </View>
        <Button
          title="Reset Position"
          onPress={resetDraggable}
          variant="outline"
        />
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.gestureSection}>
        <Text variant="body" style={demoStyles.label}>
          Tappable Box (Tap Count: {tapCount}):
        </Text>
        <GestureDetector gesture={combinedTapGesture}>
          <Animated.View style={[demoStyles.tappableBox, tappableStyle]}>
            <Text style={demoStyles.boxText}>Tap / Double Tap</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.gestureSection}>
        <Text variant="body" style={demoStyles.label}>
          Simple SwipeableCard (standalone):
        </Text>
        <SwipeableCard
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
        >
          <Text variant="body">Standalone Card</Text>
          <Text variant="caption">Works without Provider</Text>
        </SwipeableCard>
      </View>

      <Spacer size={Spacing.md} />

      <View style={demoStyles.gestureSection}>
        <Text variant="body" style={demoStyles.label}>
          SwipeableCard List (exclusive open):
        </Text>
        <SwipeableCardProvider>
          {listItems.map((item) => (
            <View key={item.id} style={demoStyles.listItemWrapper}>
              <SwipeableCard
                renderLeftActions={renderLeftActions}
                renderRightActions={renderRightActions}
              >
                <Text variant="body">{item.title}</Text>
                <Text variant="caption">{item.subtitle}</Text>
              </SwipeableCard>
            </View>
          ))}
        </SwipeableCardProvider>
      </View>
    </Card>
  );
}

// Demo styles
const demoStyles = StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
  },
  animationSection: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  animatedBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideBox: {
    width: 60,
    height: 60,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gestureSection: {
    width: '100%',
    alignItems: 'center',
  },
  gestureInfo: {
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  gestureArea: {
    width: '100%',
    height: 120,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  draggableBox: {
    width: 80,
    height: 80,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tappableBox: {
    width: 140,
    height: 80,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  boxText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  listItemWrapper: {
    marginBottom: 8,
    width: '100%',
  },
  swipeActionLeft: {
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  swipeActionsRight: {
    flexDirection: 'row',
  },
  swipeActionEdit: {
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  swipeActionDelete: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  swipeActionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedRangeDate, setSelectedRangeDate] = useState<Date | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(
    null
  );
  const [selectedDateRangeWithMinMax, setSelectedDateRangeWithMinMax] =
    useState<DateRange | null>(null);

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
  const { control: dateControl, handleSubmit: handleDateSubmit } =
    useForm<DateFormData>();
  const { control: dateRangeControl, handleSubmit: handleDateRangeSubmit } =
    useForm<DateRangeFormData>();
  const {
    control: comprehensiveControl,
    handleSubmit: handleComprehensiveSubmit,
    reset: resetComprehensiveForm,
    setValue: setComprehensiveValue,
  } = useForm<ComprehensiveFormData>();

  // Auto-fill sample data for comprehensive form
  const autoFillComprehensiveForm = () => {
    const sampleData: ComprehensiveFormData = {
      fullName: 'Nguyen Van A',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
      password: 'SecurePass123!',
      country: 'vn',
      skills: ['react', 'ts', 'node'],
      agreeTerms: true,
      receiveUpdates: true,
      gender: 'male',
      birthDate: new Date(1995, 5, 15),
      eventDateRange: {
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 0, 7),
      },
    };

    setComprehensiveValue('fullName', sampleData.fullName);
    setComprehensiveValue('email', sampleData.email);
    setComprehensiveValue('phone', sampleData.phone);
    setComprehensiveValue('password', sampleData.password);
    setComprehensiveValue('country', sampleData.country);
    setComprehensiveValue('skills', sampleData.skills);
    setComprehensiveValue('agreeTerms', sampleData.agreeTerms);
    setComprehensiveValue('receiveUpdates', sampleData.receiveUpdates);
    setComprehensiveValue('gender', sampleData.gender);
    setComprehensiveValue('birthDate', sampleData.birthDate);
    setComprehensiveValue('eventDateRange', sampleData.eventDateRange);

    toast.success({ title: 'Form auto-filled!' });
  };

  const clearComprehensiveForm = () => {
    resetComprehensiveForm();
    toast.info({ title: 'Form cleared!' });
  };

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

  const onDateSubmit = (data: DateFormData) => {
    toast.success({
      title: 'Date Form Submitted!',
      message: `Birth: ${data.birthDate?.toLocaleDateString() || 'Not selected'}, Appointment: ${data.appointmentDate?.toLocaleString() || 'Not selected'}`,
    });
  };

  const onDateRangeSubmit = (data: DateRangeFormData) => {
    const formatRange = (range: DateRange | null) => {
      if (!range?.startDate) return 'Not selected';
      const start = range.startDate.toLocaleDateString();
      const end = range.endDate?.toLocaleDateString() || 'ongoing';
      return `${start} - ${end}`;
    };
    toast.success({
      title: 'Date Range Form Submitted!',
      message: `Vacation: ${formatRange(data.vacationPeriod)}, Project: ${formatRange(data.projectTimeline)}`,
    });
  };

  const onComprehensiveSubmit = (data: ComprehensiveFormData) => {
    toast.success({
      title: 'Comprehensive Form Submitted!',
      message: `Name: ${data.fullName}, Email: ${data.email}`,
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

        {/* Reanimated Demo */}
        <ReanimatedDemo />

        <Spacer size={Spacing.lg} />

        {/* Gesture Handler Demo */}
        <GestureHandlerDemo />

        <Spacer size={Spacing.lg} />

        {/* Comprehensive Form Demo with Auto-Fill */}
        <Card style={styles.card}>
          <Text variant="h2">Comprehensive Form Demo</Text>
          <Text variant="caption">All form fields with auto-fill feature</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.row}>
            <Button title="Auto Fill" onPress={autoFillComprehensiveForm} />
            <Spacer size={Spacing.sm} horizontal />
            <Button
              title="Clear"
              onPress={clearComprehensiveForm}
              variant="outline"
            />
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.formSection}>
            {/* Text Inputs */}
            <FormTextInput
              control={comprehensiveControl}
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              rules={{ required: 'Full name is required' }}
            />

            <Spacer size={Spacing.sm} />

            <FormTextInput
              control={comprehensiveControl}
              name="email"
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
            />

            <Spacer size={Spacing.sm} />

            <FormTextInput
              control={comprehensiveControl}
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              rules={{ required: 'Phone number is required' }}
            />

            <Spacer size={Spacing.sm} />

            <FormPasswordInput
              control={comprehensiveControl}
              name="password"
              label="Password"
              placeholder="Enter your password"
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              }}
            />

            <Spacer size={Spacing.md} />

            {/* Select Fields */}
            <FormSelectField
              control={comprehensiveControl}
              name="country"
              label="Country"
              placeholder="Select your country"
              options={countryOptions}
              rules={{ required: 'Country is required' }}
            />

            <Spacer size={Spacing.sm} />

            <FormSelectMultiple
              control={comprehensiveControl}
              name="skills"
              label="Skills"
              placeholder="Select your skills"
              options={skillOptions}
              rules={{ required: 'Please select at least one skill' }}
            />

            <Spacer size={Spacing.md} />

            {/* Checkboxes */}
            <FormCheckbox
              control={comprehensiveControl}
              name="agreeTerms"
              label="I agree to the terms and conditions"
              rules={{ required: 'You must agree to the terms' }}
            />

            <Spacer size={Spacing.xs} />

            <FormCheckbox
              control={comprehensiveControl}
              name="receiveUpdates"
              label="Receive email updates"
            />

            <Spacer size={Spacing.md} />

            {/* Radio Group */}
            <FormRadioGroup
              control={comprehensiveControl}
              name="gender"
              label="Gender"
              options={genderOptions}
              rules={{ required: 'Please select your gender' }}
            />

            <Spacer size={Spacing.md} />

            {/* Date Pickers */}
            <FormDatePicker
              control={comprehensiveControl}
              name="birthDate"
              label="Birth Date"
              placeholder="Select your birth date"
              maxDate={new Date()}
              rules={{ required: 'Birth date is required' }}
            />

            <Spacer size={Spacing.sm} />

            <FormDateRangePicker
              control={comprehensiveControl}
              name="eventDateRange"
              label="Event Date Range"
              placeholder="Select event dates"
              rules={{ required: 'Event date range is required' }}
            />
          </View>

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Form"
            onPress={handleComprehensiveSubmit(onComprehensiveSubmit)}
          />
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Avatar Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Avatar Demo</Text>
          <Text variant="caption">User avatars with image or initials</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              All Sizes (xs, sm, md, lg, xl):
            </Text>
            <View style={styles.avatarRow}>
              <Avatar name="John Doe" size="xs" />
              <Avatar name="Jane Smith" size="sm" />
              <Avatar name="Bob Wilson" size="md" />
              <Avatar name="Alice Brown" size="lg" />
              <Avatar name="Charlie Davis" size="xl" />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              Variants (circle, rounded, square):
            </Text>
            <View style={styles.avatarRow}>
              <Avatar name="Circle" size="lg" variant="circle" />
              <Avatar name="Rounded" size="lg" variant="rounded" />
              <Avatar name="Square" size="lg" variant="square" />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              With Image URL:
            </Text>
            <View style={styles.avatarRow}>
              <Avatar
                name="User 1"
                size="lg"
                imageUrl="https://i.pravatar.cc/150?img=1"
              />
              <Avatar
                name="User 2"
                size="lg"
                imageUrl="https://i.pravatar.cc/150?img=2"
              />
              <Avatar
                name="Fallback Test"
                size="lg"
                imageUrl="invalid-url-shows-initials"
              />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              Name Position = right (all sizes):
            </Text>
            <View style={styles.avatarColumn}>
              <AvatarWithName
                name="Extra Small"
                size="xs"
                namePosition="right"
              />
              <Spacer size={Spacing.xs} />
              <AvatarWithName
                name="Small Size"
                size="sm"
                namePosition="right"
              />
              <Spacer size={Spacing.xs} />
              <AvatarWithName
                name="Medium Size"
                size="md"
                imageUrl="https://i.pravatar.cc/150?img=3"
                namePosition="right"
              />
              <Spacer size={Spacing.xs} />
              <AvatarWithName
                name="Large Size"
                size="lg"
                imageUrl="https://i.pravatar.cc/150?img=4"
                namePosition="right"
              />
              <Spacer size={Spacing.xs} />
              <AvatarWithName
                name="Extra Large"
                size="xl"
                imageUrl="https://i.pravatar.cc/150?img=5"
                namePosition="right"
              />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              Name Position = bottom (all sizes):
            </Text>
            <View style={styles.avatarRow}>
              <AvatarWithName name="XS" size="xs" namePosition="bottom" />
              <AvatarWithName name="SM" size="sm" namePosition="bottom" />
              <AvatarWithName
                name="MD"
                size="md"
                imageUrl="https://i.pravatar.cc/150?img=6"
                namePosition="bottom"
              />
              <AvatarWithName
                name="LG"
                size="lg"
                imageUrl="https://i.pravatar.cc/150?img=7"
                namePosition="bottom"
              />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              Custom Colors:
            </Text>
            <View style={styles.avatarRow}>
              <Avatar
                name="Custom BG"
                size="lg"
                backgroundColor="#ef4444"
                textColor="#ffffff"
              />
              <Avatar
                name="Another"
                size="lg"
                backgroundColor="#22c55e"
                textColor="#ffffff"
              />
              <Avatar
                name="Third"
                size="lg"
                backgroundColor="#3b82f6"
                textColor="#ffffff"
              />
            </View>
          </View>

          <Spacer size={Spacing.md} />

          <View style={styles.avatarSection}>
            <Text variant="body" style={styles.avatarLabel}>
              Rounded + Name Bottom:
            </Text>
            <View style={styles.avatarRow}>
              <AvatarWithName
                name="Alice Johnson"
                size="lg"
                variant="rounded"
                imageUrl="https://i.pravatar.cc/150?img=8"
                namePosition="bottom"
              />
              <AvatarWithName
                name="Bob Smith"
                size="lg"
                variant="rounded"
                namePosition="bottom"
              />
              <AvatarWithName
                name="Carol White"
                size="lg"
                variant="rounded"
                namePosition="bottom"
              />
            </View>
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* DatePicker Demo */}
        <Card style={styles.card}>
          <Text variant="h2">DatePicker Demo</Text>
          <Text variant="caption">Date and DateTime selection</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.datePickerSection}>
            <DatePicker
              label="Select Date"
              placeholder="Choose a date"
              value={selectedDate}
              onChange={setSelectedDate}
            />

            <Spacer size={Spacing.md} />

            <DatePicker
              label="Select Date & Time"
              placeholder="Choose date and time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              timePicker
              modalTitle="Select Date & Time"
            />

            <Spacer size={Spacing.md} />

            <DatePicker
              label="With Min/Max Date"
              placeholder="Select within range (next 30 days)"
              value={selectedRangeDate}
              onChange={setSelectedRangeDate}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />

            <Spacer size={Spacing.md} />

            <DatePicker label="Disabled" placeholder="Cannot select" disabled />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form DatePicker Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form DatePicker Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.datePickerSection}>
            <FormDatePicker
              control={dateControl}
              name="birthDate"
              label="Birth Date"
              placeholder="Select your birth date"
              maxDate={new Date()}
              rules={{ required: 'Birth date is required' }}
            />

            <Spacer size={Spacing.md} />

            <FormDatePicker
              control={dateControl}
              name="appointmentDate"
              label="Appointment Date & Time"
              placeholder="Select appointment"
              timePicker
              minDate={new Date()}
              rules={{ required: 'Appointment date is required' }}
            />
          </View>

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Date Form"
            onPress={handleDateSubmit(onDateSubmit)}
          />
        </Card>

        <Spacer size={Spacing.lg} />

        {/* DateRangePicker Demo */}
        <Card style={styles.card}>
          <Text variant="h2">DateRangePicker Demo</Text>
          <Text variant="caption">Select a date range</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.datePickerSection}>
            <DateRangePicker
              label="Select Date Range"
              placeholder="Choose start and end date"
              value={selectedDateRange}
              onChange={setSelectedDateRange}
            />

            <Spacer size={Spacing.md} />

            <DateRangePicker
              label="With Min/Max Date"
              placeholder="Select within next 60 days"
              value={selectedDateRangeWithMinMax}
              onChange={setSelectedDateRangeWithMinMax}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
            />

            <Spacer size={Spacing.md} />

            <DateRangePicker
              label="Disabled"
              placeholder="Cannot select"
              disabled
            />
          </View>
        </Card>

        <Spacer size={Spacing.lg} />

        {/* Form DateRangePicker Demo */}
        <Card style={styles.card}>
          <Text variant="h2">Form DateRangePicker Demo</Text>
          <Text variant="caption">With react-hook-form validation</Text>

          <Spacer size={Spacing.md} />

          <View style={styles.datePickerSection}>
            <FormDateRangePicker
              control={dateRangeControl}
              name="vacationPeriod"
              label="Vacation Period"
              placeholder="Select vacation dates"
              minDate={new Date()}
              rules={{ required: 'Vacation period is required' }}
            />

            <Spacer size={Spacing.md} />

            <FormDateRangePicker
              control={dateRangeControl}
              name="projectTimeline"
              label="Project Timeline"
              placeholder="Select project dates"
              rules={{ required: 'Project timeline is required' }}
            />
          </View>

          <Spacer size={Spacing.md} />

          <Button
            title="Submit Date Range Form"
            onPress={handleDateRangeSubmit(onDateRangeSubmit)}
          />
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

            <Text variant="caption">Selected: {selectedGender || 'None'}</Text>
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
  avatarSection: {
    width: '100%',
    alignItems: 'flex-start',
  },
  avatarLabel: {
    fontWeight: '600',
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  avatarColumn: {
    alignItems: 'flex-start',
  },
  datePickerSection: {
    width: '100%',
  },
  formSection: {
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
