# @repo/ui Design System - Comprehensive Summary

## Overview
The @repo/ui package is a comprehensive React Native design system providing 40+ components organized into five main categories: Core, Form, Overlays, Shared, and Icons. Built with TypeScript and leveraging react-native-size-matters for responsive scaling, it's designed for consistency across mobile applications.

---

## 1. Package Configuration & Build Setup

### Package.json
- **Name:** @repo/ui
- **Version:** 0.0.1
- **Main Entry:** ./src/index.tsx
- **Type:** Private workspace package

### Dependencies
**Peer Dependencies:**
- react (any version)
- react-native (any version)
- react-hook-form ^7.0.0
- react-native-ui-datepicker (any)
- react-native-gesture-handler (any)
- react-native-reanimated (any)
- react-native-worklets (any)
- dayjs (any)

**Direct Dependencies:**
- react-native-size-matters: ^0.4.2

### TypeScript Configuration
- Target: ES2020
- Module: ESNext
- JSX: react-native
- Strict mode enabled
- Bundler module resolution
- Declaration maps included for better IDE support

---

## 2. Design System Foundation

### Responsive Utilities (`src/utils/responsive.ts`)

#### Hook-based Responsive System
```typescript
useResponsive()
```
Returns:
- **Screen dimensions:** width, height, fontScale
- **Device detection:** isLandscape, isTablet, isLargeScreen
- **Scale helpers:** scale, verticalScale, moderateScale (from react-native-size-matters)
- **Font normalization:** normalizeFont() - prevents excessive scaling

#### Responsive Conversion Functions
- **widthPercentageToDP(widthPercent)** - Convert width percentage to pixels
- **heightPercentageToDP(heightPercent)** - Convert height percentage to pixels
- **responsiveFontWidth(widthPercent)** - Convert font width percentage to pixels
- **widthPixel(size)** - Convert Figma design width to responsive pixels (base: 430px)
- **heightPixel(size)** - Convert Figma design height to responsive pixels (base: 932px)
- **fontPixel(size)** - Convert font size from Figma to responsive

### Spacing System (`src/theme/spacing.ts`)

Uses react-native-size-matters for scaling:
```typescript
Spacing = {
  xs: 4px,      // moderateScale(4)
  sm: 8px,      // moderateScale(8)
  md: 16px,     // moderateScale(16)
  lg: 24px,     // moderateScale(24)
  xl: 32px,     // moderateScale(32)
  xxl: 40px,    // moderateScale(40)
}
```

### Typography System (`src/theme/typography.ts`)

```typescript
Typography = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' }
}
```

---

## 3. Core Components (4 components)

### Text Component
**File:** `/src/components/core/Text.tsx`

**Props:**
```typescript
interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'body' | 'caption';  // default: 'body'
  style?: TextStyle;
  color?: string;
}
```

**Features:**
- Predefined typography variants
- Color overrides
- Extends with custom styles
- Uses colors from @repo/core

### Button Component
**File:** `/src/components/core/Button.tsx`

**Props:**
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';  // default: 'primary'
  disabled?: boolean;
  style?: ViewStyle;
}
```

**Features:**
- Three variants: primary (solid), secondary (solid), outline (bordered)
- Disabled state support (50% opacity)
- 12px vertical, 24px horizontal padding
- 8px border radius
- Active opacity: 0.8

### Card Component
**File:** `/src/components/core/Card.tsx`

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
```

**Features:**
- Rounded container with shadow
- 16px padding
- 12px border radius
- Elevation: 3 (Android)
- Shadow: 0.1 opacity, 4px radius

### Spacer Component
**File:** `/src/components/core/Spacer.tsx`

**Props:**
```typescript
interface SpacerProps {
  size?: number;        // default: 16
  horizontal?: boolean; // default: false
}
```

**Features:**
- Simple layout spacing
- Flexible sizing
- Horizontal or vertical orientation

---

## 4. Form Components (13 components)

### TextInput Component
**File:** `/src/components/form/TextInput.tsx`

**Props:**
```typescript
interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: ReactNode;
  leftIconContainerStyle?: ViewStyle;
  rightIcon?: ReactNode;
  rightIconContainerStyle?: ViewStyle;
  onRightIconPress?: () => void;
}
```

**Features:**
- Optional label above input
- Error state with red border and error text
- Icon support (left and right)
- Right icon can be interactive
- 12px border radius
- Placeholder color from color system
- forwardRef for direct input access

### FormTextInput (React Hook Form Wrapper)
**File:** `/src/components/form/FormTextInput.tsx`

Integrates TextInput with react-hook-form Controller:
- Automatic value/onChange management
- Built-in validation rules
- Error message display from form state

### FormPasswordInput Component
**File:** `/src/components/form/FormPasswordInput.tsx`

**Props:**
```typescript
interface FormPasswordInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  rules?: RegisterOptions<T, Path<T>>;
  label?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: ReactNode;
  leftIconContainerStyle?: ViewStyle;
  renderShowIcon?: () => ReactNode;    // default: "Show" text
  renderHideIcon?: () => ReactNode;    // default: "Hide" text
  rightIconContainerStyle?: ViewStyle;
}
```

**Features:**
- Toggle password visibility
- Form integrated
- Custom show/hide icon rendering
- Built-in validation support

### Checkbox Component
**File:** `/src/components/form/Checkbox.tsx`

**Props:**
```typescript
interface CheckboxProps {
  checked?: boolean;        // default: false
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';  // default: 'medium'
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}
```

**Size Configuration:**
- **small:** 18x18 box, 10px check, 14px font
- **medium:** 22x22 box, 12px check, 16px font
- **large:** 26x26 box, 14px check, 18px font

**Features:**
- Configurable sizes
- Checkmark icon (✓)
- Error state styling
- Disabled state
- Label support

### FormCheckbox (React Hook Form Wrapper)
**File:** `/src/components/form/FormCheckbox.tsx`

Wraps Checkbox with react-hook-form integration

### RadioButton & RadioGroup Components
**File:** `/src/components/form/RadioButton.tsx`

**RadioButton Props:**
```typescript
interface RadioButtonProps<T = string> {
  selected?: boolean;
  onPress?: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  labelStyle?: TextStyle;
}
```

**RadioGroup Props:**
```typescript
interface RadioGroupProps<T = string> {
  options: RadioOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  direction?: 'vertical' | 'horizontal';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  optionStyle?: ViewStyle;
}
```

**Features:**
- Individual RadioButton or RadioGroup
- Vertical/horizontal layout
- Optional items can be disabled individually
- Configurable spacing (12px vertical, 20px horizontal)

### FormRadioGroup (React Hook Form Wrapper)
**File:** `/src/components/form/FormRadioGroup.tsx`

React Hook Form integration for RadioGroup

### SelectField Component
**File:** `/src/components/form/SelectField.tsx`

**Props:**
```typescript
interface SelectFieldProps<T = string | number> {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  inputStyle?: ViewStyle;
  renderOption?: (option: SelectOption<T>, isSelected: boolean) => React.ReactNode;
}
```

**Features:**
- Bottom sheet modal for option selection
- Clear button (when clearable=true)
- Custom option renderer
- Default option styling with highlight
- Arrow down icon
- 300px max height for options list

### FormSelectField (React Hook Form Wrapper)
**File:** `/src/components/form/FormSelectField.tsx`

React Hook Form integration for SelectField

### SelectMultiple Component
**File:** `/src/components/form/SelectMultiple.tsx`

**Props:**
```typescript
interface SelectMultipleProps<T = string | number> {
  label?: string;
  placeholder?: string;
  options: SelectMultipleOption<T>[];
  value?: T[];
  onChange?: (value: T[]) => void;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  maxSelected?: number;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  inputStyle?: ViewStyle;
  renderOption?: (option: SelectMultipleOption<T>, isSelected: boolean) => React.ReactNode;
}
```

**Features:**
- Multi-select with chips display
- Clear all button
- Max selection limit support
- Custom option renderer
- Checkmark icons in options
- Selected count display in bottom sheet
- Disabled state for options when max reached

### FormSelectMultiple (React Hook Form Wrapper)
**File:** `/src/components/form/FormSelectMultiple.tsx`

React Hook Form integration for SelectMultiple

### DatePicker Component
**File:** `/src/components/form/DatePicker.tsx`

**Props:**
```typescript
interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  displayFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  timePicker?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  modalTitle?: string;
}
```

**Features:**
- Modal-based date picker (uses react-native-ui-datepicker)
- Calendar icon
- Clear button support
- Min/max date constraints
- Time picker option
- Custom date format support
- Themed calendar (uses @repo/core colors)
- Confirm/Cancel buttons

### FormDatePicker (React Hook Form Wrapper)
Integrates DatePicker with react-hook-form

### DateRangePicker Component
**File:** `/src/components/form/DateRangePicker.tsx`

**Props:**
```typescript
interface DateRangePickerProps {
  value?: DateRange | null;
  onChange?: (range: DateRange | null) => void;
  label?: string;
  placeholder?: string;
  displayFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
  modalTitle?: string;
}

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}
```

**Features:**
- Range selection mode
- Displays as "startDate - endDate"
- Range highlighting in calendar
- Same configuration as DatePicker

### FormDateRangePicker (React Hook Form Wrapper)
Integrates DateRangePicker with react-hook-form

---

## 5. Overlay Components (3 components)

### BottomSheetModal Component
**File:** `/src/components/overlays/BottomSheetModal.tsx`

**Props:**
```typescript
interface IBottomSheetModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  title: string;
  renderContent: () => React.ReactNode;
  renderCloseButton?: () => React.ReactNode;
}
```

**Features:**
- Animated slide-up from bottom
- 300ms animation duration (cubic easing)
- Backdrop with 0.6 opacity
- Drag handle indicator (40x4px)
- Custom close button support
- Tap backdrop to close
- Smooth animations with Reanimated

### ConfirmModal Component
**File:** `/src/components/overlays/ConfirmModal.tsx`

**Props:**
```typescript
interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
  showCancelButton?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}
```

**Variants:**
- **danger:** Uses error color (red)
- **warning:** Uses warning color (orange/yellow)
- **info:** Uses primary color (blue)

**Features:**
- Centered modal with fade animation
- Activity indicator during loading
- Optional cancel button
- Max width: 320px
- 20px border radius
- Loading state disables interaction

### DeleteConfirmModal Component
Pre-configured wrapper around ConfirmModal for delete operations:

**Props:**
```typescript
interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  message?: string;
  loading?: boolean;
}
```

**Default Message:** "Are you sure you want to delete '{itemName}'? This action cannot be undone."

### Skeleton Components (5 variants)
**File:** `/src/components/overlays/Skeleton.tsx`

**Base Skeleton Props:**
```typescript
interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}
```

**Variants:**
1. **Skeleton** - Basic animated placeholder
2. **SkeletonText** - Multiple lines of text placeholders
   - lines, lineHeight, spacing, lastLineWidth
3. **SkeletonAvatar** - Circular avatar placeholder
4. **SkeletonCard** - Pre-configured card skeleton (avatar + title + text)
5. **SkeletonList/SkeletonListItem** - List item skeletons with optional avatars

**Animation:** Pulsing opacity (0.3 to 1.0) every 800ms

---

## 6. Shared Display Components (3 components)

### Avatar Component
**File:** `/src/components/shared/Avatar.tsx`

**Props:**
```typescript
interface AvatarProps {
  imageUrl?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  showName?: boolean;
  namePosition?: 'right' | 'bottom';
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  nameStyle?: TextStyle;
  initialsStyle?: TextStyle;
}
```

**Size Configuration:**
- **xs:** 24x24, 10px font
- **sm:** 32x32, 12px font
- **md:** 40x40, 16px font
- **lg:** 56x56, 22px font
- **xl:** 80x80, 32px font

**Features:**
- Image or initials fallback
- Auto-generated color based on name hash
- Initials from first/last name
- 11 color palette for consistent avatars
- Optional name display (right or bottom)
- Variants: circle, rounded (20% radius), square
- Image error fallback to initials

**Convenience Components:**
- **AvatarImage** - Image only
- **AvatarWithName** - Always shows name

### CollapsibleCard Component
**File:** `/src/components/shared/CollapsibleCard.tsx`

**Props:**
```typescript
interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  renderHeaderRight?: () => React.ReactNode;
}
```

**Features:**
- Animated chevron rotation (180°)
- LayoutAnimation support (enabled on Android)
- Smooth height animation
- Custom header content support
- Disabled state
- Card styling with border
- Divider between header and content

### SwipeableCard Component
**File:** `/src/components/shared/SwipeableCard.tsx`

**Props:**
```typescript
interface SwipeableCardProps {
  children: ReactNode;
  renderLeftActions?: (progress: SharedValue<number>, drag: SharedValue<number>, close: () => void) => ReactNode;
  renderRightActions?: (progress: SharedValue<number>, drag: SharedValue<number>, close: () => void) => ReactNode;
  onOpen?: (direction: 'left' | 'right') => void;
  onClose?: () => void;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  overshootLeft?: boolean;
  overshootRight?: boolean;
  friction?: number;
  enabled?: boolean;
}
```

**Features:**
- Left/right swipe actions
- Animated progress callbacks
- Provider pattern for single-open-at-a-time management
- Custom action rendering with progress/drag values
- Close callback
- Friction control
- Enable/disable support

**Provider Component:**
```typescript
<SwipeableCardProvider>
  <SwipeableCard ... />
</SwipeableCardProvider>
```

**Hook:** `useSwipeableContext()` - Access the swipeable context

---

## 7. Icon Components (3 components)

All icons are SVG-based using react-native-svg.

### ArrowDownIcon
**File:** `/src/components/icons/ArrowDownIcon/index.tsx`

**Props:**
```typescript
interface IArrowDownIconProps {
  size?: number;        // default: 24
  color?: string;       // default: '#6B7280'
}
```

### CalendarIcon
**File:** `/src/components/icons/CalendarIcon/index.tsx`

**Props:**
```typescript
interface ICalendarIconProps {
  size?: number;        // default: 24
  color?: string;       // default: '#6B7280'
}
```

### CloseIcon
**File:** `/src/components/icons/CloseIcon/index.tsx`

**Props:**
```typescript
interface ICloseIconProps {
  size?: number;        // default: 24
  color?: string;       // default: '#DEE2E6'
}
```

---

## 8. Color System (from @repo/core)

The design system uses colors exported from @repo/core:
- **colors.primary** - Primary brand color (blue)
- **colors.secondary** - Secondary brand color
- **colors.text** - Primary text color (dark)
- **colors.textSecondary** - Secondary text color (gray)
- **colors.border** - Border/divider color
- **colors.surface** - Card/container background
- **colors.error** - Error/danger color (red)
- **colors.warning** - Warning color (orange)

---

## 9. Export Structure

### Main Entry Point (`src/index.tsx`)
```typescript
// Direct exports
export * from './components';
export * from './theme';
export * from './utils';

// Namespaced exports
export * as Components from './components';
export * as Theme from './theme';
export * as Utils from './utils';
```

### Component Categories
- **Core:** Text, Button, Card, Spacer
- **Form:** TextInput, Checkbox, RadioButton, SelectField, DatePicker, etc.
- **Overlays:** BottomSheetModal, ConfirmModal, Skeleton variants
- **Shared:** Avatar, CollapsibleCard, SwipeableCard
- **Icons:** ArrowDownIcon, CalendarIcon, CloseIcon

---

## 10. Integration Patterns

### React Hook Form Integration
All form components have Form* variants that wrap the base components:

**Pattern:**
```typescript
import { FormTextInput } from '@repo/ui';
import { useForm } from 'react-hook-form';

const { control } = useForm();

<FormTextInput
  control={control}
  name="email"
  label="Email"
  rules={{ required: 'Email is required' }}
/>
```

### Responsive Design Pattern
Use the responsive utilities for scaling:

```typescript
import { useResponsive, widthPixel, heightPixel } from '@repo/ui';

const { isTablet, scale } = useResponsive();

// Or direct pixel conversion
const width = widthPixel(200); // From Figma 430px base
```

### Animation Pattern (Reanimated)
Components using Reanimated provide SharedValue parameters:

```typescript
const progress = new Animated.Value(0);
const drag = new Animated.Value(0);
```

---

## 11. Key Design Principles

1. **Responsive First:** All sizes use react-native-size-matters for consistent scaling
2. **Type-Safe:** Full TypeScript support with strict mode
3. **Form-Integrated:** Seamless react-hook-form integration
4. **Accessible:** Support for disabled states, error messages, labels
5. **Customizable:** Style props on all components
6. **Animated:** Smooth interactions using Reanimated
7. **Color System:** Centralized color management from @repo/core
8. **Modular:** Clear separation of concerns (core, form, overlays, shared, icons)

---

## 12. Usage Summary Table

| Component | Type | Key Props | Use Case |
|-----------|------|-----------|----------|
| Text | Display | variant, color | Typography system |
| Button | Interactive | variant, onPress, disabled | Call-to-action |
| Card | Container | style | Content wrapping |
| Spacer | Layout | size, horizontal | Spacing between elements |
| TextInput | Form | label, error, icon | Single-line text input |
| FormTextInput | Form | control, name, rules | Integrated text input |
| Checkbox | Form | checked, onChange, size | Boolean selection |
| RadioButton/Group | Form | options, value, onChange | Single selection |
| SelectField | Form | options, value, onChange | Dropdown selection |
| SelectMultiple | Form | options, value, onChange | Multi-select |
| DatePicker | Form | value, onChange, minDate | Single date selection |
| DateRangePicker | Form | value, onChange | Date range selection |
| BottomSheetModal | Overlay | visible, title, renderContent | Bottom sliding modal |
| ConfirmModal | Overlay | visible, onConfirm, variant | Confirmation dialog |
| Skeleton* | Overlay | width, height | Loading states |
| Avatar | Display | imageUrl, name, size | User/item representation |
| CollapsibleCard | Interactive | title, children | Expandable content |
| SwipeableCard | Interactive | renderLeftActions, renderRightActions | Swipe actions |

---

## 13. Architecture Highlights

### Folder Structure
```
packages/ui/src/
├── components/
│   ├── core/          (4 base components)
│   ├── form/          (13 form components)
│   ├── overlays/      (3 overlay + 5 skeleton variants)
│   ├── shared/        (3 display components)
│   ├── icons/         (3 SVG icons)
│   └── index.ts       (export orchestration)
├── theme/
│   ├── spacing.ts     (6-level spacing scale)
│   ├── typography.ts  (4 typography levels)
│   └── index.ts
├── utils/
│   ├── responsive.ts  (responsive utilities)
│   └── index.ts
└── index.tsx          (main entry point)
```

### Component Patterns
1. **forwardRef** used for TextInput (direct ref access)
2. **React.ReactNode** for flexible children
3. **StyleProp** for consistent style typing
4. **Callback pattern** for animations
5. **Context API** for SwipeableCard coordination
6. **Hooks** for responsive behavior

---

## 14. Performance Considerations

1. **Memoization:** Components use React.memo where appropriate
2. **Native Animations:** Reanimated for smooth 60fps animations
3. **Lazy Rendering:** Conditional rendering for expanded content
4. **Efficient Lists:** FlatList for option rendering
5. **Responsive Scaling:** react-native-size-matters prevents expensive calculations

---

## Summary

The @repo/ui package provides a complete, production-ready design system with:
- 40+ components across 5 categories
- Full TypeScript support
- React Hook Form integration
- Responsive design utilities
- Smooth animations with Reanimated
- Comprehensive theming system
- Clear, modular architecture

All components follow consistent patterns for props, styling, and behavior, making it easy to build cohesive interfaces quickly.
