# Deployment Guide

## Prerequisites

### Required Tools

```bash
# Node.js & npm (already installed)
node --version  # >= 18.x
npm --version   # >= 9.x

# EAS CLI (for cloud builds)
npm install -g eas-cli

# Verify installation
eas --version
```

### Required Accounts

1. **Expo Account** (free)
   - Sign up at https://expo.dev
   - Provides cloud builds and deployment services

2. **Apple Developer Account** (for iOS)
   - $99/year subscription
   - Required for TestFlight and App Store distribution

3. **Google Play Developer Account** (for Android)
   - $25 one-time fee
   - Required for Google Play Store distribution

---

## Build Configuration

### EAS Setup

The project is configured via `apps/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "requireCommit": true
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Build Profiles

| Profile | Purpose | Distribution | Use Case |
|---------|---------|--------------|----------|
| **development** | Development builds | Internal (EAS) | Local testing, debugging |
| **preview** | Preview/QA builds | Internal (EAS) | Team testing, QA |
| **production** | App store builds | Stores (iOS/Android) | Release to public |

---

## Environment Configuration

### Environment Variables

Create `.env.production` in `apps/mobile/`:

```bash
EXPO_PUBLIC_API_URL=https://api.production.com
EXPO_PUBLIC_LOG_LEVEL=warn
```

Available at build time via `process.env.EXPO_PUBLIC_*`

### App Configuration (app.json)

```json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.mobile.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.mobile.app",
      "versionCode": 1
    }
  }
}
```

---

## Development Build Process

### Local Development

**With Expo Go (easiest):**
```bash
cd apps/mobile
npm start

# Scan QR code with Expo Go app
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

**Benefits:**
- No build required
- Hot reload
- Works with most packages

**Limitations:**
- Limited to Expo SDK modules
- Some custom native code won't work

### Development Build Creation

When you need custom native modules or debugging:

```bash
cd apps/mobile

# Create development build for iOS
eas build --platform ios --profile development

# Create development build for Android
eas build --platform android --profile development

# Monitor build progress
eas build --monitor
```

**Use when:**
- Using custom native modules
- Need native debugging
- Testing production behavior locally
- Integrated native libraries required

---

## Android Build Process

### Prerequisites

1. **Google Play Developer Account** (one-time $25)
2. **Android keystore** (signing certificate)
3. **Google Play Console** access

### Generate Android Keystore (First Time Only)

```bash
cd apps/mobile

# EAS will prompt to generate keystore
eas build --platform android --profile production

# Answer "Yes" when asked to generate keystore
# EAS stores it securely and reuses for future builds
```

### Build for Preview (Internal Testing)

```bash
cd apps/mobile

# Create preview build
npm run build:android:preview

# Or: eas build --platform android --profile preview

# Output: APK or AAB file available for download
# Distribution: Internal testing via EAS
```

### Build for Production (App Store)

```bash
cd apps/mobile

# Create production build
npm run build:android

# Or: eas build --platform android --profile production

# Output: Signed AAB (Android App Bundle) ready for Play Store
```

### Local Build (Optional)

For testing builds locally without cloud:

```bash
cd apps/mobile

npm run build:android:local

# Or: eas build --platform android --profile preview --local

# Requirements:
# - Android Build Tools
# - Java SDK
# - NDK (for some modules)
```

---

## iOS Build Process

### Prerequisites

1. **Apple Developer Account** ($99/year)
2. **App ID** created in Apple Developer Portal
3. **Signing certificate** and **provisioning profile**

### Certificates & Profiles

**EAS handles automatically:**
- Certificate generation/renewal
- Provisioning profile creation
- Xcode configuration

**Or manage manually:**
```bash
# Sync Apple credentials with EAS
eas credentials

# Select: iOS
# Follow prompts to add certificates
```

### Build for Preview (TestFlight)

```bash
cd apps/mobile

# Create preview build
eas build --platform ios --profile preview

# Output: IPA file available in EAS dashboard
# Installation: Via link or Apple Configurator
```

### Build for Production (App Store)

```bash
cd apps/mobile

# Create production build
eas build --platform ios --profile production

# Output: IPA ready for App Store submission
```

---

## App Store Deployment

### Android (Google Play Store)

#### Initial Setup

1. Create app in Google Play Console
2. Fill app details (screenshots, description, privacy policy)
3. Set up pricing and distribution
4. Create release track (e.g., "Internal Testing")

#### Submission

```bash
cd apps/mobile

# Build production AAB
npm run build:android

# Download AAB from EAS dashboard
# Upload to Google Play Console

# Or use EAS submit:
eas submit --platform android --latest
```

#### Review Timeline

- Internal testing: Instant
- Beta testing: 2-4 hours
- Production: 24-48 hours (first time), instant (updates)

#### Update Version Code

Each build to Google Play requires increment:

```json
{
  "expo": {
    "android": {
      "versionCode": 1  // Increment for each submission
    }
  }
}
```

### iOS (App Store)

#### Initial Setup

1. Create app in App Store Connect
2. Fill app details (screenshots, description, rating, etc.)
3. Set up pricing and distribution
4. Add TestFlight internal testers

#### Submission

```bash
cd apps/mobile

# Build production IPA
npm run build:android

# Or use EAS submit:
eas submit --platform ios --latest
```

#### TestFlight (Beta Testing)

```bash
# Build goes to TestFlight automatically
eas build --platform ios --profile production

# Invite testers in App Store Connect
# They receive email with download link
# No App Store review needed for beta
```

#### Review Timeline

- TestFlight: Instant (internal testers)
- App Store: 24-48 hours (first submission), 24 hours (updates)

#### Update Version

Each build to App Store requires increment:

```json
{
  "expo": {
    "version": "1.0.1"  // Increment version for each submission
  }
}
```

---

## Versioning Strategy

### Version Format

Follow Semantic Versioning: `MAJOR.MINOR.PATCH`

```
1.0.0
│ │ └─ Patch: Bug fixes (1.0.1, 1.0.2)
│ └─── Minor: New features (1.1.0, 1.2.0)
└───── Major: Breaking changes (2.0.0)
```

### Version Increment Rules

| Change | Update | Example |
|--------|--------|---------|
| Bug fix | Patch | 1.0.0 → 1.0.1 |
| New feature | Minor | 1.0.0 → 1.1.0 |
| Breaking change | Major | 1.0.0 → 2.0.0 |
| New beta/preview | Patch+pre-release | 1.0.0-rc.1 |

### Update Version in Code

Update both locations:

```json
// apps/mobile/app.json
{
  "expo": {
    "version": "1.0.1"  // For iOS/general
  }
}

// apps/mobile/package.json
{
  "version": "1.0.1"
}
```

---

## Build Troubleshooting

### Common Issues

#### Build Fails: "Git commit required"

```bash
# Solution: Commit changes before building
git add .
git commit -m "version: bump to 1.0.1"

# Then build again
npm run build:android
```

#### Build Fails: "No credentials found"

```bash
# Solution: Set up credentials
eas credentials

# Select platform and app
# Follow prompts to create certificates
```

#### Metro Bundler Issues

```bash
# Clear cache and rebuild
cd apps/mobile
npx expo start --clear

# Or completely reset
npm run clean:modules
npm install
npm start
```

#### Android Build Fails: "Incompatible SDK"

```bash
# Update build SDK version in eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",  // or "app-bundle"
        "targetExportFormat": "app-bundle"
      }
    }
  }
}
```

---

## Monitoring Builds

### During Build

```bash
# Monitor build progress
eas build --platform android --monitor

# Watch logs in real-time
eas build logs --platform android
```

### After Build

EAS Dashboard shows:
- Build status (succeeded/failed)
- Download link for artifact
- Build logs for debugging
- Build timing and size metrics

### Download Build Artifacts

```bash
# List recent builds
eas build:list

# Download specific build
eas build:view <build-id>

# Download directly from dashboard
# https://expo.dev/builds
```

---

## Deployment Checklist

### Pre-Release

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run format:check` - no formatting issues
- [ ] Test on real devices (iOS + Android)
- [ ] Verify all environment variables set
- [ ] Update version number in app.json and package.json
- [ ] Update CHANGELOG (if maintained)
- [ ] Review app screenshots in store
- [ ] Test all critical user flows
- [ ] Verify API endpoints (production URLs)
- [ ] Check permissions (iOS/Android manifest)
- [ ] Privacy policy and terms up-to-date

### Build Steps

- [ ] Commit all changes: `git commit -m "version: 1.0.0"`
- [ ] Tag release (optional): `git tag v1.0.0`
- [ ] Build for respective platform
- [ ] Download and verify build artifact
- [ ] Test build on real device
- [ ] Upload to respective store

### After Release

- [ ] Monitor crash reports
- [ ] Monitor user feedback
- [ ] Check store reviews
- [ ] Prepare next version if needed
- [ ] Archive build artifacts
- [ ] Update release notes

---

## Rollback Procedure

### If Release has Critical Issues

**Option 1: Immediate patch**
```bash
# Fix issue in code
git commit -m "fix: critical issue"
git tag v1.0.1

# Rebuild and submit
npm run build:android
eas submit --platform android --latest
```

**Option 2: Revert to previous version**

Android:
- Remove build from Play Store (if not widely distributed)
- Reupload previous version
- Increment version code again

iOS:
- Remove from App Store (if possible)
- Notify users via app notification
- Prepare patch release

---

## Post-Deployment

### Monitoring

**Tools to integrate (not yet implemented):**
- Sentry: Crash reporting
- Mixpanel/Amplitude: Analytics
- New Relic/Datadog: Performance monitoring

### Updates & Hotfixes

**For minor updates:**
```bash
# Update version
# Rebuild and resubmit
npm run build:android
```

**For critical hotfixes:**
```bash
# Emergency fix procedure
git hotfix <issue>
npm run build:android  # Priority build
eas submit --platform android --latest
```

### Release Schedule

- **Major versions:** Quarterly (planned features)
- **Minor versions:** Monthly (bug fixes + small features)
- **Patches:** As needed (critical bugs)

---

## Configuration Reference

### eas.json Structure

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "requireCommit": true,
    "promptToConfigurePushNotifications": false
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "production"
      },
      "ios": {
        "ascAppId": "1234567890"
      }
    }
  }
}
```

### app.json Build Settings

```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/293312a4-7556-48e5-9375-b9dd16be20d0",
      "enabled": true,
      "checkAutomatically": "ON_LOAD_DEVELOPMENT",
      "fallbackToCacheTimeout": 30000
    },
    "plugins": [
      "expo-router"
    ],
    "extra": {
      "eas": {
        "projectId": "293312a4-7556-48e5-9375-b9dd16be20d0"
      }
    }
  }
}
```

---

## Advanced Topics

### Over-the-Air Updates (EAS Updates)

Enable instant updates without store submission:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/{PROJECT_ID}",
      "enabled": true,
      "checkAutomatically": "ON_LOAD"
    }
  }
}
```

Then deploy updates:

```bash
eas update --branch preview --message "Bug fix"
```

### Internal Distribution

Share builds with team without app store:

```bash
# Build for internal testing
eas build --platform android --profile preview

# Get shareable link from EAS dashboard
# Send to team members
# They scan QR code or click link to install
```

### Credential Management

```bash
# View current credentials
eas credentials show --platform android

# Update credentials
eas credentials

# Revoke old credentials
eas credentials revoke --platform ios
```

---

## Resources

- [EAS Documentation](https://docs.expo.dev/eas/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Google Play Console](https://play.google.com/console/)
- [Expo Updates](https://docs.expo.dev/eas-update/)
- [Build Configuration](https://docs.expo.dev/build-reference/app-config/)

---

**Last Updated:** 2025-12-26
**Scope:** Build and deployment procedures
**Next Review:** When deployment issues occur or tools update
