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

        // 🌟 [3D 그래픽스 정석] 카메라 시야 절두체(Frustum) 외접구 기반 안정적 섀도우 피팅
        // 임의의 조건문/매직넘버를 100% 제거하고, 화면에 보이는 모든 영역을 수학적 기하학으로 연속 포괄
        const directionalShadowManager = view.scene.shadowManager.directionalShadowManager;
        const maxDist = directionalShadowManager.maxShadowDistance ?? 150.0;
        const shadowFar = Math.min(rawCamera.farClipping, maxDist);
        const near = rawCamera.nearClipping;
        const fov = (Math.PI / 180) * rawCamera.fieldOfView;
        const aspect = view.aspect;

        const halfHN = Math.tan(fov * 0.5) * near;
        const halfWN = halfHN * aspect;
        const halfHF = Math.tan(fov * 0.5) * shadowFar;
        const halfWF = halfHF * aspect;

        // 8개 절두체 로컬 좌표
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

        // 8개 꼭짓점의 월드 좌표 변환 및 기하학적 무게중심(Frustum Center) 도출
        const frustumCenter = vec3.create();
        const worldCorners: vec3[] = [];
        for (let i = 0; i < 8; i++) {
            const worldPt = vec3.create();
            vec3.transformMat4(worldPt, localCorners[i], invVM);
            worldCorners.push(worldPt);
            vec3.add(frustumCenter, frustumCenter, worldPt);
        }
        vec3.scale(frustumCenter, frustumCenter, 1.0 / 8.0);

        // 절두체 외접구 반경(Bounding Sphere Radius) 도출
        let sphereRadius = 0;
        for (let i = 0; i < 8; i++) {
            const d = vec3.distance(worldCorners[i], frustumCenter);
            if (d > sphereRadius) {
                sphereRadius = d;
            }
        }

        const light = directionalLights[0];
        const lightDir = vec3.fromValues(light.direction[0], light.direction[1], light.direction[2]);
        vec3.normalize(lightDir, lightDir);

        // 라이트 위치: frustumCenter에서 광원 반대 방향으로 충분한 거리(외접구 직경 x 2) 후퇴
        const lightDistance = sphereRadius * 2.0;
        const lightPos = vec3.create();
        vec3.scaleAndAdd(lightPos, frustumCenter, lightDir, -lightDistance);

        let up = vec3.fromValues(0, 1, 0);
        if (Math.abs(vec3.dot(lightDir, up)) > 0.99) {
            up = vec3.fromValues(0, 0, 1);
        }

        const lightView = mat4.create();
        mat4.lookAt(lightView, lightPos, frustumCenter, up);

        // 라이트 뷰 공간에서 8개 꼭짓점의 AABB 산출 (텍셀 누락 방지 마진 5% 포함)
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;
        const p = vec3.create();
        for (let i = 0; i < 8; i++) {
            vec3.transformMat4(p, worldCorners[i], lightView);
            if (p[0] < minX) minX = p[0];
            if (p[0] > maxX) maxX = p[0];
            if (p[1] < minY) minY = p[1];
            if (p[1] > maxY) maxY = p[1];
            if (p[2] < minZ) minZ = p[2];
            if (p[2] > maxZ) maxZ = p[2];
        }

        // 안정적인 직교 투영 범위 및 Z 심도 버퍼 산출
        const marginX = (maxX - minX) * 0.05;
        const marginY = (maxY - minY) * 0.05;
        const left = minX - marginX;
        const right = maxX + marginX;
        const bottom = minY - marginY;
        const top = maxY + marginY;
        const nearPlane = Math.max(0.1, -maxZ - sphereRadius * 0.5);
        const farPlane = -minZ + sphereRadius * 0.5;

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