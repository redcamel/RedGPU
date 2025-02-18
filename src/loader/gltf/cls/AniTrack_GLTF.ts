import Mesh from "../../../display/mesh/Mesh";
import AnimationData_GLTF from "./AnimationData_GLTF";

/**
 * Represents an animation track for a GLTF model.
 * @class
 */
class AniTrack_GLTF {
    key
    timeAnimationInfo: AnimationData_GLTF
    aniDataAnimationInfo: AnimationData_GLTF
    interpolation: "CUBICSPLINE" | "STEP" | 'LINEAR' | string
    animationTargetMesh: Mesh
    weightMeshes: Mesh[]

    /**
     * Creates a new instance of the Constructor class.
     *
     * @param {string} key - The key for the animation constructor.
     * @param {AnimationData_GLTF} time - The time animation data.
     * @param {AnimationData_GLTF} data - The animation data.
     * @param {string} interpolation - The interpolation method.
     * @param {Mesh} targetMesh - The target mesh for the animation.
     * @param {Mesh[]} weightMeshes - The array of weight meshes.
     */
    constructor(key, time: AnimationData_GLTF, data: AnimationData_GLTF, interpolation, targetMesh: Mesh, weightMeshes: Mesh[]) {
        this.key = key
        this.timeAnimationInfo = time
        this.aniDataAnimationInfo = data
        this.interpolation = interpolation
        this.animationTargetMesh = targetMesh
        this.weightMeshes = weightMeshes
    }
}

export default AniTrack_GLTF
