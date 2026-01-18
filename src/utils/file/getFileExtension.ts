/**
 * [KO] 주어진 URL에서 파일 확장자를 추출합니다.
 * [EN] Extracts the file extension from a given URL.
 *
 * [KO] URL에서 마지막 파일 이름의 확장자를 소문자로 반환합니다. 확장자가 없으면 빈 문자열을 반환합니다.
 * [EN] Returns the extension of the last file name in the URL in lowercase. Returns an empty string if there is no extension.
 *
 * * ### Example
 * ```typescript
 * const ext = getFileExtension('https://example.com/assets/model.gltf'); // 'gltf'
 * ```
 *
 * @param url
 * [KO] 파일 확장자를 추출할 대상 URL
 * [EN] Target URL to extract the file extension from
 *
 * @returns
 * [KO] 추출된 파일 확장자 (소문자), 확장자가 없으면 빈 문자열
 * [EN] Extracted file extension (lowercase), or an empty string if none exists
 *
 * @throws
 * [KO] URL이 비어 있거나 undefined인 경우 Error 발생
 * [EN] Throws Error if the URL is empty or undefined
 *
 * @category File
 */
const getFileExtension = (url: string): string => {
    if (!url || url.trim().length === 0) {
        throw new Error('URL must not be empty or undefined');
    }
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const extensionStartIndex = fileName.lastIndexOf('.');
    if (extensionStartIndex === -1) {
        return '';
    }
    return fileName.substring(extensionStartIndex + 1).toLowerCase();
};
export default getFileExtension;