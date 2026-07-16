import {mat4, vec3} from "gl-matrix";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
import View3D from "../../display/view/View3D";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import AmbientLight from "../lights/AmbientLight";
import DirectionalLight from "../lights/DirectionalLight";
import PointLight from "../lights/PointLight";
import SpotLight from "../lights/SpotLight";
import PassClustersLightHelper from "../clusterLight/core/PassClustersLightHelper";

/**
 * [KO] 씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
 * [EN] Class that manages all lights within a scene.
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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
        const isOverLimit = this.#spotLights.length + this.#pointLights.length >= this.#limitClusterLightCount;
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
        const isOverLimit = this.#spotLights.length + this.#pointLights.length >= this.#limitClusterLightCount;
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
        const isOverLimit = this.#directionalLights.length >= this.#limitDirectionalLightCount;
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
     */
    getDirectionalLightProjectionViewMatrix(view: View3D): mat4 {
        return this.#calculateDirectionalLightMatrices(view).projectionView;
    }

    /**
     * [KO] 방향성 조명의 투영(orthographic) 행렬을 계산하여 반환합니다.
     * [EN] Calculates and returns the projection (orthographic) matrix of the directional light.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @returns
     * [KO] mat4 투영 행렬
     * [EN] mat4 projection matrix
     */
    getDirectionalLightProjectionMatrix(view: View3D): mat4 {
        return this.#calculateDirectionalLightMatrices(view).projection;
    }

    /**
     * [KO] 메인 방향성 조명의 뷰(lookAt) 행렬을 계산하여 반환합니다.
     * [EN] Calculates and returns the view (lookAt) matrix of the main directional light.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @returns
     * [KO] mat4 뷰 행렬
     * [EN] mat4 view matrix
     */
    getDirectionalLightViewMatrix(view: View3D): mat4 {
        return this.#calculateDirectionalLightMatrices(view).view;
    }

    /**
     * [KO] LightManager 인스턴스를 파기하고 모든 조명 및 디버거 참조를 정리합니다.
     * [EN] Destroys the LightManager instance and cleans up all lights and debuggers.
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
    #calculateDirectionalLightMatrices(view: View3D): { projection: mat4, view: mat4, projectionView: mat4 } {
        const {directionalLights} = this;
        if (!directionalLights.length) {
            return {
                projection: mat4.create(),
                view: mat4.create(),
                projectionView: mat4.create()
            };
        }

        const rawCamera = view.rawCamera;
        if (!(rawCamera instanceof PerspectiveCamera)) {
            return {
                projection: mat4.create(),
                view: mat4.create(),
                projectionView: mat4.create()
            };
        }

        const camViewMatrix = rawCamera.viewMatrix;
        const invVM = mat4.create();
        if (!mat4.invert(invVM, camViewMatrix)) {
            return {
                projection: mat4.create(),
                view: mat4.create(),
                projectionView: mat4.create()
            };
        }

        // 1. 카메라 위치, 전방 벡터, 그리고 바라보는 지점까지의 거리(focusDistance) 계산
        const camPos = vec3.fromValues(invVM[12], invVM[13], invVM[14]);
        const camForward = vec3.fromValues(-invVM[8], -invVM[9], -invVM[10]);

        let focusDistance = 100.0;
        if (Math.abs(camForward[1]) > 0.01) {
            const t = -camPos[1] / camForward[1];
            if (t > 0) focusDistance = Math.max(t, 10.0);
        }
        // (TIP: OrbitControls 사용 시 vec3.distance(camPos, controls.target)을 쓰면 가장 정확합니다)

        // [핵심 수정 1] 카메라가 실제로 시선을 두고 있는 3D 공간상의 '포커스 지점'을 정확히 구합니다.
        const focusPoint = vec3.create();
        vec3.scaleAndAdd(focusPoint, camPos, camForward, focusDistance);

        // 2. 줌 거리에 연동하여 가시거리 제어 (배경 그림자를 위해 길게 잡아도 괜찮습니다)
        const shadowFar = Math.min(rawCamera.farClipping, Math.max(focusDistance * 1.5, 300.0));

        const fov = (Math.PI / 180) * rawCamera.fieldOfView;
        const aspect = view.aspect;
        const near = rawCamera.nearClipping;

        const halfHN = Math.tan(fov / 2) * near;
        const halfWN = halfHN * aspect;
        const halfHF = Math.tan(fov / 2) * shadowFar;
        const halfWF = halfHF * aspect;

        const localCorners = [
            vec3.fromValues(-halfWN, halfHN, -near),
            vec3.fromValues(halfWN, halfHN, -near),
            vec3.fromValues(halfWN, -halfHN, -near),
            vec3.fromValues(-halfWN, -halfHN, -near),
            vec3.fromValues(-halfWF, halfHF, -shadowFar),
            vec3.fromValues(halfWF, halfHF, -shadowFar),
            vec3.fromValues(halfWF, -halfHF, -shadowFar),
            vec3.fromValues(-halfWF, -halfHF, -shadowFar)
        ];

        const worldCorners: vec3[] = [];
        for (const localPt of localCorners) {
            const worldPt = vec3.create();
            vec3.transformMat4(worldPt, localPt, invVM);
            worldCorners.push(worldPt);
        }

        // 실제 프러스텀이 포괄하는 최대 바운딩 반경 계산 (깊이 Z 범위 계산용)
        let actualRadius = 0;
        for (const corner of worldCorners) {
            const d = vec3.distance(corner, focusPoint);
            if (d > actualRadius) {
                actualRadius = d;
            }
        }

        const light = directionalLights[0];
        const lightDir = vec3.fromValues(light.direction[0], light.direction[1], light.direction[2]);
        vec3.normalize(lightDir, lightDir);

        // 3. 가로/세로 영역(X, Y): 줌 거리(focusDistance)에 비례하여 그림자 상자 크기 설정
        const shadowRadius = Math.min(actualRadius, Math.max(focusDistance * 1.5, 15.0));
        const margin = shadowRadius * 0.20;
        const left = -shadowRadius - margin;
        const right = shadowRadius + margin;
        const bottom = -shadowRadius - margin;
        const top = shadowRadius + margin;

        // [핵심 수정 2] 라이트 카메라의 타겟 중심을 허공(frustumCenter)이 아닌 실제 'focusPoint'로 지정!
        // 이제 그림자 정사영 상자의 정중앙(0, 0)에 카메라가 보고 있는 피사체가 무조건 위치하게 됩니다.
        const lightDistance = Math.max(actualRadius * 2.0, 500.0);
        const lightPos = vec3.create();
        vec3.scaleAndAdd(lightPos, focusPoint, lightDir, -lightDistance);

        const up = vec3.fromValues(0, 1, 0);
        if (Math.abs(vec3.dot(lightDir, up)) > 0.99) {
            vec3.set(up, 0, 0, 1);
        }

        const lightView = mat4.create();
        mat4.lookAt(lightView, lightPos, focusPoint, up); // 타겟을 focusPoint로 변경

        // 4. 깊이 영역(Z): worldCorners를 lightView 공간으로 투영하여 앞뒤 잘림 없는 완벽한 Z 영역 도출
        let minZ = Infinity, maxZ = -Infinity;
        const p = vec3.create();
        for (const pt of worldCorners) {
            vec3.transformMat4(p, pt, lightView);
            if (p[2] < minZ) minZ = p[2];
            if (p[2] > maxZ) maxZ = p[2];
        }

        // 5. nearPlane / farPlane 도출 (오른손 좌표계 기준 -Z 전방)
        const zMargin = actualRadius * 0.50;
        const nearPlane = Math.max(0.1, -maxZ - zMargin);
        const farPlane = -minZ + zMargin;

        const lightProjection = mat4.create();
        mat4.orthoZO(lightProjection, left, right, bottom, top, nearPlane, farPlane);

        const lightProjectionView = mat4.create();
        mat4.multiply(lightProjectionView, lightProjection, lightView);

        return {
            projection: lightProjection,
            view: lightView,
            projectionView: lightProjectionView
        };
    }
}

const cleanupLight = (light: any) => {
    if (light?.drawDebugger) {
        try {
            light.drawDebugger.destroy();
        } catch (e) {
        }
        light.drawDebugger = null;
    }
};
Object.freeze(LightManager)
export default LightManager