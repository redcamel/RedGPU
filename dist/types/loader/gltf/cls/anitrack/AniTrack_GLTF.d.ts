import RedGPUContext from "../../../../context/RedGPUContext";
import Mesh from "../../../../display/mesh/Mesh";
import AnimationData_GLTF from "../AnimationData_GLTF";
declare class AniTrack_GLTF {
    #private;
    lastPrevIdx: number;
    key: any;
    timeAnimationInfo: AnimationData_GLTF;
    aniDataAnimationInfo: AnimationData_GLTF;
    interpolation: "CUBICSPLINE" | "STEP" | "LINEAR" | string;
    weightMeshes: Mesh[];
    animationTargetMesh: Mesh;
    cacheTable: {};
    constructor(key: any, time: any, data: any, interpolation: any, targetMesh: Mesh, weightMeshes: any);
    renderWeight(redGPUContext: RedGPUContext, computePassEncoder: GPUComputePassEncoder, targetMesh: Mesh, interpolationValue: number, prevIDX: number, nextIDX: number): Promise<void>;
}
export default AniTrack_GLTF;
