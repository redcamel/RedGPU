import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
/**
 * [KO] GLTF accessor 데이터를 attribute 키(POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0)에 따라 사전 할당된 `Float32Array`로 직접 파싱합니다.
 * [EN] Parses GLTF accessor data directly into a pre-allocated `Float32Array` according to the attribute key (POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0).
 *
 * [KO] `bufferViewByteStride`가 있으면 interleaved 데이터로 처리하며, VEC3 `COLOR_0`는 알파값 `1`을 추가하여 RGBA(4성분)로 확장합니다.
 * [EN] Handles interleaved data when `bufferViewByteStride` is set, and expands VEC3 `COLOR_0` to 4-component RGBA by appending an alpha of `1`.
 *
 * @param key -
 * [KO] attribute 키
 * [EN] Attribute key
 * @param accessorInfo -
 * [KO] accessor 파싱 정보
 * [EN] Parsed accessor information
 * @returns
 * [KO] 파싱된 `Float32Array` (미사용 키 또는 알 수 없는 타입인 경우 `null`)
 * [EN] Parsed `Float32Array` (`null` for unused keys or unknown accessor types)
 * @throws
 * [KO] VEC4/VEC3 타입에서 지원하지 않는 attribute 키인 경우
 * [EN] If the attribute key is not supported for VEC4/VEC3 types
 * @category GLTF
 */
declare const parseAttributeInfo_GLTF: (key: string, accessorInfo: AccessorInfo_GLTF) => Float32Array | null;
export default parseAttributeInfo_GLTF;
