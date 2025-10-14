/**
 * Represents the morph data for a GLTF model.
 */
class MorphInfoData_GLTF {
    vertices = [];
    verticesColor_0 = [];
    normals = [];
    uvs = [];
    uvs1 = [];
    uvs2 = [];
    jointWeights = [];
    joints = [];
    tangents = [];
    interleaveData;
    /**
     * Creates a new instance of the constructor.
     *
     * @param {number[]} [vertices=[]] - The vertices of the object.
     * @param {number[]} [verticesColor_0=[]] - The color values of the vertices.
     * @param {number[]} [normals=[]] - The normals of the object.
     * @param {number[]} [uvs=[]] - The texture coordinates of the object.
     * @param {number[]} [uvs1=[]] - Additional texture coordinates of the object.
     * @param {number[]} [uvs2=[]] - Additional texture coordinates of the object.
     * @param {number[]} [jointWeights=[]] - The weights of the joints affecting the object.
     * @param {number[]} [joints=[]] - The indices of the joints influencing the object.
     * @param {number[]} [tangents=[]] - The tangents of the object.
     */
    constructor(vertices = [], verticesColor_0 = [], normals = [], uvs = [], uvs1 = [], uvs2 = [], jointWeights = [], joints = [], tangents = []) {
        this.vertices = vertices;
        this.verticesColor_0 = verticesColor_0;
        this.normals = normals;
        this.uvs = uvs;
        this.uvs1 = uvs1;
        this.uvs2 = uvs1;
        this.jointWeights = jointWeights;
        this.joints = joints;
        this.tangents = tangents;
    }
}
export default MorphInfoData_GLTF;
