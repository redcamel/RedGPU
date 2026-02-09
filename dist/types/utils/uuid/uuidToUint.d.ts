/**
 * [KO] UUID 문자열을 32비트 부호 없는 정수로 변환합니다.
 * [EN] Converts a UUID string to a 32-bit unsigned integer.
 *
 * * ### Example
 * ```typescript
 * const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
 * ```
 *
 * @param uuid -
 * [KO] 변환할 UUID 문자열
 * [EN] UUID string to convert
 * @returns
 * [KO] 변환된 32비트 부호 없는 정수
 * [EN] Converted 32-bit unsigned integer
 * @category UUID
 */
declare const uuidToUint: (uuid: string) => number;
export default uuidToUint;
