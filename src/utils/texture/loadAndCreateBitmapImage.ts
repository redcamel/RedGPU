/**
 * [KO] 이미지 URL로부터 ImageBitmap을 로드하고 생성합니다.
 * [EN] Loads and creates an ImageBitmap from an image URL.
 *
 * * ### Example
 * ```typescript
 * const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('path/to/image.png');
 * ```
 *
 * @param src - [KO] 이미지 소스 URL [EN] Image source URL
 * @param colorSpaceConversion - [KO] 색상 공간 변환 옵션 (기본값: 'none') [EN] Color space conversion option (Default: 'none')
 * @param premultiplyAlpha - [KO] 프리멀티플 알파 옵션 (기본값: 'premultiply') [EN] Premultiply alpha option (Default: 'premultiply')
 * @returns [KO] 생성된 ImageBitmap [EN] Created ImageBitmap
 * @category Texture
 */
async function loadAndCreateBitmapImage(
    src: string,
    colorSpaceConversion: ColorSpaceConversion = 'none',
    premultiplyAlpha: PremultiplyAlpha = 'premultiply'
): Promise<ImageBitmap> {
    const response = await fetch(src);
    const blob = await response.blob();
    return createImageBitmap(blob, {
        colorSpaceConversion,
        premultiplyAlpha
    });
}

export default loadAndCreateBitmapImage
