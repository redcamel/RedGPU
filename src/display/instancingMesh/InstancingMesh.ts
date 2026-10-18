import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import StorageBuffer from "../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";

import validateUintRange from "../../runtimeChecker/validateFunc/validateUintRange";
import createBasePipeline from "../mesh/core/pipeline/createBasePipeline";
import PIPELINE_TYPE from "../mesh/core/pipeline/PIPELINE_TYPE";
import VertexGPURenderInfo from "../mesh/core/VertexGPURenderInfo";
import Mesh from "../mesh/Mesh";
import RenderViewStateData from "../view/core/RenderViewStateData";
import InstancingMeshObject3D from "./core/InstancingMeshObject3D";
import cullingComputeSource from "./shader/instanceCullingCompute.wgsl";
import vertexModuleSourceHead from "./shader/instanceMeshVertex_head.wgsl";
import vertexModuleSourceBasic from "./shader/instanceMeshVertex_basic.wgsl";
import vertexModuleSourcePbr from "./shader/instanceMeshVertex_Pbr.wgsl";
import vertexModuleSourceInputBasic from "./shader/instanceMeshVertex_input_basic.wgsl";
import vertexModuleSourceOutputBasic from "./shader/instanceMeshVertex_output_basic.wgsl";
import vertexModuleSourceInputPbr from "./shader/instanceMeshVertex_input_Pbr.wgsl";
import vertexModuleSourceOutputPbr from "./shader/instanceMeshVertex_output_Pbr.wgsl";
import vertexModuleSourceShadow from "./shader/instanceMeshVertex_shadow.wgsl";
import PBRMaterial from "../../material/pbrMaterial/PBRMaterial";
import {ABaseMaterial} from "../../material/core";

const VERTEX_SHADER_MODULE_NAME = "VERTEX_MODULE_INSTANCING";
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = "VERTEX_BIND_GROUP_DESCRIPTOR_INSTANCING";
const CULLING_COMPUTE_MODULE_NAME = "CULLING_COMPUTE_MODULE_INSTANCING";
const INDIRECT_ARGS_SIZE = 20;

/**
 * [KO] LOD별 GPU 렌더링 리소스 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining GPU rendering resource information for each LOD.
 *
 * @category Mesh
 */
interface LODGPURenderInfo {
    /**
     * [KO] 버텍스 셰이더용 유니폼 바인드 그룹
     * [EN] Uniform bind group for the vertex shader
     */
    vertexUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 렌더 파이프라인
     * [EN] Render pipeline
     */
    pipeline: GPURenderPipeline;
}

/**
 * [KO] 단일 지오메트리와 재질을 공유하는 다수의 메시를 단일 드로우 콜로 렌더링하는 GPU 인스턴싱 메시 클래스입니다.
 * [EN] GPU instancing mesh class that renders multiple meshes sharing a single geometry and material in a single draw call.
 *
 * [KO] 각 인스턴스(`InstancingMeshObject3D`)는 개별 위치, 회전, 스케일, 불투명도(`opacity`)를 가지며, GPU 컴퓨트 셰이더 기반 프러스텀 컬링과 LOD(Level of Detail)를 지원합니다.
 * [EN] Each instance (`InstancingMeshObject3D`) has independent position, rotation, scale, and `opacity`, supporting GPU compute shader-based frustum culling and Level of Detail (LOD).
 *
 * ### Example
 * ```typescript
 * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 100, geometry, material);
 * scene.addChild(instancingMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/simple/"></iframe>
 *
 * @see [InstancingMesh Simple example](/RedGPU/examples/3d/instancedMesh/simple/)
 * @see [InstancingMesh Sphere example](/RedGPU/examples/3d/instancedMesh/sphere/)
 * @see [InstancingMesh GPU LOD example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 * @see [InstancingMesh GPU LOD Material example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)
 * @category Mesh
 */
class InstancingMesh extends Mesh {
    /**
     * [KO] 개별 인스턴스 변환/속성 데이터가 변경되어 GPU 버퍼 갱신이 필요한지 여부
     * [EN] Whether individual instance transform or property data has changed and requires a GPU buffer update
     */
    dirtyInstanceMeshObject3D: boolean = true;
    /**
     * [KO] 활성 인스턴스 개수가 변경되었는지 여부
     * [EN] Whether the active instance count has changed
     */
    dirtyInstanceNum: boolean = true;
    #lastLodSlotIndexes: Uint32Array = new Uint32Array(8);

    #lastUpdateMSAAID: string;

    readonly #redGPUContext: RedGPUContext;
    #instanceCount: number = 1;
    #maxInstanceCount: number = 1;
    #instanceChildren: InstancingMeshObject3D[] = [];

    #displacementScale: number;
    #useDisplacementTexture: boolean;

    #cullingComputePipeline: GPUComputePipeline;
    #cullingBindGroup: GPUBindGroup;
    #cullingUniformBuffer: StorageBuffer;

    #visibilityBuffer: StorageBuffer;
    #visibilityStrideBytes: number = 0;
    #visibilityStrideU32: number = 0;

    #indirectDrawBuffer: GPUBuffer;

    #lodGPURenderInfoList: LODGPURenderInfo[] = [];

    /**
     * [KO] `InstancingMesh` 인스턴스를 생성합니다.
     * [EN] Creates an `InstancingMesh` instance.
     *
     * ### Example
     * ```typescript
     * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 100, geometry, material);
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param maxInstanceCount -
     * [KO] 생성 가능한 최대 인스턴스 개수
     * [EN] Maximum number of instances that can be created
     * @param instanceCount -
     * [KO] 초기 활성 인스턴스 개수
     * [EN] Initial active instance count
     * @param geometry -
     * [KO] 지오메트리 또는 프리미티브 객체 (선택)
     * [EN] Geometry or primitive object (optional)
     * @param material -
     * [KO] 적용할 재질 객체 (선택)
     * [EN] Material object to apply (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        maxInstanceCount: number,
        instanceCount: number,
        geometry?: Geometry | Primitive,
        material?: any
    ) {
        super(redGPUContext, geometry, material);
        this.#redGPUContext = redGPUContext;

        const limitNum = InstancingMesh.getLimitSize(this.#redGPUContext);
        this.#maxInstanceCount = Math.min(maxInstanceCount, limitNum);
        this.#instanceCount = Math.min(instanceCount, this.#maxInstanceCount);

        this.#init();
        this.gpuRenderInfo.vertexUniformInfo = redGPUContext.resourceManager.wgslParser.parse(`INSTANCING_MESH_VERTEX_${this.#maxInstanceCount}_${this.uuid}`, this.#getVertexModuleSource(this.geometry, this.material)).storage.instanceUniforms;
        this.#rebuildInstanceUniformBuffer();
        this.#updateVisibilityStride();
        this.#initGPURenderInfos(this.#redGPUContext);
        this.instanceCount = this.#instanceCount;
    }

    /**
     * [KO] 현재 렌더링에 활성화된 인스턴스 개수를 반환하거나 설정합니다. (`0` ~ `maxInstanceCount`)
     * [EN] Returns or sets the number of active instances for rendering. (`0` to `maxInstanceCount`)
     *
     * [KO] 설정된 개수에 맞춰 `instanceChildren` 배열의 `InstancingMeshObject3D` 요소가 자동으로 생성되거나 조정됩니다.
     * [EN] `InstancingMeshObject3D` elements in `instanceChildren` are automatically created or adjusted according to the set count.
     *
     * @returns
     * [KO] 활성 인스턴스 개수
     * [EN] Active instance count
     */
    get instanceCount(): number {
        return this.#instanceCount;
    }

    set instanceCount(count: number) {
        validateUintRange(count);
        this.#instanceCount = Math.min(count, this.#maxInstanceCount);
        if (this.#instanceChildren.length > this.#instanceCount) {
            this.#instanceChildren.length = this.#instanceCount;
        }
        let i = this.#instanceCount;
        while (i--) {
            if (!this.#instanceChildren[i]) {
                this.#instanceChildren[i] = new InstancingMeshObject3D(this.#redGPUContext, i, this);
            }
        }
        this.dirtyInstanceNum = true;
    }

    /**
     * [KO] 허용 가능한 최대 인스턴스 개수를 반환합니다.
     * [EN] Returns the maximum allowed instance count.
     *
     * @returns
     * [KO] 최대 인스턴스 개수
     * [EN] Maximum instance count
     */
    get maxInstanceCount(): number {
        return this.#maxInstanceCount;
    }

    /**
     * [KO] 개별 인스턴스의 트랜스폼과 속성을 제어하는 자식 객체(`InstancingMeshObject3D`) 배열을 반환합니다.
     * [EN] Returns the array of child objects (`InstancingMeshObject3D`) controlling transform and properties of each instance.
     *
     * @returns
     * [KO] `InstancingMeshObject3D` 인스턴스 배열
     * [EN] Array of `InstancingMeshObject3D` instances
     */
    get instanceChildren(): InstancingMeshObject3D[] {
        return this.#instanceChildren;
    }

    /**
     * [KO] 현재 디바이스의 스토리지 버퍼 바인딩 한도(`maxStorageBufferBindingSize`)를 기준으로 생성 가능한 최대 인스턴스 개수를 계산합니다.
     * [EN] Calculates the maximum number of instances that can be created based on the current device's storage buffer binding limit (`maxStorageBufferBindingSize`).
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @returns
     * [KO] 하드웨어 한계 기반 최대 인스턴스 개수
     * [EN] Hardware-limited maximum instance count
     */
    static getLimitSize(redGPUContext: RedGPUContext): number {
        const headSize = 192;
        const perInstanceSize = (16 + 16 + 1) * 4;

        const SAFE_MAX_SIZE = 134217728 * 4;
        const maxStorageBufferBindingSize = Math.min(redGPUContext.detector.activeLimits.maxStorageBufferBindingSize, SAFE_MAX_SIZE);

        return Math.floor((maxStorageBufferBindingSize - headSize) / perInstanceSize);
    }

    /**
     * [KO] 인스턴싱 메시의 GPU 프러스텀 컬링을 수행하고 렌더 패스에 드로우 명령을 기록합니다.
     * [EN] Performs GPU frustum culling for the instancing mesh and records draw commands into the render pass.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render view state data for the current view
     * @param shadowRender -
     * [KO] 그림자 맵 렌더링 패스 여부 (기본값: `false`)
     * [EN] Whether it is a shadow map rendering pass (default: `false`)
     */
    render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false): void {
        if (this.dirtyLOD) {
            this.#updateVisibilityStride();
            this.#initGPURenderInfos(this.#redGPUContext);
            this.dirtyInstanceNum = true;
            this.dirtyLOD = false;
            return;
        }
        const {view, currentRenderPassEncoder, renderResults} = renderViewStateData;
        const {scene} = view;
        const {shadowManager} = scene;
        const {directionalShadowManager} = shadowManager;
        const {castingList} = directionalShadowManager;
        if (this.dirtyTransform) {
            this.#updateTransformMatrix();
        }
        if (this.geometry) {
            renderResults.num3DObjects++;
        } else {
            renderResults.num3DGroups++;
        }
        const redGPUContext = this.#redGPUContext;
        if (this.geometry) {
            const {antialiasingManager} = redGPUContext;
            if (this.#lastUpdateMSAAID !== antialiasingManager.msaaID) {
                this.dirtyPipeline = true;
                this.#lastUpdateMSAAID = antialiasingManager.msaaID;
            }
            if (!this.gpuRenderInfo) {
                this.#initGPURenderInfos(redGPUContext);
            }
            let dirtyPipeline: boolean = this.dirtyPipeline || this.material.dirtyPipeline;
            if (!dirtyPipeline) {
                for (const lod of this.LODManager.LODList) {
                    if (lod.material?.dirtyPipeline) {
                        dirtyPipeline = true;
                        break;
                    }
                }
            }
            if (dirtyPipeline) {
                this.#updatePipelineState(renderViewStateData);
                this.LODManager.LODList.forEach(lod => {
                    if (lod.material) lod.material.dirtyPipeline = false;
                });
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

    /**
     * [KO] `InstancingMesh` 인스턴스를 파기하고 할당된 인스턴싱 전용 GPU 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Destroys the `InstancingMesh` instance and releases allocated instancing-specific GPU buffers and pipeline resources.
     */
    destroy() {
        super.destroy();

        if (this.#indirectDrawBuffer) {
            this.#redGPUContext.commandEncoderManager.addDeferredDestroy(this.#indirectDrawBuffer);
            this.#indirectDrawBuffer = null;
        }

        if (this.#cullingUniformBuffer) {
            this.#cullingUniformBuffer.destroy();
            this.#cullingUniformBuffer = null;
        }

        if (this.#visibilityBuffer) {
            this.#visibilityBuffer.destroy();
            this.#visibilityBuffer = null;
        }

        if (this.gpuRenderInfo) {
            if (this.gpuRenderInfo.vertexUniformBuffer) {
                this.gpuRenderInfo.vertexUniformBuffer.destroy();
                this.gpuRenderInfo.vertexUniformBuffer = null;
            }
            this.gpuRenderInfo.vertexShaderModule = null;
            this.gpuRenderInfo.pipeline = null;
            this.gpuRenderInfo.shadowPipeline = null;
            this.gpuRenderInfo.vertexUniformBindGroup = null;
            this.gpuRenderInfo.vertexUniformInfo = null;
        }

        this.#cullingComputePipeline = null;
        this.#cullingBindGroup = null;

        this.#lodGPURenderInfoList.forEach(info => {
            info.pipeline = null;
            info.vertexUniformBindGroup = null;
        });
        this.#lodGPURenderInfoList = [];

        this.#instanceChildren.forEach(child => {
            if ('destroy' in child && typeof child.destroy === 'function') {
                child.destroy();
            }
        });
        this.#instanceChildren.length = 0;

        console.log(`🧹 InstancingMesh destroy 완료: ${this.name || '무명'}`);
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
            mat4.multiply(this.modelMatrix, parent.modelMatrix, this.localMatrix);
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
        renderViewStateData.renderResults.numDirtyPipelines++;
    }

    #renderGeometry(
        renderViewStateData: RenderViewStateData,
        shadowRender: boolean,
        renderPassEncoder: GPURenderPassEncoder
    ): void {
        const {gpuRenderInfo} = this;
        const {pipeline, shadowPipeline} = gpuRenderInfo;
        const {view, renderResults} = renderViewStateData
        this.#updateDisplacementUniforms();
        this.#updateInstanceUniforms();
        const {fragmentUniformBindGroup} = this.material.gpuRenderInfo;
        renderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
        renderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);
        renderPassEncoder.setPipeline(shadowRender ? shadowPipeline : pipeline);

        const indirectArgsSize = INDIRECT_ARGS_SIZE;

        this.#renderGeometryWithBuffer(
            renderPassEncoder,
            this.geometry,
            this.gpuRenderInfo.vertexUniformBindGroup,
            this.material.gpuRenderInfo.fragmentUniformBindGroup,
            0,
            indirectArgsSize,
        );

        this.LODManager.LODList.forEach((lod, index) => {
            const lodRenderInfo = this.#lodGPURenderInfoList[index];
            renderPassEncoder.setPipeline(lodRenderInfo.pipeline);
            this.#renderGeometryWithBuffer(
                renderPassEncoder,
                lod.geometry,
                lodRenderInfo.vertexUniformBindGroup,
                lod.material ? lod.material.gpuRenderInfo.fragmentUniformBindGroup : this.material.gpuRenderInfo.fragmentUniformBindGroup,
                index + 1,
                indirectArgsSize,
            );
        });

        renderResults.numDrawCalls++;
        renderResults.numInstances++;
    }

    #renderGeometryWithBuffer(
        renderPassEncoder: GPURenderPassEncoder,
        geometry: Geometry | Primitive,
        vertexUniformBindGroup: GPUBindGroup,
        fragmentUniformBindGroup: GPUBindGroup,
        lodIndex: number,
        indirectArgsSize: number
    ): void {
        const {vertexBuffer, indexBuffer} = geometry;
        const offsetInBuffer = indirectArgsSize * lodIndex;
        renderPassEncoder.setBindGroup(1, vertexUniformBindGroup);
        renderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);
        renderPassEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer);
        if (indexBuffer) {
            const {gpuBuffer: indexGPUBuffer, format} = indexBuffer;
            renderPassEncoder.setIndexBuffer(indexGPUBuffer, format);
            renderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, offsetInBuffer);
        } else {
            renderPassEncoder.drawIndirect(this.#indirectDrawBuffer, offsetInBuffer);
        }
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

        if (members.lodGlobalFragmentBufferSlotIndex !== undefined) {
            const lodSlotIndexes = new Uint32Array(8);
            lodSlotIndexes[0] = Math.max(0, this.material.globalFragmentSlotIndex);
            this.LODManager.LODList.forEach((lod, index) => {
                if (index < 7) {
                    const mat = lod.material || this.material;
                    lodSlotIndexes[index + 1] = Math.max(0, mat.globalFragmentSlotIndex);
                }
            });

            let changed = false;
            for (let i = 0; i < 8; i++) {
                if (this.#lastLodSlotIndexes[i] !== lodSlotIndexes[i]) {
                    changed = true;
                    this.#lastLodSlotIndexes[i] = lodSlotIndexes[i];
                }
            }

            if (changed) {
                vertexUniformBuffer.dataViewU32.set(
                    lodSlotIndexes,
                    members.lodGlobalFragmentBufferSlotIndex.uniformOffset / 4,
                );
                gpuDevice.queue.writeBuffer(
                    vertexUniformBuffer.gpuBuffer,
                    members.lodGlobalFragmentBufferSlotIndex.uniformOffset,
                    lodSlotIndexes,
                );
            }
        }

        if (this.dirtyTransform) {
            vertexUniformBuffer.dataViewF32.set(
                this.modelMatrix,
                members.instanceGroupModelMatrix.uniformOffset / 4,
            );

            const groupNormalMatrix = mat4.create();
            mat4.invert(groupNormalMatrix, this.modelMatrix);
            mat4.transpose(groupNormalMatrix, groupNormalMatrix);
            vertexUniformBuffer.dataViewF32.set(
                groupNormalMatrix,
                members.instanceGroupNormalModelMatrix.uniformOffset / 4,
            );

            gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                members.instanceGroupModelMatrix.uniformOffset,
                new members.instanceGroupModelMatrix.View(this.modelMatrix),
            );
            gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                members.instanceGroupNormalModelMatrix.uniformOffset,
                new members.instanceGroupNormalModelMatrix.View(groupNormalMatrix),
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

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;
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
        const totalIndirectSize = INDIRECT_ARGS_SIZE * 8;
        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            size: totalIndirectSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: `IndirectDrawBuffer_${this.uuid}`,
        });
        const cullingUniformData = new Float32Array(40);
        this.#cullingUniformBuffer = new StorageBuffer(
            this.#redGPUContext,
            cullingUniformData.buffer,
            `CullingUniformBuffer_${this.uuid}`,
        );
    }

    #initGPURenderInfos(redGPUContext: RedGPUContext): void {
        this.dirtyPipeline = true;
        const visibilityData = new ArrayBuffer(
            this.#visibilityStrideBytes * (this.LODManager.LODList.length + 1),
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
        dataViewU32.set([this.LODManager.LODList.length], 2);
        dataViewF32.set(view.rawCamera.position, 4);
        dataViewF32.set(renderViewStateData.frustumPlanesFlat, 8);
        dataViewF32.set([...this.LODManager.LODList.map(lod => lod.distance)], 32);
        gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer.gpuBuffer,
            0,
            data,
        );
    }

    #performGPUCulling(renderViewStateData: RenderViewStateData): void {
        const {gpuDevice, commandEncoderManager} = this.#redGPUContext;
        const {indexBuffer, vertexBuffer} = this.geometry
        this.#updateCullingUniforms(renderViewStateData);
        const indexCount = indexBuffer
            ? indexBuffer.indexCount
            : vertexBuffer.vertexCount;

        const indirectDrawData = new Uint32Array([indexCount, 0, 0, 0, 0]);
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, indirectDrawData);

        this.LODManager.LODList.forEach((lod, index) => {
            const lodIndexCount = lod.geometry.indexBuffer.indexCount;
            const lodIndirectData = new Uint32Array([lodIndexCount, 0, 0, 0, 0]);
            const offset = INDIRECT_ARGS_SIZE * (index + 1);
            gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, offset, lodIndirectData);
        });

        if (this.#instanceCount > 0) {
            commandEncoderManager.addPreProcessComputePass('InstancingMesh_GPUCulling_ComputePass', (computePass) => {
                computePass.setPipeline(this.#cullingComputePipeline);
                computePass.setBindGroup(0, this.#cullingBindGroup);
                const workgroupSize = 64;
                const workgroupCount = Math.ceil(this.#instanceCount / workgroupSize);
                if (workgroupCount > 0) {
                    computePass.dispatchWorkgroups(workgroupCount);
                }
            });
        }
    }

    #updatePipelines(): void {
        const {resourceManager, gpuDevice} = this.#redGPUContext;
        const vModuleDescriptor: GPUShaderModuleDescriptor = {
            code: this.#getVertexModuleSource(this.geometry, this.material),
        };
        const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            `${VERTEX_SHADER_MODULE_NAME}_${this.#maxInstanceCount}_${this.uuid}`,
            vModuleDescriptor,
        );
        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing,
        );

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
        this.gpuRenderInfo.vertexUniformBindGroup = gpuDevice.createBindGroup(
            this.#getVertexBindGroupDescriptor(),
        );

        this.#lodGPURenderInfoList.length = 0;
        this.LODManager.LODList.forEach((lod, index) => {
            const vModuleDescriptor: GPUShaderModuleDescriptor = {
                code: this.#getVertexModuleSource(lod.geometry, lod.material),
            };
            const vertexShaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
                `${VERTEX_SHADER_MODULE_NAME}_${this.#maxInstanceCount}_LOD${index}_${this.uuid}`,
                vModuleDescriptor,
            );

            this.#lodGPURenderInfoList[index] = {
                pipeline: createBasePipeline(
                    //@ts-ignore
                    {
                        vertexStateBuffers: lod.geometry.gpuRenderInfo.buffers,
                        primitiveState: this.primitiveState,
                        depthStencilState: this.depthStencilState,
                        geometry: lod.geometry,
                        material: lod.material || this.material,
                        redGPUContext: this.#redGPUContext,
                        gpuRenderInfo: this.gpuRenderInfo
                    },
                    vertexShaderModule,
                    vertexBindGroupLayout,
                ),
                vertexUniformBindGroup: gpuDevice.createBindGroup(
                    this.#getVertexBindGroupDescriptor(index + 1),
                )
            };
        });
    }

    #getVertexBindGroupDescriptor(index: number = 0): GPUBindGroupDescriptor {
        const {resourceManager} = this.#redGPUContext;
        const {vertexUniformBuffer} = this.gpuRenderInfo;
        const {material} = this;
        const {basicSampler, basicDisplacementSampler, emptyBitmapTextureView} = resourceManager;
        const {gpuSampler: basicGPUSampler,} = basicSampler;
        const vertexBindGroupLayout: GPUBindGroupLayout = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing,
        );
        const stride = this.#visibilityStrideBytes;
        const offset = stride * index;
        const size = stride;

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
                    resource: basicDisplacementSampler.gpuSampler
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

    #updateVisibilityStride(): void {
        const rawStride = this.#maxInstanceCount * 8;
        this.#visibilityStrideBytes = Math.ceil(rawStride / 256) * 256;
        this.#visibilityStrideU32 = this.#visibilityStrideBytes / 8;
    }

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
            if (prevBuffer.dataViewF32.length > newBuffer.dataViewF32.length) {
                newBuffer.dataViewF32.set(prevBuffer.dataViewF32.subarray(0, newBuffer.dataViewF32.length), 0);
            } else {
                newBuffer.dataViewF32.set(prevBuffer.dataViewF32, 0);
            }
            prevBuffer.destroy();
        }
        this.gpuRenderInfo.vertexUniformBuffer = newBuffer;
    }

    #injectInstanceCount(source: string, headSource: string = '', inputSource: string = '', outputSource: string = '', shadowSource: string = ''): string {
        return [
            headSource,
            inputSource,
            outputSource,
            source.replaceAll(/__INSTANCE_COUNT__/g, this.#maxInstanceCount.toString()),
            shadowSource
        ].join('\n');
    }

    #getVertexModuleSource(geometry: Geometry | Primitive, material: ABaseMaterial): string {
        const label = geometry.vertexBuffer.interleavedStruct.label;
        const isPbrMaterial = material instanceof PBRMaterial;

        const isPBR = label === 'PBR' && isPbrMaterial;
        const isPBROnlyFragment = label !== 'PBR' && isPbrMaterial;

        const input = isPBR ? vertexModuleSourceInputPbr : vertexModuleSourceInputBasic;
        const output = isPBROnlyFragment ? vertexModuleSourceOutputPbr :
            isPBR ? vertexModuleSourceOutputPbr :
                vertexModuleSourceOutputBasic;

        return this.#injectInstanceCount(
            vertexModuleSourceHead,
            isPBR ? vertexModuleSourcePbr : vertexModuleSourceBasic,
            input,
            output,
            vertexModuleSourceShadow
        );
    }

    #getCullingComputeSource(): string {
        return this.#injectInstanceCount(cullingComputeSource);
    }
}

Object.freeze(InstancingMesh)
export default InstancingMesh;