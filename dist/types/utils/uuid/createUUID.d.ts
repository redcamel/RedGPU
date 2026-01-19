/**
 * [KO] 랜덤 UUID(버전 4) 문자열을 생성합니다.
 * [EN] Generates a random UUID (version 4) string.
 *
 * * ### Example
 * ```typescript
 * const uuid = RedGPU.Util.createUUID();
 * ```
 *
 * @returns
 * [KO] 랜덤하게 생성된 UUID 문자열
 * [EN] Randomly generated UUID string
 * @category UUID
 */
declare const createUUID: () => string;
export default createUUID;
