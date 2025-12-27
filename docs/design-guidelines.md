# Design Guidelines

## Design System Overview

The design system is built into the `@repo/ui` package and provides a comprehensive set of pre-built components, spacing, typography, and color utilities.

### Core Principles

1. **Consistency:** Unified look and feel across the app
2. **Accessibility:** Touch-friendly (48px minimum), readable text
3. **Responsive:** Adapts to different screen sizes and orientations
4. **Performance:** Components optimized for smooth animations
5. **Simplicity:** Minimal, clean interface (no skeuomorphism)

---

## Color System

### Palette

The design system includes an 11-color palette from `@repo/ui/constants/colors.ts`:

```typescript
const colors = {
  primary: '#007AFF',       // iOS blue
  secondary: '#5AC8FA',     // Light blue
  success: '#4CD964',       // Green
  warning: '#FF9500',       // Orange
  danger: '#FF3B30',        // Red
  info: '#34C759',          // Green
  neutral100: '#F9F9F9',    // Very light gray (backgrounds)
  neutral200: '#F0F0F0',    // Light gray
  neutral500: '#757575',    // Medium gray (secondary text)
  neutral900: '#1A1A1A',    // Near black (primary text)
  transparent: 'rgba(0,0,0,0)',
};
```

### Usage Guidelines

**Text Colors:**
- Primary text: `neutral900`
- Secondary text: `neutral500`
- Disabled text: `neutral300`

**Background Colors:**
- App background: `neutral100` or white
- Card background: white
- Overlay background: `rgba(0, 0, 0, 0.5)` (semi-transparent)

**Action Colors:**
- Primary button: `primary`
- Danger button: `danger`
- Disabled button: `neutral300`

**Status Colors:**
- Success: `success` (#4CD964)
- Warning: `warning` (#FF9500)
- Error: `danger` (#FF3B30)
- Info: `info` (#34C759)

### Color Utility Function

```typescript
import { generateColor } from '@repo/core';

// Generate deterministic color from text
const avatarColor = generateColor(userName);
// Returns: "rgb(r, g, b)" string
```

---

## Typography

### Type Scale

Six typography levels (from @repo/ui):

```typescript
// Heading levels (largest to smallest)
- h1: 32px, bold, line-height 1.2
- h2: 28px, bold, line-height 1.2
- h3: 24px, bold, line-height 1.3
- body: 16px, regular, line-height 1.5
- caption: 14px, regular, line-height 1.4
- small: 12px, regular, line-height 1.4
```

### Font Selection

- **Primary Font:** System fonts (iOS: SF Pro, Android: Roboto)
- **Fallback:** Default system fonts
- **Benefit:** Optimal performance, native feel

### Font Weights

- **Regular (400):** Body text, regular weights
- **Medium (500):** Buttons, tab labels
- **Bold (700):** Headings, emphasized text

### Usage Examples

```typescript
import { Text } from '@repo/ui';

// Large heading
<Text style={{ fontSize: 32, fontWeight: 'bold' }}>
  Screen Title
</Text>

// Body text
<Text style={{ fontSize: 16, lineHeight: 24 }}>
  Regular paragraph content
</Text>

// Caption/Small text
<Text style={{ fontSize: 12, color: 'gray' }}>
  Metadata or secondary information
</Text>
```

---

## Spacing System

### Spacing Scale

Eight-point grid system (multiples of 8):

```typescript
const spacing = {
  xs: 4,        // Extra small (padding inside tight components)
  sm: 8,        // Small (icon padding, badge padding)
  md: 12,       // Medium (component internal spacing)
  lg: 16,       // Large (standard spacing between elements)
  xl: 20,       // Extra large
  xxl: 24,      // Double extra large (section spacing)
  huge: 32,     // Huge (large section gaps)
  massive: 48,  // Massive (screen-level spacing)
};
```

### Application

**Internal Component Spacing:**
- Button padding: `16px` (lg)
- Card padding: `16px` (lg)
- Input padding: `12px` (md)

**Between Components:**
- Button to button: `8px` (sm)
- Section to section: `24px` (xxl)
- Screen margins: `16px` (lg) on sides

**List Item Spacing:**
- Vertical gap: `8px` (sm)
- List padding: `16px` (lg)

### Spacer Component

```typescript
import { Spacer } from '@repo/ui';

<View>
  <Text>Header</Text>
  <Spacer height="md" />
  <Text>Body text with space above</Text>
</View>
```

---

## Component Library

### Core Components

#### Text Component
```typescript
import { Text } from '@repo/ui';

<Text>Regular text</Text>
<Text style={{ fontWeight: 'bold' }}>Bold text</Text>
<Text style={{ fontSize: 12, color: colors.neutral500 }}>
  Small, secondary text
</Text>
```

#### Button Component
```typescript
import { Button } from '@repo/ui';

// Primary button
<Button title="Submit" onPress={handleSubmit} />

// Secondary button
<Button title="Cancel" variant="secondary" onPress={handleCancel} />

// Disabled button
<Button title="Loading..." disabled />
```

#### Card Component
```typescript
import { Card } from '@repo/ui';

<Card>
  <Text>Card content</Text>
  <Text>Additional information</Text>
</Card>
```

#### Spacer Component
```typescript
import { Spacer } from '@repo/ui';

<Spacer height={16} />  // Vertical spacing
<Spacer width={8} />    // Horizontal spacing
```

### Form Components (20+ variants)

#### TextInput
```typescript
import { TextInput } from '@repo/ui';

<TextInput
  placeholder="Enter text"
  value={value}
  onChangeText={setValue}
  editable={!isLoading}
/>
```

#### Select/Picker
```typescript
import { Select } from '@repo/ui';

<Select
  options={[
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ]}
  value={selected}
  onValueChange={setSelected}
/>
```

#### DatePicker
```typescript
import { DatePicker } from '@repo/ui';

<DatePicker
  value={date}
  onChange={setDate}
  minimumDate={new Date()}
/>
```

#### Checkbox
```typescript
import { Checkbox } from '@repo/ui';

<Checkbox
  checked={isChecked}
  onPress={() => setIsChecked(!isChecked)}
  label="I agree to terms"
/>
```

### Overlay Components

#### Modal
```typescript
import { Modal } from '@repo/ui';

<Modal visible={isOpen} onClose={handleClose}>
  <Text>Modal content</Text>
  <Button title="Close" onPress={handleClose} />
</Modal>
```

#### BottomSheet
```typescript
import { BottomSheet } from '@repo/ui';

<BottomSheet visible={isOpen} onClose={handleClose}>
  <Text>Sheet content</Text>
  <Button title="Close" onPress={handleClose} />
</BottomSheet>
```

#### Skeleton Loaders
```typescript
import { SkeletonText, SkeletonImage, SkeletonButton } from '@repo/ui';

// Loading state
{isLoading ? (
  <>
    <SkeletonText width={100} />
    <SkeletonImage width={200} height={200} />
    <SkeletonButton width={150} />
  </>
) : (
  // Actual content
)}
```

### Shared Components

#### Avatar (3 variants)
```typescript
import { Avatar, AvatarWithInitials, AvatarWithImage } from '@repo/ui';

// Image avatar
<AvatarWithImage source={{ uri: imageUrl }} size={48} />

// Initials avatar
<AvatarWithInitials initials="JD" size={48} />

// Default avatar
<Avatar backgroundColor={colors.primary} size={48} />
```

#### CollapsibleCard
```typescript
import { CollapsibleCard } from '@repo/ui';

<CollapsibleCard title="Section Title" defaultOpen={true}>
  <Text>Collapsible content</Text>
</CollapsibleCard>
```

#### SwipeableCard
```typescript
import { SwipeableCard } from '@repo/ui';

<SwipeableCard
  onSwipeLeft={() => handleDelete()}
  onSwipeRight={() => handleEdit()}
>
  <Text>Swipeable content</Text>
</SwipeableCard>
```

### Icon Components

Common icons available:
- **ArrowDown:** Directional indicator
- **Calendar:** Date selection
- **Close:** Dismiss/cancel
- **Check:** Confirmation
- **Menu:** Navigation drawer toggle

```typescript
import { ArrowDown, Calendar, Close } from '@repo/ui';

<ArrowDown color={colors.primary} size={24} />
<Calendar size={20} />
<Close color={colors.danger} size={16} />
```

---

## Layout Patterns

### Safe Area Handling

All screens automatically handle safe area (notch, home indicator):

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = () => (
  <SafeAreaView style={{ flex: 1 }}>
    {/* Content is automatically inset from safe area */}
  </SafeAreaView>
);
```

### Tab Navigation Layout

5 tabs at bottom of screen:

```
┌─────────────────────────────────┐
│     Screen Content              │
│     (app/(tabs)/index.tsx)       │
│                                 │
├─────────────────────────────────┤
│ 🏠  🔍  📝  ⚙️  🎨  (Tab Bar)    │
└─────────────────────────────────┘
```

### Standard Screen Layout

```
┌─────────────────────────────────┐
│ ← Title / Actions (Header)      │ (if needed)
├─────────────────────────────────┤
│                                 │
│   Screen Content (Scrollable)   │
│                                 │
│   - List items                  │
│   - Cards                       │
│   - Forms                       │
│                                 │
├─────────────────────────────────┤
│ [Primary Button] [Secondary]    │ (Footer - sticky)
└─────────────────────────────────┘
```

### Card-Based Layout

For list items and content cards:

```typescript
<View style={{ padding: 16 }}>
  <Card>
    <Text style={{ fontWeight: 'bold' }}>Card Title</Text>
    <Spacer height="sm" />
    <Text style={{ color: colors.neutral500 }}>Card description</Text>
    <Spacer height="md" />
    <Button title="Action" onPress={handleAction} />
  </Card>
</View>
```

---

## Responsive Design

### Screen Breakpoints

```typescript
const breakpoints = {
  xs: 320,    // Small phones
  sm: 480,    // Regular phones
  md:768,    // Tablets
  lg: 1024,   // Large tablets
};
```

### Responsive Utilities

```typescript
import { useWindowDimensions } from 'react-native';

export const ResponsiveComponent = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 480;

  return (
    <View style={{
      padding: isMobile ? 12 : 24,
      flexDirection: isMobile ? 'column' : 'row',
    }}>
      {/* Responsive layout */}
    </View>
  );
};
```

### Safe Area Considerations

- **iPhone notch:** SafeAreaView automatically insets content
- **Android system UI:** Bottom navigation considered
- **Landscape mode:** Horizontal safe area considered

---

## Animations & Interactions

### Transition Patterns

**Page Navigation:**
- Slide from right (iOS)
- Fade + slide (Android)
- Handled automatically by Expo Router

**Modal Opening:**
```typescript
import Animated, { withSpring } from 'react-native-reanimated';

const scale = useSharedValue(0);

useEffect(() => {
  scale.value = withSpring(1);
}, []);
```

**Button Feedback:**
- Visual feedback on press (opacity change)
- Haptic feedback (vibration) on important actions
- Toast notification for confirmation

### Gesture Interactions

**Swipe:**
- Swipe left: Additional actions menu (swipeable card)
- Swipe right: Go back
- Swipe up/down: Scroll/dismiss modal

**Press:**
- Minimum touch target: 48px × 48px
- Feedback: Opacity change, scale animation
- Long press: Context menu (if applicable)

**Pinch:**
- Zoom images/content (pinch to zoom)
- Not commonly used, but supported by reanimated

---

## Accessibility

### Touch Targets

**Minimum size:** 48px × 48px (Apple/Material Design standard)

```typescript
// ✓ Accessible button
<Pressable
  onPress={handlePress}
  style={{ minWidth: 48, minHeight: 48, padding: 12 }}
>
  <Icon size={24} />
</Pressable>

// ✗ Too small
<Pressable onPress={handlePress} style={{ width: 20, height: 20 }}>
  <Icon size={20} />
</Pressable>
```

### Text Contrast

**Minimum contrast ratio:** 4.5:1 (WCAG AA)

- Primary text on white: ✓ (ratio > 7:1)
- Secondary text (gray) on white: ✓ (ratio > 4.5:1)
- Button text: ✓ (high contrast)

### Text Size

**Minimum readable size:** 14px

- Primary content: 16px
- Secondary content: 14px
- Small labels: 12px (with high contrast)

### Accessibility Features

```typescript
import { View, Text } from 'react-native';

// Button with accessibility labels
<Pressable
  onPress={handleDelete}
  accessible={true}
  accessibilityLabel="Delete item"
  accessibilityHint="Double-tap to remove this item"
  accessibilityRole="button"
>
  <Icon name="trash" />
</Pressable>

// Form field with label
<Text accessibilityLabel="Email address input field">
  Email
</Text>
<TextInput
  accessible={true}
  accessibilityLabel="Email input"
  accessibilityHint="Enter your email address"
  placeholder="you@example.com"
/>
```

---

## Dark Mode (Future)

Currently using light theme only. Future dark mode implementation will:

1. Define dark color palette
2. Use `useColorScheme()` to detect system preference
3. Provide theme context
4. Update all components for light/dark support

---

## Component Usage Examples

### User Profile Card

```typescript
import { Card, Text, Avatar, Button, Spacer } from '@repo/ui';

export const UserCard = ({ user, onMessage }) => (
  <Card style={{ padding: 16 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <AvatarWithImage source={{ uri: user.avatar }} size={48} />
      <Spacer width="md" />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {user.name}
        </Text>
        <Text style={{ color: colors.neutral500 }}>@{user.username}</Text>
      </View>
    </View>
    <Spacer height="md" />
    <Button title="Message" onPress={onMessage} fullWidth />
  </Card>
);
```

### Form with Validation

```typescript
import {
  TextInput,
  Select,
  Checkbox,
  Button,
  Text,
  Spacer,
} from '@repo/ui';

export const RegistrationForm = ({ onSubmit, isLoading }) => {
  const { control, formState: { errors }, handleSubmit } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  return (
    <View style={{ padding: 16 }}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <>
            <Text>Email</Text>
            <TextInput {...field} placeholder="you@example.com" />
            {errors.email && (
              <Text style={{ color: colors.danger }}>
                {errors.email.message}
              </Text>
            )}
          </>
        )}
      />
      <Spacer height="md" />

      <Controller
        control={control}
        name="country"
        render={({ field }) => (
          <>
            <Text>Country</Text>
            <Select
              options={countryOptions}
              value={field.value}
              onValueChange={field.onChange}
            />
          </>
        )}
      />
      <Spacer height="md" />

      <Controller
        control={control}
        name="agreeToTerms"
        render={({ field }) => (
          <Checkbox
            checked={field.value}
            onPress={() => field.onChange(!field.value)}
            label="I agree to terms and conditions"
          />
        )}
      />
      {errors.agreeToTerms && (
        <Text style={{ color: colors.danger }}>
          {errors.agreeToTerms.message}
        </Text>
      )}
      <Spacer height="lg" />

      <Button
        title={isLoading ? 'Loading...' : 'Register'}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        fullWidth
      />
    </View>
  );
};
```

### Loading Skeleton

```typescript
import { SkeletonText, SkeletonImage, Card, Spacer } from '@repo/ui';

export const UserCardSkeleton = () => (
  <Card style={{ padding: 16 }}>
    <View style={{ flexDirection: 'row' }}>
      <SkeletonImage width={48} height={48} borderRadius={24} />
      <Spacer width="md" />
      <View style={{ flex: 1 }}>
        <SkeletonText width={120} height={16} />
        <Spacer height="sm" />
        <SkeletonText width={100} height={14} />
      </View>
    </View>
  </Card>
);
```

---

## Design Best Practices

### Do's

- ✓ Use consistent spacing (8px grid)
- ✓ Provide visual feedback on interactions
- ✓ Keep hierarchy clear (headings, body, captions)
- ✓ Respect safe areas (notch, home indicator)
- ✓ Use semantic colors (primary, danger, success)
- ✓ Ensure 48px+ touch targets
- ✓ Test on different device sizes
- ✓ Provide loading states
- ✓ Give clear error messages
- ✓ Use animations sparingly (for feedback, not decoration)

### Don'ts

- ✗ Mix inconsistent spacing
- ✗ Use custom colors (use palette only)
- ✗ Create small touch targets (<48px)
- ✗ Overuse animations (slows down app)
- ✗ Ignore safe area
- ✗ Use poor text contrast
- ✗ Leave users guessing (no feedback)
- ✗ Over-complicate forms
- ✗ Forget about loading states
- ✗ Use jarring, unpredictable interactions

---

## Component Demonstration

The **Playground screen** includes 40+ component examples demonstrating all patterns above. Access via bottom tab navigation.

---

**Last Updated:** 2025-12-26
**Scope:** Design system, components, and usage guidelines
**Next Review:** When new components added or design changes occur
