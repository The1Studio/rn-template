# System Architecture

## Monorepo Architecture

### Structure Overview

```
rn-template (root)
│
├─ apps/
│  └─ mobile/                  # Main mobile app (Expo)
│     ├─ src/app              # Expo Router (file-based routing)
│     ├─ src/stores           # Zustand stores
│     ├─ src/api              # HTTP client + services
│     ├─ src/hooks            # React Query hooks
│     └─ src/components       # App-specific components
│
├─ packages/
│  ├─ core (submodule)         # @repo/core - utilities & hooks
│  │  ├─ hooks/               # useToggle, useCounter, useDebounce
│  │  ├─ utils/               # 30+ utility functions
│  │  ├─ storage/             # Secure storage wrappers
│  │  ├─ constants/           # Shared constants
│  │  └─ path/                # Query string builders
│  │
│  └─ ui (submodule)           # @repo/ui - 40+ components
│     └─ components/           # Pre-built UI components
│
└─ Root Configuration
   ├─ package.json            # npm workspaces
   ├─ tsconfig.json           # Shared TypeScript
   ├─ .eslintrc.js            # Linting rules
   └─ prettier.config.js      # Code formatting
```

### Dependency Graph

```
apps/mobile
  ├─ @repo/core
  │  └─ [moment, expo-secure-store, zustand - peer]
  ├─ @repo/ui
  │  └─ [react-native, React Native dependencies]
  ├─ Direct Dependencies
  │  ├─ react, react-native, expo (runtime)
  │  ├─ zustand (state)
  │  ├─ @tanstack/react-query (server state)
  │  ├─ axios (HTTP)
  │  ├─ react-hook-form (forms)
  │  ├─ zod (validation)
  │  └─ [animations, navigation, UI libs]
  │
└─ Dev Dependencies
   ├─ TypeScript
   ├─ ESLint
   └─ Prettier
```

### Package Relationships

**Resolution:**
- Workspace symlinks (npm workspaces)
- Metro bundler configured for monorepo
- No build step needed (ESNext modules)

**Updates:**
- `npm install` from root updates all packages
- Submodules updated: `git submodule update --init --remote`

---

## Mobile App Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Screens, Components, UI)              │
│  apps/mobile/src/app (*.tsx)            │
│  apps/mobile/src/components/            │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│      State Management Layer              │
│  (Zustand stores + React Query)          │
│  apps/mobile/src/stores/                 │
│  apps/mobile/src/hooks/queries/          │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│        API & Data Access Layer           │
│  (Axios, services)                       │
│  apps/mobile/src/api/                    │
└────────────────┬────────────────────────┘
                 │
┌─────────────────▼────────────────────────┐
│    Utilities & Shared Libraries          │
│  (@repo/core, @repo/ui)                  │
│  (hooks, formatting, storage, etc.)      │
└─────────────────────────────────────────┘
```

### Request/Response Flow

```
User Interaction (Tap, Type, etc.)
  │
  ├─→ Component State Update
  │   └─→ Zustand Store Update
  │
  ├─→ API Call Needed
  │   │
  │   └─→ API Service Function
  │       └─→ Axios Request
  │           ├─→ Request Interceptor
  │           │   └─→ Add Auth Token (from Zustand)
  │           │
  │           ├─→ HTTP Request
  │           │
  │           └─→ Response Interceptor
  │               ├─→ 2xx: Return response
  │               ├─→ 401: Refresh token → Retry
  │               └─→ Error: Handle error
  │
  ├─→ Response Received
  │   ├─→ React Query Cache Update
  │   ├─→ Zustand Store Update (if needed)
  │   └─→ UI Re-render
  │
  └─→ Show Result (Toast, Update UI, Navigate)
```

---

## State Management Architecture

### Two-Layer State System

#### 1. Client State (Zustand)

**Purpose:** UI state, user preferences, authentication

**Stores:**

| Store | Key Properties | Persisted | Storage |
|-------|---|---|---|
| **useAuthStore** | user, token, isAuthenticated | YES | Secure |
| **useAppStore** | theme, language, ui flags | NO | Memory |
| **useSettingsStore** | user preferences | YES | Secure |

**Pattern:**

```typescript
const store = create<State>()(
  persist(
    (set, get) => ({
      // State
      value: initialValue,
      // Actions
      setValue: (val) => set({ value: val }),
      // Selectors
      getValue: () => get().value,
    }),
    {
      name: 'storage-key',
      storage: createJSONStorage(() => zustandSecureStorage),
    }
  )
);
```

**Benefits:**
- Minimal boilerplate
- Hooks-first API
- Built-in persistence
- Efficient selectors

#### 2. Server State (React Query)

**Purpose:** Cached API data, synchronization

**Setup:**

```typescript
// Root layout
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60, // Cache 1 hour
      staleTime: 1000 * 60 * 5, // Stale after 5 min
    },
  },
});

<QueryClientProvider client={queryClient}>
  {/* App content */}
</QueryClientProvider>
```

**Usage:**

```typescript
const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.fetchUser(id),
  });
```

**Benefits:**
- Automatic caching & deduplication
- Background refetch
- Optimistic updates
- Stale-while-revalidate

### State Flow Diagram

```
┌─────────────────────────────────────────────────┐
│         Component State (useState)              │
│  Local UI state (form inputs, UI toggles)      │
│  Short-lived, component-scoped                  │
└────────────────┬────────────────────────────────┘
                 │
┌─────────────────▼────────────────────────────────┐
│    Zustand Store (Global Client State)          │
│  Persisted: Auth, user preferences              │
│  Not persisted: App theme, language             │
│  Survives app reload (persisted stores)         │
└────────────────┬────────────────────────────────┘
                 │
                 ├─────────────────────────┐
                 │                         │
    ┌────────────▼──────────────┐  ┌──────▼────────────────┐
    │  React Query Cache        │  │  Secure Storage       │
    │  (Server State)           │  │  (Token, User Data)   │
    │  - Users                  │  │  - Access Token       │
    │  - Posts                  │  │  - Refresh Token      │
    │  - Settings               │  │  - User Preferences   │
    │  Auto-sync via API        │  │  Native Encrypted     │
    │  Auto-refetch             │  │  Survives kill        │
    └───────────────────────────┘  └───────────────────────┘
```

### Persistence Strategy

**Encrypted Storage (expo-secure-store):**
- Used for: Sensitive data (tokens, credentials)
- Limit: 2KB per value
- Location: Native (iOS Keychain, Android Encrypted Shared Prefs)
- Access: Async only

**Zustand Persist:**
- Automatically persists selected state to secure storage
- Hydrates on app start
- Survives process kill

**React Query Cache:**
- In-memory only (not persisted)
- Cleared on app restart
- Use persisted Zustand stores for critical data

---

## API Architecture

### Axios Configuration

```typescript
// apps/mobile/src/api/axios-config.ts
import axios from 'axios';
import { getToken, setTokens, clearTokens, getRefreshToken } from '@repo/core';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: Add auth token
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response: Handle 401 with refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Refresh token and retry
    }
    return Promise.reject(error);
  }
);
```

### Token Refresh Flow

```
API Request
  │
  ├─→ Add Access Token Header (from Zustand)
  │
  ├─→ Server Response
  │
  ├─→ 401 Unauthorized?
  │   │
  │   └─→ YES:
  │       ├─→ POST /refresh with Refresh Token
  │       ├─→ Receive New Tokens
  │       ├─→ Save to Zustand + Secure Storage
  │       ├─→ Retry Original Request with New Token
  │       │
  │       └─→ Refresh Failed?
  │           ├─→ Clear Tokens
  │           ├─→ Redirect to Login
  │           └─→ Show Error
  │
  └─→ Return Response to App
```

### API Service Pattern

```typescript
// Single responsibility per service
export const userService = {
  fetchUser: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
};

// Used by React Query
export const useUser = (id: string) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.fetchUser(id),
  });
```

---

## Navigation Architecture

### Expo Router Structure

File-based routing (like Next.js):

```
src/app/
├─ _layout.tsx                  (Root layout)
│  └─ Provides: Gestures, SafeArea, QueryClient, Toast
│
├─ login.tsx                    (Login screen - public)
│
└─ (tabs)/                      (Group: tab navigation)
   ├─ _layout.tsx              (Tab layout definition)
   │  └─ Defines 5 tabs
   │
   ├─ index.tsx                (Home tab - main)
   ├─ explore.tsx              (Explore tab - storage demo)
   ├─ api-test.tsx             (API test tab)
   ├─ settings.tsx             (Settings tab)
   └─ playground.tsx           (Playground tab - 40+ components)
```

### Navigation Stack

```
RootStack
├─ Login Screen (public route)
│  └─ Shown when isAuthenticated = false
│
└─ TabsStack (protected)
   ├─ Home Screen
   ├─ Explore Screen
   ├─ API Test Screen
   ├─ Settings Screen
   └─ Playground Screen
      └─ 40+ component demonstrations
```

### Deep Linking

**Supports:**
- Scheme: `mobile://`
- Example: `mobile://home`, `mobile://settings`

**Configuration:**
- Defined in app.json
- Expo Router auto-generates typed routes
- TypeScript support: `<Link href="/settings" />`

---

## Storage Architecture

### Secure Storage Implementation

```
┌─────────────────────────────────────────┐
│  expo-secure-store (Native)             │
│  ├─ iOS: Keychain                       │
│  └─ Android: Encrypted Shared Prefs     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Wrapper: @repo/core secureStorage      │
│  ├─ setString/getString                 │
│  ├─ setObject/getObject                 │
│  └─ remove                              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Zustand Persist Adapter                │
│  └─ Automatic encryption for stores     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  Token Management Utilities             │
│  ├─ setTokens / getTokens               │
│  ├─ setToken / getToken                 │
│  └─ clearTokens                         │
└─────────────────────────────────────────┘
```

### Data Persistence Strategy

| Data | Storage | Lifecycle | Size |
|------|---------|-----------|------|
| **Access Token** | Secure | Session | <1KB |
| **Refresh Token** | Secure | Long-lived (30d) | <1KB |
| **User Data** | Secure | App session | <2KB |
| **Auth State** | Secure via Zustand | App reload | <2KB |
| **Settings** | Secure via Zustand | App reload | <2KB |
| **Cached API Data** | React Query (memory) | App session | Variable |

### Limitations & Workarounds

| Limitation | Size | Workaround |
|-----------|------|-----------|
| 2KB per value (secure-store) | Fixed | Use AsyncStorage for larger data |
| Async API | N/A | All storage is async (requires await) |
| No sync reload | N/A | Use Zustand rehydrate on app start |

---

## Authentication Flow

### Login Sequence

```
1. User Taps Login
   │
2. Form Validation (Zod)
   │
3. API Call: POST /auth/login
   └─→ Axios Request (no token yet)
   └─→ Server Response: { access_token, refresh_token, user }
   │
4. Save Tokens
   └─→ setTokens(accessToken, refreshToken)
   └─→ Zustand: store tokens
   └─→ Secure Storage: encrypt tokens
   │
5. Update Auth State
   └─→ Zustand: user, isAuthenticated = true
   │
6. Persist to Storage
   └─→ onRehydrateStorage callback
   │
7. Navigation
   └─→ Redirect to Home (authenticated guard)
   │
8. Subsequent Requests
   └─→ Request interceptor adds Authorization header
   └─→ Token in Authorization: Bearer {token}
```

### Logout Sequence

```
1. User Taps Logout
   │
2. Clear Local State
   └─→ Zustand: reset auth store
   │
3. Clear Storage
   └─→ clearTokens()
   └─→ Remove from secure storage
   │
4. Clear React Query Cache
   └─→ queryClient.clear()
   │
5. Navigation
   └─→ Redirect to Login screen
```

### Token Refresh Sequence (Auto)

```
1. API Request with Expired Token
   │
2. Server Returns 401
   │
3. Response Interceptor Detects 401
   │
4. Check if Already Refreshing
   ├─ YES: Queue request, wait for new token
   └─ NO: Proceed to refresh
   │
5. Call: POST /auth/refresh
   └─→ Body: { refresh_token }
   │
6. Success: Receive New Tokens
   ├─→ Save new tokens (Zustand + Secure Storage)
   ├─→ Retry original request with new token
   └─→ Process queued requests
   │
7. Failure: Refresh Failed
   ├─→ Clear all tokens
   ├─→ Redirect to login
   └─→ Reject queued requests
```

---

## Form Handling Architecture

### react-hook-form + Zod Pattern

```
┌──────────────────────────────────┐
│  Component Renders               │
│  useForm with Zod schema         │
└────────────┬─────────────────────┘
             │
             ├─→ Controller Components
             │   └─→ TextInput, Select, etc.
             │
             ├─→ Form State (minimal re-renders)
             │   ├─ formState.isSubmitting
             │   ├─ formState.errors
             │   └─ watch values
             │
             └─→ User Input
                 │
                 ├─→ onChange: Update react-hook-form state
                 │   (no component re-render yet)
                 │
                 └─→ onBlur: Validate field
                     └─→ Show error if invalid
                         │
                         └─→ Component re-renders only error
```

### Validation Schema

```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: 'Must accept terms',
  }),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof schema>;
```

### Error Handling

```typescript
// Server validation errors
try {
  await submit(data);
} catch (error) {
  // Set server-side errors
  setError('email', { message: 'Email already exists' });
  setError('root', { message: 'Form submission failed' });
}

// Display errors
<Text>{errors.email?.message}</Text>
<Text>{errors.root?.message}</Text>
```

---

## Animation Architecture

### react-native-reanimated

**Purpose:** Smooth, 60 FPS animations on low-end devices

**Approach:**
- Worklet-based (runs on native thread)
- Decouples from JS thread
- No performance impact on app logic

**Usage:**

```typescript
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedComponent = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress}>
        <Text>Tap me</Text>
      </Pressable>
    </Animated.View>
  );
};
```

### Gesture Integration

- **Provider:** react-native-gesture-handler
- **Wrapper:** GestureHandlerRootView in root layout
- **Prerequisite:** For react-native-reanimated

---

## Error Handling & Recovery

### Error Boundary (Not Yet Implemented)

Placeholder for error boundary implementation:

```typescript
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

### API Error Handling

```typescript
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Network or server error
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      // Token refresh attempted automatically
      // If still fails: redirect to login
    } else if (status === 400) {
      // Validation error
      showErrorToast(message || 'Invalid input');
    } else {
      // Server error
      showErrorToast('Server error');
    }
  } else {
    // Non-axios error
    showErrorToast('Unknown error');
  }
}
```

### User Feedback

- **Success:** Toast notification (top of screen)
- **Error:** Toast notification (red, with message)
- **Loading:** Activity indicator, button disabled
- **State Change:** Optimistic UI update, then verify

---

## Performance Optimization

### Code Splitting

- Expo Router: Auto code splitting per route
- Lazy loading: Dynamic imports for heavy components
- Tree-shaking: Unused code eliminated by Metro

### Rendering Optimization

- **Memo:** Prevent unnecessary component renders
- **useCallback:** Stable function references
- **Selectors:** Zustand selectors prevent over-subscriptions
- **FlatList:** Virtual list rendering for long lists

### Memory Management

- **React Query:** Auto garbage collection (staleTime)
- **Zustand:** No global subscriptions unless needed
- **Images:** Specify dimensions, avoid dynamic sizes
- **Listeners:** Cleanup in useEffect

### Bundle Size

- Target: <5MB Android APK
- Strategies:
  - Tree-shaking (ESNext modules)
  - Code splitting (routes)
  - Lazy loading (heavy libraries)

---

## Security Considerations

### Data Protection

1. **Tokens:** Encrypted in native secure storage
2. **Sensitive Data:** Encrypted in secure storage
3. **HTTP:** HTTPS only (enforced in API config)
4. **Local Data:** Zustand persisted stores encrypted

### API Security

1. **Authorization:** Bearer token in Authorization header
2. **Token Refresh:** Automatic 401 handling
3. **CORS:** Handled server-side
4. **Rate Limiting:** Implement server-side
5. **Input Validation:** Zod schema on client, repeated server-side

### Development Safety

1. **No Secrets:** Environment variables only
2. **Linting:** ESLint catches common issues
3. **Type Safety:** TypeScript strict mode
4. **Code Review:** Required before merge

---

## Deployment Architecture

### Build Profiles (EAS)

```
Development Build
  └─ Used for: Local testing, debugging
  └─ Distribution: Dev testing (internal)
  └─ New Architecture: Enabled
  └─ Debugger: Enabled

Preview Build
  └─ Used for: QA, internal testing
  └─ Distribution: Internal (EAS)
  └─ New Architecture: Enabled
  └─ Optimizations: Some

Production Build
  └─ Used for: App store submission
  └─ Distribution: App stores (iOS, Play Store)
  └─ New Architecture: Enabled
  └─ Optimizations: Full (Hermes, minification)
```

### Platform-Specific Configuration

**iOS:**
- Bundle ID: com.mobile.app
- Minimum: iOS 13
- New Architecture: Enabled

**Android:**
- Package: com.mobile.app
- Minimum: API 24 (Android 7.0)
- Edge-to-edge: Enabled
- Hermes: Enabled (smaller, faster)

---

## Monitoring & Debugging

### Development Debugging

- **Expo DevTools:** Network tab, Redux DevTools integration
- **Flipper:** Inspector, network, logs (with Expo integration)
- **React DevTools Profiler:** Component render analysis
- **ESLint:** Pre-commit linting
- **TypeScript:** Type checking

### Production Monitoring (Not Yet Implemented)

Placeholder for:
- Crash reporting (Sentry, Bugsnag)
- Performance monitoring (Datadog, New Relic)
- Analytics tracking (Mixpanel, Amplitude)
- Error tracking

---

**Last Updated:** 2025-12-26
**Maintains:** System design and architectural decisions
**Next Review:** When major architectural changes occur
