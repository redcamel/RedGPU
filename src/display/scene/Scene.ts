import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/core/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import {IPhysicsEngine} from "../../physics/IPhysicsEngine";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import Object3DContainer from "../mesh/core/Object3DContainer";

/**
 * [KO] View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.
 * [EN] Root container class that defines the space of a scene to be rendered in a View.
 *
 * [KO] 조명(LightManager), 그림자(ShadowManager), 물리 엔진(physicsEngine) 및 배경색 설정을 관리하며, 씬 그래프 내의 모든 시각적 3D/2D 오브젝트들을 계층적으로 포함하고 렌더링 흐름의 루트 역할을 수행합니다. View3D 또는 View2D에 장착되어 사용됩니다.
 * [EN] Manages light configurations (LightManager), shadows (ShadowManager), physics engine (physicsEngine), and background color settings. It hierarchically contains all visual 3D/2D objects in the scene graph and serves as the root of the rendering process, mounted inside View3D or View2D.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * scene.useBackgroundColor = true;
 * scene.backgroundColor.setColorByRGBA(25, 25, 25, 1);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/scene/" ></iframe>
 *
 * @category Scene
 */
class Scene extends Object3DContainer {
    /**
     * [KO] 씬의 배경 지우기(Clear) 시 채워질 배경색
     * [EN] Background color filled when clearing the scene background
     */
    #backgroundColor: ColorRGBA = new ColorRGBA()
    /**
     * [KO] 배경색 사용 활성화 여부
     * [EN] Whether background color usage is enabled
     */
    #useBackgroundColor: boolean = false
    /**
     * [KO] 씬 내부의 광원 관리자
     * [EN] Light manager inside the scene
     */
    #lightManager: LightManager = new LightManager()
    /**
     * [KO] 씬 내부의 그림자 연산 관리자
     * [EN] Shadow manager inside the scene
     */
    #shadowManager: ShadowManager = new ShadowManager()
    /**
     * [KO] 씬에 바인딩된 물리 시뮬레이션 엔진
     * [EN] Physics simulation engine bound to the scene
     */
    #physicsEngine: IPhysicsEngine
    #destroyed: boolean = false

    /**
     * [KO] Scene 인스턴스를 생성합니다.
     * [EN] Creates an instance of Scene.
     * @example
     * ```typescript
     * const scene = new RedGPU.Display.Scene('MainScene');
     * ```
     * @param name -
     * [KO] Scene의 이름 (선택적)
     * [EN] Name of the scene (optional)
     */
    constructor(name?: string) {
        super()
        if (name) this.name = name
    }

    destroy() {
        if (this.#destroyed) return
        this.#destroyed = true
        this.#shadowManager.destroy()
    }
    /**
     * [KO] 씬 내의 모든 조명을 통합 관리하는 LightManager 인스턴스를 가져옵니다.
     * [EN] Gets the LightManager instance that manages all lights within the scene.
     */
    get lightManager(): LightManager {
        return this.#lightManager;
    }

    /**
     * [KO] 씬 내의 모든 그림자 연산을 통합 제어하는 ShadowManager 인스턴스를 가져옵니다.
     * [EN] Gets the ShadowManager instance that controls all shadow computations within the scene.
     */
    get shadowManager(): ShadowManager {
        return this.#shadowManager;
    }

    /**
     * [KO] 씬에 바인딩되어 실행 중인 물리 시뮬레이션 엔진 플러그인을 가져오거나 설정합니다.
     * [EN] Gets or sets the physics simulation engine plugin running and bound to the scene.
     */
    get physicsEngine(): IPhysicsEngine {
        return this.#physicsEngine;
    }

    set physicsEngine(value: IPhysicsEngine) {
        this.#physicsEngine = value;
    }

    /**
     * [KO] 씬 배경색(ColorRGBA) 인스턴스를 가져오거나 설정합니다. 반드시 ColorRGBA 인스턴스를 대입해야 합니다.
     * [EN] Gets or sets the background color (ColorRGBA) instance of the scene. Must be assigned a valid ColorRGBA instance.
     */
    get backgroundColor(): ColorRGBA {
        return this.#backgroundColor;
    }

    set backgroundColor(value: ColorRGBA) {
        if (!(value instanceof ColorRGBA)) consoleAndThrowError('allow only ColorRGBA instance')
        this.#backgroundColor = value;
    }

    /**
     * [KO] 씬 배경색 사용 여부를 가져오거나 설정합니다. true일 때 지정된 backgroundColor 수치로 지우기가 수행됩니다.
     * [EN] Gets or sets whether to apply the scene background color. When true, clearing is performed with the specified backgroundColor value.
     */
    get useBackgroundColor(): boolean {
        return this.#useBackgroundColor;
    }

    set useBackgroundColor(value: boolean) {
        this.#useBackgroundColor = value;
    }
}

export default Scene
