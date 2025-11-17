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
import cullingComputeSource from "./shader/instanceCullingCompute.wgsl";
import vertexModuleSource from "./shader/instanceMeshVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = "VERTEX_MODULE_INSTANCING";
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = "VERTEX_BIND_GROUP_DESCRIPTOR_INSTANCING";
const CULLING_COMPUTE_MODULE_NAME = "CULLING_COMPUTE_MODULE_INSTANCING";
const INDIRECT_ARGS_SIZE = 20;

/**
 * GPU 인스턴싱 기반의 메시 클래스입니다.
 *
 * 하나의 geometry와 material을 여러 인스턴스(Instance)로 효율적으로 렌더링할 수 있습니다.
 * 각 인스턴스는 transform(위치, 회전, 스케일)만 다르고 geometry/vertex 데이터와 머티리얼은 공유합니다.
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/basic/"></iframe>
 * @category Mesh
 */
class InstancingMesh extends Mesh {
    dirtyInstanceMeshObject3D: boolean = true;
    dirtyInstanceNum: boolean = true;

    readonly #redGPUContext: RedGPUContext;

    #instanceCount: number = 1;
    #maxInstanceCount: number = 1;
    #instanceChildren: InstancingMeshObject3D[] = [];

    #displacementScale: number;
    #useDisplacementTexture: boolean;

    #cullingComputePipeline: GPUComputePipeline;
    #cullingBindGroup: GPUBindGroup;
    #visibilityBuffer: StorageBuffer;
    #indirectDrawBuffer: GPUBuffer;
    #cullingUniformBuffer: StorageBuffer;

    // visibilityBuffer stride 캐시
    #visibilityStrideBytes: number = 0;
    #visibilityStrideU32: number = 0;

    #lodManager: LODManager = new LODManager(() => {
        this.dirtyLOD = true;
    });

    #vertexUniformBindGroup_LODList: GPUBindGroup[] = [];

    dirtyLOD: boolean;

    constructor(
        redGPUContext: RedGPUContext,
        maxInstanceCount: number,
        instanceCount: number,
        geometry?: Geometry | Primitive,
        material?: any
    ) {
        super(redGPUContext, geometry, material);

        this.#redGPUContext = redGPUContext;

        // 인스턴스 생명주기 동안 한 번만 생성하면 되는 리소스
        this.#init();

        // 최대 인스턴스 수 / 실제 인스턴스 수 설정
        this.maxInstanceCount = maxInstanceCount;
        this.instanceCount = instanceCount;
    }

    get lodManager(): LODManager {
        return this.#lodManager;
    }

    get instanceCount(): number {
        return this.#instanceCount;
    }

    set instanceCount(count: number) {
        validateUintRange(count);

        this.#instanceCount = Math.min(count, this.#maxInstanceCount);

        // WGSL 파싱 (instanceCount / maxInstanceCount 결정 이후)
        this.gpuRenderInfo.vertexUniformInfo = parseWGSL(this.#getVertexModuleSource()).storage.instanceUniforms;

        // 인스턴스 유니폼 버퍼 재구성 (기존 데이터 보존)
        this.#rebuildInstanceUniformBuffer();

        // 자식 인스턴스 개수 맞추기
        if (this.#instanceChildren.length > this.#instanceCount) {
            this.#instanceChildren.length = this.#instanceCount;
        }

        let i = this.#instanceCount;
        while (i--) {
            if (!this.#instanceChildren[i]) {
                this.#instanceChildren[i] = new InstancingMeshObject3D(this.#redGPUContext, i, this);
            }
        }

        // visibility stride 갱신 후 관련 GPU 리소스 재생성
        this.#updateVisibilityStride();
        this.#initGPURenderInfos(this.#redGPUContext);

        this.dirtyInstanceNum = true;
    }

    get maxInstanceCount(): number {
        return this.#maxInstanceCount;
    }

    set maxInstanceCount(count: number) {
        validateUintRange(count);

        const limitNum = InstancingMesh.getLimitSize();
        count = Math.min(count, limitNum);

        this.#maxInstanceCount = count;

        if (this.#instanceCount > this.#maxInstanceCount) {
            this.instanceCount = this.#maxInstanceCount;
        }
    }

    get instanceChildren(): InstancingMeshObject3D[] {
        return this.#instanceChildren;
    }

    static getLimitSize(): number {
        const headSize = (16 + 1 + 1 + 2) * 4;
        const perInstanceSize = (16 + 16 + 1) * 4;
        const maxStorageBufferBindingSize = Math.floor(Math.min(268435456, 134217728));
        const limitNum = Math.floor((maxStorageBufferBindingSize - headSize) / perInstanceSize);
        return limitNum;
    }

    render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false): void {
        if (this.dirtyLOD) {
            this.#updateVisibilityStride();
            this.#initGPURenderInfos(this.#redGPUContext);
            this.dirtyInstanceNum = true;
            this.dirtyLOD = false;
            return;
        }

        const {view, currentRenderPassEncoder} = renderViewStateData;
        const {scene} = view;
        const {shadowManager} = scene;
        const {directionalShadowManager} = shadowManager;
        const {castingList} = directionalShadowManager;

        if (this.dirtyTransform) {
            this.#updateTransformMatrix();
        }

        if (this.geometry) {
            renderViewStateData.num3DObjects++;
        } else {
            renderViewStateData.num3DGroups++;
        }

        const redGPUContext = this.#redGPUContext;

        if (this.geometry) {
            const {antialiasingManager} = redGPUContext;

            if (antialiasingManager.changedMSAA) {
                this.dirtyPipeline = true;
            }

            if (!this.gpuRenderInfo) {
                this.#initGPURenderInfos(redGPUContext);
            }

            const dirtyPipeline: boolean = this.dirtyPipeline || this.material.dirtyPipeline;
            if (dirtyPipeline) {
                this.#updatePipelineState(renderViewStateData);
            }

            if (!shadowRender) {
                this.#performGPUCulling(renderViewStateData);
            }

            this.#renderGeometry(renderViewStateData, shadowRender, currentRenderPassEncoder);
        }

        if (this.castShadow) {
            castingList[castingList.length] = this;
        }

        const {children} = this;
        let i = children.length;
        while (i--) {
            children[i].dirtyTransform = this.dirtyTransform;
            children[i].render(renderViewStateData);
        }

        this.dirtyTransform = false;
    }

    #updateTransformMatrix(): void {
        mat4.identity(this.localMatrix);
        mat4.translate(this.localMatrix, this.localMatrix, [this.x, this.y, this.z]);
        mat4.rotateX(this.localMatrix, this.localMatrix, this.rotationX);
        mat4.rotateY(this.localMatrix, this.localMatrix, this.rotationY);
        mat4.rotateZ(this.localMatrix, this.localMatrix, this.rotationZ);
        mat4.scale(this.localMatrix, this.localMatrix, [this.scaleX, this.scaleY, this.scaleZ]);

        const parent = this.parent;
        if (parent?.modelMatrix) {
            mat4.multiply(this.modelMatrix, this.localMatrix, parent.modelMatrix);
        } else {
            this.modelMatrix = mat4.clone(this.localMatrix);
        }
    }

    #updatePipelineState(renderViewStateData: RenderViewStateData): void {
        this.dirtyTransform = true;

        if (this.material.dirtyPipeline) {
            this.material._updateFragmentState();
        }

        this.#updatePipelines();
        this.material.dirtyPipeline = false;
        this.dirtyPipeline = false;

        renderViewStateData.numDirtyPipelines++;
    }

    #renderGeometry(
        renderViewStateData: RenderViewStateData,
        shadowRender: boolean,
        renderPassEncoder: GPURenderPassEncoder
    ): void {
        const {gpuRenderInfo} = this;
        const {pipeline, shadowPipeline} = gpuRenderInfo;

        this.#updateDisplacementUniforms();
        this.#updateInstanceUniforms();

        const {fragmentUniformBindGroup} = this.material.gpuRenderInfo;

        renderPassEncoder.setPipeline(shadowRender ? shadowPipeline : pipeline);
        renderPassEncoder.setBindGroup(0, renderViewStateData.view.systemUniform_Vertex_UniformBindGroup);
        renderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);

        this.#renderIndirectDraws(renderViewStateData, renderPassEncoder);
    }

    #updateDisplacementUniforms(): void {
        const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo;
        const {displacementTexture, displacementScale} = this.material || {};
        const {members} = vertexUniformInfo;

        if (members.displacementScale !== undefined && this.#displacementScale !== displacementScale) {
            this.#displacementScale = displacementScale;
            vertexUniformBuffer.dataViewF32.set(
                new members.displacementScale.View([displacementScale]),
                members.displacementScale.uniformOffset / 4,
            );
        }

        if (members.useDisplacementTexture !== undefined && this.#useDisplacementTexture !== !!displacementTexture) {
            this.#useDisplacementTexture = !!displacementTexture;
            vertexUniformBuffer.dataViewF32.set(
                new members.useDisplacementTexture.View([displacementTexture ? 1 : 0]),
                members.useDisplacementTexture.uniformOffset / 4,
            );
        }
    }

    #updateInstanceUniforms(): void {
        const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo;
        const {gpuDevice} = this.#redGPUContext;
        const {members} = vertexUniformInfo;

        if (this.dirtyTransform) {
            vertexUniformBuffer.dataViewF32.set(
                this.modelMatrix,
                members.instanceGroupModelMatrix.uniformOffset / 4,
            );
            gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                members.instanceGroupModelMatrix.uniformOffset,
                new members.instanceGroupModelMatrix.View(this.modelMatrix),
            );
        }

        if (this.dirtyInstanceMeshObject3D || this.dirtyInstanceNum) {
            gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                0,
                vertexUniformBuffer.data,
            );
            this.dirtyInstanceMeshObject3D = false;
            this.dirtyInstanceNum = false;
        }
    }

    #renderIndirectDraws(
        renderViewStateData: RenderViewStateData,
        renderPassEncoder: GPURenderPassEncoder
    ): void {
        const indirectArgsSize = INDIRECT_ARGS_SIZE;

        // 메인 지오메트리 렌더링 (LOD 0)
        this.#renderGeometryWithBuffer(
            renderPassEncoder,
            this.geometry,
            this.gpuRenderInfo.vertexUniformBindGroup,
            0,
            indirectArgsSize,
        );

        // LOD 지오메트리 렌더링
        this.#lodManager.lodList.forEach((lod, index) => {
            this.#renderGeometryWithBuffer(
                renderPassEncoder,
                lod.geometry,
                this.#vertexUniformBindGroup_LODList[index],
                index + 1,
                indirectArgsSize,
            );
        });

        renderViewStateData.numDrawCalls++;
        renderViewStateData.numInstances++;
    }

    /**
     * 공통 지오메트리 렌더링 로직
     * @param renderPassEncoder - GPU 렌더 패스 인코더
     * @param geometry - 렌더링할 지오메트리
     * @param vertexUniformBindGroup - 버텍스 유니폼 바인드 그룹
     * @param lodIndex - LOD 인덱스
     * @param indirectArgsSize - 간접 렌더 인수 크기
     */
    #renderGeometryWithBuffer(
        renderPassEncoder: GPURenderPassEncoder,
        geometry: Geometry | Primitive,
        vertexUniformBindGroup: GPUBindGroup,
        lodIndex: number,
        indirectArgsSize: number
    ): void {
        const {vertexBuffer, indexBuffer} = geometry;
        const offsetInBuffer = indirectArgsSize * lodIndex;

        renderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer);

        if (indexBuffer) {
            const {gpuBuffer: indexGPUBuffer, format} = indexBuffer;
            renderPassEncoder.setIndexBuffer(indexGPUBuffer, format);
            renderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, offsetInBuffer);
        } else {
            renderPassEncoder.drawIndirect(this.#indirectDrawBuffer, offsetInBuffer);
        }
    }

    /**
     * 인스턴스 생명주기 동안 한 번만 생성해도 되는 리소스들 초기화
     * - gpuRenderInfo 기본 구조
     * - indirectDrawBuffer
     * - cullingUniformBuffer
     */
    #init(): void {
        const {gpuDevice} = this.#redGPUContext;

        // gpuRenderInfo 기본 틀
        this.gpuRenderInfo = new VertexGPURenderInfo(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
        );

        // indirectDrawBuffer 생성 (LOD별 인수를 위한 여유 공간)
        const totalIndirectSize = INDIRECT_ARGS_SIZE * 8;
        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            size: totalIndirectSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: `IndirectDrawBuffer_${this.uuid}`,
        });

        // cullingUniformBuffer 생성 (고정 크기, 내용만 매 프레임 변경)
        const cullingUniformData = new Float32Array(40);
        this.#cullingUniformBuffer = new StorageBuffer(
            this.#redGPUContext,
            cullingUniformData.buffer,
            `CullingUniformBuffer_${this.uuid}`,
        );
    }

    /**
     * instanceCount / LOD 수에 따라 달라지는 GPU 리소스 초기화
     */
    #initGPURenderInfos(redGPUContext: RedGPUContext): void {
        this.dirtyPipeline = true;

        const visibilityData = new ArrayBuffer(
            this.#visibilityStrideBytes * (this.#lodManager.lodList.length + 1),
        );

        this.#visibilityBuffer?.destroy();
        this.#visibilityBuffer = new StorageBuffer(
            redGPUContext,
            visibilityData,
            `VisibilityBuffer_${this.uuid}`,
        );

        this.#updatePipelines();
        this.#initGPUCulling(this.#redGPUContext);
    }

    #initGPUCulling(redGPUContext: RedGPUContext): void {
        const {gpuDevice, resourceManager} = redGPUContext;

        // 컴퓨트 쉐이더 생성 (maxInstanceCount에 의존)
        const computeModuleDescriptor: GPUShaderModuleDescriptor = {
            code: this.#getCullingComputeSource(),
        };
        const computeShaderModule = resourceManager.createGPUShaderModule(
            `${CULLING_COMPUTE_MODULE_NAME}_${this.#maxInstanceCount}_${this.uuid}`,
            computeModuleDescriptor,
        );

        const computeBindGroupLayout = gpuDevice.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: "read-only-storage"},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: "read-only-storage"},
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: "storage"},
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: "storage"},
                },
            ],
        });

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [computeBindGroupLayout]}),
            compute: {
                module: computeShaderModule,
                entryPoint: "main",
            },
        });

        this.#cullingBindGroup = gpuDevice.createBindGroup({
            layout: computeBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: this.gpuRenderInfo.vertexUniformBuffer.gpuBuffer},
                },
                {
                    binding: 1,
                    resource: {buffer: this.#cullingUniformBuffer.gpuBuffer},
                },
                {
                    binding: 2,
                    resource: {buffer: this.#visibilityBuffer.gpuBuffer},
                },
                {
                    binding: 3,
                    resource: {buffer: this.#indirectDrawBuffer},
                },
            ],
        });
    }

    #updateCullingUniforms(renderViewStateData: RenderViewStateData): void {
        const {view} = renderViewStateData;
        const {gpuDevice} = this.#redGPUContext;
        const {data, dataViewU32, dataViewF32} = this.#cullingUniformBuffer;

        dataViewU32.set([this.#instanceCount], 0);
        dataViewU32.set([this.#visibilityStrideU32], 1);
        dataViewU32.set([this.#lodManager.lodList.length], 2);
        dataViewF32.set(view.rawCamera.position, 4);
        dataViewF32.set(view.frustumPlanes.flat(), 8);
        dataViewF32.set([...this.#lodManager.lodList.map(lod => lod.distance)], 32);

        gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer.gpuBuffer,
            0,
            data,
        );
    }

    #performGPUCulling(renderViewStateData: RenderViewStateData): void {
        const {gpuDevice} = this.#redGPUContext;

        this.#updateCullingUniforms(renderViewStateData);

        const indexCount = this.geometry.indexBuffer
            ? this.geometry.indexBuffer.indexCount
            : this.geometry.vertexBuffer.vertexCount;

        // LOD 0 초기화
        const indirectDrawData = new Uint32Array([indexCount, 0, 0, 0, 0]);
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, indirectDrawData);

        // LOD 리스트 초기화
        this.#lodManager.lodList.forEach((lod, index) => {
            const lodIndexCount = lod.geometry.indexBuffer.indexCount;
            const lodIndirectData = new Uint32Array([lodIndexCount, 0, 0, 0, 0]);
            const offset = INDIRECT_ARGS_SIZE * (index + 1);
            gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, offset, lodIndirectData);
        });

        // Compute Pass 실행
        const commandEncoder = gpuDevice.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();

        computePass.setPipeline(this.#cullingComputePipeline);
        computePass.setBindGroup(0, this.#cullingBindGroup);

        const workgroupSize = 64;
        const workgroupCount = Math.ceil(this.#instanceCount / workgroupSize);
        computePass.dispatchWorkgroups(workgroupCount);

        computePass.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    #getVertexBindGroupDescriptor(index: number = 0): GPUBindGroupDescriptor {
        const {resourceManager} = this.#redGPUContext;
        const {vertexUniformBuffer} = this.gpuRenderInfo;
        const {material} = this;
        const {basicSampler, emptyBitmapTextureView} = resourceManager;
        const {gpuSampler: basicGPUSampler} = basicSampler;

        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing,
        );

        const stride = this.#visibilityStrideBytes;
        const offset = stride * index;
        const size = stride;

        keepLog(this.#lodManager.lodList.length);

        if (offset + size > this.#visibilityBuffer.size) {
            throw new Error("Binding range exceeds visibility buffer size.");
        }

        return {
            layout: vertexBindGroupLayout,
            label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: vertexUniformBuffer.gpuBuffer,
                        offset: 0,
                        size: vertexUniformBuffer.size,
                    },
                },
                {
                    binding: 1,
                    resource: material?.displacementTextureSampler?.gpuSampler || basicGPUSampler,
                },
                {
                    binding: 2,
                    resource: resourceManager.getGPUResourceBitmapTextureView(material?.displacementTexture)
                        || emptyBitmapTextureView,
                },
                {
                    binding: 3,
                    resource: {
                        buffer: this.#visibilityBuffer.gpuBuffer,
                        offset,
                        size,
                    },
                },
            ],
        };
    }

    #updatePipelines(): void {
        const {resourceManager} = this.#redGPUContext;

        const vModuleDescriptor: GPUShaderModuleDescriptor = {
            code: this.#getVertexModuleSource(),
        };

        const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            `${VERTEX_SHADER_MODULE_NAME}_${this.#maxInstanceCount}_${this.uuid}`,
            vModuleDescriptor,
        );
        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing,
        );

        this.#buildVertexBindGroups();
        this.#createPipelines(vertexShaderModule, vertexBindGroupLayout);
    }

    /**
     * vertexUniformBindGroup 및 LOD용 BindGroup들을 생성
     */
    #buildVertexBindGroups(): void {
        const {gpuDevice} = this.#redGPUContext;

        // 기본 인스턴스용 바인드 그룹
        this.gpuRenderInfo.vertexUniformBindGroup = gpuDevice.createBindGroup(
            this.#getVertexBindGroupDescriptor(),
        );

        // LOD 별 바인드 그룹 생성
        this.#vertexUniformBindGroup_LODList.length = 0;
        this.#lodManager.lodList.forEach((lod, index) => {
            this.#vertexUniformBindGroup_LODList[index] = gpuDevice.createBindGroup(
                this.#getVertexBindGroupDescriptor(index + 1),
            );
        });
    }

    /**
     * vertex / shadow 파이프라인 생성
     */
    #createPipelines(
        vertexShaderModule: GPUShaderModule,
        vertexBindGroupLayout: GPUBindGroupLayout
    ): void {
        this.gpuRenderInfo.vertexShaderModule = vertexShaderModule;
        this.gpuRenderInfo.pipeline = createBasePipeline(
            this,
            vertexShaderModule,
            vertexBindGroupLayout,
        );
        this.gpuRenderInfo.shadowPipeline = createBasePipeline(
            this,
            vertexShaderModule,
            vertexBindGroupLayout,
            PIPELINE_TYPE.SHADOW,
        );
    }

    /**
     * instanceCount에 따라 visibilityBuffer stride 캐시 갱신
     */
    #updateVisibilityStride(): void {
        const rawStride = this.#instanceCount * 4;
        this.#visibilityStrideBytes = Math.ceil(rawStride / 256) * 256;
        this.#visibilityStrideU32 = this.#visibilityStrideBytes / 4;
    }

    /**
     * 인스턴스 유니폼 버퍼 재구성 (기존 데이터 최대한 유지)
     */
    #rebuildInstanceUniformBuffer(): void {
        const info = this.gpuRenderInfo.vertexUniformInfo;
        const newData = new ArrayBuffer(info.arrayBufferByteLength);
        const newBuffer = new StorageBuffer(
            this.#redGPUContext,
            newData,
            `InstanceBuffer_${this.uuid}`,
        );

        const prevBuffer = this.gpuRenderInfo.vertexUniformBuffer;
        if (prevBuffer?.gpuBuffer) {
            newBuffer.dataViewF32.set(prevBuffer.dataViewF32, 0);
            // 헤더 영역 U32 값 유지 (0, 1 인덱스를 그대로 복사)
            newBuffer.dataViewU32.set([prevBuffer.dataViewU32[0]], 0);
            newBuffer.dataViewU32.set([prevBuffer.dataViewU32[1]], 4);
            prevBuffer.destroy();
        }

        this.gpuRenderInfo.vertexUniformBuffer = newBuffer;
    }

    /**
     * WGSL 소스에 __INSTANCE_COUNT__ 치환
     */
    #injectInstanceCount(source: string): string {
        return source.replaceAll(/__INSTANCE_COUNT__/g, this.#maxInstanceCount.toString());
    }

    #getVertexModuleSource(): string {
        return this.#injectInstanceCount(vertexModuleSource);
    }

    #getCullingComputeSource(): string {
        return this.#injectInstanceCount(cullingComputeSource);
    }
}

Object.defineProperty(InstancingMesh.prototype, "meshType", {
    value: MESH_TYPE.INSTANCED_MESH,
    writable: false,
});

export default InstancingMesh;