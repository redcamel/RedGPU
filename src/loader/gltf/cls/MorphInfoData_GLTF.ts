/**
 * Represents the morph data for a GLTF model.
 */
class MorphInfoData_GLTF {
    vertices: number[] = [];
    verticesColor_0: number[] = [];
    normals: number[] = [];
    uvs: number[] = [];
    uvs1: number[] = [];
    jointWeights: number[] = [];
    joints: number[] = [];
    tangents: number[] = [];
    interleaveData: number[]

    /**
     * Creates a new instance of the constructor.
     *
     * @param {number[]} [vertices=[]] - The vertices of the object.
     * @param {number[]} [verticesColor_0=[]] - The color values of the vertices.
     * @param {number[]} [normals=[]] - The normals of the object.
     * @param {number[]} [uvs=[]] - The texture coordinates of the object.
     * @param {number[]} [uvs1=[]] - Additional texture coordinates of the object.
     * @param {number[]} [jointWeights=[]] - The weights of the joints affecting the object.
     * @param {number[]} [joints=[]] - The indices of the joints influencing the object.
     * @param {number[]} [tangents=[]] - The tangents of the object.
     */
    constructor(
        vertices: number[] = [], verticesColor_0: number[] = [], normals: number[] = [],
        uvs: number[] = [], uvs1: number[] = [],
        jointWeights: number[] = [], joints: number[] = [], tangents: number[] = []
    ) {
        this.vertices = vertices;
        this.verticesColor_0 = verticesColor_0;
        this.normals = normals;
        this.uvs = uvs;
        this.uvs1 = uvs1;
        this.jointWeights = jointWeights;
        this.joints = joints;
        this.tangents = tangents;
    }
}

export default MorphInfoData_GLTF
