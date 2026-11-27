export interface ExpandedFlatMeshAttributes {
    vertices: Float32Array;
    normals: Float32Array;
    verticesColor_0: Float32Array;
    uvs: Float32Array;
    uvs1: Float32Array;
    jointWeights: Float32Array;
    joints: Float32Array;
}
/**
 * [KO] glTF 2.0 스펙(3.7.2.1)에 따라 `NORMAL` 속성이 생략된 삼각형 리스트 프리미티브를 비인덱스로 전개하고 플랫 노멀을 계산합니다.
 * [EN] Expands a triangle-list primitive without `NORMAL` attributes into non-indexed arrays and computes flat normals per glTF 2.0 spec (3.7.2.1).
 *
 * @param vertices -
 * [KO] 정점 위치 `Float32Array`
 * [EN] Vertex position `Float32Array`
 * @param indices -
 * [KO] 인덱스 `Uint32Array` (비인덱스면 길이 0)
 * [EN] Index `Uint32Array` (length 0 if non-indexed)
 * @param verticesColor_0 -
 * [KO] 정점 색상 `Float32Array`
 * [EN] Vertex color `Float32Array`
 * @param uvs -
 * [KO] 첫 번째 UV `Float32Array`
 * [EN] First UV `Float32Array`
 * @param uvs1 -
 * [KO] 두 번째 UV `Float32Array`
 * [EN] Second UV `Float32Array`
 * @param jointWeights -
 * [KO] 조인트 가중치 `Float32Array`
 * [EN] Joint weight `Float32Array`
 * @param joints -
 * [KO] 조인트 인덱스 `Float32Array`
 * [EN] Joint index `Float32Array`
 * @returns
 * [KO] 비인덱스 전개된 정점 속성 및 플랫 노멀 객체
 * [EN] Expanded non-indexed vertex attributes and flat normals
 * @category GLTF
 */
declare const expandFlatNormals: (vertices: Float32Array, indices: Uint32Array, verticesColor_0: Float32Array, uvs: Float32Array, uvs1: Float32Array, jointWeights: Float32Array, joints: Float32Array) => ExpandedFlatMeshAttributes;
export default expandFlatNormals;
