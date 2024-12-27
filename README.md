<h1 align="center">MedicationTrackingApp</h1>

![License](https://img.shields.io/badge/license-MIT-blue)

This app uses MediaPipe to track the user's medication intake and store the data into Supabase. We also build an app with React Native Expo Router to display the user's medication history and remind the user to take their medication between the time intervals they set. Feel free to give us a star (❁´◡`❁). Your support is our energy to create better projects! [Live demo](https://drive.google.com/drive/folders/16iHki0Dm4yHXm4xOsHz8CBZsnXuHVqFX?usp=sharing)

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🚀 [Reference](#reference)

## <a name="introduction">🤖 Introduction</a>

### Our Idea

#### Flow
![flow](/assets/images/flow.png)

#### App Interface
![app](/assets/images/app.png)

#### Medication-taking posture not triggered
![no](/assets/images/no.png)

#### Successfully triggered the medicine-taking posture
![yes](/assets/images/yes.png)

## <a name="tech-stack">⚙️ Tech Stack</a>

- React Native Expo
- TypeScript
- Tailwind CSS/Nativewind
- Supabase
- MediaPipe
- OpenCV

## <a name="features">🔋 Features</a>

👉 **Robust Authentication**: Secure and reliable user login and registration system with Supabase authentication. Password will be hashed before stored in Supabase.

👉 **Medication Tracking**: Use MediaPipe to track the user's medication intake and store the data into Supabase.

👉 **Medication Reminder**: Create a new notification in Supabase and remind the user to take medication simultaneously.

👉 **Medication Logs**: Store the user's medication logs in Supabase and display it the app simultaneously.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**
Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (node version higher than v20._._)
- [pnpm](https://pnpm.io/)
- [Android Studio](https://developer.android.com/studio) or [Xcode](https://developer.apple.com/xcode/)
- [Python](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

### 1. Cloning the Repository

```bash
git clone https://github.com/ChenBingWei1201/MedicationTrackingApp.git
cd MedicationTrackingApp
```

### 2. Install the project dependencies

```bash
# MedicationTrackingApp
pnpm i
```

### 3. Set Up Environment Variables

```bash
# MedicationTrackingApp
cp .env.development .env.local
```

in .env.local

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Replace the placeholder values with your actual Supabase credentials. You can obtain these credentials by signing up on the [Supabase](https://supabase.com/dashboard/projects) website.

### 4. Running the app
- Android (android studio must be installed)
```bash
# MedicationTrackingApp
pnpm android
```
it will open the app in android emulator

- iOS (xcode must be installed)
```bash
# MedicationTrackingApp
pnpm ios
```
it will open the app in ios simulator

### 5. Running the MediaPipe Model to track the user's medication intake

read the `README.md` in the `mediapipe` folder

## <a name="reference">🚀 Reference</a>

- [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer/python)
- [Expo](https://docs.expo.dev/get-started/create-a-project/)
- [Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Nativewind](https://www.nativewind.dev/getting-started/expo-router)
- [React Native Full 8 Hours Course (Expo, Expo Router, Supabase)](https://youtu.be/rIYzLhkG9TA?feature=shared)
