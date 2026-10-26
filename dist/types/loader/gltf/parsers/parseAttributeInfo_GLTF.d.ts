import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
/**
 * [KO] GLTF accessor 데이터를 attribute 키(POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0)에 따라 해당 배열에 push합니다.
 * [EN] Pushes GLTF accessor data into the matching array according to the attribute key (POSITION, NORMAL, TEXCOORD_n, COLOR_0, TANGENT, WEIGHTS_0, JOINTS_0).
 *
 * [KO] `bufferViewByteStride`가 있으면 interleaved 데이터로 처리하며, VEC3 COLOR_0는 알파값 1을 추가하여 RGBA로 확장합니다.
 * [EN] Interleaved data is handled when `bufferViewByteStride` is set, and VEC3 COLOR_0 is expanded to RGBA by appending an alpha of 1.
 *
 * @param key -
 * [KO] attribute 키
 * [EN] Attribute key
 * @param accessorInfo -
 * [KO] accessor 파싱 정보
 * [EN] Parsed accessor information
 * @param vertices -
 * [KO] 정점 위치 데이터 배열
 * [EN] Array for vertex position data
 * @param uvs -
 * [KO] TEXCOORD_0 데이터 배열
 * [EN] Array for TEXCOORD_0 data
 * @param uvs1 -
 * [KO] TEXCOORD_1 데이터 배열
 * [EN] Array for TEXCOORD_1 data
 * @param uvs2 -
 * [KO] TEXCOORD_2 데이터 배열 (현재 미사용)
 * [EN] Array for TEXCOORD_2 data (currently unused)
 * @param normals -
 * [KO] 노멀 데이터 배열
 * [EN] Array for normal data
 * @param jointWeights -
 * [KO] 조인트 가중치 데이터 배열
 * [EN] Array for joint weight data
 * @param joints -
 * [KO] 조인트 인덱스 데이터 배열
 * [EN] Array for joint index data
 * @param verticesColor_0 -
 * [KO] 정점 컬러 데이터 배열
 * [EN] Array for vertex color data
 * @param tangents -
 * [KO] 탄젠트 데이터 배열
 * [EN] Array for tangent data
 * @throws
 * [KO] VEC4/VEC3 타입에서 지원하지 않는 attribute 키인 경우
 * [EN] If the attribute key is not supported for VEC4/VEC3 types
 */
declare const parseAttributeInfo_GLTF: (key: string, accessorInfo: AccessorInfo_GLTF, vertices: any, uvs: any, uvs1: any, uvs2: any, normals: any, jointWeights: any, joints: any, verticesColor_0: any, tangents: any) => void;
export default parseAttributeInfo_GLTF;
