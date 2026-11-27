/**
 * [KO] 정점 위치 배열과 삼각형 인덱스 배열로부터 정규화된 정점 법선(Normal) 벡터 배열을 계산합니다.
 * [EN] Calculates a normalized vertex normal vector array from vertex position and triangle index arrays.
 *
 * ### Example
 * ```typescript
 * const normals = RedGPU.Math.calculateNormals(vertices, indices);
 * ```
 *
 * @param vertexArray -
 * [KO] 정점 위치 배열 (`[x, y, z, ...]`)
 * [EN] Vertex position array (`[x, y, z, ...]`)
 * @param indexArray -
 * [KO] 삼각형 정점 인덱스 배열 (비어 있을 경우 정점 순서대로 처리)
 * [EN] Triangle vertex index array (processed in vertex order if empty)
 * @returns
 * [KO] 정규화된 정점 법선 벡터 배열 (`Float32Array`, `[nx, ny, nz, ...]`)
 * [EN] Normalized vertex normal vector array (`Float32Array`, `[nx, ny, nz, ...]`)
 * @category Math
 */
const calculateNormals = (
    vertexArray: number[] | Float32Array,
    indexArray: number[] | Uint32Array | Uint16Array
): Float32Array => {
    const vertexLen = vertexArray.length;
    const result = new Float32Array(vertexLen);
    const numVertices = vertexLen / 3;
    let indices: number[] | Uint32Array | Uint16Array = indexArray;
    if (!indices || indices.length === 0) {
        const sequential = new Uint32Array(numVertices);
        for (let i = 0; i < numVertices; i++) {
            sequential[i] = i;
        }
        indices = sequential;
    }

    const indicesLen = indices.length;
    for (let i = 0; i < indicesLen; i += 3) {
        const index0 = 3 * indices[i];
        const index1 = 3 * indices[i + 1];
        const index2 = 3 * indices[i + 2];

        const v1x = vertexArray[index2] - vertexArray[index1];
        const v1y = vertexArray[index2 + 1] - vertexArray[index1 + 1];
        const v1z = vertexArray[index2 + 2] - vertexArray[index1 + 2];

        const v2x = vertexArray[index0] - vertexArray[index1];
        const v2y = vertexArray[index0 + 1] - vertexArray[index1 + 1];
        const v2z = vertexArray[index0 + 2] - vertexArray[index1 + 2];

        const nx = v1y * v2z - v1z * v2y;
        const ny = v1z * v2x - v1x * v2z;
        const nz = v1x * v2y - v1y * v2x;

        result[index0] += nx;
        result[index0 + 1] += ny;
        result[index0 + 2] += nz;

        result[index1] += nx;
        result[index1 + 1] += ny;
        result[index1 + 2] += nz;

        result[index2] += nx;
        result[index2 + 1] += ny;
        result[index2 + 2] += nz;
    }

    for (let i = 0; i < vertexLen; i += 3) {
        const nx = result[i];
        const ny = result[i + 1];
        const nz = result[i + 2];
        let len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        if (len === 0) len = 1.0;
        const invLen = 1.0 / len;
        result[i] = nx * invLen;
        result[i + 1] = ny * invLen;
        result[i + 2] = nz * invLen;
    }

    return result;
};
export default calculateNormals;