/**
 * [KO] 무작위 UUID(버전 4) 문자열을 생성합니다.
 * [EN] Generates a random UUID (version 4) string.
 *
 * [KO] 내부 정적 문자 버퍼를 재사용하며, 형식은 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`(대문자 16진수)입니다.
 * [EN] Reuses an internal static character buffer; the format is `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` (uppercase hex).
 *
 * ### Example
 * ```typescript
 * const uuid = RedGPU.Util.createUUID();
 * ```
 *
 * @returns
 * [KO] 생성된 UUID 문자열
 * [EN] Generated UUID string
 * @category UUID
 */
declare const createUUID: () => string;
export default createUUID;
