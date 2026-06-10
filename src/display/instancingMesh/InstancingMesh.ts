import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "../../primitive/core/Primitive";
import StorageBuffer from "../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
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
 * [EN] Interface defining GPU rendering resource details for each LOD.
 */
interface LODGPURenderInfo {
    /**
     * [KO] 버텍스 셰이더용 유니폼 바인드 그룹
     * [EN] Bind group for vertex shader uniforms
     */
    vertexUniformBindGroup: GPUBindGroup;
    /**
     * [KO] 렌더 파이프라인
     * [EN] Render pipeline
     */
    pipeline: GPURenderPipeline;
}

/**
 * [KO] GPU 인스턴싱 기반의 고성능 메시 클래스입니다.
 * [EN] High-performance mesh class based on GPU instancing.
 *
 * [KO] 단일 Geometry와 Material을 공유하는 대량의 메시를 단 하나의 드로우 콜로 화면에 그릴 수 있게 해줍니다. 각 인스턴스(InstancingMeshObject3D)는 개별적인 위치, 회전, 스케일 및 불투명도(Opacity) 속성을 가지며, 프러스텀 컬링(Frustum Culling) 및 LOD(Level of Detail) 기능을 GPU 연산을 통해 효율적으로 처리합니다.
 * [EN] Enables rendering a large number of meshes that share a single Geometry and Material using a single draw call. Each instance (InstancingMeshObject3D) has independent position, rotation, scale, and opacity properties, with frustum culling and Level of Detail (LOD) processed efficiently via GPU compute operations.
 *
 * * ### Example
 * ```typescript
 * const instancingMesh = new RedGPU.Display.InstancingMesh(redGPUContext, 1000, 10, geometry, material);
 * scene.addChild(instancingMesh);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/instancedMesh/simple/"></iframe>
 *
 * [KO] 아래는 InstancingMesh의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of InstancingMesh.
 * @see [InstancingMesh Simple example](/RedGPU/examples/3d/instancedMesh/simple/)
 * @see [InstancingMesh Sphere example](/RedGPU/examples/3d/instancedMesh/sphere/)
 * @see [InstancingMesh GPU LOD example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 * @see [InstancingMesh GPU LOD Material example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)
 * @category Mesh
 */
class InstancingMesh extends Mesh {
    /**
     * [KO] 개별 인스턴스 정보가 수정되어 GPU 버퍼 데이터를 업데이트해야 하는지 여부입니다.
     * [EN] Whether individual instance data is dirty and the GPU buffer needs to be updated.
     */
    dirtyInstanceMeshObject3D: boolean = true;
    /**
     * [KO] 현재 활성화된 인스턴스 개수 정보가 수정되었는지 여부입니다.
     * [EN] Whether the active instance count information has been modified.
     */
    dirtyInstanceNum: boolean = true;

    #lastUpdateMSAAID: string;

    // ========== 기본 설정 ==========
    readonly #redGPUContext: RedGPUContext;
    /**
     * [KO] 현재 렌더링에 사용되는 활성 인스턴스 개수
     * [EN] The number of active instances used for rendering
     */
    #instanceCount: number = 1;
    /**
     * [KO] 허용 가능한 최대 인스턴스 개수
     * [EN] The maximum allowed instance count
     */
    #maxInstanceCount: number = 1;
    /**
     * [KO] 인스턴스들의 자식 객체 배열
     * [EN] Array of child instance objects
     */
    #instanceChildren: InstancingMeshObject3D[] = [];

    // ========== 렌더링 상태 (Displacement) ==========
    #displacementScale: number;
    #useDisplacementTexture: boolean;

    // ========== GPU 리소스 (Culling) ==========
    #cullingComputePipeline: GPUComputePipeline;
    #cullingBindGroup: GPUBindGroup;
    #cullingUniformBuffer: StorageBuffer;

    // ========== GPU 리소스 (Visibility Buffer) ==========
    #visibilityBuffer: StorageBuffer;
    #visibilityStrideBytes: number = 0;
    #visibilityStrideU32: number = 0;

    // ========== GPU 리소스 (Indirect Draw) ==========
    #indirectDrawBuffer: GPUBuffer;

    // ========== GPU 리소스 (LOD) ==========
    #lodGPURenderInfoList: LODGPURenderInfo[] = [];

    /**
     * [KO] InstancingMesh 인스턴스를 생성합니다.
     * [EN] Creates an instance of InstancingMesh.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param maxInstanceCount -
     * [KO] 최대로 생성 및 업로드 가능한 인스턴스 한도
     * [EN] The maximum limit of instances that can be created and uploaded
     * @param instanceCount -
     * [KO] 초기 활성화할 인스턴스 개수
     * [EN] Initial active instance count
     * @param geometry -
     * [KO] 지오메트리 또는 프리미티브 객체 (선택)
     * [EN] Geometry or primitive object (optional)
     * @param material -
     * [KO] 적용할 머티리얼 (선택)
     * [EN] Material to apply (optional)
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

        /*
        TODO - maxInstanceCount, instanceCount 를 반드시 입력하도록 해야것음
         */
        const limitNum = InstancingMesh.getLimitSize(this.#redGPUContext);
        this.#maxInstanceCount = Math.min(maxInstanceCount, limitNum);
        this.#instanceCount = Math.min(instanceCount, this.#maxInstanceCount);

        this.#init();
        this.gpuRenderInfo.vertexUniformInfo = parseWGSL(`INSTANCING_MESH_VERTEX_${this.#maxInstanceCount}`, this.#getVertexModuleSource(this.geometry, this.material)).storage.instanceUniforms;
        this.#rebuildInstanceUniformBuffer();
        this.#updateVisibilityStride();
        this.#initGPURenderInfos(this.#redGPUContext);
        this.instanceCount = this.#instanceCount;
    }

    // ========== Public Getters/Setters ==========

    /**
     * [KO] 현재 활성화하여 렌더링할 인스턴스 개수를 조회하거나 설정합니다. 설정된 개수에 따라 내부적으로 개별 인스턴스 관리 객체(InstancingMeshObject3D)들이 자동 생성 및 갱신됩니다.
     * [EN] Gets or sets the number of active instances to render. Individual instance controllers (InstancingMeshObject3D) are automatically created and updated internally based on the value.
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
     * [KO] 해당 인스턴싱 메시에서 지원 가능한 최대 인스턴스 개수를 조회합니다.
     * [EN] Gets the maximum allowed instance count for this instanced mesh.
     */
    get maxInstanceCount(): number {
        return this.#maxInstanceCount;
    }

    /**
     * [KO] 각 개별 인스턴스의 개별 트랜스폼 정보를 제어할 수 있는 자식 객체들의 목록을 가져옵니다.
     * [EN] Gets the array of child objects (InstancingMeshObject3D) to control the transform details of each instance.
     */
    get instanceChildren(): InstancingMeshObject3D[] {
        return this.#instanceChildren;
    }

    /**
     * [KO] 현재 GPU Context의 하드웨어 한계 한도(maxStorageBufferBindingSize)를 계산하여, 업로드 가능한 이론적인 최대 인스턴스 개수를 가져옵니다.
     * [EN] Computes the maximum theoretical instance count that can be uploaded based on the current GPU Context's limits (maxStorageBufferBindingSize).
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @returns
     * [KO] 하드웨어적으로 허용 가능한 최대 인스턴스 개수
     * [EN] Hardware-constrained maximum instance count
     */
    static getLimitSize(redGPUContext: RedGPUContext): number {
        /**
         * InstanceUniforms struct (WGSL):
         * instanceGroupModelMatrix: mat4x4<f32> (16 floats)
         * instanceGroupNormalModelMatrix: mat4x4<f32> (16 floats)
         * useDisplacementTexture: u32 (1 float size)
         * displacementScale: f32 (1 float size)
         * padding: vec2<f32> (2 floats)
         * Total headSize = 36 * 4 = 144 bytes
         */
        const headSize = (16 + 16 + 1 + 1 + 2) * 4;

        /**
         * Per-instance data in InstanceUniforms struct (WGSL):
         * instanceModelMatrixs: array<mat4x4<f32>, N> (16 floats per instance)
         * instanceNormalModelMatrix: array<mat4x4<f32>, N> (16 floats per instance)
         * instanceOpacity: array<f32, N> (1 float per instance)
         * Total perInstanceSize = 33 * 4 = 132 bytes
         */
        const perInstanceSize = (16 + 16 + 1) * 4;

        const SAFE_MAX_SIZE = 134217728 * 4;
        const maxStorageBufferBindingSize = Math.min(redGPUContext.detector.activeLimits.maxStorageBufferBindingSize, SAFE_MAX_SIZE);

        return Math.floor((maxStorageBufferBindingSize - headSize) / perInstanceSize);
    }

    // ========== 메인 렌더링 ==========

    /**
     * [KO] 인스턴싱 메시를 렌더링 큐에 기록합니다. LOD 변경 시 리소스를 재구성하며, 섀도우 렌더링 모드가 아닐 때는 GPU 연산 셰이더를 통해 프러스텀 컬링(Frustum Culling)을 우선 수행합니다.
     * [EN] Records the instanced mesh into the rendering queue. Rebuilds resources when LOD is dirty, and performs frustum culling via GPU compute shaders if not in shadow rendering mode.
     * @param renderViewStateData -
     * [KO] 렌더 뷰 상태 데이터
     * [EN] Render view state data
     * @param shadowRender -
     * [KO] 그림자 맵 생성용 패스인지 여부 (기본값: false)
     * [EN] Whether it is for the shadow map generation pass (default: false)
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

    // ========== 지오메트리 렌더링 ==========

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

        // 메인 지오메트리 렌더링 (LOD 0)
        this.#renderGeometryWithBuffer(
            renderPassEncoder,
            this.geometry,
            this.gpuRenderInfo.vertexUniformBindGroup,
            this.material.gpuRenderInfo.fragmentUniformBindGroup,
            0,
            indirectArgsSize,
        );

        // LOD 지오메트리 렌더링
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
        if (this.dirtyTransform) {
            vertexUniformBuffer.dataViewF32.set(
                this.modelMatrix,
                members.instanceGroupModelMatrix.uniformOffset / 4,
            );

            // [KO] 그룹 노말 행렬 계산 및 업로드
            // [EN] Calculate and upload group normal matrix
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

    // ========== GPU 리소스 초기화 ==========

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

    // ========== Culling (Compute Shader) ==========

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
        dataViewF32.set(view.frustumPlanes.flat(), 8);
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

        // LOD 0 초기화
        const indirectDrawData = new Uint32Array([indexCount, 0, 0, 0, 0]);
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, indirectDrawData);

        // LOD 리스트 초기화
        this.LODManager.LODList.forEach((lod, index) => {
            const lodIndexCount = lod.geometry.indexBuffer.indexCount;
            const lodIndirectData = new Uint32Array([lodIndexCount, 0, 0, 0, 0]);
            const offset = INDIRECT_ARGS_SIZE * (index + 1);
            gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, offset, lodIndirectData);
        });

        // Compute Pass 실행
        commandEncoderManager.addPreProcessComputePass('InstancingMesh_GPUCulling_ComputePass', (computePass) => {
            computePass.setPipeline(this.#cullingComputePipeline);
            computePass.setBindGroup(0, this.#cullingBindGroup);
            const workgroupSize = 64;
            const workgroupCount = Math.ceil(this.#instanceCount / workgroupSize);
            computePass.dispatchWorkgroups(workgroupCount);
        });
    }

    // ========== 파이프라인 설정 ==========

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
            ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing,
        );

        // 메인 파이프라인
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

        // LOD 파이프라인 및 바인드 그룹
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
            ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing,
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
                    // resource: material?.displacementTextureSampler?.gpuSampler || basicGPUSampler,
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

    // ========== Utility 메서드 ==========

    #updateVisibilityStride(): void {
        const rawStride = this.#maxInstanceCount * 4;
        this.#visibilityStrideBytes = Math.ceil(rawStride / 256) * 256;
        this.#visibilityStrideU32 = this.#visibilityStrideBytes / 4;
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

export default InstancingMesh;