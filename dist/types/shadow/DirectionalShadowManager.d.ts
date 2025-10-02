import RedGPUContext from "../context/RedGPUContext";
import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
declare class DirectionalShadowManager {
    #private;
    get videoMemorySize(): number;
    get castingList(): (Mesh | InstancingMesh)[];
    get shadowDepthTextureView(): GPUTextureView;
    get shadowDepthTextureViewEmpty(): GPUTextureView;
    get bias(): number;
    set bias(value: number);
    get shadowDepthTextureSize(): number;
    set shadowDepthTextureSize(value: number);
    reset(): void;
    resetCastingList(): void;
    updateViewSystemUniforms(redGPUContext: RedGPUContext): void;
    destroy(): void;
}
export default DirectionalShadowManager;
