import consoleAndThrowError from "../../utils/consoleAndThrowError";
import AmbientLight from "../lights/AmbientLight";
import DirectionalLight from "../lights/DirectionalLight";
import PointLight from "../lights/PointLight";
import SpotLight from "../lights/SpotLight";
import PassClustersLightHelper from "../clusterLight/core/PassClustersLightHelper";

/**
 * [KO] 씬(`Scene`) 내의 모든 조명을 통합 관리하는 매니저 클래스입니다.
 * [EN] Manager class that integrates and manages all lights within a `Scene`.
 *
 * [KO] 방향광(`DirectionalLight`), 포인트 조명(`PointLight`), 스포트 조명(`SpotLight`), 환경광(`AmbientLight`)의 추가, 제거 및 최대 개수 제한을 관리하며, `Scene` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Manages the addition, removal, and maximum count limits of `DirectionalLight`, `PointLight`, `SpotLight`, and `AmbientLight`, and is automatically created internally when a `Scene` is created.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Scene 인스턴스를 통해 LightManager에 접근
 * // [EN] Access LightManager through a Scene instance
 * const lightManager = scene.lightManager;
 *
 * // [KO] 방향광 및 환경광 설정
 * // [EN] Configure DirectionalLight and AmbientLight
 * const directionalLight = new RedGPU.Light.DirectionalLight();
 * lightManager.addDirectionalLight(directionalLight);
 * lightManager.ambientLight = new RedGPU.Light.AmbientLight();
 * ```
 *
 * @see [DirectionalLight Basic Example](/RedGPU/examples/3d/light/directionalLight/)
 * @see [PointLight Basic Example](/RedGPU/examples/3d/light/pointLight/)
 * @see [SpotLight Basic Example](/RedGPU/examples/3d/light/spotLight/)
 * @category Light
 */
class LightManager {
    #limitDirectionalLightCount: number = 3
    #limitClusterLightCount: number = PassClustersLightHelper.MAX_CLUSTER_LIGHTS
    #directionalLights: DirectionalLight[] = []
    #pointLights: PointLight[] = []
    #spotLights: SpotLight[] = []
    #ambientLight: AmbientLight

    /**
     * [KO] 등록된 스포트 조명(`SpotLight`) 목록을 반환합니다.
     * [EN] Returns the list of registered `SpotLight` instances.
     *
     * @returns
     * [KO] `SpotLight` 배열
     * [EN] Array of `SpotLight` instances
     */
    get spotLights(): SpotLight[] {
        return this.#spotLights;
    }

    /**
     * [KO] 현재 등록된 스포트 조명의 개수를 반환합니다.
     * [EN] Returns the number of currently registered spot lights.
     *
     * @returns
     * [KO] 스포트 조명 개수
     * [EN] Number of spot lights
     */
    get spotLightCount(): number {
        return this.#spotLights.length
    }

    /**
     * [KO] 씬에서 사용 가능한 최대 클러스터 조명(포인트 + 스포트) 개수를 반환합니다.
     * [EN] Returns the maximum number of cluster lights (point + spot) available in the scene.
     *
     * @returns
     * [KO] 최대 클러스터 조명 개수
     * [EN] Maximum number of cluster lights
     */
    get limitClusterLightCount(): number {
        return this.#limitClusterLightCount;
    }

    /**
     * [KO] 등록된 포인트 조명(`PointLight`) 목록을 반환합니다.
     * [EN] Returns the list of registered `PointLight` instances.
     *
     * @returns
     * [KO] `PointLight` 배열
     * [EN] Array of `PointLight` instances
     */
    get pointLights(): PointLight[] {
        return this.#pointLights;
    }

    /**
     * [KO] 현재 등록된 포인트 조명의 개수를 반환합니다.
     * [EN] Returns the number of currently registered point lights.
     *
     * @returns
     * [KO] 포인트 조명 개수
     * [EN] Number of point lights
     */
    get pointLightCount(): number {
        return this.#pointLights.length
    }

    /**
     * [KO] 씬에서 사용 가능한 최대 방향광(`DirectionalLight`) 개수를 반환합니다.
     * [EN] Returns the maximum number of `DirectionalLight` instances available in the scene.
     *
     * @returns
     * [KO] 최대 방향광 개수
     * [EN] Maximum number of directional lights
     */
    get limitDirectionalLightCount(): number {
        return this.#limitDirectionalLightCount;
    }

    /**
     * [KO] 현재 등록된 방향광의 개수를 반환합니다.
     * [EN] Returns the number of currently registered directional lights.
     *
     * @returns
     * [KO] 방향광 개수
     * [EN] Number of directional lights
     */
    get directionalLightCount(): number {
        return this.#directionalLights.length;
    }

    /**
     * [KO] 등록된 방향광(`DirectionalLight`) 목록을 반환합니다.
     * [EN] Returns the list of registered `DirectionalLight` instances.
     *
     * @returns
     * [KO] `DirectionalLight` 배열
     * [EN] Array of `DirectionalLight` instances
     */
    get directionalLights(): DirectionalLight[] {
        return this.#directionalLights;
    }

    /**
     * [KO] 씬의 환경광(`AmbientLight`)을 가져오거나 설정합니다.
     * [EN] Gets or sets the `AmbientLight` of the scene.
     *
     * ### Example
     * ```typescript
     * // [KO] 환경광 설정
     * // [EN] Set AmbientLight
     * scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ADD8E6', 50);
     * ```
     *
     * @returns
     * [KO] `AmbientLight` 인스턴스
     * [EN] `AmbientLight` instance
     */
    get ambientLight(): AmbientLight {
        return this.#ambientLight;
    }

    set ambientLight(value: AmbientLight) {
        if (!(value instanceof AmbientLight)) consoleAndThrowError('allow only AmbientLight instance')
        this.#ambientLight = value;
    }

    /**
     * [KO] 스포트 조명(`SpotLight`)을 씬에 추가합니다.
     * [EN] Adds a `SpotLight` to the scene.
     *
     * ### Example
     * ```typescript
     * // [KO] 스포트 조명 생성 및 추가
     * // [EN] Create and add a SpotLight
     * const spotLight = new RedGPU.Light.SpotLight('#ffffff', 1000);
     * scene.lightManager.addSpotLight(spotLight);
     * ```
     *
     * @param value -
     * [KO] 추가할 `SpotLight` 인스턴스
     * [EN] `SpotLight` instance to add
     */
    addSpotLight(value: SpotLight) {
        if (!(value instanceof SpotLight)) consoleAndThrowError('allow only SpotLight instance')
        const isOverLimit = this.#spotLights.length + this.#pointLights.length >= this.#limitClusterLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
        }
        this.#spotLights.push(value)
    }

    /**
     * [KO] 포인트 조명(`PointLight`)을 씬에 추가합니다.
     * [EN] Adds a `PointLight` to the scene.
     *
     * ### Example
     * ```typescript
     * // [KO] 포인트 조명 생성 및 추가
     * // [EN] Create and add a PointLight
     * const pointLight = new RedGPU.Light.PointLight('#ffffff', 1000);
     * scene.lightManager.addPointLight(pointLight);
     * ```
     *
     * @param value -
     * [KO] 추가할 `PointLight` 인스턴스
     * [EN] `PointLight` instance to add
     */
    addPointLight(value: PointLight) {
        if (!(value instanceof PointLight)) consoleAndThrowError('allow only PointLight instance')
        const isOverLimit = this.#spotLights.length + this.#pointLights.length >= this.#limitClusterLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
        }
        this.#pointLights.push(value)
    }

    /**
     * [KO] 방향광(`DirectionalLight`)을 씬에 추가합니다.
     * [EN] Adds a `DirectionalLight` to the scene.
     *
     * ### Example
     * ```typescript
     * // [KO] 방향광 생성 및 추가
     * // [EN] Create and add a DirectionalLight
     * const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 100000);
     * scene.lightManager.addDirectionalLight(directionalLight);
     * ```
     *
     * @param value -
     * [KO] 추가할 `DirectionalLight` 인스턴스
     * [EN] `DirectionalLight` instance to add
     */
    addDirectionalLight(value: DirectionalLight) {
        if (!(value instanceof DirectionalLight)) consoleAndThrowError('allow only DirectionalLight instance')
        const isOverLimit = this.#directionalLights.length >= this.#limitDirectionalLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more directional lights. The limit has been reached.');
        }
        this.#directionalLights.push(value)
    }

    /**
     * [KO] 특정 스포트 조명(`SpotLight`)을 씬에서 제거합니다.
     * [EN] Removes a specific `SpotLight` from the scene.
     *
     * @param value -
     * [KO] 제거할 `SpotLight` 인스턴스
     * [EN] `SpotLight` instance to remove
     */
    removeSpotLight(value: SpotLight) {
        const index = this.#spotLights.indexOf(value);
        if (index !== -1) this.#spotLights.splice(index, 1);
    }

    /**
     * [KO] 특정 포인트 조명(`PointLight`)을 씬에서 제거합니다.
     * [EN] Removes a specific `PointLight` from the scene.
     *
     * @param value -
     * [KO] 제거할 `PointLight` 인스턴스
     * [EN] `PointLight` instance to remove
     */
    removePointLight(value: PointLight) {
        const index = this.#pointLights.indexOf(value);
        if (index !== -1) this.#pointLights.splice(index, 1);
    }

    /**
     * [KO] 특정 방향광(`DirectionalLight`)을 씬에서 제거합니다.
     * [EN] Removes a specific `DirectionalLight` from the scene.
     *
     * @param value -
     * [KO] 제거할 `DirectionalLight` 인스턴스
     * [EN] `DirectionalLight` instance to remove
     */
    removeDirectionalLight(value: DirectionalLight) {
        const index = this.#directionalLights.indexOf(value);
        if (index !== -1) this.#directionalLights.splice(index, 1);
    }

    /**
     * [KO] 등록된 모든 스포트 조명을 제거합니다.
     * [EN] Removes all registered spot lights.
     */
    removeAllSpotLight() {
        this.#spotLights = [];
    }

    /**
     * [KO] 등록된 모든 포인트 조명을 제거합니다.
     * [EN] Removes all registered point lights.
     */
    removeAllPointLight() {
        this.#pointLights = [];
    }

    /**
     * [KO] 등록된 모든 방향광을 제거합니다.
     * [EN] Removes all registered directional lights.
     */
    removeAllDirectionalLight() {
        this.#directionalLights = [];
    }

    /**
     * [KO] 환경광을 포함한 씬 내의 모든 조명을 제거합니다.
     * [EN] Removes all lights in the scene, including the ambient light.
     */
    removeAllLight() {
        this.removeAllPointLight()
        this.removeAllSpotLight()
        this.removeAllDirectionalLight()
        this.#ambientLight = null
    }

    /**
     * [KO] LightManager 인스턴스를 파기하고 등록된 모든 조명 및 디버거 리소스를 정리합니다.
     * [EN] Destroys the LightManager instance and cleans up all registered lights and debugger resources.
     */
    destroy() {
        this.#directionalLights.forEach(cleanupLight);
        this.#pointLights.forEach(cleanupLight);
        this.#spotLights.forEach(cleanupLight);
        cleanupLight(this.#ambientLight);

        this.#directionalLights.length = 0;
        this.#pointLights.length = 0;
        this.#spotLights.length = 0;
        this.#ambientLight = null;

        console.log("🧹 LightManager destroy 완료");
    }
}

const cleanupLight = (light: any) => {
    if (light?.drawDebugger) {
        try {
            light.drawDebugger.destroy();
        } catch (e) {
            // 예외 처리
        }
        light.drawDebugger = null;
    }
};
Object.freeze(LightManager)
export default LightManager