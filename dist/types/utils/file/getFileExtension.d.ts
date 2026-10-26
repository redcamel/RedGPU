/**
 * [KO] URL 또는 경로의 마지막 세그먼트에서 파일 확장자를 소문자로 추출합니다. 확장자가 없으면 빈 문자열을 반환합니다.
 * [EN] Extracts the lowercase file extension from the last segment of a URL or path. Returns an empty string if there is no extension.
 *
 * ### Example
 * ```typescript
 * // [KO] 'gltf' 반환
 * // [EN] Returns 'gltf'
 * const extension = RedGPU.Util.getFileExtension('assets/model.GLTF');
 * ```
 *
 * @param url -
 * [KO] 대상 URL 또는 경로
 * [EN] Target URL or path
 * @returns
 * [KO] 소문자 파일 확장자 (점 제외)
 * [EN] Lowercase file extension (without the dot)
 * @throws
 * [KO] `url`이 비어 있거나 공백뿐인 경우
 * [EN] If `url` is empty or whitespace only
 * @category File
 */
declare const getFileExtension: (url: string) => string;
export default getFileExtension;
