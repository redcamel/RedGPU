/**
 * [KO] 주어진 이미지 URL에서 이미지를 로드하여 ImageBitmap 객체로 생성합니다.
 * [EN] Loads an image from a given URL and creates an ImageBitmap object.
 *
 * @param src
 * [KO] 이미지 소스 URL
 * [EN] Image source URL
 * @param colorSpaceConversion
 * [KO] 색상 공간 변환 옵션 (기본값: 'none')
 * [EN] Color space conversion option (default: 'none')
 * @param premultiplyAlpha
 * [KO] 프리멀티플 알파 옵션 (기본값: 'premultiply')
 * [EN] Premultiply alpha option (default: 'premultiply')
 * @returns
 * [KO] 생성된 ImageBitmap 객체를 반환하는 Promise
 * [EN] Promise returning the created ImageBitmap object
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