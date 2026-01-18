/**
 * [KO] 주어진 URL에서 파일 이름을 추출합니다.
 * [EN] Extracts the file name from a given URL.
 *
 * * ### Example
 * ```typescript
 * const nameWithExt = getFileName('path/to/image.png'); // 'image.png'
 * const nameOnly = getFileName('path/to/image.png', false); // 'image'
 * ```
 *
 * @param url -
 * [KO] 파일 이름을 추출할 대상 URL
 * [EN] Target URL to extract the file name from
 * @param withExtension -
 * [KO] 파일 확장자를 포함할지 여부 (기본값: true)
 * [EN] Whether to include the file extension (Default: true)
 * @returns
 * [KO] 추출된 파일 이름
 * [EN] Extracted file name
 * @category File
 */
const getFileName = (url: string, withExtension: boolean = true): string => {
    const fullFileName = url.substring(url.lastIndexOf('/') + 1);
    return withExtension ? fullFileName : fullFileName.split('.').slice(0, -1).join('.');
};
export default getFileName;