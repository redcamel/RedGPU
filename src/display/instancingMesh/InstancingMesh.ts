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
import vertexModuleSource from './shader/instanceMeshVertex.wgsl';
import InstancingMeshObject3D from "./InstancingMeshObject3D";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_INSTANCING'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_INSTANCING'

class InstancingMesh extends Mesh {
    #prevUseMSAA: boolean = true
    readonly #redGPUContext: RedGPUContext
    #instanceCount: number = 1
    #instanceChildren: InstancingMeshObject3D[] = []

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
        )
        this.instanceCount = instanceCount
        this.#initGPURenderInfos(redGPUContext)

    }

    get instanceCount(): number {
        return this.#instanceCount;
    }

    set instanceCount(count: number) {
        validateUintRange(count)
        this.gpuRenderInfo.vertexUniformInfo = parseWGSL(vertexModuleSource).storage.instanceUniforms
        console.log(this.gpuRenderInfo.vertexUniformInfo)
        // 신규데이터
        const newData = new ArrayBuffer(this.gpuRenderInfo.vertexUniformInfo.arrayBufferByteLength)
        const newBuffer = new StorageBuffer(
            this.#redGPUContext,
            newData,
            this.name
        )
        // 기존데이터
        const prevBuffer = this.gpuRenderInfo.vertexUniformBuffer
        if (prevBuffer?.gpuBuffer) copyGPUBuffer(this.#redGPUContext.gpuDevice, prevBuffer.gpuBuffer, newBuffer.gpuBuffer)
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

    get instanceChildren(): InstancingMeshObject3D[] {
        return this.#instanceChildren;
    }

    render(debugViewRenderState: RenderViewStateData, shadowRender: boolean = false) {
        const {view, currentRenderPassEncoder,} = debugViewRenderState;
        const {scene} = view
        const {shadowManager} = scene
        const {castingList} = shadowManager
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
            const {useMSAA, gpuDevice} = redGPUContext
            if (useMSAA !== this.#prevUseMSAA) {
                this.#prevUseMSAA = useMSAA
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
                const {indexNum, triangleCount, gpuBuffer: indexGPUBuffer} = indexBuffer
                currentRenderPassEncoder.setIndexBuffer(indexGPUBuffer, 'uint32')
                currentRenderPassEncoder.drawIndexed(indexNum, this.#instanceCount, 0, 0, 0);
                debugViewRenderState.numTriangles += triangleCount * this.#instanceCount
                debugViewRenderState.numPoints += indexNum * this.#instanceCount
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
                    resource: material?.displacementTexture?.gpuTexture?.createView() || emptyBitmapTextureView
                }
            ]
        }
        const vertexUniformBindGroup: GPUBindGroup = redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        // 설명자를 이용해 랜더 파이프라인을 생성합니다.
        this.#updatePipelines()
        this.gpuRenderInfo.vertexBindGroupLayout = vertex_BindGroupLayout
        this.gpuRenderInfo.vertexUniformBindGroup = vertexUniformBindGroup
    }

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
                    resource: material?.displacementTexture?.gpuTexture?.createView() || emptyBitmapTextureView
                }
            ]
        }
        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(vertexBindGroupDescriptor)
        this.gpuRenderInfo.pipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout)
        this.gpuRenderInfo.shadowPipeline = createBasePipeline(this, vertexShaderModule, vertexBindGroupLayout, PIPELINE_TYPE.SHADOW)
    }
}

Object.defineProperty(InstancingMesh.prototype, 'meshType', {
    value: 'instanceMesh',
    writable: false
});
export default InstancingMesh
