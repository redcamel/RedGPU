/**
 * Interleaves data for GLTF format.
 *
 * @param {Array<number>} interleaveData - The array to store the interleaved data.
 * @param {Array<number>} vertices - The array of vertices.
 * @param {Array<number>} verticesColor_0 - The array of vertex colors.
 * @param {Array<number>} normalData - The array of normal data.
 * @param {Array<number>} uvs - The array of texture coordinates.
 * @param {Array<number>} uvs1 - The array of secondary texture coordinates.
 * @param {Array<number>} uvs2 - The array of secondary texture coordinates.
 * @param {Array<number>} jointWeights - The array of joint weights.
 * @param {Array<number>} joints - The array of joints.
 * @param {Array<number>} tangents - The array of tangents.
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
            if (has_uvs2) {
                interleaveData[idx++] = uvs2[index2D];
                interleaveData[idx++] = uvs2[index2D_1];
            } else if (has_uvs1) {
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
