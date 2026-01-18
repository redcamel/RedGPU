/**
 * [KO] 주어진 URL에서 파일 경로(디렉터리 경로)를 추출합니다.
 * [EN] Extracts the file path (directory path) from a given URL.
 *
 * [KO] URL에서 마지막 '/'까지의 부분을 반환합니다.
 * [EN] Returns the part of the URL up to the last '/'.
 *
 * * ### Example
 * ```typescript
 * const path = getFilePath('https://example.com/assets/textures/diffuse.png');
 * ```
 *
 * @param url -
 * [KO] 파일 경로를 추출할 대상 URL
 * [EN] Target URL to extract the file path from
 * @returns
 * [KO] 추출된 파일 경로
 * [EN] Extracted file path
 * @throws
 * [KO] URL이 비어 있거나 유효하지 않을 경우 Error 발생
 * [EN] Throws Error if the URL is empty or invalid
 * @category File
 */
const getFilePath = (url: string): string => {
    if (!url || url.trim().length === 0) {
        throw new Error('URL must not be empty or undefined');
    }
    return url.substring(0, url.lastIndexOf('/') + 1);
};
export default getFilePath;