# @repo/core - Quick Reference Guide

## File Paths (Absolute)

### Main Files
- `/Users/tuha/Clients/1M/rn-template/packages/core/package.json` - Package config
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/index.ts` - Main entry point

### Hooks
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useToggle.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useCounter.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useDebounce/index.ts`

### Utilities
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/format.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/validation.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/date.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/color.ts`

### Storage
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/storage/secureStorage.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/storage/tokenStorage.ts`

### Constants & Paths
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/constants/colors.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/path/index.ts`

---

## Quick API Reference

### Hooks
```typescript
// Boolean toggle
const [isOpen, toggle] = useToggle(false);

// Counter with increment/decrement/reset
const { count, increment, decrement, reset } = useCounter(0);

// Debounce values with delay
const debouncedSearch = useDebounce(searchTerm, 500);
```

### Formatting
```typescript
formatCurrency(1234.56)           // "$1,234.56"
formatNumber(1234.5678, 2)        // "1,234.57"
formatPercentage(85, 2)           // "85.00%"
capitalize("hello")               // "Hello"
truncate("hello world", 8)        // "hello..."
```

### Validation
```typescript
isValidEmail("user@example.com")  // true
isValidPhone("+1 555 123 4567")   // true
isEmpty("  ")                      // true
```

### Date Operations
```typescript
formatDate(new Date())                              // "DD/MM/YYYY"
formatSmart(new Date())                             // "Today, 2:30 PM"
formatRelative(new Date())                          // "2 hours ago"
addTime(new Date(), 7, 'days')                      // Date + 7 days
getAge('1990-01-15')                                // Age in years
isBetween(date, startDate, endDate)                 // Boolean
getDiff(date1, date2, 'days')                       // Number of days
```

### Secure Storage
```typescript
// Strings
await secureStorage.setString('key', 'value');
const value = await secureStorage.getString('key');

// Objects
await secureStorage.setObject('user', { id: 1 });
const user = await secureStorage.getObject('user');

// Delete
await secureStorage.remove('key');
```

### Token Management
```typescript
// Access token
await setToken(token);
const token = await getToken();
await removeToken();

// Refresh token
await setRefreshToken(refreshToken);
const refreshToken = await getRefreshToken();

// Both
await setTokens(token, refreshToken);
const { token, refreshToken } = await getTokens();
await clearTokens();
```

### Query String Building
```typescript
// From array of key-value pairs
varToStringParams({
  variablesArray: [
    { key: 'id', value: 123 },
    { key: 'name', value: 'John' }
  ]
});
// Returns: "?id=123&name=John"

// From object (alphabetical order)
objToStringParams({ name: 'John', id: 123 });
// Returns: "?id=123&name=John"

// Array/string conversion
arrayToStr([1, 2, 3], ',')  // "1,2,3"
strToArr('a,b,c', ',')      // ["a", "b", "c"]
```

### Colors
```typescript
colors.primary        // "#6366f1"
colors.error          // "#ef4444"
colors.success        // "#22c55e"
generateColor('John') // "rgb(r, g, b)" - consistent
```

---

## Import Patterns

### All Functions at Once
```typescript
import * from '@repo/core';
```

### Specific Functions
```typescript
import { useToggle, formatCurrency, getToken, colors } from '@repo/core';
```

### Namespaced
```typescript
import { Hooks, Utils, Storage, Constants } from '@repo/core';

Hooks.useToggle(false);
Utils.formatCurrency(100);
Storage.secureStorage.getString('token');
Constants.colors.primary;
```

---

## Module Breakdown

| Module | Purpose | Key Exports |
|--------|---------|-------------|
| hooks | React state hooks | useToggle, useCounter, useDebounce |
| utils/format | Number/string formatting | formatCurrency, capitalize, truncate |
| utils/validation | Input validation | isValidEmail, isValidPhone, isEmpty |
| utils/date | Date/time operations | formatDate, getAge, addTime, isBetween |
| utils/color | Color generation | generateColor |
| constants/colors | Color palette | colors object, ColorName type |
| storage | Secure data persistence | secureStorage, zustandSecureStorage |
| storage/token | Token management | getToken, setToken, getRefreshToken |
| path | Query string builders | objToStringParams, varToStringParams |

---

## Configuration

**Package.json:**
- Name: `@repo/core`
- Entry: `./src/index.ts`
- Dependencies: moment (^2.30.1)
- Peer: expo-secure-store, react, zustand

**TypeScript:**
- Target: ES2020
- Strict mode: Yes
- Module resolution: bundler

---

## Key Features

1. **Secure Storage:** Native secure storage (iOS Keychain, Android Encrypted)
2. **Token Management:** Built-in token persistence and retrieval
3. **Date Expert:** 30+ date utility functions with moment.js
4. **Validation:** Email, phone, empty string validation
5. **React Hooks:** useToggle, useCounter, useDebounce
6. **Formatting:** Currency, numbers, percentages, strings
7. **Colors:** 11-color palette + dynamic color generation
8. **Query Strings:** Build query params from objects/arrays

---

## Common Workflows

### Authentication Flow
```typescript
// Login
await setTokens(accessToken, refreshToken);

// Check if authenticated
const { token } = await getTokens();
const isAuth = token !== null;

// Logout
await clearTokens();
```

### Form Validation
```typescript
if (!isValidEmail(email)) showError('Invalid email');
if (!isValidPhone(phone)) showError('Invalid phone');
if (isEmpty(name)) showError('Name required');
```

### Date Display
```typescript
// Smart formatting based on context
const displayDate = formatSmart(date);  // "Today, 2:30 PM"

// Relative time
const timeAgo = formatRelative(date);   // "2 hours ago"

// Custom format
const formatted = formatDate(date, 'DD/MM/YYYY');
```

### Zustand Store with Persistence
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandSecureStorage } from '@repo/core';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isHydrated: false,
      setToken: (token) => set({ token }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => zustandSecureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

---

## Important Limitations

1. **Secure Storage Size:** 2KB max per value
2. **Storage is Async:** Always use await
3. **Email Validation:** Basic format only (doesn't validate domain)
4. **Phone Validation:** International format limitations
5. **Date Functions:** All use Moment.js (check moment docs for advanced usage)

---

## Exports Summary

**Total Exports: 50+**

- **Hooks:** 3
- **Utilities:** 30+
- **Constants:** 1 palette (11 colors) + 1 type
- **Storage:** 5 main + 10 token functions
- **Path/Query:** 4 functions

All exports are available via `@repo/core` package name.

