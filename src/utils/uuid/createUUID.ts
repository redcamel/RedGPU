const UUID_CHARS = '0123456789ABCDEF';
const UUID_BUFFER: string[] = new Array(36);
UUID_BUFFER[8] = UUID_BUFFER[13] = UUID_BUFFER[18] = UUID_BUFFER[23] = '-';
UUID_BUFFER[14] = '4';

/**
 * [KO] 임의의 UUID(버전 4) 문자열을 생성합니다.
 * [EN] Generates a random UUID (version 4) string.
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
const createUUID = (): string => {
    for (let i = 0; i < 36; i++) {
        if (i !== 8 && i !== 13 && i !== 14 && i !== 18 && i !== 23) {
            const r = Math.random() * 16 | 0;
            UUID_BUFFER[i] = UUID_CHARS[(i === 19) ? (r & 0x3) | 0x8 : r & 0xF];
        }
    }
    return UUID_BUFFER.join('');
};
export default createUUID;
