# Project Configuration & Scripts Exploration Report
**Date:** 2025-12-26 | **Time:** 23:19

## Executive Summary
`rn-template` is a modern **React Native monorepo** using Expo, npm workspaces, TypeScript, and git submodules. The project features a well-organized workspace structure with root-level configuration for linting, formatting, and development tooling.

---

## 1. Root Package.json - Workspace Configuration

**Location:** `/Users/tuha/Clients/1M/rn-template/package.json`

**Key Details:**
- **Type:** ES Module (`"type": "module"`)
- **Workspaces:** npm workspaces with glob patterns:
  - `apps/*` - Contains `mobile` (Expo React Native app)
  - `packages/*` - Contains `core` and `ui` submodules

**Root Scripts:**
| Script | Command | Purpose |
|--------|---------|---------|
| `mobile` | `npm run --workspace=mobile` | Run scripts in mobile workspace |
| `core` | `npm run --workspace=@repo/core` | Run scripts in core package |
| `ui` | `npm run --workspace=@repo/ui` | Run scripts in ui package |
| `lint` | `eslint .` | Lint entire project |
| `lint:fix` | `eslint . --fix` | Fix linting errors automatically |
| `format` | `prettier --write "**/*.{ts,tsx,js,jsx,json,md}"` | Format code with Prettier |
| `format:check` | `prettier --check "**/*.{ts,tsx,js,jsx,json,md}"` | Check formatting without changes |
| `clean:modules` | `rm -rf node_modules apps/mobile/node_modules packages/core/node_modules packages/ui/node_modules` | Clean all node_modules |

**Dev Dependencies:**
- ESLint: `^9.39.2`
- TypeScript ESLint: `^8.50.1`
- React: `19.1.0`
- Prettier: `^3.7.4`
- React ESLint Plugin: `^7.37.5`
- React Hooks ESLint Plugin: `^7.0.1`

**React Override:** React version pinned to `19.1.0` across all workspaces.

---

## 2. ESLint Configuration

**Location:** `/Users/tuha/Clients/1M/rn-template/eslint.config.js`

**Configuration Type:** Flat config (ESLint 9+ format)

**Ignored Patterns:**
- `**/node_modules/**`, `**/dist/**`, `**/build/**`
- `.expo/`, `android/`, `ios/` directories
- `**/*.config.js`, `**/*.config.mjs`
- `coverage/` directories

**Active Plugins:**
- `typescript-eslint`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-config-prettier`

**Key Rules:**
| Rule | Severity | Details |
|------|----------|---------|
| React Hooks | error | Enforces rules-of-hooks strictly |
| React Hooks Deps | warn | Warns on exhaustive-deps violations |
| Unused Variables | warn | Ignores variables starting with `_` |
| Console Logging | warn | Allows `console.warn` and `console.error` |
| React JSX Scope | off | Not needed in React 17+ |
| React PropTypes | off | Using TypeScript for type checking |
| No Explicit Any | warn | Discourages `any` type usage |

---

## 3. Prettier Configuration

**Location:** `/Users/tuha/Clients/1M/rn-template/.prettierrc`

**Formatting Rules:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Key Settings:**
- Single quotes for strings
- 2-space indentation
- 80-character line width
- Trailing commas (ES5 style)
- Always parentheses on arrow functions
- LF line endings (Unix style)

**Ignore File:** `.prettierignore`
- Excludes: `node_modules`, `dist`, `build`, `.expo`, `android`, `ios`, `coverage`
- Excludes lock files: `*.lock`, `yarn.lock`, `package-lock.json`

---

## 4. Git Configuration

**Submodules:** `.gitmodules`

Two git submodules configured:
1. **Core Package** (`packages/core`)
   - URL: `git@github.com:The1Studio/rn-core.git`
   
2. **UI Package** (`packages/ui`)
   - URL: `git@github.com:The1Studio/rn-ui.git`

**Git Ignore:** `.gitignore`
- Excludes: `node_modules/`, `.expo/`, `*.log`
- Excludes: `.DS_Store` (macOS)

---

## 5. Additional Configuration Files

### `.repomixignore`
**Purpose:** Excludes directories from Repomix code analysis:
- Documentation: `docs/`, `plans/`
- Build outputs: `dist/`, `build/`, `coverage/`
- Platform-specific: `ios/`, `android/`
- Development tools: `.claude/`, `.serena/`, `.opencode/`, `.pnpm-store/`
- Version control: `.github/`, `.husky/`
- Cache: `__pycache__/`, `.dart_tool/`, `.idea/`

### `.prettierignore`
Matches Prettier ignore patterns with lock files and distribution directories.

---

## 6. Setup Script

**Location:** `/Users/tuha/Clients/1M/rn-template/scripts/setup.sh`

**Purpose:** Automated project initialization

**Steps:**
1. Initializes and updates git submodules (with fallback to `--remote` if standard init fails)
2. Installs npm dependencies for all workspaces
3. Provides quick-start instructions for running the app

**Usage:**
```bash
./scripts/setup.sh
```

**Provides Guide For:**
- `npm run mobile start` - Start development server
- `npm run mobile ios` - Run on iOS
- `npm run mobile android` - Run on Android
- `npm run mobile web` - Run on web

---

## 7. Project Structure Overview

```
rn-template/
├── apps/
│   └── mobile/              # Expo React Native app (version 1.0.0)
├── packages/
│   ├── core/                # Git submodule: @repo/core
│   └── ui/                  # Git submodule: @repo/ui
├── scripts/
│   └── setup.sh             # Initialization script
├── .claude/                 # Claude.ai configuration
├── .serena/                 # Development tools
├── plans/                   # Project planning documents
├── .prettierrc              # Prettier configuration
├── .prettierignore          # Prettier exclusions
├── .repomixignore           # Repomix exclusions
├── .gitignore               # Git exclusions
├── .gitmodules              # Submodule configuration
├── eslint.config.js         # ESLint flat config
├── package.json             # Root workspace config
├── package-lock.json        # Dependency lock file
├── README.md                # Project documentation
└── CLAUDE.md                # Claude.ai instructions
```

---

## 8. Mobile App Configuration

**Location:** `/Users/tuha/Clients/1M/rn-template/apps/mobile/package.json`

**Available Scripts:**
| Script | Purpose |
|--------|---------|
| `start` | Start Expo development server |
| `ios` | Run on iOS simulator (macOS) |
| `android` | Run on Android emulator |
| `web` | Run on web browser |
| `build:android` | Production Android build via EAS |
| `build:android:preview` | Internal distribution Android build |
| `build:android:dev` | Development Android build |
| `build:android:local` | Local Android build (no cloud) |

**Key Dependencies:**
- **React Native:** 0.81.5
- **React:** 19.1.0
- **Expo:** ~54.0.30 (New Architecture enabled)
- **Routing:** expo-router ~6.0.21
- **State Management:** zustand ^5.0.9
- **Forms:** react-hook-form ^7.69.0
- **Validation:** zod ^4.2.1
- **Data Fetching:** @tanstack/react-query ^5.90.12
- **HTTP Client:** axios ^1.13.2
- **Secure Storage:** expo-secure-store ~15.0.2
- **Animations:** react-native-reanimated ~4.1.1
- **Gestures:** react-native-gesture-handler ~2.28.0
- **SVG:** react-native-svg ^15.15.1
- **Date Picker:** react-native-ui-datepicker ^3.1.2
- **Toast Notifications:** react-native-toast-message ^2.3.3

**Other Config Files:**
- `app.json` - Expo app metadata
- `eas.json` - EAS build profiles
- `metro.config.js` - Metro bundler config (monorepo support)
- `babel.config.js` - Babel transpilation config
- `tsconfig.json` - TypeScript configuration (strict mode)

---

## 9. Build & Development Tools

**ESLint Features:**
- Monorepo-aware flat config
- React Native + React support
- Strict TypeScript checking
- Hook exhaustive-deps warnings
- Prettier integration (no conflicts)

**Prettier Features:**
- Consistent code formatting
- 80-char line width (mobile-friendly)
- ES5 trailing commas
- Single quotes
- LF line endings

**Expo/React Native:**
- New Architecture enabled
- Development client ready
- EAS build integration
- Metro bundler configured for workspaces

---

## 10. Workspace Usage Examples

**Run commands across workspaces:**
```bash
# Run any script in mobile workspace
npm run mobile <script-name>

# Run scripts in @repo/core
npm run core <script-name>

# Run scripts in @repo/ui
npm run ui <script-name>
```

**Common Operations:**
```bash
# Lint entire project
npm run lint
npm run lint:fix

# Format all code
npm run format
npm run format:check

# Clean and reinstall
npm run clean:modules
npm install

# Start mobile app development
npm run mobile start

# Type checking (if available in workspaces)
npm run core typecheck
npm run ui typecheck
```

---

## Summary Table: Key Configuration Points

| Aspect | Configuration | Details |
|--------|---------------|---------|
| **Package Manager** | npm v9+ | Workspaces for monorepo |
| **Linting** | ESLint 9 (flat config) | React + TS + Hooks support |
| **Formatting** | Prettier 3.7.4 | 80 chars, single quotes |
| **Version Control** | Git + submodules | 2 external packages |
| **Platform** | Expo + React Native | New Architecture enabled |
| **Build System** | EAS (Expo) | Cloud + local build support |
| **Type System** | TypeScript 5.9 | Strict mode |
| **React Version** | 19.1.0 | Latest with pinned override |

---

## Notes & Observations

1. **Submodule Strategy:** `@repo/core` and `@repo/ui` are external git repos, suggesting shared utilities across projects.

2. **Development-First:** Setup script includes fallback logic for submodule initialization, indicating real-world deployment complexity.

3. **Monorepo Maturity:** Uses npm workspaces (native), avoiding Yarn or Lerna complexity.

4. **Mobile Focus:** ESLint config explicitly ignores `ios/` and `android/` directories, suggesting platform-native code coexists.

5. **Code Quality:** ESLint + Prettier integration, strict TypeScript, and hook validation suggest mature development practices.

6. **Formatting Standard:** 80-character print width aligns with mobile screen constraints.

7. **Build Infrastructure:** EAS profiles (dev, preview, production) indicate multi-environment deployment strategy.

8. **Storage:** `expo-secure-store` for sensitive data, aligning with best practices for mobile apps.

9. **Form Handling:** react-hook-form + Zod suggests structured form validation and data handling.

10. **State Management:** Zustand with secure storage adapter for persistent state (documented in README).

---

**Report Generated:** 2025-12-26 | **Scout:** scout-external
