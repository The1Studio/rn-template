# @repo/core - Architecture & Dependency Map

## Package Architecture

```
@repo/core (git@github.com:The1Studio/rn-core.git)
│
├── Peer Dependencies
│   ├── react (hooks support)
│   ├── expo-secure-store (secure storage)
│   └── zustand (persist adapter)
│
└── Runtime Dependencies
    └── moment (^2.30.1) - Date/time operations
```

---

## Module Dependency Graph

```
src/index.ts (Main Entry Point)
├── exports from ./hooks
│   ├── useToggle (useState, useCallback)
│   ├── useCounter (useState, useCallback)
│   └── useDebounce (useState, useEffect)
│
├── exports from ./utils
│   ├── format.ts (Intl.NumberFormat)
│   ├── validation.ts (Regex patterns)
│   ├── date.ts (moment library)
│   └── color.ts (Hash algorithm)
│
├── exports from ./constants
│   └── colors.ts (Color palette)
│
├── exports from ./storage
│   ├── secureStorage.ts (expo-secure-store)
│   └── tokenStorage.ts (uses secureStorage)
│
└── exports from ./path
    └── Query string builders (string manipulation)
```

---

## Module-to-Module Dependencies

```
secureStorage.ts
  ├── Depends on: expo-secure-store (native)
  └── Used by: tokenStorage.ts, zustandSecureStorage adapter

tokenStorage.ts
  └── Depends on: secureStorage.ts

date.ts
  └── Depends on: moment library

All other modules
  └── No internal dependencies (standalone utilities)
```

---

## Export Structure (Two Styles)

### Style 1: Flat Direct Imports
```
@repo/core
├── useToggle
├── useCounter
├── useDebounce
├── formatCurrency
├── formatNumber
├── formatPercentage
├── capitalize
├── truncate
├── isValidEmail
├── isValidPhone
├── isEmpty
├── formatDate
├── formatRelative
├── formatCalendar
├── formatDuration
├── formatSmart
├── startOfDay / endOfDay
├── startOfWeek / endOfWeek
├── startOfMonth / endOfMonth
├── addTime / subtractTime
├── isBefore / isAfter / isBetween
├── isToday / isYesterday / isTomorrow
├── isPast / isFuture
├── isValidDate
├── getDiff
├── getAge
├── parseDate
├── now
├── getMoment
├── moment (library export)
├── DateFormats (constants)
├── generateColor
├── colors (11-color palette)
├── ColorName (type)
├── secureStorage (API object)
├── zustandSecureStorage (adapter)
├── SecureStore (direct access)
├── TOKEN_STORAGE_KEYS (constants)
├── getToken
├── setToken
├── removeToken
├── getRefreshToken
├── setRefreshToken
├── removeRefreshToken
├── setTokens
├── clearTokens
├── getTokens
├── varToStringParams
├── arrayToStr
├── strToArr
└── objToStringParams
```

### Style 2: Namespaced Imports
```
@repo/core
├── Hooks.*
│   ├── useToggle
│   ├── useCounter
│   └── useDebounce
├── Utils.*
│   ├── formatCurrency
│   ├── formatNumber
│   ├── formatPercentage
│   ├── capitalize
│   ├── truncate
│   ├── isValidEmail
│   ├── isValidPhone
│   ├── isEmpty
│   ├── formatDate
│   ├── formatRelative
│   ├── formatCalendar
│   ├── formatDuration
│   ├── formatSmart
│   ├── startOfDay
│   ├── endOfDay
│   ├── startOfWeek
│   ├── endOfWeek
│   ├── startOfMonth
│   ├── endOfMonth
│   ├── addTime
│   ├── subtractTime
│   ├── isBefore
│   ├── isAfter
│   ├── isBetween
│   ├── isToday
│   ├── isYesterday
│   ├── isTomorrow
│   ├── isPast
│   ├── isFuture
│   ├── isValidDate
│   ├── getDiff
│   ├── getAge
│   ├── parseDate
│   ├── now
│   ├── getMoment
│   ├── moment
│   ├── DateFormats
│   └── generateColor
├── Constants.*
│   ├── colors
│   └── ColorName
└── Storage.*
    ├── secureStorage
    ├── zustandSecureStorage
    ├── SecureStore
    ├── TOKEN_STORAGE_KEYS
    ├── getToken
    ├── setToken
    ├── removeToken
    ├── getRefreshToken
    ├── setRefreshToken
    ├── removeRefreshToken
    ├── setTokens
    ├── clearTokens
    └── getTokens
```

(Note: path utilities available as direct imports only, not namespaced)

---

## Functional Module Organization

### 1. STATE MANAGEMENT (Hooks)
```
useToggle    → [boolean, () => void]
              → Toggle boolean state

useCounter   → { count, increment, decrement, reset }
              → Manage numeric state with operations

useDebounce<T> → T (debounced value)
              → Generic debounce utility
```

### 2. DATA FORMATTING
```
formatCurrency    → String (monetary display)
formatNumber      → String (with decimals)
formatPercentage  → String (percentage)
capitalize        → String (capitalized)
truncate          → String (shortened with ellipsis)
```

### 3. INPUT VALIDATION
```
isValidEmail      → Boolean (basic format check)
isValidPhone      → Boolean (10+ chars, +digits/-/space)
isEmpty           → Boolean (null/undefined/whitespace)
```

### 4. DATE/TIME OPERATIONS (30+ functions)
```
Display Functions:
  formatDate      → String (custom format)
  formatRelative  → String (relative time: "2 hours ago")
  formatCalendar  → String (calendar: "Today at 2:30 PM")
  formatDuration  → String (duration: "2 hours")
  formatSmart     → String (context-aware)

Range Functions:
  startOfDay/endOfDay
  startOfWeek/endOfWeek
  startOfMonth/endOfMonth

Arithmetic:
  addTime(date, amount, unit)
  subtractTime(date, amount, unit)

Comparison:
  isBefore/isAfter/isBetween
  isToday/isYesterday/isTomorrow
  isPast/isFuture
  isValidDate

Utilities:
  getDiff(date1, date2, unit)
  getAge(birthDate)
  parseDate(string, format)
  now()
  getMoment()
  moment (library export)

Constants:
  DateFormats (14 predefined formats)
```

### 5. SECURE STORAGE
```
String Operations:
  getString(key)        → Promise<string | null>
  setString(key, value) → Promise<void>

Object Operations:
  getObject<T>(key)      → Promise<T | null>
  setObject<T>(key, obj) → Promise<void>

Delete:
  remove(key)            → Promise<void>

Re-exports:
  SecureStore (expo-secure-store direct access)
```

### 6. TOKEN MANAGEMENT
```
Access Token:
  getToken()        → Promise<string | null>
  setToken(token)   → Promise<void>
  removeToken()     → Promise<void>

Refresh Token:
  getRefreshToken()          → Promise<string | null>
  setRefreshToken(token)     → Promise<void>
  removeRefreshToken()       → Promise<void>

Batch Operations:
  setTokens(token, refresh)  → Promise<void>
  clearTokens()              → Promise<void>
  getTokens()                → Promise<{token, refreshToken}>

Constants:
  TOKEN_STORAGE_KEYS: {ACCESS_TOKEN, REFRESH_TOKEN}
```

### 7. ZUSTAND PERSISTENCE
```
zustandSecureStorage: StateStorage
  ├── getItem(name)            → Promise<string | null>
  ├── setItem(name, value)     → Promise<void>
  └── removeItem(name)         → Promise<void>

Use Case:
  → Persist Zustand stores to secure storage
  → Requires async hydration handling
```

### 8. QUERY STRING BUILDING
```
varToStringParams    → "?key1=val1&key2=val2"
                       (from array of {key, value})

objToStringParams    → "?key1=val1&key2=val2"
                       (from object, alphabetical order)

arrayToStr           → "val1,val2,val3"
                       (join array with separator)

strToArr             → ["val1", "val2", "val3"]
                       (split string, remove spaces)
```

### 9. COLOR UTILITIES
```
colors              → 11-color palette object
ColorName           → Type (union of all color keys)
generateColor(text) → "rgb(r, g, b)"
                       (consistent hash-based generation)
```

---

## Data Flow Examples

### Authentication Flow
```
App Component
  ├─ On Login: setTokens(accessToken, refreshToken)
  │    └─ Stored in secure storage (expo-secure-store)
  │
  ├─ Check Auth: getTokens()
  │    └─ Retrieved from secure storage
  │
  ├─ On Logout: clearTokens()
  │    └─ Deleted from secure storage
  │
  └─ Zustand Store:
       └─ persist middleware with zustandSecureStorage adapter
            └─ Sync state to secure storage on changes
```

### Form Validation Flow
```
User Input
  ├─ Email: isValidEmail(email) → Boolean
  ├─ Phone: isValidPhone(phone) → Boolean
  └─ Name: isEmpty(name) → Boolean
    → Display error or enable submit
```

### API Request Flow
```
API Builder
  ├─ Query Params: objToStringParams({id: 123, name: 'John'})
  │    └─ Returns: "?id=123&name=John"
  │
  ├─ Path Building: varToStringParams(array)
  │    └─ Returns: "?param1=val1&param2=val2"
  │
  └─ Request: fetch(url + queryString)
```

### Date Display Flow
```
Raw Date
  ├─ Smart Format: formatSmart(date)
  │    ├─ Today → "Today, 2:30 PM"
  │    ├─ Yesterday → "Yesterday, 2:30 PM"
  │    └─ Other → "15 Jan 2023, 2:30 PM"
  │
  ├─ Relative: formatRelative(date)
  │    └─ "2 hours ago", "in 3 days"
  │
  ├─ Custom: formatDate(date, 'DD/MM/YYYY')
  │    └─ "25/12/2023"
  │
  └─ Display to User
```

---

## Type Safety Architecture

```
TypeScript Strict Mode: YES
│
├── Generic Types
│   ├── useDebounce<T>
│   ├── getObject<T>
│   ├── setObject<T>
│   └── Flexible type support
│
├── Union Types
│   ├── DateFormat (14 predefined + custom)
│   ├── ColorName (11 colors)
│   └── moment.unitOfTime.*
│
├── Object Types (from constants)
│   ├── DateFormats object
│   ├── colors object
│   ├── TOKEN_STORAGE_KEYS object
│   └── useCounterReturn interface
│
└── Async Types
    ├── Promise<string | null>
    ├── Promise<T | null>
    ├── Promise<void>
    └── Promise<{token, refreshToken}>
```

---

## Performance Characteristics

```
Sync Functions (instant)
├── formatCurrency, formatNumber
├── capitalize, truncate
├── isValidEmail, isValidPhone, isEmpty
├── generateColor
├── formatDate, formatRelative (moment operations)
├── Date arithmetic (add, subtract, comparisons)
├── arrayToStr, strToArr
└── Query string builders

Async Functions (requires await)
├── secureStorage operations (native bridge)
├── Token management functions (use secureStorage)
├── Zustand persist operations (I/O bound)

Memoized (useCallback)
├── toggle function (useToggle)
├── increment, decrement, reset (useCounter)

Lazy Functions (computed)
├── useDebounce (delays value updates)
└── formatDuration (calculates diff)
```

---

## File Size Overview

```
Core Package (~50KB distributed code)
├── hooks/ (~2KB)
│   ├── useToggle.ts (~200 bytes)
│   ├── useCounter.ts (~400 bytes)
│   └── useDebounce/index.ts (~600 bytes)
│
├── utils/ (~15KB)
│   ├── format.ts (~1KB)
│   ├── validation.ts (~500 bytes)
│   ├── date.ts (~12KB - comprehensive moment wrapper)
│   └── color.ts (~300 bytes)
│
├── constants/ (~500 bytes)
│   └── colors.ts
│
├── storage/ (~2KB)
│   ├── secureStorage.ts (~1.2KB)
│   └── tokenStorage.ts (~1.2KB)
│
└── path/ (~1.5KB)
    └── index.ts
```

---

## Monorepo Integration

```
Root Project
│
├── apps/
│   └── mobile/
│       ├── package.json (dependency: "@repo/core": "*")
│       ├── App.tsx (imports from @repo/core)
│       └── ... (screens, components using core utilities)
│
├── packages/
│   ├── core/ ← Subject of exploration (git submodule)
│   │   └── src/index.ts (main entry)
│   │
│   └── ui/ ← Can also import from @repo/core
│       └── ... (UI components may use @repo/core utilities)
│
└── .gitmodules
    └── [submodule "packages/core"]
        └── url = git@github.com:The1Studio/rn-core.git
```

---

## Circular Dependency Analysis

```
No circular dependencies detected.

Dependency Chain:
  tokenStorage.ts → secureStorage.ts → expo-secure-store ✓
  All utilities → No internal dependencies ✓
  Hooks → React (external) ✓
  Everything → src/index.ts (re-exports) ✓

Safe to use as shared library in monorepo.
```

---

## Security Architecture

```
Secure Storage Wrapper
│
├── Input: Any serializable data
├── Serialization: JSON.stringify (for objects)
├── Transportation: String to native bridge
├── Storage: 
│   ├── iOS: Keychain (encrypted)
│   ├── Android: EncryptedSharedPreferences
│   └── Web: Not recommended (falls back to localStorage)
├── Retrieval: Native bridge → String → JSON.parse
└── Output: Deserialized data or null

Token Flow:
  setToken(token) → secureStorage.setString() → Keychain/EncryptedSharedPreferences
  getToken() → Read from Keychain/EncryptedSharedPreferences → secureStorage.getString()
```

---

## Export Efficiency

```
Tree-Shaking Support: YES (ES modules)

Unused Code Elimination:
- If useToggle not used → code eliminated
- If date utilities not used → entire date.ts removed
- If storage not used → entire storage module removed

Bundler: Metro (React Native)
- Follows ESNext module resolution
- Applies tree-shaking to unused exports

Result: Small bundle impact for utilized functions only
```

