import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/core/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import WindManager from "../../wind/WindManager";
import { IPhysicsEngine } from "../../physics/IPhysicsEngine";
import Object3DContainer from "../mesh/core/Object3DContainer";
import Landscape from "../../landscape/Landscape";
import type WaterLake from "../../water/lake/WaterLake";
/**
 * [KO] View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.
 * [EN] Root container class that defines the space of a scene to be rendered in a View.
 */
declare class Scene extends Object3DContainer {
    #private;
    constructor();
    get lightManager(): LightManager;
    get shadowManager(): ShadowManager;
    /**
     * [KO] 씬의 바람 물리 환경을 총괄하는 WindManager 인스턴스를 반환합니다.
     * [EN] Returns the WindManager instance governing the scene's atmospheric wind physics.
     */
    get windManager(): WindManager;
    get physicsEngine(): IPhysicsEngine;
    set physicsEngine(value: IPhysicsEngine);
    get backgroundColor(): ColorRGBA;
    set backgroundColor(value: ColorRGBA);
    get useBackgroundColor(): boolean;
    set useBackgroundColor(value: boolean);
    /**
     * [KO] 씬에 바인딩된 지형(Landscape) 객체를 가져옵니다.
     * [EN] Gets the Landscape terrain object bound to the scene.
     */
    get landscape(): Landscape | null;
    /**
     * [KO] 씬에 바인딩할 지형(Landscape) 객체를 설정합니다. `null` 전달 시 지형이 해제됩니다.
     * [EN] Sets the Landscape terrain object bound to the scene. Passing `null` unbinds the terrain.
     */
    set landscape(val: Landscape | null);
    /**
     * [KO] 씬에 바인딩된 수체(Water) 객체 리스트를 반환합니다.
     * [EN] Returns the list of Water objects bound to the scene.
     */
    get waterChildren(): WaterLake[];
    /**
     * [KO] 수체 객체(WaterLake 등)를 씬 수체 리스트에 등록하고 자식으로 편입합니다.
     * [EN] Registers a Water object to the scene water list and adds it as a child.
     */
    addWater(water: WaterLake): void;
    /**
     * [KO] 씬에서 수체 객체를 제거합니다.
     * [EN] Removes a Water object from the scene.
     */
    removeWater(water: WaterLake): void;
    destroy(): void;
}
export default Scene;
