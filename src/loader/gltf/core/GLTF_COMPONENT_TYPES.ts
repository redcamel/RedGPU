/**
 * [KO] glTF accessor의 `componentType` 코드를 대응하는 TypedArray 생성자로 매핑하는 상수 테이블입니다.
 * [EN] Constant table mapping glTF accessor `componentType` codes to their corresponding TypedArray constructors.
 *
 * [KO] 키는 glTF 2.0 `componentType` 표준 코드입니다 (5120: BYTE, 5121: UNSIGNED_BYTE, 5122: SHORT, 5123: UNSIGNED_SHORT, 5125: UNSIGNED_INT, 5126: FLOAT).
 * [EN] Keys are standard glTF 2.0 `componentType` codes (5120: BYTE, 5121: UNSIGNED_BYTE, 5122: SHORT, 5123: UNSIGNED_SHORT, 5125: UNSIGNED_INT, 5126: FLOAT).
 *
 * @category GLTF
 */
const GLTF_COMPONENT_TYPES = Object.freeze({
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
});

export default GLTF_COMPONENT_TYPES;
