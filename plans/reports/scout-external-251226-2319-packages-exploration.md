# Packages Directory Exploration Report
**Date:** 2025-12-26 | **Scope:** packages/core and packages/ui submodules

## Overview
Both `packages/core` and `packages/ui` are initialized as git submodules pointing to external repositories. They contain well-structured, export-driven modules providing shared functionality across the monorepo.

---

## Package Status

### Git Submodule Status
- **packages/core**: `e846c35cded13d3b7e33e86fea01794212faa441` (heads/master)
  - Repository: `git@github.com:The1Studio/rn-core.git`
  - Status: ✓ Initialized and populated

- **packages/ui**: `d7c830047a3608a05c310e9f73fe4f57b2a8cbcc` (heads/master)
  - Repository: `git@github.com:The1Studio/rn-ui.git`
  - Status: ✓ Initialized and populated

---

## @repo/core Package

**Purpose:** Pure logic utilities and state management adapters for React Native
**Location:** `/Users/tuha/Clients/1M/rn-template/packages/core`
**Entry Point:** `src/index.ts`
**Main:** `./src/index.ts` | **Types:** `./src/index.ts`

### Package Dependencies

**Peer Dependencies:**
- `expo-secure-store` (*)
- `react` (*)
- `zustand` (*)

**Direct Dependencies:**
- `moment@^2.30.1`

**Dev Dependencies:**
- `@types/react@~19.1.0`
- `expo-secure-store@~15.0.2`
- `typescript@^5.3.0`
- `zustand@^5.0.9`

### Exported Modules

#### Direct Exports (Convenience)
All modules available at root level and via namespaced imports.

#### 1. **Hooks** → `src/hooks/`
| Hook | File | Purpose |
|------|------|---------|
| `useToggle` | `useToggle.ts` | Boolean state toggle. Returns `[value, toggle]` tuple. |
| `useCounter` | `useCounter.ts` | Counter management. Returns `{count, increment, decrement, reset}`. |
| `useDebounce` | `useDebounce/index.ts` | Debounced value computation for performance optimization. |

**Export Method:**
```typescript
export * from './useToggle';
export * from './useCounter';
export { default as useDebounce } from './useDebounce';
```

#### 2. **Utils** → `src/utils/`
**Format Utilities** (`format.ts`)
- String formatting and manipulation helpers

**Validation Utilities** (`validation.ts`)
- `isValidEmail(email: string): boolean` - Email format validation (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- `isValidPhone(phone: string): boolean` - Phone format validation (regex: `/^\+?[\d\s-]{10,}$/`)
- `isEmpty(value: string | null | undefined): boolean` - Check if value is empty/null/undefined

**Date Utilities** (`date.ts`)
- Date manipulation and formatting (uses `moment` library)

**Color Utilities** (`color.ts`)
- Color manipulation and conversion helpers

**Export Method:**
```typescript
export * from './format';
export * from './validation';
export * from './date';
export * from './color';
```

#### 3. **Constants** → `src/constants/`
**Colors** (`colors.ts`)
- Color palette and constants for the application

**Export Method:**
```typescript
export * from './colors';
```

#### 4. **Storage** → `src/storage/`
Secure storage implementations with Zustand adapter support.

**A. Secure Storage** (`secureStorage.ts`)
Using `expo-secure-store` for sensitive data:

```typescript
// Helper object with methods:
secureStorage.getString(key: string): Promise<string | null>
secureStorage.setString(key: string, value: string): Promise<void>
secureStorage.getObject<T>(key: string): Promise<T | null>  // JSON
secureStorage.setObject<T>(key: string, value: T): Promise<void>
secureStorage.remove(key: string): Promise<void>

// Zustand persist adapter for use with Zustand state stores:
zustandSecureStorage: StateStorage  // Implements getItem, setItem, removeItem

// Direct access:
SecureStore  // Re-exported expo-secure-store
```

**B. Token Storage** (`tokenStorage.ts`)
Authentication token management using secure storage backend:

```typescript
// Storage Keys
TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN'
}

// Access Token Functions
getToken(): Promise<string | null>
setToken(token: string): Promise<void>
removeToken(): Promise<void>

// Refresh Token Functions
getRefreshToken(): Promise<string | null>
setRefreshToken(refreshToken: string): Promise<void>
removeRefreshToken(): Promise<void>

// Utility Functions
setTokens(token: string, refreshToken: string): Promise<void>  // Set both atomically
clearTokens(): Promise<void>  // Remove both atomically
getTokens(): Promise<{token: string | null; refreshToken: string | null}>
```

**Export Method:**
```typescript
export {
  secureStorage,
  SecureStore,
  zustandSecureStorage,
} from './secureStorage';

export {
  TOKEN_STORAGE_KEYS,
  getToken,
  setToken,
  removeToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  setTokens,
  clearTokens,
  getTokens,
} from './tokenStorage';
```

#### 5. **Path** → `src/path/`
Query parameter and string manipulation utilities:

```typescript
// Convert variables array to query string
varToStringParams(data: {variablesArray: {key, value}[]}): string
// Example: [{key: 'foo', value: 'bar'}] → '?foo=bar'

// Array to string conversion
arrayToStr(arr: Array<string|number>, separator=','): string

// String to array conversion (removes spaces, filters empty)
strToArr(str: string, separator=','): string[]

// Object to query param string (alphabetically sorted keys)
objToStringParams(queryObj: Record<string, value>): string
// Example: {z: 1, a: 2} → '?a=2&z=1'
```

### Re-exports Summary
```typescript
// src/index.ts
export * from './hooks';
export * from './utils';
export * from './constants';
export * from './storage';
export * from './path';

// Namespaced variants:
export * as Hooks from './hooks';
export * as Utils from './utils';
export * as Constants from './constants';
export * as Storage from './storage';
```

---

## @repo/ui Package

**Purpose:** React Native UI component library and design system
**Location:** `/Users/tuha/Clients/1M/rn-template/packages/ui`
**Entry Point:** `src/index.tsx`
**Main:** `./src/index.tsx` | **Types:** `./src/index.tsx`

### Package Dependencies

**Peer Dependencies:**
- `react` (*)
- `react-native` (*)
- `react-hook-form@^7.0.0`
- `react-native-ui-datepicker` (*)
- `react-native-gesture-handler` (*)
- `react-native-reanimated` (*)
- `react-native-worklets` (*)
- `dayjs` (*)

**Direct Dependencies:**
- `react-native-size-matters@^0.4.2`

**Dev Dependencies:**
- `@types/react@~19.1.0`
- `react-hook-form@^7.69.0`
- `react-native@0.81.5`
- `typescript@^5.3.0`

### Component Architecture

All components exported via categorical index files. Components organized by type and category.

#### 1. **Core Components** → `src/components/core/`
Base UI primitives used throughout the design system:

| Component | File | Purpose |
|-----------|------|---------|
| `Text` | `Text.tsx` | Typography primitive with style variants |
| `Button` | `Button.tsx` | Interactive button component |
| `Card` | `Card.tsx` | Container with consistent spacing/elevation |
| `Spacer` | `Spacer.tsx` | Flexible spacing component |

**Export:**
```typescript
export * from './Text';
export * from './Button';
export * from './Card';
export * from './Spacer';
```

#### 2. **Form Components** → `src/components/form/`
Complete form input ecosystem with both controlled and react-hook-form variants:

| Component | Type | Purpose |
|-----------|------|---------|
| `TextInput` | Base | Uncontrolled text input |
| `FormTextInput` | RHF | react-hook-form integration |
| `FormPasswordInput` | RHF | Password input with react-hook-form |
| `Checkbox` | Base | Uncontrolled checkbox |
| `FormCheckbox` | RHF | Checkbox with react-hook-form |
| `RadioButton` | Base | Uncontrolled radio button |
| `FormRadioGroup` | RHF | Radio group with react-hook-form |
| `SelectField` | Base | Uncontrolled dropdown/select |
| `FormSelectField` | RHF | Select with react-hook-form |
| `SelectMultiple` | Base | Multi-select uncontrolled |
| `FormSelectMultiple` | RHF | Multi-select with react-hook-form |
| `DatePicker` | Base | Single date picker (uses `react-native-ui-datepicker` + `dayjs`) |
| `DateRangePicker` | Base | Date range picker (uses `react-native-ui-datepicker` + `dayjs`) |

**Export:**
```typescript
export * from './TextInput';
export * from './FormTextInput';
export * from './FormPasswordInput';
export * from './Checkbox';
export * from './FormCheckbox';
export * from './RadioButton';
export * from './FormRadioGroup';
export * from './SelectField';
export * from './FormSelectField';
export * from './SelectMultiple';
export * from './FormSelectMultiple';
export * from './DatePicker';
export * from './DateRangePicker';
```

#### 3. **Icon Components** → `src/components/icons/`
SVG icon components used throughout the UI:

| Icon | Component | Purpose |
|------|-----------|---------|
| Arrow Down | `ArrowDownIcon` | Dropdown indicator |
| Calendar | `CalendarIcon` | Date picker indicator |
| Close | `CloseIcon` | Close/dismiss action |

**Export:**
```typescript
export { default as ArrowDownIcon } from './ArrowDownIcon';
export { default as CalendarIcon } from './CalendarIcon';
export { default as CloseIcon } from './CloseIcon';
```

#### 4. **Shared Display Components** → `src/components/shared/`
Complex, reusable display components:

| Component | File | Purpose |
|-----------|------|---------|
| `Avatar` | `Avatar.tsx` | User avatar display |
| `CollapsibleCard` | `CollapsibleCard.tsx` | Card with expand/collapse functionality |
| `SwipeableCard` | `SwipeableCard.tsx` | Card with swipe gestures (uses `react-native-gesture-handler`, `react-native-reanimated`) |

**Export:**
```typescript
export * from './Avatar';
export * from './CollapsibleCard';
export * from './SwipeableCard';
```

#### 5. **Overlay Components** → `src/components/overlays/`
Modal, skeleton, and feedback components:

| Component | File | Purpose |
|-----------|------|---------|
| `Skeleton` | `Skeleton.tsx` | Loading skeleton placeholder |
| `ConfirmModal` | `ConfirmModal.tsx` | Confirmation dialog |
| `BottomSheetModal` | `BottomSheetModal.tsx` | Bottom sheet modal (default export) |

**Export:**
```typescript
export * from './Skeleton';
export * from './ConfirmModal';
export { default as BottomSheetModal } from './BottomSheetModal';
```

#### Root Components Export
```typescript
// src/components/index.ts
export * from './core';
export * from './form';
export * from './overlays';
export * from './shared';
export * from './icons';
```

### Theme System

#### Spacing Configuration → `src/theme/spacing.ts`
Standardized spacing scale for consistent padding/margins

#### Typography Configuration → `src/theme/typography.ts`
Font sizes, weights, line heights, and text styles

#### Root Theme Export
```typescript
export * from './spacing';
export * from './typography';
```

### Utility Functions → `src/utils/`

**Responsive Design Utilities** (`responsive.ts`)
- Helpers for responsive layout calculations using `react-native-size-matters`

**Export:**
```typescript
export * from './responsive';
```

### Root UI Export
```typescript
// src/index.tsx
export * from './components';
export * from './theme';
export * from './utils';

// Namespaced:
export * as Components from './components';
export * as Theme from './theme';
export * as Utils from './utils';
```

---

## File Structure Tree

```
packages/
├── core/
│   ├── package.json (npm registry: @repo/core)
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts (main export)
│       ├── hooks/
│       │   ├── index.ts
│       │   ├── useToggle.ts
│       │   ├── useCounter.ts
│       │   └── useDebounce/
│       │       └── index.ts
│       ├── utils/
│       │   ├── index.ts
│       │   ├── format.ts
│       │   ├── validation.ts
│       │   ├── date.ts
│       │   └── color.ts
│       ├── constants/
│       │   ├── index.ts
│       │   └── colors.ts
│       ├── storage/
│       │   ├── index.ts
│       │   ├── secureStorage.ts
│       │   └── tokenStorage.ts
│       └── path/
│           └── index.ts
│
└── ui/
    ├── package.json (npm registry: @repo/ui)
    ├── tsconfig.json
    └── src/
        ├── index.tsx (main export)
        ├── components/
        │   ├── index.ts
        │   ├── core/
        │   │   ├── index.ts
        │   │   ├── Text.tsx
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   └── Spacer.tsx
        │   ├── form/
        │   │   ├── index.ts
        │   │   ├── TextInput.tsx
        │   │   ├── FormTextInput.tsx
        │   │   ├── FormPasswordInput.tsx
        │   │   ├── Checkbox.tsx
        │   │   ├── FormCheckbox.tsx
        │   │   ├── RadioButton.tsx
        │   │   ├── FormRadioGroup.tsx
        │   │   ├── SelectField.tsx
        │   │   ├── FormSelectField.tsx
        │   │   ├── SelectMultiple.tsx
        │   │   ├── FormSelectMultiple.tsx
        │   │   ├── DatePicker.tsx
        │   │   └── DateRangePicker.tsx
        │   ├── icons/
        │   │   ├── index.ts
        │   │   ├── ArrowDownIcon/
        │   │   │   └── index.tsx
        │   │   ├── CalendarIcon/
        │   │   │   └── index.tsx
        │   │   └── CloseIcon/
        │   │       └── index.tsx
        │   ├── shared/
        │   │   ├── index.ts
        │   │   ├── Avatar.tsx
        │   │   ├── CollapsibleCard.tsx
        │   │   └── SwipeableCard.tsx
        │   └── overlays/
        │       ├── index.ts
        │       ├── Skeleton.tsx
        │       ├── ConfirmModal.tsx
        │       └── BottomSheetModal.tsx
        ├── theme/
        │   ├── index.ts
        │   ├── spacing.ts
        │   └── typography.ts
        └── utils/
            ├── index.ts
            └── responsive.ts
```

---

## Key Integration Points

### @repo/core Integration
- **Token Management**: Use `@repo/core/Storage.setTokens()` for authentication
- **Zustand Store Integration**: Use `zustandSecureStorage` adapter for persisting Zustand state securely
- **Input Validation**: Use `@repo/core/Utils.isValidEmail()`, `isValidPhone()` in forms
- **Hooks**: Use `@repo/core/Hooks.useToggle`, `useCounter`, `useDebounce` in components

### @repo/ui Integration
- **Form Building**: Combine `@repo/ui/Components.FormTextInput` with `react-hook-form`
- **Theming**: Use `@repo/ui/Theme.spacing`, `Theme.typography` for consistent styling
- **Icons**: Use `@repo/ui/Components.ArrowDownIcon`, `CalendarIcon`, `CloseIcon` in form components
- **Responsive Design**: Use `@repo/ui/Utils.responsive*` for responsive layouts

### Authentication Flow Example
```typescript
import { Storage } from '@repo/core';
import { FormTextInput } from '@repo/ui';
import { useForm } from 'react-hook-form';

const LoginForm = () => {
  const { control, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    // Get tokens from API
    const { token, refreshToken } = await loginAPI(data);
    // Store securely
    await Storage.setTokens(token, refreshToken);
  };
  
  return (
    <FormTextInput 
      control={control}
      name="email"
      rules={{validate: email => Utils.isValidEmail(email)}}
    />
  );
};
```

---

## Summary

**@repo/core** provides:
- Pure logic and state management hooks
- Secure token storage with Zustand adapter
- Validation utilities
- Query string builders
- Color and date utilities

**@repo/ui** provides:
- Complete UI component system with 40+ components
- Form inputs (base + react-hook-form variants)
- Theme configuration (spacing, typography)
- Icon library
- Gesture-enabled components (swipe, animations)
- Responsive design utilities

Both packages are:
- Well-organized with clear categorical structure
- Export both convenience (root level) and namespaced variants
- TypeScript-first with proper type definitions
- Ready for use across the monorepo

---

## Unresolved Questions
None - all directories are initialized and fully populated with working code.
