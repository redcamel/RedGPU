import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
/**
 * Parses attribute information from GLTF format and populates corresponding arrays.
 *
 * @param {string} key - The attribute key.
 * @param {AccessorInfo_GLTF} accessorInfo - The object containing information about the accessor.
 * @param {Array} vertices - The array to store vertex data.
 * @param {Array} uvs - The array to store uv data.
 * @param {Array} uvs1 - The array to store uv1 data.
 * @param {Array} uvs2 - The array to store uv1 data.
 * @param {Array} normals - The array to store normal data.
 * @param {Array} jointWeights - The array to store joint weight data.
 * @param {Array} joints - The array to store joint data.
 * @param {Array} verticesColor_0 - The array to store vertex color data.
 * @param {Array} tangents - The array to store tangent data.
 */
declare const parseAttributeInfo_GLTF: (key: string, accessorInfo: AccessorInfo_GLTF, vertices: any, uvs: any, uvs1: any, uvs2: any, normals: any, jointWeights: any, joints: any, verticesColor_0: any, tangents: any) => void;
export default parseAttributeInfo_GLTF;
