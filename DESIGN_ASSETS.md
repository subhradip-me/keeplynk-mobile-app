# KeepLynk Design Assets

## 🎨 App Icon & Logo

### Logo Design Concept
The KeepLynk logo represents a **chain link** symbolizing connection, organization, and keeping things together. The design is clean, modern, and easily recognizable.

### Color Palette

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary Blue | `#2383E2` | Main brand color, backgrounds |
| Primary Light | `#5EAAF6` | Accents, highlights |
| Primary Dark | `#1F6FBD` | Hover states, depth |
| White | `#FFFFFF` | Icons on primary, text on dark |

### Logo Sizes

The logo component supports dynamic sizing:
- **Small**: 40px (Navigation, Cards)
- **Medium**: 60px (Headers, Default)
- **Large**: 120px (Loading Screen, Splash)

### Usage in Code

```jsx
import Logo from '../components/Logo';

// Default size (60px)
<Logo />

// Custom size
<Logo size={80} />

// Custom color
<Logo size={100} color="#FFFFFF" />
```

---

## 📱 Android App Icons

App icons have been generated for all Android screen densities:

| Density | Size | Folder |
|---------|------|--------|
| MDPI | 48x48 | `mipmap-mdpi` |
| HDPI | 72x72 | `mipmap-hdpi` |
| XHDPI | 96x96 | `mipmap-xhdpi` |
| XXHDPI | 144x144 | `mipmap-xxhdpi` |
| XXXHDPI | 192x192 | `mipmap-xxxhdpi` |

### Icon Files Location
```
android/app/src/main/res/
  ├── mipmap-mdpi/ic_launcher.svg
  ├── mipmap-hdpi/ic_launcher.svg
  ├── mipmap-xhdpi/ic_launcher.svg
  ├── mipmap-xxhdpi/ic_launcher.svg
  └── mipmap-xxxhdpi/ic_launcher.svg
```

### Converting SVG to PNG

**Option 1: Using Android Studio (Recommended)**
1. Open project in Android Studio
2. Right-click `res` folder
3. Select `New → Image Asset`
4. Choose `Icon Type: Launcher Icons`
5. Select `Asset Type: Image`
6. Browse to SVG files
7. Click `Next` and `Finish`

**Option 2: Online Converter**
1. Visit [CloudConvert](https://cloudconvert.com/svg-to-png)
2. Upload SVG files
3. Set dimensions accordingly
4. Download PNG files
5. Replace in respective folders

**Option 3: Command Line (ImageMagick)**
```bash
# Install ImageMagick first
magick convert -density 300 -background none ic_launcher.svg ic_launcher.png
```

---

## 🎭 Loading Screen

### Design Features
- **Gradient Background**: Smooth transition from primary to light blue
- **Animated Logo**: Pulse effect with fade-in animation
- **Loading Bar**: Animated progress indicator
- **Responsive**: Adapts to light/dark themes

### Animation Details
- **Fade In**: 800ms duration
- **Scale Spring**: Friction 4, Tension 40
- **Pulse Loop**: 1000ms cycle, 10% scale increase

### Theme Support
- **Light Theme**: Blue gradient background, white logo
- **Dark Theme**: Dark background, blue logo with white accents

---

## 🔧 Asset Files

### Created Files
```
src/
├── assets/
│   ├── logo.svg                 # Main SVG logo
│   ├── create_icons.js          # Icon generator script
│   └── generate_icons.py        # Alternative Python generator
├── components/
│   └── Logo.jsx                 # Reusable logo component
└── screens/
    └── LoadingScreen.jsx        # Animated loading screen
```

---

## 🚀 Regenerating Icons

To regenerate icon files:

```bash
# Using Node.js script
node src/assets/create_icons.js
```

This will create SVG files for all densities. Convert them to PNG using one of the methods above.

---

## 📐 Design Guidelines

### Logo Usage
- ✅ Use on solid backgrounds
- ✅ Maintain aspect ratio
- ✅ Keep minimum size of 40px
- ❌ Don't distort or stretch
- ❌ Don't change colors arbitrarily
- ❌ Don't add effects or shadows (component handles this)

### Color Usage
- Primary Blue for main actions and branding
- Light Blue for accents and hover states
- White for contrast on colored backgrounds
- Maintain WCAG AA contrast ratios

---

## 🎯 Future Enhancements

- [ ] Create iOS app icons
- [ ] Add adaptive icon support (Android 8.0+)
- [ ] Create splash screen assets
- [ ] Design promotional graphics
- [ ] Create app store screenshots
- [ ] Design widget icons

---

## 📝 Notes

- All icons follow Material Design guidelines
- SVG format used for scalability
- Logo component supports theme customization
- Loading screen adapts to device orientation
- Assets are optimized for performance

---

*Last Updated: February 9, 2026*
