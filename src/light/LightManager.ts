import {mat4, vec3} from "gl-matrix";
import View3D from "../display/view/View3D";
import consoleAndThrowError from "../utils/consoleAndThrowError";
import AmbientLight from "./AmbientLight";
import DirectionalLight from "./DirectionalLight";
import PointLight from "./PointLight";
import PassClustersLightHelper from "./clusterLight/PassClustersLightHelper";
import SpotLight from "./SpotLight";

class LightManager {
	#limitDirectionalLightCount: number = 3
	#limitClusterLightCount: number = PassClustersLightHelper.MAX_CLUSTER_LIGHTS
	#directionalLights: DirectionalLight[] = []
	#pointLights: PointLight[] = []
	#spotLights: SpotLight[] = []
	#ambientLight: AmbientLight = new AmbientLight()
	#lightProjectionMatrix: mat4 = mat4.create()


	get spotLights(): SpotLight[] {
		return this.#spotLights;
	}

	get spotLightCount(): number {
		return this.#spotLights.length
	}

	get limitClusterLightCount(): number {
		return this.#limitClusterLightCount;
	}

	get pointLights(): PointLight[] {
		return this.#pointLights;
	}

	get pointLightCount(): number {
		return this.#pointLights.length
	}

	get limitDirectionalLightCount(): number {
		return this.#limitDirectionalLightCount;
	}

	get directionalLightCount(): number {
		return this.#directionalLights.length;
	}

	get directionalLights(): DirectionalLight[] {
		return this.#directionalLights;
	}

	get ambientLight(): AmbientLight {
		return this.#ambientLight;
	}

	set ambientLight(value: AmbientLight) {
		if (!(value instanceof AmbientLight)) consoleAndThrowError('allow only AmbientLight instance')
		this.#ambientLight = value;
	}

	addSpotLight(value: SpotLight) {
		if (!(value instanceof SpotLight)) consoleAndThrowError('allow only SpotLight instance')
		const isOverLimit = this.#spotLights.length + this.#pointLights.length > this.#limitClusterLightCount;
		if (isOverLimit) {
			consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
		}
		this.#spotLights.push(value)
	}

	addPointLight(value: PointLight) {
		if (!(value instanceof PointLight)) consoleAndThrowError('allow only PointLight instance')
		const isOverLimit = this.#spotLights.length + this.#pointLights.length  > this.#limitClusterLightCount;
		if (isOverLimit) {
			consoleAndThrowError('Cannot add more cluster lights. The limit has been reached.');
		}
		this.#pointLights.push(value)
	}

	addDirectionalLight(value: DirectionalLight) {
		if (!(value instanceof DirectionalLight)) consoleAndThrowError('allow only DirectionalLight instance')
		const isOverLimit = this.#directionalLights.length > this.#limitDirectionalLightCount;
		if (isOverLimit) {
			consoleAndThrowError('Cannot add more directional lights. The limit has been reached.');
		}
		this.#directionalLights.push(value)
	}

	removeDirectionalLight(value: DirectionalLight) {
		const index = this.#directionalLights.indexOf(value);
		if (index !== -1) this.#directionalLights.splice(index, 1);
	}

	removeAllDirectionalLight() {
		this.#directionalLights = [];
		this.#ambientLight = null
	}

	updateViewSystemUniforms(view: View3D) {
		const {redGPUContext, scene,} = view
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

	#getDirectionalLightProjectionViewMatrix(view: View3D): mat4 {
		return mat4.multiply(mat4.create(), this.#getDirectionalLightProjectionMatrix(view), this.#getMainDirectionalLightViewMatrix(view));
	}

	#getDirectionalLightProjectionMatrix(view: View3D): mat4 {
		const lightProjectionMatrix = mat4.create()
		const cameraPosition = vec3.fromValues(
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

	#getMainDirectionalLightViewMatrix(view: View3D): mat4 {
		mat4.identity(this.#lightProjectionMatrix)
		const distance = Math.max(vec3.distance(vec3.fromValues(
			view.rawCamera.x,
			view.rawCamera.y,
			view.rawCamera.z
		), vec3.create()), 1)
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
