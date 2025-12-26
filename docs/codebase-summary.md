# Codebase Summary

## Project Structure

```
rn-template/
├── apps/
│   └── mobile/                      # Main mobile application
│       ├── src/
│       │   ├── app/                # Expo Router navigation
│       │   │   ├── _layout.tsx     # Root layout wrapper
│       │   │   ├── login.tsx       # Authentication screen
│       │   │   └── (tabs)/         # Tabbed navigation
│       │   │       ├── _layout.tsx # Tab layout
│       │   │       ├── index.tsx   # Home/primary screen
│       │   │       ├── explore.tsx # Storage exploration
│       │   │       ├── api-test.tsx# API integration testing
│       │   │       ├── settings.tsx# Settings/stores demo
│       │   │       └── playground.tsx# Component showcase
│       │   ├── stores/             # Zustand state stores
│       │   │   ├── useAuthStore.ts # Auth state + persistence
│       │   │   ├── useAppStore.ts  # App-level state
│       │   │   └── useSettingsStore.ts # Settings persistence
│       │   ├── api/                # HTTP and API configuration
│       │   │   ├── axios-config.ts # Axios instance + interceptors
│       │   │   ├── endpoint.ts     # API endpoints and base URL
│       │   │   └── services/       # API service functions
│       │   │       └── auth.service.ts
│       │   ├── hooks/              # Custom React hooks
│       │   │   └── queries/        # React Query hooks
│       │   │       └── useAuth.ts
│       │   ├── components/         # App-specific components
│       │   ├── icons/              # Custom SVG icons
│       │   └── lib/                # Utility libraries
│       │       └── toast/          # Toast notification config
│       ├── assets/                 # Images, icons, splash screen
│       ├── app.json               # Expo configuration
│       ├── eas.json               # EAS build profiles
│       ├── metro.config.js        # Metro bundler config
│       ├── babel.config.js        # Babel configuration
│       ├── tsconfig.json          # TypeScript configuration
│       └── package.json           # Dependencies
│
├── packages/
│   ├── core/                       # @repo/core (git submodule)
│   │   ├── src/
│   │   │   ├── hooks/             # React hooks (useToggle, useCounter, useDebounce)
│   │   │   ├── utils/             # Utility functions (30+ functions)
│   │   │   │   ├── date.ts       # Date/time operations
│   │   │   │   ├── validation.ts # Email, phone, validation
│   │   │   │   ├── format.ts     # Currency, number, text formatting
│   │   │   │   └── color.ts      # Color utilities
│   │   │   ├── constants/         # Shared constants
│   │   │   │   └── colors.ts     # Color palette
│   │   │   ├── storage/           # Secure storage wrappers
│   │   │   │   ├── secureStorage.ts
│   │   │   │   └── tokenStorage.ts
│   │   │   ├── path/              # Query string utilities
│   │   │   └── index.ts           # Main entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ui/                         # @repo/ui (git submodule)
│       ├── src/
│       │   ├── components/         # 40+ UI components
│       │   │   ├── core/          # Button, Text, Card, Spacer
│       │   │   ├── form/          # Form inputs (20+ variants)
│       │   │   ├── overlays/      # Modals, sheets, skeletons
│       │   │   ├── shared/        # Avatar, CollapsibleCard, SwipeableCard
│       │   │   └── icons/         # Icon components
│       │   └── index.ts           # Main entry point
│       ├── package.json
│       └── tsconfig.json
│
├── scripts/
│   └── setup.sh                    # Installation and setup script
│
├── .claude/                        # Claude Code configuration
│   ├── agents/                     # Agent definitions
│   ├── skills/                     # Skills and scripts
│   ├── hooks/                      # Git hooks
│   └── workflows/                  # Development workflows
│
├── .eslintrc.js or eslint.config.js# Linting configuration
├── prettier.config.js              # Code formatting
├── tsconfig.json                   # Root TypeScript config
├── package.json                    # Root workspace config
└── README.md                        # Quick start guide

```

---

## Key Files & Their Purposes

### Root Configuration

| File | Purpose |
|------|---------|
| `package.json` | npm workspace root; shared scripts (lint, format) |
| `tsconfig.json` | Base TypeScript configuration (extended by packages) |
| `.eslintrc.js` or `eslint.config.js` | Linting rules (ESLint 9 flat config) |
| `prettier.config.js` | Code formatting rules |
| `.gitmodules` | Git submodule configuration for packages/core and packages/ui |

### Mobile App Core

| File | Purpose |
|------|---------|
| `apps/mobile/src/app/_layout.tsx` | Root layout; providers (QueryClient, Gestures, SafeArea) |
| `apps/mobile/src/app/(tabs)/_layout.tsx` | Tab navigation structure |
| `apps/mobile/src/stores/useAuthStore.ts` | Authentication state (persisted in secure storage) |
| `apps/mobile/src/api/axios-config.ts` | HTTP client with token refresh interceptor |
| `apps/mobile/app.json` | Expo app metadata and configuration |
| `apps/mobile/eas.json` | EAS build profiles (dev, preview, production) |
| `apps/mobile/metro.config.js` | Monorepo resolution for Metro bundler |

### API Layer

| File | Purpose |
|------|---------|
| `apps/mobile/src/api/endpoint.ts` | API base URL and endpoint constants |
| `apps/mobile/src/api/axios-config.ts` | Axios instance with auto token refresh |
| `apps/mobile/src/api/services/auth.service.ts` | Login/logout API calls |

### State Management

| File | Purpose |
|------|---------|
| `apps/mobile/src/stores/useAuthStore.ts` | User, token, auth state (encrypted storage) |
| `apps/mobile/src/stores/useAppStore.ts` | General app state |
| `apps/mobile/src/stores/useSettingsStore.ts` | User settings (encrypted storage) |

### Shared Packages

| Path | Purpose |
|------|---------|
| `packages/core/src/index.ts` | Main export (50+ functions and hooks) |
| `packages/ui/src/index.ts` | Main export (40+ components) |

---

## Entry Points & Bootstrap Flow

### App Bootstrap

```
app.json (Expo config)
  ↓
babel.config.js (JS transpilation)
  ↓
metro.config.js (Bundling + workspaces)
  ↓
src/app/_layout.tsx (Root layout)
  ├─ GestureHandlerRootView (gesture handling)
  ├─ SafeAreaProvider (notch handling)
  ├─ QueryClientProvider (React Query)
  ├─ Stack (navigation)
  │  ├─ login screen
  │  └─ (tabs) screen
  └─ Toast (notifications)
```

### Navigation Structure (Expo Router)

```
Root (Stack)
├─ login              [Authentication screen]
└─ (tabs)             [Tab navigation]
   ├─ index           [Home - primary tab]
   ├─ explore         [Storage exploration]
   ├─ settings        [Settings & stores demo]
   ├─ api-test        [API integration testing]
   └─ playground      [40+ component showcase]
```

---

## Core Layers

### 1. Presentation Layer (apps/mobile/src)

**Files:**
- `app/_layout.tsx`, `app/(tabs)/_layout.tsx` - Navigation/layouts
- `app/(tabs)/*.tsx` - Screen components
- `components/` - App-specific reusable components
- `icons/` - Custom icon components

**Responsibilities:**
- User interface rendering
- User interaction handling
- Navigation and routing

**Dependencies:**
- @repo/ui (components)
- expo-router (navigation)
- react-native-reanimated (animations)

### 2. State Management Layer (apps/mobile/src/stores + hooks)

**Files:**
- `stores/useAuthStore.ts` - Authentication state
- `stores/useAppStore.ts` - App state
- `stores/useSettingsStore.ts` - Settings state
- `hooks/queries/useAuth.ts` - React Query hooks

**Responsibilities:**
- Centralized state management (Zustand)
- State persistence (encrypted)
- Server state synchronization (React Query)

**Dependencies:**
- zustand (client state)
- @tanstack/react-query (server state)
- @repo/core (storage, token management)

### 3. API Layer (apps/mobile/src/api)

**Files:**
- `axios-config.ts` - HTTP client + interceptors
- `endpoint.ts` - API configuration
- `services/auth.service.ts` - API functions

**Responsibilities:**
- HTTP request handling
- Request/response interception
- Automatic token refresh
- Error handling

**Dependencies:**
- axios (HTTP)
- @repo/core (token management)

### 4. Utilities & Shared Code (packages/core, @repo/ui)

**Core Package (@repo/core):**
- 50+ utilities (date, validation, formatting)
- 3 custom hooks (useToggle, useCounter, useDebounce)
- Secure storage wrapper
- Token management utilities
- Color utilities and constants

**UI Package (@repo/ui):**
- 40+ pre-built components
- Form components (inputs, selects, date pickers)
- Layout components (Card, Spacer)
- Overlay components (Modal, BottomSheet, Skeleton)
- Icon components

---

## Data Flow

### Authentication Flow

```
User Input (Login)
  ↓
API Call (auth.service.login)
  ↓
Axios Request → Interceptor adds token (if exists)
  ↓
Server Response
  ↓
Success: setTokens → Zustand persist → Secure storage
Failure: Handle error, show toast
```

### Token Refresh Flow

```
API Request (non-auth)
  ↓
Axios Request → Add access token header
  ↓
Server Returns 401
  ↓
Interceptor: refreshAccessToken()
  ↓
GET /refresh with refresh_token
  ↓
New tokens → setTokens → Persist
  ↓
Retry original request with new token
```

### Form Submission Flow

```
User Input
  ↓
react-hook-form tracks state (minimal re-renders)
  ↓
User submits
  ↓
Zod schema validation (client-side)
  ↓
Valid: API call
Invalid: Show errors
  ↓
API Response
  ↓
Success: Update state, toast, navigate
Failure: Show error toast
```

---

## State Management Pattern

### Zustand Stores

All stores use the same pattern:

```typescript
export const useStore = create<State>()(
  persist(
    (set) => ({
      // state
      value: initialValue,
      // actions
      setValue: (val) => set({ value: val }),
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => zustandSecureStorage), // for persisted stores
    }
  )
);
```

### Store Organization

| Store | Persisted | Content |
|-------|-----------|---------|
| useAuthStore | YES | user, token, isAuthenticated |
| useAppStore | NO | general app state |
| useSettingsStore | YES | user preferences |

---

## Component Structure

### Page Components (Screens)

Located: `apps/mobile/src/app/(tabs)/*.tsx`

- Render full screens
- Connect to state (Zustand)
- Use React Query for data fetching
- Compose UI components

### UI Components

Located: `packages/ui/src/components/`

Organized in subdirectories:
- **core/** - Basic building blocks (Text, Button, Card, Spacer)
- **form/** - Form inputs with react-hook-form integration
- **overlays/** - Modal, BottomSheet, Skeleton variants
- **shared/** - Avatar, CollapsibleCard, SwipeableCard
- **icons/** - Icon components (ArrowDown, Calendar, Close, etc.)

---

## Utility Organization

### @repo/core Structure

**hooks/**: 3 custom hooks
- `useToggle(initialValue?)` - Boolean toggle
- `useCounter(initialValue?)` - Counter with increment/decrement
- `useDebounce<T>(value, delay)` - Debounced value

**utils/**: 30+ utility functions
- `date.ts` - 30+ date/time functions
- `validation.ts` - Email, phone, isEmpty validation
- `format.ts` - Currency, number, percentage, text formatting
- `color.ts` - Color generation and utilities

**storage/**: Secure data persistence
- `secureStorage` - Wrapper around expo-secure-store
- `tokenStorage` - Specialized token management
- `zustandSecureStorage` - Adapter for Zustand persist

**constants/**: Shared constants
- `colors.ts` - 11-color palette

**path/**: Query string utilities
- String ↔ parameter conversion

---

## Dependencies & Compatibility

### Direct Dependencies (20 packages)

**Runtime:**
- react@19.1.0 - UI library
- react-native@0.81.5 - Native runtime
- expo@54.0.30 - Managed service
- expo-router@6.0.21 - File-based routing

**State & Data:**
- zustand@5.0.9 - State management
- @tanstack/react-query@5.90.12 - Server state
- react-hook-form@7.69.0 - Form handling
- zod@4.2.1 - Validation

**API:**
- axios@1.13.2 - HTTP client

**Native Modules:**
- react-native-reanimated@4.1.1 - Animations
- react-native-gesture-handler@2.28.0 - Gestures
- react-native-screens@4.16.0 - Navigation
- react-native-safe-area-context@5.6.0 - Safe area
- react-native-svg@15.15.1 - SVG support
- expo-secure-store@15.0.2 - Secure storage

**UI:**
- react-native-toast-message@2.3.3 - Toast notifications
- react-native-ui-datepicker@3.1.2 - Date picker

### Development Dependencies

- typescript@5.9.2 - Type checking
- eslint@9.39.2 - Linting
- prettier@3.7.4 - Formatting
- @typescript-eslint/* - ESLint TypeScript support

### Peer Dependencies (via packages)

- moment@2.30.1 - Date/time (in @repo/core)
- expo-secure-store - Secure storage (in @repo/core)
- zustand - State mgmt (in @repo/core)

---

## Configuration Files

### TypeScript

**Root:** `tsconfig.json`
- Base configuration
- ES2020 target
- Strict mode
- Module: ESNext

Extended by:
- `apps/mobile/tsconfig.json`
- `packages/core/tsconfig.json`
- `packages/ui/tsconfig.json`

### Babel

**File:** `apps/mobile/babel.config.js`
- Configures: expo, react-native-reanimated, react-native-gesture-handler
- Required for proper transpilation

### Metro

**File:** `apps/mobile/metro.config.js`
- Resolves monorepo workspaces
- Configures asset handling
- Enables resolver for @repo/* packages

### ESLint

**File:** `.eslintrc.js` or `eslint.config.js` (ESLint 9 flat config)
- Enforces TypeScript rules
- React/React Native rules
- Code quality standards

### Prettier

**File:** `prettier.config.js`
- Consistent code formatting
- 2-space indentation (typical)
- Semicolons enabled

---

## Monorepo Resolution

### npm Workspaces

**Root package.json:**
```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Enables:
- Single `npm install` installs all dependencies
- Cross-workspace imports (auto-resolved)
- Consistent dependency versions

### Git Submodules

**Packages as submodules:**
- `packages/core` → https://github.com/The1Studio/rn-core.git
- `packages/ui` → https://github.com/The1Studio/rn-ui.git

Enables:
- Independent package development
- Separate versioning
- External contribution

### Metro Bundler Resolution

**metro.config.js:**
- Resolves @repo/core and @repo/ui
- Uses sym-linked node_modules
- Enables hot reload across packages

---

## Build Configuration

### Expo Configuration (app.json)

```json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "scheme": "mobile",
    "newArchEnabled": true,
    "ios": { "bundleIdentifier": "com.mobile.app" },
    "android": { "package": "com.mobile.app" }
  }
}
```

### EAS Build Profiles (eas.json)

Three profiles:
1. **development** - Development builds for debugging
2. **preview** - Internal distribution for QA
3. **production** - App store release builds

---

## Security Configuration

### Token Storage

- Access token: Short-lived (1hr typical)
- Refresh token: Long-lived (30 days typical)
- Stored in: expo-secure-store (encrypted)
- Retrieved by: Axios request interceptor

### Secure Storage

- API: expo-secure-store (2KB per value limit)
- Encryption: Native (iOS Keychain, Android Encrypted Shared Preferences)
- Used for: Tokens, credentials, sensitive preferences

### API Communication

- Protocol: HTTPS only (configured in endpoint.ts)
- Headers: Content-Type: application/json, Authorization: Bearer token
- Validation: Zod schemas for response data

---

## Testing Structure (Not yet implemented)

Placeholder for:
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Detox or similar)

---

## Performance Considerations

### Bundle Size
- Production Android APK: ~5MB target
- Web bundle: Tree-shaking removes unused code
- Hermes engine: Enabled for Android (via Expo)

### Runtime Performance
- Animations: 60 FPS via react-native-reanimated
- Re-renders: Minimized via react-hook-form + Zustand selectors
- API caching: React Query automatic cache management

### State Updates
- Zustand: Minimal re-renders (hook-based selectors)
- React Query: Smart cache invalidation
- Forms: react-hook-form minimal field re-renders

---

## Common Development Tasks

| Task | Location | Tools |
|------|----------|-------|
| Add a screen | `apps/mobile/src/app/(tabs)/` | Expo Router |
| Add a component | `packages/ui/src/components/` | React Native |
| Add a hook | `packages/core/src/hooks/` | React |
| Add API endpoint | `apps/mobile/src/api/services/` | Axios |
| Add state management | `apps/mobile/src/stores/` | Zustand |
| Update global styles | `packages/ui/` | Design system |
| Configure build | `apps/mobile/eas.json` | EAS |

---

**Last Updated:** 2025-12-26
**Scope:** Comprehensive codebase structure and organization
**Next Review:** When major architectural changes occur
