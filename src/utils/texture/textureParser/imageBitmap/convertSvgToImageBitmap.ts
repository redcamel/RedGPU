/**
 * [KO] SVG 이미지 URL 또는 소스를 읽어 ImageBitmap으로 변환합니다.
 * [EN] Loads an SVG image URL or source and converts it to an ImageBitmap.
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
