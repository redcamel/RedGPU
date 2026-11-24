const EMPTY_FLOAT32_ARRAY = new Float32Array(0);
const INTERLEAVE_STRIDE = 18; // pos(3) + normal(3) + uv0(2) + uv1(2) + color(4) + tangent(4)

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
const parseInterleaveData_GLTF = (
    vertices: FloatAttributeArray,
    verticesColor_0: FloatAttributeArray,
    normalData: FloatAttributeArray,
    uvs: FloatAttributeArray,
    uvs1: FloatAttributeArray,
    tangents: FloatAttributeArray,
): Float32Array => {
    const vertexCount = (vertices.length / 3) | 0;
    if (vertexCount <= 0) return EMPTY_FLOAT32_ARRAY;

    const interleaveData = new Float32Array(vertexCount * INTERLEAVE_STRIDE);
    const hasNormal = normalData.length >= vertexCount * 3;
    const hasUvs = uvs.length >= vertexCount * 2;
    const hasUvs1 = uvs1.length >= vertexCount * 2;
    const hasColor = verticesColor_0.length >= vertexCount * 4;
    const hasTangents = tangents.length >= vertexCount * 4;

    let base = 0;
    let i2 = 0;
    let i3 = 0;
    let i4 = 0;

    for (let i = 0; i < vertexCount; i++) {
        interleaveData[base] = vertices[i3];
        interleaveData[base + 1] = vertices[i3 + 1];
        interleaveData[base + 2] = vertices[i3 + 2];

        if (hasNormal) {
            interleaveData[base + 3] = normalData[i3];
            interleaveData[base + 4] = normalData[i3 + 1];
            interleaveData[base + 5] = normalData[i3 + 2];
        }

        if (hasUvs) {
            const u0 = uvs[i2];
            const v0 = uvs[i2 + 1];
            interleaveData[base + 6] = u0;
            interleaveData[base + 7] = v0;
            if (hasUvs1) {
                interleaveData[base + 8] = uvs1[i2];
                interleaveData[base + 9] = uvs1[i2 + 1];
            } else {
                interleaveData[base + 8] = u0;
                interleaveData[base + 9] = v0;
            }
        } else if (hasUvs1) {
            interleaveData[base + 8] = uvs1[i2];
            interleaveData[base + 9] = uvs1[i2 + 1];
        }

        if (hasColor) {
            interleaveData[base + 10] = verticesColor_0[i4];
            interleaveData[base + 11] = verticesColor_0[i4 + 1];
            interleaveData[base + 12] = verticesColor_0[i4 + 2];
            interleaveData[base + 13] = verticesColor_0[i4 + 3];
        }

        if (hasTangents) {
            interleaveData[base + 14] = tangents[i4];
            interleaveData[base + 15] = tangents[i4 + 1];
            interleaveData[base + 16] = tangents[i4 + 2];
            interleaveData[base + 17] = tangents[i4 + 3];
        }

        base += INTERLEAVE_STRIDE;
        i2 += 2;
        i3 += 3;
        i4 += 4;
    }

    return interleaveData;
};

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
export const packSkinWeights_GLTF = (
    vertexCount: number,
    jointWeights?: FloatAttributeArray | null
): Float32Array => {
    const expectedLen = vertexCount * 4;
    if (expectedLen <= 0) return EMPTY_FLOAT32_ARRAY;
    if (!jointWeights || jointWeights.length === 0) {
        return new Float32Array(expectedLen);
    }
    if (jointWeights instanceof Float32Array && jointWeights.length === expectedLen) {
        return jointWeights;
    }
    const result = new Float32Array(expectedLen);
    if (jointWeights.length > expectedLen) {
        result.set(
            jointWeights instanceof Float32Array
                ? jointWeights.subarray(0, expectedLen)
                : jointWeights.slice(0, expectedLen)
        );
    } else {
        result.set(jointWeights);
    }
    return result;
};

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
export const packSkinJoints_GLTF = (
    vertexCount: number,
    joints?: JointAttributeArray | null
): Uint32Array => {
    const expectedLen = vertexCount * 4;
    if (expectedLen <= 0) return new Uint32Array(0);
    if (!joints || joints.length === 0) {
        return new Uint32Array(expectedLen);
    }
    if (joints instanceof Uint32Array && joints.length === expectedLen) {
        return joints;
    }
    const result = new Uint32Array(expectedLen);
    if (joints.length > expectedLen) {
        result.set(
            ArrayBuffer.isView(joints)
                ? joints.subarray(0, expectedLen)
                : joints.slice(0, expectedLen)
        );
    } else {
        result.set(joints);
    }
    return result;
};

export default parseInterleaveData_GLTF;
