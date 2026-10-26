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
 * [KO] 정규화된 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`)
 * [EN] Normalized vertex normal vector array (`[nx, ny, nz, ...]`)
 * @category Math
 */
const calculateNormals = (vertexArray: number[], indexArray: number[]): number[] => {
    let i, j;
    let x = 0;
    let y = 1;
    let z = 2;
    let result: number[] = [];
    let indices = indexArray;
    const numVertices = vertexArray.length / 3;
    if (!indexArray || indexArray.length === 0) {
        indexArray = [];
        for (let i = 0; i < numVertices; i++) {
            indices.push(i);
        }
    }
    for (i = 0; i < vertexArray.length; i = i + 3) {
        result[i + x] = 0.0;
        result[i + y] = 0.0;
        result[i + z] = 0.0;
    }
    for (i = 0; i < indices.length; i = i + 3) {
        let v1 = [];
        let v2 = [];
        let normal = [];
        let index0, index1, index2, indexJ;
        index0 = 3 * indices[i];
        index1 = 3 * indices[i + 1];
        index2 = 3 * indices[i + 2];
        v1[x] = vertexArray[index2 + x] - vertexArray[index1 + x];
        v1[y] = vertexArray[index2 + y] - vertexArray[index1 + y];
        v1[z] = vertexArray[index2 + z] - vertexArray[index1 + z];
        v2[x] = vertexArray[index0 + x] - vertexArray[index1 + x];
        v2[y] = vertexArray[index0 + y] - vertexArray[index1 + y];
        v2[z] = vertexArray[index0 + z] - vertexArray[index1 + z];
        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
        for (j = 0; j < 3; j++) {
            indexJ = 3 * indices[i + j];
            result[indexJ + x] = result[indexJ + x] + normal[x];
            result[indexJ + y] = result[indexJ + y] + normal[y];
            result[indexJ + z] = result[indexJ + z] + normal[z];
        }
    }
    for (i = 0; i < vertexArray.length; i = i + 3) {
        let nn = [];
        nn[x] = result[i + x];
        nn[y] = result[i + y];
        nn[z] = result[i + z];
        let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
        if (len === 0) len = 1.0;
        nn[x] = nn[x] / len;
        nn[y] = nn[y] / len;
        nn[z] = nn[z] / len;
        result[i + x] = nn[x];
        result[i + y] = nn[y];
        result[i + z] = nn[z];
    }
    return result;
}
export default calculateNormals