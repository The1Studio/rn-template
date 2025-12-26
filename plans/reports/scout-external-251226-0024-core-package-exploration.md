# @repo/core Package - Comprehensive Exploration Report

**Date:** 2025-12-26  
**Scope:** Complete architecture, organization, and exports of the shared core package  
**Source:** git@github.com:The1Studio/rn-core.git

---

## 1. STRUCTURE & ORGANIZATION

### Directory Layout
```
packages/core/
├── package.json                    # Package configuration
├── tsconfig.json                   # TypeScript configuration
└── src/
    ├── index.ts                    # Main entry point with all exports
    ├── hooks/                      # React hooks
    │   ├── index.ts
    │   ├── useToggle.ts
    │   ├── useCounter.ts
    │   └── useDebounce/
    │       └── index.ts
    ├── utils/                      # Utility functions (5 modules)
    │   ├── index.ts
    │   ├── format.ts               # Currency, number, string formatting
    │   ├── validation.ts           # Email, phone, empty validation
    │   ├── date.ts                 # Moment.js date utilities (comprehensive)
    │   └── color.ts                # Color generation utility
    ├── constants/                  # Shared constants
    │   ├── index.ts
    │   └── colors.ts               # Color palette (11 colors)
    ├── storage/                    # Secure storage & token management
    │   ├── index.ts
    │   ├── secureStorage.ts        # Expo-secure-store wrapper
    │   └── tokenStorage.ts         # Token management functions
    └── path/                       # Query string & path utilities
        └── index.ts
```

### Files Overview
- **Total TypeScript Files:** 13 source files
- **Total Config Files:** 2 (package.json, tsconfig.json)
- **Logical Modules:** 5 (hooks, utils, constants, storage, path)

---

## 2. PACKAGE CONFIGURATION

### package.json
**Name:** `@repo/core`  
**Version:** 0.0.1  
**Type:** Private workspace package  
**Entry Point:** `./src/index.ts`  

#### Dependencies
```json
{
  "dependencies": {
    "moment": "^2.30.1"
  }
}
```
- **moment:** Date/time library (comprehensive date utilities)

#### Peer Dependencies
```json
{
  "peerDependencies": {
    "expo-secure-store": "*",
    "react": "*",
    "zustand": "*"
  }
}
```
- **expo-secure-store:** Secure storage (Native module, required for token/data persistence)
- **react:** Core React library (needed for hooks)
- **zustand:** State management library (optional, for persist adapter)

#### Dev Dependencies
- `@types/react: ~19.1.0`
- `expo-secure-store: ~15.0.2`
- `typescript: ^5.3.0`
- `zustand: ^5.0.9`

#### Build Scripts
```bash
npm run core typecheck     # TypeScript type checking (tsc --noEmit)
```

### TypeScript Configuration
**Target:** ES2020  
**Module System:** ESNext  
**Module Resolution:** bundler  
**Library:** ES2020  
**Strict Mode:** Yes (all strict checks enabled)  
**Key Features:**
- Declaration maps enabled (debugging TS)
- Isolated modules (safe for transpilers)
- Force consistent casing in file names

---

## 3. EXPORTED MODULES & APIs

### 3.1 HOOKS (3 hooks + 1 utility hook)

#### useToggle
**File:** `/packages/core/src/hooks/useToggle.ts`

**Signature:**
```typescript
export function useToggle(initialValue = false): [boolean, () => void]
```

**Purpose:** State management for boolean toggle values

**Parameters:**
- `initialValue` (optional, default: false): Initial state value

**Returns:** Tuple containing:
- Current boolean value
- Toggle function (no args, mutates state)

**Example Usage:**
```typescript
import { useToggle } from '@repo/core';

const [isOpen, toggle] = useToggle(false);
// isOpen: boolean
// toggle(): void
```

**Implementation Details:**
- Uses `useState` for state management
- Uses `useCallback` for toggle function (prevents unnecessary re-renders)
- Toggle function with no dependencies (stable reference)

---

#### useCounter
**File:** `/packages/core/src/hooks/useCounter.ts`

**Signature:**
```typescript
export function useCounter(initialValue = 0): UseCounterReturn

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
```

**Purpose:** Counter state management with increment/decrement/reset

**Parameters:**
- `initialValue` (optional, default: 0): Initial count value

**Returns:** Object containing:
- `count`: Current counter value
- `increment()`: Adds 1 to count
- `decrement()`: Subtracts 1 from count
- `reset()`: Resets to initial value

**Example Usage:**
```typescript
import { useCounter } from '@repo/core';

const { count, increment, decrement, reset } = useCounter(0);
```

**Implementation Details:**
- Uses `useState` for state
- All functions use `useCallback` (stable references)
- Reset depends on `initialValue` to support dynamic updates

---

#### useDebounce
**File:** `/packages/core/src/hooks/useDebounce/index.ts`

**Signature:**
```typescript
export default function useDebounce<T>(value: T, delay: number): T
```

**Purpose:** Debounce values with generic type support

**Type Parameters:**
- `T`: Value type (string, object, number, etc.)

**Parameters:**
- `value`: Value to debounce
- `delay`: Delay in milliseconds before updating debounced value

**Returns:** Debounced value (same type as input)

**Example Usage:**
```typescript
import useDebounce from '@repo/core';

const searchTerm = 'hello';
const debouncedTerm = useDebounce(searchTerm, 500);
// debouncedTerm updates 500ms after searchTerm changes
```

**Implementation Details:**
- Generic type support for any value type
- Cancels previous timeouts if value changes within delay
- Cleanup on unmount (prevents memory leaks)
- Dependencies: `[value, delay]` (re-setup on either change)

---

### 3.2 UTILS (30+ functions across 4 modules)

#### utils/format.ts - String & Number Formatting

**formatCurrency(amount: number, currency = 'USD'): string**
- Formats number as currency using Intl.NumberFormat
- Default currency: USD
- Example: `1234.56` → `"$1,234.56"`

**formatNumber(num: number, decimals = 0): string**
- Formats number with specific decimal places
- Example: `1234.5678` with decimals=2 → `"1,234.57"`

**formatPercentage(value: number, decimals = 0): string**
- Formats value as percentage (value/100)
- Example: `85` with decimals=2 → `"85.00%"`

**capitalize(str: string): string**
- Capitalizes first letter, lowercase rest
- Example: `"hello"` → `"Hello"`

**truncate(str: string, maxLength: number): string**
- Truncates string and adds ellipsis if exceeds max length
- Example: `"hello world"` with maxLength=8 → `"hello..."`

---

#### utils/validation.ts - Input Validation

**isValidEmail(email: string): boolean**
- Validates email format using regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Checks presence of @ and domain suffix
- Example: `"user@example.com"` → `true`

**isValidPhone(phone: string): boolean**
- Validates phone number using regex: `/^\+?[\d\s-]{10,}$/`
- Accepts optional +, digits, spaces, dashes (min 10 chars)
- Example: `"+1 (555) 123-4567"` → `true`

**isEmpty(value: string | null | undefined): boolean**
- Checks if value is null, undefined, or empty string (whitespace-only)
- Returns: true if empty
- Example: `" "` → `true`, `"hello"` → `false`

---

#### utils/date.ts - Comprehensive Date Utilities (30+ functions)

**Uses:** Moment.js for all date operations

**Date Format Constants (DateFormats object):**
```typescript
DateFormats = {
  // Date only
  DATE_SHORT: 'DD/MM/YYYY',
  DATE_MEDIUM: 'DD MMM YYYY',
  DATE_LONG: 'DD MMMM YYYY',
  DATE_US: 'MM/DD/YYYY',
  DATE_ISO: 'YYYY-MM-DD',

  // Time only
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  TIME_WITH_SECONDS: 'HH:mm:ss',

  // Date and Time
  DATETIME_SHORT: 'DD/MM/YYYY HH:mm',
  DATETIME_MEDIUM: 'DD MMM YYYY, HH:mm',
  DATETIME_LONG: 'DD MMMM YYYY, HH:mm:ss',
  DATETIME_12H: 'DD/MM/YYYY hh:mm A',

  // Relative
  MONTH_YEAR: 'MMMM YYYY',
  DAY_MONTH: 'DD MMM',
  WEEKDAY: 'dddd',
  WEEKDAY_SHORT: 'ddd'
}
```

**Formatting Functions:**
- **formatDate(date, format?)**: Format date with specified format (default: DATE_SHORT)
- **formatRelative(date)**: Relative time like "2 hours ago", "in 3 days"
- **formatCalendar(date)**: Calendar format like "Today at 2:30 PM", "Yesterday"
- **formatDuration(startDate, endDate)**: Duration between dates (e.g., "2 hours")
- **formatSmart(date)**: Smart formatting with context
  - Today: "Today, 2:30 PM"
  - Yesterday: "Yesterday, 2:30 PM"
  - This year: "15 Jan, 2:30 PM"
  - Other years: "15 Jan 2023, 2:30 PM"

**Date Range Functions:**
- **startOfDay(date)**: Get start of day (00:00:00)
- **endOfDay(date)**: Get end of day (23:59:59)
- **startOfWeek(date)**: Get start of week (Monday)
- **endOfWeek(date)**: Get end of week (Sunday)
- **startOfMonth(date)**: Get first day of month
- **endOfMonth(date)**: Get last day of month

**Date Arithmetic:**
- **addTime(date, amount, unit)**: Add time to date
  - Units: 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
- **subtractTime(date, amount, unit)**: Subtract time from date

**Date Comparison:**
- **isBefore(date, compareDate)**: Check if date is before another
- **isAfter(date, compareDate)**: Check if date is after another
- **isBetween(date, startDate, endDate)**: Check if date is between range
- **isToday(date)**: Check if date is today
- **isYesterday(date)**: Check if date is yesterday
- **isTomorrow(date)**: Check if date is tomorrow
- **isPast(date)**: Check if date is in past
- **isFuture(date)**: Check if date is in future
- **isValidDate(date)**: Check if date is valid

**Date Utilities:**
- **getDiff(date1, date2, unit?)**: Get difference between dates (default: days)
- **getAge(birthDate)**: Get age in years from birth date
- **parseDate(dateString, format?)**: Parse date string to Date object
- **now()**: Get current date as Date object
- **getMoment(date?)**: Get raw Moment instance for advanced usage
- **Export:** Moment.js library itself (for advanced usage)

---

#### utils/color.ts - Color Generation

**generateColor(text: string): string**
- Generates consistent RGB color from text string
- Uses hash-based algorithm for deterministic output
- Default text: 'aicactus' if input empty
- Returns: "rgb(r, g, b)" string format
- Example: `"John"` → consistent color every time

**Algorithm:**
- Hash calculation from character codes
- Sin-based RGB component generation
- Deterministic (same input = same color)

---

### 3.3 CONSTANTS (1 module)

#### constants/colors.ts - Color Palette

**Export:** `colors` object (11 semantic colors)

```typescript
export const colors = {
  primary: '#6366f1',        // Indigo
  secondary: '#8b5cf6',      // Violet
  success: '#22c55e',        // Green
  warning: '#f59e0b',        // Amber
  error: '#ef4444',          // Red
  background: '#f8fafc',     // Slate (light)
  surface: '#ffffff',        // White
  text: '#1e293b',           // Slate (dark)
  textSecondary: '#64748b',  // Slate (medium)
  border: '#e2e8f0',         // Slate (light border)
} as const
```

**Type Export:** `ColorName`
- Union type of all color keys
- Type-safe color selection: `colors[ColorName]`

---

### 3.4 STORAGE (2 modules - 10+ functions)

#### storage/secureStorage.ts - Secure Data Persistence

**Uses:** expo-secure-store (iOS Keychain, Android EncryptedSharedPreferences)

**API Object: `secureStorage`**

**String Operations:**
- **getString(key: string): Promise<string | null>**
  - Retrieve string value by key
  - Returns null if not found or error
  
- **setString(key: string, value: string): Promise<void>**
  - Store string securely
  - Overwrites if key exists

**Object/JSON Operations:**
- **getObject<T>(key: string): Promise<T | null>**
  - Retrieve and deserialize JSON object
  - Type-safe with generics
  - Returns null on error or not found
  
- **setObject<T>(key: string, value: T): Promise<void>**
  - Store object as JSON string securely
  - Works with any JSON-serializable type

**Delete Operations:**
- **remove(key: string): Promise<void>**
  - Delete item by key

**Example Usage:**
```typescript
import { secureStorage } from '@repo/core';

// Store a string
await secureStorage.setString('token', 'abc123');
const token = await secureStorage.getString('token');

// Store an object
await secureStorage.setObject('user', { id: 1, name: 'John' });
const user = await secureStorage.getObject<User>('user');

// Remove
await secureStorage.remove('token');
```

---

#### storage/secureStorage.ts - Zustand Adapter

**API Object: `zustandSecureStorage`**

Implements `StateStorage` interface for Zustand persist middleware:

- **getItem(name: string): Promise<string | null>**
  - Get persisted state JSON string

- **setItem(name: string, value: string): Promise<void>**
  - Persist state JSON string

- **removeItem(name: string): Promise<void>**
  - Remove persisted state

**Example Integration:**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandSecureStorage } from '@repo/core';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandSecureStorage),
    }
  )
);
```

**Re-export:** `SecureStore` - Direct access to expo-secure-store if needed

---

#### storage/tokenStorage.ts - Token Management

**Constants:**
```typescript
TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
} as const
```

**Access Token Functions:**
- **getToken(): Promise<string | null>**
  - Retrieve access token

- **setToken(token: string): Promise<void>**
  - Store access token

- **removeToken(): Promise<void>**
  - Delete access token

**Refresh Token Functions:**
- **getRefreshToken(): Promise<string | null>**
  - Retrieve refresh token

- **setRefreshToken(refreshToken: string): Promise<void>**
  - Store refresh token

- **removeRefreshToken(): Promise<void>**
  - Delete refresh token

**Utility Functions:**
- **setTokens(token: string, refreshToken: string): Promise<void>**
  - Store both tokens in parallel

- **clearTokens(): Promise<void>**
  - Remove both tokens in parallel

- **getTokens(): Promise<{ token: string | null; refreshToken: string | null }>**
  - Retrieve both tokens in parallel

**Example Usage:**
```typescript
import { setTokens, getTokens, clearTokens } from '@repo/core';

// Login flow
await setTokens(accessToken, refreshToken);

// Check auth status
const { token, refreshToken } = await getTokens();

// Logout
await clearTokens();
```

---

### 3.5 PATH (1 module - 3 functions)

#### path/index.ts - Query String & Path Utilities

**varToStringParams(data: IVarToStringParams): string**
- Converts array of key-value pairs to query string
- Filters out undefined/null values
- Adds '?' prefix
- Multiple values: `&` separator
- Single value: `?key=value` format
- Empty array: returns empty string

**Example:**
```typescript
const result = varToStringParams({
  variablesArray: [
    { key: 'id', value: 123 },
    { key: 'name', value: 'John' },
  ]
});
// Returns: "?id=123&name=John"
```

**arrayToStr(arr: Array<string | number>, separator = ','): string**
- Joins array elements with separator
- Default separator: comma

**Example:**
```typescript
arrayToStr([1, 2, 3], ', ')  // "1, 2, 3"
arrayToStr(['a', 'b'], '|')  // "a|b"
```

**strToArr(str: string, separator = ','): string[]**
- Splits string by separator, removes spaces
- Filters empty elements
- Default separator: comma

**Example:**
```typescript
strToArr('a, b, c')   // ["a", "b", "c"]
strToArr('1 | 2 | 3', '|')  // ["1", "2", "3"]
```

**objToStringParams(queryObj: IQueryObject): string**
- Converts object to query string
- Keys sorted alphabetically (stable order)
- Filters out undefined/null values
- Uses `varToStringParams` internally

**Example:**
```typescript
objToStringParams({ name: 'John', id: 123, city: 'NYC' })
// Returns: "?city=NYC&id=123&name=John" (alphabetical)
```

---

## 4. EXPORT PATTERNS

### Main Entry Point: src/index.ts

**Two export styles for flexibility:**

**Style 1: Direct Imports (Flat)**
```typescript
import { useToggle, useCounter, useDebounce } from '@repo/core';
import { formatCurrency, isValidEmail, colors } from '@repo/core';
import { secureStorage, getToken, setToken } from '@repo/core';
```

**Style 2: Namespaced Imports (Organized)**
```typescript
import { Hooks, Utils, Constants, Storage } from '@repo/core';

// Usage
Hooks.useToggle(false)
Utils.formatCurrency(100)
Constants.colors.primary
Storage.secureStorage.getString('token')
```

**All exports from:**
- `./hooks` - useToggle, useCounter, useDebounce
- `./utils` - format, validation, date, color functions
- `./constants` - colors palette
- `./storage` - secureStorage, tokenStorage functions
- `./path` - Query string utilities

---

## 5. IMPLEMENTATION DETAILS

### Secure Storage Implementation

**Technology Stack:**
- **expo-secure-store:** Native secure storage
  - iOS: Keychain
  - Android: EncryptedSharedPreferences
  - Works with Expo Go (no development build needed)

**Wrapper Layer (`secureStorage` object):**
- Adds convenience methods (getString, setObject, etc.)
- Standardizes API (async for all operations)
- Adds error handling (returns null on failure)

**Size Limitations:**
- Per-value limit: 2KB (expo-secure-store limitation)
- Best for: tokens, credentials, small preferences
- Not ideal for: large data (use AsyncStorage or expo-file-system)

---

### Zustand Persistence Pattern

**Problem:** Zustand + Zustand persist middleware don't natively support async storage

**Solution:** Custom StateStorage adapter
```typescript
zustandSecureStorage implements StateStorage {
  async getItem(name: string)
  async setItem(name: string, value: string)
  async removeItem(name: string)
}
```

**Async Hydration Requirement:**
Since secure storage is async, stores must track hydration status:

```typescript
const store = create(
  persist(
    (set) => ({
      // ... state
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      storage: createJSONStorage(() => zustandSecureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

UI should wait for hydration:
```typescript
if (!isHydrated) return <SplashScreen />;
```

---

### Validation Patterns

**Email Validation:**
- Regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Checks for: username@domain.tld format
- Limitations: Doesn't validate domain actually exists
- Use for: Basic format validation only

**Phone Validation:**
- Regex: `/^\+?[\d\s-]{10,}$/`
- Accepts: Optional +, digits, spaces, dashes
- Minimum length: 10 characters
- Limitations: International format variations

**Empty String Check:**
- Handles: null, undefined, whitespace-only strings
- Trim applied before empty check

---

### Date Utilities Architecture

**Layer 1: Moment.js Wrapper**
- All functions use Moment.js internally
- Stable interface regardless of Moment.js version
- Easy to switch to Day.js or date-fns if needed

**Layer 2: Format Functions**
- Semantic formatting (formatSmart, formatRelative)
- Standard formats (DATE_SHORT, DATETIME_LONG)
- Custom format support

**Layer 3: Utility Functions**
- Date arithmetic (add, subtract)
- Comparison (before, after, between)
- Range queries (startOfDay, endOfMonth)

**Layer 4: Direct Moment Access**
- `getMoment()` and exported `moment` for advanced usage
- Escape hatch if built-in utilities insufficient

---

## 6. USAGE IN MONOREPO

### Mobile App Integration

**Import in apps/mobile:**
```typescript
import { 
  useCounter, useToggle, useDebounce,
  formatCurrency, isValidEmail, colors,
  secureStorage, getToken, setToken,
  varToStringParams, objToStringParams
} from '@repo/core';
```

**Typical Use Cases:**
1. **UI State:** useToggle for modals, useCounter for pagination
2. **Search:** useDebounce for search inputs
3. **Forms:** isValidEmail, isValidPhone validation
4. **Display:** formatCurrency, formatDate, formatNumber
5. **Auth:** getToken, setToken, clearTokens
6. **State Persistence:** zustandSecureStorage for auth stores
7. **UI Colors:** colors.primary, colors.error for theming
8. **API Calls:** objToStringParams for query strings

---

## 7. DEPENDENCIES & COMPATIBILITY

### Runtime Dependencies
| Package | Version | Usage |
|---------|---------|-------|
| moment | ^2.30.1 | Date/time manipulation |
| expo-secure-store | ~15.0.2 | Secure storage (peer) |
| react | * | React hooks (peer) |
| zustand | ^5.0.9 | State management (peer) |

### Compatibility
- **Node.js:** >= 18.x (from root package)
- **React:** >= 18 (recommended)
- **React Native:** 0.81.5+ (from monorepo setup)
- **TypeScript:** 5.3+ (strict mode)

### Build Target
- **ES2020** (modern JavaScript)
- **Module System:** ESNext (handled by bundler)

---

## 8. ARCHITECTURE PATTERNS

### Pure Logic Package
- No UI components (purely logic)
- No platform-specific code
- No DOM or React Native dependencies (only React hooks)
- Reusable across platforms (web, mobile, desktop)

### Export Organization
- Direct exports for convenience
- Namespaced exports for organization
- Tree-shakeable (unused code eliminated by bundlers)

### Error Handling
- Silent failures: Functions return null/false on error
- No exceptions thrown (async operations don't fail)
- Caller responsible for null checks

### Type Safety
- Full TypeScript strict mode
- Generic types for flexible utility functions
- Type exports (ColorName, DateFormat)
- No `any` types in public API

---

## 9. FILE REFERENCE GUIDE

| File | Purpose | Exports |
|------|---------|---------|
| src/index.ts | Main entry point | All re-exports, namespaced modules |
| hooks/useToggle.ts | Boolean toggle | useToggle |
| hooks/useCounter.ts | Counter state | useCounter |
| hooks/useDebounce/index.ts | Debounce hook | useDebounce (default) |
| utils/format.ts | Number/string formatting | formatCurrency, formatNumber, formatPercentage, capitalize, truncate |
| utils/validation.ts | Input validation | isValidEmail, isValidPhone, isEmpty |
| utils/date.ts | Date utilities (30+ functions) | formatDate, formatRelative, formatSmart, date arithmetic, comparisons, DateFormats, moment |
| utils/color.ts | Color generation | generateColor |
| constants/colors.ts | Color palette | colors, ColorName type |
| storage/secureStorage.ts | Secure storage wrapper | secureStorage, zustandSecureStorage, SecureStore |
| storage/tokenStorage.ts | Token management | Token functions, TOKEN_STORAGE_KEYS |
| path/index.ts | Query/path utilities | varToStringParams, arrayToStr, strToArr, objToStringParams |

---

## 10. SUMMARY

### Core Package Strengths
1. **Comprehensive Utilities:** 30+ functions covering common app needs
2. **Type Safe:** Full TypeScript strict mode, generic types
3. **Secure by Default:** Secure storage for sensitive data
4. **Date Expert:** Extensive date/time handling (moment.js)
5. **React Integration:** React hooks with proper memoization
6. **Flexible Exports:** Both flat and namespaced import patterns
7. **Zero Dependencies:** Only moment.js as true dependency

### Common Import Patterns
```typescript
// Authentication
import { getToken, setToken, clearTokens, zustandSecureStorage } from '@repo/core';

// Forms & Validation
import { isValidEmail, isValidPhone, isEmpty } from '@repo/core';

// Display & Formatting
import { formatCurrency, formatDate, formatSmart, colors } from '@repo/core';

// UI State
import { useToggle, useCounter, useDebounce } from '@repo/core';

// API Integration
import { objToStringParams, varToStringParams } from '@repo/core';

// Date Operations
import { formatDate, addTime, isBefore, getAge, DateFormats } from '@repo/core';

// Colors & Theming
import { colors, generateColor, ColorName } from '@repo/core';
```

### Monorepo Integration
- Installed as workspace dependency via `@repo/core`
- Available in `apps/mobile` and other packages
- No circular dependencies
- Pure logic layer (reusable across platforms)

---

**Repository:** git@github.com:The1Studio/rn-core.git  
**Local Path:** /Users/tuha/Clients/1M/rn-template/packages/core  
**Package Name:** @repo/core  
**Version:** 0.0.1
