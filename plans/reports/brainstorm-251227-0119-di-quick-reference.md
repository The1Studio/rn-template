# DI Architecture: Quick Reference (Tier 3)

**Document Purpose**: Rapid lookups, code snippets, troubleshooting, cheat sheets
**Target Audience**: All developers needing quick answers
**Reading Time**: ~5 minutes per section
**Version**: 2.1.0
**Last Updated**: 2025-12-27

---

## Cheat Sheet: Common Patterns

### Register a Service

```typescript
// Singleton (default, recommended)
container.register<IAuthService>(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
});

// Transient (new instance every resolve)
container.register<IValidator>(TYPES.IValidator, {
  useClass: EmailValidator,
  lifecycle: Lifecycle.Transient,
});

// Factory (custom creation logic)
container.register<IPaymentService>(TYPES.IPaymentService, {
  useFactory: (c) => {
    const config = c.resolve<IConfig>(TYPES.IConfig);
    return new StripeAdapter(config.stripeKey);
  },
});
```

### Resolve a Service

```typescript
// In container setup
const authService = container.resolve<IAuthService>(TYPES.IAuthService);

// In React components
const LoginScreen = () => {
  const authService = useService<IAuthService>(TYPES.IAuthService);
};

// In other services (constructor injection)
@injectable()
export class UserService {
  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService
  ) {}
}
```

### Define Interface & Token

```typescript
// 1. Define interface
export interface IAuthService {
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}

// 2. Create token
export const TYPES = {
  IAuthService: Symbol.for('IAuthService'),
};

// 3. Implement
@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    // Firebase-specific code
  }
}
```

---

## Quick Troubleshooting

### Error: "Cannot resolve service for token"

**Cause**: Service not registered in container.

**Fix**:
```typescript
// Check: Is service registered?
container.register<IAuthService>(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter, // ✅ Add this
});
```

---

### Error: "Circular dependency detected"

**Cause**: Service A → Service B → Service A

**Fix**:
```typescript
// Option 1: Extract shared logic to third service
@injectable()
export class SharedBridge {
  // Common functionality
}

// Option 2: Lazy injection
@injectable()
export class ServiceA {
  private _serviceB: IServiceB | null = null;

  get serviceB(): IServiceB {
    if (!this._serviceB) {
      this._serviceB = container.resolve<IServiceB>(TYPES.IServiceB);
    }
    return this._serviceB;
  }
}
```

---

### Error: "Service returns undefined"

**Cause**: Wrong lifecycle (transient service with state).

**Fix**:
```typescript
// Change from transient to singleton
container.register<ICartService>(TYPES.ICartService, {
  useClass: CartService,
  lifecycle: Lifecycle.Singleton, // ✅ Was Transient
});
```

---

### Memory leaks in singleton services

**Cause**: Event listeners never removed.

**Fix**:
```typescript
@singleton()
export class AnalyticsService {
  private listeners = new Set<Function>();

  addEventListener(listener: Function): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // ✅ Return unsubscribe
  }

  dispose() {
    this.listeners.clear(); // ✅ Cleanup
  }
}

// React component
useEffect(() => {
  const unsubscribe = analytics.addEventListener(listener);
  return () => unsubscribe(); // ✅ Cleanup on unmount
}, []);
```

---

## Code Snippets

### Create DI Container

```typescript
// src/di/container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';

export const createDIContainer = () => {
  // Register services
  container.register<IAuthService>(TYPES.IAuthService, {
    useClass: process.env.AUTH_PROVIDER === 'supabase'
      ? SupabaseAuthAdapter
      : FirebaseAuthAdapter,
  });

  container.register<IPaymentService>(TYPES.IPaymentService, {
    useClass: StripePaymentAdapter,
  });

  return container;
};
```

### React Context Provider

```typescript
// src/providers/DIProvider.tsx
const DIContext = createContext<DependencyContainer | null>(null);

export const DIProvider = ({ children }) => {
  const container = useMemo(() => createDIContainer(), []);

  return (
    <DIContext.Provider value={container}>
      {children}
    </DIContext.Provider>
  );
};

// src/hooks/useService.ts
export const useDIContainer = () => {
  const container = useContext(DIContext);
  if (!container) throw new Error('DIProvider not found');
  return container;
};

export function useService<T>(token: symbol): T {
  const container = useDIContainer();
  return useMemo(() => container.resolve<T>(token), [container, token]);
}
```

### Service with Constructor Injection

```typescript
@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IAuthService) private auth: IAuthService,
    @inject(TYPES.IDataService) private data: IDataService,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  async getProfile(userId: string): Promise<UserProfile> {
    this.logger.info('Fetching profile', { userId });
    const user = await this.data.getUser(userId);
    return user;
  }
}
```

### Adapter Pattern Template

```typescript
// Interface (never changes)
export interface IAuthService {
  login(email: string, password: string): Promise<AuthUser>;
}

// Firebase adapter
@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    const result = await firebase.signInWithEmailAndPassword(email, password);
    return { userId: result.user.uid, email: result.user.email };
  }
}

// Supabase adapter
@injectable()
export class SupabaseAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await supabase.auth.signInWithPassword({ email, password });
    return { userId: data.user.id, email: data.user.email };
  }
}

// Registration (one line change to switch)
container.register<IAuthService>(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter, // ← Change to SupabaseAuthAdapter
});
```

---

## Performance Benchmarks

| Operation | Time | Notes |
|-----------|------|-------|
| Container creation | ~2ms | One-time on app start |
| First resolve (singleton) | ~0.15ms | Includes instantiation |
| Cached resolve (singleton) | ~0.002ms | Negligible overhead |
| Transient resolve | ~0.1ms | Every time |
| DI overhead vs direct | ~0.001ms | Almost zero |

**Recommendation**: Use singletons for 95% of services. DI overhead is negligible.

---

## Security Checklist

- [ ] Tokens stored in SecureStore (not AsyncStorage)
- [ ] Service registration validation in dev mode
- [ ] Debug mode disabled in production (`__DEV__ = false`)
- [ ] No PII in analytics events
- [ ] Third-party SDKs audited
- [ ] Secrets in environment variables (not hardcoded)
- [ ] Container creation happens once (not per component)

---

## Testing Patterns

### Unit Test a Service

```typescript
describe('FirebaseAuthAdapter', () => {
  let authService: IAuthService;

  beforeEach(() => {
    authService = new FirebaseAuthAdapter();
  });

  it('should login successfully', async () => {
    const user = await authService.login('test@test.com', 'password');
    expect(user.userId).toBeDefined();
    expect(user.email).toBe('test@test.com');
  });
});
```

### Test with DI Container

```typescript
describe('UserService', () => {
  let container: DependencyContainer;
  let userService: IUserService;

  beforeEach(() => {
    container = createContainer();

    // Register mocks
    container.register<IAuthService>(TYPES.IAuthService, {
      useValue: mockAuthService,
    });

    userService = container.resolve<IUserService>(TYPES.IUserService);
  });

  it('should fetch user profile', async () => {
    const profile = await userService.getProfile('user123');
    expect(profile.userId).toBe('user123');
  });
});
```

### Contract Test Template

```typescript
export const testAuthServiceContract = (
  implementationName: string,
  getImplementation: () => IAuthService
) => {
  describe(`IAuthService Contract: ${implementationName}`, () => {
    let authService: IAuthService;

    beforeEach(() => {
      authService = getImplementation();
    });

    it('login() should return { userId, email }', async () => {
      const result = await authService.login('test@test.com', 'password');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('email');
    });

    it('getCurrentUser() should return null when logged out', async () => {
      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    });
  });
};

// Run against all implementations
testAuthServiceContract('Firebase', () => new FirebaseAuthAdapter());
testAuthServiceContract('Supabase', () => new SupabaseAuthAdapter());
```

---

## Environment Variables

```bash
# .env.client-a
AUTH_PROVIDER=firebase
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=client-a

# .env.client-b
AUTH_PROVIDER=supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=yyy

# .env.client-c
AUTH_PROVIDER=auth0
AUTH0_DOMAIN=client-c.auth0.com
AUTH0_CLIENT_ID=zzz
```

**Load at build time**:
```typescript
// Container selects implementation based on env var
const AuthAdapter = process.env.AUTH_PROVIDER === 'supabase'
  ? SupabaseAuthAdapter
  : FirebaseAuthAdapter;

container.register<IAuthService>(TYPES.IAuthService, {
  useClass: AuthAdapter,
});
```

---

## CI/CD Snippets

### GitHub Actions: Multi-Client Build

```yaml
strategy:
  matrix:
    client: [client-a, client-b, client-c]

steps:
  - name: Load client env
    run: cp .env.${{ matrix.client }} .env

  - name: Build
    run: yarn build

  - name: Test
    run: yarn test
```

### Validate Container on CI

```yaml
- name: Validate DI Container
  run: |
    node -e "
      const { container } = require('./dist/di/container');
      const auth = container.resolve(TYPES.IAuthService);
      console.log('✅ Container valid, IAuthService:', auth.constructor.name);
    "
```

---

## Decorator Pattern

```typescript
// Logging decorator
@injectable()
export class LoggingAuthDecorator implements IAuthService {
  constructor(
    @inject(TYPES.IAuthService) private authService: IAuthService,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {}

  async login(email: string, password: string): Promise<AuthUser> {
    this.logger.info('login called', { email });
    try {
      const result = await this.authService.login(email, password);
      this.logger.info('login succeeded');
      return result;
    } catch (error) {
      this.logger.error('login failed', error);
      throw error;
    }
  }
}

// Register decorated service
container.register<IAuthService>(TYPES.IAuthService, {
  useFactory: (c) => {
    const base = new FirebaseAuthAdapter();
    const logger = c.resolve<ILogger>(TYPES.ILogger);
    return new LoggingAuthDecorator(base, logger);
  },
});
```

---

## Migration Guide

### From Hardcoded to DI

**Before**:
```typescript
import firebase from 'firebase/app';

const LoginScreen = () => {
  const handleLogin = async () => {
    const result = await firebase.signInWithEmailAndPassword(email, password);
  };
};
```

**After**:
```typescript
// 1. Define interface
export interface IAuthService {
  login(email: string, password: string): Promise<AuthUser>;
}

// 2. Create adapter
@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    const result = await firebase.signInWithEmailAndPassword(email, password);
    return { userId: result.user.uid, email: result.user.email };
  }
}

// 3. Register
container.register<IAuthService>(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
});

// 4. Use in component
const LoginScreen = () => {
  const authService = useService<IAuthService>(TYPES.IAuthService);

  const handleLogin = async () => {
    const user = await authService.login(email, password);
  };
};
```

---

## Common Pitfalls

| ❌ Mistake | ✅ Fix |
|-----------|--------|
| Forgot `@injectable()` decorator | Add `@injectable()` to class |
| Forgot `reflect-metadata` import | Add `import 'reflect-metadata'` at app entry |
| Used transient for stateful service | Change to singleton |
| Registered service after resolving | Register all services before first resolve |
| Circular dependency | Extract shared logic to third service |
| Memory leak (listeners not removed) | Return cleanup function from `addEventListener` |
| Direct import of implementation | Import interface, resolve from container |

---

## FAQ

**Q: When should I use DI?**
A: When you need multiple implementations (Firebase vs Supabase), swappable dependencies, or testability.

**Q: When should I NOT use DI?**
A: For simple utilities (date formatting), React components, constants, or pure functions.

**Q: Singleton vs Transient?**
A: Singleton (default) for stateful services. Transient for stateless utilities.

**Q: How do I switch between Firebase and Supabase?**
A: Change one line: `useClass: FirebaseAuthAdapter` → `useClass: SupabaseAuthAdapter`

**Q: Does DI slow down my app?**
A: No. Overhead is ~0.002ms per resolve (cached). Negligible.

**Q: How do I test services?**
A: Unit test directly, or use container with mocked dependencies.

**Q: Can I use DI in React Native?**
A: Yes. Use `tsyringe` (lighter than InversifyJS). Works perfectly.

**Q: What if I need platform-specific implementations?**
A: Create adapters per platform, register based on `Platform.OS`.

---

## Resources

- **Essential Guide**: `/plans/reports/brainstorm-251227-0117-di-essential-production-guide.md`
- **Advanced Patterns**: `/plans/reports/brainstorm-251227-0118-di-advanced-patterns-reference.md`
- **TSyringe Docs**: https://github.com/microsoft/tsyringe
- **Reflect Metadata**: https://www.npmjs.com/package/reflect-metadata

---

## Summary

This quick reference provides:
- ✅ Common patterns (register, resolve, define)
- ✅ Troubleshooting (errors, fixes)
- ✅ Code snippets (container, provider, adapter)
- ✅ Performance benchmarks
- ✅ Security checklist
- ✅ Testing templates
- ✅ CI/CD examples
- ✅ Decorator pattern
- ✅ Migration guide
- ✅ Common pitfalls
- ✅ FAQ

**Need more detail?** See Tier 1 (Essential Production Guide) or Tier 2 (Advanced Patterns Reference).
