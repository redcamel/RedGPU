import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/core/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import {IPhysicsEngine} from "../../physics/IPhysicsEngine";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import Object3DContainer from "../mesh/core/Object3DContainer";
import Terrain from "../terrain/Terrain";
import Landscape from "../landscape/core/Landscape";

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

    #terrainChildren: Terrain[] = []
    #landscapeChildren: Landscape[] = []

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

    get terrainChildren(): Terrain[] {
        return this.#terrainChildren;
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

    #checkTerrainInstance(target: Terrain) {
        if (!(target instanceof Terrain)) {
            consoleAndThrowError('allow only Terrain instance.');
        }
    }
}

export default Scene;
