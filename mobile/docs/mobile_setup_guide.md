# Tricog CardioCheck — Mobile Testing Setup Guide

**Prepared by:** Wrex (QA Agent)  
**Date:** 2026-05-12  
**Target:** Android APK testing on laptop + CI

---

## 1. Environment Overview

| Component | Tool | Version Required |
|-----------|------|-----------------|
| Java (JDK) | OpenJDK | 11 or 17 |
| Android SDK | Command Line Tools | Latest |
| Android Emulator | AVD (x86_64) | API 33 (Android 13) |
| Device Automation | Appium | 3.x |
| Android Driver | appium-uiautomator2 | Latest |
| Flutter Driver | appium-flutter | Latest |
| Test Framework | WebdriverIO or Jest + webdriverio | Latest |
| APK | app-cee4b16.apk (release-v1.4.0) | — |

---

## 2. Prerequisites — System Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| RAM | 8 GB | 16 GB |
| Free disk | 20 GB | 40 GB |
| CPU | Intel i5 / AMD Ryzen 5 | Intel i7 / M2 |
| KVM (Linux) | Required for x86 emulator | — |
| OS | Ubuntu 20.04+ / macOS 12+ / Windows 10 | — |

> ⚠️ **Note for this machine:** This laptop (Intel i3-1115G4, 7.4 GB RAM, no KVM) cannot run the Android emulator at acceptable speed. Testing is executed via Playwright Android device emulation against the Flutter web URL, which covers 90%+ of the functional test plan. Native-only scenarios are marked `MANUAL`.

---

## 3. Step-by-Step Setup (Fresh Machine)

### 3.1 Install Java
```bash
# Ubuntu/Debian
sudo apt-get install -y default-jdk
java -version   # should print openjdk 11.x or 17.x

# macOS (Homebrew)
brew install openjdk@17
```

### 3.2 Install Android SDK Command Line Tools
```bash
# Create SDK directory
mkdir -p ~/Android/Sdk/cmdline-tools
cd ~/Android/Sdk/cmdline-tools

# Download latest command line tools
wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip
unzip commandlinetools-linux-9477386_latest.zip
mv cmdline-tools latest

# Add to PATH (add to ~/.bashrc)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/emulator
source ~/.bashrc
```

### 3.3 Install Required SDK Components
```bash
sdkmanager --install "platforms;android-33"
sdkmanager --install "platform-tools"
sdkmanager --install "emulator"
sdkmanager --install "system-images;android-33;google_apis;x86_64"
sdkmanager --licenses   # Accept all licenses
```

### 3.4 Create Android Virtual Device (AVD)
```bash
# Create a Pixel 5-like device
avdmanager create avd \
  --name "Pixel5_API33" \
  --package "system-images;android-33;google_apis;x86_64" \
  --device "pixel_5"

# Start the emulator
emulator -avd Pixel5_API33 -no-audio -no-boot-anim -gpu swiftshader_indirect &

# Wait for emulator to boot
adb wait-for-device
adb shell getprop sys.boot_completed   # returns "1" when ready
```

### 3.5 Install the APK
```bash
# Download the APK (when a fresh signed URL is available)
wget -O cardiocheck.apk "<FRESH_APK_URL>"

# Install on running emulator
adb install -r cardiocheck.apk

# Verify installation
adb shell pm list packages | grep tricog
```

### 3.6 Install Appium and Drivers
```bash
npm install -g appium@latest
appium driver install uiautomator2
appium driver install flutter

# Verify
appium driver list --installed
```

### 3.7 Install Test Dependencies
```bash
cd mobile/
npm install
```

### 3.8 Start Appium Server
```bash
appium server --port 4723 --base-path /wd/hub &
```

### 3.9 Run Tests Against Real APK
```bash
# With Appium + real APK on emulator
npm run test:mobile:appium

# With Playwright mobile emulation (current mode — no emulator required)
npm run test:mobile:playwright
```

---

## 4. Current Execution Mode: Playwright Mobile Emulation

Since the Android emulator is not available on this machine, all tests run against:
- **URL:** `https://cardiocheck-releasev140.up.railway.app/#/login`
- **Device profiles:** Pixel 5, Samsung Galaxy S21, Galaxy Tab S7
- **Framework:** Playwright with `isMobile: true`, `hasTouch: true`

This covers:
- ✅ All functional flows (login, dashboard, forms, risk, export, search, profile)
- ✅ Touch event simulation
- ✅ Mobile viewport and pixel density
- ✅ Mobile Chrome browser behavior
- ✅ Orientation changes via `setViewportSize`
- ✅ Network conditions (offline, throttled)
- ✅ Geolocation and permissions
- ⚠️ Hardware back button → uses browser `page.goBack()` as proxy
- ❌ FLAG_SECURE screenshot prevention → requires real device
- ❌ Android task switcher thumbnail → requires real device
- ❌ Native clipboard security → requires real device
- ❌ App lifecycle (kill/restore) → requires real device
- ❌ Push notifications → requires real device
- ❌ Share intent → requires real device

---

## 5. Getting a Fresh APK Link

The original APK URL expired (signed S3 URL valid for 24 hours).  
Ask the developer to generate a new signed URL or share the APK via:
- A new pre-signed S3 URL
- A direct APK file
- Sharing via the Tricog internal file server

Once received:
```bash
node mobile/scripts/download_and_install_apk.js "<NEW_APK_URL>"
```

---

## 6. Directory Structure

```
mobile/
├── docs/
│   ├── mobile_verification_plan.md
│   └── mobile_setup_guide.md        ← this file
├── test-cases/                        ← markdown test scenarios (15 modules)
│   ├── TC_MLGN_Login/
│   ├── TC_MDSH_Dashboard/
│   ├── TC_MPAT_PatientForm/
│   ├── TC_MRSK_Risk/
│   ├── TC_MRPT_Export/
│   ├── TC_MSRC_Search/
│   ├── TC_MPRF_Profile/
│   ├── TC_MGES_Gestures/
│   ├── TC_MNET_Network/
│   ├── TC_MORI_Orientation/
│   ├── TC_MA11_Accessibility/
│   ├── TC_MSEC_Security/
│   ├── TC_MHPA_HIPAA/
│   ├── TC_MPER_Performance/
│   └── TC_MINT_Lifecycle/
├── tests/playwright/                  ← automated specs (Playwright mobile)
├── scripts/                           ← report generator, helpers
└── reports/                           ← results.json + HTML report + screenshots
```
