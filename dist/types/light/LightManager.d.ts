import { mat4 } from "gl-matrix";
import View3D from "../display/view/View3D";
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
declare class LightManager {
    #private;
    /**
     * [KO] 등록된 스포트 조명 배열을 반환합니다.
     * [EN] Returns the array of registered spot lights.
     *
     * @returns
     * [KO] 등록된 SpotLight 배열
     * [EN] Array of registered SpotLights
     */
    get spotLights(): SpotLight[];
    /**
     * [KO] 등록된 스포트 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered spot lights.
     *
     * @returns
     * [KO] 스포트 조명 개수
     * [EN] Number of spot lights
     */
    get spotLightCount(): number;
    /**
     * [KO] 클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.
     * [EN] Returns the maximum allowable count for cluster lights (Point + Spot).
     *
     * @returns
     * [KO] 클러스터 조명 최대 개수
     * [EN] Maximum number of cluster lights
     */
    get limitClusterLightCount(): number;
    /**
     * [KO] 등록된 포인트 조명 배열을 반환합니다.
     * [EN] Returns the array of registered point lights.
     *
     * @returns
     * [KO] 등록된 PointLight 배열
     * [EN] Array of registered PointLights
     */
    get pointLights(): PointLight[];
    /**
     * [KO] 등록된 포인트 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered point lights.
     *
     * @returns
     * [KO] 포인트 조명 개수
     * [EN] Number of point lights
     */
    get pointLightCount(): number;
    /**
     * [KO] 방향성 조명의 최대 허용 개수를 반환합니다.
     * [EN] Returns the maximum allowable count for directional lights.
     *
     * @returns
     * [KO] 방향성 조명 최대 개수
     * [EN] Maximum number of directional lights
     */
    get limitDirectionalLightCount(): number;
    /**
     * [KO] 등록된 방향성 조명의 개수를 반환합니다.
     * [EN] Returns the number of registered directional lights.
     *
     * @returns
     * [KO] 방향성 조명 개수
     * [EN] Number of directional lights
     */
    get directionalLightCount(): number;
    /**
     * [KO] 등록된 방향성 조명 배열을 반환합니다.
     * [EN] Returns the array of registered directional lights.
     *
     * @returns
     * [KO] 등록된 DirectionalLight 배열
     * [EN] Array of registered DirectionalLights
     */
    get directionalLights(): DirectionalLight[];
    /**
     * [KO] 현재 설정된 환경광(AmbientLight)을 반환합니다.
     * [EN] Returns the currently set AmbientLight.
     *
     * @returns
     * [KO] AmbientLight 인스턴스 또는 null
     * [EN] AmbientLight instance or null
     */
    get ambientLight(): AmbientLight;
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
    set ambientLight(value: AmbientLight);
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
    addSpotLight(value: SpotLight): void;
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
    addPointLight(value: PointLight): void;
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
    addDirectionalLight(value: DirectionalLight): void;
    /**
     * [KO] 특정 SpotLight를 제거합니다.
     * [EN] Removes a specific SpotLight.
     *
     * @param value -
     * [KO] 제거할 SpotLight 인스턴스
     * [EN] SpotLight instance to remove
     */
    removeSpotLight(value: SpotLight): void;
    /**
     * [KO] 특정 PointLight를 제거합니다.
     * [EN] Removes a specific PointLight.
     *
     * @param value -
     * [KO] 제거할 PointLight 인스턴스
     * [EN] PointLight instance to remove
     */
    removePointLight(value: PointLight): void;
    /**
     * [KO] 특정 DirectionalLight를 제거합니다.
     * [EN] Removes a specific DirectionalLight.
     *
     * @param value -
     * [KO] 제거할 DirectionalLight 인스턴스
     * [EN] DirectionalLight instance to remove
     */
    removeDirectionalLight(value: DirectionalLight): void;
    /**
     * [KO] 모든 SpotLight를 제거합니다.
     * [EN] Removes all SpotLights.
     */
    removeAllSpotLight(): void;
    /**
     * [KO] 모든 PointLight를 제거합니다.
     * [EN] Removes all PointLights.
     */
    removeAllPointLight(): void;
    /**
     * [KO] 모든 DirectionalLight를 제거합니다.
     * [EN] Removes all DirectionalLights.
     */
    removeAllDirectionalLight(): void;
    /**
     * [KO] 장면의 모든 조명을 제거합니다.
     * [EN] Removes all lights in the scene.
     *
     * [KO] 포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.
     * [EN] Removes all point, spot, and directional lights, and sets ambient light to null.
     */
    removeAllLight(): void;
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
    getDirectionalLightProjectionViewMatrix(view: View3D): mat4;
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
    getDirectionalLightProjectionMatrix(view: View3D): mat4;
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
    getDirectionalLightViewMatrix(view: View3D): mat4;
}
export default LightManager;
