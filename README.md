# Lendro App

A community support and fintech mobile application built with **React Native (Expo)**. Lendro empowers community members to access repayable support funds, buy utility services at competitive rates, earn rewards through the oShare program, and qualify for annual grants.

---

## Screenshots

| Home Screen | Partner Services | Score & Leaderboard |
|:-----------:|:----------------:|:-------------------:|
| ![Home](./docs/screenshots/home.png) | ![Services](./docs/screenshots/services.png) | ![Grants](./docs/screenshots/grants.png) |

| Buy Airtime | Buy Data | Electricity |
|:-----------:|:--------:|:-----------:|
| ![Airtime](./docs/screenshots/airtime.png) | ![Data](./docs/screenshots/data.png) | ![Electricity](./docs/screenshots/electricity.png) |

| Cable TV | Funding | Menu / Profile |
|:--------:|:-------:|:--------------:|
| ![Cable](./docs/screenshots/cable.png) | ![Funding](./docs/screenshots/funding.png) | ![Menu](./docs/screenshots/menu.png) |

---

## Features

- **Home Dashboard** — Support Funding Limit, Wallet Balance, oShare Balance, Total Points, Score Breakdown, and Top 20 Grant Leaderboard
- **Wallet Management** — Deposit funds and request support funding (RSF)
- **Partner Services** — Buy Airtime, Mobile Data, Electricity, Cable TV and more
- **Buy Airtime** — MTN, Airtel, GLO, 9mobile with quick-select amounts
- **Buy Mobile Data** — Network selector, filter by Hot Deals/Daily/Weekly/Monthly, cashback on purchase
- **Electricity** — Prepaid & Postpaid meter payment for all Nigerian DISCOs
- **Cable TV** — DSTV, GOtv, StarTimes, and Showmax subscriptions
- **More Services** — Exam Pin, Betting, Insurance, Transport, Vouchers, and more
- **Grants & Leaderboard** — Full Top 20 leaderboard with grant details
- **Profile & Menu** — KYC, referrals, oShare program, notifications, security
- **Usage Points** — Earn points on every service purchase
- **Transaction Queue** — All purchases are queued and tracked with statuses (success/pending/failed)
- **Offline-first** — All state persisted with AsyncStorage (backend integration ready)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native via **Expo SDK 54** |
| Navigation | **Expo Router** (file-based, like Next.js) |
| State Management | React Context + AsyncStorage |
| Server State | **TanStack React Query** |
| Styling | React Native StyleSheet (theme tokens) |
| Icons | `@expo/vector-icons` (Ionicons, Feather, MaterialCommunity) |
| Animations | `react-native-reanimated` |
| Gradients | `expo-linear-gradient` |
| Haptics | `expo-haptics` |
| Language | **TypeScript** |
| Package Manager | **pnpm** (workspaces monorepo) |

---

## Project Structure

```
artifacts/lendro-app/
├── app/
│   ├── _layout.tsx              # Root layout (providers, stack config)
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar layout (5 tabs)
│   │   ├── index.tsx            # Home dashboard
│   │   ├── funding.tsx          # Deposit & Request Funding
│   │   ├── purchase.tsx         # All Services grid
│   │   ├── grants.tsx           # Grants & Leaderboard
│   │   └── menu.tsx             # Profile & Menu
│   └── services/
│       ├── airtime.tsx          # Buy Airtime
│       ├── data.tsx             # Buy Mobile Data
│       ├── electricity.tsx      # Pay Electricity
│       ├── cable.tsx            # Cable TV subscriptions
│       └── more.tsx             # All other services
├── assets/
│   └── images/
│       └── icon.png             # App icon
├── components/
│   └── ErrorBoundary.tsx        # Error boundary component
├── constants/
│   └── colors.ts                # Design tokens (Lendro brand colors)
├── context/
│   └── AppContext.tsx           # Global app state (wallet, points, transactions)
├── hooks/
│   └── useColors.ts             # Color scheme hook
├── app.json                     # Expo configuration
└── package.json
```

---

## Prerequisites

Make sure the following are installed on your machine:

- **Node.js** >= 18.x ([Download](https://nodejs.org))
- **pnpm** >= 8.x — `npm install -g pnpm`
- **Expo CLI** — `npm install -g expo-cli` (optional, for standalone use)
- **Expo Go** app on your Android/iOS device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/SagsMan/Lendro-App.git
cd Lendro-App
```

### 2. Install dependencies

```bash
# From the repo root
pnpm install
```

### 3. Start the development server

```bash
pnpm --filter @workspace/lendro-app run dev
```

Or if running standalone (from inside `artifacts/lendro-app/`):

```bash
cd artifacts/lendro-app
npx expo start
```

### 4. Open on your device

- **Expo Go (Physical Device):** Scan the QR code shown in the terminal with the Expo Go app.
- **Android Emulator:** Press `a` in the terminal.
- **iOS Simulator (macOS only):** Press `i` in the terminal.
- **Web Browser:** Press `w` in the terminal.

---

## Environment Variables

For production/backend integration, create a `.env` file in `artifacts/lendro-app/`:

```env
EXPO_PUBLIC_DOMAIN=your-api-domain.com
```

> **Note:** The frontend is currently standalone with mock data via AsyncStorage. Replace context methods in `context/AppContext.tsx` with real API calls when the backend is ready.

---

## Building APK (Android)

### Method 1: EAS Build (Recommended — requires Expo account)

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure EAS (run once):
   ```bash
   cd artifacts/lendro-app
   eas build:configure
   ```

4. Build APK (debug/preview):
   ```bash
   eas build --platform android --profile preview
   ```

5. Build AAB (production, for Google Play):
   ```bash
   eas build --platform android --profile production
   ```

### Method 2: Local Build (requires Android Studio + JDK)

1. Generate native Android project:
   ```bash
   cd artifacts/lendro-app
   npx expo prebuild --platform android
   ```

2. Build debug APK:
   ```bash
   cd android
   ./gradlew assembleDebug
   # Output: android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. Build release APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   # Output: android/app/build/outputs/apk/release/app-release.apk
   ```

4. Build release AAB (for Google Play):
   ```bash
   cd android
   ./gradlew bundleRelease
   # Output: android/app/build/outputs/bundle/release/app-release.aab
   ```

> **Note:** For release builds, you need to configure a signing keystore. See [Expo signing documentation](https://docs.expo.dev/app-signing/local-credentials/).

---

## Building IPA (iOS)

> iOS builds require a **macOS machine** with Xcode installed, plus an Apple Developer account.

### Using EAS Build (Recommended):

```bash
eas build --platform ios --profile production
```

### Local Build:

```bash
cd artifacts/lendro-app
npx expo prebuild --platform ios
cd ios
xcodebuild -workspace LendroApp.xcworkspace -scheme LendroApp -configuration Release -archivePath ./build/LendroApp.xcarchive archive
```

---

## Running Scripts

| Command | Description |
|---------|-------------|
| `pnpm --filter @workspace/lendro-app run dev` | Start Expo dev server |
| `pnpm --filter @workspace/lendro-app run typecheck` | TypeScript type check |
| `pnpm --filter @workspace/lendro-app run build` | Production build (static) |

---

## Backend Integration

The app is currently **frontend-only** with all data stored in AsyncStorage. When the backend is ready:

1. Update `context/AppContext.tsx` to replace mock methods with real API calls
2. Set `EXPO_PUBLIC_DOMAIN` in `.env` to point to your API server
3. Use the generated React Query hooks from `@workspace/api-client-react`
4. The API server lives at `artifacts/api-server/` (Express + TypeScript + Drizzle ORM)

### API Server (Express + TypeScript)

```bash
# Start the API server
pnpm --filter @workspace/api-server run dev
```

---

## Key Screens & Navigation

| Screen | Route | Description |
|--------|-------|-------------|
| Home | `/` | Main dashboard with balance, services, score, leaderboard |
| Funding | `/funding` | Deposit wallet & request support funds |
| Purchase | `/purchase` | All services in a searchable grid |
| Grants | `/grants` | Full leaderboard + available grants |
| Menu | `/menu` | Profile, settings, referrals, support |
| Buy Airtime | `/services/airtime` | Airtime for any Nigerian network |
| Buy Data | `/services/data` | Data bundles with network & duration filter |
| Electricity | `/services/electricity` | Prepaid/postpaid electricity for all DISCOs |
| Cable TV | `/services/cable` | DSTV, GOtv, StarTimes, Showmax |
| More Services | `/services/more` | Exam pin, betting, insurance, etc. |

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#2D1B8E` | Buttons, headers, active states |
| Accent | `#F5A623` | CTAs, logo, highlights |
| Background | `#FFFFFF` | App background |
| Card | `#F8F9FA` | Card surfaces |
| Muted | `#F3F4F6` | Dividers, subtle backgrounds |
| Success | `#10B981` | Success states, transaction confirmed |
| Destructive | `#EF4444` | Errors, failed states |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is proprietary software owned by **Lendro / Progmatech**. All rights reserved.

---

## Support

For questions or support, contact the development team or open an issue on GitHub.

---

*Built with React Native + Expo | Frontend v1.0.0 | Backend integration pending*
