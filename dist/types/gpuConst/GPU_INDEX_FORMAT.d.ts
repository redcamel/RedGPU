/**
 * [KO] 인덱스 버퍼(Index Buffer)에 저장된 정점 인덱스 데이터의 정수 비트 폭 포맷 상수입니다.
 * [EN] Integer bit-width format constants for vertex index data stored in an index buffer.
 *
 * @category Constants
 */
declare const GPU_INDEX_FORMAT: {
    /**
     * [KO] 16비트 부호 없는 정수(`Uint16Array`, `'uint16'`) 인덱스 포맷입니다.
     * [EN] 16-bit unsigned integer (`Uint16Array`, `'uint16'`) index format.
     */
    readonly UINT16: "uint16";
    /**
     * [KO] 32비트 부호 없는 정수(`Uint32Array`, `'uint32'`) 인덱스 포맷입니다.
     * [EN] 32-bit unsigned integer (`Uint32Array`, `'uint32'`) index format.
     */
    readonly UINT32: "uint32";
};
export default GPU_INDEX_FORMAT;
