import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/core/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import {IPhysicsEngine} from "../../physics/IPhysicsEngine";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import Object3DContainer from "../mesh/core/Object3DContainer";
import Landscape from "../landscape/core/Landscape";
import type WaterLake from "../water/lake/WaterLake";

/**
 * [KO] View에서 렌더링할 장면(Scene) 공간을 정의하는 루트 컨테이너 클래스입니다.
 * [EN] Root container class that defines the space of a scene to be rendered in a View.
 */
class Scene extends Object3DContainer {
    #backgroundColor: ColorRGBA = new ColorRGBA()
    #useBackgroundColor: boolean = false
    #lightManager: LightManager = new LightManager()
    #shadowManager: ShadowManager = new ShadowManager()
    #physicsEngine: IPhysicsEngine
    #destroyed: boolean = false

    #landscapeChildren: Landscape[] = []
    #waterChildren: WaterLake[] = []

    constructor() {
        super();
    }

    get lightManager(): LightManager {
        return this.#lightManager;
    }

    get shadowManager(): ShadowManager {
        return this.#shadowManager;
    }

    get physicsEngine(): IPhysicsEngine {
        return this.#physicsEngine;
    }

    set physicsEngine(value: IPhysicsEngine) {
        this.#physicsEngine = value;
    }

    get backgroundColor(): ColorRGBA {
        return this.#backgroundColor;
    }

    set backgroundColor(value: ColorRGBA) {
        if (!(value instanceof ColorRGBA)) consoleAndThrowError('allow only ColorRGBA instance')
        this.#backgroundColor = value;
    }

    get useBackgroundColor(): boolean {
        return this.#useBackgroundColor;
    }

    set useBackgroundColor(value: boolean) {
        this.#useBackgroundColor = value;
    }

    /**
     * [KO] 씬에 바인딩된 Landscape 지형 객체 리스트를 반환합니다.
     * [EN] Returns the list of Landscape terrain objects bound to the scene.
     */
    get landscapeChildren(): Landscape[] {
        return this.#landscapeChildren;
    }

    /**
     * [KO] Landscape 지형 시스템 객체를 씬 지형 리스트에 추가합니다.
     * [EN] Adds a Landscape terrain system object to the scene's terrain list.
     */
    addLandscape(landscape: Landscape): void {
        this.#checkLandscapeInstance(landscape);
        if (!this.#landscapeChildren.includes(landscape)) {
            this.#landscapeChildren.push(landscape);
        }
    }

    /**
     * [KO] 씬에서 Landscape 지형 시스템 객체를 제거합니다.
     * [EN] Removes a Landscape terrain system object from the scene.
     */
    removeLandscape(landscape: Landscape): void {
        this.#checkLandscapeInstance(landscape);
        const index = this.#landscapeChildren.indexOf(landscape);
        if (index > -1) {
            this.#landscapeChildren.splice(index, 1);
        }
    }

    #checkLandscapeInstance(target: Landscape) {
        if (!(target instanceof Landscape)) {
            consoleAndThrowError('allow only Landscape instance.');
        }
    }

    /**
     * [KO] 씬에 바인딩된 수체(Water) 객체 리스트를 반환합니다.
     * [EN] Returns the list of Water objects bound to the scene.
     */
    get waterChildren(): WaterLake[] {
        return this.#waterChildren;
    }

    /**
     * [KO] 수체 객체(WaterLake 등)를 씬 수체 리스트에 등록하고 자식으로 편입합니다.
     * [EN] Registers a Water object to the scene water list and adds it as a child.
     */
    addWater(water: WaterLake): void {
        this.#checkWaterInstance(water);
        if (!this.#waterChildren.includes(water)) {
            this.#waterChildren.push(water);
            if (!this.children.includes(water as any)) {
                this.addChild(water as any);
            }
        }
    }

    /**
     * [KO] 씬에서 수체 객체를 제거합니다.
     * [EN] Removes a Water object from the scene.
     */
    removeWater(water: WaterLake): void {
        this.#checkWaterInstance(water);
        const index = this.#waterChildren.indexOf(water);
        if (index > -1) {
            this.#waterChildren.splice(index, 1);
            this.removeChild(water as any);
        }
    }

    #checkWaterInstance(target: WaterLake) {
        if (!target || !(target as any).isWater) {
            consoleAndThrowError('allow only WaterLake instance.');
        }
    }
}

export default Scene;
