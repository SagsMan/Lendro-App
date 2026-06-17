# Lendro App

  A React Native (Expo) fintech community-support app for Nigeria — enabling repayable support funds, partner service purchases (airtime, data, cable TV), reward points, and grant leaderboards.

  ---

  ## Quick Start (Every Time)

  ```bash
  git clone https://github.com/SagsMan/Lendro-App.git
  cd Lendro-App
  pnpm install
  pnpm exec expo start
  ```

  Then scan the QR code with the **Expo Go** app on your phone.

  > **Important:** Always `cd Lendro-App` before running any command — do not run from `C:\Users\Administrator\`.

  ---

  ## Command Reference

  | What you want | Command |
  |---|---|
  | Install packages | `pnpm install` |
  | Run on phone (Expo Go) | `pnpm exec expo start` |
  | Open on Android emulator | Press `a` after starting |
  | Open on iOS simulator | Press `i` after starting |
  | Open in browser | Press `w` after starting |
  | Build APK for sharing | `eas build --platform android --profile preview` |
  | Build for Play Store | `eas build --platform android --profile production` |
  | Build for iPhone / App Store | `eas build --platform ios --profile production` |

  ---

  ## Getting Started

  ### 1. Prerequisites

  - [Node.js 20+](https://nodejs.org)
  - [pnpm](https://pnpm.io) — install once globally:
    ```bash
    npm install -g pnpm
    ```
  - [Expo Go](https://expo.dev/go) app on your Android or iOS phone

  ### 2. Clone & Install

  ```bash
  git clone https://github.com/SagsMan/Lendro-App.git
  cd Lendro-App
  pnpm install
  ```

  ### 3. Start the Dev Server

  ```bash
  pnpm exec expo start
  ```

  Then press:
  - `a` — open on Android emulator/device
  - `i` — open on iOS simulator
  - `w` — open in web browser
  - Scan QR code with **Expo Go** app on your phone

  ---

  ## Build with EAS (Expo Application Services)

  EAS lets you build a real APK/AAB without needing Android Studio.

  ### Step 1 — Create a free Expo account

  Sign up at [expo.dev](https://expo.dev) (free).

  ### Step 2 — Install EAS CLI & log in

  ```bash
  pnpm add -g eas-cli
  eas login
  ```

  Enter your [expo.dev](https://expo.dev) email and password when prompted.

  ### Step 3 — Build

  **APK for direct install on Android phones (most common):**
  ```bash
  eas build --platform android --profile preview
  ```

  **AAB for Google Play Store:**
  ```bash
  eas build --platform android --profile production
  ```

  **IPA for iPhone / App Store:**
  ```bash
  eas build --platform ios --profile production
  ```

  When the build finishes, EAS gives you a download link for the APK/AAB. Build profiles are configured in `eas.json`.

  ---

  ## Local Android Build (requires Android Studio)

  ### Prerequisites
  - Android Studio installed with SDK
  - `ANDROID_HOME` environment variable set

  ### Generate a local APK (debug)

  ```bash
  cd android
  ./gradlew assembleDebug
  ```

  Output: `android/app/build/outputs/apk/debug/app-debug.apk`

  ### Generate a release APK

  ```bash
  cd android
  ./gradlew assembleRelease
  ```

  ### Generate a release AAB (for Play Store)

  ```bash
  cd android
  ./gradlew bundleRelease
  ```

  ---

  ## Screens

  | Screen | Route | Description |
  |--------|-------|-------------|
  | Onboarding | `/onboarding` | 3-slide intro shown once |
  | Login | `/auth/login` | Email + password auth |
  | OTP | `/auth/otp` | 6-digit OTP with 60s countdown |
  | Home | `/(tabs)/` | Dashboard, scores, leaderboard |
  | Airtime | `/services/airtime` | Buy airtime (MTN, Airtel, GLO, 9mobile) |
  | Data | `/services/data` | Data bundles with plan tabs |
  | Cable TV | `/services/cable` | DSTV, GOtv, StarTimes, Showmax |
  | Electricity | `/services/electricity` | DISCO prepaid/postpaid |
  | More | `/services/more` | All services including exam pins |
  | Transactions | `/transactions` | Full history with filter chips |

  ---

  ## Project Structure

  ```
  Lendro-App/
  ├── app/
  │   ├── (tabs)/          # Tab navigation screens
  │   ├── auth/            # Login + OTP screens
  │   ├── services/        # Airtime, Data, Cable, Electricity, More
  │   ├── onboarding.tsx   # Onboarding slides (logo shown)
  │   ├── transactions.tsx # Transaction history
  │   └── _layout.tsx      # Root layout + route guards + logo preloader
  ├── assets/
  │   └── images/
  │       ├── icon.png     # App logo (used on onboarding, login, preloader)
  │       └── logos/       # Partner brand logos
  ├── components/
  │   └── LoadingOverlay.tsx  # OPay-style logo preloader
  ├── context/
  │   ├── AppContext.tsx      # Global state (wallet, transactions, auth)
  │   └── LoadingContext.tsx  # Preloader state (showLoader / hideLoader)
  └── hooks/
      └── useColors.ts     # Theme colors
  ```

  ---

  ## Tech Stack

  - **Expo SDK 54** + **React Native 0.81**
  - **Expo Router v6** — file-based navigation
  - **TypeScript**
  - **@tanstack/react-query** — data fetching
  - **expo-linear-gradient** — gradient headers
  - **expo-haptics** — tactile feedback
  - **react-native-safe-area-context**
  - **pnpm** — package manager (required, npm will not work)

  ---

  ## Partner Services & Logos

  All brand logos generated at 200×200px with rounded rectangles in official brand colours:

  | Brand | Colour |
  |-------|--------|
  | MTN | `#FFCC00` |
  | Airtel | `#E30000` |
  | GLO | `#00B140` |
  | 9mobile | `#006633` |
  | DSTV | `#003087` |
  | GOtv | `#F7941D` |
  | StarTimes | `#C8102E` |
  | Showmax | `#E50000` |
  | WAEC | `#003399` |
  | NECO | `#006400` |
  | JAMB | `#003E7E` |
  | NABTEB | `#800000` |
  