type FloatAttributeArray = Float32Array | number[];
type JointAttributeArray = Float32Array | Uint32Array | number[];
/**
 * [KO] glTF 정점 속성 배열들을 단일 사전 할당 `Float32Array`(stride 18 floats)로 병합합니다.
 * [EN] Merges glTF vertex attribute arrays into a single pre-allocated `Float32Array` (stride 18 floats).
 *
 * [KO] 레이아웃 순서: `POSITION(3) | NORMAL(3) | TEXCOORD_0(2) | TEXCOORD_1(2) | COLOR_0(4) | TANGENT(4)`
 * [EN] Layout order: `POSITION(3) | NORMAL(3) | TEXCOORD_0(2) | TEXCOORD_1(2) | COLOR_0(4) | TANGENT(4)`
 *
 * @param vertices -
 * [KO] 정점 위치 좌표 배열
 * [EN] Vertex position coordinate array
 * @param verticesColor_0 -
 * [KO] 정점 색상 배열
 * [EN] Vertex color array
 * @param normalData -
 * [KO] 정점 법선 벡터 배열
 * [EN] Vertex normal vector array
 * @param uvs -
 * [KO] 기본 텍스처 좌표(`TEXCOORD_0`) 배열
 * [EN] Primary texture coordinate (`TEXCOORD_0`) array
 * @param uvs1 -
 * [KO] 보조 텍스처 좌표(`TEXCOORD_1`) 배열
 * [EN] Secondary texture coordinate (`TEXCOORD_1`) array
 * @param tangents -
 * [KO] 정점 탄젠트 벡터 배열
 * [EN] Vertex tangent vector array
 * @returns
 * [KO] 인터리브된 `Float32Array`
 * [EN] Interleaved `Float32Array`
 * @category GLTF
 */
declare const parseInterleaveData_GLTF: (vertices: FloatAttributeArray, verticesColor_0: FloatAttributeArray, normalData: FloatAttributeArray, uvs: FloatAttributeArray, uvs1: FloatAttributeArray, tangents: FloatAttributeArray) => Float32Array;
/**
 * [KO] 스키닝 조인트 가중치(`WEIGHTS_0`) 데이터를 정점 수에 맞는 `Float32Array`로 패킹합니다.
 * [EN] Packs skinning joint weight (`WEIGHTS_0`) data into a `Float32Array` sized to the vertex count.
 *
 * @param vertexCount -
 * [KO] 정점 개수
 * [EN] Number of vertices
 * @param jointWeights -
 * [KO] 파싱된 조인트 가중치 데이터 (미존재 시 0으로 초기화된 버퍼 반환)
 * [EN] Parsed joint weight data (returns a zero-initialized buffer if absent)
 * @returns
 * [KO] `vertexCount * 4` 길이의 `Float32Array`
 * [EN] `Float32Array` of length `vertexCount * 4`
 * @category GLTF
 */
export declare const packSkinWeights_GLTF: (vertexCount: number, jointWeights?: FloatAttributeArray | null) => Float32Array;
/**
 * [KO] 스키닝 조인트 인덱스(`JOINTS_0`) 데이터를 정점 수에 맞는 `Uint32Array`로 패킹합니다.
 * [EN] Packs skinning joint index (`JOINTS_0`) data into a `Uint32Array` sized to the vertex count.
 *
 * @param vertexCount -
 * [KO] 정점 개수
 * [EN] Number of vertices
 * @param joints -
 * [KO] 파싱된 조인트 인덱스 데이터 (미존재 시 0으로 초기화된 버퍼 반환)
 * [EN] Parsed joint index data (returns a zero-initialized buffer if absent)
 * @returns
 * [KO] `vertexCount * 4` 길이의 `Uint32Array`
 * [EN] `Uint32Array` of length `vertexCount * 4`
 * @category GLTF
 */
export declare const packSkinJoints_GLTF: (vertexCount: number, joints?: JointAttributeArray | null) => Uint32Array;
export default parseInterleaveData_GLTF;
