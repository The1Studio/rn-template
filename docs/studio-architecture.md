# Studio Component Library Architecture: Industry Best Practices

**Date:** 2025-12-27
**Type:** Architecture Brainstorming (Industry Research)
**Status:** Recommended Solution
**Scope:** App development studio component library ecosystem

---

## Executive Summary

**Business Model:** App development studio building multiple client projects

**Vision:** Reusable component library ecosystem to accelerate client app delivery by 70-85% (after initial investment)

**Approach:** 4-layer architecture optimized for studio workflow - build features for clients → extract → reuse → contribute back to library

**Key Difference from Original:** Not 2 products with 2 themes - **marketplace of themes + feature modules** for many client projects

**ROI:** Break even at project #3, massive time savings after

---

## Problem Statement (Refined)

### Real Requirements
1. **Studio workflow** - Build many client apps over time
2. **Component reuse** - Each project 60-80% similar (auth, profile, settings, etc.)
3. **Theme flexibility** - Each client picks different visual style
4. **Contribution cycle** - New features built in projects → extracted → reused
5. **Speed** - Drastically reduce time-to-market for new projects

### Initial Misunderstanding
- ❌ Thought: Building 2 specific products (consumer + enterprise)
- ✅ Reality: Building library ecosystem for unlimited client projects

---

## Industry Research Findings

### Multi-Brand Architecture (2025)

**Source:** [Building Multi-Brand Apps from Single Codebase](https://the-expert-developer.medium.com/react-native-in-2025-building-multi-brand-multi-tenant-apps-from-a-single-codebase-3c01e8650cfc)

**Pattern:** Core app + config-driven brand layer
- Theme configuration (colors, fonts, spacing)
- Assets (logos, images)
- Feature flags per brand
- Strings/translations

**Takeaway:** Config-driven works for variants, but we need more flexibility for truly different clients

---

### Headless UI Pattern

**Sources:**
- [Top Headless UI Libraries 2024](https://www.greatfrontend.com/blog/top-headless-ui-libraries-for-react-in-2024)
- [Radix UI vs Headless UI](https://javascript.plainenglish.io/radix-ui-vs-headless-ui-vs-ariakit-the-headless-component-war-aebead855a94)
- [Headless Component Pattern](https://martinfowler.com/articles/headless-component.html)

**Key Players:** Radix UI, Headless UI, Ariakit

**Pattern:**
- Logic/accessibility in library (focus management, ARIA, keyboard nav)
- Visuals handled by developers
- Separation: library handles behavior, developers handle presentation

**Validation:** Our primitives layer matches industry best practice!

**Radix UI Architecture:**
- Unstyled, accessible primitives
- Full control over styling
- Zero styles shipped
- Developers build themed components on top

**Takeaway:** Headless primitives are proven pattern for flexible design systems

---

### Monorepo Management

**Sources:**
- [Turborepo React Native Setup](https://medium.com/@alex.derville/setting-up-a-react-and-react-native-monorepo-with-turborepo-and-pnpm-8310c1faf18c)
- [Turborepo vs Nx Comparison](https://blog.theodo.com/2022/02/architecting-a-modern-monorepo/)
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)

**Tools:**
- **Turborepo** (Vercel) - Simple, fast, great caching
- **Nx** (Nrwl) - Enterprise-grade, complex, powerful plugins

**Features:**
- Content-aware hashing
- Remote caching (reuse builds across CI)
- Parallel execution
- Dependency graph visualization

**Recommendation for Studio:** Turborepo (simpler, sufficient for most studios)

---

### Copy-Paste Pattern (shadcn/ui)

**Insight:** Revolutionary approach - components aren't npm packages!

**How it works:**
1. Components are templates, not dependencies
2. Developers copy code into their projects
3. Full ownership and customization
4. CLI tool to sync updates

**Pros:**
- Maximum flexibility
- No versioning hell
- Each project controls updates
- Easy customization

**Cons:**
- Code duplication
- Manual update propagation

**Applicability:** Good for truly different products (<50% overlap)

**Our Use Case:** Don't use this - we want shared packages for efficiency

---

### Styling Solutions (2025)

**Gluestack UI v3:** Unstyled components + NativeWind (Tailwind for React Native)
- Modular, unbundled structure
- Style with Tailwind utility classes
- High performance, strong accessibility

**Tamagui:** Cross-platform styling with theme variants
- Built-in theme switching
- Optimized for performance
- Works on iOS, Android, Web

**Takeaway:** Proven libraries exist, but building custom gives more control for studio needs

---

## Recommended Architecture: Studio Component Library

### Package Ecosystem

```
@studio/ (npm scope for all packages)
│
├─ core/                     # Business logic modules
│  ├─ auth/                  # Authentication
│  │  ├─ AuthAPI             # API client
│  │  ├─ authSchemas         # Validation
│  │  └─ tokenStorage        # Secure storage
│  ├─ payments/              # Payment integrations
│  │  ├─ StripeClient
│  │  └─ PayPalClient
│  ├─ analytics/             # Analytics
│  ├─ storage/               # Data persistence
│  └─ utils/                 # Shared utilities
│
├─ ui-primitives/            # Headless component library
│  ├─ hooks/
│  │  ├─ useForm/            # Form state management
│  │  ├─ useModal/           # Modal logic
│  │  ├─ useSelect/          # Select/dropdown logic
│  │  ├─ useDataTable/       # Table logic
│  │  └─ usePagination/      # Pagination
│  ├─ state/
│  │  └─ useModalStore       # UI state (Zustand)
│  └─ contracts/
│     └─ ComponentProps.ts   # TypeScript interfaces
│
├─ ui-themes/                # Theme marketplace
│  ├─ minimal/               # Clean, minimalist
│  │  ├─ components/
│  │  │  ├─ Button.tsx
│  │  │  ├─ Form.tsx
│  │  │  └─ Modal.tsx
│  │  └─ theme/
│  │     ├─ colors.ts
│  │     ├─ typography.ts
│  │     └─ spacing.ts
│  │
│  ├─ corporate/             # Professional, conservative
│  ├─ modern/                # Bold, colorful
│  ├─ playful/               # Fun, animated
│  └─ luxury/                # Premium, elegant (add over time)
│
└─ features/                 # Feature modules
   ├─ auth-flow/             # Complete authentication
   │  ├─ logic/              # Uses @studio/core + ui-primitives
   │  ├─ screens-minimal/    # Minimal theme implementation
   │  ├─ screens-corporate/
   │  └─ screens-modern/
   │
   ├─ user-profile/          # Profile management
   ├─ settings/              # App settings
   ├─ onboarding/            # User onboarding
   ├─ search/                # Search functionality
   └─ notifications/         # Push notifications

Client Projects (outside monorepo)
├─ client-a-ecommerce/
│  ├─ package.json
│  │  └─ dependencies:
│  │     ├─ @studio/core@1.2.3
│  │     ├─ @studio/ui-primitives@0.8.1
│  │     ├─ @studio/ui-theme-modern@2.1.0
│  │     ├─ @studio/feature-auth@1.5.2
│  │     └─ @studio/feature-payments@1.2.0
│  └─ Custom screens for unique features
│
└─ client-b-booking/
   ├─ package.json
   │  └─ dependencies:
   │     ├─ @studio/core@1.2.3
   │     ├─ @studio/ui-primitives@0.8.1
   │     ├─ @studio/ui-theme-corporate@1.8.0  # Different theme
   │     ├─ @studio/feature-auth@1.5.2
   │     └─ @studio/feature-booking@1.0.0     # New feature!
   └─ Custom screens
```

---

## Layer Responsibilities

### Layer 1: @studio/core (Business Logic)

**What belongs:**
```typescript
// ✅ Domain models
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// ✅ API clients
export class AuthAPI {
  static async login(credentials: Credentials): Promise<AuthResponse> {
    return axios.post('/auth/login', credentials);
  }
}

// ✅ Validation schemas
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ Storage utilities
export const secureStorage = {
  setToken: async (token: string) => { /* ... */ },
  getToken: async () => { /* ... */ },
};
```

**Forbidden:**
- ❌ React hooks
- ❌ Components
- ❌ UI state
- ❌ Styling

**Versioning:** Conservative (1.x.x) - rare breaking changes

---

### Layer 2: @studio/ui-primitives (Headless UI)

**What belongs:**
```typescript
// ✅ Headless hooks
export const useForm = <T>({ schema, onSubmit }) => {
  const form = useHookForm<T>({ resolver: zodResolver(schema) });

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
  };
};

// ✅ UI state stores
export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// ✅ Component contracts
export interface ButtonPrimitiveProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}
```

**Forbidden:**
- ❌ Styled components
- ❌ Theme tokens
- ❌ JSX rendering

**Versioning:** Evolving (0.x.x → 1.x.x) - stabilize before 1.0

---

### Layer 3: @studio/ui-theme-* (Themed Implementations)

**What belongs:**
```typescript
// ✅ Themed components
import { useButton } from '@studio/ui-primitives';

export const Button = ({ variant = 'primary', ...props }) => {
  const { handlePress } = useButton(props);

  return (
    <Pressable onPress={handlePress} style={styles[variant]}>
      {props.children}
    </Pressable>
  );
};

// ✅ Design tokens
export const theme = {
  colors: {
    primary: '#007AFF',    // Per theme
    secondary: '#5856D6',
  },
  spacing: { xs: 4, sm: 8, md: 16 },
  typography: { h1: { fontSize: 32 } },
  animations: { duration: { fast: 150 } },
};
```

**Multiple themes:**
- `@studio/ui-theme-minimal` - Clean, whitespace
- `@studio/ui-theme-corporate` - Professional, navy
- `@studio/ui-theme-modern` - Bold, gradients
- `@studio/ui-theme-playful` - Rounded, colorful
- `@studio/ui-theme-luxury` - Premium, elegant

**Versioning:** Frequent updates (2.x.x) - visual changes

---

### Layer 4: @studio/feature-* (Feature Modules)

**High-value reusable features:**

```typescript
// @studio/feature-auth/
├─ logic/                   # Uses @studio/core
│  ├─ useLogin.ts
│  ├─ useRegister.ts
│  └─ useForgotPassword.ts
│
├─ screens-minimal/         # Minimal theme variant
│  ├─ LoginScreen.tsx
│  ├─ RegisterScreen.tsx
│  └─ ForgotPasswordScreen.tsx
│
├─ screens-corporate/       # Corporate theme variant
│  └─ [Same screens, different styling]
│
└─ screens-modern/          # Modern theme variant
   └─ [Same screens, different styling]

// Client usage:
import { LoginScreen } from '@studio/feature-auth/screens-modern';
```

**Common features to build:**
1. **auth-flow** - Login, signup, forgot password, email verification
2. **user-profile** - View/edit profile, avatar upload, account settings
3. **settings** - App settings, notifications, privacy, theme toggle
4. **onboarding** - Welcome screens, feature tours, permissions
5. **search** - Search UI, filters, results display
6. **notifications** - Push notification UI, settings

**Versioning:** Per-feature independent (1.x.x)

---

## Studio Workflow

### Phase 1: Foundation (3-4 weeks)

**Week 1-2: Core Library**
```bash
# Create packages
mkdir -p packages/core/{auth,payments,analytics,storage,utils}
mkdir -p packages/ui-primitives/{hooks,state,contracts}

# Build core modules
# @studio/core - 30+ utilities, API clients, validation
# @studio/ui-primitives - 10+ headless hooks
```

**Week 2-3: First Theme**
```bash
# Start simple
mkdir -p packages/ui-themes/minimal

# Build 20-30 core components
# Button, Text, Card, Form inputs, Modal, etc.
```

**Week 3-4: Second Theme + Features**
```bash
# Add variety
mkdir -p packages/ui-themes/modern

# Build 3-5 feature modules
# auth-flow, user-profile, settings
```

**Deliverables:**
- [ ] @studio/core v0.1.0
- [ ] @studio/ui-primitives v0.1.0
- [ ] @studio/ui-theme-minimal v1.0.0
- [ ] @studio/ui-theme-modern v1.0.0
- [ ] @studio/feature-auth v1.0.0
- [ ] @studio/feature-profile v1.0.0
- [ ] @studio/feature-settings v1.0.0

---

### Phase 2: First Client Project (2-3 weeks)

**Use library for 70% of app:**
```bash
npx create-expo-app client-a-ecommerce
cd client-a-ecommerce

# Install studio packages
npm install @studio/core@0.1.0
npm install @studio/ui-primitives@0.1.0
npm install @studio/ui-theme-modern@1.0.0
npm install @studio/feature-auth@1.0.0
npm install @studio/feature-profile@1.0.0
```

**Build 30% custom features:**
- Product catalog
- Shopping cart
- Checkout flow

**Validate:**
- ✅ Library components work
- ✅ Easy to integrate
- ✅ Performance acceptable
- ✅ Customization possible

---

### Phase 3: Extract & Contribute (1-2 weeks)

**Identify reusable features from Client A:**

```bash
# Custom "product catalog" works well
# Extract to library

cd ../../packages/features
mkdir product-catalog

# Create feature module
packages/features/product-catalog/
├─ logic/
│  ├─ useProductList.ts
│  └─ useProductDetail.ts
├─ screens-minimal/
│  ├─ ProductListScreen.tsx
│  └─ ProductDetailScreen.tsx
└─ screens-modern/
   ├─ ProductListScreen.tsx
   └─ ProductDetailScreen.tsx

# Publish
npm publish @studio/feature-product-catalog@1.0.0
```

**Update Client A to use library version:**
```bash
cd ../../apps/client-a-ecommerce
npm install @studio/feature-product-catalog@1.0.0

# Remove custom implementation
# Replace with library import
```

---

### Phase 4: Second Client Project (1-2 weeks)

**Massive time savings:**

```bash
npx create-expo-app client-b-booking
cd client-b-booking

# Install library packages
npm install @studio/core@0.2.0
npm install @studio/ui-primitives@0.2.0
npm install @studio/ui-theme-corporate@1.0.0    # Different theme!
npm install @studio/feature-auth@1.0.0
npm install @studio/feature-profile@1.0.0
npm install @studio/feature-product-catalog@1.0.0  # Reused!

# Only build booking-specific features (20-30% of app)
# Auth, profile, settings → Already done!
```

**Time saved:** 70% (2 weeks vs 6-7 weeks from scratch)

---

### Phase 5: Continuous Growth

**Each project:**
1. Use 70-80% from library
2. Build 20-30% custom
3. Extract successful features
4. Contribute back to library
5. Library grows organically

**Library evolution:**
```
After 5 projects:
├─ 3 themes (minimal, corporate, modern)
├─ 10+ feature modules
├─ 50+ components per theme
├─ Mature core library
└─ 85% time savings on new projects
```

---

## Economics & ROI

### Time Investment

**First Project (with library building):**
- Build library foundation: 3-4 weeks
- Build client app: 2-3 weeks
- **Total**: 5-7 weeks

**Traditional approach (no library):**
- Build from scratch: 6-8 weeks per project

**Second Project (50% reuse):**
- Library: Already built
- Client app: 2-3 weeks (70% from library)
- **Total**: 2-3 weeks

**Third+ Projects (70-80% reuse):**
- **Total**: 1-2 weeks each

### Cost Savings

| Project | Traditional | With Library | Time Saved | Cost Saved |
|---------|-------------|--------------|------------|------------|
| #1 | 6 weeks | 5-7 weeks | -1 week | -$5k (investment) |
| #2 | 6 weeks | 2-3 weeks | 3-4 weeks | $15-20k |
| #3 | 6 weeks | 1-2 weeks | 4-5 weeks | $20-25k |
| #4 | 6 weeks | 1-2 weeks | 4-5 weeks | $20-25k |
| #5 | 6 weeks | 1-2 weeks | 4-5 weeks | $20-25k |

**Break Even:** Project #3
**Cumulative Savings (5 projects):** 15-19 weeks = $75-95k

---

## Versioning Strategy

### Semantic Versioning

```json
{
  "@studio/core": "1.2.3",                    // Stable
  "@studio/ui-primitives": "0.8.1",           // Evolving
  "@studio/ui-theme-minimal": "2.5.0",        // Frequent updates
  "@studio/ui-theme-corporate": "1.8.0",      // Independent
  "@studio/ui-theme-modern": "3.1.0",         // Independent
  "@studio/feature-auth": "1.5.2",            // Per-feature
  "@studio/feature-profile": "1.3.0"          // Independent
}
```

### Version Ranges

**In library packages:**
```json
// @studio/ui-theme-minimal/package.json
{
  "dependencies": {
    "@studio/core": "^1.0.0",           // Allow minor/patch
    "@studio/ui-primitives": "^0.8.0"   // Allow minor/patch
  }
}
```

**In client projects:**
```json
// apps/client-a/package.json
{
  "dependencies": {
    "@studio/core": "1.2.3",                   // Pinned
    "@studio/ui-primitives": "0.8.1",          // Pinned
    "@studio/ui-theme-modern": "3.1.0",        // Pinned
    "@studio/feature-auth": "1.5.2"            // Pinned
  }
}
```

**Rationale:**
- Library packages: Flexible (interoperability)
- Client projects: Pinned (stability, control updates)

---

## Tooling Recommendations

### 1. Turborepo (Monorepo Management)

**Why Turborepo:**
- ✅ Simpler than Nx (good for studios)
- ✅ Fast builds with caching
- ✅ Easy npm publishing
- ✅ Vercel integration

**Setup:**
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "publish": {
      "dependsOn": ["build", "test"],
      "cache": false
    }
  }
}
```

**Commands:**
```bash
# Build all packages
turbo run build

# Build specific package
turbo run build --filter=@studio/ui-theme-modern

# Publish all packages
turbo run publish

# Parallel execution, smart caching
```

---

### 2. CLI Tool for Scaffolding

**Create `@studio/cli` package:**

```bash
# Create new client project
npx @studio/cli create-app client-c \
  --theme modern \
  --features auth,profile,settings

# Add feature to existing app
npx @studio/cli add-feature product-catalog --theme modern

# Create new theme
npx @studio/cli create-theme luxury --based-on minimal

# Contribute feature back to library
npx @studio/cli extract-feature booking ./apps/client-a/features/booking

# Create new component in theme
npx @studio/cli create-component Avatar --theme modern

# Sync theme updates to client project
npx @studio/cli sync-theme modern
```

**CLI Implementation:**
```typescript
// @studio/cli/commands/create-app.ts
export async function createApp(name, options) {
  const { theme, features } = options;

  // 1. Scaffold Expo app
  await execSync(`npx create-expo-app ${name}`);

  // 2. Install studio packages
  const packages = [
    '@studio/core',
    '@studio/ui-primitives',
    `@studio/ui-theme-${theme}`,
    ...features.map(f => `@studio/feature-${f}`)
  ];

  await execSync(`npm install ${packages.join(' ')}`);

  // 3. Generate boilerplate
  await generateAppBoilerplate(name, theme, features);

  console.log(`✅ Created ${name} with ${theme} theme and ${features.length} features`);
}
```

---

### 3. Storybook (Component Documentation)

**Why Storybook:**
- ✅ Visual component showcase
- ✅ Interactive playground
- ✅ Documentation per theme
- ✅ Design system reference

**Setup per theme:**
```bash
# In each theme package
cd packages/ui-themes/minimal
npx storybook init

# Create stories
// Button.stories.tsx
export default {
  title: 'Minimal/Button',
  component: Button,
};

export const Primary = {
  args: { children: 'Click Me', variant: 'primary' },
};

export const Secondary = {
  args: { children: 'Click Me', variant: 'secondary' },
};
```

**Deploy Storybook:**
```bash
# Build all theme Storybooks
turbo run build-storybook

# Deploy to Vercel/Netlify
# URL: https://minimal.studio-ui.com
# URL: https://modern.studio-ui.com
```

**Benefits:**
- Clients can preview themes before choosing
- Developers can copy-paste code examples
- Design team can reference components

---

### 4. Changesets (Version Management)

**Why Changesets:**
- ✅ Automated versioning
- ✅ Changelog generation
- ✅ Multi-package publishing
- ✅ Conventional commits

**Workflow:**
```bash
# After making changes
npx changeset

# Select changed packages
? Which packages would you like to include?
  ✔ @studio/ui-theme-modern
  ✔ @studio/feature-auth

# Describe changes
? What kind of change is this for @studio/ui-theme-modern?
  ○ patch (bug fix)
  ○ minor (new feature)
  ● major (breaking change)

# Commit changeset
git add .changeset/*.md
git commit -m "feat: add dark mode to modern theme"

# When ready to publish
npx changeset version   # Bump versions, update changelogs
npx changeset publish   # Publish to npm
```

---

## Publishing Strategy

### Development Phase (Now)

**Git Submodules:**
- Packages as submodules in monorepo
- Fast iteration
- No publishing overhead

**Workspace Protocol:**
```json
{
  "dependencies": {
    "@studio/core": "workspace:*"
  }
}
```

---

### Production Phase (After Foundation)

**Private npm Registry:**

**Option 1: GitHub Packages (Free for private)**
```bash
# .npmrc
@studio:registry=https://npm.pkg.github.com
```

**Option 2: Verdaccio (Self-hosted)**
```bash
# Run private registry
npx verdaccio

# Publish
npm publish --registry http://localhost:4873
```

**Option 3: npm Pro ($7/month)**
```bash
# Private @studio scope
npm publish --access restricted
```

**Publishing Workflow:**
```bash
# 1. Build packages
turbo run build

# 2. Version with changesets
npx changeset version

# 3. Publish
npx changeset publish

# 4. Git tag
git push --follow-tags
```

---

## Critical Success Factors

### 1. Start Small, Grow Organically

**Don't:**
- ❌ Build 10 themes upfront
- ❌ Create 20 feature modules before using them
- ❌ Perfect everything before shipping

**Do:**
- ✅ Build for Client A
- ✅ Extract what works
- ✅ Reuse in Client B
- ✅ Iterate and improve

**Mantra:** "Build → Use → Extract → Reuse"

---

### 2. Documentation is Critical

**Required Docs:**

**Per Package:**
- README.md with usage examples
- API documentation
- Migration guides
- Changelog

**Central Documentation Site:**
```
docs/
├─ getting-started.md
├─ architecture.md
├─ contribution-guide.md
├─ theme-guide.md
├─ feature-modules.md
└─ api-reference/
   ├─ core.md
   ├─ ui-primitives.md
   ├─ theme-minimal.md
   └─ feature-auth.md
```

**Storybook per Theme:**
- Visual component reference
- Interactive examples
- Code snippets
- Design tokens

---

### 3. Quality Gates

**Before Publishing:**
- [ ] TypeScript compiles (strict mode)
- [ ] ESLint passes
- [ ] Tests pass (unit + integration)
- [ ] Documentation updated
- [ ] Changelog entry created
- [ ] Version bumped appropriately

**CI/CD Pipeline:**
```yaml
# .github/workflows/publish.yml
name: Publish

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      # Install dependencies
      - run: npm install

      # Build all packages
      - run: turbo run build

      # Run tests
      - run: turbo run test

      # Publish changed packages
      - run: npx changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

### 4. Contribution Workflow

**Process:**

1. **Identify Reusable Feature** (in client project)
   ```bash
   # Working in apps/client-a
   # Built great "booking" feature
   # Decide to extract
   ```

2. **Extract to Library**
   ```bash
   cd ../../packages/features
   mkdir booking

   # Copy logic from client project
   # Refactor to use @studio/core + ui-primitives
   # Create theme variants
   ```

3. **Create Package**
   ```json
   // packages/features/booking/package.json
   {
     "name": "@studio/feature-booking",
     "version": "1.0.0",
     "dependencies": {
       "@studio/core": "^1.0.0",
       "@studio/ui-primitives": "^0.8.0"
     },
     "peerDependencies": {
       "react": "^19.0.0",
       "react-native": "^0.81.0"
     }
   }
   ```

4. **Document**
   ```markdown
   # @studio/feature-booking

   Complete booking flow with calendar, time slots, confirmation

   ## Installation
   npm install @studio/feature-booking

   ## Usage
   // For minimal theme
   import { BookingScreen } from '@studio/feature-booking/screens-minimal';

   // For modern theme
   import { BookingScreen } from '@studio/feature-booking/screens-modern';
   ```

5. **Publish**
   ```bash
   npx changeset
   npx changeset version
   npx changeset publish
   ```

6. **Update Client Projects**
   ```bash
   cd apps/client-a
   npm install @studio/feature-booking@1.0.0

   # Remove custom implementation
   # Use library version
   ```

---

## Comparison: Studio vs Alternatives

### vs Config-Driven Theming (Simple)

| Aspect | Config-Driven | Studio Library |
|--------|---------------|----------------|
| Complexity | ⭐ Low | ⭐⭐⭐ Medium |
| Implementation Time | 1-2 weeks | 3-4 weeks initial |
| Flexibility | ⭐⭐ Medium | ⭐⭐⭐⭐⭐ Maximum |
| Maintenance | ⭐⭐⭐ Easy | ⭐⭐ Medium |
| Reuse Value | Single app | Many apps |
| ROI | Low | High (after project #3) |

**When to use Config-Driven:** Single app with variants
**When to use Studio Library:** Multiple client projects

---

### vs Copy-Paste Pattern (shadcn/ui)

| Aspect | Copy-Paste | Studio Library |
|--------|------------|----------------|
| Code Duplication | ❌ High | ✅ None |
| Update Propagation | Manual | Automatic (npm update) |
| Versioning | None | Semantic versioning |
| Consistency | ⭐⭐ Low | ⭐⭐⭐⭐ High |
| Flexibility | ⭐⭐⭐⭐⭐ Max | ⭐⭐⭐⭐ High |
| Best For | <50% overlap | 60-80% overlap |

**When to use Copy-Paste:** Completely different products
**When to use Studio Library:** Shared patterns across projects

---

### vs Existing UI Libraries (Tamagui/Gluestack)

| Aspect | Existing Library | Studio Library |
|--------|------------------|----------------|
| Time to Start | ⭐⭐⭐ Fast | ⭐ Slow (build first) |
| Customization | ⭐⭐ Limited | ⭐⭐⭐⭐⭐ Unlimited |
| Maintenance | ⭐⭐⭐⭐ Community | ⭐⭐ You maintain |
| IP Ownership | ❌ External | ✅ You own |
| Long-term Value | Medium | High |

**When to use Existing:** Quick projects, standard designs
**When to use Studio Library:** Strategic asset, custom needs

---

## Implementation Roadmap

### Quarter 1: Foundation

**Month 1: Core Infrastructure**
- Week 1-2: @studio/core
- Week 3: @studio/ui-primitives
- Week 4: @studio/ui-theme-minimal (20 components)

**Month 2: Expansion**
- Week 1-2: @studio/ui-theme-modern (20 components)
- Week 3: @studio/feature-auth
- Week 4: @studio/feature-profile + @studio/feature-settings

**Month 3: First Client Project**
- Week 1-3: Build Client A using library
- Week 4: Extract new features, refine library

**Deliverables:**
- [ ] 2 themes (minimal, modern)
- [ ] 3-5 feature modules
- [ ] 1 client project shipped
- [ ] Documentation + Storybook

---

### Quarter 2: Growth

**Month 4: Second Client Project**
- Week 1-2: Build Client B (70% reuse)
- Week 3-4: Extract booking feature, contribute back

**Month 5: Third Theme + Features**
- Week 1-2: @studio/ui-theme-corporate
- Week 3-4: More feature modules

**Month 6: Optimization**
- Week 1-2: Performance optimization
- Week 3-4: Developer experience (CLI tools, better docs)

**Deliverables:**
- [ ] 3 themes total
- [ ] 8-10 feature modules
- [ ] 2 client projects shipped
- [ ] Mature tooling

---

### Quarter 3: Scale

**Month 7-9: Rapid Client Delivery**
- Client C: 1-2 weeks
- Client D: 1-2 weeks
- Client E: 1-2 weeks

**Month 9: Assessment**
- Measure time savings
- Identify gaps in library
- Plan next quarter

**Target:**
- [ ] 5+ client projects delivered
- [ ] 85% time savings vs building from scratch
- [ ] ROI positive (savings > initial investment)

---

## Unresolved Questions

1. **Publishing Infrastructure**
   - Private npm registry provider? (GitHub Packages vs Verdaccio vs npm Pro)
   - CI/CD for automated publishing?
   - How to handle pre-releases (alpha, beta)?

2. **Team Structure**
   - Who owns library maintenance vs client projects?
   - How to allocate time between library work and client delivery?
   - Code review process for library contributions?

3. **Quality Standards**
   - Minimum test coverage requirement?
   - Performance benchmarks for components?
   - Accessibility standards (WCAG level)?

4. **Feature Module Granularity**
   - How big should feature modules be?
   - Bundle common features or separate packages?
   - Trade-off: fewer packages (easier) vs more packages (flexibility)

5. **Theme Expansion Strategy**
   - How many themes to build initially? (2-3 recommended)
   - When to add more themes? (demand-driven or proactive?)
   - Theme customization service for clients?

6. **Pricing Strategy** (if selling to external clients)
   - Free open-source vs paid licenses?
   - Per-project licensing or subscription?
   - White-label customization pricing?

7. **Breaking Change Management**
   - How to handle breaking changes in primitives?
   - Migration guides for each major version?
   - Automated migration tools (codemods)?

8. **Client Project Upgrades**
   - How often to update library dependencies in client projects?
   - Strategy for long-term maintenance of older projects?
   - LTS (Long-Term Support) versions?

---

## Sources

**Multi-Brand Architecture:**
- [Building Multi-Brand Apps from Single Codebase](https://the-expert-developer.medium.com/react-native-in-2025-building-multi-brand-multi-tenant-apps-from-a-single-codebase-3c01e8650cfc)

**Headless UI Pattern:**
- [Top Headless UI Libraries 2024](https://www.greatfrontend.com/blog/top-headless-ui-libraries-for-react-in-2024)
- [Radix UI vs Headless UI vs Ariakit](https://javascript.plainenglish.io/radix-ui-vs-headless-ui-vs-ariakit-the-headless-component-war-aebead855a94)
- [Headless Component Pattern (Martin Fowler)](https://martinfowler.com/articles/headless-component.html)
- [Radix UI vs Headless UI 2025](https://www.subframe.com/tips/headless-ui-vs-radix)

**Monorepo Management:**
- [Turborepo React Native Setup](https://medium.com/@alex.derville/setting-up-a-react-and-react-native-monorepo-with-turborepo-and-pnpm-8310c1faf18c)
- [Turborepo vs Nx Comparison](https://blog.theodo.com/2022/02/architecting-a-modern-monorepo/)
- [Expo Monorepo Guide](https://docs.expo.dev/guides/monorepos/)

**Additional Resources:**
- [React Native Architecture 2024](https://medium.com/@gopesh.jangid/react-native-architecture-in-2024-best-practices-for-scalable-and-maintainable-app-design-5ecd06c57319)
- [React Architecture Patterns 2025](https://www.bacancytechnology.com/blog/react-architecture-patterns-and-best-practices)

---

## Summary

**For App Development Studios:**
The 4-layer architecture (core → primitives → themes → features) is **ideal** when building a component library ecosystem for multiple client projects.

**Key Benefits:**
- ✅ 70-85% time savings after initial investment
- ✅ Strategic IP ownership
- ✅ Consistent quality across projects
- ✅ Rapid client delivery

**Critical for Success:**
1. Start small, grow organically (build → use → extract → reuse)
2. Document everything (Storybook, API docs, guides)
3. Quality gates before publishing
4. Contribution workflow
5. Tooling investment (Turborepo, CLI, CI/CD)

**ROI:** Break even at project #3, massive savings thereafter

**Recommendation:** Proceed with implementation if:
- [ ] Team commits to 3-4 week initial investment
- [ ] Pipeline of 3+ client projects in next 6-12 months
- [ ] Studio strategy includes reusable components
- [ ] Resources allocated for library maintenance

Otherwise, consider simpler alternatives (config-driven theming for <3 projects).
