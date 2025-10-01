import {mat4, vec3} from "gl-matrix";
import Camera2D from "../camera/camera/Camera2D";
import DrawDebuggerDirectionalLight from "../display/drawDebugger/light/DrawDebuggerDirectionalLight";
import View3D from "../display/view/View3D";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import PassClustersLightHelper from "./clusterLight/PassClustersLightHelper";
import AmbientLight from "./lights/AmbientLight";
import DirectionalLight from "./lights/DirectionalLight";
import PointLight from "./lights/PointLight";
import SpotLight from "./lights/SpotLight";

/**
 * 씬(Scene) 내의 모든 조명을 통합 관리하는 클래스입니다.
 * Scene 생성시 자동으로 생성됩니다.
 */
class LightManager {
	/**
	 * 방향성 조명의 최대 허용 개수입니다.
	 * 기본값: 3
	 * @private
	 */
	#limitDirectionalLightCount: number = 3
	/**
	 * 클러스터 조명(Point + Spot)의 최대 허용 개수입니다.
	 * PassClustersLightHelper.MAX_CLUSTER_LIGHTS 값을 사용합니다.
	 * @private
	 */
	#limitClusterLightCount: number = PassClustersLightHelper.MAX_CLUSTER_LIGHTS
	/**
	 * 등록된 방향성 조명 목록입니다.
	 * @private
	 */
	#directionalLights: DirectionalLight[] = []
	/**
	 * 등록된 포인트 조명 목록입니다.
	 * @private
	 */
	#pointLights: PointLight[] = []
	/**
	 * 등록된 스포트 조명 목록입니다.
	 * @private
	 */
	#spotLights: SpotLight[] = []
	/**
	 * 장면의 환경광(Ambient Light) 인스턴스입니다.
	 * 기본값은 새로운 AmbientLight 인스턴스입니다.
	 * @private
	 */
	#ambientLight: AmbientLight = new AmbientLight()
	/**
	 * 방향성 조명의 투영 행렬 계산에 사용되는 내부 캐시 행렬입니다.
	 * 그림자 맵 생성 등의 연산에서 사용됩니다.
	 * @private
	 */
	#lightProjectionMatrix: mat4 = mat4.create()

	/**
	 * 등록된 스포트 조명 배열을 반환합니다.
	 * @returns 등록된 SpotLight 배열
	 */
	get spotLights(): SpotLight[] {
		return this.#spotLights;
	}

	/**
	 * 등록된 스포트 조명의 개수를 반환합니다.
	 * @returns 스포트 조명 개수
	 */
	get spotLightCount(): number {
		return this.#spotLights.length
	}

	/**
	 * 클러스터 조명(Point + Spot)의 최대 허용 개수를 반환합니다.
	 * @returns 클러스터 조명 최대 개수
	 */
	get limitClusterLightCount(): number {
		return this.#limitClusterLightCount;
	}

	/**
	 * 등록된 포인트 조명 배열을 반환합니다.
	 * @returns 등록된 PointLight 배열
	 */
	get pointLights(): PointLight[] {
		return this.#pointLights;
	}

	/**
	 * 등록된 포인트 조명의 개수를 반환합니다.
	 * @returns 포인트 조명 개수
	 */
	get pointLightCount(): number {
		return this.#pointLights.length
	}

	/**
	 * 방향성 조명의 최대 허용 개수를 반환합니다.
	 * @returns 방향성 조명 최대 개수
	 */
	get limitDirectionalLightCount(): number {
		return this.#limitDirectionalLightCount;
	}

	/**
	 * 등록된 방향성 조명의 개수를 반환합니다.
	 * @returns 방향성 조명 개수
	 */
	get directionalLightCount(): number {
		return this.#directionalLights.length;
	}

	/**
	 * 등록된 방향성 조명 배열을 반환합니다.
	 * @returns 등록된 DirectionalLight 배열
	 */
	get directionalLights(): DirectionalLight[] {
		return this.#directionalLights;
	}

	/**
	 * 현재 설정된 환경광(AmbientLight)을 반환합니다.
	 * @returns AmbientLight 인스턴스 또는 null
	 */
	get ambientLight(): AmbientLight {
		return this.#ambientLight;
	}

	/**
	 * 환경광(AmbientLight)을 설정합니다.
	 * AmbientLight 인스턴스가 아닌 값을 전달하면 오류를 던집니다.
	 * @param value 설정할 AmbientLight 인스턴스
	 */
	set ambientLight(value: AmbientLight) {
		if (!(value instanceof AmbientLight)) consoleAndThrowError('allow only AmbientLight instance')
		this.#ambientLight = value;
	}

	/**
	 * SpotLight를 추가합니다.
	 * PointLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
	 * @param value 추가할 SpotLight 인스턴스
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
	 * PointLight를 추가합니다.
	 * SpotLight와 합친 개수가 클러스터 제한을 초과하면 오류를 던집니다.
	 * @param value 추가할 PointLight 인스턴스
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
	 * DirectionalLight를 추가합니다.
	 * 최대 방향성 조명 개수를 초과하면 오류를 던집니다.
	 * @param value 추가할 DirectionalLight 인스턴스
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
	 * 특정 SpotLight를 제거합니다.
	 * 목록에 없으면 아무 동작도 하지 않습니다.
	 * @param value 제거할 SpotLight 인스턴스
	 */
	removeSpotLight(value: SpotLight) {
		const index = this.#spotLights.indexOf(value);
		if (index !== -1) this.#spotLights.splice(index, 1);
	}

	/**
	 * 특정 PointLight를 제거합니다.
	 * 목록에 없으면 아무 동작도 하지 않습니다.
	 * @param value 제거할 PointLight 인스턴스
	 */
	removePointLight(value: PointLight) {
		const index = this.#pointLights.indexOf(value);
		if (index !== -1) this.#pointLights.splice(index, 1);
	}

	/**
	 * 특정 DirectionalLight를 제거합니다.
	 * 목록에 없으면 아무 동작도 하지 않습니다.
	 * @param value 제거할 DirectionalLight 인스턴스
	 */
	removeDirectionalLight(value: DirectionalLight) {
		const index = this.#directionalLights.indexOf(value);
		if (index !== -1) this.#directionalLights.splice(index, 1);
	}

	/** 모든 SpotLight를 제거합니다. */
	removeAllSpotLight() {
		this.#spotLights = [];
	}

	/** 모든 PointLight를 제거합니다. */
	removeAllPointLight() {
		this.#pointLights = [];
	}

	/** 모든 DirectionalLight를 제거합니다. */
	removeAllDirectionalLight() {
		this.#directionalLights = [];
	}

	/**
	 * 장면의 모든 조명을 제거합니다.
	 * 포인트/스포트/방향성 조명을 모두 제거하고 환경광은 null로 설정합니다.
	 */
	removeAllLight() {
		this.removeAllPointLight()
		this.removeAllSpotLight()
		this.removeAllDirectionalLight()
		this.#ambientLight = null
	}

	/**
	 * View3D에 필요한 시스템 유니폼 버퍼를 업데이트합니다.
	 *
	 * @param view 업데이트 대상 View3D 인스턴스
	 */
	updateViewSystemUniforms(view: View3D) {
		const {scene, redGPUContext} = view
		const structInfo = view.systemUniform_Vertex_StructInfo;
		const {systemUniform_Vertex_UniformBuffer} = view;
		const {members} = structInfo;
		const {lightManager, shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		systemUniform_Vertex_UniformBuffer.writeBuffers(
			[
				[members.directionalLightCount, lightManager.directionalLightCount],
				[members.directionalLightProjectionViewMatrix, this.#getDirectionalLightProjectionViewMatrix(view)],
				[members.directionalLightProjectionMatrix, this.#getDirectionalLightProjectionMatrix(view)],
				[members.directionalLightViewMatrix, this.#getMainDirectionalLightViewMatrix(view)],
				[members.shadowDepthTextureSize, directionalShadowManager.shadowDepthTextureSize],
				[members.bias, directionalShadowManager.bias],
				//
			]
		)
		lightManager.directionalLights.forEach((light: DirectionalLight, index) => {
			const {directionalLights} = members
			const {direction, color, intensity} = directionalLights.memberList[index]
			if (light.enableDebugger) {
				if (!light.drawDebugger) light.drawDebugger = new DrawDebuggerDirectionalLight(redGPUContext, light)
				light.drawDebugger.render(view.debugViewRenderState)
			}
			systemUniform_Vertex_UniformBuffer.writeBuffers(
				[
					[direction, light.direction],
					[color, light.color.rgbNormal],
					[intensity, light.intensity],
				]
			)
		})
		if (lightManager.ambientLight) {
			const light = view.scene.lightManager.ambientLight
			const {ambientLight} = members
			const {color, intensity} = ambientLight.members
			systemUniform_Vertex_UniformBuffer.writeBuffers(
				[
					[color, light.color.rgbNormal],
					[intensity, light.intensity],
				]
			)
		}
	}

	/**
	 * 방향성 조명의 투영-뷰 행렬을 반환합니다.
	 * @param view View3D 인스턴스
	 * @returns mat4 투영-뷰 행렬
	 * @private
	 */
	#getDirectionalLightProjectionViewMatrix(view: View3D): mat4 {
		return mat4.multiply(mat4.create(), this.#getDirectionalLightProjectionMatrix(view), this.#getMainDirectionalLightViewMatrix(view));
	}

	/**
	 * 방향성 조명의 투영(orthographic) 행렬을 계산하여 반환합니다.
	 * 카메라 위치와의 거리를 기반으로 ortho 영역( left, right, bottom, top, near, far )을 결정합니다.
	 * @param view View3D 인스턴스
	 * @returns mat4 투영 행렬
	 * @private
	 */
	#getDirectionalLightProjectionMatrix(view: View3D): mat4 {
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
	 * 메인 방향성 조명의 뷰(lookAt) 행렬을 계산하여 반환합니다.
	 * 씬에서 첫 번째 DirectionalLight의 방향을 사용하여 라이트 위치를 계산하고, 원점(origin)을 바라보도록 합니다.
	 * @param view View3D 인스턴스
	 * @returns mat4 뷰 행렬
	 * @private
	 */
	#getMainDirectionalLightViewMatrix(view: View3D): mat4 {
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
