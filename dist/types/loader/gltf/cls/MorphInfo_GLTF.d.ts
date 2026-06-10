import { GLTF, MeshPrimitive } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
import MorphInfoData_GLTF from "./MorphInfoData_GLTF";
/**
 * Represents a MorphInfo_GLTF object.
 * @constructor
 * @param {GLTFLoader} gltfLoader - The GLTFLoader object.
 * @param {GLTF} scenesData - The scenes data object.
 * @param {MeshPrimitive} meshPrimitive - The mesh primitive object.
 * @param {number[]} weightsValue - The weights values for morphing.
 */
declare class MorphInfo_GLTF {
    morphInfoDataList: MorphInfoData_GLTF[];
    weights: number[];
    cacheData: {};
    origin: any;
    /**
     * Creates a new instance of the Constructor class.
     * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
     * @param {GLTF} gltfData - The GLTF data.
     * @param {MeshPrimitive} meshPrimitive - The mesh primitive.
     * @param {number[]} weightsValue - The weights value.
     */
    constructor(gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive, weightsValue: number[]);
}
export default MorphInfo_GLTF;
