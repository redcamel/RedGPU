/**
 * [KO] URL 또는 경로의 마지막 `/` 이후 부분을 파일 이름으로 반환합니다.
 * [EN] Returns the part after the last `/` of a URL or path as the file name.
 *
 * ### Example
 * ```typescript
 * // [KO] 'image.png' 반환
 * // [EN] Returns 'image.png'
 * const nameWithExtension = RedGPU.Util.getFileName('path/to/image.png');
 * // [KO] 'image' 반환
 * // [EN] Returns 'image'
 * const nameOnly = RedGPU.Util.getFileName('path/to/image.png', false);
 * ```
 *
 * @param url -
 * [KO] 대상 URL 또는 경로
 * [EN] Target URL or path
 * @param withExtension -
 * [KO] 확장자 포함 여부 (기본값: `true`)
 * [EN] Whether to include the extension (Default: `true`)
 * @returns
 * [KO] 파일 이름
 * [EN] File name
 * @category File
 */
declare const getFileName: (url: string, withExtension?: boolean) => string;
export default getFileName;
