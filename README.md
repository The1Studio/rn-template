# rn-template

A modern React Native monorepo template using Expo, npm workspaces, and TypeScript.

## Tech Stack

- **React Native** 0.81.5
- **React** 19.1.0
- **Expo** 54.0.30 (New Architecture enabled)
- **TypeScript** 5.9.2 (strict mode)
- **npm workspaces** for monorepo management

## Project Structure

```
rn-template/
├── apps/
│   └── mobile/          # React Native Expo app
├── packages/
│   ├── core/            # Shared utilities and hooks (@repo/core)
│   └── ui/              # Shared UI components (@repo/ui)
├── package.json         # Root workspace configuration
└── README.md
```

## Quick Start

```bash
# Clone with submodules
git clone --recurse-submodules <repository-url>
cd rn-template

# Run setup script (handles submodules + npm install)
./scripts/setup.sh

# Run the app
npm run mobile start
```

Or manually:

```bash
git clone --recurse-submodules <repository-url>
cd rn-template
npm install
npm run mobile start
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Watchman** (recommended for macOS)
- **Xcode** (for iOS development, macOS only)
- **Android Studio** (for Android development)
- **EAS CLI** (for building with Expo Application Services)

```bash
# Install EAS CLI globally
npm install -g eas-cli
```

## Installation

### 1. Clone the repository with submodules

```bash
# Option A: Clone with submodules (recommended)
git clone --recurse-submodules <repository-url>
cd rn-template

# Option B: If already cloned without submodules
git clone <repository-url>
cd rn-template
git submodule update --init --recursive
```

### 2. Install dependencies

From the root directory, install all dependencies for all workspaces:

```bash
npm install
```

This will install dependencies for:

- Root workspace
- `apps/mobile`
- `packages/core`
- `packages/ui`

### Pulling Updates

When pulling updates that include submodule changes:

```bash
# Pull with submodule updates
git pull --recurse-submodules

# Or pull then update submodules separately
git pull
git submodule update --init --recursive
npm install
```

### Submodule Troubleshooting

If submodules fail to initialize:

```bash
# Reset and re-initialize submodules
git submodule deinit -f packages/core packages/ui
rm -rf .git/modules/packages
git submodule update --init --remote
npm install
```

## Running the App

### Start the development server

```bash
# From root directory
npm run mobile start

# Or navigate to the mobile app
cd apps/mobile
npm start
```

### Run on iOS (macOS only)

```bash
# From root directory
npm run mobile ios

# Or from apps/mobile
cd apps/mobile
npm run ios
```

### Run on Android

```bash
# From root directory
npm run mobile android

# Or from apps/mobile
cd apps/mobile
npm run android
```

### Run on Web

```bash
# From root directory
npm run mobile web

# Or from apps/mobile
cd apps/mobile
npm run web
```

## Building for Production

The project uses EAS (Expo Application Services) for building. Make sure you're logged in:

```bash
eas login
```

### Android Builds

```bash
cd apps/mobile

# Development build (development client)
npm run build:android:dev

# Preview build (internal distribution)
npm run build:android:preview

# Production build
npm run build:android

# Local build (builds on your machine)
npm run build:android:local
```

## Workspace Commands

Run commands in specific workspaces from the root:

```bash
# Run any script in mobile workspace
npm run mobile <script-name>

# Run any script in @repo/core workspace
npm run core <script-name>

# Run any script in @repo/ui workspace
npm run ui <script-name>
```

### Examples

```bash
# Type check core package
npm run core typecheck

# Type check ui package
npm run ui typecheck
```

## Packages

### @repo/core

Shared utilities, hooks, and constants.

**Contents:**

- `hooks/` - Reusable React hooks (useCounter, useToggle, etc.)
- `utils/` - Utility functions (formatCurrency, colors, etc.)
- `constants/` - Shared constants
- `storage/` - Secure storage utilities using expo-secure-store

**Usage in mobile app:**

```typescript
import { useCounter, formatCurrency, colors, secureStorage } from '@repo/core';
```

## Storage

This template uses `expo-secure-store` for secure data persistence. It works with Expo Go (no development build required).

### Basic Usage

```typescript
import { secureStorage } from '@repo/core';

// Store a string
await secureStorage.setString('token', 'abc123');

// Retrieve a string
const token = await secureStorage.getString('token');

// Store an object
await secureStorage.setObject('user', { id: 1, name: 'John' });

// Retrieve an object
const user = await secureStorage.getObject<User>('user');

// Remove an item
await secureStorage.remove('token');
```

### Zustand Persist with Secure Storage

The template provides a `zustandSecureStorage` adapter for persisting Zustand stores:

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

### Handling Async Hydration

Since `expo-secure-store` is asynchronous, you need to wait for hydration before accessing persisted state:

```tsx
import { useAuthStore } from '@/stores/useAuthStore';

function App() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Show loading screen while hydrating
  if (!isHydrated) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
}
```

### Storage Limitations

- **Size limit**: 2KB per value (expo-secure-store limitation)
- **API**: Async only (no synchronous reads/writes)
- **Use case**: Best for sensitive data like tokens, credentials, and small user preferences

For large data storage needs, consider using `AsyncStorage` or `expo-file-system` instead.

### @repo/ui

Shared React Native UI components.

**Components:**

- `Button` - Customizable button component
- `Card` - Container card component
- `Text` - Styled text component
- `Spacer` - Spacing utility component

**Usage in mobile app:**

```typescript
import { Button, Card, Text, Spacer } from '@repo/ui';
```

## Configuration Files

| File              | Location       | Purpose                                  |
| ----------------- | -------------- | ---------------------------------------- |
| `app.json`        | `apps/mobile/` | Expo app configuration                   |
| `eas.json`        | `apps/mobile/` | EAS build profiles                       |
| `metro.config.js` | `apps/mobile/` | Metro bundler configuration for monorepo |
| `tsconfig.json`   | All packages   | TypeScript configuration                 |

## Troubleshooting

### Metro bundler issues

If you encounter issues with the Metro bundler not resolving packages:

```bash
# Clear Metro cache
cd apps/mobile
npx expo start --clear
```

### Dependency issues

If you encounter dependency conflicts:

```bash
# From root directory
rm -rf node_modules
rm -rf apps/mobile/node_modules
rm -rf packages/core/node_modules
rm -rf packages/ui/node_modules
npm install
```

### iOS Pod issues (macOS)

```bash
cd apps/mobile/ios
pod install --repo-update
```

## Adding New Packages

To add a new shared package:

1. Create a new directory under `packages/`
2. Initialize with a `package.json`:
   ```json
   {
     "name": "@repo/package-name",
     "version": "0.0.1",
     "private": true,
     "main": "./src/index.ts",
     "types": "./src/index.ts"
   }
   ```
3. Add it as a dependency in `apps/mobile/package.json`:
   ```json
   "@repo/package-name": "*"
   ```
4. Run `npm install` from the root

## License

Private
