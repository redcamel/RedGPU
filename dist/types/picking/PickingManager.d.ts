import InstancingMesh from "../display/instancingMesh/InstancingMesh";
import Mesh from "../display/mesh/Mesh";
import View3D from "../display/view/View3D";
/**
 * `PickingManager` 클래스는 마우스 이벤트를 처리하고, 특정 객체에 대한 상호작용을 관리합니다.
 * - 마우스 클릭, 이동, 오버 등의 이벤트를 감지하고 처리합니다.
 * - GPU 텍스처를 사용하여 픽셀 단위의 객체 선택을 구현합니다.
 * - 이벤트 발생 시 해당 객체에 이벤트를 전달합니다.
 */
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
