/**
 * [KO] 이미지 URL에서 이미지를 로드하여 ImageBitmap 객체를 생성합니다.
 * [EN] Loads an image from a URL and creates an ImageBitmap object.
 *
 * * ### Example
 * ```typescript
 * const bitmap = await loadAndCreateBitmapImage('path/to/image.png');
 * ```
 *
 * @param src
 * [KO] 이미지 소스 URL
 * [EN] Image source URL
 * @param [colorSpaceConversion='none']
 * [KO] 색상 공간 변환 옵션
 * [EN] Color space conversion option
 * @param [premultiplyAlpha='premultiply']
 * [KO] 프리멀티플 알파 옵션
 * [EN] Premultiply alpha option
 *
 * @returns
 * [KO] 생성된 ImageBitmap을 반환하는 Promise
 * [EN] Promise returning the created ImageBitmap
 *
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