/**
 * [KO] SVG 이미지 경로를 로드하여 캔버스에 렌더링한 뒤 `ImageBitmap`으로 변환합니다.
 * [EN] Loads an SVG image from the given source, renders it to a canvas, and converts it into an `ImageBitmap`.
 *
 * @param src -
 * [KO] 로드할 SVG 파일 경로 또는 URL
 * [EN] SVG file path or URL to load
 * @param premultiplyAlpha -
 * [KO] 알파 프리멀티플라이 옵션 (기본값: `'none'`)
 * [EN] Premultiply alpha option (default: `'none'`)
 * @returns
 * [KO] 변환된 `ImageBitmap`을 반환하는 `Promise`
 * [EN] `Promise` resolving to the converted `ImageBitmap`
 * @category Texture
 */
export async function convertSvgToImageBitmap(
    src: string,
    premultiplyAlpha: PremultiplyAlpha = 'none'
): Promise<ImageBitmap> {
    return new Promise((resolve, reject) => {
        const svgImage = new Image();
        svgImage.crossOrigin = "anonymous";
        svgImage.src = src;
        svgImage.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = svgImage.width || 512;
            canvas.height = svgImage.height || 512;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("[convertSvgToImageBitmap ❌] Canvas context could not be created."));
                return;
            }
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(svgImage, 0, 0, canvas.width, canvas.height);
            createImageBitmap(canvas, {
                colorSpaceConversion: 'none',
                premultiplyAlpha
            })
                .then(resolve)
                .catch(reject);
        };
        svgImage.onerror = (error) => {
            reject(new Error(`[convertSvgToImageBitmap ❌] Failed to load SVG: ${error}`));
        };
    });
}

export default convertSvgToImageBitmap;
