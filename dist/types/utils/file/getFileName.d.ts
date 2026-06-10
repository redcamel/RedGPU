/**
 * [KO] URL 또는 경로에서 파일 이름을 추출합니다.
 * [EN] Extracts the file name from a URL or path.
 *
 * * ### Example
 * ```typescript
 * const nameWithExt = RedGPU.Util.getFileName('path/to/image.png'); // 'image.png'
 * const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false); // 'image'
 * ```
 *
 * @param url - [KO] 대상 URL 또는 경로 [EN] Target URL or path
 * @param withExtension - [KO] 확장자 포함 여부 (기본값: true) [EN] Whether to include the extension (Default: true)
 * @returns [KO] 파일 이름 [EN] File name
 * @category File
 */
declare const getFileName: (url: string, withExtension?: boolean) => string;
export default getFileName;
