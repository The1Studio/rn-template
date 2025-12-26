# Code Standards & Development Guidelines

## Core Principles

### YAGNI (You Aren't Gonna Need It)
- Implement only what's required now
- Don't speculate about future needs
- Refactor when use cases emerge

### KISS (Keep It Simple, Stupid)
- Favor clarity over cleverness
- Simple solutions > complex ones
- Self-documenting code > heavy comments

### DRY (Don't Repeat Yourself)
- Consolidate duplicate logic
- Reuse components, hooks, utilities
- Maintain single source of truth

---

## Naming Conventions

### File & Directory Names

**Pattern:** kebab-case

```
✓ use-auth-store.ts
✓ auth-service.ts
✓ form-input.tsx
✗ useAuthStore.ts
✗ AuthService.ts
✗ FormInput.tsx
```

**Components:** PascalCase in directories
```
components/
├── CustomButton/
│   └── index.tsx        (exports CustomButton)
└── FormInput/
    └── index.tsx        (exports FormInput)
```

### Variables & Functions

**Pattern:** camelCase

```typescript
✓ const userName = 'John';
✓ const fetchUserData = async () => {};
✓ const isAuthenticated = true;
✗ const user_name = 'John';
✗ const fetch_user_data = async () => {};
```

### Constants

**Pattern:** UPPER_SNAKE_CASE

```typescript
✓ const API_BASE_URL = 'https://api.example.com';
✓ const MAX_RETRIES = 3;
✓ const DEFAULT_TIMEOUT = 60000;
✗ const apiBaseUrl = 'https://api.example.com';
✗ const max_retries = 3;
```

### Components & Classes

**Pattern:** PascalCase

```typescript
✓ export const AuthButton = () => {};
✓ class UserService {}
✓ interface UserState {}
✗ export const authButton = () => {};
✗ class user_service {}
```

### Type Names

**Pattern:** PascalCase with descriptive suffix

```typescript
✓ interface UserState {}      // State object
✓ type UserProps = {}         // Component props
✓ interface AuthService {}    // Service class
✓ type ColorName = 'red' | 'blue';  // Union type
✗ interface user_state {}
✗ type user_props = {}
```

---

## File Organization

### File Size Limit

**Maximum:** 200 lines per file

**Rationale:** Easier to understand, test, and maintain

**When to split:**
- Component > 200 lines → Extract sub-components
- Utility file > 200 lines → Split into modules
- Store > 200 lines → Extract selectors and actions

### Directory Structure (apps/mobile/src)

```
src/
├── app/                    # Expo Router pages (*.tsx)
├── stores/                 # Zustand stores (one per file)
├── api/
│   ├── axios-config.ts    # HTTP client
│   ├── endpoint.ts        # Constants
│   └── services/          # API functions (one per domain)
├── hooks/
│   └── queries/           # React Query hooks
├── components/            # App-specific reusable components
├── icons/                 # Custom SVG icons
└── lib/                   # Config, helpers
```

### Monorepo Package Structure

```
packages/*/src/
├── hooks/                 # React hooks
├── utils/                 # Utility functions
├── components/            # Components
├── constants/             # Constants
├── types/                 # Type definitions
└── index.ts               # Main export
```

---

## TypeScript Standards

### Strict Mode Enforcement

**All projects must have:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Annotations

**Always specify return types:**

```typescript
✓ const getUserName = (id: string): string => {};
✓ async function fetchUser(id: string): Promise<User> {}
✓ const handlePress = (): void => {};

✗ const getUserName = (id: string) => {};
✗ async function fetchUser(id: string) {}
✗ const handlePress = () => {};
```

**Type parameters for generic functions:**

```typescript
✓ const useData = <T,>(url: string): T => {};
✓ const arrayMap = <T, U>(arr: T[], fn: (t: T) => U): U[] => {};

✗ const useData = (url: string) => {};  // Loses type info
✗ const arrayMap = (arr, fn) => {};     // No type safety
```

### No Implicit Any

```typescript
✓ const handleChange = (value: string): void => {};
✓ interface Props { name: string; }
✓ const [state, setState] = useState<string>('');

✗ const handleChange = (value) => {};
✗ interface Props { name; }
✗ const obj: any = {};
```

### Interfaces Over Types for Objects

```typescript
✓ interface UserState {
  name: string;
  email: string;
}

✓ type ColorVariant = 'primary' | 'secondary';  // Union types

✗ type UserState = {
  name: string;
  email: string;
}
```

### Explicit Exports

```typescript
✓ export const handleLogin = (): void => {};
✓ export interface User { id: string; }

✗ const handleLogin = (): void => {};
export { handleLogin };
```

---

## ESLint & Prettier Configuration

### ESLint Rules

**Enabled (via ESLint 9 flat config):**

```javascript
{
  'no-console': 'warn',              // Warn on console logs
  'no-debugger': 'error',            // Error on debugger
  'no-var': 'error',                 // Use const/let
  'prefer-const': 'error',           // Const over let when possible
  'eqeqeq': ['error', 'always'],     // Strict equality
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_'          // Allow unused params prefixed with _
  }],
  'react/react-in-jsx-scope': 'off', // React 17+ doesn't need import
  'react-hooks/rules-of-hooks': 'error',
}
```

### Prettier Configuration

**Format:** Automatic via `npm run format`

```javascript
module.exports = {
  semi: true,              // Semicolons required
  trailingComma: 'es5',    // Trailing commas where valid
  singleQuote: true,       // Single quotes
  printWidth: 80,          // 80 char line limit
  tabWidth: 2,             // 2-space indentation
  useTabs: false,          // Spaces, not tabs
};
```

### Pre-commit Checks

Run before committing:

```bash
npm run lint      # Check ESLint violations
npm run format:check  # Check formatting
```

---

## React & React Native Patterns

### Function Components Only

```typescript
✓ export const UserCard = ({ user }: UserCardProps): JSX.Element => {
  return <View>...</View>;
};

✗ class UserCard extends React.Component {}  // No class components
```

### Props Interface

```typescript
interface UserCardProps {
  user: User;
  onPress?: () => void;  // Optional callbacks with ?
  isActive?: boolean;    // Optional boolean with ? and default
}

export const UserCard = ({ user, onPress, isActive = false }: UserCardProps) => {
  // ...
};
```

### Hooks Guidelines

**Use composition over state:**

```typescript
// ✓ Good: Separate concerns
export const UserProfile = ({ userId }: Props) => {
  const user = useUser(userId);
  const settings = useSettings();

  if (!user) return <Loading />;
  return <View>{/* ... */}</View>;
};

// ✗ Avoid: Too much state in one component
export const UserProfile = ({ userId }: Props) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  // ... complex logic
};
```

**Custom hooks naming:**

```typescript
✓ export const useUser = (id: string): User | null => {};
✓ export const useUserQuery = (id: string) => useQuery({ /* ... */ });
✓ export const useToggle = (initial?: boolean) => {};

✗ export const getUserData = (id: string) => {};  // Doesn't start with "use"
```

**Hook dependencies:**

```typescript
✓ useEffect(() => {
  loadUser();
}, [userId, loadUser]);  // All dependencies listed

✗ useEffect(() => {
  loadUser();  // Missing userId dependency
}, []);
```

### Component Composition

```typescript
// ✓ Small, focused components
const UserAvatar = ({ user }: { user: User }) => (
  <Image source={{ uri: user.avatar }} />
);

const UserInfo = ({ user }: { user: User }) => (
  <View>
    <Text>{user.name}</Text>
    <Text>{user.email}</Text>
  </View>
);

export const UserCard = ({ user }: UserCardProps) => (
  <Card>
    <UserAvatar user={user} />
    <UserInfo user={user} />
  </Card>
);

// ✗ Avoid monolithic components
export const UserCard = ({ user }: UserCardProps) => (
  <Card>
    <Image source={{ uri: user.avatar }} />
    <Text>{user.name}</Text>
    <Text>{user.email}</Text>
    {/* ...lots of markup... */}
  </Card>
);
```

---

## State Management Patterns

### Zustand Store Structure

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandSecureStorage } from '@repo/core';

interface AuthState {
  // State
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      user: null,
      isAuthenticated: false,

      // Actions
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandSecureStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Export selectors for components
export const selectUser = (state: AuthState) => state.user;
export const selectToken = (state: AuthState) => state.token;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
```

**In components:**

```typescript
export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);  // Selector
  const logout = useAuthStore((state) => state.logout);

  if (!user) return <LoginScreen />;
  return (
    <View>
      <Text>{user.name}</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
};
```

### React Query Hooks

```typescript
import { useQuery } from '@tanstack/react-query';

export const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.fetchUser(id),
    staleTime: 1000 * 60 * 5,  // 5 minutes
    enabled: !!id,              // Only fetch when ID exists
  });
```

**Usage:**

```typescript
export const UserProfile = ({ userId }: Props) => {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <View>...</View>;
};
```

---

## Form Handling Patterns

### react-hook-form + Zod

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
    } catch (error) {
      // Handle error
    }
  };

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Email"
            keyboardType="email-address"
            editable={!isLoading}
          />
        )}
      />
      {errors.email && <Text>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <TextInput
            {...field}
            placeholder="Password"
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)} title="Login" />
    </View>
  );
};
```

---

## API Integration Patterns

### API Service Structure

```typescript
// src/api/services/user.service.ts
import apiClient from '../axios-config';
import { Endpoint } from '../endpoint';

interface User {
  id: string;
  name: string;
  email: string;
}

export const userService = {
  fetchUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`${Endpoint.users}/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`${Endpoint.users}/${id}`, data);
    return response.data;
  },
};
```

### API Endpoints

```typescript
// src/api/endpoint.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
  'https://api.example.com';

export const Endpoint = {
  users: '/users',
  auth: '/auth',
  login: '/auth/login',
  logout: '/auth/logout',
  refreshTokens: '/auth/refresh',
} as const;
```

### Axios Configuration

```typescript
// src/api/axios-config.ts
import axios from 'axios';
import { getToken, setTokens, clearTokens } from '@repo/core';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt refresh
      try {
        const newToken = await refreshAccessToken();
        // Retry request with new token
      } catch {
        // Redirect to login
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Performance Guidelines

### Memo & Callbacks

```typescript
// ✓ Use React.memo for expensive renders
const UserAvatar = React.memo(({ user }: { user: User }) => (
  <Image source={{ uri: user.avatar }} />
));

// ✓ Use useCallback for stable references
const handlePress = useCallback(() => {
  // ...
}, []);

// ✗ Avoid: Unnecessary memoization
const Button = React.memo(({ onPress }: Props) => (
  <Pressable onPress={onPress}>
    <Text>Click</Text>
  </Pressable>
));
```

### List Performance

```typescript
// ✓ Use FlatList with key prop
const UserList = ({ users }: Props) => (
  <FlatList
    data={users}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <UserItem user={item} />}
  />
);

// ✗ Avoid: Index as key
<FlatList
  data={users}
  keyExtractor={(item, index) => index.toString()}
  // Bad: Breaks when list reorders
/>
```

### Image Loading

```typescript
// ✓ Specify dimensions
<Image
  source={{ uri: url }}
  style={{ width: 100, height: 100 }}
/>

// ✗ Avoid: Dynamic dimensions
<Image
  source={{ uri: url }}
  // Causes layout shift
/>
```

---

## Error Handling

### Try-Catch with Proper Typing

```typescript
try {
  await userService.updateUser(id, data);
  showToast('User updated');
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 400) {
      showToast(error.response.data.message || 'Invalid data');
    } else {
      showToast('Server error');
    }
  } else {
    showToast('Unknown error');
  }
}
```

### Custom Error Types

```typescript
interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export const isApiError = (error: unknown): error is ApiError =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  'message' in error;
```

---

## Documentation Standards

### JSDoc Comments

```typescript
/**
 * Formats a date for display.
 *
 * @param date - The date to format
 * @param format - The format string (default: 'DD/MM/YYYY')
 * @returns Formatted date string
 *
 * @example
 * ```typescript
 * formatDate(new Date(), 'MM/DD/YYYY')
 * // Returns: "12/26/2025"
 * ```
 */
export const formatDate = (
  date: Date,
  format: string = 'DD/MM/YYYY'
): string => {
  // Implementation
};
```

### Component Props Documentation

```typescript
/**
 * Displays user information in a card layout.
 *
 * @component
 *
 * @example
 * ```tsx
 * <UserCard user={user} onPress={() => navigate('profile')} />
 * ```
 */
interface UserCardProps {
  /** The user object to display */
  user: User;
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Whether to show admin controls */
  isAdmin?: boolean;
}

export const UserCard = ({ user, onPress, isAdmin }: UserCardProps) => {
  // ...
};
```

---

## Git & Version Control

### Commit Messages

**Format:** Conventional Commits

```
feat: add user authentication
fix: resolve token refresh race condition
docs: update API documentation
test: add login flow tests
chore: update dependencies
refactor: simplify auth store
style: fix linting issues
```

### Branch Naming

```
feat/user-authentication
fix/token-refresh-race
docs/api-guide
refactor/auth-store
```

### Pull Request Checklist

- [ ] Code follows standards (lint passes)
- [ ] TypeScript strict mode passes
- [ ] No `console.log` in production code
- [ ] Comments explain "why", not "what"
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No duplicate dependencies

---

## Code Review Checklist

### For Authors

- [ ] Run `npm run lint:fix`
- [ ] Run `npm run format`
- [ ] All TypeScript errors resolved
- [ ] No `any` types
- [ ] Props/return types explicit
- [ ] No dead code
- [ ] Comments explain non-obvious logic

### For Reviewers

- [ ] Code is readable and maintainable
- [ ] No over-engineering
- [ ] Follows naming conventions
- [ ] No performance issues
- [ ] Error handling complete
- [ ] TypeScript strict mode compliant
- [ ] Tests validate behavior

---

## Commonly Used Patterns

### Toggle Boolean State

```typescript
import { useToggle } from '@repo/core';

const [isMenuOpen, toggleMenu] = useToggle(false);
```

### Counter State

```typescript
import { useCounter } from '@repo/core';

const { count, increment, decrement, reset } = useCounter(0);
```

### Debounced Search

```typescript
import { useDebounce } from '@repo/core';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: results } = useQuery({
    queryKey: ['users', debouncedQuery],
    queryFn: () => userService.search(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <View>
      <TextInput value={query} onChangeText={setQuery} />
      {results?.map((user) => <UserCard key={user.id} user={user} />)}
    </View>
  );
};
```

---

**Last Updated:** 2025-12-26
**Maintained By:** Development Team
**Version:** 1.0
