# Studio Component Library: Pure Abstraction & DI Architecture - Comprehensive Guide

**Date:** 2025-12-27
**Type:** Architecture Brainstorming - Complete Production Guide
**Status:** Production-Ready
**Scope:** Zero-dependency abstraction with complete React Native integration

**Version:** 2.0 (Comprehensive)
**Previous:** brainstorm-251227-0046-pure-abstraction-di-architecture.md

---

## Executive Summary

**Core Principle:** Application code depends on **interfaces ONLY**. Never on concrete implementations.

**Strategy:** Build-time dependency injection with TSyringe + per-client container composition + React Context integration

**Team Skill:** High TypeScript proficiency (decorators, advanced patterns)

**Primary Goal:** Per-client customization with complete implementation freedom

**Key Benefit:** Swap ANY implementation (self-dev or third-party) without changing app code

**New in v2.0:**
- ✅ React Context + DI integration patterns
- ✅ Lifecycle management (singleton vs transient)
- ✅ Code splitting & lazy loading strategies
- ✅ Error handling & debugging guide
- ✅ Type-safe DI tokens
- ✅ Advanced patterns (HMR, circular deps, env-specific)

---

## Table of Contents

1. [Pure Abstraction Rule](#pure-abstraction-rule)
2. [Research: DI Best Practices](#research-di-best-practices)
3. [4-Layer Architecture](#4-layer-architecture)
4. [Complete Code Examples](#complete-code-examples)
5. **[NEW] [React Integration Patterns](#react-integration-patterns)**
6. **[NEW] [Lifecycle Management](#lifecycle-management)**
7. **[NEW] [Code Splitting & Lazy Loading](#code-splitting-lazy-loading)**
8. [Switching Strategy](#switching-strategy)
9. **[NEW] [Error Handling & Debugging](#error-handling-debugging)**
10. **[NEW] [Type-Safe DI Tokens](#type-safe-di-tokens)**
11. [Testing Strategy](#testing-strategy)
12. **[NEW] [Advanced Patterns](#advanced-patterns)**
13. [Migration Path](#migration-path)
14. [Tooling Setup](#tooling-setup)
15. [Summary](#summary)

---

## The Pure Abstraction Rule

### ❌ FORBIDDEN

```typescript
// ❌ Direct dependency on library
import { signInWithEmailAndPassword } from 'firebase/auth';

export const login = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ❌ Direct dependency on self-developed service
import { CustomAuthService } from './custom-auth';
const authService = new CustomAuthService();
```

### ✅ REQUIRED

```typescript
// ✅ Depend on interface only
import { IAuthService } from '@studio/core/contracts';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LoginUseCase {
  constructor(
    @inject('IAuthService') private authService: IAuthService
  ) {}

  async execute(email: string, password: string) {
    return this.authService.login({ email, password });
  }
}

// Application never knows which implementation runs
// Could be Firebase, Supabase, Auth0, or custom!
```

---

## Research: DI Best Practices (2025)

### Factory Pattern vs DI Containers

**Source:** [Dependency Injection and Factory in Node.js](https://carlosfmvaz.com/posts/dependency-injection-factory-pattern/)

**When Factory Pattern:**
- Object creation has complex logic
- Need centralized creation
- Simple dependency graphs

**When DI Containers:**
- Complex dependency graphs
- Large applications
- Need lifecycle management

**Best Practice (2025):** Combine both!
- DI container for dependency management
- Factory pattern for object creation within DI

### TSyringe vs InversifyJS

**Sources:**
- [Dependency Injection Beyond NestJS](https://leapcell.io/blog/dependency-injection-beyond-nestjs-a-deep-dive-into-tsyringe-and-inversifyjs)
- [Top 5 TypeScript DI Containers](https://blog.logrocket.com/top-five-typescript-dependency-injection-containers/)

| Feature | TSyringe ✅ | InversifyJS |
|---------|----------|-------------|
| **Weight** | ~5KB | ~30KB |
| **API** | Minimal | Rich |
| **Complexity** | Simple | Advanced |
| **Best For** | React Native | Enterprise |
| **Performance** | Faster | Slower |

**Recommendation:** **TSyringe** for React Native studio architecture

---

## 4-Layer Architecture with Pure Abstraction

### Layer 1: @studio/core (Business Logic)

```
@studio/core/
├─ contracts/                    # INTERFACES
│  ├─ IAuthService.ts
│  ├─ IPaymentService.ts
│  └─ IAnalyticsService.ts
│
├─ implementations/
│  ├─ custom/                   # Self-developed
│  │  ├─ CustomAuthService.ts
│  │  └─ CustomPaymentService.ts
│  │
│  └─ adapters/                 # Third-party
│     ├─ firebase/
│     ├─ supabase/
│     ├─ stripe/
│     └─ auth0/
│
├─ di/
│  ├─ types.ts
│  └─ containers/
│     ├─ base.container.ts
│     ├─ client-a.container.ts
│     └─ client-b.container.ts
│
└─ index.ts
```

### Layer 2: @studio/ui-primitives (Headless UI)

```
@studio/ui-primitives/
├─ contracts/
│  ├─ IUseButton.ts
│  ├─ IUseForm.ts
│  └─ IUseModal.ts
│
├─ implementations/
│  ├─ custom/
│  └─ adapters/
│     ├─ radix/
│     ├─ headlessui/
│     └─ gluestack/
│
└─ di/
```

### Layer 3: @studio/ui-themes (Themed Components)

```
@studio/ui-themes/
├─ contracts/
│  ├─ IButton.ts
│  └─ IThemeProvider.ts
│
├─ implementations/
│  ├─ minimal/        # Custom
│  ├─ corporate/      # Tamagui wrapper
│  ├─ modern/         # Hybrid
│  └─ playful/        # Custom
│
└─ di/
```

### Layer 4: @studio/features (Feature Modules)

```
@studio/features/
├─ auth-flow/
│  ├─ contracts/
│  ├─ implementations/
│  │  ├─ custom/
│  │  └─ adapters/
│  └─ di/
│
└─ payments/
   └─ [same structure]
```

---

## Complete Code Examples

### Layer 1: Core - Authentication

#### Contract

```typescript
// @studio/core/contracts/IAuthService.ts

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
  refreshToken: string;
}

export interface IAuthService {
  login(credentials: Credentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<string>;
  getCurrentUser(): Promise<AuthResponse['user'] | null>;
}
```

#### Custom Implementation

```typescript
// @studio/core/implementations/custom/CustomAuthService.ts

import { injectable } from 'tsyringe';
import { IAuthService, Credentials, AuthResponse } from '../../contracts';
import axios from 'axios';

@injectable()
export class CustomAuthService implements IAuthService {
  private baseURL = process.env.API_URL!;

  async login(credentials: Credentials): Promise<AuthResponse> {
    const { data } = await axios.post(`${this.baseURL}/auth/login`, credentials);
    return this.transformResponse(data);
  }

  async logout(): Promise<void> {
    await axios.post(`${this.baseURL}/auth/logout`);
  }

  async refreshToken(token: string): Promise<string> {
    const { data } = await axios.post(`${this.baseURL}/auth/refresh`, { token });
    return data.token;
  }

  async getCurrentUser() {
    const { data } = await axios.get(`${this.baseURL}/auth/me`);
    return data.user;
  }

  private transformResponse(data: any): AuthResponse {
    return {
      user: {
        id: data.userId,
        email: data.email,
        name: data.fullName,
      },
      token: data.accessToken,
      refreshToken: data.refreshToken,
    };
  }
}
```

#### Firebase Adapter

```typescript
// @studio/core/implementations/adapters/firebase/FirebaseAuthAdapter.ts

import { injectable } from 'tsyringe';
import {
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  User as FirebaseUser,
} from 'firebase/auth';
import { IAuthService, Credentials, AuthResponse } from '../../../contracts';

@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  private auth = getAuth();

  async login(credentials: Credentials): Promise<AuthResponse> {
    const result = await signInWithEmailAndPassword(
      this.auth,
      credentials.email,
      credentials.password
    );
    return this.transformUser(result.user);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async refreshToken(token: string): Promise<string> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user logged in');
    return user.getIdToken(true);
  }

  async getCurrentUser() {
    const user = this.auth.currentUser;
    if (!user) return null;
    return this.transformUser(user).user;
  }

  private async transformUser(user: FirebaseUser): Promise<AuthResponse> {
    const token = await user.getIdToken();
    return {
      user: {
        id: user.uid,
        email: user.email!,
        name: user.displayName || undefined,
      },
      token,
      refreshToken: user.refreshToken,
    };
  }
}
```

#### DI Tokens

```typescript
// @studio/core/di/types.ts

export const TYPES = {
  IAuthService: Symbol.for('IAuthService'),
  IPaymentService: Symbol.for('IPaymentService'),
  IAnalyticsService: Symbol.for('IAnalyticsService'),
  IStorageService: Symbol.for('IStorageService'),
};
```

#### Container Configuration

```typescript
// @studio/core/di/containers/client-a.container.ts

import { container } from 'tsyringe';
import { TYPES } from '../types';
import { FirebaseAuthAdapter } from '../../implementations/adapters/firebase/FirebaseAuthAdapter';

export function registerClientAServices() {
  container.registerSingleton(TYPES.IAuthService, FirebaseAuthAdapter);
  // Singleton for stateful services!
}
```

---

## React Integration Patterns

### Problem Statement

**The original report showed class-based DI but didn't explain how React functional components access services.**

### Solution: React Context + Custom Hooks

#### Step 1: Create DI Context

```typescript
// @studio/core/react/DIContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { DependencyContainer } from 'tsyringe';

const DIContext = createContext<DependencyContainer | null>(null);

export interface DIProviderProps {
  container: DependencyContainer;
  children: ReactNode;
}

export const DIProvider: React.FC<DIProviderProps> = ({ container, children }) => {
  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

export function useDIContainer(): DependencyContainer {
  const container = useContext(DIContext);

  if (!container) {
    throw new Error('useDIContainer must be used within DIProvider');
  }

  return container;
}
```

#### Step 2: Create Service Hooks

```typescript
// @studio/core/react/hooks.ts

import { useMemo } from 'react';
import { useDIContainer } from './DIContext';

/**
 * Resolve service from DI container
 * Service is memoized and reused across renders
 */
export function useService<T>(token: symbol): T {
  const container = useDIContainer();

  return useMemo(() => {
    return container.resolve<T>(token);
  }, [container, token]);
}

/**
 * Resolve service with factory
 * New instance on every call
 */
export function useFactory<T>(token: symbol): () => T {
  const container = useDIContainer();

  return useMemo(() => {
    return () => container.resolve<T>(token);
  }, [container, token]);
}

/**
 * Resolve multiple services
 */
export function useServices<T extends Record<string, symbol>>(
  tokens: T
): { [K in keyof T]: any } {
  const container = useDIContainer();

  return useMemo(() => {
    const services: any = {};
    for (const [key, token] of Object.entries(tokens)) {
      services[key] = container.resolve(token);
    }
    return services;
  }, [container, tokens]);
}
```

#### Step 3: App Setup

```typescript
// App.tsx

import 'reflect-metadata';
import React from 'react';
import { container } from 'tsyringe';
import { DIProvider } from '@studio/core/react';
import { composeContainer } from './di/container-composer';
import { Navigation } from './navigation';

// Compose container at app startup
const CLIENT = process.env.CLIENT || 'client-a';
composeContainer(CLIENT);

export default function App() {
  return (
    <DIProvider container={container}>
      <Navigation />
    </DIProvider>
  );
}
```

#### Step 4: Usage in Components

```typescript
// screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useService } from '@studio/core/react';
import { TYPES } from '@studio/core/di';
import { IAuthService } from '@studio/core/contracts';
import { Button } from '@studio/ui-themes';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Inject auth service via hook
  const authService = useService<IAuthService>(TYPES.IAuthService);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.login({ email, password });
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button onPress={handleLogin} loading={loading}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
```

#### Step 5: Multiple Services Pattern

```typescript
// screens/ProfileScreen.tsx

import React, { useEffect, useState } from 'react';
import { useServices } from '@studio/core/react';
import { TYPES } from '@studio/core/di';
import { IAuthService, IAnalyticsService } from '@studio/core/contracts';

export const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  // Inject multiple services
  const { authService, analyticsService } = useServices({
    authService: TYPES.IAuthService,
    analyticsService: TYPES.IAnalyticsService,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    // Track page view
    analyticsService.trackEvent('profile_viewed', {
      userId: currentUser?.id,
    });
  };

  // ...
};
```

#### Step 6: Zustand Store Integration

```typescript
// stores/authStore.ts

import { create } from 'zustand';
import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { IAuthService } from '@studio/core/contracts';

// Resolve service outside component
const authService = container.resolve<IAuthService>(TYPES.IAuthService);

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const result = await authService.login({ email, password });
    set({ user: result.user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
```

#### Step 7: React Navigation Integration

```typescript
// navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useService } from '@studio/core/react';
import { TYPES } from '@studio/core/di';
import { IAuthService } from '@studio/core/contracts';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const authService = useService<IAuthService>(TYPES.IAuthService);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

---

## Lifecycle Management

### Singleton vs Transient vs Scoped

#### Registration Types

```typescript
import { container, Lifecycle } from 'tsyringe';

// 1. SINGLETON - Single shared instance (DEFAULT recommended)
container.registerSingleton(TYPES.IAuthService, FirebaseAuthAdapter);
// Same instance returned every time

// 2. TRANSIENT - New instance per resolve
container.register(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
}, { lifecycle: Lifecycle.Transient });
// New instance each time

// 3. SCOPED - Per-resolution-scope (advanced)
container.register(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
}, { lifecycle: Lifecycle.ResolutionScoped });
// Same instance within single resolution tree
```

#### When to Use Each

```typescript
// ✅ SINGLETON (most common)
// Use for: Stateful services, expensive initialization, shared state

container.registerSingleton(TYPES.IAuthService, FirebaseAuthAdapter);
// API clients, analytics, storage, database connections

container.registerSingleton(TYPES.IAnalyticsService, MixpanelAdapter);
// Analytics instance should be shared

container.registerSingleton(TYPES.IStorageService, AsyncStorageAdapter);
// Storage should maintain cache

// ✅ TRANSIENT (rare in React Native)
// Use for: Stateless utilities, pure functions

container.register(TYPES.IValidator, {
  useClass: ZodValidator,
}, { lifecycle: Lifecycle.Transient });
// New validator per use (if it has no state)

// ❌ SCOPED (not applicable in RN)
// Scoped is for request-based lifecycles (backend)
// Not useful in React Native
```

#### Memory & Performance Implications

```typescript
// Singleton: Memory efficient
const auth1 = container.resolve<IAuthService>(TYPES.IAuthService);
const auth2 = container.resolve<IAuthService>(TYPES.IAuthService);
console.log(auth1 === auth2); // true - same instance

// Transient: Creates new instance
container.register(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
}, { lifecycle: Lifecycle.Transient });

const auth3 = container.resolve<IAuthService>(TYPES.IAuthService);
const auth4 = container.resolve<IAuthService>(TYPES.IAuthService);
console.log(auth3 === auth4); // false - different instances
// ⚠️ More memory, slower (constructor called each time)
```

#### Practical Guidelines

```typescript
// @studio/core/di/containers/base.container.ts

import { container, Lifecycle } from 'tsyringe';
import { TYPES } from '../types';

export function registerBaseServices() {
  // SINGLETON for services with state/connections
  container.registerSingleton(TYPES.IAuthService, CustomAuthService);
  container.registerSingleton(TYPES.IStorageService, AsyncStorageAdapter);
  container.registerSingleton(TYPES.IAnalyticsService, MixpanelAdapter);
  container.registerSingleton(TYPES.IPaymentService, StripeAdapter);

  // TRANSIENT for stateless utilities (if needed)
  container.register(TYPES.IDateFormatter, {
    useClass: DateFnsFormatter,
  }, { lifecycle: Lifecycle.Transient });

  // Factory pattern for lazy/conditional creation
  container.register(TYPES.ILogger, {
    useFactory: () => {
      return __DEV__ ? new ConsoleLogger() : new SentryLogger();
    },
  });
}
```

#### Singleton with Reset (for testing)

```typescript
// Testing pattern: Reset singleton state

@injectable()
export class AuthStore {
  private _user: User | null = null;

  get user() { return this._user; }

  setUser(user: User) {
    this._user = user;
  }

  // Reset for testing
  reset() {
    this._user = null;
  }
}

// In tests
beforeEach(() => {
  const authStore = container.resolve<AuthStore>(TYPES.IAuthStore);
  authStore.reset();
});
```

---

## Code Splitting & Lazy Loading

### Problem: Large Bundle Size

**Without lazy loading:**
```typescript
// container-composer.ts
import { CustomAuthService } from './custom/CustomAuthService';
import { FirebaseAuthAdapter } from './firebase/FirebaseAuthAdapter';
import { SupabaseAuthAdapter } from './supabase/SupabaseAuthAdapter';
import { Auth0Adapter } from './auth0/Auth0Adapter';
// ALL adapters loaded even if only one used!
// Bundle includes Firebase SDK even for Supabase-only client
```

### Solution 1: Dynamic Imports

```typescript
// @studio/core/di/container-composer.ts

import { container } from 'tsyringe';
import { TYPES } from './types';

export async function composeContainer(config: ClientConfig) {
  // Lazy load only needed implementation
  switch (config.services.auth) {
    case 'firebase': {
      const { FirebaseAuthAdapter } = await import(
        './implementations/adapters/firebase/FirebaseAuthAdapter'
      );
      container.registerSingleton(TYPES.IAuthService, FirebaseAuthAdapter);
      break;
    }

    case 'supabase': {
      const { SupabaseAuthAdapter } = await import(
        './implementations/adapters/supabase/SupabaseAuthAdapter'
      );
      container.registerSingleton(TYPES.IAuthService, SupabaseAuthAdapter);
      break;
    }

    case 'custom':
    default: {
      const { CustomAuthService } = await import(
        './implementations/custom/CustomAuthService'
      );
      container.registerSingleton(TYPES.IAuthService, CustomAuthService);
    }
  }

  // Load payment service
  switch (config.services.payment) {
    case 'stripe': {
      const { StripeAdapter } = await import(
        './implementations/adapters/stripe/StripeAdapter'
      );
      container.registerSingleton(TYPES.IPaymentService, StripeAdapter);
      break;
    }

    case 'paypal': {
      const { PayPalAdapter } = await import(
        './implementations/adapters/paypal/PayPalAdapter'
      );
      container.registerSingleton(TYPES.IPaymentService, PayPalAdapter);
      break;
    }
  }

  // Continue for all services...
}
```

### Solution 2: Loading State

```typescript
// App.tsx with loading

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { container } from 'tsyringe';
import { DIProvider } from '@studio/core/react';
import { composeContainer } from './di/container-composer';
import { Navigation } from './navigation';

export default function App() {
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    initializeContainer();
  }, []);

  const initializeContainer = async () => {
    const CLIENT = process.env.CLIENT || 'client-a';

    // Load config
    const config = await import(`./config/clients/${CLIENT}.config`);

    // Compose container with dynamic imports
    await composeContainer(config.default);

    setContainerReady(true);
  };

  if (!containerReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <DIProvider container={container}>
      <Navigation />
    </DIProvider>
  );
}
```

### Solution 3: Metro Bundler Configuration

```javascript
// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable code splitting
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true, // Inline requires for better tree-shaking
    },
  }),
};

module.exports = config;
```

### Solution 4: Bundle Analysis

```bash
# Analyze bundle size per client
npx react-native-bundle-visualizer

# Compare builds
CLIENT=client-a npm run build
# vs
CLIENT=client-b npm run build

# Expected results:
# Client A (Firebase): +250KB Firebase SDK
# Client B (Supabase): +180KB Supabase SDK
# Neither includes both SDKs ✅
```

### Advanced: Feature-Based Code Splitting

```typescript
// @studio/features/di/feature-loader.ts

export async function loadFeature(featureName: string) {
  switch (featureName) {
    case 'auth-flow': {
      const { registerAuthFlowServices } = await import(
        '../auth-flow/di/container'
      );
      registerAuthFlowServices();
      break;
    }

    case 'payments': {
      const { registerPaymentServices } = await import(
        '../payments/di/container'
      );
      registerPaymentServices();
      break;
    }
  }
}

// Usage: Load features on-demand
const PaymentsScreen = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFeature('payments').then(() => setReady(true));
  }, []);

  if (!ready) return <Loading />;

  return <PaymentsUI />;
};
```

---

## Switching Strategy: Build-Time Container Composition

### Client Configuration

```typescript
// config/clients/client-a.config.ts

export const clientAConfig = {
  client: 'client-a',
  name: 'E-Commerce App',

  services: {
    auth: 'firebase',
    payment: 'stripe',
    analytics: 'mixpanel',
    storage: 'firebase',
  },

  primitives: {
    source: 'custom',
  },

  theme: {
    name: 'corporate',
    library: 'tamagui',
  },

  features: {
    authFlow: 'custom',
    payments: 'stripe-ui',
  },
};
```

### Container Composer

```typescript
// di/container-composer.ts

import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';

export async function composeContainer(config: ClientConfig) {
  container.clearInstances();

  // Auth service
  switch (config.services.auth) {
    case 'firebase': {
      const { FirebaseAuthAdapter } = await import(
        '@studio/core/implementations/adapters/firebase/FirebaseAuthAdapter'
      );
      container.registerSingleton(TYPES.IAuthService, FirebaseAuthAdapter);
      break;
    }
    case 'supabase': {
      const { SupabaseAuthAdapter } = await import(
        '@studio/core/implementations/adapters/supabase/SupabaseAuthAdapter'
      );
      container.registerSingleton(TYPES.IAuthService, SupabaseAuthAdapter);
      break;
    }
    default: {
      const { CustomAuthService } = await import(
        '@studio/core/implementations/custom/CustomAuthService'
      );
      container.registerSingleton(TYPES.IAuthService, CustomAuthService);
    }
  }

  // Payment, analytics, etc.
  // ...

  return container;
}
```

### Build Scripts

```json
// package.json

{
  "scripts": {
    "build:client-a": "CLIENT=client-a expo build",
    "build:client-b": "CLIENT=client-b expo build",

    "ios:client-a": "CLIENT=client-a expo run:ios",
    "ios:client-b": "CLIENT=client-b expo run:ios"
  }
}
```

---

## Error Handling & Debugging

### Error Scenarios

#### 1. Service Not Registered

```typescript
// Problem: Trying to resolve unregistered service
try {
  const service = container.resolve<IAuthService>(TYPES.IAuthService);
} catch (error) {
  // Error: "Cannot resolve IAuthService. Token not registered"
}

// Solution 1: Validation function
export function validateContainer() {
  const requiredServices = [
    TYPES.IAuthService,
    TYPES.IPaymentService,
    TYPES.IAnalyticsService,
  ];

  for (const token of requiredServices) {
    try {
      container.resolve(token);
    } catch (error) {
      throw new Error(`Required service not registered: ${token.toString()}`);
    }
  }
}

// Call after container composition
await composeContainer(config);
validateContainer(); // Throws if any missing

// Solution 2: Fallback provider
function resolveWithFallback<T>(token: symbol, fallback: T): T {
  try {
    return container.resolve<T>(token);
  } catch {
    console.warn(`Service ${token.toString()} not found, using fallback`);
    return fallback;
  }
}
```

#### 2. Wrong Implementation Type

```typescript
// Problem: Implementation doesn't match interface
@injectable()
class BrokenAuthService {
  // Missing required methods!
  async login() { /* ... */ }
  // No logout, refreshToken, getCurrentUser
}

// Solution: Runtime validation with type guards
function validateAuthService(service: any): service is IAuthService {
  return (
    typeof service.login === 'function' &&
    typeof service.logout === 'function' &&
    typeof service.refreshToken === 'function' &&
    typeof service.getCurrentUser === 'function'
  );
}

// Validate after resolution
const authService = container.resolve(TYPES.IAuthService);
if (!validateAuthService(authService)) {
  throw new Error('IAuthService implementation is invalid');
}
```

#### 3. Circular Dependencies

```typescript
// Problem: ServiceA depends on ServiceB, ServiceB depends on ServiceA

@injectable()
class ServiceA {
  constructor(@inject(TYPES.ServiceB) private serviceB: ServiceB) {}
}

@injectable()
class ServiceB {
  constructor(@inject(TYPES.ServiceA) private serviceA: ServiceA) {}
}

// TSyringe Error: "Circular dependency detected"

// Solution 1: Lazy injection
@injectable()
class ServiceA {
  constructor(@inject(delay(() => TYPES.ServiceB)) private serviceB: ServiceB) {}
}

// Solution 2: Extract shared dependency
@injectable()
class SharedService {}

@injectable()
class ServiceA {
  constructor(@inject(TYPES.SharedService) private shared: SharedService) {}
}

@injectable()
class ServiceB {
  constructor(@inject(TYPES.SharedService) private shared: SharedService) {}
}
```

### Debug Mode Configuration

```typescript
// di/debug.ts

export function enableDIDebug() {
  if (!__DEV__) return;

  const originalResolve = container.resolve.bind(container);

  // Override resolve to log
  container.resolve = function<T>(token: any): T {
    console.log(`[DI Debug] Resolving: ${token.toString()}`);

    try {
      const result = originalResolve<T>(token);
      console.log(`[DI Debug] ✅ Resolved: ${result.constructor.name}`);
      return result;
    } catch (error) {
      console.error(`[DI Debug] ❌ Failed: ${token.toString()}`, error);
      throw error;
    }
  };
}

// Enable in dev mode
if (__DEV__) {
  enableDIDebug();
}
```

### Container Inspector

```typescript
// di/inspector.ts

export function inspectContainer() {
  if (!__DEV__) return;

  const registrations = (container as any)._registry;

  console.group('DI Container Registrations');

  for (const [token, registration] of registrations) {
    console.log(`${token.toString()}:`, {
      lifecycle: registration.options?.lifecycle || 'Singleton',
      provider: registration.provider,
    });
  }

  console.groupEnd();
}

// Call in dev tools
// > inspectContainer()
// DI Container Registrations
//   Symbol(IAuthService): { lifecycle: 'Singleton', provider: FirebaseAuthAdapter }
//   Symbol(IPaymentService): { lifecycle: 'Singleton', provider: StripeAdapter }
```

### Error Boundary for DI Failures

```typescript
// components/DIErrorBoundary.tsx

import React, { Component, ReactNode } from 'react';
import { View, Text, Button } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class DIErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[DI Error]', error, errorInfo);

    // Log to error tracking service
    // errorTracker.logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Service Error
          </Text>
          <Text style={{ marginBottom: 20 }}>
            {this.state.error?.message || 'Failed to initialize services'}
          </Text>
          <Button title="Retry" onPress={this.handleReset} />
        </View>
      );
    }

    return this.props.children;
  }
}

// Usage
<DIErrorBoundary>
  <DIProvider container={container}>
    <App />
  </DIProvider>
</DIErrorBoundary>
```

### Troubleshooting Checklist

```typescript
// di/troubleshooting.ts

export function runDiagnostics() {
  const issues: string[] = [];

  // 1. Check reflect-metadata
  if (typeof Reflect.getMetadata !== 'function') {
    issues.push('❌ reflect-metadata not loaded. Add: import "reflect-metadata"');
  }

  // 2. Check decorators
  try {
    @injectable()
    class TestService {}
  } catch (error) {
    issues.push('❌ Decorators not enabled. Check tsconfig.json experimentalDecorators');
  }

  // 3. Check registrations
  const requiredTokens = [
    TYPES.IAuthService,
    TYPES.IPaymentService,
  ];

  for (const token of requiredTokens) {
    try {
      container.resolve(token);
    } catch {
      issues.push(`❌ Service not registered: ${token.toString()}`);
    }
  }

  // 4. Report
  if (issues.length > 0) {
    console.group('⚠️ DI Diagnostics - Issues Found');
    issues.forEach(issue => console.warn(issue));
    console.groupEnd();
  } else {
    console.log('✅ DI Diagnostics - All checks passed');
  }

  return issues;
}
```

---

## Type-Safe DI Tokens

### Problem: Symbol-Based Tokens Lose Type Safety

```typescript
// Current approach - NOT TYPE SAFE
const TYPES = {
  IAuthService: Symbol.for('IAuthService'),
};

// No type inference
const service = container.resolve(TYPES.IAuthService);
// service is `any` - no IntelliSense!

// Easy to make mistakes
const service = container.resolve(TYPES.IAuthServicee); // Typo, no error
```

### Solution: Typed Token Pattern

```typescript
// @studio/core/di/typed-tokens.ts

/**
 * Type-safe DI token
 */
export class ServiceToken<T> {
  readonly symbol: symbol;

  constructor(description: string) {
    this.symbol = Symbol.for(description);
  }

  toString(): string {
    return this.symbol.toString();
  }
}

// Create typed tokens
export const TYPED_TOKENS = {
  IAuthService: new ServiceToken<IAuthService>('IAuthService'),
  IPaymentService: new ServiceToken<IPaymentService>('IPaymentService'),
  IAnalyticsService: new ServiceToken<IAnalyticsService>('IAnalyticsService'),
};

// Type-safe resolve helper
export function resolveTyped<T>(token: ServiceToken<T>): T {
  return container.resolve<T>(token.symbol);
}
```

### Usage: Type-Safe Resolution

```typescript
// With type safety
import { resolveTyped, TYPED_TOKENS } from '@studio/core/di/typed-tokens';

const authService = resolveTyped(TYPED_TOKENS.IAuthService);
// authService is IAuthService - full IntelliSense!

// Typos caught at compile time
const service = resolveTyped(TYPED_TOKENS.IAuthServicee);
// ❌ TypeScript error: Property 'IAuthServicee' does not exist

// Type-safe registration
function registerTyped<T>(
  token: ServiceToken<T>,
  implementation: new (...args: any[]) => T
) {
  container.registerSingleton(token.symbol, implementation);
}

registerTyped(TYPED_TOKENS.IAuthService, FirebaseAuthAdapter);
// ✅ Type-checked: FirebaseAuthAdapter must implement IAuthService
```

### React Hook: Type-Safe

```typescript
// @studio/core/react/hooks.ts

import { ServiceToken } from '../di/typed-tokens';

export function useTypedService<T>(token: ServiceToken<T>): T {
  const container = useDIContainer();

  return useMemo(() => {
    return container.resolve<T>(token.symbol);
  }, [container, token]);
}

// Usage
import { useTypedService } from '@studio/core/react';
import { TYPED_TOKENS } from '@studio/core/di';

const LoginScreen = () => {
  const authService = useTypedService(TYPED_TOKENS.IAuthService);
  // Full type safety and IntelliSense!
};
```

### Alternative: Branded Types

```typescript
// Even stronger type safety with branded symbols

type Brand<K, T> = K & { __brand: T };

type AuthServiceToken = Brand<symbol, 'IAuthService'>;
type PaymentServiceToken = Brand<symbol, 'IPaymentService'>;

const BRANDED_TOKENS = {
  IAuthService: Symbol.for('IAuthService') as AuthServiceToken,
  IPaymentService: Symbol.for('IPaymentService') as PaymentServiceToken,
};

// Can't accidentally use wrong token
function resolveAuth(token: AuthServiceToken): IAuthService {
  return container.resolve<IAuthService>(token);
}

resolveAuth(BRANDED_TOKENS.IAuthService); // ✅ OK
resolveAuth(BRANDED_TOKENS.IPaymentService); // ❌ TypeScript error
```

---

## Testing Strategy

### Mock Container

```typescript
// __tests__/setup.ts

import 'reflect-metadata';
import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { IAuthService, IPaymentService } from '@studio/core/contracts';

export class MockAuthService implements IAuthService {
  login = jest.fn().mockResolvedValue({
    user: { id: 'test-123', email: 'test@example.com' },
    token: 'mock-token',
    refreshToken: 'mock-refresh',
  });

  logout = jest.fn();
  refreshToken = jest.fn().mockResolvedValue('new-mock-token');
  getCurrentUser = jest.fn().mockResolvedValue({
    id: 'test-123',
    email: 'test@example.com',
  });
}

export function setupTestContainer() {
  container.clearInstances();

  container.register<IAuthService>(TYPES.IAuthService, {
    useClass: MockAuthService,
  });

  // Register other mocks...
}

beforeEach(() => {
  setupTestContainer();
});
```

### Component Testing

```typescript
// __tests__/LoginScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { container } from 'tsyringe';
import { DIProvider } from '@studio/core/react';
import { TYPES } from '@studio/core/di';
import { LoginScreen } from '../LoginScreen';
import { MockAuthService, setupTestContainer } from './setup';

describe('LoginScreen', () => {
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    setupTestContainer();
    mockAuthService = container.resolve<MockAuthService>(TYPES.IAuthService);
  });

  it('calls auth service on login', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <DIProvider container={container}>
        <LoginScreen navigation={navigation} />
      </DIProvider>
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(navigation.navigate).toHaveBeenCalledWith('Home');
    });
  });
});
```

---

## Advanced Patterns

### 1. Environment-Specific Wrappers

```typescript
// Development wrapper with logging
@injectable()
export class DebugAuthService implements IAuthService {
  constructor(
    @inject(TYPES.IAuthService) private realService: IAuthService
  ) {}

  async login(credentials: Credentials) {
    console.log('[DEBUG] Login attempt:', credentials.email);
    const startTime = Date.now();

    try {
      const result = await this.realService.login(credentials);
      console.log(`[DEBUG] Login success in ${Date.now() - startTime}ms:`, result.user.id);
      return result;
    } catch (error) {
      console.error('[DEBUG] Login failed:', error);
      throw error;
    }
  }

  // Wrap other methods...
}

// Register conditionally
if (__DEV__) {
  container.register(TYPES.IAuthService, {
    useFactory: (c) => {
      const realService = c.resolve(TYPES.IAuthService);
      return new DebugAuthService(realService);
    },
  });
}
```

### 2. Hot Module Replacement (HMR)

```typescript
// Handle HMR with DI

if (__DEV__ && module.hot) {
  module.hot.accept('./di/container-composer', () => {
    console.log('[HMR] Recomposing DI container...');

    // Reload container composition
    const { composeContainer } = require('./di/container-composer');
    composeContainer(config);

    // Force React to re-render with new services
    // (React Context will pick up new container)
  });
}
```

### 3. Async Service Initialization

```typescript
// Some services need async initialization

export interface IAsyncService {
  initialize(): Promise<void>;
  isReady: boolean;
}

@injectable()
export class AnalyticsService implements IAnalyticsService, IAsyncService {
  isReady = false;

  async initialize() {
    await this.loadConfig();
    await this.connectToServer();
    this.isReady = true;
  }

  // ...
}

// Initialize all async services
export async function initializeServices() {
  const services = [
    container.resolve<IAnalyticsService>(TYPES.IAnalyticsService),
    // ... other services
  ];

  await Promise.all(
    services
      .filter((s): s is IAsyncService => 'initialize' in s)
      .map(s => s.initialize())
  );
}

// In App.tsx
useEffect(() => {
  initializeServices().then(() => setReady(true));
}, []);
```

---

## Migration Path from Current Structure

### Phase 1: Infrastructure (Week 1-2)

```bash
# Install dependencies
npm install tsyringe reflect-metadata
npm install -D @types/node

# Update tsconfig.json
# Update babel.config.js
# Update metro.config.js

# Create directory structure
mkdir -p packages/core/di/{types,containers}
mkdir -p packages/core/contracts
mkdir -p packages/core/react
```

### Phase 2: Extract Interfaces (Week 3-4)

```typescript
// Before
export class AuthService {
  async login(email, password) { /* ... */ }
}

// After
// contracts/IAuthService.ts
export interface IAuthService {
  login(credentials: Credentials): Promise<AuthResponse>;
}

// implementations/custom/CustomAuthService.ts
@injectable()
export class CustomAuthService implements IAuthService {
  async login(credentials: Credentials) { /* ... */ }
}
```

### Phase 3: Setup DI Container (Week 5-6)

```typescript
// Create tokens
// Create base container
// Create React Context wrapper
// Test with one service
```

### Phase 4: Migrate Components (Week 7-8)

```typescript
// Before
import { authService } from './services/auth';

// After
const authService = useService<IAuthService>(TYPES.IAuthService);
```

---

## Tooling Setup

### Install TSyringe

```bash
npm install tsyringe reflect-metadata
npm install -D @types/node
```

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "types": ["reflect-metadata"]
  }
}
```

### Babel Configuration

```javascript
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
```

```bash
npm install -D babel-plugin-transform-typescript-metadata
npm install -D @babel/plugin-proposal-decorators
```

---

## Summary

### What's New in v2.0

**v1.0 (Basic)** → **v2.0 (Production-Ready)**

| Feature | v1.0 | v2.0 |
|---------|------|------|
| React Integration | ❌ Missing | ✅ Complete (Context, hooks) |
| Lifecycle Management | ❌ Not explained | ✅ Singleton vs Transient guide |
| Code Splitting | ❌ Missing | ✅ Lazy loading with dynamic imports |
| Error Handling | ❌ Missing | ✅ Comprehensive error strategies |
| Type Safety | ⚠️ Symbol-based | ✅ Type-safe tokens |
| Debugging | ❌ Missing | ✅ Debug mode + inspector |
| HMR Support | ❌ Missing | ✅ Hot reload compatible |
| Testing | ⚠️ Basic | ✅ Complete mock strategy |

### Key Benefits

1. **Complete React Native Integration**
   - DIProvider component
   - useService, useFactory hooks
   - Navigation integration
   - Zustand store compatibility

2. **Production-Ready Patterns**
   - Proper lifecycle management
   - Bundle size optimization
   - Error boundaries
   - Debug tooling

3. **Type Safety**
   - Typed tokens with IntelliSense
   - Compile-time error checking
   - Generic type inference

4. **Developer Experience**
   - Easy debugging
   - Clear error messages
   - HMR support
   - Testing utilities

### Architecture Summary

**4-Layer Pure Abstraction:**
- Layer 1: Core (business logic contracts + implementations)
- Layer 2: Primitives (headless UI contracts + implementations)
- Layer 3: Themes (component contracts + themed implementations)
- Layer 4: Features (feature contracts + complete flows)

**DI Container:** TSyringe (lightweight, performant)

**Switching Strategy:** Build-time container composition with lazy loading

**React Integration:** Context API + custom hooks

**Type Safety:** ServiceToken pattern with generics

---

## Sources

- [Dependency Injection and Factory Pattern](https://carlosfmvaz.com/posts/dependency-injection-factory-pattern/)
- [Dependency Injection in TypeScript Best Practices](https://codezup.com/dependency-injection-in-typescript-best-practices/)
- [Top 5 TypeScript DI Containers](https://blog.logrocket.com/top-five-typescript-dependency-injection-containers/)
- [TSyringe vs InversifyJS Deep Dive](https://leapcell.io/blog/dependency-injection-beyond-nestjs-a-deep-dive-into-tsyringe-and-inversifyjs)
- [React Native DI with InversifyJS](https://medium.com/@mohamed.ma872/implementing-dependency-injection-in-react-native-with-inversifyjs-460646701f8b)
- [TSyringe GitHub](https://github.com/microsoft/tsyringe)
- [InversifyJS Documentation](https://inversify.io/)

---

## Unresolved Questions

1. **Performance profiling needed:** What's actual overhead of container.resolve() in production?
2. **React Navigation deep linking:** How to inject services in linking configuration?
3. **Code signing complexity:** Does build-time composition affect code signing?
4. **Metro bundler limitations:** Any limitations with dynamic imports in production builds?

---

**Document Version:** 2.0
**Last Updated:** 2025-12-27
**Status:** Production-Ready ✅
