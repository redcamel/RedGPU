/**
 * 상대 경로를 기준이 되는 base URL을 사용해 절대 URL로 변환합니다.
 *
 * base와 relative를 조합하여 절대 URL을 반환합니다. 만약 URL 생성에 실패하면 relative 값을 그대로 반환합니다.
 *
 * @category File
 * @param {string} base 기준이 되는 base URL
 * @param {string} relative 절대 URL로 변환할 상대 경로 또는 URL
 * @returns {string} 변환된 절대 URL, 실패 시 입력된 relative 값 반환
 */
function getAbsoluteURL(base: string, relative: string): string {
    try {
        return new URL(relative, base).href;
    } catch (e) {
        return relative;
    }
}

export default getAbsoluteURL
