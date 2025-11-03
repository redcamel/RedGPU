import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import RenderViewStateData from "../view/core/RenderViewStateData";
import VertexGPURenderInfo from "../mesh/core/VertexGPURenderInfo";
import StorageBuffer from "../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import copyGPUBuffer from "../../utils/copyGPUBuffer";
import createBasePipeline from "../mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../mesh/core/pipeline/PIPELINE_TYPE";
import Mesh from "../mesh/Mesh";
import MESH_TYPE from "../MESH_TYPE";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
import vertexModuleSource from './shader/instanceMeshVertex.wgsl';
import cullingComputeSource from './shader/instanceCullingCompute.wgsl';

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_INSTANCING'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_INSTANCING'
const CULLING_COMPUTE_MODULE_NAME = 'CULLING_COMPUTE_MODULE_INSTANCING'

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
	#displacementScale: number
	#useDisplacementTexture: boolean
	#renderBundle: GPURenderBundle
	#shadowRenderBundle: GPURenderBundle

	// GPU Culling 관련
	#cullingComputePipeline: GPUComputePipeline
	#cullingBindGroup: GPUBindGroup
	#visibilityBuffer: StorageBuffer
	#indirectDrawBuffer: GPUBuffer
	#cullingUniformBuffer: StorageBuffer

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
		this.#initGPUCulling(redGPUContext)
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
		this.#initGPUCulling(this.#redGPUContext)
	}

	/**
	 * 인스턴스별 transform/계층 구조를 관리하는 객체 배열을 반환합니다.
	 */
	get instanceChildren(): InstancingMeshObject3D[] {
		return this.#instanceChildren;
	}

	/**
	 * GPU Culling 초기화
	 */
	#initGPUCulling(redGPUContext: RedGPUContext) {
		const {gpuDevice, resourceManager} = redGPUContext

		// Visibility 버퍼 생성 (각 인스턴스의 가시성 플래그)


		// Indirect Draw 버퍼 생성
		this.#indirectDrawBuffer = gpuDevice.createBuffer({
			size: 20, // 5 * 4 bytes (vertexCount, instanceCount, firstVertex, firstInstance, padding)
			usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
			label: `IndirectDrawBuffer_${this.uuid}`
		})

		// Culling 유니폼 버퍼 (프러스텀 평면 정보 + instanceCount)
		// 6 planes * 4 components + 1 instanceCount + 3 padding = 28 floats = 112 bytes
		const cullingUniformData = new Float32Array(28)
		this.#cullingUniformBuffer = new StorageBuffer(
			redGPUContext,
			cullingUniformData.buffer,
			`CullingUniformBuffer_${this.uuid}`
		)

		// Compute 쉐이더 모듈 생성
		const computeModuleDescriptor: GPUShaderModuleDescriptor = {code: cullingComputeSource}
		const computeShaderModule = resourceManager.createGPUShaderModule(
			CULLING_COMPUTE_MODULE_NAME,
			computeModuleDescriptor
		)

		// Compute 파이프라인 생성
		const computeBindGroupLayout = gpuDevice.createBindGroupLayout({
			entries: [
				{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}}, // instanceUniforms
				{binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}}, // cullingUniforms
				{binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}}, // visibilityBuffer
				{binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}}, // indirectDrawBuffer
			]
		})

		this.#cullingComputePipeline = gpuDevice.createComputePipeline({
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [computeBindGroupLayout]
			}),
			compute: {
				module: computeShaderModule,
				entryPoint: 'main'
			}
		})

		// Compute 바인드 그룹 생성
		this.#cullingBindGroup = gpuDevice.createBindGroup({
			layout: computeBindGroupLayout,
			entries: [
				{binding: 0, resource: {buffer: this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer}},
				{binding: 1, resource: {buffer: this.#cullingUniformBuffer.gpuBuffer}},
				{binding: 2, resource: {buffer: this.#visibilityBuffer.gpuBuffer}},
				{binding: 3, resource: {buffer: this.#indirectDrawBuffer}},
			]
		})
	}

	/**
	 * 프러스텀 평면 계산 및 업데이트
	 */
	#updateCullingUniforms(renderViewStateData: RenderViewStateData) {
		const {view} = renderViewStateData


		this.#redGPUContext.gpuDevice.queue.writeBuffer(
			this.#cullingUniformBuffer.gpuBuffer,
			0,
			new Float32Array(view.frustumPlanes.flat())
		)
	}

	/**
	 * Compute Shader를 통한 GPU Culling 실행
	 */
	#performGPUCulling(renderViewStateData: RenderViewStateData) {
		const {gpuDevice} = this.#redGPUContext

		// Culling 유니폼 업데이트
		this.#updateCullingUniforms(renderViewStateData)

		// Indirect Draw 버퍼 초기화
		const indexCount = this.geometry.indexBuffer ? this.geometry.indexBuffer.indexCount : this.geometry.vertexBuffer.vertexCount
		const indirectDrawData = new Uint32Array([indexCount, 0, 0, 0, 0])
		gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, indirectDrawData)

		// Compute Pass 생성
		const commandEncoder = gpuDevice.createCommandEncoder()
		const computePass = commandEncoder.beginComputePass()

		computePass.setPipeline(this.#cullingComputePipeline)
		computePass.setBindGroup(0, this.#cullingBindGroup)

		const workgroupSize = 64
		const workgroupCount = Math.ceil(this.#instanceCount / workgroupSize)
		computePass.dispatchWorkgroups(workgroupCount)

		computePass.end()
		gpuDevice.queue.submit([commandEncoder.finish()])
	}

	/**
	 * 인스턴싱 메시의 렌더링을 수행합니다.
	 * @param renderViewStateData 렌더 상태 데이터
	 */
	render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false) {
		const {view, currentRenderPassEncoder,} = renderViewStateData;
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
		if (this.geometry) renderViewStateData.num3DObjects++
		else renderViewStateData.num3DGroups++
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
				renderViewStateData.numDirtyPipelines++
			}

			// GPU Culling 수행
			if (!shadowRender) {
				this.#performGPUCulling(renderViewStateData)
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
				if (vertexUniformInfo.members.displacementScale !== undefined && this.#displacementScale !== displacementScale) {
					this.#displacementScale !== displacementScale
					gpuDevice.queue.writeBuffer(
						vertexUniformBuffer.gpuBuffer,
						vertexUniformInfo.members.displacementScale.uniformOffset,
						new vertexUniformInfo.members.displacementScale.View([displacementScale])
					);
				}
				if (vertexUniformInfo.members.useDisplacementTexture !== undefined && this.#useDisplacementTexture !== !!displacementTexture) {
					this.#useDisplacementTexture = !!displacementTexture
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

			renderViewStateData.numDrawCalls++
			renderViewStateData.numInstances++

			// Indirect Draw 사용
			const {gpuBuffer} = this.geometry.vertexBuffer
			const {fragmentUniformBindGroup} = this.material.gpuRenderInfo

			currentRenderPassEncoder.setPipeline(shadowRender ? shadowPipeline : pipeline)
			currentRenderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup);
			currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer)
			currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
			currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup)

			if (this.geometry.indexBuffer) {
				const {indexBuffer} = this.geometry
				const {gpuBuffer: indexGPUBuffer, format} = indexBuffer
				currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format)
				currentRenderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, 0);
			} else {
				currentRenderPassEncoder.drawIndirect(this.#indirectDrawBuffer, 0);
			}
		}
		if (this.castShadow) castingList[castingList.length] = this
		const {children} = this
		let i = children.length
		while (i--) {
			children[i].dirtyTransform = tempDirtyTransform
			children[i].render(renderViewStateData)
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
		const visibilityData = new Uint32Array(this.#instanceCount)
		this.#visibilityBuffer = new StorageBuffer(
			redGPUContext,
			visibilityData.buffer,
			`VisibilityBuffer_${this.uuid}`
		)
		const vertexBindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: vertex_BindGroupLayout,
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
				},
				{
					binding: 3,
					resource: {
						buffer: this.#visibilityBuffer.gpuBuffer,
						offset: 0,
						size: this.#visibilityBuffer.size
					}
				}
			]
		}
		const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.#updatePipelines()
		this.gpuRenderInfo.vertexBindGroupLayout = vertex_BindGroupLayout
		this.gpuRenderInfo.vertexUniformBindGroup = vertexUniformBindGroup
	}

	/**
	 * 파이프라인 및 쉐이더 모듈을 갱신합니다.
	 * @private
	 */
	#updatePipelines() {
		const {resourceManager,} = this.#redGPUContext
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
				},
				{
					binding: 3,
					resource: {
						buffer: this.#visibilityBuffer.gpuBuffer,
						offset: 0,
						size: this.#visibilityBuffer.size
					}
				}
			]
		}
		this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
		this.gpuRenderInfo.vertexShaderModule = vertexShaderModule
		this.gpuRenderInfo.pipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout)
		this.gpuRenderInfo.shadowPipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout, PIPELINE_TYPE.SHADOW)
	}
}

Object.defineProperty(InstancingMesh.prototype, 'meshType', {
	value: MESH_TYPE.INSTANCED_MESH,
	writable: false
});
export default InstancingMesh
