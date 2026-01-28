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
declare const parseInterleaveData_GLTF: (interleaveData: number[], vertices: number[], verticesColor_0: number[], normalData: number[], uvs: number[], uvs1: number[], uvs2: number[], jointWeights: number[], joints: number[], tangents: number[], onlyWeights?: boolean, onlyJoints?: boolean) => void;
export default parseInterleaveData_GLTF;
