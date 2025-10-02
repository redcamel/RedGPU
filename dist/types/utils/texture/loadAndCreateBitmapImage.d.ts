/**
 * 주어진 이미지 URL에서 이미지를 로드하여 ImageBitmap 객체로 생성합니다.
 *
 * @param src - 이미지 소스 URL
 * @param colorSpaceConversion - 색상 공간 변환 옵션 (기본값: 'none')
 * @param premultiplyAlpha - 프리멀티플 알파 옵션 (기본값: 'premultiply')
 * @returns 생성된 ImageBitmap 객체를 반환하는 Promise
 * @category Texture
 */
declare function loadAndCreateBitmapImage(src: string, colorSpaceConversion?: ColorSpaceConversion, premultiplyAlpha?: PremultiplyAlpha): Promise<ImageBitmap>;
export default loadAndCreateBitmapImage;
