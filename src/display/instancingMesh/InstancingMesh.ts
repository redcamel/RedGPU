import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import StorageBuffer from "../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import {keepLog} from "../../utils";
import createBasePipeline from "../mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../mesh/core/pipeline/PIPELINE_TYPE";
import VertexGPURenderInfo from "../mesh/core/VertexGPURenderInfo";
import Mesh from "../mesh/Mesh";
import MESH_TYPE from "../MESH_TYPE";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
import LODManager from "./LODManager";
import cullingComputeSource from './shader/instanceCullingCompute.wgsl';
import vertexModuleSource from './shader/instanceMeshVertex.wgsl';

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
	dirtyInstanceMeshObject3D: boolean = true
	dirtyInstanceNum: boolean = true
	/** RedGPU 컨텍스트 인스턴스 */
	readonly #redGPUContext: RedGPUContext
	/** 인스턴스 개수 */
	#instanceCount: number = 1
	#maxInstanceCount: number = 1
	/** 인스턴스별 transform/계층 구조를 관리하는 객체 배열 */
	#instanceChildren: InstancingMeshObject3D[] = []
	#displacementScale: number
	#useDisplacementTexture: boolean
	// GPU Culling 관련
	#cullingComputePipeline: GPUComputePipeline
	#cullingBindGroup: GPUBindGroup
	#visibilityBuffer: StorageBuffer
	#indirectDrawBuffer: GPUBuffer
	#cullingUniformBuffer: StorageBuffer
	#lodManager: LODManager = new LODManager()
	#vertexUniformBindGroup_LODList: GPUBindGroup[] = []
	dirtyLOD: boolean

	/**
	 * InstancingMesh 인스턴스를 생성합니다.
	 * @param redGPUContext RedGPU 컨텍스트
	 * @param instanceCount 인스턴스 개수
	 * @param geometry geometry 또는 primitive 객체(선택)
	 * @param material 머티리얼(선택)
	 */
	constructor(redGPUContext: RedGPUContext, maxInstanceCount: number, instanceCount: number, geometry?: Geometry | Primitive, material?) {
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
		this.#instanceCount = maxInstanceCount
		this.maxInstanceCount = maxInstanceCount
		this.instanceCount = instanceCount
	}

	get lodManager(): LODManager {
		return this.#lodManager;
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
		this.#instanceCount = Math.min(count, this.#maxInstanceCount)
		this.gpuRenderInfo.vertexUniformInfo = parseWGSL(this.#getVertexModuleSource()).storage.instanceUniforms
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
			// copyGPUBuffer(this.#redGPUContext.gpuDevice, prevBuffer.gpuBuffer, newBuffer.gpuBuffer)
			newBuffer.dataViewF32.set(prevBuffer.dataViewF32, 0)
			newBuffer.dataViewU32.set([prevBuffer.dataViewU32[0]], 0)
			newBuffer.dataViewU32.set([prevBuffer.dataViewU32[1]], 4)
		}
		// keepLog(newBuffer)
		prevBuffer?.destroy()
		this.gpuRenderInfo.vertexUniformBuffer = newBuffer
		// 기존 인스턴스 삭제
		if (this.#instanceChildren.length > this.#instanceCount) {
			this.#instanceChildren.length = this.#instanceCount
		}
		// 데이터가 없으면 채워넣음
		let i = this.#instanceCount
		while (i--) {
			if (!this.#instanceChildren[i]) this.#instanceChildren[i] = new InstancingMeshObject3D(this.#redGPUContext, i, this)
		}
		this.#initGPURenderInfos(this.#redGPUContext)
		this.#initGPUCulling(this.#redGPUContext)
		this.dirtyInstanceNum = true
	}

	get maxInstanceCount(): number {
		return this.#maxInstanceCount;
	}

	set maxInstanceCount(count: number) {
		validateUintRange(count)
		const limitNum = InstancingMesh.getLimitSize()
		count = Math.min(count, limitNum)
		this.#maxInstanceCount = count;
		if (this.#instanceCount > this.#maxInstanceCount) {
			this.instanceCount = this.#maxInstanceCount
		}
	}

	/**
	 * 인스턴스별 transform/계층 구조를 관리하는 객체 배열을 반환합니다.
	 */
	get instanceChildren(): InstancingMeshObject3D[] {
		return this.#instanceChildren;
	}

	static getLimitSize() {
		const headSize = (16 + 1 + 1 + 2) * 4
		const perInstanceSize = (16 + 16 + 1) * 4
		const maxStorageBufferBindingSize = Math.floor(Math.min(
			268435456,           // 256MB
			134217728  // 128MB
		))
		const limitNum = Math.floor((maxStorageBufferBindingSize - headSize) / perInstanceSize)
		return limitNum
	}

	/**
	 * 인스턴싱 메시의 렌더링을 수행합니다.
	 * @param renderViewStateData 렌더 상태 데이터
	 */
	render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false) {
		if (this.dirtyLOD) {
			this.#initGPURenderInfos(this.#redGPUContext)
			this.#initGPUCulling(this.#redGPUContext)
			this.dirtyInstanceNum = true
			this.dirtyLOD = false
			return
		}
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
					vertexUniformBuffer.dataViewF32.set(
						new vertexUniformInfo.members.displacementScale.View([displacementScale]),
						vertexUniformInfo.members.displacementScale.uniformOffset / 4
					)
				}
				if (vertexUniformInfo.members.useDisplacementTexture !== undefined && this.#useDisplacementTexture !== !!displacementTexture) {
					this.#useDisplacementTexture = !!displacementTexture
					vertexUniformBuffer.dataViewF32.set(
						new vertexUniformInfo.members.useDisplacementTexture.View([displacementTexture ? 1 : 0]),
						vertexUniformInfo.members.useDisplacementTexture.uniformOffset / 4
					)
				}
			}
			if (this.dirtyTransform) {
				vertexUniformBuffer.dataViewF32.set(this.modelMatrix, vertexUniformInfo.members.instanceGroupModelMatrix.uniformOffset / 4)
				gpuDevice.queue.writeBuffer(
					vertexUniformBuffer.gpuBuffer,
					vertexUniformInfo.members.instanceGroupModelMatrix.uniformOffset,
					new vertexUniformInfo.members.instanceGroupModelMatrix.View(this.modelMatrix),
				)
			}
			if (this.dirtyInstanceMeshObject3D || this.dirtyInstanceNum) {
				this.#redGPUContext.gpuDevice.queue.writeBuffer(
					this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer,
					0,
					this.gpuRenderInfo.vertexUniformBuffer.data,
				)
				keepLog('실행되냐')
				this.dirtyInstanceMeshObject3D = false
				this.dirtyInstanceNum = false
			}
			renderViewStateData.numDrawCalls++
			renderViewStateData.numInstances++
			// Indirect Draw 사용
			const {gpuBuffer} = this.geometry.vertexBuffer
			const {fragmentUniformBindGroup} = this.material.gpuRenderInfo
			currentRenderPassEncoder.setPipeline(shadowRender ? shadowPipeline : pipeline)
			currentRenderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup);
			currentRenderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
			currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup)
			currentRenderPassEncoder.setVertexBuffer(0, gpuBuffer)

            const indirectArgsSize = 20;
            if (this.geometry.indexBuffer) {
                const {indexBuffer} = this.geometry
                const {gpuBuffer: indexGPUBuffer, format} = indexBuffer
                currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format)
                currentRenderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, 0);
            } else {
                currentRenderPassEncoder.drawIndirect(this.#indirectDrawBuffer, 0);
            }
            {
                this.lodManager.lodList.forEach(((lod, index) => {
                    const {vertexBuffer, indexBuffer} = lod.geometry
                    const lodOffset = indirectArgsSize * (index + 1);
                    currentRenderPassEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer)
                    currentRenderPassEncoder.setBindGroup(1, this.#vertexUniformBindGroup_LODList[index]);
                    if (indexBuffer) {
                        const {gpuBuffer: indexGPUBuffer, format} = indexBuffer
                        currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, format)
                        currentRenderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, lodOffset);
                    } else {
                        currentRenderPassEncoder.drawIndirect(this.#indirectDrawBuffer, lodOffset);
                    }
                }))
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

	#getVertexModuleSource() {
		return vertexModuleSource.replaceAll(/__INSTANCE_COUNT__/g, this.#maxInstanceCount.toString())
	}

	#getCullingComputeSource() {
		return cullingComputeSource.replaceAll(/__INSTANCE_COUNT__/g, this.#maxInstanceCount.toString())
	}


    /**
     * GPU Culling 초기화
     */
    #initGPUCulling(redGPUContext: RedGPUContext) {
        const {gpuDevice, resourceManager} = redGPUContext
        // Indirect Draw 버퍼 생성 (통합된 버퍼)
        this.#indirectDrawBuffer?.destroy()

        // 각 IndirectDrawArgs는 5개의 u32 (20 bytes)
        const indirectDrawArgsSize = 20;
        // 기본(LOD 0) + LOD 개수만큼 공간 확보
        const totalIndirectSize = indirectDrawArgsSize * (1 + this.#lodManager.lodList.length);

        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            size: totalIndirectSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: `IndirectDrawBuffer_${this.uuid}`
        });

        const rawStride = this.#instanceCount * 4; // 바이트
        const strideBytes = Math.ceil(rawStride / 256) * 256; // 바이트 (256 정렬)
        const strideU32 = strideBytes / 4;
        const cullingUniformData = new Float32Array(41);
        cullingUniformData[0] = this.#instanceCount; // instanceNum
        const u32View = new Uint32Array(cullingUniformData.buffer);
        u32View[1] = strideU32; // visibility stride
        this.#cullingUniformBuffer = new StorageBuffer(
            redGPUContext,
            cullingUniformData.buffer,
            `CullingUniformBuffer_${this.uuid}`
        )
        // Compute 쉐이더 모듈 생성
        const computeModuleDescriptor: GPUShaderModuleDescriptor = {code: this.#getCullingComputeSource()}
        const computeShaderModule = resourceManager.createGPUShaderModule(
            `${CULLING_COMPUTE_MODULE_NAME}_${this.#maxInstanceCount}_${this.uuid}`,
            computeModuleDescriptor
        )
        // Compute 파이프라인 생성
        const computeBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}}, // instanceUniforms
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}}, // cullingUniforms
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}}, // visibilityBuffer
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}}, // indirectDrawBuffer (통합)
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
			32,
			new Float32Array(view.frustumPlanes.flat())
		)
		this.#redGPUContext.gpuDevice.queue.writeBuffer(
			this.#cullingUniformBuffer.gpuBuffer,
			16,
			new Float32Array(view.rawCamera.position)
		)
		this.#redGPUContext.gpuDevice.queue.writeBuffer(
			this.#cullingUniformBuffer.gpuBuffer,
			0,
			new Float32Array([this.#instanceCount])
		)

        this.#redGPUContext.gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer.gpuBuffer,
            128,
            new Float32Array([...this.#lodManager.lodList.map(lod=> lod.distance)])
        )
        this.#redGPUContext.gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer.gpuBuffer,
            156,
            new Uint32Array([this.#lodManager.lodList.length])
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

        // 각 IndirectDrawArgs 크기 (20 bytes)
        const indirectArgsSize = 20;

        // LOD 0 (기본) 초기화
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, indirectDrawData);

        // LOD 리스트 초기화
        this.#lodManager.lodList.forEach((lod, index) => {
            const lodIndexCount = lod.geometry.indexBuffer.indexCount
            const lodIndirectData = new Uint32Array([lodIndexCount, 0, 0, 0, 0])
            const offset = indirectArgsSize * (index + 1);
            gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, offset, lodIndirectData)
        })

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
		{
			const lodCount = this.#lodManager.lodList.length;
			const instanceCount = this.#instanceCount;
			const bytesPerInstance = 4; // Uint32 = 4 bytes
			// LOD별 stride 계산 (256바이트 정렬)
			const rawStride = instanceCount * bytesPerInstance;
			const stride = Math.ceil(rawStride / 256) * 256;
			const lodSize = stride * lodCount; // LOD들을 위한 추가 공간
			const totalSize = stride + lodSize;
// Uint32Array로 생성 (주의: stride는 바이트 단위이므로 요소 수로 변환)
			const visibilityData = new ArrayBuffer(totalSize);
			this.#visibilityBuffer?.destroy();
			this.#visibilityBuffer = new StorageBuffer(
				redGPUContext,
				visibilityData, // ArrayBuffer 전달
				`VisibilityBuffer_${this.uuid}`
			);
		}
		const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(this.#getVertexBindGroupDescriptor())
		this.#updatePipelines()
		this.gpuRenderInfo.vertexBindGroupLayout = vertex_BindGroupLayout
		this.gpuRenderInfo.vertexUniformBindGroup = vertexUniformBindGroup
	}

	#getVertexBindGroupDescriptor(index: number = 0): GPUBindGroupDescriptor {
		const {resourceManager,} = this.#redGPUContext
		const {vertexUniformBuffer} = this.gpuRenderInfo
		const {material} = this
		const {basicSampler, emptyBitmapTextureView, emptyCubeTextureView} = resourceManager
		const {gpuSampler: basicGPUSampler} = basicSampler
		const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
			ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing
		)
		const rawStride = this.#instanceCount * 4; // 4 bytes per instance
		const stride = Math.ceil(rawStride / 256) * 256; // 바이트 단위
		const offset = stride * index; // 바이트 단위
		const size = stride; // 바이트 단위
		keepLog(this.#lodManager.lodList.length)
		if (offset + size > this.#visibilityBuffer.size) {
			throw new Error("Binding range exceeds visibility buffer size.");
		}
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
						offset,
						size
					}
				}
			]
		}
		return vertexBindGroupDescriptor
	}

	/**
	 * 파이프라인 및 쉐이더 모듈을 갱신합니다.
	 * @private
	 */
	#updatePipelines() {
		const {resourceManager,} = this.#redGPUContext
		const vModuleDescriptor: GPUShaderModuleDescriptor = {code: this.#getVertexModuleSource()}
		const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
			`${VERTEX_SHADER_MODULE_NAME}_${this.#maxInstanceCount}_${this.uuid}`,
			vModuleDescriptor
		)
		const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
			ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing
		)
		this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(this.#getVertexBindGroupDescriptor())
		this.#lodManager.lodList.forEach((lod, index) => {
			this.#vertexUniformBindGroup_LODList[index] = this.redGPUContext.gpuDevice.createBindGroup(this.#getVertexBindGroupDescriptor(index + 1))
		})
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
