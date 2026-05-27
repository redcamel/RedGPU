/**
 * [KO] 상대 경로를 절대 URL로 변환합니다.
 * [EN] Converts a relative path to an absolute URL.
 *
 * [KO] 기준(base) URL과 상대(relative) 경로를 결합하여 절대 URL을 생성합니다. 실패 시 상대 경로를 그대로 반환합니다.
 * [EN] Combines a base URL and a relative path to create an absolute URL. Returns the relative path as is if conversion fails.
 *
 * * ### Example
 * ```typescript
 * const absURL = RedGPU.Util.getAbsoluteURL('https://example.com/path/', '../image.png');
 * ```
 *
 * @param base - [KO] 기준 URL [EN] Base URL
 * @param relative - [KO] 상대 경로 또는 URL [EN] Relative path or URL
 * @returns [KO] 절대 URL [EN] Absolute URL
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
