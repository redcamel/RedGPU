import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import { IPhysicsEngine } from "../../physics/IPhysicsEngine";
import Object3DContainer from "../mesh/core/Object3DContainer";
/**
 * [KO] View에서 렌더링할 장면을 구성하는 공간 클래스입니다.
 * [EN] Space class that constitutes the scene to be rendered in a View.
 *
 * [KO] 조명, 그림자, 배경색 등의 설정을 포함하며, 모든 시각적 객체의 루트 컨테이너로 작동합니다. View3D 또는 View2D와 연결되어 화면에 출력되는 대상입니다.
 * [EN] It includes settings for lights, shadows, background color, etc., and acts as the root container for all visual objects. It is the target connected to View3D or View2D and output to the screen.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/scene/" ></iframe>
 *
 * @category Scene
 */
declare class Scene extends Object3DContainer {
    #private;
    /**
     * [KO] Scene 생성자
     * [EN] Scene constructor
     * @example
     * ```typescript
     * const scene = new RedGPU.Display.Scene('MyScene');
     * ```
     * @param name -
     * [KO] Scene의 이름 (선택적)
     * [EN] Name of the scene (optional)
     */
    constructor(name?: string);
    /**
     * [KO] 씬 내의 모든 조명을 통합 관리하는 LightManager를 반환합니다.
     * [EN] Returns the LightManager that manages all lights within the scene.
     * @returns
     * [KO] LightManager 인스턴스
     * [EN] LightManager instance
     */
    get lightManager(): LightManager;
    /**
     * [KO] 씬 내의 모든 그림자를 통합 관리하는 ShadowManager를 반환합니다.
     * [EN] Returns the ShadowManager that manages all shadows within the scene.
     * @returns
     * [KO] ShadowManager 인스턴스
     * [EN] ShadowManager instance
     */
    get shadowManager(): ShadowManager;
    /**
     * [KO] 씬에 설정된 물리 엔진을 반환합니다.
     * [EN] Returns the physics engine set for the scene.
     * @returns
     * [KO] 물리 엔진 인스턴스
     * [EN] Physics engine instance
     */
    get physicsEngine(): IPhysicsEngine;
    /**
     * [KO] 씬에 물리 엔진을 설정합니다.
     * [EN] Sets the physics engine for the scene.
     * @param value -
     * [KO] 물리 엔진 플러그인
     * [EN] Physics engine plugin
     */
    set physicsEngine(value: IPhysicsEngine);
    /**
     * [KO] 씬의 이름을 반환합니다.
     * [EN] Returns the scene name.
     * @returns
     * [KO] 씬 이름
     * [EN] Scene name
     */
    get name(): string;
    /**
     * [KO] 씬의 이름을 설정합니다.
     * [EN] Sets the scene name.
     * @param value -
     * [KO] 설정할 이름
     * [EN] Name to set
     */
    set name(value: string);
    /**
     * [KO] 씬의 배경색을 반환합니다.
     * [EN] Returns the background color of the scene.
     * @returns
     * [KO] 배경색 (ColorRGBA)
     * [EN] Background color (ColorRGBA)
     */
    get backgroundColor(): ColorRGBA;
    /**
     * [KO] 씬의 배경색을 설정합니다.
     * [EN] Sets the background color of the scene.
     * @param value -
     * [KO] 설정할 ColorRGBA 객체
     * [EN] ColorRGBA object to set
     * @throws
     * [KO] value가 ColorRGBA 인스턴스가 아닐 경우 에러 발생
     * [EN] Throws error if value is not an instance of ColorRGBA
     */
    set backgroundColor(value: ColorRGBA);
    /**
     * [KO] 배경색 사용 여부를 반환합니다.
     * [EN] Returns whether to use the background color.
     * @returns
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    get useBackgroundColor(): boolean;
    /**
     * [KO] 배경색 사용 여부를 설정합니다.
     * [EN] Sets whether to use the background color.
     * @param value -
     * [KO] 사용 여부
     * [EN] Whether to use
     */
    set useBackgroundColor(value: boolean);
}
export default Scene;
