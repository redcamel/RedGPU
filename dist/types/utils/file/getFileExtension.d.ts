/**
 * [KO] URL 또는 경로에서 파일 확장자를 추출합니다.
 * [EN] Extracts the file extension from a URL or path.
 *
 * [KO] 확장자를 소문자로 반환하며, 없는 경우 빈 문자열을 반환합니다.
 * [EN] Returns the extension in lowercase, or an empty string if it doesn't exist.
 *
 * * ### Example
 * ```typescript
 * const ext = RedGPU.Util.getFileExtension('assets/model.gltf'); // 'gltf'
 * ```
 *
 * @param url - [KO] 대상 URL 또는 경로 [EN] Target URL or path
 * @returns [KO] 파일 확장자 [EN] File extension
 * @category File
 */
declare const getFileExtension: (url: string) => string;
export default getFileExtension;
