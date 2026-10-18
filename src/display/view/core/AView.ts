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
 * [KO] `View3D` 및 `View2D`의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class that serves as a common foundation for `View3D` and `View2D`.
 *
 * [KO] `Scene`, `Camera`, `PickingManager`, 디버깅 도구(`Grid`, `Axis`), 안티앨리어싱(`TAA`, `FXAA`) 등 뷰포트 공통 기능을 관리합니다.
 * [EN] Manages common viewport features including `Scene`, `Camera`, `PickingManager`, debugging tools (`Grid`, `Axis`), and anti-aliasing (`TAA`, `FXAA`).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
abstract class AView extends ViewTransform {
    #scene: Scene
    #pickingManager: PickingManager
    #useFrustumCulling: boolean = true
    #useDistanceCulling: boolean = false
    #distanceCulling: number = 50
    #grid: DrawDebuggerGrid
    #axis: DrawDebuggerAxis
    #taa: TAA
    #fxaa: FXAA
    #destroyed: boolean = false

    /**
     * [KO] `AView` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AView` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] 렌더링할 Scene 인스턴스
     * [EN] Scene instance to render
     * @param camera -
     * [KO] 뷰에서 사용할 카메라 또는 컨트롤러 인스턴스
     * [EN] Camera or controller instance to use in the view
     * @param name -
     * [KO] 뷰 이름 (선택)
     * [EN] View name (optional)
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
     * [KO] 현재 뷰에 연결된 `Scene` 객체를 반환하거나 설정합니다.
     * [EN] Returns or sets the `Scene` object connected to the current view.
     *
     * @returns
     * [KO] `Scene` 인스턴스
     * [EN] `Scene` instance
     * @throws
     * [KO] `Scene` 인스턴스가 아닌 값을 설정할 경우 예외 발생
     * [EN] Throws an error if the value is not a `Scene` instance
     */
    get scene(): Scene {
        return this.#scene;
    }

    set scene(value: Scene) {
        if (!(value instanceof Scene)) consoleAndThrowError('allow only Scene instance')
        this.#scene = value;
    }

    /**
     * [KO] 마우스 좌표 기반 객체 선택을 관리하는 `PickingManager`를 반환합니다.
     * [EN] Returns the `PickingManager` that manages mouse coordinate-based object selection.
     *
     * @returns
     * [KO] `PickingManager` 인스턴스
     * [EN] `PickingManager` instance
     */
    get pickingManager(): PickingManager {
        return this.#pickingManager;
    }

    /**
     * [KO] 절두체 컬링(Frustum Culling) 사용 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether frustum culling is enabled.
     *
     * @returns
     * [KO] 절두체 컬링 사용 여부
     * [EN] Whether frustum culling is enabled
     */
    get useFrustumCulling(): boolean {
        return this.#useFrustumCulling;
    }

    set useFrustumCulling(value: boolean) {
        this.#useFrustumCulling = value;
    }

    /**
     * [KO] 거리 기반 컬링(Distance Culling) 사용 여부를 반환하거나 설정합니다.
     * [EN] Returns or sets whether distance-based culling is enabled.
     *
     * @returns
     * [KO] 거리 기반 컬링 사용 여부
     * [EN] Whether distance-based culling is enabled
     */
    get useDistanceCulling(): boolean {
        return this.#useDistanceCulling;
    }

    set useDistanceCulling(value: boolean) {
        this.#useDistanceCulling = value;
    }

    /**
     * [KO] 거리 기반 컬링의 기준 거리를 반환하거나 설정합니다.
     * [EN] Returns or sets the threshold distance for distance-based culling.
     *
     * @returns
     * [KO] 기준 거리
     * [EN] Threshold distance
     */
    get distanceCulling(): number {
        return this.#distanceCulling;
    }

    set distanceCulling(value: number) {
        this.#distanceCulling = value;
    }

    /**
     * [KO] 디버깅용 그리드(`DrawDebuggerGrid`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)
     * [EN] Returns or sets the debugging grid (`DrawDebuggerGrid`) object. (Automatically creates/clears when a `boolean` is passed)
     *
     * @returns
     * [KO] `DrawDebuggerGrid` 인스턴스
     * [EN] `DrawDebuggerGrid` instance
     */
    get grid(): DrawDebuggerGrid {
        return this.#grid;
    }

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
     * [KO] 디버깅용 축(`DrawDebuggerAxis`) 객체를 반환하거나 설정합니다. (`boolean` 전달 시 자동 생성/해제)
     * [EN] Returns or sets the debugging axis (`DrawDebuggerAxis`) object. (Automatically creates/clears when a `boolean` is passed)
     *
     * @returns
     * [KO] `DrawDebuggerAxis` 인스턴스
     * [EN] `DrawDebuggerAxis` instance
     */
    get axis(): DrawDebuggerAxis {
        return this.#axis;
    }

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
     * [KO] FXAA 안티앨리어싱 객체를 반환합니다.
     * [EN] Returns the FXAA anti-aliasing object.
     *
     * @returns
     * [KO] `FXAA` 인스턴스
     * [EN] `FXAA` instance
     */
    get fxaa(): FXAA {
        if (!this.#fxaa) {
            this.#fxaa = new FXAA(this.redGPUContext);
        }
        return this.#fxaa;
    }

    /**
     * [KO] TAA 안티앨리어싱 객체를 반환합니다.
     * [EN] Returns the TAA anti-aliasing object.
     *
     * @returns
     * [KO] `TAA` 인스턴스
     * [EN] `TAA` instance
     */
    get taa(): TAA {
        if (!this.#taa) {
            this.#taa = new TAA(this.redGPUContext);
        }
        return this.#taa;
    }

    /**
     * [KO] 화면 좌표를 3D 월드 좌표로 변환합니다.
     * [EN] Converts screen coordinates to 3D world coordinates.
     *
     * @param screenX -
     * [KO] 화면 X 좌표 (픽셀)
     * [EN] Screen X coordinate (pixels)
     * @param screenY -
     * [KO] 화면 Y 좌표 (픽셀)
     * [EN] Screen Y coordinate (pixels)
     * @returns
     * [KO] 변환된 월드 좌표 (`[x, y, z]`)
     * [EN] Converted world coordinates (`[x, y, z]`)
     */
    screenToWorld(
        screenX: number,
        screenY: number,
    ) {
        return screenToWorld(screenX, screenY, this)
    }

    /**
     * [KO] 마우스 포인터가 현재 뷰의 픽셀 영역 내에 있는지 확인합니다.
     * [EN] Checks if the mouse pointer is within the pixel bounds of the current view.
     *
     * @returns
     * [KO] 마우스가 뷰 영역 내에 있으면 `true`, 아니면 `false`
     * [EN] `true` if the mouse is inside the view bounds, otherwise `false`
     */
    checkMouseInViewBounds(): boolean {
        const {pixelRectObject, pickingManager} = this;
        const {mouseX, mouseY} = pickingManager;
        return (0 < mouseX && mouseX < pixelRectObject.width) &&
            (0 < mouseY && mouseY < pixelRectObject.height);
    }

    /**
     * [KO] 뷰와 연결된 모든 리소스(카메라 컨트롤러, 씬, 후처리, 디버거, 피킹 매니저)를 해제합니다.
     * [EN] Destroys all resources connected to the view (camera controller, scene, post-effects, debuggers, picking manager).
     */
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
