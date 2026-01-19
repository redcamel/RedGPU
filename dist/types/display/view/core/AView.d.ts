import Camera2D from "../../../camera/camera/Camera2D";
import AController from "../../../camera/core/AController";
import RedGPUContext from "../../../context/RedGPUContext";
import PickingManager from "../../../picking/core/PickingManager";
import FXAA from "../../../antialiasing/fxaa/FXAA";
import TAA from "../../../antialiasing/taa/TAA";
import DrawDebuggerAxis from "../../drawDebugger/DrawDebuggerAxis";
import DrawDebuggerGrid from "../../drawDebugger/grid/DrawDebuggerGrid";
import Scene from "../../scene/Scene";
import ViewTransform from "./ViewTransform";
/**
 * [KO] View3D 및 View2D의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class that serves as a common foundation for View3D and View2D.
 *
 * [KO] RedGPU의 뷰 시스템에서 핵심 역할을 하며, Scene, Camera, PickingManager, 디버깅 도구(Grid, Axis), 후처리 효과(TAA, FXAA) 등을 포함합니다.
 * [EN] Plays a key role in RedGPU's view system, including Scene, Camera, PickingManager, debugging tools (Grid, Axis), and post-effects (TAA, FXAA).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 추상 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class used internally by the system.<br/>Do not create instances directly.
 * :::
 *
 * @category Core
 */
declare abstract class AView extends ViewTransform {
    #private;
    /**
     * [KO] AView 생성자
     * [EN] AView constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] Scene 인스턴스
     * [EN] Scene instance
     * @param camera -
     * [KO] AController 또는 Camera2D 인스턴스
     * [EN] AController or Camera2D instance
     * @param name -
     * [KO] 선택적 이름
     * [EN] Optional name
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, camera: AController | Camera2D, name?: string);
    /**
     * [KO] 뷰의 이름을 반환합니다.
     * [EN] Returns the name of the view.
     */
    get name(): string;
    /**
     * [KO] 뷰의 이름을 설정합니다.
     * [EN] Sets the name of the view.
     * @param value -
     * [KO] 설정할 이름 문자열
     * [EN] Name string to set
     */
    set name(value: string);
    /**
     * [KO] 현재 뷰에 연결된 Scene 객체를 반환합니다.
     * [EN] Returns the Scene object connected to the current view.
     */
    get scene(): Scene;
    /**
     * [KO] 뷰에 Scene을 설정합니다.
     * [EN] Sets the Scene for the view.
     * @param value -
     * [KO] Scene 인스턴스
     * [EN] Scene instance
     * @throws
     * [KO] Scene 인스턴스가 아닌 경우 에러 발생
     * [EN] Throws error if not a Scene instance
     */
    set scene(value: Scene);
    /**
     * [KO] 마우스 좌표 기반 객체 선택을 위한 PickingManager를 반환합니다.
     * [EN] Returns the PickingManager for mouse coordinate-based object selection.
     */
    get pickingManager(): PickingManager;
    /**
     * [KO] Frustum Culling 사용 여부를 반환합니다.
     * [EN] Returns whether to use frustum culling.
     */
    get useFrustumCulling(): boolean;
    /**
     * [KO] Frustum Culling 사용 여부를 설정합니다.
     * [EN] Sets whether to use frustum culling.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useFrustumCulling(value: boolean);
    /**
     * [KO] 거리 기반 Culling 사용 여부를 반환합니다.
     * [EN] Returns whether to use distance-based culling.
     */
    get useDistanceCulling(): boolean;
    /**
     * [KO] 거리 기반 Culling 사용 여부를 설정합니다.
     * [EN] Sets whether to use distance-based culling.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useDistanceCulling(value: boolean);
    /**
     * [KO] 거리 기반 Culling의 기준 거리를 반환합니다.
     * [EN] Returns the threshold distance for distance-based culling.
     */
    get distanceCulling(): number;
    /**
     * [KO] 거리 기반 Culling의 기준 거리를 설정합니다.
     * [EN] Sets the threshold distance for distance-based culling.
     * @param value -
     * [KO] 거리 값
     * [EN] Distance value
     */
    set distanceCulling(value: number);
    /**
     * [KO] 디버깅용 그리드 객체를 반환합니다.
     * [EN] Returns the grid object for debugging.
     */
    get grid(): DrawDebuggerGrid;
    /**
     * [KO] 디버깅용 그리드를 설정합니다.
     * [EN] Sets the grid for debugging.
     * @param value -
     * [KO] boolean 또는 DrawDebuggerGrid 인스턴스
     * [EN] boolean or DrawDebuggerGrid instance
     */
    set grid(value: DrawDebuggerGrid | boolean);
    /**
     * [KO] 디버깅용 축 객체를 반환합니다.
     * [EN] Returns the axis object for debugging.
     */
    get axis(): DrawDebuggerAxis;
    /**
     * [KO] 디버깅용 축을 설정합니다.
     * [EN] Sets the axis for debugging.
     * @param value -
     * [KO] boolean 또는 DrawDebuggerAxis 인스턴스
     * [EN] boolean or DrawDebuggerAxis instance
     */
    set axis(value: DrawDebuggerAxis | boolean);
    /**
     * [KO] FXAA 후처리 효과 객체를 반환합니다.
     * [EN] Returns the FXAA post-effect object.
     */
    get fxaa(): FXAA;
    /**
     * [KO] TAA 후처리 효과 객체를 반환합니다.
     * [EN] Returns the TAA post-effect object.
     */
    get taa(): TAA;
    /**
     * [KO] 화면 좌표를 월드 좌표로 변환합니다.
     * [EN] Converts screen coordinates to world coordinates.
     * @param screenX -
     * [KO] 화면 X 좌표
     * [EN] Screen X coordinate
     * @param screenY -
     * [KO] 화면 Y 좌표
     * [EN] Screen Y coordinate
     * @returns
     * [KO] 변환된 월드 좌표
     * [EN] Converted world coordinates
     */
    screenToWorld(screenX: number, screenY: number): number[];
    /**
     * [KO] 마우스가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.
     * [EN] Checks if the mouse is within the pixel area of the current view.
     * @returns
     * [KO] 포함 여부
     * [EN] Whether it is contained
     */
    checkMouseInViewBounds(): boolean;
}
export default AView;
