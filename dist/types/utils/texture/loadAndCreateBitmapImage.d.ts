/**
 * [KO] 이미지 URL에서 ImageBitmap을 생성합니다.
 * [EN] Loads an image and creates an ImageBitmap.
 *
 * * ### Example
 * ```typescript
 * const bitmap = await RedGPU.Util.loadAndCreateBitmapImage('path/to/image.png');
 * ```
 *
 * @param src -
 * [KO] 이미지 소스 URL
 * [EN] Image source URL
 * @param colorSpaceConversion -
 * [KO] 색상 공간 변환 옵션 (기본값: 'none')
 * [EN] Color space conversion option (Default: 'none')
 * @param premultiplyAlpha -
 * [KO] 프리멀티플 알파 옵션 (기본값: 'premultiply')
 * [EN] Premultiply alpha option (Default: 'premultiply')
 * @returns
 * [KO] ImageBitmap을 반환하는 Promise
 * [EN] Promise returning an ImageBitmap
 * @category Texture
 */
declare function loadAndCreateBitmapImage(src: string, colorSpaceConversion?: ColorSpaceConversion, premultiplyAlpha?: PremultiplyAlpha): Promise<ImageBitmap>;
export default loadAndCreateBitmapImage;
