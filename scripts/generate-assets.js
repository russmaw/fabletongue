const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const IMAGES_DIR = path.join(ASSETS_DIR, 'images');
const LOGO_PATH = path.join(IMAGES_DIR, 'logo.svg');

console.log('Starting script...');
console.log('ASSETS_DIR:', ASSETS_DIR);
console.log('IMAGES_DIR:', IMAGES_DIR);
console.log('LOGO_PATH:', LOGO_PATH);

// Ensure directories exist
[ASSETS_DIR, IMAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  } else {
    console.log(`Directory exists: ${dir}`);
  }
});

// Check if logo exists
if (fs.existsSync(LOGO_PATH)) {
  console.log('Logo file found');
} else {
  console.error('Logo file not found!');
  process.exit(1);
}

// Asset specifications
const assets = [
  {
    name: 'icon',
    width: 1024,
    height: 1024,
    format: 'png',
    description: 'App icon'
  },
  {
    name: 'splash',
    width: 1242,
    height: 2436,
    format: 'png',
    description: 'Splash screen',
    special: true
  },
  {
    name: 'adaptive-icon',
    width: 1024,
    height: 1024,
    format: 'png',
    description: 'Android adaptive icon'
  },
  {
    name: 'favicon',
    width: 32,
    height: 32,
    format: 'png',
    description: 'Web favicon'
  }
];

async function generateSplashScreen(image, asset, outputPath) {
  console.log(`Generating splash screen at: ${outputPath}`);
  const background = { r: 107, g: 78, b: 113, alpha: 1 }; // #6B4E71
  
  try {
    // Create a background canvas
    const canvas = sharp({
      create: {
        width: asset.width,
        height: asset.height,
        channels: 4,
        background
      }
    });

    console.log('Created canvas');

    // Resize logo to fit in the center
    const logoSize = Math.min(asset.width, asset.height) * 0.5;
    console.log(`Resizing logo to: ${logoSize}x${logoSize}`);
    
    const resizedLogo = await sharp(LOGO_PATH)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    console.log('Resized logo');

    // Composite the logo onto the background
    await canvas
      .composite([
        {
          input: resizedLogo,
          top: Math.floor((asset.height - logoSize) / 2),
          left: Math.floor((asset.width - logoSize) / 2)
        }
      ])
      .toFile(outputPath);

    console.log('Composited logo onto background');
  } catch (error) {
    console.error('Error in generateSplashScreen:', error);
    throw error;
  }
}

async function generateAsset(asset) {
  try {
    console.log(`\nGenerating ${asset.description}...`);
    const outputPath = path.join(IMAGES_DIR, `${asset.name}.${asset.format}`);
    console.log(`Output path: ${outputPath}`);

    if (asset.special) {
      await generateSplashScreen(sharp(LOGO_PATH), asset, outputPath);
    } else {
      await sharp(LOGO_PATH)
        .resize(asset.width, asset.height, {
          fit: 'contain',
          background: { r: 107, g: 78, b: 113, alpha: 1 } // #6B4E71
        })
        .toFile(outputPath);
    }

    console.log(`✓ Generated ${asset.name}.${asset.format}`);
  } catch (error) {
    console.error(`Error generating ${asset.name}:`, error);
    throw error;
  }
}

async function generateAssets() {
  console.log('\nStarting asset generation...');
  
  try {
    // Generate all assets
    for (const asset of assets) {
      await generateAsset(asset);
    }
    
    console.log('\nAsset generation complete!');
  } catch (error) {
    console.error('\nAsset generation failed:', error);
    process.exit(1);
  }
}

generateAssets(); 