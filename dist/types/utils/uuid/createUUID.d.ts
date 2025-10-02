/**
 * 랜덤한 UUID(버전 4)를 생성합니다.
 *
 * 36자리의 문자열로 구성되며, 하이픈(-)이 포함된 표준 UUID 형식을 따릅니다.
 * 8-4-4-4-12 형식이며, 13번째 문자는 항상 '4'로 고정되어 버전 4임을 나타냅니다.
 * 19번째 문자는 UUID 규격에 따라 8, 9, A, B 중 하나로 설정됩니다.
 *
 * @returns 랜덤하게 생성된 UUID 문자열 (예: '3F2504E0-4F89-41D3-9A0C-0305E82C3301')
 * @category UUID
 */
declare const createUUID: () => string;
export default createUUID;
