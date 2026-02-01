# KeepLynk Mobile App 📱

A modern React Native mobile application for managing and organizing your links, resources, and bookmarks with a beautiful Notion-inspired UI.

## ✨ Features

- 🔐 **User Authentication** - Secure JWT token-based login and registration with Axios interceptors
- 📁 **Folder Management** - Create, edit, organize resources in color-coded folders
- 🔗 **Resource Management** - Save and manage URLs, links, and bookmarks
- 🏷️ **Tag System** - Categorize resources with tags (displays "Untagged" for untagged items)
- 🔍 **Smart Search** - Real-time search across all resources
- ⭐ **Favorites** - Mark and filter important resources
- 🎯 **Smart Selection Mode** - Long-press to select and organize uncategorised items
- 🤖 **AI Auto-Organize** - Intelligent resource organization with gradient action button
- 🎨 **Notion-Inspired UI** - Clean, modern interface with consistent design system
- 📱 **Bottom Tab Navigation** - Intuitive navigation with React Navigation
- 🔄 **Redux State Management** - Efficient state handling with Redux Toolkit
- 🎭 **Polished Profile Screen** - Beautiful card-based profile UI with account management

## 🛠️ Tech Stack

- **React Native** 0.83.1
- **React Navigation** - Native Stack & Bottom Tabs (@react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs)
- **Redux Toolkit** - State Management (@reduxjs/toolkit, react-redux)
- **Axios** - HTTP client with interceptors for authentication
- **React Native Vector Icons** - MaterialIcons
- **React Native Linear Gradient** - Gradient UI elements
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
cd KeepLynk
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
KeepLynk/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── app/             # Redux store configuration
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components (LinkItem, FolderCard, etc.)
│   ├── config/          # API configuration
│   ├── constants/       # Theme constants (Colors, Spacing, Shadows, etc.)
│   ├── data/            # Dummy data for development
│   ├── features/        # Redux slices & hooks
│   │   ├── auth/        # Authentication (slice, thunks, hooks, selectors)
│   │   ├── folders/     # Folder management
│   │   └── resources/   # Resource management
│   ├── modals/          # Modal components (AccountSheet, AddResourceModal, etc.)
│   ├── navigations/     # Navigation setup (RootStack, FoldersStack, BottomTabs)
│   ├── screens/         # Screen components
│   │   ├── AuthScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── FoldersScreen.jsx
│   │   ├── FolderDetailScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── ...
│   ├── services/        # API services (modular architecture)
│   │   ├── api/         # Axios instance with interceptors
│   │   ├── auth/        # Authentication API
│   │   ├── folders/     # Folders API
│   │   ├── resources/   # Resources API
│   │   ├── tags/        # Tags API
│   │   └── organize/    # AI organization API
│   └── utils/           # Utility functions and helpers
├── App.jsx              # Main app component
├── index.js             # Entry point
└── package.json         # Dependencies
```

## 🎨 Key Features

### Authentication System
- Login/Register with email and password
- JWT token-based authentication with Axios interceptors
- ApiTokenManager for centralized token storage
- Persistent login state with automatic token restoration
- Secure logout with navigation reset

### Folder Management
- Create, edit, and delete color-coded folders
- Organize resources by folders with visual badges
- Nested navigation to folder details
- Folder lookup mapping for efficient data access

### Resource Management
- Add URLs and links with metadata
- Edit resource details
- Tag resources (displays "Untagged" for items without tags)
- Mark as favorites with star icon
- Associate with folders with color-coded badges
- Long-press selection mode for batch operations
- Menu actions: Edit, Move to Folder, Favorite, Delete

### Smart Features
- Real-time search across all resources
- Filter by tags, folders, and favorites
- AI-powered Auto Organize with gradient button
- Selection mode for organizing uncategorised items
- Folder color badges for visual organization

### UI/UX
- Notion-inspired design system
- Consistent theming with Colors, Spacing, Shadows constants
- Polished profile screen with card-based layout
- Smooth animations and transitions
- Bottom tab navigation with icons

## 🔧 Configuration

The app uses various configuration files:

- `app.json` - App metadata and display name
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration
- `jest.config.js` - Testing configuration
- `src/config/api.js` - API base URL and endpoints

### API Configuration

The app connects to: `https://api-gateway-keeplynk-1.onrender.com/api`

Update `src/config/api.js` to change the API endpoint.

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

## 🐛 Troubleshooting

### Common Issues

**Android Build Errors**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**iOS Build Errors**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Metro Bundler Issues**
```bash
npm start -- --reset-cache
```

**Missing Dependencies**
```bash
npm install
cd ios && pod install && cd ..
```

For more help, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) guide.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Subhradip Mondal**
- GitHub: [@subhradip-me](https://github.com/subhradip-me)

## 📚 Learn More

- [React Native Documentation](https://reactnative.dev)
- [React Navigation Documentation](https://reactnavigation.org)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Axios Documentation](https://axios-http.com)

## 🙏 Acknowledgments

- Notion for UI/UX inspiration
- React Native community for amazing tools and libraries
- Redux Toolkit for simplified state management
- Axios for reliable HTTP client

---

Made with ❤️ using React Native
