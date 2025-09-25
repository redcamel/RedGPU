import {mat4} from "gl-matrix";
import {navigation} from "typedoc/dist/lib/output/themes/default/partials/navigation";
import {Function} from "wgsl_reflect";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import gltfAnimationLooper from "../../loader/gltf/animationLooper/gltfAnimationLooper";
import Primitive from "../../primitive/core/Primitive";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import VertexGPURenderInfo from "../../renderInfos/VertexGPURenderInfo";
import DefineForVertex from "../../resources/defineProperty/DefineForVertex";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {keepLog} from "../../utils";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";
import AABB from "../../utils/math/bound/AABB";
import calculateMeshAABB from "../../utils/math/bound/calculateMeshAABB";
import calculateMeshCombinedAABB from "../../utils/math/bound/calculateMeshCombinedAABB";
import calculateMeshOBB from "../../utils/math/bound/calculateMeshOBB";
import OBB from "../../utils/math/bound/OBB";
import mat4ToEuler from "../../utils/math/matToEuler";
import uuidToUint from "../../utils/uuidToUint";
import DrawDebuggerMesh from "../drawDebugger/DrawDebuggerMesh";
import createMeshVertexUniformBuffers from "./core/createMeshVertexUniformBuffers";
import Object3DContainer from "./core/Object3DContainer";
import updateMeshDirtyPipeline from "./core/pipeline/updateMeshDirtyPipeline";
import getBasicMeshVertexBindGroupDescriptor from "./core/shader/getBasicMeshVertexBindGroupDescriptor";
import MeshBase from "./MeshBase";

const VERTEX_SHADER_MODULE_NAME_PBR_SKIN = 'VERTEX_MODULE_MESH_PBR_SKIN'
const CONVERT_RADIAN = Math.PI / 180;
const CPI = 3.141592653589793, CPI2 = 6.283185307179586, C225 = 0.225, C127 = 1.27323954, C045 = 0.405284735,
	C157 = 1.5707963267948966;
const tempFloat32_1 = new Float32Array(1);
const up = new Float32Array([0, 1, 0]);
interface Mesh {
	receiveShadow: boolean
	disableJitter: boolean
	meshType: string
	useDisplacementTexture: boolean
}

class Mesh extends MeshBase {
	displacementTexture: BitmapTexture
	castShadow: boolean = false
	#instanceId: number
	#name: string
	#parent: Object3DContainer
	//
	#x: number = 0
	#z: number = 0
	#y: number = 0
	#positionArray: Float32Array = new Float32Array([0, 0, 0])
	//
	#pivotX: number = 0
	#pivotY: number = 0
	#pivotZ: number = 0
	//
	readonly #pickingId: number
	//
	#scaleX: number = 1
	#scaleY: number = 1
	#scaleZ: number = 1
	//
	#scaleArray: Float32Array = new Float32Array([1, 1, 1])
	//
	#rotationX: number = 0
	#rotationY: number = 0
	#rotationZ: number = 0
	#rotationArray: Float32Array = new Float32Array([0, 0, 0])
	//
	#events: any = {}
	#eventsNum: number = 0
	//
	#ignoreFrustumCulling: boolean = false
	//
	#opacity: number = 1
	//
	#drawDebugger: DrawDebuggerMesh
	#enableDebugger: boolean = false
	#cachedBoundingAABB: AABB
	#cachedBoundingOBB: OBB

//
	constructor(redGPUContext: RedGPUContext, geometry?: Geometry | Primitive, material?, name?: string) {
		super(redGPUContext)
		if (name) this.name = name
		this._geometry = geometry
		this._material = material
		this.#pickingId = uuidToUint(this.uuid)
	}

	//
	get enableDebugger(): boolean {
		return this.#enableDebugger;
	}

	set enableDebugger(value: boolean) {
		this.#enableDebugger = value;
		if (value && !this.#drawDebugger) this.#drawDebugger = new DrawDebuggerMesh(this.redGPUContext, this)
	}

	get drawDebugger(): DrawDebuggerMesh {
		return this.#drawDebugger;
	}

	_material
	get material() {
		return this._material;
	}

	set material(value) {
		this._material = value;
		this.dirtyPipeline = true;
		// blendMode 키가 있는 경우 블렌드 모드 재적용
		if ("blendMode" in this) {
			this.blendMode = this.blendMode;
		}
	}

	// 블렌드 모드 설정 함수
	_geometry: Geometry | Primitive
	get geometry(): Geometry | Primitive {
		return this._geometry;
	}

	set geometry(value: Geometry | Primitive) {
		this._geometry = value;
		this.dirtyPipeline = true
		this.dirtyTransform = true
	}

	get opacity(): number {
		return this.#opacity;
	}

	set opacity(value: number) {
		validatePositiveNumberRange(value, 0, 1)
		this.#opacity = value;
		this.dirtyOpacity = true
	}

	get ignoreFrustumCulling(): boolean {
		return this.#ignoreFrustumCulling;
	}

	set ignoreFrustumCulling(value: boolean) {
		this.#ignoreFrustumCulling = value;
	}

	get pickingId(): number {
		return this.#pickingId;
	}

	get events(): any {
		return this.#events;
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get vertexStateBuffers(): GPUVertexBufferLayout[] {
		return this._geometry.gpuRenderInfo.buffers
	}

	// 	this.#z = z
	/**
	 * 설정된 부모 객체값을 반환합니다.
	 */
	get parent(): Object3DContainer {
		return this.#parent;
	}

	/**
	 * 부모 객체를 설정합니다.
	 * @param value
	 */
	set parent(value: Object3DContainer) {
		this.#parent = value;
	}

	get pivotX(): number {
		return this.#pivotX;
	}

	set pivotX(value: number) {
		this.#pivotX = value;
		this.dirtyTransform = true
	}

	get pivotY(): number {
		return this.#pivotY;
	}

	set pivotY(value: number) {
		this.#pivotY = value;
		this.dirtyTransform = true
	}

	get pivotZ(): number {
		return this.#pivotZ;
	}

	set pivotZ(value: number) {
		this.#pivotZ = value;
		this.dirtyTransform = true
	}

	get x(): number {
		return this.#x;
	}

	set x(value: number) {
		this.#x = this.#positionArray[0] = value;
		this.dirtyTransform = true
	}

	get y(): number {
		return this.#y;
	}

	set y(value: number) {
		this.#y = this.#positionArray[1] = value;
		this.dirtyTransform = true
	}

	get z(): number {
		return this.#z;
	}

	set z(value: number) {
		this.#z = this.#positionArray[2] = value;
		this.dirtyTransform = true
	}

	get position():Float32Array{
		return this.#positionArray;
	}

	get scaleX(): number {
		return this.#scaleX;
	}

	set scaleX(value: number) {
		this.#scaleX = this.#scaleArray[0] = value;
		this.dirtyTransform = true
	}

	get scaleY(): number {
		return this.#scaleY;
	}

	set scaleY(value: number) {
		this.#scaleY = this.#scaleArray[1] = value;
		this.dirtyTransform = true
	}

	get scaleZ(): number {
		return this.#scaleZ;
	}

	set scaleZ(value: number) {
		this.#scaleZ = this.#scaleArray[2] = value;
		this.dirtyTransform = true
	}

	get scale(): Float32Array {
		return this.#scaleArray;
	}

	get rotationX(): number {
		return this.#rotationX;
	}

	set rotationX(value: number) {
		this.#rotationX = this.#rotationArray[0] = value % 360
		;
		this.dirtyTransform = true
	}

	get rotationY(): number {
		return this.#rotationY;
	}

	set rotationY(value: number) {
		this.#rotationY = this.#rotationArray[1] = value % 360;
		this.dirtyTransform = true
	}

	get rotationZ(): number {
		return this.#rotationZ;
	}

	set rotationZ(value: number) {
		this.#rotationZ = this.#rotationArray[2] = value % 360;
		this.dirtyTransform = true
	}

	get rotation(): Float32Array{
		return this.#rotationArray;
	}

	get boundingOBB(): OBB {
		if (!this.#cachedBoundingOBB || this.dirtyTransform) {
			this.#cachedBoundingOBB = null
			this.#cachedBoundingAABB = null
			this.#cachedBoundingOBB = calculateMeshOBB(this);
		}
		return this.#cachedBoundingOBB
	}

	get boundingAABB(): AABB {
		if (!this.#cachedBoundingAABB || this.dirtyTransform) {
			this.#cachedBoundingOBB = null
			this.#cachedBoundingAABB = null
			this.#cachedBoundingAABB = calculateMeshAABB(this);
		}
		return this.#cachedBoundingAABB
	}

	get combinedBoundingAABB(): AABB {
		return calculateMeshCombinedAABB(this)
	}

	setEnableDebuggerRecursively(enableDebugger: boolean = false) {
		if ('enableDebugger' in this) {
			this.enableDebugger = enableDebugger
		}
		if (this.children) {
			this.children.forEach(child => {
				child.setEnableDebuggerRecursively(enableDebugger)
			})
		}
	}

	setCastShadowRecursively(castShadow: boolean = false) {
		if ('castShadow' in this) {
			this.castShadow = castShadow
		}
		if (this.children) {
			this.children.forEach(child => {
				child.setCastShadowRecursively(castShadow)
			})
		}
	}

	setReceiveShadowRecursively(receiveShadow: boolean = false) {
		if ('receiveShadow' in this) {
			this.receiveShadow = receiveShadow
		}
		if (this.children) {
			this.children.forEach(child => {
				child.setReceiveShadowRecursively(receiveShadow)
			})
		}
	}

	getCombinedOpacity(): number {
		if (this['is2DMeshType']) {
			const parent = this.parent as { getCombinedOpacity?: () => number } | undefined;
			return this.#opacity * (parent?.getCombinedOpacity ? parent.getCombinedOpacity() : 1);
		}
		return 1
	}

	addListener(eventName: string, callback: Function) {
		this.#events[eventName] = callback
		this.#eventsNum = Object.keys(this.#events).length
	}

	lookAt(targetX: number | [number, number, number], targetY?: number, targetZ?: number): void {

		var tPosition = [];
		var tRotation = []
		tPosition[0] = targetX;
		tPosition[1] = targetY;
		tPosition[2] = targetZ;
		//out, eye, center, up
		mat4.identity(this.localMatrix);
		mat4.targetTo(this.localMatrix, [this.#x, this.#y, this.#z], tPosition, up);
		tRotation = mat4ToEuler(this.localMatrix, []);
		this.rotationX = -tRotation[0] * 180 / Math.PI;
		this.rotationY = -tRotation[1] * 180 / Math.PI;
		this.rotationZ = -tRotation[2] * 180 / Math.PI;
	}

	setScale(x: number, y?: number, z?: number) {
		y = y ?? x;
		z = z ?? x;
		const scaleArray = this.#scaleArray
		this.#scaleX = scaleArray[0] = x
		this.#scaleY = scaleArray[1] = y
		this.#scaleZ = scaleArray[2] = z
		this.dirtyTransform = true
	}

	setPosition(x: number, y?: number, z?: number) {
		y = y ?? x;
		z = z ?? x;
		const positionArray = this.#positionArray
		this.#x = positionArray[0] = x;
		this.#y = positionArray[1] = y;
		this.#z = positionArray[2] = z;
		this.dirtyTransform = true
	}

	setRotation(rotationX: number, rotationY?: number, rotationZ?: number) {
		rotationY = rotationY ?? rotationX;
		rotationZ = rotationZ ?? rotationX;
		const rotationArray = this.#rotationArray
		this.#rotationX = rotationArray[0] = rotationX
		this.#rotationY = rotationArray[1] = rotationY
		this.#rotationZ = rotationArray[2] = rotationZ
		this.dirtyTransform = true
	}

	clone() {
		const cloneMesh = new Mesh(this.redGPUContext, this._geometry, this._material)
		cloneMesh.setPosition(this.#x, this.#y, this.#z)
		cloneMesh.setRotation(this.#rotationX, this.#rotationY, this.#rotationZ)
		cloneMesh.setScale(this.#scaleX, this.#scaleY, this.#scaleZ)
		// cloneMesh.geometry = this._geometry
		// cloneMesh.material = this._material
		//TODO 추가로 먼가 더해야할것 같으디..
		let i = this.children.length;
		while (i--) {
			cloneMesh.addChild(this.children[i].clone());
		}
		return cloneMesh
	}

	#prevModelMatrix: Float32Array

	render(debugViewRenderState: RenderViewStateData) {
		const {redGPUContext,} = this
		const {
			view,
			isScene2DMode,
			currentRenderPassEncoder,
			timestamp,
			frustumPlanes,
			dirtyVertexUniformFromMaterial,
			useDistanceCulling,
			cullingDistanceSquared,
		} = debugViewRenderState
		const {antialiasingManager, gpuDevice} = redGPUContext
		const {useMSAA} = antialiasingManager
		const {scene} = view
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const {pickingManager} = view
		const {castingList} = directionalShadowManager
		const currentGeometry = this._geometry
		const currentMaterial = this._material
		const {uuid: currentMaterialUUID} = currentMaterial || {}
		let dirtyTransformForChildren
		let dirtyOpacityForChildren
		if (!antialiasingManager.useTAA) {
			this.#prevModelMatrix = null
		}
		if (this.#prevModelMatrix) {
			const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
			const {members: vertexUniformInfoMembers} = vertexUniformInfo
			if (vertexUniformInfoMembers.prevModelMatrix) {
				redGPUContext.gpuDevice.queue.writeBuffer(
					vertexUniformBuffer.gpuBuffer,
					vertexUniformInfoMembers.prevModelMatrix.uniformOffset,
					this.#prevModelMatrix,
				)
			}
		}
		if (isScene2DMode) {
			this.#z = 0
			this.#pivotZ = 0
			if (this.depthStencilState.depthWriteEnabled) {
				this.depthStencilState.depthWriteEnabled = false
			}
		}
		if (this.dirtyTransform) {
			dirtyTransformForChildren = true
			{
				const {pixelRectObject} = view
				const parent = this.parent
				const tLocalMatrix = this.localMatrix;
				let aX, aY, aZ;
				// tLocalMatrix translate
				tLocalMatrix[12] = this.#x;
				tLocalMatrix[13] = this.#y;
				tLocalMatrix[14] = this.#z;
				tLocalMatrix[15] = 1;
				// tLocalMatrix rotate
				aX = this.#rotationX * CONVERT_RADIAN;
				aY = this.#rotationY * CONVERT_RADIAN;
				aZ = this.#rotationZ * CONVERT_RADIAN;
				/////////////////////////
				let aSx, aSy, aSz, aCx, aCy, aCz;
				let b0, b1, b2, b3;
				let b00, b01, b02, b10, b11, b12, b20, b21, b22;
				// sin,cos 관련
				let a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23, a30, a31, a32, a33;
				let tRadian;
				a00 = 1, a01 = 0, a02 = 0;
				a10 = 0, a11 = 1, a12 = 0;
				a20 = 0, a21 = 0, a22 = 1;
				tRadian = aX % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aSx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				tRadian = (aX + C157) % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aCx = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				tRadian = aY % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aSy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				tRadian = (aY + C157) % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aCy = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				tRadian = aZ % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aSz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				tRadian = (aZ + C157) % CPI2;
				tRadian < -CPI ? tRadian = tRadian + CPI2 : tRadian > CPI ? tRadian = tRadian - CPI2 : 0;
				tRadian = tRadian < 0 ? C127 * tRadian + C045 * tRadian * tRadian : C127 * tRadian - C045 * tRadian * tRadian;
				aCz = tRadian < 0 ? C225 * (tRadian * -tRadian - tRadian) + tRadian : C225 * (tRadian * tRadian - tRadian) + tRadian;
				/////////////////////////
				b00 = aCy * aCz;
				b01 = aSx * aSy * aCz - aCx * aSz;
				b02 = aCx * aSy * aCz + aSx * aSz;
				b10 = aCy * aSz;
				b11 = aSx * aSy * aSz + aCx * aCz;
				b12 = aCx * aSy * aSz - aSx * aCz;
				b20 = -aSy;
				b21 = aSx * aCy;
				b22 = aCx * aCy;
				// tLocalMatrix scale
				aX = this.#scaleX , aY = this.#scaleY , aZ = this.#scaleZ;
				// @ts-ignore
				if (this.renderTextureWidth) {
					// @ts-ignore
					aX *= this.renderTextureWidth
					// @ts-ignore
					aY *= this.renderTextureHeight
				}
				tLocalMatrix[0] = (a00 * b00 + a10 * b01 + a20 * b02) * aX;
				tLocalMatrix[1] = (a01 * b00 + a11 * b01 + a21 * b02) * aX;
				tLocalMatrix[2] = (a02 * b00 + a12 * b01 + a22 * b02) * aX;
				tLocalMatrix[3] = tLocalMatrix[3] * aX;
				tLocalMatrix[4] = (a00 * b10 + a10 * b11 + a20 * b12) * aY;
				tLocalMatrix[5] = (a01 * b10 + a11 * b11 + a21 * b12) * aY;
				tLocalMatrix[6] = (a02 * b10 + a12 * b11 + a22 * b12) * aY;
				tLocalMatrix[7] = tLocalMatrix[7] * aY;
				tLocalMatrix[8] = (a00 * b20 + a10 * b21 + a20 * b22) * aZ;
				tLocalMatrix[9] = (a01 * b20 + a11 * b21 + a21 * b22) * aZ;
				tLocalMatrix[10] = (a02 * b20 + a12 * b21 + a22 * b22) * aZ;
				tLocalMatrix[11] = tLocalMatrix[11] * aZ
				{
					(this.#pivotX || this.#pivotY || this.#pivotZ) ? (
						// 피봇처리
						// 매트립스 곱
						a00 = tLocalMatrix[0], a01 = tLocalMatrix[1], a02 = tLocalMatrix[2], a03 = tLocalMatrix[3],
							a10 = tLocalMatrix[4], a11 = tLocalMatrix[5], a12 = tLocalMatrix[6], a13 = tLocalMatrix[7],
							a20 = tLocalMatrix[8], a21 = tLocalMatrix[9], a22 = tLocalMatrix[10], a23 = tLocalMatrix[11],
							a30 = tLocalMatrix[12], a31 = tLocalMatrix[13], a32 = tLocalMatrix[14], a33 = tLocalMatrix[15],
							// Cache only the current line of the second matrix
							b0 = 1, b1 = 0, b2 = 0, b3 = 0,
							tLocalMatrix[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
							tLocalMatrix[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
							tLocalMatrix[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
							tLocalMatrix[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
							b0 = 0, b1 = 1, b2 = 0, b3 = 0,
							tLocalMatrix[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
							tLocalMatrix[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
							tLocalMatrix[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
							tLocalMatrix[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
							b0 = 0, b1 = 0, b2 = 1, b3 = 0,
							tLocalMatrix[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
							tLocalMatrix[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
							tLocalMatrix[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
							tLocalMatrix[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
							(isScene2DMode
								? (
									parent?.modelMatrix
										? (b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)
										: (b0 = -this.#pivotX / aX, b1 = -this.#pivotY / aY, b2 = -this.#pivotZ, b3 = 1)
								)
								:
								(b0 = -this.#pivotX, b1 = -this.#pivotY, b2 = -this.#pivotZ, b3 = 1)),
							tLocalMatrix[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
							tLocalMatrix[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
							tLocalMatrix[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
							tLocalMatrix[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33
					) : 0
				}
				{
					if (parent?.modelMatrix) {
						// mat4.multiply(this.modelMatrix, parent.modelMatrix, this.localMatrix);
						let parentModelMatrix = parent.modelMatrix
						let localMatrix = this.localMatrix
						let out = this.modelMatrix
						let a00 = parentModelMatrix[0],
							a01 = parentModelMatrix[1],
							a02 = parentModelMatrix[2],
							a03 = parentModelMatrix[3];
						let a10 = parentModelMatrix[4],
							a11 = parentModelMatrix[5],
							a12 = parentModelMatrix[6],
							a13 = parentModelMatrix[7];
						let a20 = parentModelMatrix[8],
							a21 = parentModelMatrix[9],
							a22 = parentModelMatrix[10],
							a23 = parentModelMatrix[11];
						let a30 = parentModelMatrix[12],
							a31 = parentModelMatrix[13],
							a32 = parentModelMatrix[14],
							a33 = parentModelMatrix[15];
						// Cache only the current line of the second matrix
						let b0 = localMatrix[0],
							b1 = localMatrix[1],
							b2 = localMatrix[2],
							b3 = localMatrix[3];
						out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
						out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
						out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
						out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
						b0 = localMatrix[4];
						b1 = localMatrix[5];
						b2 = localMatrix[6];
						b3 = localMatrix[7];
						out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
						out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
						out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
						out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
						b0 = localMatrix[8];
						b1 = localMatrix[9];
						b2 = localMatrix[10];
						b3 = localMatrix[11];
						out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
						out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
						out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
						out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
						b0 = localMatrix[12];
						b1 = localMatrix[13];
						b2 = localMatrix[14];
						b3 = localMatrix[15];
						out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
						out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
						out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
						out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
					} else {
						// this.modelMatrix = mat4.clone(this.localMatrix)
						const {modelMatrix, localMatrix} = this
						modelMatrix[0] = localMatrix[0]
						modelMatrix[1] = localMatrix[1]
						modelMatrix[2] = localMatrix[2]
						modelMatrix[3] = localMatrix[3]
						modelMatrix[4] = localMatrix[4]
						modelMatrix[5] = localMatrix[5]
						modelMatrix[6] = localMatrix[6]
						modelMatrix[7] = localMatrix[7]
						modelMatrix[8] = localMatrix[8]
						modelMatrix[9] = localMatrix[9]
						modelMatrix[10] = localMatrix[10]
						modelMatrix[11] = localMatrix[11]
						modelMatrix[12] = localMatrix[12]
						modelMatrix[13] = localMatrix[13]
						modelMatrix[14] = localMatrix[14]
						modelMatrix[15] = localMatrix[15]
					}
				}
				{
					// calculate NormalMatrix
					let normalModelMatrix = this.normalModelMatrix;
					let modelMatrix = this.modelMatrix;
					let a00 = modelMatrix[0];
					let a01 = modelMatrix[1];
					let a02 = modelMatrix[2];
					let a03 = modelMatrix[3];
					let a10 = modelMatrix[4];
					let a11 = modelMatrix[5];
					let a12 = modelMatrix[6];
					let a13 = modelMatrix[7];
					let a20 = modelMatrix[8];
					let a21 = modelMatrix[9];
					let a22 = modelMatrix[10];
					let a23 = modelMatrix[11];
					let a31 = modelMatrix[12];
					let a32 = modelMatrix[13];
					let a33 = modelMatrix[14];
					let b0 = modelMatrix[15];
					let a30 = a00 * a11 - a01 * a10;
					let b1 = a00 * a12 - a02 * a10;
					let b2 = a00 * a13 - a03 * a10;
					let b3 = a01 * a12 - a02 * a11;
					let b00 = a01 * a13 - a03 * a11;
					let b01 = a02 * a13 - a03 * a12;
					let b02 = a20 * a32 - a21 * a31;
					let b10 = a20 * a33 - a22 * a31;
					let b11 = a20 * b0 - a23 * a31;
					let b12 = a22 * b0 - a23 * a33
					let b20 = a21 * b0 - a23 * a32;
					let b22 = a30 * b12 - b1 * b20 + b2 * b12 + b3 * b11 - b00 * b10 + b01 * b02;
					b22 = 1 / b22;
					normalModelMatrix[0] = (a11 * b12 - a12 * b20 + a13 * b12) * b22;
					normalModelMatrix[4] = (-a01 * b12 + a02 * b20 - a03 * b12) * b22;
					normalModelMatrix[8] = (a32 * b01 - a33 * b00 + b0 * b3) * b22;
					normalModelMatrix[12] = (-a21 * b01 + a22 * b00 - a23 * b3) * b22;
					normalModelMatrix[1] = (-a10 * b12 + a12 * b11 - a13 * b10) * b22;
					normalModelMatrix[5] = (a00 * b12 - a02 * b11 + a03 * b10) * b22;
					normalModelMatrix[9] = (-a31 * b01 + a33 * b2 - b0 * b1) * b22;
					normalModelMatrix[13] = (a20 * b01 - a22 * b2 + a23 * b1) * b22;
					normalModelMatrix[2] = (a10 * b20 - a11 * b11 + a13 * b02) * b22;
					normalModelMatrix[6] = (-a00 * b20 + a01 * b11 - a03 * b02) * b22;
					normalModelMatrix[10] = (a31 * b00 - a32 * b2 + b0 * a30) * b22;
					normalModelMatrix[14] = (-a20 * b00 + a21 * b2 - a23 * a30) * b22;
					normalModelMatrix[3] = (-a10 * b12 + a11 * b10 - a12 * b02) * b22;
					normalModelMatrix[7] = (a00 * b12 - a01 * b10 + a02 * b02) * b22;
					normalModelMatrix[11] = (-a31 * b3 + a32 * b1 - a33 * a30) * b22;
					normalModelMatrix[15] = (a20 * b3 - a21 * b1 + a22 * a30) * b22;
				}
			}
		}
		// check distanceCulling
		let passFrustumCulling = true
		if (useDistanceCulling && currentGeometry) {
			const {rawCamera} = view
			const aabb = this.boundingAABB;
			// AABB 중심점과 카메라 위치 간의 거리 계산
			const dx = rawCamera.x - aabb.centerX;
			const dy = rawCamera.y - aabb.centerY;
			const dz = rawCamera.z - aabb.centerZ;
			// 거리 제곱 계산
			const distanceSquared = dx * dx + dy * dy + dz * dz;
			// AABB의 반지름을 고려한 컬링 거리 계산
			const cullingDistanceWithRadius = cullingDistanceSquared + (aabb.geometryRadius * aabb.geometryRadius);
			if (distanceSquared > cullingDistanceWithRadius) {
				passFrustumCulling = false;
			}
		}
		// check frustumCulling
		if (frustumPlanes && passFrustumCulling) {
			// if (currentGeometry) {
			const combinedAABB = this.boundingAABB;
			const frustumPlanes0 = frustumPlanes[0];
			const frustumPlanes1 = frustumPlanes[1];
			const frustumPlanes2 = frustumPlanes[2];
			const frustumPlanes3 = frustumPlanes[3];
			const frustumPlanes4 = frustumPlanes[4];
			const frustumPlanes5 = frustumPlanes[5];
			// combinedBoundingAABB의 중심점과 반지름 사용
			const centerX = combinedAABB.centerX;
			const centerY = combinedAABB.centerY;
			const centerZ = combinedAABB.centerZ;
			const radius = combinedAABB.geometryRadius;
			// 각 frustum plane에 대해 거리 계산
			frustumPlanes0[0] * centerX + frustumPlanes0[1] * centerY + frustumPlanes0[2] * centerZ + frustumPlanes0[3] <= -radius ? passFrustumCulling = false
				: frustumPlanes1[0] * centerX + frustumPlanes1[1] * centerY + frustumPlanes1[2] * centerZ + frustumPlanes1[3] <= -radius ? passFrustumCulling = false
					: frustumPlanes2[0] * centerX + frustumPlanes2[1] * centerY + frustumPlanes2[2] * centerZ + frustumPlanes2[3] <= -radius ? passFrustumCulling = false
						: frustumPlanes3[0] * centerX + frustumPlanes3[1] * centerY + frustumPlanes3[2] * centerZ + frustumPlanes3[3] <= -radius ? passFrustumCulling = false
							: frustumPlanes4[0] * centerX + frustumPlanes4[1] * centerY + frustumPlanes4[2] * centerZ + frustumPlanes4[3] <= -radius ? passFrustumCulling = false
								: frustumPlanes5[0] * centerX + frustumPlanes5[1] * centerY + frustumPlanes5[2] * centerZ + frustumPlanes5[3] <= -radius ? passFrustumCulling = false : 0;
			// } else {
			// 	passFrustumCulling = false
			// }
		}
		if (this.#ignoreFrustumCulling) passFrustumCulling = true
		if (passFrustumCulling) {
			// check animation
			if (this.gltfLoaderInfo?.activeAnimations?.length) {
				// gltfAnimationLooper(
				// 	redGPUContext, timestamp,
				// 	debugViewRenderState.computeCommandEncoder,
				// 	this.gltfLoaderInfo.activeAnimations
				// )
				debugViewRenderState.animationList[debugViewRenderState.animationList.length] = this.gltfLoaderInfo?.activeAnimations
			}
			if (this.animationInfo.skinInfo) {
				if (!this.currentShaderModuleName.includes(VERTEX_SHADER_MODULE_NAME_PBR_SKIN)) {
					this.dirtyPipeline = true
				}
				if (this.currentShaderModuleName === `${VERTEX_SHADER_MODULE_NAME_PBR_SKIN}_${this.animationInfo.skinInfo.joints?.length}`) {
					// this.animationInfo.skinInfo.update(redGPUContext, this)
					debugViewRenderState.skinList[debugViewRenderState.skinList.length] = this
					dirtyTransformForChildren = false
				}
			}
		}
		// render
		if (currentGeometry) debugViewRenderState.num3DObjects++
		else debugViewRenderState.num3DGroups++
		const {displacementTexture, displacementScale} = currentMaterial || {}
		if (this.dirtyPipeline || currentMaterial?.dirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
			dirtyVertexUniformFromMaterial[currentMaterialUUID] = true
		}
		if (currentGeometry) {
			if (antialiasingManager.changedMSAA) {
				this.dirtyPipeline = true
			}
			if (!this.gpuRenderInfo) this.initGPURenderInfos()
			const currentUseDisplacementTexture = !!displacementTexture
			if (this.useDisplacementTexture !== currentUseDisplacementTexture) {
				this.useDisplacementTexture = currentUseDisplacementTexture
				this.dirtyPipeline = true
			}
			if (this.dirtyPipeline || dirtyVertexUniformFromMaterial[currentMaterialUUID]) {
				updateMeshDirtyPipeline(this, debugViewRenderState)
				this.#bundleEncoder = null
				this.#renderBundle = null

			}
		}
		if (currentGeometry && passFrustumCulling) {
			{
				const {gpuRenderInfo} = this
				const {vertexUniformBuffer, vertexUniformInfo} = gpuRenderInfo
				const {members: vertexUniformInfoMembers} = vertexUniformInfo
				if (vertexUniformInfoMembers.displacementScale !== undefined &&
					vertexUniformInfoMembers.displacementScale !== displacementScale
				) {
					tempFloat32_1[0] = displacementScale
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfoMembers.displacementScale.uniformOffset,
						// new vertexUniformInfoMembers.displacementScale.View([displacementScale])
						tempFloat32_1
					);
				}
			}
			const {gpuRenderInfo} = this
			const {vertexUniformBuffer, vertexUniformBindGroup, vertexUniformInfo, pipeline,} = gpuRenderInfo
			const {members: vertexUniformInfoMembers} = vertexUniformInfo
			if (this.dirtyTransform) {
				gpuDevice.queue.writeBuffer(
					vertexUniformBuffer.gpuBuffer,
					vertexUniformInfoMembers.modelMatrix.uniformOffset,
					(
						//TODO - Sprite2D떄문에 처리했지만 이거 일반화해야함
						// TODO - renderTextureWidth 이놈도 같이 처리해야할듯
						// @ts-ignore
						this.is2DMeshType ? mat4.multiply(
							mat4.create(),
							this.modelMatrix,
							mat4.fromValues(
								// @ts-ignore
								this.width, 0, 0, 0, 0, this.height, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
							),
						) : this.modelMatrix
					)
				)
				if (antialiasingManager.useTAA) {
					if (!this.#prevModelMatrix) this.#prevModelMatrix = new Float32Array(16)
					this.#prevModelMatrix[0] = this.modelMatrix[0]
					this.#prevModelMatrix[1] = this.modelMatrix[1]
					this.#prevModelMatrix[2] = this.modelMatrix[2]
					this.#prevModelMatrix[3] = this.modelMatrix[3]
					this.#prevModelMatrix[4] = this.modelMatrix[4]
					this.#prevModelMatrix[5] = this.modelMatrix[5]
					this.#prevModelMatrix[6] = this.modelMatrix[6]
					this.#prevModelMatrix[7] = this.modelMatrix[7]
					this.#prevModelMatrix[8] = this.modelMatrix[8]
					this.#prevModelMatrix[9] = this.modelMatrix[9]
					this.#prevModelMatrix[10] = this.modelMatrix[10]
					this.#prevModelMatrix[11] = this.modelMatrix[11]
					this.#prevModelMatrix[12] = this.modelMatrix[12]
					this.#prevModelMatrix[13] = this.modelMatrix[13]
					this.#prevModelMatrix[14] = this.modelMatrix[14]
					this.#prevModelMatrix[15] = this.modelMatrix[15]
				}
				gpuDevice.queue.writeBuffer(
					vertexUniformBuffer.gpuBuffer,
					vertexUniformInfoMembers.normalModelMatrix.uniformOffset,
					// new vertexUniformInfoMembers.normalModelMatrix.View(this.normalModelMatrix),
					this.normalModelMatrix as Float32Array
				)
				if (vertexUniformInfoMembers.localMatrix) {
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfoMembers.localMatrix.uniformOffset,
						// new vertexUniformInfoMembers.localMatrix.View(this.localMatrix),
						this.localMatrix as Float32Array
					)
				}
				dirtyTransformForChildren = true
				this.dirtyTransform = false
			}
			if (this.dirtyOpacity) {
				dirtyOpacityForChildren = true
				if (vertexUniformInfoMembers.combinedOpacity) {
					tempFloat32_1[0] = this.getCombinedOpacity()
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfoMembers.combinedOpacity.uniformOffset,
						// new vertexUniformInfoMembers.combinedOpacity.View([this.getCombinedOpacity()])
						tempFloat32_1
					);
				}
				this.dirtyOpacity = false
			}
			{
				if (currentMaterial.use2PathRender) {
					debugViewRenderState.render2PathLayer[debugViewRenderState.render2PathLayer.length] = this
				} else if (this.meshType === 'particle') {
					debugViewRenderState.particleLayer[debugViewRenderState.particleLayer.length] = this
				} else if (this.meshType === 'instanceMesh') {
					debugViewRenderState.instanceMeshLayer[debugViewRenderState.instanceMeshLayer.length] = this
				} else if (currentMaterial.transparent) {
					debugViewRenderState.transparentLayer[debugViewRenderState.transparentLayer.length] = this
				} else if (currentMaterial.alphaBlend === 2 || currentMaterial.opacity < 1 || !this.depthStencilState.depthWriteEnabled) {
					debugViewRenderState.alphaLayer[debugViewRenderState.alphaLayer.length] = this
				} else {
					let targetEncoder: GPURenderBundleEncoder | GPURenderPassEncoder = currentRenderPassEncoder
					let needBundleFinish = false
					if (!this.#bundleEncoder || this.dirtyPipeline || this.#prevSystemBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
						this.#bundleEncoder = gpuDevice.createRenderBundleEncoder({
							colorFormats: [navigator.gpu.getPreferredCanvasFormat(), navigator.gpu.getPreferredCanvasFormat(), 'rgba16float'],
							depthStencilFormat: 'depth32float',
							sampleCount: useMSAA ? 4 : 1,

						})
						needBundleFinish = true
						keepLog('갱신')
					}
					targetEncoder = this.#bundleEncoder
					debugViewRenderState.numDrawCalls++
					if (currentGeometry.indexBuffer) {
						const {indexBuffer} = currentGeometry
						const {indexCount, triangleCount} = indexBuffer
						debugViewRenderState.numTriangles += triangleCount
						debugViewRenderState.numPoints += indexCount
					} else {
						const {vertexBuffer} = currentGeometry
						const {vertexCount, triangleCount} = vertexBuffer
						debugViewRenderState.numTriangles += triangleCount;
						debugViewRenderState.numPoints += vertexCount
					}
					if (needBundleFinish) {
						this.#prevSystemBindGroup = view.systemUniform_Vertex_UniformBindGroup
						targetEncoder.setPipeline(pipeline)
						const {gpuBuffer} = currentGeometry.vertexBuffer
						const {fragmentUniformBindGroup} = currentMaterial.gpuRenderInfo
						targetEncoder.setVertexBuffer(0, gpuBuffer)
						targetEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
						targetEncoder.setBindGroup(1, vertexUniformBindGroup);
						targetEncoder.setBindGroup(2, fragmentUniformBindGroup)
						//
						if (currentGeometry.indexBuffer) {
							const {indexBuffer} = currentGeometry
							const {indexCount, gpuBuffer: indexGPUBuffer} = indexBuffer
							targetEncoder.setIndexBuffer(indexGPUBuffer, 'uint32')
							// @ts-ignore
							if (this.particleBuffers) targetEncoder.drawIndexed(indexCount, this.particleNum, 0, 0, 0);
							else targetEncoder.drawIndexed(indexCount, 1, 0, 0, 0);

						} else {
							const {vertexBuffer} = currentGeometry
							const {vertexCount} = vertexBuffer
							targetEncoder.draw(vertexCount, 1, 0, 0);
						}
						this.#renderBundle = (targetEncoder as GPURenderBundleEncoder).finish();
					}
					debugViewRenderState.renderBundleList[debugViewRenderState.renderBundleList.length] = this.#renderBundle
				}
			}
			{
				if (this.#eventsNum) {
					pickingManager.castingList[pickingManager.castingList.length] = this
				}
			}
		} else {
		}
		{
			if (this.castShadow || (this.castShadow && !currentGeometry)) castingList[castingList.length] = this
		}
		if (this.#enableDebugger) this.#drawDebugger.render(debugViewRenderState)
		// children render
		const {children} = this
		let i = 0
		const childNum = children.length
		// while (i--) {
		for (; i < childNum; i++) {
			if (dirtyTransformForChildren) children[i].dirtyTransform = dirtyTransformForChildren
			if (dirtyOpacityForChildren) children[i].dirtyOpacity = dirtyOpacityForChildren
			children[i].render(debugViewRenderState)
		}
	}


	#bundleEncoder: GPURenderBundleEncoder
	#renderBundle: GPURenderBundle
	#prevSystemBindGroup: GPUBindGroup

	initGPURenderInfos() {
		this.gpuRenderInfo = new VertexGPURenderInfo(
			null,
			null,
			null,
			null,
			null,
			null,
			null,
			null,
		)
		updateMeshDirtyPipeline(this)
	}

	createMeshVertexShaderModuleBASIC = (VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT_BASIC, vertexModuleSource): GPUShaderModule => {
		const {redGPUContext} = this
		const {gpuRenderInfo} = this
		if (gpuRenderInfo.vertexUniformInfo !== UNIFORM_STRUCT_BASIC) {
			gpuRenderInfo.vertexUniformInfo = UNIFORM_STRUCT_BASIC
			gpuRenderInfo.vertexStructInfo = SHADER_INFO
			createMeshVertexUniformBuffers(this)
		}
		gpuRenderInfo.vertexShaderSourceVariant = SHADER_INFO.shaderSourceVariant
		gpuRenderInfo.vertexShaderVariantConditionalBlocks = SHADER_INFO.conditionalBlocks
		gpuRenderInfo.vertexUniformBindGroup = redGPUContext.gpuDevice.createBindGroup(getBasicMeshVertexBindGroupDescriptor(this));
		this.#checkVariant(VERTEX_SHADER_MODULE_NAME)
		return this.gpuRenderInfo.vertexShaderModule
	}

	#checkVariant(moduleName: String) {
		const {gpuDevice, resourceManager} = this.redGPUContext
		// 현재 머티리얼 상태에 맞는 바리안트 키 찾기
		const currentVariantKey = this.#findMatchingVariantKey();
		// 바리안트별 셰이더 모듈 확인/생성
		const variantShaderModuleName = `${moduleName}_${currentVariantKey}`;
		let targetShaderModule = resourceManager.getGPUShaderModule(variantShaderModuleName);
		if (!targetShaderModule) {
			// 레이지 바리안트 생성기에서 바리안트 소스 코드 가져오기
			let variantSource = this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey);
			if (variantSource) {
				// keepLog('버텍스 바리안트 셰이더 모듈 생성:', currentVariantKey, variantShaderModuleName);
				if (this.animationInfo?.skinInfo) {
					const jointNum = `${this.animationInfo.skinInfo.joints.length}`
					variantSource = variantSource.replaceAll('#JOINT_NUM', jointNum)
					this.gpuRenderInfo.vertexShaderSourceVariant.getVariant(currentVariantKey)
					targetShaderModule = resourceManager.createGPUShaderModule(
						`${variantShaderModuleName}_${jointNum}`,
						{code: variantSource}
					);
				} else {
					targetShaderModule = resourceManager.createGPUShaderModule(
						variantShaderModuleName,
						{code: variantSource}
					);
				}
			} else {
				console.warn('⚠️ 버텍스 바리안트 소스를 찾을 수 없음:', currentVariantKey);
				targetShaderModule = this.gpuRenderInfo.vertexShaderModule; // 기본값 사용
			}
		} else {
			console.log('🚀 버텍스 바리안트 셰이더 모듈 캐시 히트:', currentVariantKey);
		}
		// 셰이더 모듈 업데이트
		this.gpuRenderInfo.vertexShaderModule = targetShaderModule;
	}

	#findMatchingVariantKey(): string {
		const {vertexShaderVariantConditionalBlocks} = this.gpuRenderInfo;
		// keepLog(this.gpuRenderInfo, vertexShaderVariantConditionalBlocks)
		// 현재 활성화된 기능들 확인 (vertexShaderVariantConditionalBlocks 기반)
		const activeFeatures = new Set<string>();
		// keepLog('vertexShaderVariantConditionalBlocks', vertexShaderVariantConditionalBlocks, this)
		// 실제 셰이더에서 발견된 조건부 블록들만 체크
		for (const uniformName of vertexShaderVariantConditionalBlocks) {
			if (this[uniformName]) {
				activeFeatures.add(uniformName);
			}
		}
		console.log('activeFeatures', activeFeatures, this);
		// 활성화된 기능들로부터 바리안트 키 생성
		const variantKey = activeFeatures.size > 0 ?
			Array.from(activeFeatures).sort().join('+') : 'none';
		if (activeFeatures.size) {
			console.log('선택된 바리안트:', variantKey, '(활성 기능:', Array.from(activeFeatures), ')');
		}
		return variantKey;
	}
}

Object.defineProperty(Mesh.prototype, 'meshType', {
	value: 'mesh',
	writable: false
});
DefineForVertex.defineByPreset(Mesh, [
	DefineForVertex.PRESET_BOOLEAN.RECEIVE_SHADOW
])
DefineForVertex.defineBoolean(Mesh, [
	['useDisplacementTexture', false],
	['disableJitter', false],
])
Object.freeze(Mesh)
export default Mesh
