# Dependency Injection (DI) Architecture Documentation

**Last Updated**: 2025-12-27
**Version**: 2.1.0

## Overview

This directory contains comprehensive documentation for the studio's Dependency Injection (DI) architecture, designed to support multi-client app development with pure abstraction principles.

**Core Principle**: Application code depends ONLY on interfaces, never on concrete implementations. This enables seamless switching between service providers (Firebase ↔ Supabase ↔ Auth0) without changing application code.

## Architecture Summary

- **4-Layer Structure**: Core → Primitives → Themes → Features
- **DI Container**: TSyringe (React Native optimized, 5KB vs InversifyJS 30KB)
- **Lifecycle**: Build-time container composition via environment variables
- **Pattern**: Adapter pattern wrapping all third-party SDKs
- **Performance**: ~0.002ms overhead per resolve (cached singleton)

## Documentation Tiers

This documentation follows a progressive learning approach with 3 tiers:

### 📘 [Tier 1: Essential Production Guide](./essential-guide.md)
**Target**: All developers implementing DI
**Reading Time**: ~90 minutes
**Size**: ~2,000 lines

**What's inside**:
- ⚡ Quick Start (5-10 min setup)
- 🧠 Core Concepts (pure abstraction, 4-layer architecture, lifecycle)
- ⚛️ React Integration (DIProvider, useService hook, component examples)
- 🔒 Security Best Practices (token storage, service validation, debug mode)
- ⚡ Performance & Optimization (benchmarks, memory, code splitting)
- 🚀 CI/CD Integration (GitHub Actions, container validation, secrets)
- 📊 Observability & Monitoring (instrumentation, health checks, error tracking)
- ✅ Pre-Launch Checklist
- 🔧 Common Patterns (fallback, retry, caching)
- 🐛 Troubleshooting Guide

**Start here if**: You're implementing DI for the first time or need production deployment guidance.

---

### 📗 [Tier 2: Advanced Patterns Reference](./advanced-patterns.md)
**Target**: Senior developers, architects, complex multi-client scenarios
**Reading Time**: ~120 minutes
**Size**: ~2,800 lines

**What's inside**:
- 🧪 Contract Testing & Validation (shared test suites, runtime validation)
- 💾 Memory Management & Lifecycle (singleton leaks, cleanup patterns, profiling)
- 📦 Package Versioning Strategy (Changesets, breaking changes, deprecation)
- 📴 Offline-First Patterns (queue management, cache sync, conflict resolution)
- 📱 Platform-Specific Implementations (iOS/Android/Web adapters)
- 🎛️ Feature Flags & A/B Testing (LaunchDarkly integration, dynamic switching)
- 🎨 Service Decorator Pattern (logging, caching, retry decorators)
- ❌ Anti-Patterns & When NOT to Use DI
- 🕸️ Dependency Graph Visualization (Madge, Mermaid, circular detection)
- 🚨 Production Incident Response (runbooks, rollback, health checks)

**Start here if**: You need advanced patterns, debugging complex issues, or handling edge cases.

---

### 📙 [Tier 3: Quick Reference](./quick-reference.md)
**Target**: Quick lookups, experienced developers
**Reading Time**: ~5 minutes per section
**Size**: ~250 lines

**What's inside**:
- 📋 Cheat sheets (register, resolve, define interface)
- 🔍 Quick troubleshooting (common errors and fixes)
- 💻 Code snippets (container, provider, adapter templates)
- 📊 Performance benchmarks table
- ✅ Security checklist
- 🧪 Testing patterns (unit, integration, contract tests)
- 🚀 CI/CD examples (multi-client builds)
- 🎨 Decorator pattern template
- 🔄 Migration guide (hardcoded → DI)
- ⚠️ Common pitfalls table
- ❓ FAQ section

**Start here if**: You know DI basics and need a quick reference or code template.

---

## Learning Path

```
New to DI?
  ↓
📘 Tier 1: Essential Production Guide
  ↓
Build your first DI-based feature
  ↓
Need advanced patterns?
  ↓
📗 Tier 2: Advanced Patterns Reference
  ↓
Implement complex scenarios
  ↓
Daily reference?
  ↓
📙 Tier 3: Quick Reference
```

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
yarn add tsyringe reflect-metadata
```

### 2. Define Interface

```typescript
// packages/core/src/interfaces/IAuthService.ts
export interface IAuthService {
  login(email: string, password: string): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
}
```

### 3. Create Adapter

```typescript
// packages/core-firebase/src/auth/FirebaseAuthAdapter.ts
import { injectable } from 'tsyringe';

@injectable()
export class FirebaseAuthAdapter implements IAuthService {
  async login(email: string, password: string): Promise<AuthUser> {
    const result = await firebase.signInWithEmailAndPassword(email, password);
    return { userId: result.user.uid, email: result.user.email };
  }
}
```

### 4. Register in Container

```typescript
// src/di/container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';

container.register<IAuthService>(TYPES.IAuthService, {
  useClass: FirebaseAuthAdapter,
});
```

### 5. Use in Components

```typescript
import { useService } from '@/hooks/useService';

const LoginScreen = () => {
  const authService = useService<IAuthService>(TYPES.IAuthService);

  const handleLogin = async () => {
    const user = await authService.login(email, password);
  };
};
```

**🎯 Result**: Component never knows if it's using Firebase, Supabase, or Auth0!

## Key Benefits

✅ **Zero Code Changes**: Switch providers by changing one line in container
✅ **Type-Safe**: Full TypeScript support with interface contracts
✅ **Testable**: Easy mocking for unit tests
✅ **Scalable**: Support 20+ clients with different providers
✅ **Maintainable**: Clear separation of concerns
✅ **Performant**: ~0.002ms overhead (negligible)

## Related Documentation

- [Studio Architecture](../studio-architecture.md) - 4-layer component library architecture
- [System Architecture](../system-architecture.md) - Overall system design
- [Code Standards](../code-standards.md) - Coding conventions
- [Design Guidelines](../design-guidelines.md) - UI/UX patterns

## Historical Versions

For reference, previous iterations of this documentation (kept in `plans/reports/`):

- [v1.0: Pure Abstraction DI Architecture](../../plans/reports/brainstorm-251227-0046-pure-abstraction-di-architecture.md) - Original pure abstraction guide with basic concepts
- [v2.0: Comprehensive DI Architecture](../../plans/reports/brainstorm-251227-0104-pure-abstraction-di-comprehensive.md) - Enhanced version with React integration and advanced patterns

**Note**: The current 3-tier documentation supersedes these historical versions. Use them only for reference or to understand the evolution of the architecture.

## Support

- **Issues**: Found a gap in documentation? Open an issue
- **Contributions**: Improvements welcome via PR
- **Questions**: Ask in #architecture Slack channel

---

**Start with**: [📘 Essential Production Guide](./essential-guide.md) → [📗 Advanced Patterns](./advanced-patterns.md) → [📙 Quick Reference](./quick-reference.md)
