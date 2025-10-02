import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
declare class PickingManager {
    #private;
    lastMouseEvent: MouseEvent;
    lastMouseClickEvent: MouseEvent;
    get videoMemorySize(): number;
    get mouseX(): number;
    set mouseX(value: number);
    get mouseY(): number;
    set mouseY(value: number);
    get castingList(): (Mesh | InstancingMesh)[];
    get pickingGPUTexture(): GPUTexture;
    get pickingGPUTextureView(): GPUTextureView;
    get pickingDepthGPUTextureView(): GPUTextureView;
    resetCastingList(): void;
    destroy(): void;
    checkTexture(view: View3D): void;
    checkEvents(view: View3D, time: number): void;
}
export default PickingManager;
