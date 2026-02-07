/**
 * [KO] 정점 배열과 인덱스 배열을 기반으로 노멀 벡터를 계산합니다.
 * [EN] Calculates vertex normals from vertex and index arrays.
 *
 * [KO] 삼각형 면 단위로 노멀을 구한 뒤 평균화 및 정규화하여 반환합니다.
 * [EN] Calculates face normals, then returns averaged and normalized vertex normals.
 *
 * ### Example
 * ```typescript
 * const normals = RedGPU.math.calculateNormals(vertices, indices);
 * ```
 *
 * @param vertexArray -
 * [KO] 정점 위치 배열 (x, y, z 순서)
 * [EN] Vertex position array (x, y, z order)
 * @param indexArray -
 * [KO] 삼각형 정점 인덱스 배열
 * [EN] Vertex index array defining triangles
 * @returns
 * [KO] 계산된 정점 노멀 배열
 * [EN] Calculated vertex normal array
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
        //for each vertex, initialize normal x, normal y, normal z
        result[i + x] = 0.0;
        result[i + y] = 0.0;
        result[i + z] = 0.0;
    }
    for (i = 0; i < indices.length; i = i + 3) { //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
        let v1 = [];
        let v2 = [];
        let normal = [];
        let index0, index1, index2, indexJ;
        index0 = 3 * indices[i];
        index1 = 3 * indices[i + 1];
        index2 = 3 * indices[i + 2];
        //p2 - p1
        v1[x] = vertexArray[index2 + x] - vertexArray[index1 + x];
        v1[y] = vertexArray[index2 + y] - vertexArray[index1 + y];
        v1[z] = vertexArray[index2 + z] - vertexArray[index1 + z];
        //p0 - p1
        v2[x] = vertexArray[index0 + x] - vertexArray[index1 + x];
        v2[y] = vertexArray[index0 + y] - vertexArray[index1 + y];
        v2[z] = vertexArray[index0 + z] - vertexArray[index1 + z];
        normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
        normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
        normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
        for (j = 0; j < 3; j++) { //update the normals of that triangle: sum of vectors
            indexJ = 3 * indices[i + j];
            result[indexJ + x] = result[indexJ + x] + normal[x];
            result[indexJ + y] = result[indexJ + y] + normal[y];
            result[indexJ + z] = result[indexJ + z] + normal[z];
        }
    }
    //normalize the result
    for (i = 0; i < vertexArray.length; i = i + 3) { //the increment here is because each vertex occurs with an offset of 3 in the array (due to x, y, z contiguous values)
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