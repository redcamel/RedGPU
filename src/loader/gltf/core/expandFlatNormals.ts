const EMPTY_FLOAT32_ARRAY = new Float32Array(0);

export interface ExpandedFlatMeshAttributes {
    vertices: Float32Array;
    normals: Float32Array;
    verticesColor_0: Float32Array;
    uvs: Float32Array;
    uvs1: Float32Array;
    jointWeights: Float32Array;
    joints: Float32Array;
}

const expandAttributeByIndices = (
    src: Float32Array,
    indices: Uint32Array,
    stride: number
): Float32Array => {
    if (src.length === 0) return EMPTY_FLOAT32_ARRAY;
    const count = indices.length;
    const dst = new Float32Array(count * stride);
    if (stride === 2) {
        for (let i = 0; i < count; i++) {
            const s = indices[i] * 2;
            const d = i * 2;
            dst[d] = src[s];
            dst[d + 1] = src[s + 1];
        }
    } else if (stride === 3) {
        for (let i = 0; i < count; i++) {
            const s = indices[i] * 3;
            const d = i * 3;
            dst[d] = src[s];
            dst[d + 1] = src[s + 1];
            dst[d + 2] = src[s + 2];
        }
    } else if (stride === 4) {
        for (let i = 0; i < count; i++) {
            const s = indices[i] * 4;
            const d = i * 4;
            dst[d] = src[s];
            dst[d + 1] = src[s + 1];
            dst[d + 2] = src[s + 2];
            dst[d + 3] = src[s + 3];
        }
    }
    return dst;
};

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
const expandFlatNormals = (
    vertices: Float32Array,
    indices: Uint32Array,
    verticesColor_0: Float32Array,
    uvs: Float32Array,
    uvs1: Float32Array,
    jointWeights: Float32Array,
    joints: Float32Array
): ExpandedFlatMeshAttributes => {
    const hasIndices = indices.length > 0;
    const outVertices = hasIndices ? expandAttributeByIndices(vertices, indices, 3) : vertices;
    const outNormals = new Float32Array(outVertices.length);

    const triLen = outVertices.length - (outVertices.length % 9);
    for (let i = 0; i < triLen; i += 9) {
        const p0x = outVertices[i];
        const p0y = outVertices[i + 1];
        const p0z = outVertices[i + 2];

        const e1x = outVertices[i + 3] - p0x;
        const e1y = outVertices[i + 4] - p0y;
        const e1z = outVertices[i + 5] - p0z;

        const e2x = outVertices[i + 6] - p0x;
        const e2y = outVertices[i + 7] - p0y;
        const e2z = outVertices[i + 8] - p0z;

        let nx = e1y * e2z - e1z * e2y;
        let ny = e1z * e2x - e1x * e2z;
        let nz = e1x * e2y - e1y * e2x;

        const lenSq = nx * nx + ny * ny + nz * nz;
        if (lenSq > 0) {
            const invLen = 1 / Math.sqrt(lenSq);
            nx *= invLen;
            ny *= invLen;
            nz *= invLen;
        }

        outNormals[i] = nx;
        outNormals[i + 1] = ny;
        outNormals[i + 2] = nz;
        outNormals[i + 3] = nx;
        outNormals[i + 4] = ny;
        outNormals[i + 5] = nz;
        outNormals[i + 6] = nx;
        outNormals[i + 7] = ny;
        outNormals[i + 8] = nz;
    }

    if (!hasIndices) {
        return {
            vertices: outVertices,
            normals: outNormals,
            verticesColor_0,
            uvs,
            uvs1,
            jointWeights,
            joints
        };
    }

    return {
        vertices: outVertices,
        normals: outNormals,
        verticesColor_0: expandAttributeByIndices(verticesColor_0, indices, 4),
        uvs: expandAttributeByIndices(uvs, indices, 2),
        uvs1: expandAttributeByIndices(uvs1, indices, 2),
        jointWeights: expandAttributeByIndices(jointWeights, indices, 4),
        joints: expandAttributeByIndices(joints, indices, 4)
    };
};

export default expandFlatNormals;
