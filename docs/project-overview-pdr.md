# Project Overview & Product Development Requirements

## Project Overview

**Project Name:** rn-template
**Type:** React Native Monorepo Template
**Status:** Active Development
**Version:** 0.0.1
**Platform Support:** iOS, Android, Web (via React Native Web)

### Purpose

rn-template is a modern, production-ready React Native monorepo starter template that provides a solid foundation for building scalable mobile applications. It combines Expo's ease of development with the robustness of npm workspaces, TypeScript strict mode, and a comprehensive component library.

### Goals

1. **Rapid Development:** Enable developers to start building features immediately with pre-configured tooling
2. **Code Reusability:** Share utilities, hooks, and components across multiple projects
3. **Type Safety:** Enforce TypeScript strict mode across all packages
4. **Security:** Implement secure-by-default patterns for data persistence and authentication
5. **Scalability:** Support multi-app monorepo structure with clear separation of concerns
6. **Best Practices:** Demonstrate industry-standard patterns for React Native development

---

## Tech Stack & Rationale

### Runtime & Platform

| Component | Version | Rationale |
|-----------|---------|-----------|
| React Native | 0.81.5 | Latest stable version with performance improvements |
| React | 19.1.0 | Newest React with Suspense support and improved hooks |
| Expo | 54.0.30 | Managed service enabling instant deploys, no bare workflow setup |
| New Architecture | Enabled | Future-proofing against upcoming React Native changes |
| Node.js | ≥18.x | LTS with ES module support and modern JavaScript features |
| npm | ≥9.x | Workspace support and modern lock file format |

### Type Safety

| Component | Version | Rationale |
|-----------|---------|-----------|
| TypeScript | 5.9.2 | Strict mode enabled; type inference and type safety |
| ESLint 9 | 9.39.2 | Flat config; enforces code quality and consistency |
| Prettier | 3.7.4 | Code formatting; reduces style debates |

### State Management & Data

| Component | Version | Purpose |
|-----------|---------|---------|
| Zustand | 5.0.9 | Lightweight state management with persist middleware |
| React Query | 5.90.12 | Server state management; caching, sync, deduplication |
| expo-secure-store | 15.0.2 | Native secure storage (iOS Keychain, Android Encrypted) |
| react-hook-form | 7.69.0 | Performant form handling with minimal re-renders |
| Zod | 4.2.1 | Runtime type validation for API responses and forms |

### UI & Animation

| Component | Version | Purpose |
|-----------|---------|---------|
| react-native-reanimated | 4.1.1 | Worklet-based animations; 60 FPS on low-end devices |
| react-native-gesture-handler | 2.28.0 | Native gesture recognition; prerequisite for reanimated |
| react-native-safe-area-context | 5.6.0 | Safe area handling across device notches |
| react-native-screens | 4.16.0 | Native screen management; performance |
| react-native-svg | 15.15.1 | SVG support for icons and illustrations |

### Navigation

| Component | Version | Purpose |
|-----------|---------|---------|
| Expo Router | 6.0.21 | File-based routing (like Next.js); typed routes |

### Development & Build

| Component | Purpose |
|-----------|---------|
| EAS (Expo Application Services) | Cloud builds; internal distribution; app store deployment |
| Metro | JavaScript bundler optimized for React Native |
| Development Builds | Local/EAS testing builds with native modules |

### Architecture Decisions

#### Monorepo Structure

**Decision:** npm workspaces with Git submodules for shared packages

**Rationale:**
- Single repository for coordinated development
- Shared dependencies prevent version conflicts
- Git submodules enable external package updates without npm versioning
- Symlinked workspaces (no build step needed)

**Trade-offs:**
- Submodule complexity vs. single repo simplicity
- Chosen for team flexibility and independent package management

#### State Management Strategy

**Decision:** Zustand for client state, React Query for server state, Zustand persist for persistence

**Rationale:**
- Zustand: Minimal boilerplate, small bundle size, hooks-first API
- React Query: Reduces server state complexity, automatic cache management
- Zustand persist: Works with secure storage natively
- No need for Redux/MobX complexity

#### Secure Storage Implementation

**Decision:** expo-secure-store with Zustand persist adapter

**Rationale:**
- No development build required (works with Expo Go)
- Native security (iOS Keychain, Android Encrypted Shared Preferences)
- Works with Zustand persist middleware
- Suitable for tokens, credentials, small user preferences

**Limitations:**
- 2KB per value limit (use AsyncStorage for larger data)
- All operations are async

#### Form Validation Strategy

**Decision:** react-hook-form + Zod

**Rationale:**
- react-hook-form: Minimal re-renders, excellent UX
- Zod: Runtime validation, TypeScript inference
- Schema-driven approach for consistency
- Native integration with @repo/ui form components

#### API Architecture

**Decision:** Axios client with interceptors for token refresh

**Rationale:**
- Request/response interceptors for auth token injection
- Automatic token refresh with queue management
- Handles 401 responses transparently
- Simpler than alternatives like React Query mutations for basic auth

---

## Architectural Overview

```
rn-template (monorepo)
├── apps/mobile              # Main mobile application
│   ├── src/
│   │   ├── app/            # Expo Router navigation structure
│   │   ├── screens/        # Screen components
│   │   ├── stores/         # Zustand stores (Auth, App, Settings)
│   │   ├── api/            # Axios config & API services
│   │   ├── hooks/          # Custom React hooks (TanStack Query)
│   │   └── components/     # Reusable UI components
│   ├── app.json            # Expo configuration
│   └── eas.json            # EAS build profiles
│
├── packages/
│   ├── core (git submodule)    # @repo/core
│   │   └── 50+ utilities & hooks
│   └── ui (git submodule)      # @repo/ui
│       └── 40+ UI components
│
└── Configuration Files
    ├── metro.config.js      # Metro bundler (monorepo resolution)
    ├── tsconfig.json        # Shared TypeScript config
    └── eslint.config.js     # Shared ESLint rules
```

### Data Flow

1. **User Interaction** → Component → Store/Hook
2. **Server State** → API Service → React Query → Component
3. **Persistence** → Zustand + Secure Storage
4. **Token Management** → Axios Interceptors → Automatic Refresh

---

## Development Principles

### YAGNI (You Aren't Gonna Need It)
- Implement only what's needed now
- Avoid speculative features or over-engineering
- Refactor when actual use cases emerge

### KISS (Keep It Simple, Stupid)
- Favor clarity over cleverness
- Simple solutions before complex ones
- Self-documenting code over heavy comments

### DRY (Don't Repeat Yourself)
- Consolidate duplicate logic
- Reuse components, hooks, utilities
- Maintain single source of truth for shared concepts

### Code Organization
- **File size:** Keep files under 200 lines
- **Naming:** kebab-case for files, camelCase for functions/variables, PascalCase for components/classes
- **Modularity:** One component/function per file (or tightly related exports)
- **Separation of concerns:** Clear boundaries between UI, logic, state, API

### Type Safety
- TypeScript strict mode enabled globally
- Explicit return types for functions and components
- No implicit `any` types
- Type-safe API responses (Zod schemas)

---

## Feature Set

### Implemented

#### Authentication System
- Token-based authentication with refresh flow
- Secure token storage (encrypted)
- Automatic token refresh on 401 responses
- Login/logout functionality
- User state persistence

#### Data Persistence
- Secure storage via expo-secure-store
- Zustand state persistence with encrypted storage
- Token management (access + refresh)

#### API Integration
- Axios HTTP client with interceptors
- Environment-based configuration
- Request/response logging
- Error handling and retry logic

#### Form Handling
- react-hook-form integration
- Zod schema validation
- Form field components from @repo/ui
- Real-time validation feedback

#### State Management
- **useAuthStore:** User, token, authentication state (persisted)
- **useAppStore:** General app-level state (non-persisted)
- **useSettingsStore:** User preferences (persisted)
- Server state via React Query

#### Navigation
- 5 main screens (Home, Explore, Settings, API Test, Playground)
- Tab-based navigation via Expo Router
- Deep linking support
- Type-safe route definitions

#### Components & Patterns
- 40+ UI components via @repo/ui
- 50+ utilities and hooks via @repo/core
- Reanimated animations (smooth, 60 FPS)
- Gesture handling via gesture-handler
- Toast notifications via react-native-toast-message

#### Demonstration
- Playground screen with 40+ component examples
- API test screen for integration verification
- Form examples with validation
- Animation demonstrations

### Planned/Future

- Offline-first synchronization
- Push notification integration
- Advanced caching strategies
- Performance monitoring
- A/B testing framework

---

## Success Criteria

### Development Experience
- [ ] Developers can scaffold new features in <5 minutes
- [ ] All imports have full TypeScript autocomplete
- [ ] Linting errors caught before commit
- [ ] Local development setup working in <10 minutes

### Code Quality
- [ ] 100% TypeScript strict mode compliance
- [ ] ESLint and Prettier checks pass
- [ ] No console errors in development
- [ ] All components under 200 lines

### Performance
- [ ] App startup time <3 seconds (development build)
- [ ] Animations at 60 FPS on low-end devices
- [ ] Bundle size <5MB (production Android build)

### Security
- [ ] All sensitive data encrypted
- [ ] Token refresh flow tested and working
- [ ] No secrets in version control
- [ ] API communication via HTTPS only

### Platform Support
- [ ] iOS 13+ fully functional
- [ ] Android API 24+ fully functional
- [ ] Web builds working (via Expo Web)

---

## Development Workflow

### Setup
1. Clone with submodules: `git clone --recurse-submodules <repo-url>`
2. Install dependencies: `npm install`
3. Start development: `npm run mobile start`

### Development Loop
1. Make code changes
2. Hot reload automatically (Expo)
3. Run linting: `npm run lint`
4. Run formatting: `npm run format`
5. Commit changes: `git commit`

### Building
- **Development:** `npm run mobile start` + Expo Go or development build
- **Preview:** `npm run build:android:preview` for internal testing
- **Production:** `npm run build:android` for app store submission

---

## Dependencies Overview

### Direct Dependencies (20 packages)

**State Management & Data:**
- zustand: Client state
- @tanstack/react-query: Server state
- react-hook-form: Form handling
- zod: Validation

**Native APIs:**
- expo, expo-router, expo-secure-store, expo-constants, expo-linking, expo-status-bar
- react-native-gesture-handler, react-native-reanimated, react-native-screens
- react-native-safe-area-context, react-native-svg

**Utilities:**
- axios: HTTP client
- dayjs: Date parsing (moment.js in @repo/core)
- react-native-toast-message: Notifications
- react-native-ui-datepicker: Date picker component

**Package References:**
- @repo/core: Utilities, hooks, storage
- @repo/ui: UI components

### Development Dependencies (7 packages)

**Type Safety & Linting:**
- typescript, eslint, eslint-config-prettier
- @typescript-eslint/*

**Bundling:**
- Handled by Expo/Metro

### Peer Dependencies (from packages)

- moment: Date/time (in @repo/core)
- expo-secure-store: Secure storage (in @repo/core)
- zustand: State management (in @repo/core)

---

## Deployment Strategy

### Build Profiles (EAS)

| Profile | Purpose | Distribution | Command |
|---------|---------|--------------|---------|
| development | Development builds with debugging | Dev testing | `build:android:dev` |
| preview | Internal testing builds | QA/Testing | `build:android:preview` |
| production | App store release builds | Play Store | `build:android` |

### Platform-Specific Considerations

**iOS:**
- Bundle ID: `com.mobile.app`
- New Architecture enabled
- Requires signing certificate

**Android:**
- Package: `com.mobile.app`
- Edge-to-edge enabled
- Debug keystore included (update for production)

---

## Support & Maintenance

### Documentation Structure
- README.md: Quick start and basic setup
- docs/: Comprehensive documentation
- .claude/: Claude Code configuration and workflows
- plans/reports/: Scout reports for package exploration

### Package Updates
- Scheduled: Monthly security patches
- Major versions: Quarterly (after testing)
- Critical fixes: As needed

### Git Submodule Management
- Updates via: `git submodule update --init --remote`
- New versions: `npm install` after submodule update
- Troubleshooting: See Submodule Troubleshooting in README

---

## Metrics & Monitoring

### Developer Metrics
- Time to first feature (target: <1 hour)
- Time to production deployment (target: <1 day)
- Build success rate (target: >99%)

### App Metrics
- Crash rate (target: <0.1%)
- Authentication failure recovery (target: 100%)
- API response time (target: <1s p95)

### Code Metrics
- TypeScript strict mode compliance: 100%
- ESLint violations: 0 in production
- Test coverage: (not yet implemented)

---

## License

Private (all rights reserved)

---

**Last Updated:** 2025-12-26
**Maintained By:** Development Team
**Next Review:** 2026-03-26
