# KeepLynk Mobile App 📱

A modern React Native mobile application for managing and organizing your links, resources, and bookmarks with a beautiful Notion-inspired UI.

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration
- 📁 **Folder Management** - Organize resources in folders
- 🔗 **Resource Management** - Save and manage URLs and links
- 🏷️ **Tag System** - Categorize resources with tags
- 🔍 **Smart Search** - Quick search across all resources
- ⭐ **Favorites** - Mark important resources
- 🎨 **Notion-Inspired UI** - Clean, modern interface
- 📱 **Bottom Tab Navigation** - Easy navigation with React Navigation
- 🔄 **Redux State Management** - Efficient state handling with Redux Toolkit

## 🛠️ Tech Stack

- **React Native** 0.83.1
- **React Navigation** - Native Stack & Bottom Tabs
- **Redux Toolkit** - State Management
- **React Native Vector Icons** - MaterialIcons
- **React Native Safe Area Context** - Safe area handling
- **React Native Screens** - Native screen optimization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (>= 20)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- JDK 17 or higher

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/subhradip-me/keeplynk-mobile-app.git
cd keeplynk-mobile-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Metro Bundler

```bash
npm start
```

### 4. Run the app

#### Android

```bash
npm run android
```

#### iOS

First, install CocoaPods dependencies:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

Then run:

```bash
npm run ios
```

## 📂 Project Structure

```
keeplynk/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── app/             # Redux store configuration
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   ├── constants/       # Theme, colors, etc.
│   ├── features/        # Redux slices (auth, folders, resources)
│   ├── modals/          # Modal components
│   ├── navigations/     # Navigation setup
│   ├── screens/         # Screen components
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── App.jsx              # Main app component
└── index.js            # Entry point
```

## 🎨 Key Features

### Authentication
- Login/Register with email and password
- Secure token-based authentication
- Persistent login state

### Folder Management
- Create, edit, and delete folders
- Organize resources by folders
- Nested navigation for folder details

### Resource Management
- Add URLs and links
- Edit resource details
- Tag resources
- Mark as favorites
- Associate with folders

### Search & Filter
- Real-time search
- Filter by tags, folders, and dates
- Quick access to favorites

## 🔧 Configuration

The app uses various configuration files:

- `app.json` - App metadata
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `jest.config.js` - Testing configuration

## 🧪 Testing

Run tests with:

```bash
npm test
```

## 📱 Build for Production

### Android

```bash
cd android
./gradlew assembleRelease
```

### iOS

```bash
cd ios
xcodebuild -workspace KeepLynk.xcworkspace -scheme KeepLynk -configuration Release
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Subhradip Mondal**
- GitHub: [@subhradip-me](https://github.com/subhradip-me)

## 🙏 Acknowledgments

- Notion for UI/UX inspiration
- React Native community for amazing tools and libraries

---

Made with ❤️ using React Native

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
