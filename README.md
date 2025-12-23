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

### 1. Clone the repository

```bash
git clone <repository-url>
cd rn-template
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

**Usage in mobile app:**
```typescript
import { useCounter, formatCurrency, colors } from '@repo/core';
```

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

| File | Location | Purpose |
|------|----------|---------|
| `app.json` | `apps/mobile/` | Expo app configuration |
| `eas.json` | `apps/mobile/` | EAS build profiles |
| `metro.config.js` | `apps/mobile/` | Metro bundler configuration for monorepo |
| `tsconfig.json` | All packages | TypeScript configuration |

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
