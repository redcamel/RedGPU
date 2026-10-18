/**
 * [KO] glTF 정점 속성 배열들을 단일 인터리브(`interleaveData`) 배열로 병합합니다.
 * [EN] Merges glTF vertex attribute arrays into a single interleaved (`interleaveData`) array.
 *
 * @param interleaveData -
 * [KO] 인터리브 데이터를 기록할 출력 배열
 * [EN] Output array to write interleaved data into
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
 * @param uvs2 -
 * [KO] 추가 텍스처 좌표(`TEXCOORD_2`) 배열
 * [EN] Additional texture coordinate (`TEXCOORD_2`) array
 * @param jointWeights -
 * [KO] 스키닝 조인트 가중치 배열
 * [EN] Skinning joint weight array
 * @param joints -
 * [KO] 스키닝 조인트 인덱스 배열
 * [EN] Skinning joint index array
 * @param tangents -
 * [KO] 정점 탄젠트 벡터 배열
 * [EN] Vertex tangent vector array
 * @param onlyWeights -
 * [KO] 조인트 가중치만 단독 추출할지 여부 (기본값: `false`)
 * [EN] Whether to extract only joint weights (default: `false`)
 * @param onlyJoints -
 * [KO] 조인트 인덱스만 단독 추출할지 여부 (기본값: `false`)
 * [EN] Whether to extract only joint indices (default: `false`)
 * @category GLTF
 */
const parseInterleaveData_GLTF = (
    interleaveData: number[],
    vertices: number[], verticesColor_0: number[], normalData: number[],
    uvs: number[], uvs1: number[], uvs2: number[],
    jointWeights: number[], joints: number[],
    tangents: number[],
    onlyWeights: boolean = false,
    onlyJoints: boolean = false,
) => {
    let i = 0, len = vertices.length / 3;
    let idx = 0;
    let index2D, index2D_1
    let index3D, index3D_1, index3D_2
    let index4D, index4D_1, index4D_2, index4D_3;
    const has_vertices = vertices.length
    const has_normalData = normalData.length
    const has_uvs1 = uvs1.length
    const has_uvs2 = uvs2.length
    const has_verticesColor_0 = verticesColor_0.length
    const has_jointWeights = jointWeights.length
    const has_joints = joints.length
    const has_tangents = tangents.length
    index2D = index3D = index4D = 0
    index2D_1 = index3D_1 = index4D_1 = 1
    index3D_2 = index4D_2 = 2
    index4D_3 = 3
    if (onlyWeights) {
        for (i; i < len; i++) {
            if (has_jointWeights) {
                interleaveData[idx++] = jointWeights[index4D];
                interleaveData[idx++] = jointWeights[index4D_1];
                interleaveData[idx++] = jointWeights[index4D_2];
                interleaveData[idx++] = jointWeights[index4D_3];
            } else {
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
            }
            index2D += 2
            index2D_1 += 2
            index3D += 3
            index3D_1 += 3
            index3D_2 += 3
            index4D += 4
            index4D_1 += 4
            index4D_2 += 4
            index4D_3 += 4
        }
    } else if (onlyJoints) {
        for (i; i < len; i++) {
            if (has_joints) {
                interleaveData[idx++] = joints[index4D];
                interleaveData[idx++] = joints[index4D_1];
                interleaveData[idx++] = joints[index4D_2];
                interleaveData[idx++] = joints[index4D_3];
            } else {
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
            }
            index2D += 2
            index2D_1 += 2
            index3D += 3
            index3D_1 += 3
            index3D_2 += 3
            index4D += 4
            index4D_1 += 4
            index4D_2 += 4
            index4D_3 += 4
        }
    } else {
        for (i; i < len; i++) {
            if (has_vertices) {
                interleaveData[idx++] = vertices[index3D];
                interleaveData[idx++] = vertices[index3D_1];
                interleaveData[idx++] = vertices[index3D_2];
            }
            if (has_normalData) {
                interleaveData[idx++] = normalData[index3D];
                interleaveData[idx++] = normalData[index3D_1];
                interleaveData[idx++] = normalData[index3D_2];
            } else {
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
            }
            if (!uvs.length) uvs.push(0, 0);
            if (uvs.length) {
                interleaveData[idx++] = uvs[index2D];
                interleaveData[idx++] = uvs[index2D_1];
            }
            if (has_uvs1) {
                interleaveData[idx++] = uvs1[index2D];
                interleaveData[idx++] = uvs1[index2D_1];
            } else if (uvs.length) {
                interleaveData[idx++] = uvs[index2D];
                interleaveData[idx++] = uvs[index2D_1];
            }
            if (has_verticesColor_0) {
                interleaveData[idx++] = verticesColor_0[index4D];
                interleaveData[idx++] = verticesColor_0[index4D_1];
                interleaveData[idx++] = verticesColor_0[index4D_2];
                interleaveData[idx++] = verticesColor_0[index4D_3];
            } else {
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
            }
            if (has_tangents) {
                interleaveData[idx++] = tangents[index4D];
                interleaveData[idx++] = tangents[index4D_1];
                interleaveData[idx++] = tangents[index4D_2];
                interleaveData[idx++] = tangents[index4D_3];
            } else {
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
                interleaveData[idx++] = 0;
            }
            index2D += 2
            index2D_1 += 2
            index3D += 3
            index3D_1 += 3
            index3D_2 += 3
            index4D += 4
            index4D_1 += 4
            index4D_2 += 4
            index4D_3 += 4
        }
    }
};
export default parseInterleaveData_GLTF;
