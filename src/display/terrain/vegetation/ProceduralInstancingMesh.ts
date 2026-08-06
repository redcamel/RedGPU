import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import {ABaseMaterial} from "../../../material/core";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import Mesh from "../../mesh/Mesh";
import cullingComputeSource from "./shader/proceduralCulling.wgsl";

// per-instance floats: x, z, rotY, scaleXZ, scaleY, windOffset, _pad0, _pad1
const INSTANCE_FLOATS = 8;

// CullingUniforms layout (floats):
// [0..3]  instanceCount, pad, pad, pad
// [4..6]  cameraPosition, [7] boundingRadiusScale
// [8..31] frustumPlanes (6 × vec4 = 24 floats)
// [32..35] globalFragmentSlotIndex, pad, pad, pad
const CULLING_UNIFORM_FLOATS = 32;

// IndirectDrawArgs layout (u32 × 5 = 20 bytes)
const INDIRECT_DRAW_BYTES = 20;

// ProceduralVertexUniforms: globalFragmentSlotIndex(u32), padding(u32 × 3) = 16 bytes
const VERTEX_UNIFORM_BYTES = 32;

/**
 * [KO] GPU-driven 절차적 대량 인스턴싱 메쉬 기반 클래스.
 * InstancingMesh를 상속하지 않고 독립적으로 구현.
 * - 경량 per-instance 버퍼 (8 floats = 32 bytes per instance)
 * - GPU Frustum Culling Compute
 * - Indirect Draw
 * - 서브클래스가 vertex shader / extra bind groups를 제공
 */
abstract class ProceduralInstancingMesh extends Mesh {

    minHeight: number = 0;
    maxHeight: number = 0;
    worldSize: [number, number] = [1, 1];
    worldOffset: [number, number] = [0, 0];
    maskChannel: 'r' | 'g' | 'b' | 'a' = 'g';
    maskThreshold: number = 0.15;
    maxDistance: number = 1500;
    startFadeDistance: number = 1200;
    windMaxDistance: number = 300;
    // GPU 리소스
    #instanceBuffer: StorageBuffer;
    #instanceData: Float32Array;
    #cullingUniformBuffer: StorageBuffer;
    #cullingUniformData: Float32Array;
    #visibilityBuffer: GPUBuffer;
    #indirectDrawBuffer: GPUBuffer;
    #vertexUniformBuffer: StorageBuffer;
    // Pipelines & BindGroups
    #cullingBGL: GPUBindGroupLayout;
    #prevHeightmapTexture: any = null;
    #cullingComputePipeline: GPUComputePipeline;
    #cullingBindGroup: GPUBindGroup;
    #renderPipeline: GPURenderPipeline;
    #vertexBindGroup: GPUBindGroup;
    #vertexBindGroupLayout: GPUBindGroupLayout;
    #maxInstanceCount: number;
    #instanceCount: number = 0;
    #geometry: Geometry | Primitive;
    #material: ABaseMaterial;
    #pipelineReady: boolean = false;
    #instanceDataDirty: boolean = false;
    #prevSplatTexture: any = null;

    // =========================================================
    // Public API
    // =========================================================

    constructor(
        redGPUContext: RedGPUContext,
        maxInstanceCount: number,
        geometry: Geometry | Primitive,
        material: ABaseMaterial
    ) {
        super(redGPUContext, geometry, material);
        this.#maxInstanceCount = maxInstanceCount;
        this.#geometry = geometry;
        this.#material = material;

        this.#initBuffers();
        this.#initCullingPipeline();
    }

    get maxInstanceCount(): number {
        return this.#maxInstanceCount;
    }

    get instanceCount(): number {
        return this.#instanceCount;
    }

    set instanceCount(count: number) {
        if (count > this.#maxInstanceCount) {
            console.warn(`[ProceduralInstancingMesh] 인스턴스 개수(${count})가 최대 버퍼 크기(${this.#maxInstanceCount})를 초과하여 클램핑되었습니다.`);
        }
        this.#instanceCount = Math.min(count, this.#maxInstanceCount);
    }

    /** CPU side instance data. 외부에서 직접 수정 후 flushInstanceData() 호출 */
    get instanceData(): Float32Array {
        return this.#instanceData;
    }

    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    get material(): ABaseMaterial {
        return this.#material;
    }

    /** GPU에 인스턴스 데이터 업로드 */
    flushInstanceData(): void {
        const {gpuDevice} = this.redGPUContext;
        gpuDevice.queue.writeBuffer(
            this.#instanceBuffer.gpuBuffer,
            0,
            this.#instanceData.buffer as ArrayBuffer,
            0,
            this.#instanceCount * INSTANCE_FLOATS * 4
        );
        this.#instanceDataDirty = false;
    }

    /** 인스턴스 데이터를 dirty로 표시 (다음 render 시 GPU 업로드) */
    markInstanceDataDirty(): void {
        this.#instanceDataDirty = true;
    }

    // =========================================================
    // Abstract — subclass 구현
    // =========================================================

    render(renderViewStateData: RenderViewStateData, _shadowRender: boolean = false): void {
        if (this.#instanceCount === 0) return;

        const currentTex = this.getHeightmapTexture();
        const currentSplat = this.getSplatTexture();
        const currentTexGPU = currentTex?.gpuTexture || null;
        const currentSplatGPU = currentSplat?.gpuTexture || null;

        if (currentTexGPU !== this.#prevHeightmapTexture || currentSplatGPU !== this.#prevSplatTexture) {
            this.#updateCullingBindGroup();
            this.#prevHeightmapTexture = currentTexGPU;
            this.#prevSplatTexture = currentSplatGPU;
        }

        // 파이프라인 지연 초기화
        if (!this.#pipelineReady) {
            this.#initRenderPipeline();
        }
        if (!this.#pipelineReady) return;

        if (this.#instanceDataDirty) {
            this.flushInstanceData();
        }

        const {gpuDevice, commandEncoderManager} = this.redGPUContext;

        // 1. IndirectDrawBuffer instanceCount (offset 4) 영역을 0으로 초기화
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 4, new Uint32Array([0]));

        // 2. CullingUniforms 업데이트
        this.#updateCullingUniforms(renderViewStateData);

        // 3. CommandEncoderManager를 활용한 Compute Pass 병합 인코딩 (RedGPU SystemUniforms + Culling BGL)
        const {view} = renderViewStateData;
        commandEncoderManager.addResourceComputePass(
            `ProceduralCullingPass_${this.uuid}`,
            (computePass) => {
                computePass.setPipeline(this.#cullingComputePipeline);
                computePass.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
                computePass.setBindGroup(1, this.#cullingBindGroup);
                const workgroups = Math.ceil(this.#instanceCount / 64);
                computePass.dispatchWorkgroups(workgroups);
            }
        );

        // 4. Render Pass
        const {currentRenderPassEncoder} = renderViewStateData;
        if (!currentRenderPassEncoder) return;

        // Material fragment 업데이트
        if (this.#material.dirtyPipeline) {
            this.#material._updateFragmentState();
        }

        const fragmentUniformBindGroup = this.#material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (!fragmentUniformBindGroup) return;

        // Vertex uniform (globalFragmentSlotIndex) 업데이트
        this.#updateVertexUniforms();

        currentRenderPassEncoder.setPipeline(this.#renderPipeline);
        currentRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
        currentRenderPassEncoder.setBindGroup(1, this.#vertexBindGroup);
        currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);

        // Extra bind groups (group 3+) — subclass 제공
        const extraGroups = this.getExtraBindGroups();
        for (let i = 0; i < extraGroups.length; i++) {
            currentRenderPassEncoder.setBindGroup(3 + i, extraGroups[i]);
        }

        // Vertex/Index buffer
        const {vertexBuffer, indexBuffer} = this.#geometry;
        if (vertexBuffer) {
            currentRenderPassEncoder.setVertexBuffer(0, (vertexBuffer as any).gpuBuffer ?? vertexBuffer);
        }

        if (indexBuffer?.gpuBuffer) {
            currentRenderPassEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint16');
            currentRenderPassEncoder.drawIndexedIndirect(this.#indirectDrawBuffer, 0);
        } else {
            currentRenderPassEncoder.drawIndirect(this.#indirectDrawBuffer, 0);
        }

        // children render
        this.children?.forEach((child: any) => {
            if (child?.render) child.render(renderViewStateData, _shadowRender);
        });
    }

    protected abstract getVertexShaderSource(): string;

    protected abstract getExtraBindGroupLayouts(): GPUBindGroupLayout[];

    protected abstract getExtraBindGroups(): GPUBindGroup[];

    protected abstract getHeightmapTexture(): any;

    protected abstract getHeightmapSampler(): any;

    // =========================================================
    // Private
    // =========================================================

    protected abstract getSplatTexture(): any;

    #initBuffers(): void {
        const {gpuDevice} = this.redGPUContext;

        // Instance storage buffer
        this.#instanceData = new Float32Array(this.#maxInstanceCount * INSTANCE_FLOATS);
        this.#instanceBuffer = new StorageBuffer(
            this.redGPUContext,
            this.#instanceData.buffer as ArrayBuffer,
            `ProceduralInstanceBuffer_${this.uuid}`
        );

        // Culling uniform buffer
        this.#cullingUniformData = new Float32Array(CULLING_UNIFORM_FLOATS);
        this.#cullingUniformBuffer = new StorageBuffer(
            this.redGPUContext,
            this.#cullingUniformData.buffer as ArrayBuffer,
            `ProceduralCullingUniform_${this.uuid}`
        );

        // Visibility buffer (maxInstanceCount × 8 bytes: 2 × u32)
        this.#visibilityBuffer = gpuDevice.createBuffer({
            label: `ProceduralVisibility_${this.uuid}`,
            size: this.#maxInstanceCount * 8,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        // Indirect draw buffer (5 × u32 = 20 bytes)
        this.#indirectDrawBuffer = gpuDevice.createBuffer({
            label: `ProceduralIndirectDraw_${this.uuid}`,
            size: INDIRECT_DRAW_BYTES,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        // Vertex uniform buffer (32 bytes = 8 × u32)
        const vertexUniformData = new Uint32Array(8);
        this.#vertexUniformBuffer = new StorageBuffer(
            this.redGPUContext,
            vertexUniformData.buffer as ArrayBuffer,
            `ProceduralVertexUniform_${this.uuid}`
        );

        // IndirectDrawArgs 초기화: vertexCount는 geometry에서 나중에 세팅
        // instanceCount = 0, firstVertex/baseVertex/firstInstance = 0
        const initData = new Uint32Array(5);
        initData[0] = 0; // vertexCount (나중에 업데이트)
        initData[1] = 0; // instanceCount
        initData[2] = 0; // firstVertex
        initData[3] = 0; // baseVertex
        initData[4] = 0; // firstInstance
        gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, initData);
    }

    #initCullingPipeline(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;

        this.#cullingBGL = gpuDevice.createBindGroupLayout({
            label: `ProceduralCullingBGL_${this.uuid}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
            ]
        });

        const cullingModule = resourceManager.createGPUShaderModule(
            `ProceduralCullingModule_${this.uuid}`,
            {
                code: cullingComputeSource
            }
        );

        const systemBGL = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            label: `ProceduralCullingPipeline_${this.uuid}`,
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [systemBGL, this.#cullingBGL]
            }),
            compute: {
                module: cullingModule,
                entryPoint: 'main'
            }
        });

        this.#updateCullingBindGroup();
    }

    #updateCullingBindGroup(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const heightmapTex = this.getHeightmapTexture();
        const heightmapSampler = this.getHeightmapSampler();
        const splatTex = this.getSplatTexture();

        const samplerGPU = heightmapSampler?.gpuSampler || resourceManager.basicDisplacementSampler.gpuSampler;
        const textureViewGPU = resourceManager.getGPUResourceBitmapTextureView(heightmapTex) || resourceManager.emptyBitmapTextureView;
        const splatViewGPU = resourceManager.getGPUResourceBitmapTextureView(splatTex) || resourceManager.emptyBitmapTextureView;

        this.#cullingBindGroup = gpuDevice.createBindGroup({
            label: `ProceduralCullingBG_${this.uuid}`,
            layout: this.#cullingBGL,
            entries: [
                {binding: 0, resource: {buffer: this.#instanceBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#cullingUniformBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.#visibilityBuffer}},
                {binding: 3, resource: {buffer: this.#indirectDrawBuffer}},
                {binding: 4, resource: samplerGPU},
                {binding: 5, resource: textureViewGPU},
                {binding: 6, resource: splatViewGPU},
            ]
        });
        this.#prevHeightmapTexture = heightmapTex;
        this.#prevSplatTexture = splatTex;
    }

    #initRenderPipeline(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const material = this.#material;

        // Material이 아직 준비되지 않은 경우
        if (!material.gpuRenderInfo?.fragmentBindGroupLayout) {
            material._updateFragmentState();
        }
        if (!material.gpuRenderInfo?.fragmentBindGroupLayout) return;

        const vertexSource = this.getVertexShaderSource();
        const vertexModule = resourceManager.createGPUShaderModule(
            `ProceduralVertexModule_${this.uuid}`,
            {
                code: vertexSource
            }
        );

        // group(1) BGL: instance buffer + visibility buffer + vertex uniforms
        this.#vertexBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `ProceduralVertexBGL_${this.uuid}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 2, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
            ]
        });

        // group(0): System
        const systemBGL = resourceManager.getGPUBindGroupLayout(
            ResourceManager.PRESET_GPUBindGroupLayout_System
        );

        // group(2): Fragment
        const fragmentBGL = material.gpuRenderInfo.fragmentBindGroupLayout;

        // group(3+): Extra
        const extraLayouts = this.getExtraBindGroupLayouts();

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `ProceduralPipelineLayout_${this.uuid}`,
            bindGroupLayouts: [systemBGL, this.#vertexBindGroupLayout, fragmentBGL, ...extraLayouts]
        });

        // Vertex buffer layout (geometry의 interleavedStruct 기반)
        const geo = this.#geometry;
        const vertexBuffers: GPUVertexBufferLayout[] = [{
            arrayStride: (geo as any).vertexBuffer?.interleavedStruct?.arrayStride ?? 48,
            attributes: (geo as any).vertexBuffer?.interleavedStruct?.attributes ?? [
                {shaderLocation: 0, offset: 0, format: 'float32x3'},   // position
                {shaderLocation: 1, offset: 12, format: 'float32x3'},  // normal
                {shaderLocation: 2, offset: 24, format: 'float32x2'},  // uv
                {shaderLocation: 3, offset: 32, format: 'float32x4'},  // tangent
            ]
        }];

        const fragmentState = material.gpuRenderInfo.fragmentState;

        this.#renderPipeline = gpuDevice.createRenderPipeline({
            label: `ProceduralRenderPipeline_${this.uuid}`,
            layout: pipelineLayout,
            vertex: {
                module: vertexModule,
                entryPoint: 'main',
                buffers: vertexBuffers,
            },
            fragment: fragmentState,
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {count: 1},
        });

        // Vertex BindGroup
        this.#vertexBindGroup = gpuDevice.createBindGroup({
            label: `ProceduralVertexBG_${this.uuid}`,
            layout: this.#vertexBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#instanceBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#visibilityBuffer}},
                {binding: 2, resource: {buffer: this.#vertexUniformBuffer.gpuBuffer}},
            ]
        });

        // IndirectDrawArgs vertexCount 업데이트
        this.#updateIndirectDrawVertexCount();

        this.#pipelineReady = true;
    }

    #updateIndirectDrawVertexCount(): void {
        const geo = this.#geometry;
        const indexBuffer = (geo as any).indexBuffer ?? (geo as any).gpuRenderInfo?.indexBuffer;
        const vertexCount = indexBuffer
            ? (indexBuffer.count ?? (indexBuffer.gpuBuffer ? (indexBuffer.gpuBuffer.size / 2) : 0))
            : ((geo as any).vertexBuffer?.count ?? 0);

        const data = new Uint32Array(1);
        data[0] = vertexCount;
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#indirectDrawBuffer, 0, data);
    }

    #updateCullingUniforms(renderViewStateData: RenderViewStateData): void {
        const d = this.#cullingUniformData;
        const uintView = new Uint32Array(d.buffer as ArrayBuffer);

        // [0] instanceCount
        uintView[0] = this.#instanceCount;
        // [1] boundingRadiusScale
        d[1] = 2.0;
        // [2] globalFragmentSlotIndex
        uintView[2] = this.material.globalFragmentSlotIndex ?? 0;
        // [3] maxDistanceSq (거리 기반 식생 Culling!)
        d[3] = this.maxDistance * this.maxDistance;

        // [4..19] groupModelMatrix (16 floats)
        const mat = this.modelMatrix;
        for (let i = 0; i < 16; i++) {
            d[4 + i] = mat[i];
        }

        // [20, 21] worldSize (vec2)
        d[20] = this.worldSize[0];
        d[21] = this.worldSize[1];

        // [22, 23] worldOffset (vec2)
        d[22] = this.worldOffset[0];
        d[23] = this.worldOffset[1];

        // [24] maxHeight
        d[24] = this.maxHeight;
        // [25] minHeight
        d[25] = this.minHeight;

        // [26] maskChannel
        let chIdx = 1;
        if (this.maskChannel === 'r') chIdx = 0;
        else if (this.maskChannel === 'b') chIdx = 2;
        else if (this.maskChannel === 'a') chIdx = 3;
        uintView[26] = chIdx;

        // [27] maskThreshold
        d[27] = this.maskThreshold;

        // [28] startFadeDistanceSq (부드러운 Dithered Fade Out 시작 거리 제곱!)
        d[28] = this.startFadeDistance * this.startFadeDistance;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#cullingUniformBuffer.gpuBuffer,
            0,
            d.buffer as ArrayBuffer,
            0,
            CULLING_UNIFORM_FLOATS * 4
        );
    }

    #updateVertexUniforms(): void {
        const buffer = new ArrayBuffer(32);
        const uintView = new Uint32Array(buffer);
        const floatView = new Float32Array(buffer);

        uintView[0] = this.#material.globalFragmentSlotIndex ?? 0;
        floatView[1] = this.maxDistance * this.maxDistance;
        floatView[2] = this.startFadeDistance * this.startFadeDistance;
        floatView[3] = this.windMaxDistance * this.windMaxDistance;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#vertexUniformBuffer.gpuBuffer,
            0,
            buffer
        );
    }
}

export default ProceduralInstancingMesh;
