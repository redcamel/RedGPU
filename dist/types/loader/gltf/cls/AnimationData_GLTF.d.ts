import { GLTF, GlTfId } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * Class representing animation information for GLTF format.
 */
declare class AnimationData_GLTF {
    gltfLoader: GLTFLoader;
    scenesData: GLTF;
    accessorGlTfId: GlTfId;
    dataList: Float32Array;
    /**
     * Constructs a new instance of the class.
     *
     * @param {GLTFLoader} gltfLoader - The GLTFLoader object used to load the GLTF data.
     * @param {GLTF} gltfData - The GLTF data containing the scenes.
     * @param {GlTfId} accessorGlTfId - The ID of the accessor to retrieve data from.
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, accessorGlTfId: GlTfId);
}
export default AnimationData_GLTF;
