/**
 * [KO] 지정된 URL의 이미지를 `fetch`로 로드하여 `ImageBitmap`으로 생성합니다.
 * [EN] Fetches an image from the specified URL and creates an `ImageBitmap`.
 *
 * @param src -
 * [KO] 로드할 이미지 URL 또는 경로
 * [EN] Image URL or path to load
 * @param colorSpaceConversion -
 * [KO] 색 공간 변환 옵션 (기본값: `'none'`)
 * [EN] Color space conversion option (default: `'none'`)
 * @param premultiplyAlpha -
 * [KO] 알파 프리멀티플라이 옵션 (기본값: `'premultiply'`)
 * [EN] Premultiply alpha option (default: `'premultiply'`)
 * @returns
 * [KO] 생성된 `ImageBitmap`을 반환하는 `Promise`
 * [EN] `Promise` resolving to the created `ImageBitmap`
 * @throws
 * [KO] 이미지 네트워크 요청이 실패한 경우 `Error`가 발생합니다.
 * [EN] Throws `Error` if fetching the image fails.
 * @category Texture
 */
async function loadImageToImageBitmap(
    src: string,
    colorSpaceConversion: ColorSpaceConversion = 'none',
    premultiplyAlpha: PremultiplyAlpha = 'premultiply'
): Promise<ImageBitmap> {
    const response = await fetch(src);
    if (!response.ok) {
        throw new Error(`[loadImageToImageBitmap ❌] Failed to fetch image from ${src}: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return await createImageBitmap(blob, {
        colorSpaceConversion,
        premultiplyAlpha
    });
}

export default loadImageToImageBitmap;
