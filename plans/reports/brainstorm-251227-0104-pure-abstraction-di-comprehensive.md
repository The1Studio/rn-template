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

### Overview

The studio architecture consists of 4 layers, each with complete pure abstraction:

```
Layer 4: Features           (Complete user-facing features)
    ↓ depends on
Layer 3: UI Themes          (Styled component implementations)
    ↓ depends on
Layer 2: UI Primitives      (Headless UI hooks/logic)
    ↓ depends on
Layer 1: Core               (Business logic services)
```

**Key Principle**: Each layer depends ONLY on interfaces from layers below, NEVER on concrete implementations.

---

## Layer 1: @studio/core (Business Logic Services)

### Purpose
Core business logic, data management, authentication, payments, analytics - completely framework-agnostic.

### Complete File Structure

```
packages/core/
├── src/
│   ├── contracts/                          # Interface definitions
│   │   ├── auth/
│   │   │   ├── IAuthService.ts            # Main auth interface
│   │   │   ├── IAuthProvider.ts           # Provider abstraction
│   │   │   ├── types.ts                   # Auth types
│   │   │   └── index.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── IPaymentService.ts
│   │   │   ├── IPaymentProvider.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── data/
│   │   │   ├── IDataService.ts
│   │   │   ├── IRepository.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── IAnalyticsService.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                       # Export all contracts
│   │
│   ├── implementations/                    # Concrete implementations
│   │   ├── custom/                        # Self-developed services
│   │   │   ├── auth/
│   │   │   │   ├── CustomAuthService.ts
│   │   │   │   ├── JWTAuthProvider.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── CustomPaymentService.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── data/
│   │   │       ├── InMemoryRepository.ts
│   │   │       └── index.ts
│   │   │
│   │   └── adapters/                      # Third-party wrappers
│   │       ├── firebase/
│   │       │   ├── FirebaseAuthAdapter.ts
│   │       │   ├── FirestoreRepository.ts
│   │       │   ├── FirebaseAnalyticsAdapter.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── supabase/
│   │       │   ├── SupabaseAuthAdapter.ts
│   │       │   ├── SupabaseRepository.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── stripe/
│   │       │   ├── StripePaymentAdapter.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── auth0/
│   │       │   ├── Auth0Adapter.ts
│   │       │   └── index.ts
│   │       │
│   │       └── mixpanel/
│   │           ├── MixpanelAnalyticsAdapter.ts
│   │           └── index.ts
│   │
│   ├── di/                                # Dependency Injection
│   │   ├── types/
│   │   │   ├── tokens.ts                 # Symbol tokens for all services
│   │   │   └── index.ts
│   │   │
│   │   ├── containers/
│   │   │   ├── baseContainer.ts          # Shared configuration
│   │   │   ├── clientAContainer.ts       # Client A: Firebase + Stripe
│   │   │   ├── clientBContainer.ts       # Client B: Supabase + Custom
│   │   │   ├── clientCContainer.ts       # Client C: Auth0 + Stripe
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── react/                             # React-specific integration
│   │   ├── DIContext.tsx
│   │   ├── DIProvider.tsx
│   │   ├── useDIContainer.ts
│   │   ├── useService.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── validation.ts
│   │   ├── errors.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   ├── common.ts
│   │   └── index.ts
│   │
│   └── index.ts                           # Public API
│
├── package.json
├── tsconfig.json
└── README.md
```

### Detailed Code Examples

#### 1. Contract Definition

```typescript
// packages/core/src/contracts/auth/IAuthService.ts

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  displayName: string;
}

/**
 * Authentication service interface
 *
 * @contract All implementations MUST:
 * - Return User object with id and email on successful auth
 * - Throw AuthError with specific error codes
 * - Be idempotent for logout()
 */
export interface IAuthService {
  /**
   * Authenticate user with email/password
   * @throws {AuthError} code: 'invalid-credentials' | 'network-error' | 'user-disabled'
   */
  login(credentials: LoginCredentials): Promise<User>;

  /**
   * Create new user account
   * @throws {AuthError} code: 'email-exists' | 'weak-password' | 'network-error'
   */
  signup(data: SignupData): Promise<User>;

  /**
   * Sign out current user
   * @contract Must be idempotent (safe to call multiple times)
   */
  logout(): Promise<void>;

  /**
   * Get currently authenticated user
   * @returns User object or null if not authenticated
   * @contract MUST NOT throw when user not authenticated
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Send password reset email
   */
  resetPassword(email: string): Promise<void>;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
```

#### 2. Custom Implementation

```typescript
// packages/core/src/implementations/custom/auth/CustomAuthService.ts

import { injectable } from 'tsyringe';
import { IAuthService, User, LoginCredentials, SignupData, AuthError } from '../../../contracts/auth';

@injectable()
export class CustomAuthService implements IAuthService {
  private currentUser: User | null = null;
  private users: Map<string, { password: string; user: User }> = new Map();

  async login(credentials: LoginCredentials): Promise<User> {
    const userRecord = this.users.get(credentials.email);

    if (!userRecord || userRecord.password !== credentials.password) {
      throw new AuthError(
        'Invalid email or password',
        'invalid-credentials'
      );
    }

    this.currentUser = userRecord.user;
    return this.currentUser;
  }

  async signup(data: SignupData): Promise<User> {
    if (this.users.has(data.email)) {
      throw new AuthError(
        'Email already in use',
        'email-exists'
      );
    }

    if (data.password.length < 6) {
      throw new AuthError(
        'Password must be at least 6 characters',
        'weak-password'
      );
    }

    const user: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      displayName: data.displayName,
    };

    this.users.set(data.email, { password: data.password, user });
    this.currentUser = user;

    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    // Idempotent: calling multiple times is safe
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async resetPassword(email: string): Promise<void> {
    if (!this.users.has(email)) {
      throw new AuthError(
        'No user found with this email',
        'user-not-found'
      );
    }

    // In real implementation: send email
    console.log(`Password reset email sent to ${email}`);
  }
}
```

#### 3. Firebase Adapter

```typescript
// packages/core/src/implementations/adapters/firebase/FirebaseAuthAdapter.ts

import { injectable } from 'tsyringe';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { IAuthService, User, LoginCredentials, SignupData, AuthError } from '../../../contracts/auth';

@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  private auth = getAuth();

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async signup(data: SignupData): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      });

      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      // Logout failures are rare, but log them
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw this.mapFirebaseError(error);
    }
  }

  /**
   * Map Firebase user to our User interface
   */
  private mapFirebaseUser(firebaseUser: any): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName ?? undefined,
      photoURL: firebaseUser.photoURL ?? undefined,
    };
  }

  /**
   * Map Firebase errors to our AuthError with consistent codes
   */
  private mapFirebaseError(error: any): AuthError {
    const errorMap: Record<string, string> = {
      'auth/invalid-email': 'invalid-credentials',
      'auth/user-disabled': 'user-disabled',
      'auth/user-not-found': 'invalid-credentials',
      'auth/wrong-password': 'invalid-credentials',
      'auth/email-already-in-use': 'email-exists',
      'auth/weak-password': 'weak-password',
      'auth/network-request-failed': 'network-error',
    };

    const code = errorMap[error.code] || 'unknown-error';
    return new AuthError(error.message, code, error);
  }
}
```

#### 4. DI Tokens

```typescript
// packages/core/src/di/types/tokens.ts

/**
 * Dependency Injection tokens
 * Use Symbol.for() to ensure uniqueness across modules
 */
export const TYPES = {
  // Auth Services
  IAuthService: Symbol.for('IAuthService'),

  // Payment Services
  IPaymentService: Symbol.for('IPaymentService'),

  // Data Services
  IDataService: Symbol.for('IDataService'),
  IUserRepository: Symbol.for('IUserRepository'),
  IProductRepository: Symbol.for('IProductRepository'),

  // Analytics
  IAnalyticsService: Symbol.for('IAnalyticsService'),

  // Utilities
  ILogger: Symbol.for('ILogger'),
  IValidator: Symbol.for('IValidator'),
};
```

#### 5. Container Configuration

```typescript
// packages/core/src/di/containers/clientAContainer.ts

import { container, DependencyContainer } from 'tsyringe';
import { TYPES } from '../types/tokens';

// Contracts
import { IAuthService } from '../../contracts/auth';
import { IPaymentService } from '../../contracts/payment';
import { IAnalyticsService } from '../../contracts/analytics';

// Implementations - Client A uses Firebase + Stripe + Mixpanel
import { FirebaseAuthAdapter } from '../../implementations/adapters/firebase/FirebaseAuthAdapter';
import { StripePaymentAdapter } from '../../implementations/adapters/stripe/StripePaymentAdapter';
import { MixpanelAnalyticsAdapter } from '../../implementations/adapters/mixpanel/MixpanelAnalyticsAdapter';

/**
 * DI Container for Client A
 *
 * Configuration:
 * - Auth: Firebase
 * - Payment: Stripe
 * - Analytics: Mixpanel
 */
export const createClientAContainer = (): DependencyContainer => {
  const clientAContainer = container.createChildContainer();

  // Register Auth Service
  clientAContainer.register<IAuthService>(TYPES.IAuthService, {
    useClass: FirebaseAuthAdapter,
  });

  // Register Payment Service
  clientAContainer.register<IPaymentService>(TYPES.IPaymentService, {
    useClass: StripePaymentAdapter,
  });

  // Register Analytics Service
  clientAContainer.register<IAnalyticsService>(TYPES.IAnalyticsService, {
    useClass: MixpanelAnalyticsAdapter,
  });

  return clientAContainer;
};
```

```typescript
// packages/core/src/di/containers/clientBContainer.ts

import { container, DependencyContainer } from 'tsyringe';
import { TYPES } from '../types/tokens';

// Same contracts
import { IAuthService } from '../../contracts/auth';
import { IPaymentService } from '../../contracts/payment';
import { IAnalyticsService } from '../../contracts/analytics';

// Different implementations - Client B uses Supabase + Custom + Custom
import { SupabaseAuthAdapter } from '../../implementations/adapters/supabase/SupabaseAuthAdapter';
import { CustomPaymentService } from '../../implementations/custom/payment/CustomPaymentService';
import { CustomAnalyticsService } from '../../implementations/custom/analytics/CustomAnalyticsService';

/**
 * DI Container for Client B
 *
 * Configuration:
 * - Auth: Supabase
 * - Payment: Custom (self-developed)
 * - Analytics: Custom (self-developed)
 */
export const createClientBContainer = (): DependencyContainer => {
  const clientBContainer = container.createChildContainer();

  // Register Auth Service - Different implementation!
  clientBContainer.register<IAuthService>(TYPES.IAuthService, {
    useClass: SupabaseAuthAdapter, // ✅ Same interface, different provider
  });

  // Register Payment Service - Custom implementation!
  clientBContainer.register<IPaymentService>(TYPES.IPaymentService, {
    useClass: CustomPaymentService, // ✅ Self-developed
  });

  // Register Analytics Service - Custom implementation!
  clientBContainer.register<IAnalyticsService>(TYPES.IAnalyticsService, {
    useClass: CustomAnalyticsService, // ✅ Self-developed
  });

  return clientBContainer;
};
```

### Layer 1 Summary

**What it provides:**
- ✅ Pure business logic interfaces (contracts)
- ✅ Multiple implementations (custom + adapters)
- ✅ DI configuration per client
- ✅ React integration hooks

**Key benefit:**
Apps using this layer can switch between Firebase, Supabase, Auth0, etc. **without changing a single line of application code**.

---

## Layer 2: @studio/ui-primitives (Headless UI Hooks)

### Purpose
Headless UI logic - hooks providing behavior without styling. Completely UI-framework agnostic.

### Complete File Structure

```
packages/ui-primitives/
├── src/
│   ├── contracts/                          # Hook interfaces
│   │   ├── button/
│   │   │   ├── IUseButton.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── input/
│   │   │   ├── IUseInput.ts
│   │   │   ├── IUseForm.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── modal/
│   │   │   ├── IUseModal.ts
│   │   │   ├── IUseDialog.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── dropdown/
│   │   │   ├── IUseDropdown.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── implementations/
│   │   ├── custom/                        # Self-developed hooks
│   │   │   ├── button/
│   │   │   │   ├── useCustomButton.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── input/
│   │   │   │   ├── useCustomInput.ts
│   │   │   │   ├── useCustomForm.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── modal/
│   │   │       ├── useCustomModal.ts
│   │   │       └── index.ts
│   │   │
│   │   └── adapters/                      # Wrappers for third-party
│   │       ├── radix/
│   │       │   ├── useRadixButton.ts
│   │       │   ├── useRadixModal.ts
│   │       │   └── index.ts
│   │       │
│   │       ├── headlessui/
│   │       │   ├── useHeadlessUIDropdown.ts
│   │       │   └── index.ts
│   │       │
│   │       └── react-aria/
│   │           ├── useAriaButton.ts
│   │           └── index.ts
│   │
│   ├── di/
│   │   ├── tokens.ts
│   │   ├── containers/
│   │   │   ├── baseContainer.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── accessibility.ts
│   │   ├── keyboard.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

### Detailed Code Examples

#### 1. Hook Contract

```typescript
// packages/ui-primitives/src/contracts/button/IUseButton.ts

export interface ButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ButtonState {
  isPressed: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDisabled: boolean;
}

export interface ButtonHandlers {
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onHoverIn: () => void;
  onHoverOut: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Headless button hook interface
 * Provides all button behavior without styling
 */
export interface IUseButton {
  (props: ButtonProps): {
    state: ButtonState;
    handlers: ButtonHandlers;
    ariaProps: {
      role: string;
      'aria-disabled'?: boolean;
      'aria-pressed'?: boolean;
      tabIndex: number;
    };
  };
}
```

#### 2. Custom Implementation

```typescript
// packages/ui-primitives/src/implementations/custom/button/useCustomButton.ts

import { useState, useCallback } from 'react';
import { ButtonProps, ButtonState, ButtonHandlers, IUseButton } from '../../../contracts/button';

export const useCustomButton: IUseButton = (props) => {
  const { disabled = false, loading = false, onPress, type = 'button' } = props;

  // State
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || loading;

  // Handlers
  const handlePress = useCallback(() => {
    if (isDisabled) return;
    onPress?.();
  }, [isDisabled, onPress]);

  const handlePressIn = useCallback(() => {
    if (isDisabled) return;
    setIsPressed(true);
  }, [isDisabled]);

  const handlePressOut = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleHoverIn = useCallback(() => {
    if (isDisabled) return;
    setIsHovered(true);
  }, [isDisabled]);

  const handleHoverOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    if (isDisabled) return;
    setIsFocused(true);
  }, [isDisabled]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const state: ButtonState = {
    isPressed,
    isHovered,
    isFocused,
    isDisabled,
  };

  const handlers: ButtonHandlers = {
    onPress: handlePress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const ariaProps = {
    role: 'button',
    'aria-disabled': isDisabled || undefined,
    'aria-pressed': type === 'button' ? isPressed || undefined : undefined,
    tabIndex: isDisabled ? -1 : 0,
  };

  return { state, handlers, ariaProps };
};
```

#### 3. Third-Party Adapter (Radix)

```typescript
// packages/ui-primitives/src/implementations/adapters/radix/useRadixButton.ts

import { useButton as useRadixButtonPrimitive } from '@radix-ui/react-button';
import { ButtonProps, IUseButton } from '../../../contracts/button';

/**
 * Adapter for Radix UI button
 * Wraps Radix's useButton to match our IUseButton interface
 */
export const useRadixButton: IUseButton = (props) => {
  const { disabled = false, loading = false, onPress, type = 'button' } = props;

  // Use Radix's hook
  const radixResult = useRadixButtonPrimitive({
    disabled: disabled || loading,
    onClick: onPress,
    type,
  });

  // Map Radix's output to our interface
  return {
    state: {
      isPressed: radixResult.isPressed,
      isHovered: radixResult.isHovered,
      isFocused: radixResult.isFocused,
      isDisabled: disabled || loading,
    },
    handlers: {
      onPress: radixResult.onClick,
      onPressIn: radixResult.onMouseDown,
      onPressOut: radixResult.onMouseUp,
      onHoverIn: radixResult.onMouseEnter,
      onHoverOut: radixResult.onMouseLeave,
      onFocus: radixResult.onFocus,
      onBlur: radixResult.onBlur,
    },
    ariaProps: radixResult.ariaProps,
  };
};
```

### Layer 2 Summary

**What it provides:**
- ✅ Headless UI hooks (behavior only, no styling)
- ✅ Accessibility built-in (ARIA, keyboard navigation)
- ✅ Can use custom or third-party (Radix, React Aria, Headless UI)

**Key benefit:**
Change from custom hooks to Radix UI **without changing theme components** (Layer 3).

---

## Layer 3: @studio/ui-themes (Themed Components)

### Purpose
Styled UI components that use Layer 2 hooks for behavior. Each theme is a complete design system.

### Complete File Structure

```
packages/ui-theme-material/              # Material Design theme
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   ├── Input.styles.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.styles.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── index.ts
│   │   └── ThemeProvider.tsx
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json

packages/ui-theme-glassmorphism/          # Alternative theme
├── src/
│   ├── components/
│   │   ├── Button/                      # Same component names!
│   │   │   ├── Button.tsx               # Different styling
│   │   │   ├── Button.styles.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── Input/
│   │   └── Modal/
│   │
│   ├── theme/
│   │   ├── effects.ts                   # Glass blur effects
│   │   ├── colors.ts                    # Different colors
│   │   └── index.ts
│   │
│   └── index.ts
│
└── package.json
```

### Detailed Code Examples

#### 1. Material Design Button

```typescript
// packages/ui-theme-material/src/components/Button/Button.tsx

import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { useService } from '@studio/core/react';
import { IUseButton, ButtonProps } from '@studio/ui-primitives/contracts/button';
import { PRIMITIVE_TYPES } from '@studio/ui-primitives/di/tokens';
import { styles } from './Button.styles';

export interface MaterialButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Material Design Button Component
 *
 * Uses headless button hook from Layer 2 for behavior
 * Adds Material Design styling
 */
export const Button: React.FC<MaterialButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading,
  ...buttonProps
}) => {
  // ✅ Get hook from DI (could be custom or Radix)
  const useButtonHook = useService<IUseButton>(PRIMITIVE_TYPES.IUseButton);

  // Use the hook
  const { state, handlers, ariaProps } = useButtonHook({
    ...buttonProps,
    loading,
  });

  return (
    <Pressable
      onPress={handlers.onPress}
      onPressIn={handlers.onPressIn}
      onPressOut={handlers.onPressOut}
      onHoverIn={handlers.onHoverIn}
      onHoverOut={handlers.onHoverOut}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      style={[
        styles.base,
        styles[variant],
        styles[color],
        styles[size],
        state.isDisabled && styles.disabled,
        state.isPressed && styles.pressed,
        state.isHovered && styles.hovered,
      ]}
      accessibilityRole={ariaProps.role}
      accessibilityState={{ disabled: state.isDisabled }}
      accessible
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[styles.text, styles[`${color}Text`]]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};
```

```typescript
// packages/ui-theme-material/src/components/Button/Button.styles.ts

import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  base: {
    borderRadius: 4,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // Material elevation
  },

  // Variants
  contained: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  outlined: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    backgroundColor: 'transparent',
    elevation: 0,
  },

  // Colors
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  error: {
    backgroundColor: colors.error,
  },

  // Sizes
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },

  // States
  disabled: {
    opacity: 0.38,
  },
  pressed: {
    opacity: 0.87,
  },
  hovered: {
    elevation: 4,
  },

  // Text
  text: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.75,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  errorText: {
    color: 'white',
  },
});
```

#### 2. Glassmorphism Button (Alternative Theme)

```typescript
// packages/ui-theme-glassmorphism/src/components/Button/Button.tsx

import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { BlurView } from 'expo-blur';
import { useService } from '@studio/core/react';
import { IUseButton, ButtonProps } from '@studio/ui-primitives/contracts/button';
import { PRIMITIVE_TYPES } from '@studio/ui-primitives/di/tokens';
import { styles } from './Button.styles';

export interface GlassButtonProps extends ButtonProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid';
  intensity?: 'light' | 'medium' | 'strong';
}

/**
 * Glassmorphism Button Component
 *
 * Uses SAME headless hook as Material button
 * Different styling (frosted glass effect)
 */
export const Button: React.FC<GlassButtonProps> = ({
  children,
  variant = 'glass',
  intensity = 'medium',
  loading,
  ...buttonProps
}) => {
  // ✅ Same hook resolution as Material button!
  const useButtonHook = useService<IUseButton>(PRIMITIVE_TYPES.IUseButton);
  const { state, handlers, ariaProps } = useButtonHook({
    ...buttonProps,
    loading,
  });

  const blurIntensity = {
    light: 20,
    medium: 50,
    strong: 80,
  }[intensity];

  if (variant === 'glass') {
    return (
      <Pressable
        onPress={handlers.onPress}
        style={[
          styles.base,
          state.isDisabled && styles.disabled,
        ]}
      >
        <BlurView
          intensity={blurIntensity}
          tint="light"
          style={styles.blur}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.text}>{children}</Text>
          )}
        </BlurView>
      </Pressable>
    );
  }

  // Solid variant (fallback)
  return (
    <Pressable
      onPress={handlers.onPress}
      style={[styles.base, styles.solid]}
    >
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};
```

### Layer 3 Summary

**What it provides:**
- ✅ Fully styled UI components
- ✅ Multiple theme packages (Material, Glassmorphism, Corporate, etc.)
- ✅ Same component names across themes

**Key benefit:**
Switch entire design system by changing import:
```typescript
// Client A
import { Button } from '@studio/ui-theme-material';

// Client B
import { Button } from '@studio/ui-theme-glassmorphism';

// ✅ App code unchanged!
```

---

## Layer 4: @studio/features (Feature Modules)

### Purpose
Complete user-facing features combining Layer 1-3. Self-contained modules with screens, logic, and UI.

### Complete File Structure

```
packages/features-auth-flow/
├── src/
│   ├── contracts/
│   │   ├── IAuthFlow.ts                 # Feature-level contract
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── implementations/
│   │   ├── custom/
│   │   │   ├── EmailPasswordAuthFlow.ts
│   │   │   ├── SocialAuthFlow.ts
│   │   │   └── index.ts
│   │   │
│   │   └── adapters/
│   │       ├── firebase/
│   │       │   └── FirebaseAuthFlowAdapter.ts
│   │       │
│   │       └── auth0/
│   │           └── Auth0FlowAdapter.ts
│   │
│   ├── screens/                         # Feature screens
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   ├── ResetPasswordScreen.tsx
│   │   └── index.ts
│   │
│   ├── components/                      # Feature-specific components
│   │   ├── SocialLoginButtons.tsx
│   │   ├── PasswordStrengthIndicator.tsx
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useAuthFlow.ts
│   │   └── index.ts
│   │
│   ├── di/
│   │   ├── tokens.ts
│   │   ├── container.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

### Detailed Code Examples

#### 1. Feature Contract

```typescript
// packages/features-auth-flow/src/contracts/IAuthFlow.ts

export interface AuthFlowResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface AuthFlowConfig {
  enableSocialLogin?: boolean;
  providers?: ('google' | 'apple' | 'facebook')[];
  requireEmailVerification?: boolean;
}

/**
 * Authentication flow interface
 * Orchestrates complete login/signup experience
 */
export interface IAuthFlow {
  /**
   * Initialize auth flow with configuration
   */
  initialize(config: AuthFlowConfig): Promise<void>;

  /**
   * Perform login flow
   */
  loginWithEmail(email: string, password: string): Promise<AuthFlowResult>;

  /**
   * Perform signup flow
   */
  signupWithEmail(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthFlowResult>;

  /**
   * Social login (if enabled)
   */
  loginWithProvider(provider: string): Promise<AuthFlowResult>;

  /**
   * Password reset flow
   */
  initiatePasswordReset(email: string): Promise<void>;
}
```

#### 2. Login Screen (Using All 3 Lower Layers)

```typescript
// packages/features-auth-flow/src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useService } from '@studio/core/react';
import { IAuthService } from '@studio/core/contracts/auth';
import { TYPES } from '@studio/core/di/types/tokens';

// ✅ Layer 3: Themed components (Material or Glassmorphism)
import { Button, Input } from '@studio/ui-theme'; // Resolved at build time!

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Layer 1: Business logic service (Firebase, Supabase, or Auth0)
  const authService = useService<IAuthService>(TYPES.IAuthService);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await authService.login({ email, password });
      Alert.alert('Success', `Welcome ${user.displayName}!`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      {/* ✅ Layer 3: Input component (uses Layer 2 hook internally) */}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginTop: 16 }}
      />

      {/* ✅ Layer 3: Button component (uses Layer 2 hook internally) */}
      <Button
        onPress={handleLogin}
        loading={loading}
        disabled={!email || !password}
        style={{ marginTop: 24 }}
      >
        Login
      </Button>
    </View>
  );
};
```

### Layer 4 Summary

**What it provides:**
- ✅ Complete features with screens
- ✅ Uses all 3 lower layers
- ✅ Feature-level contracts for flexibility

**Key benefit:**
Swap entire auth flow (Firebase Auth UI vs Auth0 Lock vs Custom) **without changing screens**.

---

## Layer Interaction Example

```typescript
/**
 * Complete flow when user clicks "Login" button:
 *
 * 1. User presses Button in LoginScreen (Layer 4)
 *    ↓
 * 2. Button component from Layer 3 uses useButton hook from Layer 2
 *    ↓
 * 3. useButton hook (could be custom or Radix) provides press behavior
 *    ↓
 * 4. Button calls handleLogin() which uses IAuthService from Layer 1
 *    ↓
 * 5. IAuthService resolves to Firebase/Supabase/Auth0 adapter
 *    ↓
 * 6. Adapter calls third-party SDK
 *    ↓
 * 7. Result flows back up through layers
 *
 * ✅ At NO point does any layer know about concrete implementations!
 */
```

---

## Complete Project Structure

### Monorepo Organization

```
rn-template/                              # Root monorepo
├── packages/                             # Shared packages (all layers)
│   │
│   ├── core/                            # Layer 1: Business Logic
│   │   ├── src/
│   │   │   ├── contracts/              # Interface definitions
│   │   │   │   ├── IAuthService.ts
│   │   │   │   ├── IPaymentService.ts
│   │   │   │   ├── IDataService.ts
│   │   │   │   ├── IAnalyticsService.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── implementations/        # Concrete implementations
│   │   │   │   ├── custom/            # Self-developed services
│   │   │   │   │   ├── CustomAuthService.ts
│   │   │   │   │   ├── CustomPaymentService.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── adapters/          # Third-party wrappers
│   │   │   │       ├── firebase/
│   │   │   │       │   ├── FirebaseAuthAdapter.ts
│   │   │   │       │   ├── FirestoreDataAdapter.ts
│   │   │   │       │   └── index.ts
│   │   │   │       │
│   │   │   │       ├── supabase/
│   │   │   │       │   ├── SupabaseAuthAdapter.ts
│   │   │   │       │   ├── SupabaseDataAdapter.ts
│   │   │   │       │   └── index.ts
│   │   │   │       │
│   │   │   │       ├── stripe/
│   │   │   │       │   ├── StripePaymentAdapter.ts
│   │   │   │       │   └── index.ts
│   │   │   │       │
│   │   │   │       └── auth0/
│   │   │   │           ├── Auth0Adapter.ts
│   │   │   │           └── index.ts
│   │   │   │
│   │   │   ├── di/                    # Dependency Injection
│   │   │   │   ├── types/
│   │   │   │   │   ├── tokens.ts      # Symbol tokens
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   ├── containers/
│   │   │   │   │   ├── baseContainer.ts
│   │   │   │   │   ├── clientAContainer.ts
│   │   │   │   │   ├── clientBContainer.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── react/                 # React-specific DI
│   │   │   │   ├── DIContext.tsx
│   │   │   │   ├── DIProvider.tsx
│   │   │   │   ├── useDIContainer.ts
│   │   │   │   ├── useService.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── utils/                 # Utility functions
│   │   │   │   ├── logger.ts
│   │   │   │   ├── validation.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── types/                 # TypeScript types
│   │   │   │   ├── auth.ts
│   │   │   │   ├── payment.ts
│   │   │   │   ├── data.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-primitives/                  # Layer 2: Headless UI Hooks
│   │   ├── src/
│   │   │   ├── hooks/
│   │   │   │   ├── useButton.ts
│   │   │   │   ├── useInput.ts
│   │   │   │   ├── useModal.ts
│   │   │   │   ├── useDropdown.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── contracts/             # UI component contracts
│   │   │   │   ├── IButton.ts
│   │   │   │   ├── IInput.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── implementations/
│   │   │   │   ├── custom/           # Custom headless hooks
│   │   │   │   └── adapters/         # Adapt Radix, React Aria, etc.
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-theme-material/              # Layer 3: Material Design Theme
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx         # Uses useButton from primitives
│   │   │   │   ├── Input.tsx          # Uses useInput from primitives
│   │   │   │   ├── Modal.tsx          # Uses useModal from primitives
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── theme/
│   │   │   │   ├── colors.ts
│   │   │   │   ├── typography.ts
│   │   │   │   ├── spacing.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui-theme-glassmorphism/         # Layer 3: Alternative Theme
│   │   ├── src/
│   │   │   ├── components/           # Same component names
│   │   │   │   ├── Button.tsx        # Different styling
│   │   │   │   ├── Input.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── theme/
│   │   │   │   ├── effects.ts        # Glass blur, frosted glass
│   │   │   │   ├── colors.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── package.json
│   │
│   ├── features-auth-flow/             # Layer 4: Auth Feature Module
│   │   ├── src/
│   │   │   ├── contracts/
│   │   │   │   ├── IAuthFlow.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── implementations/
│   │   │   │   ├── custom/
│   │   │   │   │   ├── EmailPasswordAuthFlow.ts
│   │   │   │   │   ├── SocialAuthFlow.ts
│   │   │   │   │   └── index.ts
│   │   │   │   │
│   │   │   │   └── adapters/
│   │   │   │       ├── firebase/
│   │   │   │       │   └── FirebaseAuthFlowAdapter.ts
│   │   │   │       │
│   │   │   │       └── auth0/
│   │   │   │           └── Auth0FlowAdapter.ts
│   │   │   │
│   │   │   ├── screens/              # Feature screens
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── SignupScreen.tsx
│   │   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── di/
│   │   │   │   ├── tokens.ts
│   │   │   │   ├── container.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   └── package.json
│   │
│   └── features-payments/              # Layer 4: Payments Feature
│       ├── src/
│       │   ├── contracts/
│       │   ├── implementations/
│       │   ├── screens/
│       │   ├── di/
│       │   └── index.ts
│       │
│       └── package.json
│
├── apps/                               # Client applications
│   │
│   ├── client-a/                       # Client A app
│   │   ├── src/
│   │   │   ├── di/
│   │   │   │   └── container.ts       # Client-specific DI config
│   │   │   │       # Uses Firebase + Material theme
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── .env.production
│   │   │   # AUTH_PROVIDER=firebase
│   │   │   # THEME=material
│   │   │   # FIREBASE_CONFIG=...
│   │   │
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── client-b/                       # Client B app
│   │   ├── src/
│   │   │   ├── di/
│   │   │   │   └── container.ts       # Different DI config
│   │   │   │       # Uses Supabase + Glassmorphism theme
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── .env.production
│   │   │   # AUTH_PROVIDER=supabase
│   │   │   # THEME=glassmorphism
│   │   │   # SUPABASE_URL=...
│   │   │
│   │   └── package.json
│   │
│   └── client-c/                       # Client C app
│       └── [similar structure]
│
├── docs/                               # Documentation
│   ├── di-architecture/
│   │   ├── README.md
│   │   ├── essential-guide.md
│   │   ├── advanced-patterns.md
│   │   └── quick-reference.md
│   │
│   ├── studio-architecture.md
│   └── [other docs]
│
├── .github/
│   └── workflows/
│       ├── build-client-a.yml         # Client A CI/CD
│       ├── build-client-b.yml         # Client B CI/CD
│       └── build-client-c.yml         # Client C CI/CD
│
├── package.json                        # Root package.json
├── turbo.json                          # Turborepo config
├── tsconfig.base.json                  # Base TypeScript config
└── README.md
```

### Key Organizational Principles

**1. Clear Layer Separation**
- Each layer is its own package
- Depends only on layers below
- No circular dependencies

**2. Interface-First Design**
- Every package has `contracts/` directory
- Implementations in separate directory
- Third-party adapters isolated

**3. Per-Client Customization**
- Each app has own DI container configuration
- Environment variables control service selection
- Same codebase, different implementations

**4. Scalability**
- Easy to add new clients (copy app template)
- Easy to add new themes (copy theme package)
- Easy to swap providers (change container config)

**5. Maintainability**
- Monorepo keeps everything in sync
- Shared packages ensure consistency
- Clear naming convention

### Example: Adding a New Client

```bash
# 1. Copy client template
cp -r apps/client-a apps/client-d

# 2. Update DI container
# apps/client-d/src/di/container.ts
container.register<IAuthService>(TYPES.IAuthService, {
  useClass: Auth0Adapter,  // Different provider
});

# 3. Update environment
# apps/client-d/.env.production
AUTH_PROVIDER=auth0
THEME=material
AUTH0_DOMAIN=client-d.auth0.com

# 4. Build
yarn workspace client-d build

# Done! New client with different auth provider
```

### Example: Switching Theme for Existing Client

```typescript
// apps/client-a/src/di/container.ts

// Before: Material theme
import { Button } from '@studio/ui-theme-material';

// After: Glassmorphism theme (1 line change)
import { Button } from '@studio/ui-theme-glassmorphism';

// Component code unchanged! Same API, different styling
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
