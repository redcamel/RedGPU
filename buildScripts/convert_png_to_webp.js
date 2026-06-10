const fs = require('fs/promises');
const path = require('path');
let sharp;

try {
    sharp = require('sharp');
} catch (e) {
    console.error('Please install "sharp" first by running: npm install sharp');
    process.exit(1);
}

const EXAMPLES_DIR = path.resolve(__dirname, '../examples');
const EXCLUDE_DIR = path.resolve(__dirname, '../examples/assets');
const EXCLUDE_DIR2 = path.resolve(__dirname, '../examples/exampleHelper');

async function processDirectory(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        // Exclude examples/assets directory
        if (fullPath.startsWith(EXCLUDE_DIR) || fullPath.startsWith(EXCLUDE_DIR2)) {
            continue;
        }

        if (entry.isDirectory()) {
            await processDirectory(fullPath);
        } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.png') {
            await convertToWebp(fullPath);
        }
    }
}

async function convertToWebp(filePath) {
    const parsedPath = path.parse(filePath);
    const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    try {
        const metadata = await sharp(filePath).metadata();
        const newWidth = Math.round(metadata.width * 0.5);
        const newHeight = Math.round(metadata.height * 0.5);

        await sharp(filePath)
            .resize(newWidth, newHeight)
            .webp()
            .toFile(webpPath);
        
        console.log(`Converted and resized to 50% (${newWidth}x${newHeight}): ${filePath} -> ${webpPath}`);
        
        // Remove original PNG files after conversion
        await fs.unlink(filePath);
        console.log(`Deleted original: ${filePath}`);
    } catch (error) {
        console.error(`Error converting ${filePath}:`, error.message);
    }
}

async function main() {
    console.log('Starting PNG to WEBP conversion...');
    try {
        await processDirectory(EXAMPLES_DIR);
        console.log('Conversion completed successfully.');
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

main();