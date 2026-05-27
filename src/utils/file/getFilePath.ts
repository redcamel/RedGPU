/**
 * [KO] URL 또는 경로에서 파일이 포함된 디렉토리 경로를 추출합니다.
 * [EN] Extracts the directory path containing the file from a URL or path.
 *
 * [KO] 마지막 '/'를 포함한 전체 경로의 앞부분을 반환합니다.
 * [EN] Returns the leading part of the path, including the last '/'.
 *
 * * ### Example
 * ```typescript
 * const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png'); // 'assets/textures/'
 * ```
 *
 * @param url - [KO] 대상 URL 또는 경로 [EN] Target URL or path
 * @returns [KO] 디렉토리 경로 [EN] Directory path
 * @category File
 */
const getFilePath = (url: string): string => {
    if (!url || url.trim().length === 0) {
        throw new Error('URL must not be empty or undefined');
    }
    return url.substring(0, url.lastIndexOf('/') + 1);
};
export default getFilePath;
