import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/core/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import { IPhysicsEngine } from "../../physics/IPhysicsEngine";
import Object3DContainer from "../mesh/core/Object3DContainer";
import Landscape from "../landscape/core/Landscape";
/**
 * [KO] View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.
 * [EN] Root container class that defines the space of a scene to be rendered in a View.
 */
declare class Scene extends Object3DContainer {
    #private;
    constructor();
    get lightManager(): LightManager;
    get shadowManager(): ShadowManager;
    get physicsEngine(): IPhysicsEngine;
    set physicsEngine(value: IPhysicsEngine);
    get backgroundColor(): ColorRGBA;
    set backgroundColor(value: ColorRGBA);
    get useBackgroundColor(): boolean;
    set useBackgroundColor(value: boolean);
    /**
     * [KO] 씬에 바인딩된 Landscape 지형 객체 리스트를 반환합니다.
     * [EN] Returns the list of Landscape terrain objects bound to the scene.
     */
    get landscapeChildren(): Landscape[];
    /**
     * [KO] Landscape 지형 시스템 객체를 씬 지형 리스트에 추가합니다.
     * [EN] Adds a Landscape terrain system object to the scene's terrain list.
     */
    addLandscape(landscape: Landscape): void;
    /**
     * [KO] 씬에서 Landscape 지형 시스템 객체를 제거합니다.
     * [EN] Removes a Landscape terrain system object from the scene.
     */
    removeLandscape(landscape: Landscape): void;
}
export default Scene;
