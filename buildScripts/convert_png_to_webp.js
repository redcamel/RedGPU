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

// Open Graph (og:image) 및 썸네일 표준 타겟 규격 (800 x 420, 40:21 ≈ 1.9048:1)
const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 420;
const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT;
// 육안으로 식별 불가능한 허용 비율 오차 범위 (±2%)
const MAX_RATIO_TOLERANCE = 0.02;

let convertedCount = 0;
let skippedCount = 0;

async function processDirectory(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);

        // Exclude examples/assets and examples/exampleHelper directories
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
        const {width, height} = metadata;

        if (!width || !height) {
            console.warn(`[SKIP] 이미지 크기 정보를 읽을 수 없습니다: ${filePath}`);
            skippedCount++;
            return;
        }

        const srcRatio = width / height;
        const ratioError = Math.abs(srcRatio - TARGET_RATIO) / TARGET_RATIO;
        const errorPercent = (ratioError * 100).toFixed(2);

        // 비율 오차가 허용치(±2%)를 초과하면 변환 및 원본 삭제를 중단(Skip)하고 경고 출력
        if (ratioError > MAX_RATIO_TOLERANCE) {
            const suggestedHeight = Math.round(width / TARGET_RATIO);
            const suggestedWidth = Math.round(height * TARGET_RATIO);
            console.warn(
                `[SKIP] 비율 오차 초과 (${errorPercent}% > ${(MAX_RATIO_TOLERANCE * 100).toFixed(0)}%): ${filePath}\n` +
                `       - 원본 크기: ${width}x${height} (비율 ${srcRatio.toFixed(4)}:1)\n` +
                `       - 목표 규격: ${TARGET_WIDTH}x${TARGET_HEIGHT} (비율 ${TARGET_RATIO.toFixed(4)}:1)\n` +
                `       - 권장 캡처 크기: ${width}x${suggestedHeight} 또는 ${suggestedWidth}x${height} (원본 PNG 유지됨)`
            );
            skippedCount++;
            return;
        }

        await sharp(filePath)
            .resize(TARGET_WIDTH, TARGET_HEIGHT, {
                fit: 'cover',
                position: 'centre'
            })
            .webp()
            .toFile(webpPath);

        console.log(
            `[OK] ${width}x${height} (${srcRatio.toFixed(3)}:1, 오차 ${errorPercent}%) -> ` +
            `${TARGET_WIDTH}x${TARGET_HEIGHT}: ${webpPath}`
        );

        // Remove original PNG files after conversion
        await fs.unlink(filePath);
        console.log(`Deleted original: ${filePath}`);
        convertedCount++;
    } catch (error) {
        console.error(`Error converting ${filePath}:`, error.message);
    }
}

async function main() {
    console.log(
        `Starting PNG to WEBP conversion (Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}, ` +
        `Ratio: ${TARGET_RATIO.toFixed(4)}:1, Tolerance: ±${(MAX_RATIO_TOLERANCE * 100).toFixed(0)}%)...`
    );
    try {
        await processDirectory(EXAMPLES_DIR);
        console.log(`Conversion completed. (Converted: ${convertedCount}, Skipped: ${skippedCount})`);
    } catch (error) {
        console.error('Error during conversion:', error);
    }
}

main();
