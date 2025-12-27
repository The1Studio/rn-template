# Studio Component Library: Pure Abstraction & Dependency Injection Architecture

**Date:** 2025-12-27
**Type:** Architecture Brainstorming - Dependency Injection Strategy
**Status:** Recommended Solution
**Scope:** Zero-dependency abstraction for studio component library

---

## Executive Summary

**Core Principle:** Application code depends on **interfaces ONLY**. Never on concrete implementations.

**Strategy:** Build-time dependency injection with TSyringe + per-client container composition

**Team Skill:** High TypeScript proficiency (comfortable with decorators, advanced patterns)

**Primary Goal:** Per-client customization (different service providers per client)

**Key Benefit:** Complete freedom to swap any implementation (self-developed or third-party) without changing application code

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

// Application never knows which implementation is running
// Could be Firebase, Supabase, Auth0, or custom - doesn't matter!
```

---

## Research: DI Best Practices (2025)

### Factory Pattern vs DI Containers

**Source:** [Dependency Injection and Factory in Node.js](https://carlosfmvaz.com/posts/dependency-injection-factory-pattern/)

**When to use Factory Pattern:**
- Object creation involves complex logic
- Need centralized creation logic
- Simple dependency graphs

**When to use DI Containers:**
- Complex dependency graphs that don't scale with manual injection
- Large applications requiring automated dependency management
- Need lifecycle management (singleton, transient, scoped)

**Best Practice (2025):** Combine both!
- DI container for dependency graph management
- Factory pattern for specific object creation logic within DI system

### TSyringe vs InversifyJS

**Sources:**
- [Dependency Injection Beyond NestJS](https://leapcell.io/blog/dependency-injection-beyond-nestjs-a-deep-dive-into-tsyringe-and-inversifyjs)
- [Top 5 TypeScript DI Containers](https://blog.logrocket.com/top-five-typescript-dependency-injection-containers/)

| Feature | TSyringe | InversifyJS |
|---------|----------|-------------|
| **Weight** | Lightweight (~5KB) | Heavier (~30KB) |
| **API** | Minimal, decorator-driven | Rich, extensive API |
| **Complexity** | Simple, direct | Advanced, feature-rich |
| **Bindings** | Automatic via decorators | Manual + conditional bindings |
| **Best For** | Small-medium apps, React Native | Enterprise, complex requirements |
| **Learning Curve** | Low | Medium-High |
| **Performance** | Faster (less overhead) | Slightly slower |

**Recommendation for Studio:** **TSyringe**
- ✅ Lighter weight (better for React Native bundle size)
- ✅ Simpler API (faster development)
- ✅ Team already skilled with decorators
- ✅ Build-time selection fits perfectly
- ✅ Sufficient features for studio needs

---

## 4-Layer Architecture with Pure Abstraction

### Layer 1: @studio/core (Business Logic)

**Structure:**
```
@studio/core/
├─ contracts/                    # INTERFACES ONLY
│  ├─ IAuthService.ts
│  ├─ IPaymentService.ts
│  ├─ IAnalyticsService.ts
│  ├─ IStorageService.ts
│  └─ index.ts
│
├─ implementations/
│  ├─ custom/                   # Self-developed
│  │  ├─ CustomAuthService.ts
│  │  ├─ CustomPaymentService.ts
│  │  └─ CustomAnalytics.ts
│  │
│  └─ adapters/                 # Third-party wrappers
│     ├─ firebase/
│     │  ├─ FirebaseAuthAdapter.ts
│     │  └─ FirebaseAnalyticsAdapter.ts
│     ├─ supabase/
│     │  ├─ SupabaseAuthAdapter.ts
│     │  └─ SupabaseStorageAdapter.ts
│     ├─ stripe/
│     │  └─ StripePaymentAdapter.ts
│     ├─ auth0/
│     │  └─ Auth0Adapter.ts
│     └─ paypal/
│        └─ PayPalAdapter.ts
│
├─ di/                          # Dependency injection config
│  ├─ types.ts                  # DI tokens
│  ├─ containers/
│  │  ├─ base.container.ts     # Base registrations
│  │  ├─ client-a.container.ts # Client A specific
│  │  ├─ client-b.container.ts # Client B specific
│  │  └─ test.container.ts     # Test mocks
│  └─ index.ts
│
└─ index.ts                     # Public API
```

### Layer 2: @studio/ui-primitives (Headless UI)

**Structure:**
```
@studio/ui-primitives/
├─ contracts/                    # INTERFACES ONLY
│  ├─ IUseButton.ts
│  ├─ IUseForm.ts
│  ├─ IUseModal.ts
│  ├─ IUseDataTable.ts
│  └─ index.ts
│
├─ implementations/
│  ├─ custom/                   # Self-developed hooks
│  │  ├─ useButton.ts
│  │  ├─ useForm.ts
│  │  └─ useModal.ts
│  │
│  └─ adapters/                 # Third-party wrappers
│     ├─ radix/                 # Radix UI (web only)
│     │  ├─ useButtonRadix.ts
│     │  └─ useModalRadix.ts
│     ├─ headlessui/
│     │  └─ useModalHeadlessUI.ts
│     └─ gluestack/
│        ├─ useButtonGluestack.ts
│        └─ useFormGluestack.ts
│
├─ di/
│  ├─ types.ts
│  └─ containers/
│     ├─ base.container.ts
│     ├─ web.container.ts      # Web-specific (Radix)
│     └─ native.container.ts   # Native-specific
│
└─ index.ts
```

### Layer 3: @studio/ui-themes (Themed Components)

**Structure:**
```
@studio/ui-themes/
├─ contracts/                    # INTERFACES ONLY
│  ├─ IButton.ts
│  ├─ IForm.ts
│  ├─ IModal.ts
│  ├─ IThemeProvider.ts
│  └─ index.ts
│
├─ implementations/
│  ├─ minimal/                  # 100% custom
│  │  ├─ Button.tsx
│  │  ├─ Form.tsx
│  │  ├─ Modal.tsx
│  │  └─ theme.ts
│  │
│  ├─ corporate/                # Wraps Tamagui
│  │  ├─ Button.tsx            # Tamagui adapter
│  │  ├─ Form.tsx
│  │  └─ theme.ts
│  │
│  ├─ modern/                   # Hybrid (mix custom + Gluestack)
│  │  ├─ Button.tsx            # Custom (unique animations)
│  │  ├─ Form.tsx              # Gluestack adapter
│  │  └─ theme.ts
│  │
│  └─ playful/                  # 100% custom
│     ├─ Button.tsx
│     ├─ Form.tsx
│     └─ theme.ts
│
├─ di/
│  ├─ types.ts
│  └─ containers/
│     ├─ minimal.container.ts
│     ├─ corporate.container.ts
│     ├─ modern.container.ts
│     └─ playful.container.ts
│
└─ index.ts
```

### Layer 4: @studio/features (Feature Modules)

**Structure:**
```
@studio/features/
├─ auth-flow/
│  ├─ contracts/               # INTERFACES ONLY
│  │  ├─ ILoginScreen.ts
│  │  ├─ IRegisterScreen.ts
│  │  └─ IAuthFlow.ts
│  │
│  ├─ implementations/
│  │  ├─ custom/               # Self-developed flow
│  │  │  ├─ LoginScreen.tsx
│  │  │  └─ RegisterScreen.tsx
│  │  │
│  │  └─ adapters/             # Third-party wrappers
│  │     ├─ firebase-ui/
│  │     │  └─ FirebaseAuthFlow.tsx
│  │     └─ auth0-ui/
│  │        └─ Auth0AuthFlow.tsx
│  │
│  ├─ di/
│  │  └─ containers/
│  │     ├─ custom-minimal.container.ts
│  │     ├─ custom-corporate.container.ts
│  │     └─ firebase-ui.container.ts
│  │
│  └─ index.ts
│
├─ payments/
│  ├─ contracts/
│  │  └─ IPaymentFlow.ts
│  │
│  ├─ implementations/
│  │  ├─ custom/
│  │  │  └─ CustomPaymentFlow.tsx
│  │  └─ adapters/
│  │     ├─ stripe-ui/
│  │     │  └─ StripePaymentFlow.tsx
│  │     └─ iap/               # In-app purchases
│  │        └─ IAPPaymentFlow.tsx
│  │
│  └─ di/
│
└─ [other features...]
```

---

## Complete Code Examples

### Layer 1: Core - Authentication Service

#### 1.1 Contract (Interface)

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

#### 1.2 Self-Developed Implementation

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

#### 1.3 Firebase Adapter

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

    return this.transformFirebaseUser(result.user);
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
    return this.transformFirebaseUser(user).user;
  }

  private async transformFirebaseUser(user: FirebaseUser): Promise<AuthResponse> {
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

#### 1.4 Supabase Adapter

```typescript
// @studio/core/implementations/adapters/supabase/SupabaseAuthAdapter.ts

import { injectable } from 'tsyringe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IAuthService, Credentials, AuthResponse } from '../../../contracts';

@injectable()
export class SupabaseAuthAdapter implements IAuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async login(credentials: Credentials): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user || !data.session) throw new Error('Login failed');

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
      },
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async logout(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  async refreshToken(token: string): Promise<string> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: token,
    });

    if (error) throw error;
    return data.session!.access_token;
  }

  async getCurrentUser() {
    const { data: { user } } = await this.supabase.auth.getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
    };
  }
}
```

#### 1.5 DI Token

```typescript
// @studio/core/di/types.ts

export const TYPES = {
  // Auth
  IAuthService: Symbol.for('IAuthService'),

  // Payments
  IPaymentService: Symbol.for('IPaymentService'),

  // Analytics
  IAnalyticsService: Symbol.for('IAnalyticsService'),

  // Storage
  IStorageService: Symbol.for('IStorageService'),
};
```

#### 1.6 Base Container

```typescript
// @studio/core/di/containers/base.container.ts

import { container } from 'tsyringe';
import { TYPES } from '../types';
import { IAuthService } from '../../contracts';
import { CustomAuthService } from '../../implementations/custom/CustomAuthService';

// Base container with default implementations (custom)
export function registerBaseServices() {
  container.register<IAuthService>(TYPES.IAuthService, {
    useClass: CustomAuthService,
  });

  // Register other base services...
}
```

#### 1.7 Client-Specific Containers

```typescript
// @studio/core/di/containers/client-a.container.ts

import { container } from 'tsyringe';
import { TYPES } from '../types';
import { IAuthService } from '../../contracts';
import { FirebaseAuthAdapter } from '../../implementations/adapters/firebase/FirebaseAuthAdapter';
import { StripePaymentAdapter } from '../../implementations/adapters/stripe/StripePaymentAdapter';

// Client A uses Firebase + Stripe
export function registerClientAServices() {
  // Override auth with Firebase
  container.register<IAuthService>(TYPES.IAuthService, {
    useClass: FirebaseAuthAdapter,
  });

  // Register Stripe payment
  container.register(TYPES.IPaymentService, {
    useClass: StripePaymentAdapter,
  });

  // Other services...
}
```

```typescript
// @studio/core/di/containers/client-b.container.ts

import { container } from 'tsyringe';
import { TYPES } from '../types';
import { SupabaseAuthAdapter } from '../../implementations/adapters/supabase/SupabaseAuthAdapter';
import { PayPalAdapter } from '../../implementations/adapters/paypal/PayPalAdapter';

// Client B uses Supabase + PayPal
export function registerClientBServices() {
  container.register(TYPES.IAuthService, {
    useClass: SupabaseAuthAdapter,
  });

  container.register(TYPES.IPaymentService, {
    useClass: PayPalAdapter,
  });

  // Other services...
}
```

#### 1.8 Test Container (Mocks)

```typescript
// @studio/core/di/containers/test.container.ts

import { container } from 'tsyringe';
import { TYPES } from '../types';
import { IAuthService, AuthResponse } from '../../contracts';

class MockAuthService implements IAuthService {
  async login() {
    return {
      user: { id: 'test-123', email: 'test@example.com' },
      token: 'mock-token',
      refreshToken: 'mock-refresh',
    } as AuthResponse;
  }

  async logout() {}
  async refreshToken() { return 'new-mock-token'; }
  async getCurrentUser() { return { id: 'test-123', email: 'test@example.com' }; }
}

export function registerTestServices() {
  container.register<IAuthService>(TYPES.IAuthService, {
    useClass: MockAuthService,
  });

  // Register other mocks...
}
```

---

### Layer 2: UI Primitives - Button Hook

#### 2.1 Contract

```typescript
// @studio/ui-primitives/contracts/IUseButton.ts

export interface UseButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface UseButtonReturn {
  handlePress: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  accessibilityProps: {
    role: string;
    'aria-disabled'?: boolean;
    'aria-busy'?: boolean;
  };
}

export interface IUseButton {
  (props: UseButtonProps): UseButtonReturn;
}
```

#### 2.2 Self-Developed Implementation

```typescript
// @studio/ui-primitives/implementations/custom/useButton.ts

import { useCallback } from 'react';
import { IUseButton, UseButtonReturn } from '../../contracts';

export const useButton: IUseButton = ({ onPress, disabled, loading, variant }) => {
  const isDisabled = disabled || loading || false;

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    onPress();
  }, [onPress, isDisabled]);

  return {
    handlePress,
    isDisabled,
    isLoading: loading || false,
    accessibilityProps: {
      role: 'button',
      'aria-disabled': isDisabled,
      'aria-busy': loading,
    },
  } as UseButtonReturn;
};
```

#### 2.3 Gluestack Adapter

```typescript
// @studio/ui-primitives/implementations/adapters/gluestack/useButtonGluestack.ts

import { useButton as useGluestackButton } from '@gluestack-ui/button';
import { IUseButton, UseButtonReturn } from '../../../contracts';

export const useButtonGluestack: IUseButton = ({ onPress, disabled, loading, variant }) => {
  // Use Gluestack's headless hook
  const gluestackResult = useGluestackButton({
    onPress,
    isDisabled: disabled || loading,
  });

  // Adapt to our interface
  return {
    handlePress: gluestackResult.onPress,
    isDisabled: gluestackResult.isDisabled,
    isLoading: loading || false,
    accessibilityProps: {
      role: 'button',
      'aria-disabled': gluestackResult.isDisabled,
      'aria-busy': loading,
    },
  } as UseButtonReturn;
};
```

#### 2.4 DI Container

```typescript
// @studio/ui-primitives/di/types.ts

export const PRIMITIVE_TYPES = {
  IUseButton: Symbol.for('IUseButton'),
  IUseForm: Symbol.for('IUseForm'),
  IUseModal: Symbol.for('IUseModal'),
};
```

```typescript
// @studio/ui-primitives/di/containers/base.container.ts

import { container } from 'tsyringe';
import { PRIMITIVE_TYPES } from '../types';
import { useButton } from '../../implementations/custom/useButton';

export function registerBasePrimitives() {
  container.register(PRIMITIVE_TYPES.IUseButton, {
    useValue: useButton, // Function, not class
  });
}
```

---

### Layer 3: Themed Components

#### 3.1 Contract

```typescript
// @studio/ui-themes/contracts/IButton.ts

import { ReactNode } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
}

export interface IButtonComponent {
  (props: ButtonProps): JSX.Element;
}
```

#### 3.2 Minimal Theme (Custom)

```typescript
// @studio/ui-themes/implementations/minimal/Button.tsx

import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { container } from 'tsyringe';
import { PRIMITIVE_TYPES } from '@studio/ui-primitives/di';
import { IUseButton } from '@studio/ui-primitives/contracts';
import { IButtonComponent, ButtonProps } from '../../contracts';

export const Button: IButtonComponent = ({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}) => {
  // Inject the button hook (whatever implementation is registered)
  const useButton = container.resolve<IUseButton>(PRIMITIVE_TYPES.IUseButton);

  const { handlePress, isDisabled, isLoading, accessibilityProps } = useButton({
    onPress,
    disabled,
    loading,
    variant,
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
      ]}
      {...accessibilityProps}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#5856D6',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### 3.3 Corporate Theme (Tamagui Adapter)

```typescript
// @studio/ui-themes/implementations/corporate/Button.tsx

import React from 'react';
import { Button as TamaguiButton } from 'tamagui';
import { container } from 'tsyringe';
import { PRIMITIVE_TYPES } from '@studio/ui-primitives/di';
import { IUseButton } from '@studio/ui-primitives/contracts';
import { IButtonComponent, ButtonProps } from '../../contracts';

export const Button: IButtonComponent = ({
  children,
  onPress,
  variant = 'primary',
  disabled,
  loading,
}) => {
  // Inject the button hook
  const useButton = container.resolve<IUseButton>(PRIMITIVE_TYPES.IUseButton);

  const { handlePress, isDisabled, isLoading } = useButton({
    onPress,
    disabled,
    loading,
    variant,
  });

  // Wrap Tamagui button with our interface
  return (
    <TamaguiButton
      onPress={handlePress}
      disabled={isDisabled}
      theme={variant === 'primary' ? 'blue' : 'gray'}
      size="$4"
      // Corporate-specific styling
      backgroundColor={variant === 'primary' ? '$blue10' : '$gray8'}
      hoverStyle={{ backgroundColor: '$blue11' }}
      pressStyle={{ backgroundColor: '$blue12' }}
    >
      {isLoading ? 'Loading...' : children}
    </TamaguiButton>
  );
};
```

---

### Layer 4: Feature Modules

#### 4.1 Contract

```typescript
// @studio/features/auth-flow/contracts/IAuthFlow.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ILoginScreen {
  navigation: any; // React Navigation type
}

export interface IAuthFlowController {
  handleLogin(credentials: LoginCredentials): Promise<void>;
  handleRegister(credentials: LoginCredentials): Promise<void>;
  handleForgotPassword(email: string): Promise<void>;
}
```

#### 4.2 Implementation

```typescript
// @studio/features/auth-flow/implementations/custom/LoginScreen.tsx

import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { IAuthService } from '@studio/core/contracts';
import { Button } from '@studio/ui-themes'; // Whatever theme is registered
import { ILoginScreen } from '../../contracts';

export const LoginScreen: React.FC<ILoginScreen> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Inject auth service (whatever implementation is registered)
  const authService = container.resolve<IAuthService>(TYPES.IAuthService);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Uses whatever IAuthService is registered
      // Could be Firebase, Supabase, Auth0, or custom
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
      {/* Uses whatever Button theme is registered */}
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

---

## Switching Strategy: Best Practices

### Strategy: Build-Time Container Composition

**Approach:** Compose different DI containers at build time based on client configuration.

**Benefits:**
- ✅ Zero runtime overhead (resolved at build time)
- ✅ Type-safe (compile-time errors if wrong implementation)
- ✅ Smaller bundle (only includes selected implementations)
- ✅ Per-client optimized builds

### Implementation Steps

#### Step 1: Client Configuration Files

```typescript
// config/clients/client-a.config.ts

export const clientAConfig = {
  client: 'client-a',
  name: 'E-Commerce App',

  // Layer 1: Core services
  services: {
    auth: 'firebase',      // Use Firebase auth
    payment: 'stripe',     // Use Stripe
    analytics: 'mixpanel', // Use Mixpanel
    storage: 'firebase',   // Use Firebase Storage
  },

  // Layer 2: UI primitives
  primitives: {
    source: 'custom',      // Use custom hooks
  },

  // Layer 3: Theme
  theme: {
    name: 'corporate',     // Corporate theme
    library: 'tamagui',    // Wrapped Tamagui
  },

  // Layer 4: Features
  features: {
    authFlow: 'custom',    // Custom auth flow
    payments: 'stripe-ui', // Stripe UI
  },
};
```

```typescript
// config/clients/client-b.config.ts

export const clientBConfig = {
  client: 'client-b',
  name: 'Booking App',

  services: {
    auth: 'supabase',      // Use Supabase auth
    payment: 'paypal',     // Use PayPal
    analytics: 'custom',   // Custom analytics
    storage: 'supabase',   // Supabase Storage
  },

  primitives: {
    source: 'custom',
  },

  theme: {
    name: 'minimal',       // Minimal theme
    library: 'custom',     // 100% custom
  },

  features: {
    authFlow: 'custom',
    payments: 'paypal-ui',
  },
};
```

#### Step 2: Container Composer

```typescript
// di/container-composer.ts

import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { PRIMITIVE_TYPES } from '@studio/ui-primitives/di';

// Import all possible implementations
import { CustomAuthService } from '@studio/core/implementations/custom/CustomAuthService';
import { FirebaseAuthAdapter } from '@studio/core/implementations/adapters/firebase/FirebaseAuthAdapter';
import { SupabaseAuthAdapter } from '@studio/core/implementations/adapters/supabase/SupabaseAuthAdapter';
import { StripePaymentAdapter } from '@studio/core/implementations/adapters/stripe/StripePaymentAdapter';
import { PayPalAdapter } from '@studio/core/implementations/adapters/paypal/PayPalAdapter';

import { useButton } from '@studio/ui-primitives/implementations/custom/useButton';
import { useButtonGluestack } from '@studio/ui-primitives/implementations/adapters/gluestack/useButtonGluestack';

type ClientConfig = {
  services: {
    auth: string;
    payment: string;
    analytics: string;
    storage: string;
  };
  primitives: {
    source: string;
  };
  theme: {
    name: string;
    library: string;
  };
};

export function composeContainer(config: ClientConfig) {
  // Clear any previous registrations
  container.clearInstances();

  // Register auth service based on config
  switch (config.services.auth) {
    case 'firebase':
      container.register(TYPES.IAuthService, { useClass: FirebaseAuthAdapter });
      break;
    case 'supabase':
      container.register(TYPES.IAuthService, { useClass: SupabaseAuthAdapter });
      break;
    case 'custom':
    default:
      container.register(TYPES.IAuthService, { useClass: CustomAuthService });
  }

  // Register payment service
  switch (config.services.payment) {
    case 'stripe':
      container.register(TYPES.IPaymentService, { useClass: StripePaymentAdapter });
      break;
    case 'paypal':
      container.register(TYPES.IPaymentService, { useClass: PayPalAdapter });
      break;
    // ... other payment providers
  }

  // Register UI primitives
  switch (config.primitives.source) {
    case 'gluestack':
      container.register(PRIMITIVE_TYPES.IUseButton, { useValue: useButtonGluestack });
      break;
    case 'custom':
    default:
      container.register(PRIMITIVE_TYPES.IUseButton, { useValue: useButton });
  }

  // Continue for all layers...

  return container;
}
```

#### Step 3: Build-Time Selection

```typescript
// index.ts (App entry point)

import 'reflect-metadata'; // Required for TSyringe
import { composeContainer } from './di/container-composer';

// Load client config based on environment variable
const CLIENT = process.env.CLIENT || 'client-a';

let config;
switch (CLIENT) {
  case 'client-a':
    config = require('./config/clients/client-a.config').clientAConfig;
    break;
  case 'client-b':
    config = require('./config/clients/client-b.config').clientBConfig;
    break;
  default:
    throw new Error(`Unknown client: ${CLIENT}`);
}

// Compose DI container at app startup (build-time decision)
composeContainer(config);

// Now run the app
import { App } from './App';
export default App;
```

#### Step 4: Build Scripts

```json
// package.json

{
  "scripts": {
    "build:client-a": "CLIENT=client-a expo build",
    "build:client-b": "CLIENT=client-b expo build",

    "ios:client-a": "CLIENT=client-a expo run:ios",
    "ios:client-b": "CLIENT=client-b expo run:ios",

    "android:client-a": "CLIENT=client-a expo run:android",
    "android:client-b": "CLIENT=client-b expo run:android"
  }
}
```

### Advanced: Container Modules (Scalable)

For better organization with many clients:

```typescript
// di/modules/BaseModule.ts

import { DependencyContainer } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { CustomAuthService } from '@studio/core/implementations/custom/CustomAuthService';

export class BaseModule {
  static register(container: DependencyContainer) {
    // Default implementations
    container.register(TYPES.IAuthService, { useClass: CustomAuthService });
    // ... other base services
  }
}
```

```typescript
// di/modules/ClientAModule.ts

import { DependencyContainer } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { FirebaseAuthAdapter } from '@studio/core/implementations/adapters/firebase/FirebaseAuthAdapter';

export class ClientAModule {
  static register(container: DependencyContainer) {
    // Override with Firebase
    container.register(TYPES.IAuthService, { useClass: FirebaseAuthAdapter });
    // ... other Client A specific services
  }
}
```

```typescript
// di/container-composer.ts (Modular version)

import { container } from 'tsyringe';
import { BaseModule } from './modules/BaseModule';
import { ClientAModule } from './modules/ClientAModule';
import { ClientBModule } from './modules/ClientBModule';

export function composeContainer(clientName: string) {
  // Start with base
  BaseModule.register(container);

  // Layer client-specific
  switch (clientName) {
    case 'client-a':
      ClientAModule.register(container);
      break;
    case 'client-b':
      ClientBModule.register(container);
      break;
  }

  return container;
}
```

---

## Testing Strategy

### Unit Testing with Mocks

```typescript
// __tests__/LoginScreen.test.tsx

import 'reflect-metadata';
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { container } from 'tsyringe';
import { TYPES } from '@studio/core/di';
import { IAuthService } from '@studio/core/contracts';
import { LoginScreen } from '../LoginScreen';

// Mock implementation
class MockAuthService implements IAuthService {
  login = jest.fn().mockResolvedValue({
    user: { id: '1', email: 'test@example.com' },
    token: 'mock-token',
    refreshToken: 'mock-refresh',
  });

  logout = jest.fn();
  refreshToken = jest.fn();
  getCurrentUser = jest.fn();
}

describe('LoginScreen', () => {
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    // Clear container
    container.clearInstances();

    // Register mock
    mockAuthService = new MockAuthService();
    container.register<IAuthService>(TYPES.IAuthService, {
      useValue: mockAuthService,
    });
  });

  it('calls auth service on login', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
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

## Migration Path from Current Structure

### Phase 1: Add Contracts (Interfaces)

**Week 1:** Create interface files for existing implementations

```typescript
// Create @studio/core/contracts/
// Extract interfaces from current implementations
// Don't change implementations yet - just define contracts
```

### Phase 2: Set Up DI Container

**Week 2:** Install TSyringe and create base container

```bash
npm install tsyringe reflect-metadata
npm install -D @types/node # For Symbol.for support
```

```typescript
// Add to index.ts
import 'reflect-metadata';

// Create base container with current implementations
```

### Phase 3: Refactor Implementations

**Week 3-4:** Add decorators and DI to existing code

```typescript
// Before
export class CustomAuthService {
  constructor() { }
}

// After
@injectable()
export class CustomAuthService implements IAuthService {
  constructor() { }
}
```

### Phase 4: Replace Direct Imports

**Week 5-6:** Replace direct imports with container resolution

```typescript
// Before
import { CustomAuthService } from './CustomAuthService';
const authService = new CustomAuthService();

// After
import { container } from 'tsyringe';
import { TYPES } from './di';
const authService = container.resolve<IAuthService>(TYPES.IAuthService);
```

### Phase 5: Add Alternative Implementations

**Week 7+:** Add Firebase, Supabase, etc. adapters

```typescript
// Create adapters for third-party libraries
// Register in client-specific containers
// Test switching between implementations
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
    "types": ["reflect-metadata"],
    // ... other options
  }
}
```

### Babel Configuration (React Native)

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

### Metro Configuration (React Native)

```javascript
// metro.config.js

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure reflect-metadata is bundled
config.resolver.extraNodeModules = {
  'reflect-metadata': require.resolve('reflect-metadata'),
};

module.exports = config;
```

---

## Comparison: TSyringe vs InversifyJS

| Aspect | TSyringe (Recommended) | InversifyJS |
|--------|----------------------|-------------|
| **Bundle Size** | ~5KB | ~30KB |
| **API Surface** | Minimal (3-4 core methods) | Extensive (20+ methods) |
| **Learning Curve** | Low (2-3 days) | Medium (1-2 weeks) |
| **Decorators** | Simple (@injectable, @inject) | Complex (@injectable, @inject, @tagged, @named) |
| **Container API** | Straightforward | Feature-rich |
| **Conditional Bindings** | Manual (switch/if) | Built-in |
| **Middleware** | ❌ Not supported | ✅ Supported |
| **Multi-injection** | Manual array | Built-in |
| **React Native** | ✅ Excellent | ⚠️ Works but heavier |
| **Performance** | Faster (less overhead) | Slightly slower |
| **Type Safety** | ✅ Full TypeScript support | ✅ Full TypeScript support |
| **Best For** | Studio use case | Enterprise complexity |

**Verdict:** TSyringe for this studio architecture

**Reasoning:**
- Lighter bundle (important for mobile)
- Simpler API (faster development)
- Build-time selection works perfectly
- Team skilled enough for decorators
- Sufficient features for studio needs

---

## Key Benefits of This Architecture

### 1. Complete Freedom
- Swap ANY implementation without changing app code
- Test with mocks, deploy with real services
- Try new providers without refactoring

### 2. Per-Client Optimization
- Client A: Firebase + Stripe + Tamagui (feature-rich)
- Client B: Supabase + PayPal + Custom (lightweight)
- Each gets optimized build with only their dependencies

### 3. Type Safety
- Compile-time errors if implementations don't match contracts
- Full IntelliSense for all interfaces
- Refactoring safety

### 4. Testing Excellence
- Mock any dependency trivially
- Test containers for different scenarios
- No need for complex mocking libraries

### 5. Future-Proof
- Add new implementations without changing existing code
- Migrate from one provider to another gradually
- No vendor lock-in

---

## Critical Success Factors

### 1. Strict Interface Discipline
- ❌ Never import concrete implementations in app code
- ✅ Always import and depend on interfaces
- ✅ Use container.resolve() for all dependencies

### 2. Container Composition Strategy
- Define clear client configs
- Test each client build independently
- Document which implementations each client uses

### 3. Team Training
- 1-week training on DI principles
- Code review checklist for interface violations
- Shared knowledge of container composition

### 4. Documentation
- Document every interface clearly
- Show adapter examples for each contract
- Maintain migration guide

### 5. CI/CD Integration
```yaml
# .github/workflows/build.yml
jobs:
  build-client-a:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build:client-a

  build-client-b:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build:client-b
```

---

## Summary

**Architecture:** 4-layer pure abstraction with dependency injection

**Layers:**
1. **Core** - Business logic contracts + implementations/adapters
2. **UI Primitives** - Headless UI contracts + implementations/adapters
3. **Themes** - Component contracts + themed implementations
4. **Features** - Feature contracts + complete implementations

**DI Container:** TSyringe (lightweight, decorator-driven)

**Switching Strategy:** Build-time container composition via client configs

**Key Principle:** Application code depends ONLY on interfaces, NEVER on concrete implementations

**Benefits:**
- ✅ Complete implementation freedom
- ✅ Per-client optimized builds
- ✅ Zero vendor lock-in
- ✅ Effortless testing
- ✅ Type-safe throughout
- ✅ Future-proof architecture

**Investment:** 3-4 weeks for foundation, 70-85% time savings thereafter

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

1. **React Navigation integration with DI** - How to inject navigation dependencies cleanly?
2. **Code splitting strategy** - Should each client build tree-shake unused implementations automatically?
3. **Hot reload behavior** - Does container composition work with Expo hot reload?
4. **Performance profiling** - What's the overhead of container.resolve() calls?
