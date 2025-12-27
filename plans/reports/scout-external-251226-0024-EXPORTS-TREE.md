# @repo/core - Complete Exports Tree

**All 50+ exports organized by category with signatures**

---

## HOOKS (3 hooks)

```
@repo/core
├── useToggle(initialValue?: boolean)
│   ├── Returns: [boolean, () => void]
│   ├── File: src/hooks/useToggle.ts
│   └── Use: Toggle boolean state
│
├── useCounter(initialValue?: number)
│   ├── Returns: {count: number, increment: ()=>void, decrement: ()=>void, reset: ()=>void}
│   ├── File: src/hooks/useCounter.ts
│   └── Use: Counter state with operations
│
└── useDebounce<T>(value: T, delay: number)
    ├── Returns: T
    ├── File: src/hooks/useDebounce/index.ts
    └── Use: Debounce generic values
```

---

## UTILITIES - FORMATTING (5 functions)

```
@repo/core/utils/format
├── formatCurrency(amount: number, currency?: string)
│   ├── Returns: string ("$1,234.56")
│   └── Use: Currency display
│
├── formatNumber(num: number, decimals?: number)
│   ├── Returns: string ("1,234.57")
│   └── Use: Number formatting with decimals
│
├── formatPercentage(value: number, decimals?: number)
│   ├── Returns: string ("85.00%")
│   └── Use: Percentage display
│
├── capitalize(str: string)
│   ├── Returns: string ("Hello")
│   └── Use: Capitalize first letter
│
└── truncate(str: string, maxLength: number)
    ├── Returns: string ("hello...")
    └── Use: Shorten string with ellipsis
```

---

## UTILITIES - VALIDATION (3 functions)

```
@repo/core/utils/validation
├── isValidEmail(email: string)
│   ├── Returns: boolean
│   ├── Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
│   └── Use: Basic email validation
│
├── isValidPhone(phone: string)
│   ├── Returns: boolean
│   ├── Regex: /^\+?[\d\s-]{10,}$/
│   └── Use: Phone number validation
│
└── isEmpty(value: string | null | undefined)
    ├── Returns: boolean
    └── Use: Check empty/null/undefined/whitespace
```

---

## UTILITIES - DATE/TIME (30+ functions)

### Format Functions (5)
```
@repo/core/utils/date

formatDate(date: MomentInput, format?: string)
├── Returns: string
├── Default format: "DD/MM/YYYY"
└── Use: Custom date formatting

formatRelative(date: MomentInput)
├── Returns: string ("2 hours ago", "in 3 days")
└── Use: Relative time display

formatCalendar(date: MomentInput)
├── Returns: string ("Today at 2:30 PM", "Yesterday")
└── Use: Calendar-style formatting

formatDuration(startDate: MomentInput, endDate: MomentInput)
├── Returns: string ("2 hours")
└── Use: Duration between dates

formatSmart(date: MomentInput)
├── Returns: string (context-aware)
│   ├─ Today: "Today, 2:30 PM"
│   ├─ Yesterday: "Yesterday, 2:30 PM"
│   ├─ This year: "15 Jan, 2:30 PM"
│   └─ Other: "15 Jan 2023, 2:30 PM"
└── Use: Smart context-based formatting
```

### Range Functions (6)
```
startOfDay(date: MomentInput) → Date
endOfDay(date: MomentInput) → Date
startOfWeek(date: MomentInput) → Date
endOfWeek(date: MomentInput) → Date
startOfMonth(date: MomentInput) → Date
endOfMonth(date: MomentInput) → Date
```

### Arithmetic Functions (2)
```
addTime(date: MomentInput, amount: number, unit: moment.unitOfTime.DurationConstructor) → Date
subtractTime(date: MomentInput, amount: number, unit: moment.unitOfTime.DurationConstructor) → Date
```

### Comparison Functions (9)
```
isBefore(date: MomentInput, compareDate: MomentInput) → boolean
isAfter(date: MomentInput, compareDate: MomentInput) → boolean
isBetween(date: MomentInput, startDate: MomentInput, endDate: MomentInput) → boolean
isToday(date: MomentInput) → boolean
isYesterday(date: MomentInput) → boolean
isTomorrow(date: MomentInput) → boolean
isPast(date: MomentInput) → boolean
isFuture(date: MomentInput) → boolean
isValidDate(date: MomentInput) → boolean
```

### Utility Functions (6)
```
getDiff(date1: MomentInput, date2: MomentInput, unit?: moment.unitOfTime.Diff) → number
getAge(birthDate: MomentInput) → number
parseDate(dateString: string, format?: string) → Date | null
now() → Date
getMoment(date?: MomentInput) → Moment
moment → moment library (re-export for advanced usage)
```

### Constants (1)
```
DateFormats: {
  DATE_SHORT: 'DD/MM/YYYY',
  DATE_MEDIUM: 'DD MMM YYYY',
  DATE_LONG: 'DD MMMM YYYY',
  DATE_US: 'MM/DD/YYYY',
  DATE_ISO: 'YYYY-MM-DD',
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  TIME_WITH_SECONDS: 'HH:mm:ss',
  DATETIME_SHORT: 'DD/MM/YYYY HH:mm',
  DATETIME_MEDIUM: 'DD MMM YYYY, HH:mm',
  DATETIME_LONG: 'DD MMMM YYYY, HH:mm:ss',
  DATETIME_12H: 'DD/MM/YYYY hh:mm A',
  MONTH_YEAR: 'MMMM YYYY',
  DAY_MONTH: 'DD MMM',
  WEEKDAY: 'dddd',
  WEEKDAY_SHORT: 'ddd'
}
```

---

## UTILITIES - COLOR (1 + 1 generator)

```
@repo/core/utils/color

generateColor(text: string)
├── Returns: string ("rgb(r, g, b)")
├── Input: text string (default: 'aicactus')
└── Use: Consistent hash-based color generation
```

---

## CONSTANTS - COLORS (1 palette + 1 type)

```
@repo/core/constants/colors

colors: {
  primary: '#6366f1',          // Indigo
  secondary: '#8b5cf6',        // Violet
  success: '#22c55e',          // Green
  warning: '#f59e0b',          // Amber
  error: '#ef4444',            // Red
  background: '#f8fafc',       // Slate (light)
  surface: '#ffffff',          // White
  text: '#1e293b',             // Slate (dark)
  textSecondary: '#64748b',    // Slate (medium)
  border: '#e2e8f0'            // Slate (light)
}

type ColorName = 
  | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  | 'background' | 'surface' | 'text' | 'textSecondary' | 'border'
```

---

## STORAGE - SECURE STORAGE (5 methods + 1 adapter + 1 re-export)

```
@repo/core/storage/secureStorage

// General secure storage API
secureStorage: {
  getString(key: string) → Promise<string | null>
  setString(key: string, value: string) → Promise<void>
  getObject<T>(key: string) → Promise<T | null>
  setObject<T>(key: string, value: T) → Promise<void>
  remove(key: string) → Promise<void>
}

// Zustand persist adapter
zustandSecureStorage: StateStorage {
  getItem(name: string) → Promise<string | null>
  setItem(name: string, value: string) → Promise<void>
  removeItem(name: string) → Promise<void>
}

// Re-export for direct access
SecureStore // expo-secure-store library
```

---

## STORAGE - TOKEN MANAGEMENT (10 functions + 1 constant)

```
@repo/core/storage/tokenStorage

// Constants
TOKEN_STORAGE_KEYS: {
  ACCESS_TOKEN: 'ACCESS_TOKEN'
  REFRESH_TOKEN: 'REFRESH_TOKEN'
}

// Access token functions
getToken() → Promise<string | null>
setToken(token: string) → Promise<void>
removeToken() → Promise<void>

// Refresh token functions
getRefreshToken() → Promise<string | null>
setRefreshToken(refreshToken: string) → Promise<void>
removeRefreshToken() → Promise<void>

// Batch operations
setTokens(token: string, refreshToken: string) → Promise<void>
clearTokens() → Promise<void>
getTokens() → Promise<{token: string | null, refreshToken: string | null}>
```

---

## PATH - QUERY STRING BUILDERS (4 functions)

```
@repo/core/path

varToStringParams(data: {variablesArray: Array<{key: string, value: string | undefined | number}>})
├── Returns: string ("?key1=val1&key2=val2")
├── Filters: undefined/null values excluded
├── Format: Single "?key=val", Multiple "?key1=val1&key2=val2"
└── Use: Convert array of key-value pairs to query string

objToStringParams(queryObj: Record<string, string | undefined | number>)
├── Returns: string ("?key1=val1&key2=val2")
├── Order: Alphabetical (stable)
├── Filters: undefined/null values excluded
└── Use: Convert object to query string

arrayToStr(arr: Array<string | number>, separator?: string)
├── Returns: string ("val1,val2,val3")
├── Default separator: ','
└── Use: Join array elements with separator

strToArr(str: string, separator?: string)
├── Returns: string[]  (["val1", "val2", "val3"])
├── Default separator: ','
├── Behavior: Removes spaces, filters empty elements
└── Use: Split string and clean up
```

---

## EXPORT PATTERNS

### Pattern 1: Direct/Flat Imports
```typescript
import {
  useToggle,
  useCounter,
  useDebounce,
  formatCurrency,
  formatDate,
  isValidEmail,
  colors,
  secureStorage,
  getToken,
  setTokens,
  objToStringParams
} from '@repo/core';
```

### Pattern 2: Namespaced Imports
```typescript
import { Hooks, Utils, Constants, Storage } from '@repo/core';

Hooks.useToggle(false);
Utils.formatCurrency(100);
Constants.colors.primary;
Storage.secureStorage.getString('key');
Storage.getToken();
```

### Pattern 3: Wildcard Import
```typescript
import * as Core from '@repo/core';

Core.useToggle(false);
Core.formatCurrency(100);
Core.colors.primary;
```

---

## EXPORT COUNT BY CATEGORY

| Category | Count | Type | File |
|----------|-------|------|------|
| Hooks | 3 | Functions | hooks/*.ts |
| Format | 5 | Functions | utils/format.ts |
| Validation | 3 | Functions | utils/validation.ts |
| Date/Time | 30+ | Functions | utils/date.ts |
| Date Formats | 14 | Constants | utils/date.ts |
| Color Gen | 1 | Function | utils/color.ts |
| Color Palette | 11 | Constants | constants/colors.ts |
| ColorName | 1 | Type | constants/colors.ts |
| Secure Storage | 5 | Methods | storage/secureStorage.ts |
| Zustand Adapter | 3 | Methods | storage/secureStorage.ts |
| SecureStore | 1 | Re-export | storage/secureStorage.ts |
| Token Functions | 10 | Functions | storage/tokenStorage.ts |
| Token Keys | 2 | Constants | storage/tokenStorage.ts |
| Query Builders | 4 | Functions | path/index.ts |
| **TOTAL** | **50+** | **Mixed** | **All modules** |

---

## MODULE HIERARCHY

```
@repo/core (src/index.ts)
│
├── Hooks Module (src/hooks/index.ts)
│   ├── useToggle
│   ├── useCounter
│   └── useDebounce
│
├── Utils Module (src/utils/index.ts)
│   ├── Format Sub-module
│   │   ├── formatCurrency
│   │   ├── formatNumber
│   │   ├── formatPercentage
│   │   ├── capitalize
│   │   └── truncate
│   ├── Validation Sub-module
│   │   ├── isValidEmail
│   │   ├── isValidPhone
│   │   └── isEmpty
│   ├── Date/Time Sub-module (30+ functions)
│   │   ├── Format functions (5)
│   │   ├── Range functions (6)
│   │   ├── Arithmetic functions (2)
│   │   ├── Comparison functions (9)
│   │   ├── Utility functions (6)
│   │   ├── DateFormats constant
│   │   └── moment export
│   └── Color Sub-module
│       └── generateColor
│
├── Constants Module (src/constants/index.ts)
│   └── Colors Sub-module
│       ├── colors (11 color values)
│       └── ColorName (type)
│
├── Storage Module (src/storage/index.ts)
│   ├── Secure Storage Sub-module
│   │   ├── secureStorage (5 methods)
│   │   ├── zustandSecureStorage (adapter)
│   │   └── SecureStore (re-export)
│   └── Token Management Sub-module
│       ├── TOKEN_STORAGE_KEYS (constant)
│       └── Token functions (10)
│
└── Path Module (src/path/index.ts)
    ├── varToStringParams
    ├── objToStringParams
    ├── arrayToStr
    └── strToArr
```

---

## DEPENDENCY RESOLUTION

```
Sync Functions (No Dependencies, Instant Execution)
├── Formatting: formatCurrency, formatNumber, formatPercentage, capitalize, truncate
├── Validation: isValidEmail, isValidPhone, isEmpty
├── Colors: generateColor
├── Date (using moment): formatDate, formatRelative, all comparisons, arithmetic
└── Path/Query: varToStringParams, objToStringParams, arrayToStr, strToArr

Async Functions (Promise-based, Requires Await)
├── Secure Storage: getString, setString, getObject, setObject, remove
├── Token Management: getToken, setToken, removeToken, etc.
└── Zustand Adapter: getItem, setItem, removeItem

React Hooks (Component-level, Instance-specific)
├── useToggle (useState + useCallback)
├── useCounter (useState + useCallback)
└── useDebounce (useState + useEffect)
```

---

## IMPORT EXAMPLES

### By Functionality

**Authentication**
```typescript
import { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens, zustandSecureStorage } from '@repo/core';
```

**Form Validation**
```typescript
import { isValidEmail, isValidPhone, isEmpty } from '@repo/core';
```

**Date/Time Display**
```typescript
import { formatDate, formatSmart, formatRelative, formatDuration, DateFormats } from '@repo/core';
```

**UI State**
```typescript
import { useToggle, useCounter, useDebounce } from '@repo/core';
```

**Formatting & Display**
```typescript
import { formatCurrency, formatNumber, capitalize, truncate, colors } from '@repo/core';
```

**API Integration**
```typescript
import { objToStringParams, varToStringParams } from '@repo/core';
```

**Secure Data**
```typescript
import { secureStorage } from '@repo/core';
```

**Color Utilities**
```typescript
import { colors, generateColor, ColorName } from '@repo/core';
```

---

**Last Updated:** 2025-12-26  
**Total Exports Documented:** 50+  
**Coverage:** 100% of public API
