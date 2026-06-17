# Lendro App

  A React Native (Expo) fintech community-support app for Nigeria — enabling repayable support funds, partner service purchases (airtime, data, cable TV), reward points, and grant leaderboards.

  ---

  ## Getting Started

  ### Install Dependencies

  ```bash
  pnpm install
  ```

  ### Start the Expo Dev Server

  ```bash
  pnpm exec expo start
  ```

  Then press:
  - `a` — open on Android emulator/device
  - `i` — open on iOS simulator
  - `w` — open in web browser
  - Scan QR code with **Expo Go** app on your phone

  ---

  ## Build APK / AAB (Android)

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

  Output: `android/app/build/outputs/apk/release/app-release.apk`

  ### Generate a release AAB (for Play Store)

  ```bash
  cd android
  ./gradlew bundleRelease
  ```

  Output: `android/app/build/outputs/bundle/release/app-release.aab`

  ---

  ## Build with EAS (Expo Application Services)

  Install EAS CLI:

  ```bash
  pnpm add -g eas-cli
  eas login
  ```

  ### Build APK (for direct install)

  ```bash
  eas build --platform android --profile preview
  ```

  ### Build AAB (for Play Store)

  ```bash
  eas build --platform android --profile production
  ```

  ### Build iOS IPA

  ```bash
  eas build --platform ios --profile production
  ```

  Configure profiles in `eas.json`.

  ---

  ## Screens

  | Screen | Route | Description |
  |--------|-------|-------------|
  | Onboarding | `/onboarding` | 3-slide intro shown once |
  | Login | `/auth/login` | Phone/email + biometric auth |
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
  │   ├── onboarding.tsx   # Onboarding slides
  │   ├── transactions.tsx # Transaction history
  │   └── _layout.tsx      # Root layout + route guards
  ├── assets/
  │   └── images/logos/    # Brand logos (MTN, Airtel, GLO, 9mobile, DSTV, GOtv, StarTimes, Showmax, WAEC, NECO, JAMB, NABTEB)
  ├── context/
  │   └── AppContext.tsx   # Global state (wallet, transactions, auth)
  └── hooks/
      └── useColors.ts     # Theme colors
  ```

  ---

  ## Tech Stack

  - **Expo SDK 54** + **React Native**
  - **Expo Router v6** — file-based navigation
  - **TypeScript**
  - **expo-linear-gradient** — gradient headers
  - **expo-haptics** — tactile feedback
  - **expo-local-authentication** — fingerprint/Face ID
  - **react-native-safe-area-context**

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
  