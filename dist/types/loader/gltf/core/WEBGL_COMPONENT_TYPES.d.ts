/**
 * [KO] GLTF accessor의 `componentType` 코드를 대응하는 TypedArray 생성자로 매핑하는 상수 테이블입니다.
 * [EN] Constant table mapping GLTF accessor `componentType` codes to their corresponding TypedArray constructors.
 *
 * [KO] 키는 WebGL 상수값입니다 (5120: BYTE, 5121: UNSIGNED_BYTE, 5122: SHORT, 5123: UNSIGNED_SHORT, 5125: UNSIGNED_INT, 5126: FLOAT).
 * [EN] Keys are WebGL constant values (5120: BYTE, 5121: UNSIGNED_BYTE, 5122: SHORT, 5123: UNSIGNED_SHORT, 5125: UNSIGNED_INT, 5126: FLOAT).
 *
 * @category GLTF
 */
declare const WEBGL_COMPONENT_TYPES: {
    5120: Int8ArrayConstructor;
    5121: Uint8ArrayConstructor;
    5122: Int16ArrayConstructor;
    5123: Uint16ArrayConstructor;
    5125: Uint32ArrayConstructor;
    5126: Float32ArrayConstructor;
};
export default WEBGL_COMPONENT_TYPES;
