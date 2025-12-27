# @repo/ui Quick Reference Guide

## Component Directory

### Core Components (4)
```
Text          → Typography display (h1, h2, body, caption)
Button        → CTA button (primary, secondary, outline)
Card          → Container with shadow
Spacer        → Layout spacing (horizontal/vertical)
```

### Form Components (13)
```
TextInput              → Basic text input with icons/errors
FormTextInput         → TextInput + react-hook-form
FormPasswordInput     → Password toggle + react-hook-form
Checkbox              → Boolean selection (3 sizes)
FormCheckbox          → Checkbox + react-hook-form
RadioButton           → Single option selector
RadioGroup            → Multiple radio buttons
FormRadioGroup        → RadioGroup + react-hook-form
SelectField           → Dropdown single select
FormSelectField       → SelectField + react-hook-form
SelectMultiple        → Multi-select with chips
FormSelectMultiple    → SelectMultiple + react-hook-form
DatePicker            → Single date selection
FormDatePicker        → DatePicker + react-hook-form
DateRangePicker       → Date range selection
FormDateRangePicker   → DateRangePicker + react-hook-form
```

### Overlay Components (8)
```
BottomSheetModal      → Animated bottom modal
ConfirmModal          → Confirmation dialog (3 variants)
DeleteConfirmModal    → Delete confirmation preset
Skeleton              → Basic loading placeholder
SkeletonText          → Multi-line text skeleton
SkeletonAvatar        → Avatar skeleton
SkeletonCard          → Card skeleton
SkeletonList          → List item skeleton
```

### Shared Components (3)
```
Avatar                → User avatar (5 sizes, 3 shapes)
CollapsibleCard       → Expandable content card
SwipeableCard         → Swipeable actions card
```

### Icons (3)
```
ArrowDownIcon         → Dropdown arrow
CalendarIcon          → Calendar icon
CloseIcon             → Close/dismiss icon
```

---

## Common Usage Patterns

### Text with Variants
```typescript
import { Text } from '@repo/ui';

<Text variant="h1">Large Heading</Text>
<Text variant="body" color="#FF0000">Colored Body</Text>
```

### Button Variants
```typescript
import { Button } from '@repo/ui';

<Button title="Primary" onPress={} />
<Button title="Secondary" variant="secondary" onPress={} />
<Button title="Outline" variant="outline" onPress={} />
<Button title="Disabled" disabled onPress={} />
```

### Form with Validation
```typescript
import { FormTextInput, FormCheckbox, Button } from '@repo/ui';
import { useForm } from 'react-hook-form';

const { control, handleSubmit } = useForm({
  defaultValues: { email: '', agreed: false }
});

const onSubmit = (data) => console.log(data);

return (
  <>
    <FormTextInput
      control={control}
      name="email"
      label="Email"
      rules={{ required: 'Email required' }}
    />
    <FormCheckbox
      control={control}
      name="agreed"
      label="I agree"
    />
    <Button title="Submit" onPress={handleSubmit(onSubmit)} />
  </>
);
```

### Select Options
```typescript
import { FormSelectField } from '@repo/ui';

<FormSelectField
  control={control}
  name="category"
  label="Choose Category"
  options={[
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' }
  ]}
  rules={{ required: 'Required' }}
/>
```

### Date Picking
```typescript
import { FormDatePicker } from '@repo/ui';

<FormDatePicker
  control={control}
  name="birthDate"
  label="Birth Date"
  minDate={new Date(1950, 0, 1)}
  maxDate={new Date()}
/>
```

### Modal Confirmation
```typescript
import { ConfirmModal } from '@repo/ui';

const [showDelete, setShowDelete] = useState(false);

return (
  <>
    <Button title="Delete" onPress={() => setShowDelete(true)} />
    <ConfirmModal
      visible={showDelete}
      title="Delete Item?"
      message="This cannot be undone"
      variant="danger"
      onConfirm={() => { /* delete */ }}
      onClose={() => setShowDelete(false)}
    />
  </>
);
```

### Loading Skeleton
```typescript
import { SkeletonCard, SkeletonText } from '@repo/ui';

{isLoading ? (
  <SkeletonCard />
) : (
  <YourContent />
)}
```

### Avatar Display
```typescript
import { Avatar, AvatarWithName } from '@repo/ui';

<Avatar 
  imageUrl="https://..." 
  name="John Doe" 
  size="md"
/>

<AvatarWithName
  imageUrl="https://..."
  name="John Doe"
  namePosition="right"
/>
```

### Expandable Card
```typescript
import { CollapsibleCard } from '@repo/ui';

<CollapsibleCard
  title="More Details"
  defaultExpanded={false}
  onToggle={(expanded) => console.log(expanded)}
>
  <Text>Content shown when expanded</Text>
</CollapsibleCard>
```

### Swipeable Actions
```typescript
import { SwipeableCard, SwipeableCardProvider } from '@repo/ui';

<SwipeableCardProvider>
  <SwipeableCard
    renderLeftActions={(progress, drag, close) => (
      <TouchableOpacity onPress={() => { /* edit */ close() }}>
        <Text>Edit</Text>
      </TouchableOpacity>
    )}
    renderRightActions={(progress, drag, close) => (
      <TouchableOpacity onPress={() => { /* delete */ close() }}>
        <Text>Delete</Text>
      </TouchableOpacity>
    )}
  >
    <Text>Swipeable content</Text>
  </SwipeableCard>
</SwipeableCardProvider>
```

---

## Theme & Responsive

### Spacing System
```typescript
import { Spacing } from '@repo/ui';

Spacing.xs   // 4px
Spacing.sm   // 8px
Spacing.md   // 16px
Spacing.lg   // 24px
Spacing.xl   // 32px
Spacing.xxl  // 40px
```

### Typography Styles
```typescript
import { Typography } from '@repo/ui';

Typography.h1      // fontSize: 32, fontWeight: '700'
Typography.h2      // fontSize: 24, fontWeight: '600'
Typography.body    // fontSize: 16, fontWeight: '400'
Typography.caption // fontSize: 12, fontWeight: '400'
```

### Responsive Utilities
```typescript
import { useResponsive, widthPixel, heightPixel } from '@repo/ui';

const { width, height, isTablet, isLargeScreen } = useResponsive();
const w = widthPixel(200);  // From Figma 430px base
const h = heightPixel(100); // From Figma 932px base
```

---

## Size/Variant Options

### Text Variants
- `h1` - Heading 1
- `h2` - Heading 2
- `body` - Default body text
- `caption` - Small caption text

### Button Variants
- `primary` - Solid primary color
- `secondary` - Solid secondary color
- `outline` - Bordered style

### Checkbox/RadioButton Sizes
- `small` - 18x18 (14px font)
- `medium` - 22x22 (16px font)
- `large` - 26x26 (18px font)

### Avatar Sizes
- `xs` - 24x24 (10px font)
- `sm` - 32x32 (12px font)
- `md` - 40x40 (16px font)
- `lg` - 56x56 (22px font)
- `xl` - 80x80 (32px font)

### Avatar Variants
- `circle` - Fully rounded
- `rounded` - 20% border radius
- `square` - No rounding

### ConfirmModal Variants
- `danger` - Red color
- `warning` - Orange color
- `info` - Blue color

---

## Props Cheat Sheet

### Common Style Props
All components support:
- `containerStyle?: ViewStyle`
- `style?: ViewStyle`
- `labelStyle?: TextStyle`
- `errorStyle?: TextStyle`

### Form Component Props
All Form* components accept:
```typescript
control: Control<T>           // from useForm()
name: Path<T>                 // field name
rules?: RegisterOptions<T>    // validation rules
```

### Common Error Handling
```typescript
<TextInput
  label="Email"
  error={errors.email?.message}  // Shows error text below
  {...}
/>
```

---

## Color System (from @repo/core)

```typescript
colors.primary          // Primary brand color
colors.secondary        // Secondary brand color
colors.text             // Primary text (dark)
colors.textSecondary    // Secondary text (gray)
colors.border           // Borders/dividers
colors.surface          // Card/container bg
colors.error            // Red for errors
colors.warning          // Orange for warnings
```

---

## TypeScript Generics

Select components support generic typing:
```typescript
<SelectField<'a' | 'b' | 'c'>
  options={[
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ]}
/>
```

RadioGroup/SelectMultiple also support generics for type-safe values.

---

## Performance Tips

1. **Memoize callbacks** passed to form components
2. **Use forwardRef** on TextInput for direct ref access
3. **Provider wrapper** (SwipeableCardProvider) prevents re-renders
4. **FlatList** internally used for large option lists
5. **Reanimated** provides smooth 60fps animations

---

## Common Gotchas

1. **Form integration** - Always wrap Form* components in useForm()
2. **SwipeableCard** - Must be wrapped in SwipeableCardProvider
3. **Date format** - Use DateFormats from @repo/core for consistency
4. **Icons** - Only 3 built-in icons (ArrowDown, Calendar, Close)
5. **Max height** - Select modals max at 300px, set renderOption for custom layouts

---

## Files Location

All components in: `/packages/ui/src/components/`
- `core/` - Text, Button, Card, Spacer
- `form/` - All form inputs
- `overlays/` - Modals, Skeleton
- `shared/` - Avatar, CollapsibleCard, SwipeableCard
- `icons/` - SVG icons

Theme: `/packages/ui/src/theme/`
- `spacing.ts` - Spacing scale
- `typography.ts` - Font styles

Utils: `/packages/ui/src/utils/`
- `responsive.ts` - Responsive utilities
