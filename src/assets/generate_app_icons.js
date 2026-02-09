const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const basePath = path.join(__dirname, '../../../android/app/src/main/res');
const sourceSvgPath = path.join(__dirname, 'icon-192.png.svg');

async function createAppIcon(size, folder) {
  // Read the source SVG file
  const svgBuffer = fs.readFileSync(sourceSvgPath);

  const folderPath = path.join(basePath, folder);
  
  // Create folder if not exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Generate PNG files
  const pngPath = path.join(folderPath, 'ic_launcher.png');
  const roundPngPath = path.join(folderPath, 'ic_launcher_round.png');

  // Resize and convert to PNG
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(pngPath);

  // Also create round version
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(roundPngPath);

  return { pngPath, roundPngPath };
}

async function generateAllIcons() {
  console.log('📱 Generating KeepLynk App Icons...\n');

  for (const [folder, size] of Object.entries(sizes)) {
    try {
      const { pngPath, roundPngPath } = await createAppIcon(size, folder);
      console.log(`✅ Created ${folder}:`);
      console.log(`   - ic_launcher.png (${size}x${size})`);
      console.log(`   - ic_launcher_round.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error creating ${folder}:`, error.message);
    }
  }

  console.log('\n🎉 App icon generation complete!');
  console.log('📝 Icons are now ready in android/app/src/main/res/mipmap-*/ folders');
  console.log('\n🔧 Next steps:');
  console.log('1. Rebuild your app: npx react-native run-android');
  console.log('2. Or build release APK: cd android && .\\gradlew.bat assembleRelease\n');
}

generateAllIcons().catch(console.error);
