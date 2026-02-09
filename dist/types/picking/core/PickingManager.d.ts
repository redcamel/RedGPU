import InstancingMesh from "../../display/instancingMesh/InstancingMesh";
import Mesh from "../../display/mesh/Mesh";
/**
 * [KO] 마우스 이벤트를 처리하고 객체와의 상호작용을 관리하는 클래스입니다.
 * [EN] Class that handles mouse events and manages interaction with objects.
 *
 * [KO] 마우스 클릭, 이동, 오버 등의 이벤트를 감지하고 처리합니다. GPU 텍스처를 사용하여 픽셀 단위의 객체 선택을 구현합니다.
 * [EN] Detects and processes events such as mouse clicks, moves, and overs. Implements pixel-perfect object selection using GPU textures.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // 올바른 접근 방법 (Correct access)
 * const pickingManager = view.pickingManager;
 * ```
 * @category Picking
 */
declare class PickingManager {
    #private;
    lastMouseEvent: MouseEvent;
    lastMouseClickEvent: MouseEvent;
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 마우스 X 좌표
     * [EN] Mouse X coordinate
     */
    get mouseX(): number;
    set mouseX(value: number);
    /**
     * [KO] 마우스 Y 좌표
     * [EN] Mouse Y coordinate
     */
    get mouseY(): number;
    set mouseY(value: number);
    /**
     * [KO] 피킹 대상 리스트를 반환합니다.
     * [EN] Returns the picking casting list.
     */
    get castingList(): (Mesh | InstancingMesh)[];
    /**
     * [KO] 피킹용 GPU 텍스처를 반환합니다.
     * [EN] Returns the GPU texture for picking.
     */
    get pickingGPUTexture(): GPUTexture;
    /**
     * [KO] 피킹용 GPU 텍스처 뷰를 반환합니다.
     * [EN] Returns the GPU texture view for picking.
     */
    get pickingGPUTextureView(): GPUTextureView;
    /**
     * [KO] 피킹용 깊이 텍스처 뷰를 반환합니다.
     * [EN] Returns the depth texture view for picking.
     */
    get pickingDepthGPUTextureView(): GPUTextureView;
    /**
     * [KO] 캐스팅 리스트를 초기화합니다.
     * [EN] Resets the casting list.
     */
    resetCastingList(): void;
    /**
     * [KO] PickingManager를 파기합니다.
     * [EN] Destroys the PickingManager.
     */
    destroy(): void;
    /**
     * [KO] 텍스처 크기를 확인하고 필요시 재생성합니다.
     * [EN] Checks the texture size and recreates it if necessary.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     */
    checkTexture(view: any): void;
    /**
     * [KO] 이벤트를 확인하고 처리합니다.
     * [EN] Checks and processes events.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param time -
     * [KO] 시간
     * [EN] Time
     */
    checkEvents(view: any, time: number): void;
}
export default PickingManager;
