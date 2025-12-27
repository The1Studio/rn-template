# @repo/core Package Exploration - Complete Documentation Index

**Exploration Date:** 2025-12-26  
**Package:** @repo/core (git@github.com:The1Studio/rn-core.git)  
**Local Path:** /Users/tuha/Clients/1M/rn-template/packages/core  
**Total Documentation:** 1,706 lines across 3 reports  

---

## Reports Overview

### 1. Core Package Exploration Report (864 lines)
**File:** `/Users/tuha/Clients/1M/rn-template/plans/reports/scout-external-251226-0024-core-package-exploration.md`

Comprehensive documentation of the complete @repo/core package.

**Contains:**
- Structure & organization (directory layout, file overview)
- Package configuration (package.json, TypeScript setup)
- Complete API reference for all 50+ exports
- Implementation details (secure storage, Zustand patterns, validation)
- Usage in monorepo
- Dependencies & compatibility
- Architecture patterns
- File reference guide
- Summary & common import patterns

**Best for:** Understanding what the package provides and how to use each exported function/hook.

---

### 2. Quick Reference Guide (282 lines)
**File:** `/Users/tuha/Clients/1M/rn-template/plans/reports/scout-external-251226-0024-core-quick-reference.md`

Developer-friendly quick lookup guide.

**Contains:**
- File paths (absolute) for all modules
- API quick reference (condensed examples)
- Import patterns (direct, namespaced)
- Module breakdown table
- Configuration summary
- Key features list
- Common workflows (auth, forms, dates, Zustand)
- Important limitations
- Exports summary

**Best for:** Quick lookups while coding, copy-paste examples, remembering function signatures.

---

### 3. Architecture & Dependency Map (560 lines)
**File:** `/Users/tuha/Clients/1M/rn-template/plans/reports/scout-external-251226-0024-core-architecture.md`

Technical architecture and dependency documentation.

**Contains:**
- Package architecture diagram
- Module dependency graph
- Export structure (flat & namespaced)
- Functional module organization (8 functional areas)
- Data flow examples (auth, validation, API, dates)
- Type safety architecture
- Performance characteristics
- File size overview
- Monorepo integration
- Circular dependency analysis
- Security architecture
- Export efficiency & tree-shaking

**Best for:** Understanding code structure, dependency relationships, performance implications, integration patterns.

---

## Quick Navigation

### By Use Case

**Authentication & Token Management**
- Quick Ref: "Authentication Flow" section
- Arch Doc: "Authentication Flow" data flow diagram
- Main Doc: Section 3.4 "Token Storage" & 3.4 "Token Management"

**Date & Time Operations**
- Quick Ref: "Date Operations" code examples
- Main Doc: Section 3.2 "utils/date.ts" (30+ functions detailed)
- Arch Doc: "Date/Time Operations" functional area, "Date Display Flow"

**Form Validation**
- Quick Ref: "Validation" code examples
- Main Doc: Section 3.2 "utils/validation.ts"
- Arch Doc: "Form Validation Flow" diagram

**Secure Storage**
- Quick Ref: "Secure Storage" code examples
- Main Doc: Section 3.4 "Secure Storage"
- Arch Doc: "Security Architecture" section

**React Hooks**
- Quick Ref: "Hooks" code examples
- Main Doc: Section 3.1 "Hooks" (3 hooks detailed)
- Arch Doc: "Functional Module Organization" - "State Management"

**Query String Building**
- Quick Ref: "Query String Building" code examples
- Main Doc: Section 3.5 "Path utilities"
- Arch Doc: "API Request Flow" data flow diagram

**Colors & Theming**
- Quick Ref: "Colors" code examples
- Main Doc: Section 3.3 "Constants - colors.ts"
- Arch Doc: "Color Utilities" functional area

**Zustand State Persistence**
- Quick Ref: "Zustand Store with Persistence" workflow
- Main Doc: Section 5 "Zustand Persistence Pattern"
- Arch Doc: "Zustand Persistence" functional area

---

## File Paths (All Source Files)

### Main Entry
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/index.ts`

### Hooks (3 files)
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useToggle.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useCounter.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/hooks/useDebounce/index.ts`

### Utilities (4 files + 1 index)
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/format.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/validation.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/date.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/color.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/utils/index.ts`

### Constants (1 file + 1 index)
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/constants/colors.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/constants/index.ts`

### Storage (2 files + 1 index)
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/storage/secureStorage.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/storage/tokenStorage.ts`
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/storage/index.ts`

### Path/Query (1 file)
- `/Users/tuha/Clients/1M/rn-template/packages/core/src/path/index.ts`

### Configuration (2 files)
- `/Users/tuha/Clients/1M/rn-template/packages/core/package.json`
- `/Users/tuha/Clients/1M/rn-template/packages/core/tsconfig.json`

---

## API Summary

### Hooks (3 + 1 utility)
1. **useToggle(initialValue?)** → [boolean, () => void]
2. **useCounter(initialValue?)** → { count, increment, decrement, reset }
3. **useDebounce<T>(value, delay)** → T
4. Query string utilities in path module

### Formatting (5 functions)
1. **formatCurrency(amount, currency?)** → string
2. **formatNumber(num, decimals?)** → string
3. **formatPercentage(value, decimals?)** → string
4. **capitalize(str)** → string
5. **truncate(str, maxLength)** → string

### Validation (3 functions)
1. **isValidEmail(email)** → boolean
2. **isValidPhone(phone)** → boolean
3. **isEmpty(value)** → boolean

### Date/Time (30+ functions)
- Format: formatDate, formatRelative, formatCalendar, formatDuration, formatSmart
- Range: startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth
- Arithmetic: addTime, subtractTime
- Comparison: isBefore, isAfter, isBetween, isToday, isYesterday, isTomorrow, isPast, isFuture, isValidDate
- Utility: getDiff, getAge, parseDate, now, getMoment
- Constants: DateFormats (14 formats), moment library

### Color (2 + generation)
1. **colors** → 11-color palette object
2. **ColorName** → type (color keys union)
3. **generateColor(text)** → "rgb(r, g, b)" string

### Secure Storage (5 methods)
1. **getString(key)** → Promise<string | null>
2. **setString(key, value)** → Promise<void>
3. **getObject<T>(key)** → Promise<T | null>
4. **setObject<T>(key, value)** → Promise<void>
5. **remove(key)** → Promise<void>

### Token Management (10 functions)
- getToken, setToken, removeToken
- getRefreshToken, setRefreshToken, removeRefreshToken
- setTokens, clearTokens, getTokens
- TOKEN_STORAGE_KEYS constant

### Zustand Persistence (1 adapter)
- **zustandSecureStorage** → StateStorage interface implementation

### Query String (4 functions)
1. **varToStringParams(data)** → "?key=val&key2=val2"
2. **objToStringParams(obj)** → "?key=val&key2=val2"
3. **arrayToStr(arr, sep?)** → "val,val2"
4. **strToArr(str, sep?)** → ["val", "val2"]

---

## Key Features

1. **Comprehensive Utilities:** 50+ exports covering common app needs
2. **Type Safety:** Full TypeScript strict mode
3. **Secure by Default:** Native secure storage (iOS Keychain, Android Encrypted)
4. **Date Expert:** 30+ moment.js-based utilities
5. **React Integration:** useToggle, useCounter, useDebounce hooks
6. **Flexible Exports:** Flat or namespaced import patterns
7. **Minimal Dependencies:** Only moment.js as direct dependency
8. **Tree-Shakeable:** Unused code eliminated by bundlers

---

## Configuration

**Package Name:** @repo/core  
**Version:** 0.0.1  
**Entry Point:** ./src/index.ts  
**Repository:** git@github.com:The1Studio/rn-core.git  

**Dependencies:**
- moment ^2.30.1 (date/time operations)

**Peer Dependencies:**
- react (hooks support)
- expo-secure-store (secure storage)
- zustand (persist adapter)

**Build Target:** ES2020  
**Module System:** ESNext  
**TypeScript:** Strict mode enabled  

---

## Common Patterns

### Authentication Flow
```typescript
// Login
await setTokens(accessToken, refreshToken);

// Check auth
const { token } = await getTokens();

// Logout
await clearTokens();
```

### Form Validation
```typescript
if (!isValidEmail(email)) { /* error */ }
if (!isValidPhone(phone)) { /* error */ }
if (isEmpty(name)) { /* error */ }
```

### Date Display
```typescript
const displayDate = formatSmart(date);      // Context-aware
const timeAgo = formatRelative(date);       // Relative time
const formatted = formatDate(date, 'DD/MM/YYYY');  // Custom
```

### Query String Building
```typescript
const params = objToStringParams({ id: 123, name: 'John' });
const url = `https://api.example.com${params}`;
```

### Zustand Persistence
```typescript
const store = create(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => zustandSecureStorage),
    }
  )
);
```

---

## Documentation Statistics

| Report | Lines | Size | Focus |
|--------|-------|------|-------|
| Package Exploration | 864 | 24K | Comprehensive API reference |
| Quick Reference | 282 | 7.6K | Developer quick lookup |
| Architecture & Dependencies | 560 | 14K | System design & integration |
| **Total** | **1,706** | **45.6K** | **Complete documentation** |

---

## How to Use This Documentation

1. **First Time:** Read "Core Package Exploration" section 1-3 for overview
2. **Quick Lookup:** Use "Quick Reference Guide" while coding
3. **Understanding Design:** Read "Architecture & Dependency Map" for system understanding
4. **Specific API:** Jump to function name in "Core Package Exploration" section 3
5. **Integration:** Check "Common Workflows" section in Quick Reference
6. **Advanced Usage:** See implementation details in main exploration report section 5

---

## Key Insights

### Strengths
- Comprehensive date/time handling (30+ functions)
- Secure by default (native storage without dev build)
- Type safe with full TypeScript strict mode
- Clean separation of concerns (hooks, utils, storage, constants, path)
- Flexible import patterns (flat or namespaced)

### Considerations
- Secure storage limited to 2KB per value (use AsyncStorage for larger data)
- All storage operations are async (requires await)
- Email validation is basic format only (not domain verification)
- Moment.js is a large library (consider future migration to Day.js if needed)

### Performance
- All formatting/validation/calculation functions are synchronous (instant)
- Storage and token operations are async (I/O bound)
- React hooks use useCallback for optimal performance
- Tree-shaking support for minimal bundle impact

---

**Created:** 2025-12-26 23:26 UTC  
**For:** Monorepo architecture exploration  
**Repository:** git@github.com:The1Studio/rn-core.git  
