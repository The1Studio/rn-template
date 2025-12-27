# Multi-Layer Architecture: Component Library Ecosystem

**Date:** 2025-12-26
**Type:** Architecture Brainstorming
**Status:** Proposal
**Scope:** Multi-product template with core-logic, ui-logic, ui-theme separation

---

## Executive Summary

**Vision:** Build component library ecosystem enabling multiple products (consumer mobile, enterprise dashboard) to share core business logic while maintaining completely independent visual implementations.

**Approach:** 3-layer architecture with headless UI primitives as abstraction layer between business logic and themed components.

**Key Outcome:** Apps select theme packages like Lego blocks - same core, same primitives, different visuals.

---

## Problem Statement

### Requirements
1. **Separate logic from view** - Core contains data, business logic, 3rd party integrations (zero UI)
2. **UI logic abstraction** - Detail logic for features, flows, user interactions (headless)
3. **Theme layer** - Easy style/color/animation swapping without touching logic
4. **Multi-product support** - Consumer mobile feed vs enterprise dashboard (radically different UIs)
5. **Package management** - Develop as submodules, publish as versioned packages
6. **Mix-and-match** - Features can have multiple implementations, apps pick versions

### Constraints
- Multiple apps sharing same core logic
- Truly different products (not just theme variants)
- Developers create themes (1-2 times/year, code changes acceptable)
- Maximum customization needed (colors, typography, animations, layouts, component implementations)
- Minimize duplication (share everything possible)

---

## Current Architecture Analysis

### Structure
```
rn-template/
├─ apps/mobile/              # Single Expo app
├─ packages/
│  ├─ core/                  # @repo/core (submodule) - ✅ Good foundation
│  │  ├─ hooks/              # useToggle, useCounter, useDebounce
│  │  ├─ utils/              # 30+ utility functions
│  │  ├─ storage/            # Secure storage, token management
│  │  ├─ constants/          # Color palette
│  │  └─ path/               # Query builders
│  │
│  └─ ui/                    # @repo/ui (submodule) - ⚠️ Needs refactoring
│     └─ components/         # 40+ concrete components (Button, Form, Modal, etc.)
```

### Strengths
✅ **Core is pure** - Zero UI dependencies, ready for reuse
✅ **Submodule pattern** - Easy development iteration
✅ **TypeScript strict** - Strong typing throughout
✅ **Rich component library** - 40+ production-ready components

### Problems
❌ **UI is concrete, not headless** - Hard to create different visual implementations
❌ **No theme layer** - Styling baked into components
❌ **Logic + visuals coupled** - Can't reuse form logic with different UI
❌ **Single visual style** - Can't support Material vs iOS vs Custom looks

---

## Recommended Target Architecture

### Package Ecosystem

```
Monorepo Root (rn-template)
│
├─ packages/
│  │
│  ├─ core/                          # @repo/core (KEEP - enhance)
│  │  ├─ business-logic/             # Domain logic, models, validators
│  │  ├─ data-access/                # API clients, storage adapters
│  │  ├─ validation/                 # Zod schemas
│  │  ├─ utils/                      # Pure functions (30+)
│  │  └─ constants/                  # Config, enums
│  │
│  ├─ ui-primitives/                 # @repo/ui-primitives (NEW - headless)
│  │  ├─ hooks/                      # Headless component logic
│  │  │  ├─ useForm.ts              # Form state (no JSX)
│  │  │  ├─ useModal.ts             # Modal logic (no JSX)
│  │  │  ├─ useSelect.ts            # Select logic (no JSX)
│  │  │  ├─ useDataTable.ts         # Table logic (no JSX)
│  │  │  └─ useButton.ts            # Button behavior (no JSX)
│  │  ├─ state/                      # Zustand stores for UI state
│  │  │  ├─ useModalStore.ts        # Modal open/close state
│  │  │  └─ useFormStore.ts         # Form submission state
│  │  ├─ contracts/                  # TypeScript interfaces
│  │  │  └─ components.ts           # Component prop interfaces
│  │  └─ behaviors/                  # Interaction patterns
│  │     ├─ useDisclosure.ts        # Open/close pattern
│  │     └─ usePagination.ts        # Pagination logic
│  │
│  ├─ ui-theme-default/              # @repo/ui-theme-default (REFACTOR from ui)
│  │  ├─ components/                 # Themed components
│  │  │  ├─ Button/                 # Uses useButton from primitives
│  │  │  │  ├─ index.tsx            # Component implementation
│  │  │  │  └─ styles.ts            # StyleSheet
│  │  │  ├─ Form/                   # Uses useForm from primitives
│  │  │  ├─ Modal/                  # Uses useModal from primitives
│  │  │  └─ [40+ other components]
│  │  ├─ theme/                      # Design tokens
│  │  │  ├─ colors.ts               # Color palette (blue-based)
│  │  │  ├─ typography.ts           # Font system (SF Pro)
│  │  │  ├─ spacing.ts              # 8pt grid system
│  │  │  └─ animations.ts           # Motion config (300ms)
│  │  └─ provider/                   # Theme provider
│  │     └─ ThemeProvider.tsx       # Context provider
│  │
│  ├─ ui-theme-enterprise/           # @repo/ui-theme-enterprise (FUTURE)
│  │  ├─ components/                 # Different visual implementation
│  │  │  └─ [Same API as default, corporate look]
│  │  └─ theme/                      # Enterprise tokens
│  │     ├─ colors.ts               # Gray/navy palette
│  │     ├─ typography.ts           # Roboto font
│  │     └─ spacing.ts              # 4pt grid (tighter)
│  │
│  └─ features/                      # @repo/features-* (FUTURE - optional)
│     ├─ auth/                       # Complete auth feature
│     │  ├─ logic/                   # Uses @repo/core + ui-primitives
│     │  │  ├─ useLogin.ts
│     │  │  └─ useRegister.ts
│     │  ├─ screens-default/         # Default theme screens
│     │  │  ├─ LoginScreen.tsx
│     │  │  └─ RegisterScreen.tsx
│     │  └─ screens-enterprise/      # Enterprise theme screens
│     │     ├─ LoginScreen.tsx      # Different layout/style
│     │     └─ RegisterScreen.tsx
│     │
│     └─ profile/                    # Profile feature
│        └─ [Similar structure]
│
└─ apps/
   ├─ consumer-mobile/               # Consumer app
   │  ├─ dependencies:
   │  │  ├─ @repo/core@^1.2.3
   │  │  ├─ @repo/ui-primitives@^0.5.2
   │  │  ├─ @repo/ui-theme-default@^2.1.0
   │  │  └─ @repo/features-auth (default variant)
   │  └─ Can override specific components locally
   │
   └─ enterprise-dashboard/          # Enterprise app
      ├─ dependencies:
      │  ├─ @repo/core@^1.2.3
      │  ├─ @repo/ui-primitives@^0.5.2
      │  ├─ @repo/ui-theme-enterprise@^1.0.0
      │  └─ @repo/features-auth (enterprise variant)
      └─ Can build custom components for dashboard-specific needs
```

---

## Layer Boundaries & Responsibilities

### Layer 1: @repo/core (Business Logic - Zero UI)

**Allowed:**
```typescript
// ✅ Domain models
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// ✅ Business rules
export const canAccessDashboard = (user: User): boolean => {
  return user.role === 'admin';
};

// ✅ API clients (plain JS/TS, no React)
export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return axios.post('/auth/login', credentials);
  }
}

// ✅ Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ Storage utilities (no React)
export const secureStorage = {
  async setToken(token: string): Promise<void> { /* ... */ },
  async getToken(): Promise<string | null> { /* ... */ },
};

// ✅ Pure utilities
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

// ✅ Constants
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  // ...
};
```

**Forbidden:**
- ❌ React hooks (`useState`, `useEffect`, etc.)
- ❌ React components or JSX
- ❌ Zustand stores (those go in ui-primitives)
- ❌ StyleSheet or any UI styling
- ❌ Navigation logic
- ❌ Any UI-related code

**Dependencies:**
- moment (date manipulation)
- axios (HTTP client)
- zod (validation)
- expo-secure-store (peer - native storage)

---

### Layer 2: @repo/ui-primitives (Headless UI Logic)

**Allowed:**
```typescript
// ✅ Headless hooks (logic only, no rendering)
export const useForm = <T extends FieldValues>({
  schema,
  onSubmit,
}: UseFormProps<T>) => {
  const form = useHookForm<T>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Handle error
    }
  });

  // Return only logic/state, no JSX
  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    reset: form.reset,
  };
};

// ✅ Zustand stores for UI state
export const useModalStore = create<ModalStore>((set) => ({
  modals: {},
  open: (id: string) => set((state) => ({
    modals: { ...state.modals, [id]: true }
  })),
  close: (id: string) => set((state) => ({
    modals: { ...state.modals, [id]: false }
  })),
}));

// ✅ React Query wrappers
export const useLogin = () => {
  const navigate = useNavigation();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthAPI.login(credentials),
    onSuccess: (response) => {
      secureStorage.setToken(response.token);
      navigate('/dashboard');
    },
    // UI-agnostic success/error handling
  });
};

// ✅ Component contracts
export interface ButtonPrimitiveProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export interface FormPrimitiveProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
}

// ✅ Behavior hooks
export const useDisclosure = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen(!isOpen),
  };
};

// ✅ Pagination logic
export const usePagination = ({
  total,
  pageSize = 10
}: UsePaginationProps) => {
  const [page, setPage] = useState(1);

  return {
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    goToPage: setPage,
    nextPage: () => setPage(p => Math.min(p + 1, Math.ceil(total / pageSize))),
    prevPage: () => setPage(p => Math.max(p - 1, 1)),
    canGoNext: page < Math.ceil(total / pageSize),
    canGoPrev: page > 1,
  };
};
```

**Forbidden:**
- ❌ Styled components or JSX rendering
- ❌ StyleSheet definitions
- ❌ Theme tokens (colors, spacing, fonts)
- ❌ Platform-specific UI code (Pressable, View, Text)
- ❌ Business logic (that goes in @repo/core)

**Dependencies:**
- react (hooks)
- @repo/core (business logic)
- zustand (UI state)
- react-hook-form (form logic)
- @tanstack/react-query (data fetching)

---

### Layer 3: @repo/ui-theme-{name} (Visual Implementation)

**Allowed:**
```typescript
// ✅ Themed components using primitives
import { useButton } from '@repo/ui-primitives';
import { theme } from '../theme';

export interface ButtonProps extends ButtonPrimitiveProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onPress,
  disabled,
  loading,
  children,
}) => {
  // Use primitive for behavior
  const { handlePress } = useButton({ onPress, disabled });

  // Theme-specific rendering
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
      ]}
    >
      {loading && <ActivityIndicator />}
      <Text style={[styles.text, styles[`text_${variant}`]]}>
        {children}
      </Text>
    </Pressable>
  );
};

// ✅ Design tokens
export const theme = {
  colors: {
    primary: '#007AFF',          // iOS blue
    secondary: '#5856D6',        // Purple
    success: '#34C759',
    error: '#FF3B30',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    // ...
  },
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  },
};

// ✅ StyleSheets
const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...theme.typography.body,
    color: '#FFFFFF',
  },
  text_ghost: {
    color: theme.colors.text,
  },
});

// ✅ Form component using primitives
import { useForm } from '@repo/ui-primitives';
import { TextInput } from './TextInput';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, errors, isSubmitting } = useForm({
    schema: loginSchema,
    onSubmit,
  });

  return (
    <View style={styles.form}>
      <TextInput
        {...register('email')}
        label="Email"
        error={errors.email?.message}
        keyboardType="email-address"
      />

      <TextInput
        {...register('password')}
        label="Password"
        error={errors.password?.message}
        secureTextEntry
      />

      <Button
        onPress={handleSubmit}
        loading={isSubmitting}
        variant="primary"
      >
        Login
      </Button>
    </View>
  );
};
```

**Multiple theme packages:**
- `@repo/ui-theme-default` - Current UI (Material-ish, blue palette, rounded corners)
- `@repo/ui-theme-enterprise` - Corporate (gray/navy, sharp corners, condensed)
- `@repo/ui-theme-minimal` - Clean minimal (b&w, lots of whitespace, simple)

Each theme:
- Uses same primitives (`useForm`, `useModal`, etc.)
- Implements same component API (`Button`, `Form`, etc.)
- Has different visual treatment (colors, spacing, animations, layouts)

**Dependencies:**
- react-native (UI components)
- @repo/ui-primitives (headless logic)
- @repo/core (business logic, validation)
- react-native-reanimated (animations)
- react-native-gesture-handler (gestures)

---

## Migration Path (3 Phases)

### Phase 1: Extract Primitives (2-3 weeks)

**Goal:** Create `@repo/ui-primitives` with headless logic

**Steps:**

1. **Create package structure:**
```bash
mkdir -p packages/ui-primitives/{hooks,state,contracts,behaviors}
cd packages/ui-primitives
npm init -y
```

2. **Extract form logic first (highest ROI):**

```typescript
// Before (in @repo/ui/Form/FormTextInput.tsx)
export const FormTextInput = ({ name, control, label, ...props }) => {
  const { field, fieldState } = useController({ name, control });

  return (
    <View>
      <Text>{label}</Text>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        {...props}
      />
      {fieldState.error && <Text>{fieldState.error.message}</Text>}
    </View>
  );
};

// After - Split into primitive + themed component

// @repo/ui-primitives/hooks/useFormField.ts
export const useFormField = <T extends FieldValues>({
  name,
  control,
  rules,
}: UseFormFieldProps<T>) => {
  const { field, fieldState } = useController({ name, control, rules });

  return {
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    error: fieldState.error?.message,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
  };
};

// @repo/ui-theme-default/FormTextInput.tsx
import { useFormField } from '@repo/ui-primitives';

export const FormTextInput = ({ name, control, label, ...props }) => {
  const field = useFormField({ name, control });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={field.value}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        style={[styles.input, field.error && styles.inputError]}
        {...props}
      />
      {field.error && <Text style={styles.error}>{field.error}</Text>}
    </View>
  );
};
```

3. **Priority extraction order:**
   - ✅ Forms (useFormField, useForm) - highest reuse
   - ✅ Modals (useModal, useDisclosure) - high reuse
   - ✅ Select/Dropdown (useSelect) - medium reuse
   - ✅ Data tables (usePagination, useSorting) - medium reuse
   - ✅ Input components (useInput, useCheckbox) - low reuse but good abstraction

4. **Create contracts:**
```typescript
// @repo/ui-primitives/contracts/components.ts
export interface ButtonPrimitiveProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
}

export interface InputPrimitiveProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

// Each theme implements these contracts
```

5. **Test extraction:**
```bash
# In apps/mobile, verify primitives work
import { useForm } from '@repo/ui-primitives';
import { Button } from '@repo/ui'; # Still using old UI
```

**Deliverables:**
- [ ] `@repo/ui-primitives` package created
- [ ] 10+ headless hooks extracted
- [ ] TypeScript contracts defined
- [ ] Tests passing in apps/mobile

---

### Phase 2: Rename & Restructure (1 week)

**Goal:** Convert `@repo/ui` to `@repo/ui-theme-default`

**Steps:**

1. **Rename package:**
```bash
cd packages
mv ui ui-theme-default
cd ui-theme-default
# Update package.json name
```

2. **Update package.json:**
```json
{
  "name": "@repo/ui-theme-default",
  "version": "2.0.0",  // Major bump (breaking change)
  "dependencies": {
    "@repo/ui-primitives": "workspace:*",
    "@repo/core": "workspace:*"
  }
}
```

3. **Refactor components to use primitives:**
```typescript
// Update all components to use extracted hooks
import { useButton } from '@repo/ui-primitives';
import { useFormField } from '@repo/ui-primitives';
// ... refactor 40+ components
```

4. **Extract theme tokens:**
```typescript
// @repo/ui-theme-default/theme/index.ts
export const theme = {
  colors: { /* current color palette */ },
  spacing: { /* current spacing */ },
  typography: { /* current fonts */ },
  animations: { /* current durations */ },
};
```

5. **Update apps/mobile imports:**
```typescript
// Find & replace across codebase
// BEFORE
import { Button, Form } from '@repo/ui';

// AFTER
import { Button, Form } from '@repo/ui-theme-default';
```

6. **(Optional) Create theme switcher:**
```typescript
// @repo/ui/index.ts (re-export layer for future flexibility)
export * from '@repo/ui-theme-default';

// Future: Can switch themes dynamically
import { THEME } from './config';
const ThemePackage = THEME === 'enterprise'
  ? require('@repo/ui-theme-enterprise')
  : require('@repo/ui-theme-default');

export const { Button, Form } = ThemePackage;
```

**Deliverables:**
- [ ] Package renamed to `@repo/ui-theme-default`
- [ ] All 40+ components refactored to use primitives
- [ ] Theme tokens extracted
- [ ] Apps updated, tests passing

---

### Phase 3: Build Second Theme (3-4 weeks)

**Goal:** Create `@repo/ui-theme-enterprise` to validate architecture

**Steps:**

1. **Scaffold package:**
```bash
mkdir -p packages/ui-theme-enterprise/{components,theme,provider}
cd packages/ui-theme-enterprise
npm init -y
```

2. **Define enterprise theme:**
```typescript
// @repo/ui-theme-enterprise/theme/index.ts
export const theme = {
  colors: {
    primary: '#1E3A8A',        // Navy blue (vs default's bright blue)
    secondary: '#475569',      // Slate gray
    success: '#059669',
    error: '#DC2626',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#64748B',
    border: '#CBD5E1',
  },
  spacing: {
    xs: 2,    // Tighter spacing (vs default's 4)
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  typography: {
    h1: { fontSize: 28, fontWeight: '600', fontFamily: 'Roboto' }, // vs 32/700/SF Pro
    h2: { fontSize: 20, fontWeight: '500', fontFamily: 'Roboto' },
    body: { fontSize: 14, fontWeight: '400', fontFamily: 'Roboto' },
    caption: { fontSize: 11, fontWeight: '400', fontFamily: 'Roboto' },
  },
  borderRadius: {
    sm: 2,    // Sharp corners (vs default's 4)
    md: 4,
    lg: 6,
    full: 9999,
  },
  animations: {
    duration: {
      fast: 100,   // Faster (vs 150)
      normal: 200, // Faster (vs 300)
      slow: 400,
    },
  },
};
```

3. **Implement components with different layouts:**
```typescript
// @repo/ui-theme-enterprise/Button.tsx
// Same API as default, different visual treatment

import { useButton } from '@repo/ui-primitives';
import { theme } from '../theme';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onPress,
  children,
  ...props
}) => {
  const { handlePress } = useButton({ onPress, ...props });

  // Enterprise: Squared corners, condensed spacing, navy colors
  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.base,           // Different from default
        styles[variant],       // Different colors
        styles[size],          // Different sizing
      ]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.sm,      // 2 vs default's 8
    paddingVertical: theme.spacing.sm,        // 4 vs default's 8
    paddingHorizontal: theme.spacing.md,      // 8 vs default's 16
  },
  primary: {
    backgroundColor: theme.colors.primary,    // Navy vs bright blue
  },
  // ... different styling throughout
});
```

4. **Create test app:**
```bash
# Create enterprise-dashboard app
mkdir apps/enterprise-dashboard
cd apps/enterprise-dashboard
npm init -y

# Install dependencies
npm install @repo/core @repo/ui-primitives @repo/ui-theme-enterprise
```

5. **Side-by-side validation:**
```bash
# Run both apps simultaneously
npm run mobile start        # Consumer (default theme)
npm run enterprise start    # Enterprise (enterprise theme)

# Verify: Same logic, different visuals
```

**Deliverables:**
- [ ] `@repo/ui-theme-enterprise` package created
- [ ] 40+ components implemented with enterprise styling
- [ ] Enterprise theme tokens defined
- [ ] Test app created and verified
- [ ] Both themes working side-by-side

---

## Versioning & Dependency Strategy

### Semantic Versioning Rules

**Package versions:**
```json
{
  "@repo/core": "1.2.3",                    // Stable
  "@repo/ui-primitives": "0.5.2",           // Evolving
  "@repo/ui-theme-default": "2.1.0",        // Frequent updates
  "@repo/ui-theme-enterprise": "1.0.0"      // Independent
}
```

**Breaking change policy:**

| Package | MAJOR bump when... |
|---------|-------------------|
| `@repo/core` | Business logic API changes (rare) |
| `@repo/ui-primitives` | Hook signatures change, contracts change |
| `@repo/ui-theme-*` | Component props change, removing components |

**Version ranges:**

```json
// In @repo/ui-theme-default/package.json
{
  "dependencies": {
    "@repo/core": "^1.0.0",           // Allow minor/patch updates
    "@repo/ui-primitives": "^0.5.0"   // Allow minor/patch updates
  }
}

// In apps/consumer-mobile/package.json
{
  "dependencies": {
    "@repo/core": "1.2.3",                   // Pin to specific version
    "@repo/ui-primitives": "0.5.2",          // Pin to specific version
    "@repo/ui-theme-default": "^2.1.0"       // Allow patch updates only
  }
}
```

**Rationale:**
- **Packages allow flexible updates** - Promotes interoperability between packages
- **Apps pin versions** - Stability, controlled update timing
- **Themes can update independently** - Visual changes don't block other packages

---

### Dependency Matrix

```
┌─────────────────────────────────────────────────────────┐
│                    Apps Layer                           │
│  apps/consumer-mobile        apps/enterprise-dashboard  │
│    ├─ @repo/core@1.2.3         ├─ @repo/core@1.2.3     │
│    ├─ @repo/ui-primitives      ├─ @repo/ui-primitives  │
│    └─ @repo/ui-theme-default   └─ @repo/ui-theme-ent   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Theme Layer                             │
│  @repo/ui-theme-default       @repo/ui-theme-enterprise │
│    ├─ @repo/ui-primitives        ├─ @repo/ui-primitives│
│    └─ @repo/core                 └─ @repo/core         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Primitives Layer                           │
│              @repo/ui-primitives                        │
│                └─ @repo/core                            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 Core Layer                              │
│                 @repo/core                              │
│           (No dependencies on other packages)           │
└─────────────────────────────────────────────────────────┘
```

**Rules:**
- ✅ Higher layers depend on lower layers only (no circular dependencies)
- ✅ Core has zero dependencies on other packages
- ✅ Primitives depend only on core
- ✅ Themes depend on primitives + core
- ✅ Apps depend on all layers

---

### Publishing Strategy

**Development (now):**
- Git submodules for `core` and `ui-theme-default`
- npm workspace protocol: `"@repo/core": "workspace:*"`
- Fast iteration, no publishing needed

**Production (future):**
- Publish to private npm registry or GitHub Packages
- Versioned releases: `"@repo/core": "^1.2.3"`
- Apps install specific versions
- Independent release cycles per package

**Transition:**
```json
// Development (package.json in apps)
{
  "dependencies": {
    "@repo/core": "workspace:*"
  }
}

// Production (after publishing)
{
  "dependencies": {
    "@repo/core": "^1.2.3"
  }
}
```

---

## Trade-offs & Decision Matrix

### Benefits
✅ **Complete theme independence** - Build radically different UIs for different products
✅ **Shared business logic** - Zero duplication in domain logic, validation, API calls
✅ **Headless primitives** - Reuse form/modal/select logic across all themes
✅ **Versioned packages** - Apps control when to update, stable production
✅ **Scalable** - Easy to add theme #3, #4, #5 without affecting existing
✅ **Team autonomy** - Different teams can own different themes
✅ **Mix-and-match** - Apps can use default theme + custom components for specific needs

### Costs
❌ **More packages to maintain** (5+ instead of 2)
❌ **Complex initial refactor** (4-6 weeks for phases 1-3)
❌ **Coordination overhead** - Changes to primitives affect all themes
❌ **Potential duplication** - Themes may copy-paste similar component logic
❌ **Learning curve** - New developers need to understand 3-layer architecture
❌ **Versioning complexity** - Managing dependencies across packages
❌ **Testing burden** - Must test each theme independently

### Critical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Over-abstraction** | Themes become hard to customize | Medium | Extract only truly shared logic; allow theme overrides |
| **Version conflicts** | Apps can't upgrade due to incompatible versions | Medium | Use semantic versioning strictly; comprehensive changelog |
| **Maintenance burden** | Bug fixes require changes across 3+ packages | High | Automated testing; clear ownership; good documentation |
| **Primitive churn** | Frequent breaking changes in primitives | Medium | Stabilize primitives before building second theme; use RFC process |
| **Duplication creep** | Themes copy-paste instead of sharing | Medium | Code reviews; regular refactors; shared utilities in primitives |
| **Coordination fatigue** | Teams get frustrated with cross-package dependencies | Low | Clear communication; release coordination meetings |

---

## Decision Matrix

### When to Use This Architecture

**Use this if:**
- ✅ Building 2+ products with different UIs, same logic
- ✅ Need complete control over visual implementations
- ✅ Have resources for 4-6 week initial investment
- ✅ Team size >5 developers (can dedicate resources)
- ✅ Long-term project (2+ years) where investment pays off

**Don't use this if:**
- ❌ Single product with just light/dark mode (over-engineered)
- ❌ Products are 90% similar (styled-components + theme provider is simpler)
- ❌ Small team (<3 developers) - maintenance burden too high
- ❌ Short-term project (<6 months) - won't recoup refactor cost
- ❌ Minimal theme customization needed (just colors/fonts)

---

## Alternative Architectures Considered

### Alternative 1: Styled-Components + Theme Provider (Simpler)

```typescript
// Single @repo/ui package with theming
const theme = {
  default: { primary: '#007AFF', spacing: 16 },
  enterprise: { primary: '#1E3A8A', spacing: 8 },
};

<ThemeProvider theme={theme.default}>
  <Button>Click</Button>
</ThemeProvider>
```

**Pros:** Much simpler, faster to implement
**Cons:** Can't handle "completely different layouts" requirement
**When to use:** If themes are 90% similar (just colors/spacing)

---

### Alternative 2: Separate Apps, No Shared UI (Most Flexible)

```
apps/
├─ consumer-mobile/    # Own components, uses @repo/core
└─ enterprise-dash/    # Own components, uses @repo/core
```

**Pros:** Maximum flexibility, zero coupling
**Cons:** High duplication, no component reuse
**When to use:** If UIs are <30% similar (truly different apps)

---

### Alternative 3: Component Variants (Middle Ground)

```typescript
// Single component with variants prop
<Button variant="default" />  // iOS style
<Button variant="enterprise" />  // Corporate style
```

**Pros:** Simple, no new packages
**Cons:** Components become bloated with if/else logic
**When to use:** 2-3 variants only, similar structure

---

## Recommended Choice

**Use the proposed 3-layer architecture** because:
1. Requirement: "Completely different component implementations" ✅
2. Requirement: "Multiple products sharing core logic" ✅
3. Requirement: "Easy theme swapping" ✅
4. Resources: Team can afford 4-6 week investment ✅
5. Scale: Building 2+ products long-term ✅

---

## Next Steps

### Immediate (This Week)
1. **Get stakeholder buy-in** - Present this document to team/management
2. **Validate assumptions** - Confirm products are truly different enough to warrant this
3. **Create POC** - Extract 1-2 primitives (useForm, useModal) to validate approach
4. **Estimate resources** - Assign developers, set timeline

### Phase 1 Kickoff (Week 1-3)
1. Create `@repo/ui-primitives` package
2. Extract 10+ headless hooks
3. Define TypeScript contracts
4. Test in existing apps/mobile

### Phase 2 Execution (Week 4)
1. Rename `@repo/ui` → `@repo/ui-theme-default`
2. Refactor all components to use primitives
3. Extract theme tokens
4. Update app imports

### Phase 3 Validation (Week 5-8)
1. Create `@repo/ui-theme-enterprise`
2. Implement 40+ components with different styling
3. Create test app using enterprise theme
4. Run both themes side-by-side

### Post-Launch
1. **Documentation** - Create comprehensive guides for each layer
2. **Developer tools** - CLI for scaffolding new themes
3. **Monitoring** - Track package versions across apps
4. **Optimization** - Identify duplication, refactor as needed

---

## Unresolved Questions

1. **Package publishing** - Private npm registry vs GitHub Packages vs keep as submodules?
2. **Monorepo tool** - Stay with npm workspaces or migrate to Turborepo/Nx for better caching?
3. **Feature packages** - Create `@repo/features-auth` with multiple theme variants?
4. **Theme generator** - Build CLI tool to scaffold new themes from default?
5. **Testing strategy** - How to test primitives work across all themes?
6. **Documentation site** - Build Storybook or similar for component showcase?
7. **Migration timeline** - Can we afford 6 weeks or need to ship faster?
8. **Team structure** - Who owns core vs primitives vs themes?

---

## Appendix: Code Examples

### Example: Login Form Across Layers

**Layer 1: Core (Business Logic)**
```typescript
// @repo/core/validation/auth.ts
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// @repo/core/api/auth.ts
export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<{ token: string }> {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  }
}
```

**Layer 2: Primitives (UI Logic)**
```typescript
// @repo/ui-primitives/hooks/useLoginForm.ts
import { useForm } from './useForm';
import { loginSchema, AuthAPI } from '@repo/core';

export const useLoginForm = ({ onSuccess }: UseLoginFormProps) => {
  const form = useForm({
    schema: loginSchema,
    onSubmit: async (data) => {
      const response = await AuthAPI.login(data);
      await secureStorage.setToken(response.token);
      onSuccess();
    },
  });

  return form;
};
```

**Layer 3a: Default Theme (Visual)**
```typescript
// @repo/ui-theme-default/LoginForm.tsx
import { useLoginForm } from '@repo/ui-primitives';
import { TextInput, Button } from './';

export const LoginForm = ({ onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm({ onSuccess });

  return (
    <View style={styles.form}>
      <TextInput
        {...register('email')}
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
      />

      <TextInput
        {...register('password')}
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        error={errors.password?.message}
      />

      <Button onPress={handleSubmit} loading={isSubmitting}>
        Sign In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,  // Spacious
    padding: 24,
  },
});
```

**Layer 3b: Enterprise Theme (Different Visual)**
```typescript
// @repo/ui-theme-enterprise/LoginForm.tsx
import { useLoginForm } from '@repo/ui-primitives';
import { TextInput, Button } from './';

export const LoginForm = ({ onSuccess }) => {
  const { register, handleSubmit, errors, isSubmitting } = useLoginForm({ onSuccess });

  return (
    <View style={styles.form}>
      <View style={styles.header}>
        <Text style={styles.title}>Corporate Login</Text>
      </View>

      <View style={styles.fields}>
        <TextInput
          {...register('email')}
          label="CORPORATE EMAIL"
          error={errors.email?.message}
        />

        <TextInput
          {...register('password')}
          label="PASSWORD"
          secureTextEntry
          error={errors.password?.message}
        />
      </View>

      <Button variant="corporate" onPress={handleSubmit} loading={isSubmitting}>
        AUTHENTICATE
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 8,  // Compact
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A8A',
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
    textTransform: 'uppercase',
  },
});
```

**Result:**
- Same business logic (validation, API call)
- Same UI logic (form state, submission)
- Different visual presentation (spacing, colors, labels, layout)

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns (core → primitives → themes)
- ✅ Maximum theme flexibility (completely different UIs)
- ✅ Shared business logic (zero duplication)
- ✅ Scalable (easy to add more themes)
- ✅ Maintainable (clear boundaries, versioned packages)

With clear migration path (3 phases, 6-8 weeks) and manageable risks.

**Recommendation:** Proceed with implementation if:
1. Team approves 6-8 week timeline
2. Stakeholders confirm products are different enough
3. POC validates primitives approach

Otherwise, consider simpler alternatives (styled-components + theme provider).
