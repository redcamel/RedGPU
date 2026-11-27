/**
 * [KO] glTF accessor `componentType`에 대응하는 TypedArray 생성자 유니온 타입입니다.
 * [EN] Union type of TypedArray constructors corresponding to glTF accessor `componentType` codes.
 *
 * @category GLTF
 */
export type GLTFComponentTypedArrayConstructor =
    | Int8ArrayConstructor
    | Uint8ArrayConstructor
    | Int16ArrayConstructor
    | Uint16ArrayConstructor
    | Uint32ArrayConstructor
    | Float32ArrayConstructor;

/**
 * [KO] glTF 2.0 `componentType` 코드(`5120`: BYTE, `5121`: UNSIGNED_BYTE, `5122`: SHORT, `5123`: UNSIGNED_SHORT, `5125`: UNSIGNED_INT, `5126`: FLOAT)를 대응하는 TypedArray 생성자로 매핑하는 상수 테이블입니다.
 * [EN] Constant table mapping glTF 2.0 `componentType` codes (`5120`: BYTE, `5121`: UNSIGNED_BYTE, `5122`: SHORT, `5123`: UNSIGNED_SHORT, `5125`: UNSIGNED_INT, `5126`: FLOAT) to TypedArray constructors.
 *
 * @category GLTF
 */
const GLTF_COMPONENT_TYPES: Record<number, GLTFComponentTypedArrayConstructor> = Object.freeze({
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
});

export default GLTF_COMPONENT_TYPES;
