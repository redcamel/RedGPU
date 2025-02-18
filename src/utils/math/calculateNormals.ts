/**
 * Calculates the vertex normals based on the given vertex and index arrays.
 *
 * @param {number[]} vertexArray - The array of vertex positions.
 * @param {number[]} indexArray - The array of vertex indices.
 * @returns {number[]} - The array of calculated vertex normals.
 */
const calculateNormals = (vertexArray, indexArray) => {
    let i, j;
    let x = 0;
    let y = 1;
    let z = 2;
    let result = [];
    for (i = 0; i < vertexArray.length; i = i + 3) {
        //for each vertex, initialize normal x, normal y, normal z
        result[i + x] = 0.0;
        result[i + y] = 0.0;
        result[i + z] = 0.0;
    }
    for (i = 0; i < indexArray.length; i = i + 3) { //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
        let v1 = [];
        let v2 = [];
        let normal = [];
        let index0, index1, index2, indexJ;
        index0 = 3 * indexArray[i];
        index1 = 3 * indexArray[i + 1];
        index2 = 3 * indexArray[i + 2];
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
            indexJ = 3 * indexArray[i + j];
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
