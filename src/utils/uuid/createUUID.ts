/**
 * [KO] 랜덤한 UUID(버전 4) 문자열을 생성합니다.
 * [EN] Generates a random UUID (version 4) string.
 *
 * * ### Example
 * ```typescript
 * const uuid = createUUID();
 * ```
 *
 * @returns
 * [KO] 랜덤하게 생성된 UUID 문자열
 * [EN] Randomly generated UUID string
 *
 * @category UUID
 */
const createUUID = () => {
    const UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let r;
    let i = 0;
    let uuid = ['', '', '', '', '-', '', '', '', '-', '4', '', '', '-', '', '', '', '-', '', '', '', '', '', '-', '', '', '', '', '', '', '', '', '', '', '', ''];
    while (i < 36) {
        if (uuid[i] === '') {
            r = Math.random() * 16 | 0;
            uuid[i] = UUID_CHARS[(i === 19) ? (r & 0x3) | 0x8 : r & 0xF];
        }
        i++;
    }
    return uuid.join('');
}
export default createUUID