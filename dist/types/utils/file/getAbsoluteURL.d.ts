/**
 * [KO] 기준 URL을 기준으로 상대 경로를 해석하여 절대 URL 문자열을 반환합니다.
 * [EN] Resolves a relative path against a base URL and returns the absolute URL string.
 *
 * ### Example
 * ```typescript
 * // [KO] 'https://example.com/image.png' 반환
 * // [EN] Returns 'https://example.com/image.png'
 * const absoluteURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
 * ```
 *
 * @param base -
 * [KO] 기준 URL (문자열 또는 `URL` 객체)
 * [EN] Base URL (string or `URL` object)
 * @param relative -
 * [KO] 해석할 상대 경로 또는 URL
 * [EN] Relative path or URL to resolve
 * @returns
 * [KO] 절대 URL 문자열
 * [EN] Absolute URL string
 * @throws
 * [KO] `relative`가 빈 문자열이거나 `base`가 유효한 문자열/`URL`이 아닌 경우
 * [EN] If `relative` is empty or `base` is not a valid string/`URL`
 * @category File
 */
declare function getAbsoluteURL(base: string | URL, relative: string): string;
export default getAbsoluteURL;
