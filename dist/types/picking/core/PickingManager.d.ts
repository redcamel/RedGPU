import InstancingMesh from "../../display/instancingMesh/InstancingMesh";
import Mesh from "../../display/mesh/Mesh";
import View3D from "../../display/view/View3D";
import RedGPUObject from "../../base/RedGPUObject";
import AView from "../../display/view/core/AView";
/**
 * [KO] GPU 오프스크린 피킹 패스와 레이캐스팅을 결합하여 뷰 내 객체의 마우스 상호작용을 처리하는 매니저 클래스입니다.
 * [EN] Manager class that processes mouse interactions with objects in a view by combining a GPU offscreen picking pass and raycasting.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const pickingManager = view.pickingManager;
 * ```
 *
 * @category Picking
 */
declare class PickingManager extends RedGPUObject {
    #private;
    /**
     * [KO] 마지막으로 수신된 마우스 이동/버튼 이벤트
     * [EN] Last received mouse move/button event
     */
    lastMouseEvent: MouseEvent;
    /**
     * [KO] 마지막으로 수신된 마우스 클릭 이벤트
     * [EN] Last received mouse click event
     */
    lastMouseClickEvent: MouseEvent;
    /**
     * [KO] PickingManager 인스턴스를 생성합니다.
     * [EN] Creates a PickingManager instance.
     *
     * @param view -
     * [KO] 피킹을 수행할 대상 뷰 인스턴스
     * [EN] Target view instance for picking
     */
    constructor(view: AView);
    /**
     * [KO] 피킹용 텍스처들이 점유 중인 총 비디오 메모리 크기(바이트)를 반환합니다.
     * [EN] Returns the total video memory size (in bytes) occupied by picking textures.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 현재 논리 마우스 X 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the current logical mouse X coordinate.
     *
     * @returns
     * [KO] 논리 마우스 X 좌표
     * [EN] Logical mouse X coordinate
     */
    get mouseX(): number;
    set mouseX(value: number);
    /**
     * [KO] 현재 논리 마우스 Y 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the current logical mouse Y coordinate.
     *
     * @returns
     * [KO] 논리 마우스 Y 좌표
     * [EN] Logical mouse Y coordinate
     */
    get mouseY(): number;
    set mouseY(value: number);
    /**
     * [KO] 현재 프레임에 수집된 피킹 대상 객체 목록을 반환합니다.
     * [EN] Returns the list of picking target objects collected in the current frame.
     *
     * @returns
     * [KO] 피킹 대상 메시 배열
     * [EN] Array of picking target meshes
     */
    get castingList(): (Mesh | InstancingMesh)[];
    /**
     * [KO] 피킹 색상 렌더링용 GPU 텍스처를 반환합니다.
     * [EN] Returns the GPU texture used for picking color rendering.
     *
     * @returns
     * [KO] 피킹용 `GPUTexture`
     * [EN] `GPUTexture` for picking
     */
    get pickingGPUTexture(): GPUTexture;
    /**
     * [KO] 피킹 색상 텍스처의 GPU 텍스처 뷰를 반환합니다.
     * [EN] Returns the GPU texture view of the picking color texture.
     *
     * @returns
     * [KO] 피킹용 `GPUTextureView`
     * [EN] `GPUTextureView` for picking
     */
    get pickingGPUTextureView(): GPUTextureView;
    /**
     * [KO] 피킹 깊이 텍스처의 GPU 텍스처 뷰를 반환합니다.
     * [EN] Returns the GPU texture view of the picking depth texture.
     *
     * @returns
     * [KO] 피킹 깊이용 `GPUTextureView`
     * [EN] `GPUTextureView` for picking depth
     */
    get pickingDepthGPUTextureView(): GPUTextureView;
    /**
     * [KO] 피킹 렌더 패스 디스크립터를 반환합니다.
     * [EN] Returns the picking render pass descriptor.
     *
     * @returns
     * [KO] `GPURenderPassDescriptor` 객체
     * [EN] `GPURenderPassDescriptor` object
     */
    get pickingPassDescriptor(): GPURenderPassDescriptor;
    /**
     * [KO] 수집된 피킹 대상 객체들을 피킹 렌더 패스에 기록하고 픽셀 읽기 복사를 예약합니다.
     * [EN] Records collected picking target objects into the picking render pass and schedules pixel readback copy.
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     */
    render(view: View3D): void;
    /**
     * [KO] 피킹 대상 객체 리스트를 비웁니다.
     * [EN] Clears the picking casting list.
     */
    resetCastingList(): void;
    /**
     * [KO] 피킹 매니저의 GPU 텍스처 및 픽셀 읽기 버퍼를 파기합니다.
     * [EN] Destroys the picking manager's GPU textures and pixel readback buffer.
     */
    destroy(): void;
    /**
     * [KO] 비동기로 픽셀 색상 값을 읽어 피킹된 객체를 판별하고 등록된 마우스 이벤트를 실행합니다.
     * [EN] Asynchronously reads the pixel color value to identify the picked object and dispatches registered mouse events.
     *
     * @param view -
     * [KO] 대상 뷰 인스턴스
     * [EN] Target view instance
     * @param time -
     * [KO] 현재 프레임 시각 (ms)
     * [EN] Current frame time (ms)
     */
    checkEvents(view: any, time: number): Promise<void>;
}
export default PickingManager;
