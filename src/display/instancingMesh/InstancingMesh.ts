import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import RenderViewStateData from "../../renderer/RenderViewStateData";
import VertexGPURenderInfo from "../../renderInfos/VertexGPURenderInfo";
import StorageBuffer from "../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../resources/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import createBasePipeline from "../mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../mesh/core/pipeline/PIPELINE_TYPE";
import Mesh from "../mesh/Mesh";
import MESH_TYPE from "../MESH_TYPE";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
import vertexModuleSource from './shader/instanceMeshVertex.wgsl';

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_INSTANCING'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_INSTANCING'
/**
 * GPU 인스턴싱 기반의 메시 클래스입니다.
 *
 * 하나의 geometry와 material을 여러 인스턴스(Instance)로 효율적으로 렌더링할 수 있습니다.
 *
 * 각 인스턴스는 transform(위치, 회전, 스케일)만 다르고 geometry/vertex 데이터와 머티리얼은 공유합니다.
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/basic/"></iframe>
 * @category Mesh
 */
class InstancingMesh extends Mesh {
	/** RedGPU 컨텍스트 인스턴스 */
	readonly #redGPUContext: RedGPUContext
	/** 인스턴스 개수 */
	#instanceCount: number = 1
	/** 인스턴스별 transform/계층 구조를 관리하는 객체 배열 */
	#instanceChildren: InstancingMeshObject3D[] = []

	/**
	 * InstancingMesh 인스턴스를 생성합니다.
	 * @param redGPUContext RedGPU 컨텍스트
	 * @param instanceCount 인스턴스 개수
	 * @param geometry geometry 또는 primitive 객체(선택)
	 * @param material 머티리얼(선택)
	 */
	constructor(redGPUContext: RedGPUContext, instanceCount: number, geometry?: Geometry | Primitive, material?) {
		super(redGPUContext, geometry, material)
		this.#redGPUContext = redGPUContext
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
		this.instanceCount = instanceCount
		this.#initGPURenderInfos(redGPUContext)
	}

	/**
	 * 인스턴스 개수를 반환합니다.
	 */
	get instanceCount(): number {
		return this.#instanceCount;
	}

	/**
	 * 인스턴스 개수를 설정합니다. (버퍼 및 인스턴스 객체 자동 갱신)
	 * @param count 인스턴스 개수
	 */
	set instanceCount(count: number) {
		validateUintRange(count)
		this.gpuRenderInfo.vertexUniformInfo = parseWGSL(vertexModuleSource).storage.instanceUniforms
		console.log(this.gpuRenderInfo.vertexUniformInfo)
		// 신규데이터
		const newData = new ArrayBuffer(this.gpuRenderInfo.vertexUniformInfo.arrayBufferByteLength)
		const newBuffer = new StorageBuffer(
			this.#redGPUContext,
			newData,
			`InstanceBuffer_${this.uuid}`,
		)
		// 기존데이터
		const prevBuffer = this.gpuRenderInfo.vertexUniformBuffer
		if (prevBuffer?.gpuBuffer) {
			copyGPUBuffer(this.#redGPUContext.gpuDevice, prevBuffer.gpuBuffer, newBuffer.gpuBuffer)
		}
		prevBuffer?.destroy()
		this.gpuRenderInfo.vertexUniformBuffer = newBuffer
		// 데이터가 없으면 채워넣음
		let i = count
		while (i--) {
			if (!this.#instanceChildren[i]) this.#instanceChildren[i] = new InstancingMeshObject3D(this.#redGPUContext, i, this)
		}
		this.#instanceCount = count;
		this.#initGPURenderInfos(this.#redGPUContext)
	}

	/**
	 * 인스턴스별 transform/계층 구조를 관리하는 객체 배열을 반환합니다.
	 */
	get instanceChildren(): InstancingMeshObject3D[] {
		return this.#instanceChildren;
	}

	/**
	 * 인스턴싱 메시의 렌더링을 수행합니다.
	 * @param debugViewRenderState 렌더 상태 데이터
	 * @param shadowRender 그림자 렌더링 여부
	 */
	render(debugViewRenderState: RenderViewStateData, shadowRender: boolean = false) {
		const {view, currentRenderPassEncoder,} = debugViewRenderState;
		const {scene} = view
		const {shadowManager} = scene
		const {directionalShadowManager} = shadowManager
		const {castingList} = directionalShadowManager
		const parent = this.parent
		let tempDirtyTransform = this.dirtyTransform
		if (tempDirtyTransform) {
			mat4.identity(this.localMatrix);
			mat4.translate(this.localMatrix, this.localMatrix, [this.x, this.y, this.z]);
			mat4.rotateX(this.localMatrix, this.localMatrix, this.rotationX);
			mat4.rotateY(this.localMatrix, this.localMatrix, this.rotationY);
			mat4.rotateZ(this.localMatrix, this.localMatrix, this.rotationZ);
			mat4.scale(this.localMatrix, this.localMatrix, [this.scaleX, this.scaleY, this.scaleZ]);
			{
				if (parent?.modelMatrix) {
					mat4.multiply(this.modelMatrix, this.localMatrix, parent.modelMatrix);
				} else {
					this.modelMatrix = mat4.clone(this.localMatrix)
				}
			}
		}
		if (this.geometry) debugViewRenderState.num3DObjects++
		else debugViewRenderState.num3DGroups++
		const redGPUContext = this.#redGPUContext
		if (this.geometry) {
			const {antialiasingManager, gpuDevice} = redGPUContext
			if (antialiasingManager.changedMSAA) {
				this.dirtyPipeline = true
			}
			if (!this.gpuRenderInfo) this.#initGPURenderInfos(redGPUContext)
			const dirtyPipeline: boolean = this.dirtyPipeline || this.material.dirtyPipeline
			const {displacementTexture, displacementScale} = this.material || {}
			if (dirtyPipeline) {
				this.dirtyTransform = true
				if (this.material.dirtyPipeline) this.material._updateFragmentState()
				this.#updatePipelines()
				this.material.dirtyPipeline = false
				this.dirtyPipeline = false
				debugViewRenderState.numDirtyPipelines++
			}
			const {gpuRenderInfo} = this
			const {
				vertexUniformBuffer,
				vertexUniformBindGroup,
				vertexUniformInfo,
				pipeline,
				shadowPipeline
			} = gpuRenderInfo
			{
				//TODO 여기 개선
				if (vertexUniformInfo.members.displacementScale !== undefined) {
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfo.members.displacementScale.uniformOffset,
						new vertexUniformInfo.members.displacementScale.View([displacementScale])
					);
				}
				if (vertexUniformInfo.members.useDisplacementTexture !== undefined) {
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfo.members.useDisplacementTexture.uniformOffset,
						new vertexUniformInfo.members.useDisplacementTexture.View([displacementTexture ? 1 : 0])
					);
				}
			}
			if (this.dirtyTransform) {
				gpuDevice.queue.writeBuffer(
					vertexUniformBuffer.gpuBuffer,
					vertexUniformInfo.members.instanceGroupModelMatrix.uniformOffset,
					new vertexUniformInfo.members.instanceGroupModelMatrix.View(this.modelMatrix),
				)
			}
			this.dirtyTransform = false
			//
			currentRenderPassEncoder.setPipeline(shadowRender ? shadowPipeline : pipeline)
			const {gpuBuffer} = this.geometry.vertexBuffer
			const {fragmentUniformBindGroup} = this.material.gpuRenderInfo
			if (debugViewRenderState.prevVertexGpuBuffer !== gpuBuffer) {
				currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer)
				debugViewRenderState.prevVertexGpuBuffer = gpuBuffer
			}
			currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
			currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup)
			//
			debugViewRenderState.numDrawCalls++
			debugViewRenderState.numInstances++
			//
			if (this.geometry.indexBuffer) {
				const {indexBuffer} = this.geometry
				const {indexCount, triangleCount, gpuBuffer: indexGPUBuffer,format} = indexBuffer
				currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer,format)
				currentRenderPassEncoder.drawIndexed(indexCount, this.#instanceCount, 0, 0, 0);
				debugViewRenderState.numTriangles += triangleCount * this.#instanceCount
				debugViewRenderState.numPoints += indexCount * this.#instanceCount
			} else {
				const {vertexBuffer} = this.geometry
				const {vertexCount, triangleCount} = vertexBuffer
				currentRenderPassEncoder.draw(vertexCount, this.#instanceCount, 0, 0);
				debugViewRenderState.numTriangles += triangleCount;
				debugViewRenderState.numPoints += vertexCount
			}
		} else {
		}
		if (this.castShadow) castingList[castingList.length] = this
		const {children} = this
		let i = children.length
		while (i--) {
			children[i].dirtyTransform = tempDirtyTransform
			children[i].render(debugViewRenderState)
		}
		this.dirtyTransform = false
	}

	/**
	 * GPU 렌더링 정보 및 파이프라인을 초기화합니다.
	 * @param redGPUContext RedGPU 컨텍스트
	 * @private
	 */
	#initGPURenderInfos(redGPUContext: RedGPUContext) {
		this.dirtyPipeline = true
		const {resourceManager} = this.#redGPUContext
		const vertex_BindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
			ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing
		)
		const {basicSampler, emptyBitmapTextureView, emptyCubeTextureView} = resourceManager
		const {gpuSampler: basicGPUSampler} = basicSampler
		const {vertexUniformBuffer} = this.gpuRenderInfo
		const {material} = this
		// BindGroup 을 생성합니다.
		const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: vertex_BindGroupLayout,
			label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
			entries: [{
				binding: 0,
				resource: {
					buffer: vertexUniformBuffer.gpuBuffer,
					offset: 0,
					size: vertexUniformBuffer.size
				},
			},
				{
					binding: 1,
					resource: material?.displacementTextureSampler?.gpuSampler || basicGPUSampler
				},
				{
					binding: 2,
					resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
				}
			]
		}
		const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.#updatePipelines()
		this.gpuRenderInfo.vertexBindGroupLayout = vertex_BindGroupLayout
		this.gpuRenderInfo.vertexUniformBindGroup = vertexUniformBindGroup
	}

	/**
	 * 파이프라인 및 셰이더 모듈을 갱신합니다.
	 * @private
	 */
	#updatePipelines() {
		const {resourceManager,} = this.#redGPUContext
		// 셰이더 모듈 설명자를 생성합니다.
		const vModuleDescriptor: GPUShaderModuleDescriptor = {code: vertexModuleSource}
		const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
			VERTEX_SHADER_MODULE_NAME,
			vModuleDescriptor
		)
		const {vertexUniformBuffer} = this.gpuRenderInfo
		const {material} = this
		const {basicSampler, emptyBitmapTextureView, emptyCubeTextureView} = resourceManager
		const {gpuSampler: basicGPUSampler} = basicSampler
		const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
			ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing
		)
		const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: vertexBindGroupLayout,
			label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: vertexUniformBuffer.gpuBuffer,
						offset: 0,
						size: vertexUniformBuffer.size
					},
				},
				{
					binding: 1,
					resource: material?.displacementTextureSampler?.gpuSampler || basicGPUSampler
				},
				{
					binding: 2,
					resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
				}
			]
		}
		this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.gpuRenderInfo.vertexShaderModule = vertexShaderModule
		this.gpuRenderInfo.pipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout)
		this.gpuRenderInfo.shadowPipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout, PIPELINE_TYPE.SHADOW)
	}
}

/**
 * 이 객체가 인스턴싱 메시 타입임을 나타내는 플래그입니다.\
 * geometry/vertex 데이터와 material을 공유하며, transform만 개별적으로 관리하는 구조임을 구분하기 위해 사용됩니다.
 */
Object.defineProperty(InstancingMesh.prototype, 'meshType', {
	value: MESH_TYPE.INSTANCED_MESH,
	writable: false
});
export default InstancingMesh
