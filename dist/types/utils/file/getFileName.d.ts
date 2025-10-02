/**
 * 주어진 URL에서 파일 이름을 추출합니다.
 *
 * @category File
 * @param {string} url 파일 이름을 추출할 대상 URL
 * @param {boolean} [withExtension=true] 파일 확장자를 포함할지 여부
 * @returns {string} 추출된 파일 이름
 */
declare const getFileName: (url: string, withExtension?: boolean) => string;
export default getFileName;
