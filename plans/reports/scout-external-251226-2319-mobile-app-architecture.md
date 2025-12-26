# Mobile App Architecture Exploration Report
**Date:** 2025-12-26 | **Time:** 23:19

## Executive Summary
Comprehensive analysis of the React Native Expo mobile application in `apps/mobile/`. The app is a feature-rich template with modern stack including Expo Router, React Query, Zustand, and extensive UI component library.

---

## 1. APP STRUCTURE & ROUTING

### Directory Layout
```
apps/mobile/src/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx              # Root layout with providers
│   ├── login.tsx                # Authentication screen
│   └── (tabs)/                  # Tab-based navigation group
│       ├── _layout.tsx          # Tab navigator setup
│       ├── index.tsx            # Home/Core Utilities demo
│       ├── explore.tsx          # Storage demo screen
│       ├── settings.tsx         # Zustand stores demo
│       ├── api-test.tsx         # API testing screen
│       └── playground.tsx       # Comprehensive components demo
├── api/                         # API integration layer
│   ├── axios-config.ts         # Axios instance with interceptors
│   ├── endpoint.ts             # API endpoints configuration
│   ├── index.ts                # API exports
│   └── services/               # API service functions
│       ├── auth.service.ts     # Authentication API calls
│       └── index.ts            # Services exports
├── stores/                      # Zustand state management
│   ├── useAuthStore.ts         # Auth state (persisted)
│   ├── useAppStore.ts          # App-wide state (in-memory)
│   ├── useSettingsStore.ts     # User settings (in-memory)
│   └── index.ts                # Stores exports
├── hooks/                       # Custom React hooks
│   └── queries/
│       ├── useAuth.ts          # Auth-related queries/mutations
│       └── index.ts            # Hooks exports
├── components/                  # App-specific components
│   └── .gitkeep               # (Currently empty, reserved)
├── icons/                       # Custom SVG icons
│   ├── CloseIcon/index.tsx
│   ├── InfoIcon/index.tsx
│   └── SuccessIcon/index.tsx
├── lib/                        # Library utilities & configs
│   ├── index.ts               # Main exports
│   └── toast/
│       ├── index.ts           # Toast API
│       └── config.js          # Toast UI configuration
├── core/index.ts              # Re-exports from @repo/core
└── config/                    # Configuration files
```

---

## 2. KEY SCREENS & FEATURES

### Root Layout (`src/app/_layout.tsx`)
- **Setup:**
  - GestureHandlerRootView (gesture support)
  - SafeAreaProvider (safe area handling)
  - QueryClientProvider (React Query setup)
  - Stack Navigator (login + tabs screens)
  - Toast notification provider
- **Query Client Config:** 60-minute cache time

### Authentication Flow
**Login Screen** (`src/app/login.tsx`)
- Form validation with Zod schema
- Email + password inputs
- Mock login implementation (demo mode)
- Form field: `FormTextInput`, `FormPasswordInput`
- Redirect: authenticated → tabs, not authenticated → login
- State persisted with `useAuthStore`

**Tab Navigation** (`src/app/(tabs)/_layout.tsx`)
- 5 main tabs with emoji icons
- **Home:** Core utilities demo
- **Storage (Explore):** Secure storage demo
- **Stores (Settings):** Zustand state management demo
- **API:** API testing screen
- **Playground:** Component showcase
- Authentication guard: redirects to login if not authenticated
- Hydration check: loading state while reading persisted auth data

### Screen Details

#### 1. Home Screen (`index.tsx`)
**Purpose:** Showcase core utilities from `@repo/core`
**Sections:**
- Format Utilities
  - Number: formatCurrency, formatNumber, formatPercentage
  - String: capitalize, truncate
- Date Formatting
  - Predefined formats: DATE_SHORT, DATE_LONG, TIME_12H, TIME_24H, DATETIME_12H, WEEKDAY, MONTH_YEAR, etc.
- Smart Date Functions
  - formatSmart, formatRelative, formatCalendar, formatDuration
- Date Boundaries
  - startOfDay, endOfDay, startOfMonth, endOfMonth
- Date Manipulation
  - addTime, subtractTime (days, months, years)
- Date Checks
  - isToday, isYesterday, isTomorrow, isPast, isFuture, isValidDate
- Date Calculations
  - getDiff (difference between dates), getAge
- CollapsibleCard component for expandable sections

#### 2. Storage/Explore Screen (`explore.tsx`)
**Purpose:** Demonstrate expo-secure-store usage
**Features:**
- Save/load/delete notes from secure storage
- Demo of persistent storage across app restarts
- Secure encryption: iOS Keychain / Android Keystore
- Size limit: 2KB per value
- Works in Expo Go (no dev build needed)
- Clear all notes functionality

#### 3. Stores/Settings Screen (`settings.tsx`)
**Purpose:** Demonstrate Zustand state management
**Sections:**
- **useAuthStore (Persisted):** user, token, isAuthenticated, isHydrated
- **useAppStore (In-Memory):** theme, isLoading, online status
- **useSettingsStore (In-Memory):** language, notifications, biometric
- Interactive controls:
  - Theme selector (light/dark/system)
  - Loading state demo (2s timeout)
  - Language toggle (EN/VI)
  - Notifications switch
  - Biometric login switch
  - Logout button

#### 4. API Test Screen (`api-test.tsx`)
**Purpose:** Test Axios HTTP client
**Endpoints:**
- GET /posts/1
- GET /users/1
- POST /posts (create)
- PUT /posts/1 (update)
- DELETE /posts/1
- Uses JSONPlaceholder test API
- Shows: HTTP status, response time, response data
- Live request status indicator

#### 5. Playground Screen (`playground.tsx`)
**Purpose:** Comprehensive component library showcase
**Sections:**
- Counter demo (useCounter hook)
- Toast notifications (success/error/info)
- Reanimated demo (spring, rotate, color, slide animations)
- Gesture handler demo (pan, tap, double-tap, swipeable cards)
- Comprehensive form demo (all field types with auto-fill)
- Avatar demo (sizes, variants, custom colors)
- Date picker demo (date, datetime, with min/max)
- Form date picker with validation
- Date range picker
- Bottom sheet modals (simple + scrollable)
- Confirm modal & delete confirm modal
- Skeleton loading components
- Checkbox demo (various sizes & states)
- Form checkboxes with validation
- Radio button demo (single selection)
- Form radio groups with validation
- Collapsible cards
- Select field (single selection)
- Form select field with validation
- Select multiple (multi-select)
- Form multi-select with max selection limit

---

## 3. STATE MANAGEMENT (ZUSTAND)

### useAuthStore
**File:** `src/stores/useAuthStore.ts`
**Type:** Persisted with expo-secure-store
**State:**
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
}
```
**Actions:**
- login(user, token)
- logout()
- updateUser(userData)
- setHydrated(isHydrated)

**Persistence:** Only user, token, isAuthenticated are persisted
**Hydration:** onRehydrateStorage hook sets isHydrated flag

### useAppStore
**File:** `src/stores/useAppStore.ts`
**Type:** In-memory (resets on app restart)
**State:**
```typescript
interface AppState {
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
  isOnline: boolean
}
```
**Actions:**
- setTheme(theme)
- setLoading(loading)
- setOnline(online)

### useSettingsStore
**File:** `src/stores/useSettingsStore.ts`
**Type:** In-memory (resets on app restart)
**State:**
```typescript
interface SettingsState {
  language: 'en' | 'vi'
  notificationsEnabled: boolean
  biometricEnabled: boolean
}
```
**Actions:**
- setLanguage(language)
- toggleNotifications()
- toggleBiometric()
- resetSettings()

**Pattern:** All stores use selectors for performance optimization

---

## 4. API INTEGRATION PATTERNS

### Axios Configuration (`src/api/axios-config.ts`)
**Features:**
- Timeout: 60 seconds
- Request interceptor: Auto-attach Bearer token
- Response interceptor: Handle 401 token refresh
- Token refresh queue: Prevent multiple simultaneous refresh requests
- Automatic token refresh when 401 received

**Token Refresh Flow:**
1. 401 response received
2. Check if refresh already in progress
3. Queue failed requests if refresh is happening
4. Call `/auth/refresh` endpoint with refresh_token
5. Save new tokens to secure storage
6. Retry original request with new token
7. Clear token queue on failure or success

**Imports from @repo/core:**
- getToken()
- getRefreshToken()
- setTokens()
- clearTokens()

### API Endpoints (`src/api/endpoint.ts`)
```typescript
API_BASE_URL = 'https://api.example.com/'

Endpoint = {
  login: 'auth/login'
  refreshTokens: 'auth/refresh'
  logout: 'auth/logout'
}
```

### Auth Service (`src/api/services/auth.service.ts`)
**Types:**
```typescript
LoginRequest { email, password }
User { id, email, name, avatar? }
LoginResponse { user, access_token, refresh_token }
LogoutResponse { success }
```

**Methods:**
- login(data: LoginRequest): Promise<LoginResponse>
- logout(): Promise<LogoutResponse>

### React Query Integration (`src/hooks/queries/useAuth.ts`)
**useLogin Hook:**
- Mutation function: authService.login()
- onSuccess: Save tokens + update auth store

**useLogout Hook:**
- Mutation function: authService.logout()
- onSuccess: Clear tokens + logout from store
- onError: Force logout even if API fails

---

## 5. CONFIGURATION FILES

### app.json (Expo Configuration)
```json
{
  "name": "mobile",
  "slug": "mobile",
  "version": "1.0.0",
  "newArchEnabled": true,  // New Arch enabled
  "orientation": "portrait",
  "icon": "./assets/icon.png",
  "userInterfaceStyle": "light",
  "schemes": ["mobile"],
  "plugins": [["expo-router", { "root": "./src/app" }]],
  "experiments": { "typedRoutes": true },
  "ios": { "bundle": "com.mobile.app", "supportsTablet": true },
  "android": {
    "package": "com.mobile.app",
    "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" },
    "edgeToEdgeEnabled": true
  },
  "web": { "favicon": "./assets/favicon.png", "bundler": "metro" },
  "extra": {
    "eas": { "projectId": "293312a4-7556-48e5-9375-b9dd16be20d0" }
  }
}
```

### eas.json (Build Profiles)
- **development:** Development client APK
- **preview:** Internal distribution APK
- **production:** Production APK
- **submit:** App submission config (empty)

### metro.config.js (Bundler Configuration)
- Monorepo support: watches all files in monorepo root
- React/React Native resolution: forces resolution from mobile's node_modules
- Prevents version conflicts in workspaces

### tsconfig.json (TypeScript)
- Extends: expo/tsconfig.base
- Strict mode: enabled
- Path aliases: @/* → src/*
- Includes: .expo/types, expo-env.d.ts

### babel.config.js
- Preset: babel-preset-expo
- Plugin: react-native-reanimated/plugin (required for animations)

---

## 6. SHARED LIBRARIES & DEPENDENCIES

### @repo/core
Imported via `src/core/index.ts` (re-exports all)
**Contains:**
- Format utilities (currency, numbers, strings, dates)
- Date utilities (formatting, boundaries, checks, calculations)
- Hooks: useCounter
- Storage: secureStorage, zustandSecureStorage
- Color constants

### @repo/ui
Imported via `src/lib/index.ts`
**Contains:**
- Components:
  - Button, Card, Text, Spacer
  - FormTextInput, FormPasswordInput
  - FormSelectField, FormSelectMultiple
  - FormCheckbox, FormRadioGroup
  - FormDatePicker, FormDateRangePicker
  - Checkbox, RadioGroup
  - SelectField, SelectMultiple
  - Avatar, AvatarWithName
  - BottomSheetModal, ConfirmModal, DeleteConfirmModal
  - CollapsibleCard
  - Skeleton, SkeletonAvatar, SkeletonCard, SkeletonList, SkeletonText
  - SwipeableCard, SwipeableCardProvider
  - DatePicker, DateRangePicker
- Utilities: Typography, Spacing, widthPercentageToDP

### Key Dependencies
```json
{
  "expo": "~54.0.30",              // Expo framework (New Architecture)
  "react": "19.1.0",               // React
  "react-native": "0.81.5",        // React Native with New Architecture
  "expo-router": "~6.0.21",        // File-based routing
  "zustand": "^5.0.9",             // State management
  "@tanstack/react-query": "^5.90.12", // Data fetching/caching
  "axios": "^1.13.2",              // HTTP client
  "react-hook-form": "^7.69.0",    // Form management
  "@hookform/resolvers": "^5.2.2", // Form validation
  "zod": "^4.2.1",                 // Schema validation
  "react-native-reanimated": "~4.1.1", // Animations
  "react-native-gesture-handler": "~2.28.0", // Touch gestures
  "react-native-safe-area-context": "~5.6.0", // Safe area
  "react-native-screens": "~4.16.0", // Navigation optimization
  "react-native-toast-message": "^2.3.3", // Toast notifications
  "react-native-ui-datepicker": "^3.1.2", // Date picker UI
  "expo-secure-store": "~15.0.2",  // Secure data storage
  "expo-status-bar": "~3.0.9",    // Status bar customization
  "dayjs": "^1.11.19",            // Date library (lightweight)
  "react-native-svg": "^15.15.1"  // SVG rendering
}
```

---

## 7. COMPONENT ORGANIZATION

### Custom Icons (`src/icons/`)
SVG icon components:
- CloseIcon (close/X icon)
- InfoIcon (info/alert icon)
- SuccessIcon (checkmark icon)

### Toast System (`src/lib/toast/`)
**Toast API** (`index.ts`)
```typescript
toast.success(options)  // Green success toast
toast.error(options)    // Red error toast
toast.info(options)     // Gray info toast
toast.hide()           // Hide active toast
```

**Toast Config** (`config.js`)
- Custom styled toast components
- Success: Green (#34B368) with SuccessIcon
- Error: Red (#DC4446) with InfoIcon
- Info: Gray (#c4c4c4) with InfoIcon
- All have close button (CloseIcon)
- Uses Animated view for smooth animations

---

## 8. DEVELOPMENT PATTERNS & BEST PRACTICES

### Form Validation
- **Schema:** Zod for schema definition
- **Integration:** react-hook-form + @hookform/resolvers
- **Pattern:**
  ```typescript
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })
  ```

### API Error Handling
- Try/catch blocks
- Specific error messages from response
- Fallback to generic error message
- Status code handling

### State Persistence
- **AuthStore:** Secured with expo-secure-store
- **Hydration:** Check isHydrated flag before rendering
- **Loading UI:** Show loading indicator during hydration

### Responsive Design
- SafeAreaView for edge-safe layouts
- Spacing constants from @repo/ui
- Platform-specific adjustments (iOS vs Android)
- Scale utilities (widthPercentageToDP)

### Animation Patterns
- react-native-reanimated for smooth animations
- Shared values for animation state
- useAnimatedStyle for declarative animations
- withSpring, withTiming, withSequence composition

### Gesture Handling
- react-native-gesture-handler for touch gestures
- Pan, Tap, DoubleTap, Swipe gestures
- Exclusive gesture groups (double-tap preferred over tap)
- runOnJS for calling JS functions from worklet

---

## 9. STORAGE ARCHITECTURE

### Secure Storage (`expo-secure-store`)
**Usage:**
- Auth tokens (access_token, refresh_token)
- User data (optional)
- App credentials
- Sensitive preferences

**APIs (via @repo/core):**
```typescript
// String storage
await secureStorage.setString(key, value)
const value = await secureStorage.getString(key)

// Object storage
await secureStorage.setObject(key, object)
const object = await secureStorage.getObject<T>(key)

// Deletion
await secureStorage.remove(key)
```

**Zustand Persist Integration:**
```typescript
persist(
  (set) => ({ ... }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => zustandSecureStorage),
    partialize: (state) => ({ /* what to persist */ }),
    onRehydrateStorage: () => (state) => { /* hydration callback */ }
  }
)
```

---

## 10. IMPORTANT FILES & PURPOSES

| File Path | Purpose |
|-----------|---------|
| `src/app/_layout.tsx` | Root navigator + provider setup |
| `src/app/(tabs)/_layout.tsx` | Tab navigation + auth guard |
| `src/app/login.tsx` | Login screen with form validation |
| `src/api/axios-config.ts` | HTTP client with auth interceptors |
| `src/api/endpoint.ts` | API base URL + endpoint definitions |
| `src/api/services/auth.service.ts` | Authentication API calls |
| `src/hooks/queries/useAuth.ts` | React Query hooks for auth |
| `src/stores/useAuthStore.ts` | Auth state (persisted) |
| `src/stores/useAppStore.ts` | App-wide state (in-memory) |
| `src/stores/useSettingsStore.ts` | User preferences (in-memory) |
| `src/lib/toast/index.ts` | Toast notification API |
| `src/lib/toast/config.js` | Toast UI customization |
| `app.json` | Expo app configuration |
| `eas.json` | EAS build profiles |
| `metro.config.js` | Metro bundler monorepo setup |
| `tsconfig.json` | TypeScript compiler options |
| `babel.config.js` | Babel presets + plugins |
| `package.json` | Dependencies + scripts |

---

## 11. TECH STACK SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Expo 54, React Native 0.81.5, React 19 | Cross-platform mobile development |
| **Routing** | Expo Router 6.0.21 | File-based navigation system |
| **State** | Zustand 5.0.9 | Global state management |
| **Data Fetching** | React Query 5.90.12 | API calls + caching |
| **HTTP** | Axios 1.13.2 | HTTP client with interceptors |
| **Forms** | React Hook Form 7.69.0 + Zod 4.2.1 | Form management + validation |
| **Storage** | expo-secure-store 15.0.2 | Encrypted local storage |
| **Animations** | react-native-reanimated 4.1.1 | Smooth 60fps animations |
| **Gestures** | react-native-gesture-handler 2.28.0 | Touch gesture detection |
| **UI Components** | @repo/ui (custom) | Shared component library |
| **Notifications** | react-native-toast-message 2.3.3 | Toast notifications |
| **Date Handling** | dayjs 1.11.19 | Lightweight date library |
| **SVG** | react-native-svg 15.15.1 | Vector graphics rendering |
| **Language** | TypeScript 5.9.2 (strict) | Type-safe development |

---

## 12. ARCHITECTURE STRENGTHS

1. **Monorepo Organization:** Shared @repo/core and @repo/ui libraries
2. **Authentication:** Complete auth flow with token refresh mechanism
3. **State Persistence:** Secure storage + Zustand hydration pattern
4. **Type Safety:** Full TypeScript strict mode
5. **Component Library:** Rich UI components with form integration
6. **Form System:** React Hook Form + Zod validation
7. **API Integration:** Professional axios setup with interceptors
8. **Animation Support:** Reanimated + Gesture Handler combo
9. **Documentation:** Comprehensive demo screens
10. **Build Configuration:** EAS profiles for dev/preview/production

---

## 13. UNRESOLVED QUESTIONS / NOTES

- API_BASE_URL in endpoint.ts is placeholder (https://api.example.com/)
- Login screen has mock implementation (demo mode)
- Settings store doesn't have persistence (can be added if needed)
- components/ directory is empty (ready for custom app components)
- No implemented push notifications (infrastructure ready with notificationsEnabled flag)
- No implemented biometric auth (infrastructure ready with biometricEnabled flag)

---

**Report Generated:** 2025-12-26 23:19  
**Explorer:** Scout-External Agent
**Status:** Complete
