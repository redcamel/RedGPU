/**
 * 주어진 URL에서 파일 확장자를 추출합니다.
 *
 * URL에서 마지막 파일 이름의 확장자를 소문자로 반환합니다. 확장자가 없으면 빈 문자열을 반환합니다.
 *
 * @category File
 * @param {string} url 파일 확장자를 추출할 대상 URL
 * @returns {string} 추출된 파일 확장자 (소문자), 확장자가 없으면 빈 문자열
 * @throws {Error} URL이 비어 있거나 undefined인 경우 예외 발생
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
