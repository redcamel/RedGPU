import Camera2D from "../../../camera/camera/Camera2D";
import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import AController from "../../../camera/core/AController";
import RedGPUContext from "../../../context/RedGPUContext";
import PickingManager from "../../../picking/core/PickingManager";
import FXAA from "../../../antialiasing/fxaa/FXAA";
import TAA from "../../../antialiasing/taa/TAA";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import screenToWorld from "../../../math/coordinates/screenToWorld";
import DrawDebuggerAxis from "../../drawDebugger/DrawDebuggerAxis";
import DrawDebuggerGrid from "../../drawDebugger/grid/DrawDebuggerGrid";
import Scene from "../../scene/Scene";
import ViewTransform from "./ViewTransform";

/**
 * [KO] View3D 및 View2D of the common foundation that serves as an abstract base class.
 * [EN] Abstract base class that serves as a common foundation for View3D and View2D.
 *
 * [KO] RedGPU의 뷰 시스템에서 핵심 역할을 하며, Scene, Camera, PickingManager, 디버깅 도구(Grid, Axis), 후처리 효과(TAA, FXAA) 등을 포함합니다.
 * [EN] Plays a key role in RedGPU's view system, including Scene, Camera, PickingManager, debugging tools (Grid, Axis), and post-effects (TAA, FXAA).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class AView extends ViewTransform {
    /**
     * [KO] 연결된 Scene 객체
     * [EN] Connected Scene object
     */
    #scene: Scene
    /**
     * [KO] 객체 선택을 관리하는 PickingManager
     * [EN] PickingManager that manages object selection
     */
    #pickingManager: PickingManager
    /**
     * [KO] Frustum Culling 사용 여부
     * [EN] Whether to use frustum culling
     */
    #useFrustumCulling: boolean = true
    /**
     * [KO] 거리 기반 Culling 사용 여부
     * [EN] Whether to use distance-based culling
     */
    #useDistanceCulling: boolean = false
    /**
     * [KO] 거리 기반 Culling의 기준 거리
     * [EN] Threshold distance for distance-based culling
     */
    #distanceCulling: number = 50
    /**
     * [KO] 디버깅용 그리드 객체
     * [EN] Grid object for debugging
     */
    #grid: DrawDebuggerGrid
    /**
     * [KO] 디버깅용 축 객체
     * [EN] Axis object for debugging
     */
    #axis: DrawDebuggerAxis
    /**
     * [KO] TAA 후처리 효과 객체
     * [EN] TAA post-effect object
     */
    #taa: TAA
    /**
     * [KO] FXAA 후처리 효과 객체
     * [EN] FXAA post-effect object
     */
    #fxaa: FXAA
    #destroyed: boolean = false
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
     * [KO] PerspectiveCamera, OrthographicCamera, AController 또는 Camera2D 인스턴스
     * [EN] PerspectiveCamera, OrthographicCamera, AController or Camera2D instance
     * @param name -
     * [KO] 선택적 이름
     * [EN] Optional name
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        scene: Scene,
        camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D,
        name?: string
    ) {
        super(redGPUContext)
        this.scene = scene
        this.camera = camera
        this.#pickingManager = new PickingManager(this)
        if (name) this.name = name
    }

    /**
     * [KO] 현재 뷰에 연결된 Scene 객체를 반환합니다.
     * [EN] Returns the Scene object connected to the current view.
     */
    get scene(): Scene {
        return this.#scene;
    }

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
    set scene(value: Scene) {
        if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
        this.#scene = value;
    }

    /**
     * [KO] 마우스 좌표 기반 객체 선택을 위한 PickingManager를 반환합니다.
     * [EN] Returns the PickingManager for mouse coordinate-based object selection.
     */
    get pickingManager(): PickingManager {
        return this.#pickingManager;
    }

    /**
     * [KO] Frustum Culling 사용 여부를 반환합니다.
     * [EN] Returns whether to use frustum culling.
     */
    get useFrustumCulling(): boolean {
        return this.#useFrustumCulling;
    }

    /**
     * [KO] Frustum Culling 사용 여부를 설정합니다.
     * [EN] Sets whether to use frustum culling.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useFrustumCulling(value: boolean) {
        this.#useFrustumCulling = value;
    }

    /**
     * [KO] 거리 기반 Culling 사용 여부를 반환합니다.
     * [EN] Returns whether to use distance-based culling.
     */
    get useDistanceCulling(): boolean {
        return this.#useDistanceCulling;
    }

    /**
     * [KO] 거리 기반 Culling 사용 여부를 설정합니다.
     * [EN] Sets whether to use distance-based culling.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useDistanceCulling(value: boolean) {
        this.#useDistanceCulling = value;
    }

    /**
     * [KO] 거리 기반 Culling의 기준 거리를 반환합니다.
     * [EN] Returns the threshold distance for distance-based culling.
     */
    get distanceCulling(): number {
        return this.#distanceCulling;
    }

    /**
     * [KO] 거리 기반 Culling의 기준 거리를 설정합니다.
     * [EN] Sets the threshold distance for distance-based culling.
     * @param value -
     * [KO] 거리 값
     * [EN] Distance value
     */
    set distanceCulling(value: number) {
        this.#distanceCulling = value;
    }

    /**
     * [KO] 디버깅용 그리드 객체를 반환합니다.
     * [EN] Returns the grid object for debugging.
     */
    get grid(): DrawDebuggerGrid {
        return this.#grid;
    }

    /**
     * [KO] 디버깅용 그리드를 설정합니다.
     * [EN] Sets the grid for debugging.
     * @param value -
     * [KO] boolean 또는 DrawDebuggerGrid 인스턴스
     * [EN] boolean or DrawDebuggerGrid instance
     */
    set grid(value: DrawDebuggerGrid | boolean) {
        if (typeof value === 'boolean') {
            if (value === true) {
                value = new DrawDebuggerGrid(this.redGPUContext);
            } else {
                value = null;
            }
        } else if (!(value instanceof DrawDebuggerGrid) && value !== null) {
            throw new TypeError("grid must be of type 'DrawDebuggerGrid', 'boolean', or 'null'.");
        }
        this.#grid = value as DrawDebuggerGrid;
    }

    /**
     * [KO] 디버깅용 축 객체를 반환합니다.
     * [EN] Returns the axis object for debugging.
     */
    get axis(): DrawDebuggerAxis {
        return this.#axis;
    }

    /**
     * [KO] 디버깅용 축을 설정합니다.
     * [EN] Sets the axis for debugging.
     * @param value -
     * [KO] boolean 또는 DrawDebuggerAxis 인스턴스
     * [EN] boolean or DrawDebuggerAxis instance
     */
    set axis(value: DrawDebuggerAxis | boolean) {
        if (typeof value === 'boolean') {
            if (value === true) {
                value = new DrawDebuggerAxis(this.redGPUContext);
            } else {
                value = null;
            }
        } else if (!(value instanceof DrawDebuggerAxis) && value !== null) {
            throw new TypeError("axis must be of type 'DrawDebuggerAxis', 'boolean', or 'null'.");
        }
        this.#axis = value as DrawDebuggerAxis;
    }

    /**
     * [KO] FXAA 후처리 효과 객체를 반환합니다.
     * [EN] Returns the FXAA post-effect object.
     * @returns
     * [KO] FXAA 인스턴스
     * [EN] FXAA instance
     */
    get fxaa(): FXAA {
        if (!this.#fxaa) {
            this.#fxaa = new FXAA(this.redGPUContext);
        }
        return this.#fxaa;
    }

    /**
     * [KO] TAA 후처리 효과 객체를 반환합니다.
     * [EN] Returns the TAA post-effect object.
     * @returns
     * [KO] TAA 인스턴스
     * [EN] TAA instance
     */
    get taa(): TAA {
        if (!this.#taa) {
            this.#taa = new TAA(this.redGPUContext);
        }
        return this.#taa;
    }

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
     * [KO] 변환된 월드 좌표 (3D 벡터 배열)
     * [EN] Converted world coordinates (3D vector array)
     */
    screenToWorld(
        screenX: number,
        screenY: number,
    ) {
        return screenToWorld(screenX, screenY, this)
    }

    /**
     * [KO] 마우스 포인터가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.
     * [EN] Checks if the mouse pointer is within the pixel area of the current view.
     * @returns
     * [KO] 마우스가 뷰 영역 안에 있으면 true, 그렇지 않으면 false
     * [EN] True if the mouse is inside the view bounds, otherwise false
     */
    checkMouseInViewBounds(): boolean {
        const {pixelRectObject, pickingManager} = this;
        const {mouseX, mouseY} = pickingManager;
        return (0 < mouseX && mouseX < pixelRectObject.width) &&
            (0 < mouseY && mouseY < pixelRectObject.height);
    }

    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true
        if (this.camera) {
            if (this.camera instanceof AController) {
                this.camera.destroy();
            }
            this.camera = null;
        }

        this.#scene.destroy();

        if (this.#taa) {
            this.#taa.destroy();
            this.#taa = null;
        }
        if (this.#fxaa) {
            this.#fxaa.destroy();
            this.#fxaa = null;
        }
        if (this.#grid) {
            this.#grid.destroy();
            this.#grid = null;
        }
        if (this.#axis) {
            this.#axis.destroy();
            this.#axis = null;
        }
        if (this.#pickingManager) {
            this.#pickingManager.destroy();
            this.#pickingManager = null;
        }
        this.#scene = null;
    }
}

Object.freeze(AView);
export default AView;
