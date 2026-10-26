/**
 * [KO] URL 또는 경로에서 마지막 `/`까지 포함한 디렉터리 경로를 반환합니다.
 * [EN] Returns the directory path of a URL or path, including the last `/`.
 *
 * ### Example
 * ```typescript
 * // [KO] 'assets/textures/' 반환
 * // [EN] Returns 'assets/textures/'
 * const path = RedGPU.Util.getFilePath('assets/textures/diffuse.png');
 * ```
 *
 * @param url -
 * [KO] 대상 URL 또는 경로
 * [EN] Target URL or path
 * @returns
 * [KO] 디렉터리 경로
 * [EN] Directory path
 * @throws
 * [KO] `url`이 비어 있거나 정의되지 않은 경우
 * [EN] When `url` is empty or undefined
 * @category File
 */
declare const getFilePath: (url: string) => string;
export default getFilePath;
