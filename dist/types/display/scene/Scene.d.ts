import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import WindManager from "../../wind/WindManager";
import { IPhysicsEngine } from "../../physics/IPhysicsEngine";
import Object3DContainer from "../mesh/core/Object3DContainer";
import Landscape from "../../landscape/Landscape";
import type Lake from "../../water/Lake";
/**
 * [KO] View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.
 * [EN] Root container class that defines the scene space to be rendered in a View.
 *
 * [KO] 조명(LightManager), 그림자(ShadowManager), 바람(WindManager), 물리 엔진(IPhysicsEngine), 지형(Landscape), 수체(Lake) 및 3D 디스플레이 객체 계층을 통합 관리합니다.
 * [EN] Integrates and manages lighting (LightManager), shadows (ShadowManager), wind (WindManager), physics engine (IPhysicsEngine), terrain (Landscape), water bodies (Lake), and the 3D display object hierarchy.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * scene.useBackgroundColor = true;
 * scene.backgroundColor.setColorByHEX('#111111');
 * ```
 * @category Scene
 */
declare class Scene extends Object3DContainer {
    #private;
    /**
     * [KO] Scene 인스턴스를 생성합니다.
     * [EN] Creates a Scene instance.
     */
    constructor();
    /**
     * [KO] 씬의 조명을 관리하는 LightManager 인스턴스를 반환합니다.
     * [EN] Returns the LightManager instance that manages the lights of the scene.
     *
     * @returns
     * [KO] LightManager 인스턴스
     * [EN] LightManager instance
     */
    get lightManager(): LightManager;
    /**
     * [KO] 씬의 그림자를 관리하는 ShadowManager 인스턴스를 반환합니다.
     * [EN] Returns the ShadowManager instance that manages the shadows of the scene.
     *
     * @returns
     * [KO] ShadowManager 인스턴스
     * [EN] ShadowManager instance
     */
    get shadowManager(): ShadowManager;
    /**
     * [KO] 씬의 바람 물리 환경을 총괄하는 WindManager 인스턴스를 반환합니다.
     * [EN] Returns the WindManager instance governing the scene's atmospheric wind physics.
     *
     * @returns
     * [KO] WindManager 인스턴스
     * [EN] WindManager instance
     */
    get windManager(): WindManager;
    /**
     * [KO] 씬에 적용된 물리 엔진 인스턴스를 가져오거나 설정합니다.
     * [EN] Gets or sets the physics engine instance applied to the scene.
     *
     * @returns
     * [KO] 물리 엔진(IPhysicsEngine) 인스턴스
     * [EN] Physics engine (IPhysicsEngine) instance
     */
    get physicsEngine(): IPhysicsEngine;
    set physicsEngine(value: IPhysicsEngine);
    /**
     * [KO] 씬의 배경 색상을 나타내는 ColorRGBA 인스턴스를 가져오거나 설정합니다.
     * [EN] Gets or sets the ColorRGBA instance representing the background color of the scene.
     *
     * @returns
     * [KO] 배경 색상(ColorRGBA) 인스턴스
     * [EN] Background color (ColorRGBA) instance
     */
    get backgroundColor(): ColorRGBA;
    set backgroundColor(value: ColorRGBA);
    /**
     * [KO] 씬의 배경 색상 사용 여부를 가져오거나 설정합니다.
     * [EN] Gets or sets whether to use the background color of the scene.
     *
     * @returns
     * [KO] 배경 색상 사용 여부
     * [EN] Whether background color is used
     */
    get useBackgroundColor(): boolean;
    set useBackgroundColor(value: boolean);
    /**
     * [KO] 씬에 바인딩된 지형(Landscape) 객체를 가져오거나 설정합니다. `null` 전달 시 지형이 해제됩니다.
     * [EN] Gets or sets the Landscape terrain object bound to the scene. Passing `null` unbinds the terrain.
     *
     * @returns
     * [KO] 바인딩된 Landscape 인스턴스 또는 `null`
     * [EN] Bound Landscape instance or `null`
     */
    get landscape(): Landscape | null;
    set landscape(val: Landscape | null);
    /**
     * [KO] 씬에 바인딩된 수체(Lake) 객체 리스트를 반환합니다.
     * [EN] Returns the list of Lake objects bound to the scene.
     *
     * @returns
     * [KO] 등록된 Lake 인스턴스 배열
     * [EN] Array of registered Lake instances
     */
    get waterChildren(): Lake[];
    /**
     * [KO] 수체 객체(Lake)를 씬 수체 리스트에 등록하고 자식 노드로 추가합니다.
     * [EN] Registers a Lake object to the scene water list and adds it as a child node.
     *
     * @param water -
     * [KO] 등록할 Lake 인스턴스
     * [EN] Lake instance to register
     */
    addWater(water: Lake): void;
    /**
     * [KO] 씬에서 수체 객체(Lake)를 제거합니다.
     * [EN] Removes a Lake object from the scene.
     *
     * @param water -
     * [KO] 제거할 Lake 인스턴스
     * [EN] Lake instance to remove
     */
    removeWater(water: Lake): void;
    /**
     * [KO] 씬과 내부 관리 리소스를 해제하고 파괴합니다.
     * [EN] Releases and destroys the scene and its internal managed resources.
     */
    destroy(): void;
}
export default Scene;
