/**
 * 주어진 URL에서 파일 경로(디렉터리 경로)를 추출합니다.
 *
 * URL 문자열에서 마지막 '/'까지의 부분을 반환합니다. URL이 비어 있거나 undefined인 경우 예외를 발생시킵니다.
 *
 * @category File
 * @param {string} url 파일 경로를 추출할 대상 URL
 * @returns {string} 추출된 파일 경로 (마지막 '/'까지 포함)
 * @throws {Error} URL이 비어 있거나 undefined인 경우 예외 발생
 */
const getFilePath = (url: string): string => {
    if (!url || url.trim().length === 0) {
        throw new Error('URL must not be empty or undefined');
    }
    return url.substring(0, url.lastIndexOf('/') + 1);
};
export default getFilePath;
