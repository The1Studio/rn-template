# @repo/ui Component Inventory

## File Structure Overview

```
packages/ui/
├── package.json
├── tsconfig.json
└── src/
    ├── index.tsx                           (Main entry point)
    ├── components/
    │   ├── index.ts                        (Component exports orchestrator)
    │   ├── core/
    │   │   ├── index.ts
    │   │   ├── Text.tsx
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   └── Spacer.tsx
    │   ├── form/
    │   │   ├── index.ts
    │   │   ├── TextInput.tsx              (Base component)
    │   │   ├── FormTextInput.tsx          (Form integrated)
    │   │   ├── FormPasswordInput.tsx      (Form integrated, toggle)
    │   │   ├── Checkbox.tsx               (Base component)
    │   │   ├── FormCheckbox.tsx           (Form integrated)
    │   │   ├── RadioButton.tsx            (Base + RadioGroup)
    │   │   ├── FormRadioGroup.tsx         (Form integrated)
    │   │   ├── SelectField.tsx            (Base component)
    │   │   ├── FormSelectField.tsx        (Form integrated)
    │   │   ├── SelectMultiple.tsx         (Base component)
    │   │   ├── FormSelectMultiple.tsx     (Form integrated)
    │   │   ├── DatePicker.tsx             (Base + FormDatePicker)
    │   │   └── DateRangePicker.tsx        (Base + FormDateRangePicker)
    │   ├── overlays/
    │   │   ├── index.ts
    │   │   ├── BottomSheetModal.tsx       (Animated bottom modal)
    │   │   ├── ConfirmModal.tsx           (ConfirmModal + DeleteConfirmModal)
    │   │   └── Skeleton.tsx               (5 skeleton variants)
    │   ├── shared/
    │   │   ├── index.ts
    │   │   ├── Avatar.tsx                 (Avatar + AvatarImage + AvatarWithName)
    │   │   ├── CollapsibleCard.tsx        (Expandable card)
    │   │   └── SwipeableCard.tsx          (Swipeable + SwipeableCardProvider)
    │   └── icons/
    │       ├── index.ts
    │       ├── ArrowDownIcon/
    │       │   └── index.tsx
    │       ├── CalendarIcon/
    │       │   └── index.tsx
    │       └── CloseIcon/
    │           └── index.tsx
    ├── theme/
    │   ├── index.ts
    │   ├── spacing.ts                    (Spacing scale, 6 levels)
    │   └── typography.ts                 (Typography styles, 4 levels)
    └── utils/
        ├── index.ts
        └── responsive.ts                 (Responsive utilities + hooks)
```

---

## Complete Component List (40+ components)

### Core Components (4 components)

| Component | File | Exports | Status |
|-----------|------|---------|--------|
| **Text** | `core/Text.tsx` | `Text` | Complete |
| **Button** | `core/Button.tsx` | `Button` | Complete |
| **Card** | `core/Card.tsx` | `Card` | Complete |
| **Spacer** | `core/Spacer.tsx` | `Spacer` | Complete |

### Form Components (13 base components + 7 Form wrappers = 20 exportable components)

| Component | File | Exports | Form Wrapper | Status |
|-----------|------|---------|--------------|--------|
| **TextInput** | `form/TextInput.tsx` | `TextInput` | N/A | Complete |
| | `form/FormTextInput.tsx` | `FormTextInput` | Yes | Complete |
| **FormPasswordInput** | `form/FormPasswordInput.tsx` | `FormPasswordInput` | Built-in | Complete |
| **Checkbox** | `form/Checkbox.tsx` | `Checkbox` | N/A | Complete |
| | `form/FormCheckbox.tsx` | `FormCheckbox` | Yes | Complete |
| **RadioButton** | `form/RadioButton.tsx` | `RadioButton`, `RadioGroup` | N/A | Complete |
| | `form/FormRadioGroup.tsx` | `FormRadioGroup` | Yes | Complete |
| **SelectField** | `form/SelectField.tsx` | `SelectField` | N/A | Complete |
| | `form/FormSelectField.tsx` | `FormSelectField` | Yes | Complete |
| **SelectMultiple** | `form/SelectMultiple.tsx` | `SelectMultiple` | N/A | Complete |
| | `form/FormSelectMultiple.tsx` | `FormSelectMultiple` | Yes | Complete |
| **DatePicker** | `form/DatePicker.tsx` | `DatePicker`, `FormDatePicker` | Built-in | Complete |
| **DateRangePicker** | `form/DateRangePicker.tsx` | `DateRangePicker`, `FormDateRangePicker` | Built-in | Complete |

### Overlay Components (8 exportable components)

| Component | File | Exports | Status |
|-----------|------|---------|--------|
| **BottomSheetModal** | `overlays/BottomSheetModal.tsx` | `BottomSheetModal` | Complete |
| **ConfirmModal** | `overlays/ConfirmModal.tsx` | `ConfirmModal`, `DeleteConfirmModal` | Complete |
| **Skeleton** | `overlays/Skeleton.tsx` | `Skeleton`, `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`, `SkeletonListItem`, `SkeletonList` | Complete |

### Shared Components (3 + 2 convenience = 5 exportable components)

| Component | File | Exports | Status |
|-----------|------|---------|--------|
| **Avatar** | `shared/Avatar.tsx` | `Avatar`, `AvatarImage`, `AvatarWithName` | Complete |
| **CollapsibleCard** | `shared/CollapsibleCard.tsx` | `CollapsibleCard`, `ChevronIcon` (internal) | Complete |
| **SwipeableCard** | `shared/SwipeableCard.tsx` | `SwipeableCard`, `SwipeableCardProvider`, `useSwipeableContext` | Complete |

### Icon Components (3 components)

| Component | File | Exports | Status |
|-----------|------|---------|--------|
| **ArrowDownIcon** | `icons/ArrowDownIcon/index.tsx` | `ArrowDownIcon` (default) | Complete |
| **CalendarIcon** | `icons/CalendarIcon/index.tsx` | `CalendarIcon` (default) | Complete |
| **CloseIcon** | `icons/CloseIcon/index.tsx` | `CloseIcon` (default) | Complete |

### Theme & Utilities (Non-component exports)

| Export | File | Type | Items |
|--------|------|------|-------|
| **Spacing** | `theme/spacing.ts` | Object | 6 levels (xs-xxl) |
| **Typography** | `theme/typography.ts` | Object | 4 styles (h1-caption) |
| **useResponsive** | `utils/responsive.ts` | Hook | Screen, device, scale helpers |
| **Responsive Functions** | `utils/responsive.ts` | Functions | widthPixel, heightPixel, fontPixel, etc. (8 functions) |

---

## Export Summary

### Total Component Count
- **Core:** 4
- **Form (base + wrappers):** 20
- **Overlays:** 8
- **Shared:** 5
- **Icons:** 3
- **Total Exportable:** 40+

### Total File Count
- Component files: 33
- Theme files: 2
- Utils files: 1
- Config files: 2
- **Total: 38 files**

---

## Dependencies Between Components

### Form Components Dependencies
```
TextInput              ← Used by FormTextInput
Checkbox              ← Used by FormCheckbox
RadioButton/Group     ← Used by FormRadioGroup
SelectField           ← Used by FormSelectField + BottomSheetModal
SelectMultiple        ← Used by FormSelectMultiple + BottomSheetModal
DatePicker            ← Includes FormDatePicker internally
DateRangePicker       ← Includes FormDateRangePicker internally
```

### Cross-component Dependencies
```
SelectField           → Uses BottomSheetModal, ArrowDownIcon, CloseIcon
SelectMultiple        → Uses BottomSheetModal, ArrowDownIcon, CloseIcon
DatePicker            → Uses BottomSheetModal, CalendarIcon
DateRangePicker       → Uses BottomSheetModal, CalendarIcon
CollapsibleCard       → Uses ArrowDownIcon
ConfirmModal          → Uses ActivityIndicator (React Native)
BottomSheetModal      → Uses CloseIcon
```

### Provider Components
```
SwipeableCardProvider → Manages SwipeableCard context
useSwipeableContext() → Accesses SwipeableCard provider
```

---

## Component by Import Path

### Direct Imports (Recommended)
```typescript
// Core
import { Text, Button, Card, Spacer } from '@repo/ui';

// Form
import { 
  TextInput, FormTextInput,
  FormPasswordInput,
  Checkbox, FormCheckbox,
  RadioButton, RadioGroup, FormRadioGroup,
  SelectField, FormSelectField,
  SelectMultiple, FormSelectMultiple,
  DatePicker, FormDatePicker,
  DateRangePicker, FormDateRangePicker
} from '@repo/ui';

// Overlays
import { 
  BottomSheetModal,
  ConfirmModal, DeleteConfirmModal,
  Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonListItem, SkeletonList
} from '@repo/ui';

// Shared
import { 
  Avatar, AvatarImage, AvatarWithName,
  CollapsibleCard,
  SwipeableCard, SwipeableCardProvider, useSwipeableContext
} from '@repo/ui';

// Icons
import { ArrowDownIcon, CalendarIcon, CloseIcon } from '@repo/ui';

// Theme
import { Spacing, Typography } from '@repo/ui';

// Utils
import { useResponsive, widthPixel, heightPixel, fontPixel } from '@repo/ui';
```

### Namespaced Imports (Alternative)
```typescript
import * as UI from '@repo/ui';

UI.Text
UI.Button
UI.FormTextInput
UI.Skeleton
UI.Avatar
UI.Spacing
UI.useResponsive
```

---

## Version & Maintenance Info

- **Package Version:** 0.0.1
- **TypeScript Target:** ES2020
- **Build System:** TypeScript compiler (tsconfig.json)
- **Type Declarations:** Full (declaration: true, declarationMap: true)
- **JSX Mode:** react-native

---

## Installation & Setup

### Requirements
```json
{
  "react": "*",
  "react-native": "*",
  "react-hook-form": "^7.0.0",
  "react-native-ui-datepicker": "*",
  "react-native-gesture-handler": "*",
  "react-native-reanimated": "*",
  "react-native-worklets": "*",
  "dayjs": "*",
  "react-native-size-matters": "^0.4.2"
}
```

### Quick Setup
```bash
# The package is a workspace member, imports work directly
import { Text, Button, FormTextInput } from '@repo/ui';
```

---

## File Size & Metrics

### Component Files Breakdown
- **core/** - 4 files (~200 lines total)
- **form/** - 13 files (~2000 lines total)
- **overlays/** - 3 files (~600 lines total)
- **shared/** - 3 files (~400 lines total)
- **icons/** - 3 files (~100 lines total)
- **theme/** - 2 files (~50 lines total)
- **utils/** - 1 file (~100 lines total)

**Estimated Total:** ~3,450 lines of component code

---

## Component Implementation Status

All 40+ components are fully implemented with:
- Full TypeScript support
- JSDoc comments
- Style customization
- Error handling
- Accessibility features
- Form integration (where applicable)

No placeholder or incomplete components.

---

## Notes for Developers

1. **forwardRef usage:** TextInput uses forwardRef for direct input access
2. **React Hook Form:** All Form* wrappers assume `react-hook-form` context
3. **Animations:** BottomSheetModal, CollapsibleCard, Skeleton use Reanimated
4. **Responsive:** All sizes use react-native-size-matters for scaling
5. **Colors:** All components use colors from @repo/core
6. **Icons:** Only 3 SVG icons built-in; extend by adding more to icons/ folder
7. **Provider pattern:** SwipeableCardProvider is required wrapper for SwipeableCard list

