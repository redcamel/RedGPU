import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../../display/mesh/Mesh";
import AnimationData_GLTF from "../AnimationData_GLTF";
declare class AniTrack_GLTF {
    #private;
    lastPrevIdx: number;
    lastNextIdx: number;
    lastInterpolationValue: number;
    timeAnimationInfo: AnimationData_GLTF;
    aniDataAnimationInfo: AnimationData_GLTF;
    weightMeshes: Mesh[];
    animationTargetMesh: Mesh;
    cacheTable: {};
    key: any;
    keyType: number;
    interpolation: "CUBICSPLINE" | "STEP" | "LINEAR" | string;
    interpolationType: number;
    lastCachedKey: number;
    lastCachedItem: Float32Array | null;
    constructor(key: any, time: any, data: any, interpolation: any, targetMesh: Mesh, weightMeshes: any);
    renderWeight(redGPUContext: RedGPUContext, computePassEncoder: GPUComputePassEncoder, targetMesh: Mesh, interpolationValue: number, prevIDX: number, nextIDX: number): Promise<void>;
}
export default AniTrack_GLTF;
