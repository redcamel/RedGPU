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
export declare function convertSvgToImageBitmap(src: string, premultiplyAlpha?: PremultiplyAlpha): Promise<ImageBitmap>;
export default convertSvgToImageBitmap;
