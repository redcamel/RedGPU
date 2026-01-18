/**
 * [KO] 상대 경로를 기준이 되는 base URL을 사용해 절대 URL로 변환합니다.
 * [EN] Converts a relative path to an absolute URL using a base URL.
 *
 * [KO] base와 relative를 조합하여 절대 URL을 반환합니다. 만약 URL 생성에 실패하면 relative 값을 그대로 반환합니다.
 * [EN] Combines base and relative to return an absolute URL. If URL generation fails, returns the relative value as is.
 *
 * * ### Example
 * ```typescript
 * const absURL = getAbsoluteURL('https://example.com/path/', '../image.png');
 * ```
 *
 * @param base
 * [KO] 기준이 되는 base URL
 * [EN] Base URL to use as a reference
 * @param relative
 * [KO] 절대 URL로 변환할 상대 경로 또는 URL
 * [EN] Relative path or URL to convert to an absolute URL
 *
 * @returns
 * [KO] 변환된 절대 URL, 실패 시 입력된 relative 값 반환
 * [EN] Converted absolute URL, or the input relative value if conversion fails
 *
 * @category File
 */
function getAbsoluteURL(base: string, relative: string): string {
    try {
        return new URL(relative, base).href;
    } catch (e) {
        return relative;
    }
}

export default getAbsoluteURL