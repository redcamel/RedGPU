/**
 * [KO] UUID 문자열을 32비트 부호 없는 정수(uint32)로 변환합니다.
 * [EN] Converts a UUID string to a 32-bit unsigned integer (uint32).
 *
 * [KO] UUID의 앞 8자리를 16진수로 해석하여 변환합니다.
 * [EN] Interprets and converts the first 8 characters of the UUID as a hexadecimal.
 *
 * * ### Example
 * ```typescript
 * const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
 * ```
 *
 * @param uuid - [KO] 대상 UUID 문자열 [EN] Target UUID string
 * @returns [KO] 변환된 uint32 값 [EN] Converted uint32 value
 * @category UUID
 */
const uuidToUint = (uuid: string): number => {
    const shortUuid = uuid.replace(/-/g, '').substring(0, 8);
    return parseInt(shortUuid, 16);
}
export default uuidToUint
