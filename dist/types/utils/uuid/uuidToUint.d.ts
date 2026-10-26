/**
 * [KO] UUID 문자열의 하이픈을 제거한 앞 8자리를 16진수로 해석하여 32비트 부호 없는 정수로 변환합니다.
 * [EN] Converts a UUID string to a 32-bit unsigned integer by parsing its first 8 characters (hyphens removed) as hexadecimal.
 *
 * ### Example
 * ```typescript
 * const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
 * ```
 *
 * @param uuid -
 * [KO] 변환할 UUID 문자열
 * [EN] UUID string to convert
 * @returns
 * [KO] 변환된 uint32 값 (0 ~ 4294967295)
 * [EN] Converted uint32 value (0 ~ 4294967295)
 * @category UUID
 */
declare const uuidToUint: (uuid: string) => number;
export default uuidToUint;
