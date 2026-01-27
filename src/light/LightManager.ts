import {mat4, vec3} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import View3D from "../display/view/View3D";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import PassClustersLightHelper from "./clusterLight/PassClustersLightHelper";
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";

/**
 * [KO] 씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
 * [EN] Class that manages all lights within a scene.
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다. <br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system. <br/> Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // 씬에서 라이트 매니저 접근 (Access light manager from scene)
 * const lightManager = scene.lightManager;
 *
 * // 조명 추가 예시 (Example of adding a light)
 * lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
 * ```
 *
 * @category Light
 */
class LightManager {
    /**
     * [KO] 방향성 조명의 최대 허용 개수입니다.
     * [EN] Maximum allowable count for directional lights.
     * @defaultValue 3
     * @private
     */
    #limitDirectionalLightCount: number = 3
    /**
     * [KO] 클러스터 조명(Point + Spot)의 최대 허용 개수입니다.
     * [EN] Maximum allowable count for cluster lights (Point + Spot).
     * @defaultValue PassClustersLightHelper.MAX_CLUSTER_LIGHTS
     * @private
     */
    #limitClusterLightCount: number = PassClustersLightHelper.MAX_CLUSTER_LIGHTS
    /**
     * [KO] 등록된 방향성 조명 목록입니다.
     * [EN] List of registered directional lights.
     * @private
     */
    #directionalLights: DirectionalLight[] = []
    /**
     * [KO] 등록된 포인트 조명 목록입니다.
     * [EN] List of registered point lights.
     * @private
     */
    #pointLights: PointLight[] = []
    /**
     * [KO] 등록된 스포트 조명 목록입니다.
     * [EN] List of registered spot lights.
     * @private
     */
    #spotLights: SpotLight[] = []
    /**
     * [KO] 장면의 환경광(Ambient Light) 인스턴스입니다.
     * [EN] Ambient Light instance of the scene.
     * @private
     */
    #ambientLight: AmbientLight
    /**
     * [KO] 방향성 조명의 투영 행렬 계산에 사용되는 내부 캐시 행렬입니다.
     * [EN] Internal cache matrix used for calculating the projection matrix of directional lights.
     * @private
     */
    #lightProjectionMatrix: mat4 = mat4.create()

    /**
     * [KO] 등록된 스포트 조명 배열을 반환합니다.
     * [EN] Returns the array of registered spot lights.
     *
     * @returns
     * [KO] 등록된 SpotLight 배열
     * [EN] Array of registered SpotLights
     */
    get spotLights(): SpotLight[] {
        return this.#spotLights;
    }

    /**
     * [KO] 등록된 스포트 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered spot lights.
     *
     * @returns
     * [KO] 스포트 조명 개수
     * [EN] Number of spot lights
     */
    get spotLightCount(): number {
        return this.#spotLights.length
    }

    /**
     * [KO] 클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.
     * [EN] Returns the maximum allowable count for cluster lights (Point + Spot).
     *
     * @returns
     * [KO] 클러스터 조명 최대 개수
     * [EN] Maximum number of cluster lights
     */
    get limitClusterLightCount(): number {
        return this.#limitClusterLightCount;
    }

    /**
     * [KO] 등록된 포인트 조명 배열을 반환합니다.
     * [EN] Returns the array of registered point lights.
     *
     * @returns
     * [KO] 등록된 PointLight 배열
     * [EN] Array of registered PointLights
     */
    get pointLights(): PointLight[] {
        return this.#pointLights;
    }

    /**
     * [KO] 등록된 포인트 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered point lights.
     *
     * @returns
     * [KO] 포인트 조명 개수
     * [EN] Number of point lights
     */
    get pointLightCount(): number {
        return this.#pointLights.length
    }

    /**
     * [KO] 방향성 조명의 최대 허용 개수를 반환합니다.
     * [EN] Returns the maximum allowable count for directional lights.
     *
     * @returns
     * [KO] 방향성 조명 최대 개수
     * [EN] Maximum number of directional lights
     */
    get limitDirectionalLightCount(): number {
        return this.#limitDirectionalLightCount;
    }

    /**
     * [KO] 등록된 방향성 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered directional lights.
     *
     * @returns
     * [KO] 방향성 조명 개수
     * [EN] Number of directional lights
     */
    get directionalLightCount(): number {
        return this.#directionalLights.length;
    }

    /**
     * [KO] 등록된 방향성 조명 배열을 반환합니다.
     * [EN] Returns the array of registered directional lights.
     *
     * @returns
     * [KO] 등록된 DirectionalLight 배열
     * [EN] Array of registered DirectionalLights
     */
    get directionalLights(): DirectionalLight[] {
        return this.#directionalLights;
    }

    /**
     * [KO] 현재 설정된 환경광(AmbientLight)을 반환합니다.
     * [EN] Returns the currently set AmbientLight.
     *
     * @returns
     * [KO] AmbientLight 인스턴스 또는 null
     * [EN] AmbientLight instance or null
     */
    get ambientLight(): AmbientLight {
        return this.#ambientLight;
    }

    /**
     * [KO] 환경광(AmbientLight)을 설정합니다.
     * [EN] Sets the AmbientLight.
     *
     * @param value -
     * [KO] 설정할 AmbientLight 인스턴스
     * [EN] AmbientLight instance to set
     * @throws
     * [KO] AmbientLight 인스턴스가 아닌 값을 전달하면 오류를 던집니다.
     * [EN] Throws an error if a value that is not an AmbientLight instance is passed.
     */
    set ambientLight(value: AmbientLight) {
        if (!(value instanceof AmbientLight)) consoleAndThrowError('allow only AmbientLight instance')
        this.#ambientLight = value;
    }

    /**
     * [KO] SpotLight를 추가합니다.
     * [EN] Adds a SpotLight.
     *
     * * ### Example
     * ```typescript
     * scene.lightManager.addSpotLight(new RedGPU.Light.SpotLight());
     * ```
     *
     * @param value -
     * [KO] 추가할 SpotLight 인스턴스
     * [EN] SpotLight instance to add
     * @throws
     * [KO] PointLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
     * [EN] Throws an error if the total count combined with PointLights exceeds the cluster limit.
     */
    addSpotLight(value: SpotLight) {
        if (!(value instanceof SpotLight)) consoleAndThrowError('allow only SpotLight instance')
        const isOverLimit = this.#spotLights.length + this.#pointLights.length > this.#limitClusterLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
        }
        this.#spotLights.push(value)
    }

    /**
     * [KO] PointLight를 추가합니다.
     * [EN] Adds a PointLight.
     *
     * * ### Example
     * ```typescript
     * scene.lightManager.addPointLight(new RedGPU.Light.PointLight());
     * ```
     *
     * @param value -
     * [KO] 추가할 PointLight 인스턴스
     * [EN] PointLight instance to add
     * @throws
     * [KO] SpotLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
     * [EN] Throws an error if the total count combined with SpotLights exceeds the cluster limit.
     */
    addPointLight(value: PointLight) {
        if (!(value instanceof PointLight)) consoleAndThrowError('allow only PointLight instance')
        const isOverLimit = this.#spotLights.length + this.#pointLights.length > this.#limitClusterLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
        }
        this.#pointLights.push(value)
    }

    /**
     * [KO] DirectionalLight를 추가합니다.
     * [EN] Adds a DirectionalLight.
     *
     * * ### Example
     * ```typescript
     * scene.lightManager.addDirectionalLight(new RedGPU.Light.DirectionalLight());
     * ```
     *
     * @param value -
     * [KO] 추가할 DirectionalLight 인스턴스
     * [EN] DirectionalLight instance to add
     * @throws
     * [KO] 최대 방향성 조명 개수를 초과하면 오류를 던집니다.
     * [EN] Throws an error if the maximum number of directional lights is exceeded.
     */
    addDirectionalLight(value: DirectionalLight) {
        if (!(value instanceof DirectionalLight)) consoleAndThrowError('allow only DirectionalLight instance')
        const isOverLimit = this.#directionalLights.length > this.#limitDirectionalLightCount;
        if (isOverLimit) {
            consoleAndThrowError('Cannot add more directional lights. The limit has been reached.');
        }
        this.#directionalLights.push(value)
    }

    /**
     * [KO] 특정 SpotLight를 제거합니다.
     * [EN] Removes a specific SpotLight.
     *
     * @param value -
     * [KO] 제거할 SpotLight 인스턴스
     * [EN] SpotLight instance to remove
     */
    removeSpotLight(value: SpotLight) {
        const index = this.#spotLights.indexOf(value);
        if (index !== -1) this.#spotLights.splice(index, 1);
    }

    /**
     * [KO] 특정 PointLight를 제거합니다.
     * [EN] Removes a specific PointLight.
     *
     * @param value -
     * [KO] 제거할 PointLight 인스턴스
     * [EN] PointLight instance to remove
     */
    removePointLight(value: PointLight) {
        const index = this.#pointLights.indexOf(value);
        if (index !== -1) this.#pointLights.splice(index, 1);
    }

    /**
     * [KO] 특정 DirectionalLight를 제거합니다.
     * [EN] Removes a specific DirectionalLight.
     *
     * @param value -
     * [KO] 제거할 DirectionalLight 인스턴스
     * [EN] DirectionalLight instance to remove
     */
    removeDirectionalLight(value: DirectionalLight) {
        const index = this.#directionalLights.indexOf(value);
        if (index !== -1) this.#directionalLights.splice(index, 1);
    }

    /**
     * [KO] 모든 SpotLight를 제거합니다.
     * [EN] Removes all SpotLights.
     */
    removeAllSpotLight() {
        this.#spotLights = [];
    }

    /**
     * [KO] 모든 PointLight를 제거합니다.
     * [EN] Removes all PointLights.
     */
    removeAllPointLight() {
        this.#pointLights = [];
    }

    /**
     * [KO] 모든 DirectionalLight를 제거합니다.
     * [EN] Removes all DirectionalLights.
     */
    removeAllDirectionalLight() {
        this.#directionalLights = [];
    }

    /**
     * [KO] 장면의 모든 조명을 제거합니다.
     * [EN] Removes all lights in the scene.
     *
     * [KO] 포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.
     * [EN] Removes all point, spot, and directional lights, and sets ambient light to null.
     */
    removeAllLight() {
        this.removeAllPointLight()
        this.removeAllSpotLight()
        this.removeAllDirectionalLight()
        this.#ambientLight = null
    }

    /**
     * [KO] 방향성 조명의 투영-뷰 행렬을 반환합니다.
     * [EN] Returns the projection-view matrix of the directional light.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @returns
     * [KO] mat4 투영-뷰 행렬
     * [EN] mat4 projection-view matrix
     * @private
     */
    getDirectionalLightProjectionViewMatrix(view: View3D): mat4 {
        return mat4.multiply(mat4.create(), this.getDirectionalLightProjectionMatrix(view), this.getDirectionalLightViewMatrix(view));
    }

    /**
     * [KO] 방향성 조명의 투영(orthographic) 행렬을 계산하여 반환합니다.
     * [EN] Calculates and returns the projection (orthographic) matrix of the directional light.
     *
     * [KO] 카메라 위치와의 거리를 기반으로 ortho 영역( left, right, bottom, top, near, far )을 결정합니다.
     * [EN] Determines the ortho area (left, right, bottom, top, near, far) based on the distance from the camera position.
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @returns
     * [KO] mat4 투영 행렬
     * [EN] mat4 projection matrix
     * @private
     */
    getDirectionalLightProjectionMatrix(view: View3D): mat4 {
        const lightProjectionMatrix = mat4.create()
        const cameraPosition = view.rawCamera instanceof Camera2D ? vec3.fromValues(0, 0, 0) : vec3.fromValues(
            view.rawCamera.x,
            view.rawCamera.y,
            view.rawCamera.z
        );
        const distance = Math.max(vec3.distance(cameraPosition, vec3.create()), 1);
        const left = -distance
        const right = distance
        const bottom = -distance;
        const top = distance;
        const near = -distance * 3;
        const far = distance * 3;
        mat4.ortho(lightProjectionMatrix, left, right, bottom, top, near, far);
        return lightProjectionMatrix;
    }

    /**
     * [KO] 메인 방향성 조명의 뷰(lookAt) 행렬을 계산하여 반환합니다.
     * [EN] Calculates and returns the view (lookAt) matrix of the main directional light.
     *
     * [KO] 씬에서 첫 번째 DirectionalLight의 방향을 사용하여 라이트 위치를 계산하고, 원점(origin)을 바라보도록 합니다.
     * [EN] Calculates the light position using the direction of the first DirectionalLight in the scene and makes it look at the origin.
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @returns
     * [KO] mat4 뷰 행렬
     * [EN] mat4 view matrix
     * @private
     */
    getDirectionalLightViewMatrix(view: View3D): mat4 {
        mat4.identity(this.#lightProjectionMatrix)
        const cameraPosition = view.rawCamera instanceof Camera2D ? vec3.fromValues(0, 0, 0) : vec3.fromValues(
            view.rawCamera.x,
            view.rawCamera.y,
            view.rawCamera.z
        );
        const distance = Math.max(vec3.distance(cameraPosition, vec3.create()), 1)
        const upVector = vec3.fromValues(0, 1, 0);
        const origin = vec3.fromValues(0, 0, 0);
        const lightPosition = view.scene.lightManager.directionalLights.length ? vec3.fromValues(
            -view.scene.lightManager.directionalLights[0].direction[0] * distance,
            -view.scene.lightManager.directionalLights[0].direction[1] * distance,
            -view.scene.lightManager.directionalLights[0].direction[2] * distance
        ) : vec3.create();
        const lightViewMatrix = mat4.create()
        mat4.lookAt(lightViewMatrix, lightPosition, origin, upVector);
        return lightViewMatrix
    }
}

Object.freeze(LightManager)
export default LightManager