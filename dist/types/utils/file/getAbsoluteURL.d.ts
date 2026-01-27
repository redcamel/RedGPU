/**
 * [KO] 상대 경로를 절대 URL로 변환합니다.
 * [EN] Converts a relative path to an absolute URL.
 *
 * [KO] base와 relative를 조합하여 절대 URL을 반환하며, 실패 시 relative를 그대로 반환합니다.
 * [EN] Combines base and relative to return an absolute URL, returning relative if it fails.
 *
 * * ### Example
 * ```typescript
 * const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
 * ```
 *
 * @param base -
 * [KO] 기준이 되는 base URL
 * [EN] Base URL to use as a reference
 * @param relative -
 * [KO] 변환할 상대 경로 또는 URL
 * [EN] Relative path or URL to convert
 * @returns
 * [KO] 변환된 절대 URL, 실패 시 relative 반환
 * [EN] Converted absolute URL, or relative if conversion fails
 * @category File
 */
declare function getAbsoluteURL(base: string, relative: string): string;
export default getAbsoluteURL;
