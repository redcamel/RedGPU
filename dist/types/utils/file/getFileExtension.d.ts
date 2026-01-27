/**
 * [KO] 주어진 URL에서 파일 확장자를 추출합니다.
 * [EN] Extracts the file extension from a given URL.
 *
 * [KO] URL에서 파일 확장자를 소문자로 반환하며, 없으면 빈 문자열을 반환합니다.
 * [EN] Returns the file extension in lowercase, or an empty string if none exists.
 *
 * * ### Example
 * ```typescript
 * const ext = RedGPU.Util.getFileExtension('https://example.com/assets/model.gltf'); // 'gltf'
 * ```
 *
 * @param url -
 * [KO] 파일 확장자를 추출할 대상 URL
 * [EN] Target URL to extract the file extension from
 * @returns
 * [KO] 추출된 파일 확장자 (소문자)
 * [EN] Extracted file extension (lowercase)
 * @throws
 * [KO] URL이 비어 있거나 유효하지 않을 경우 Error 발생
 * [EN] Throws Error if the URL is empty or invalid
 * @category File
 */
declare const getFileExtension: (url: string) => string;
export default getFileExtension;
