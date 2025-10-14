/**
 * uuid 문자열을 32비트 부호 없는 정수로 변환합니다.
 *
 * uuid의 하이픈(-)을 모두 제거한 후, 앞 8자리를 16진수로 해석하여 반환합니다.
 *
 * @param uuid 변환할 uuid 문자열 (예: '123e4567-e89b-12d3-a456-426614174000')
 * @returns 변환된 32비트 부호 없는 정수
 *
 * @category UUID
 */
const uuidToUint = (uuid) => {
    const shortUuid = uuid.replace(/-/g, '').substring(0, 8); // 하이픈 제거 후 앞 8자리 추출
    return parseInt(shortUuid, 16); // 16진수 문자열을 10진수로 변환
};
export default uuidToUint;
