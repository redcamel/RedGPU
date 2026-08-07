import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import {ABaseMaterial} from "../../../material/core";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import Mesh from "../../mesh/Mesh";

const INSTANCE_MATRIX_FLOATS = 16;
const VERTEX_UNIFORM_BYTES = 32;

/**
 * GPU 인스턴싱 및 GPU Culling/Indirect Draw 지원 베이스 클래스
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
    boundingRadius: number = 5.0;

    #instanceMatrixBuffer: StorageBuffer;       // CPU 데이터 업로드용 Raw Storage Buffer
    #culledInstanceMatrixBuffer: StorageBuffer; // Compute Shader 컬링 결과 저장용 Storage Buffer
    #instanceMatrixData: Float32Array;
    #vertexUniformBuffer: StorageBuffer;
    #indirectBuffer: GPUBuffer;                 // drawIndexedIndirect / drawIndirect 전용 버퍼

    #renderPipeline: GPURenderPipeline;
    #vertexBindGroup: GPUBindGroup;
    #vertexBindGroupLayout: GPUBindGroupLayout;
    #maxInstanceCount: number;
    #instanceCount: number = 0;
    #geometry: Geometry | Primitive;
    #material: ABaseMaterial;
    #pipelineReady: boolean = false;
    #instanceDataDirty: boolean = false;

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
        this.#material.transparent = true
        this.#initBuffers();
    }

    get maxInstanceCount(): number {
        return this.#maxInstanceCount;
    }

    get instanceCount(): number {
        return this.#instanceCount;
    }

    set instanceCount(count: number) {
        if (count > this.#maxInstanceCount) {
            console.warn(`[ProceduralInstancingMesh] instanceCount(${count}) > max(${this.#maxInstanceCount}), clamped.`);
        }
        this.#instanceCount = Math.min(count, this.#maxInstanceCount);
    }

    get instanceData(): Float32Array {
        return this.#instanceMatrixData;
    }

    get rawInstanceMatrixBuffer(): StorageBuffer {
        return this.#instanceMatrixBuffer;
    }

    get culledInstanceMatrixBuffer(): StorageBuffer {
        return this.#culledInstanceMatrixBuffer;
    }

    get indirectBuffer(): GPUBuffer {
        return this.#indirectBuffer;
    }

    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    get material(): ABaseMaterial {
        return this.#material;
    }

    #dirtyStartIndex: number = -1;
    #dirtyEndIndex: number = -1;
    #indirectArgsData: Uint32Array = new Uint32Array(5);
    #vertexUniformBufferData: ArrayBuffer = new ArrayBuffer(VERTEX_UNIFORM_BYTES);
    #vertexUniformUintView: Uint32Array = new Uint32Array(this.#vertexUniformBufferData);
    #vertexUniformFloatView: Float32Array = new Float32Array(this.#vertexUniformBufferData);

    flushInstanceData(): void {
        if (!this.#instanceDataDirty) return;
        const start = this.#dirtyStartIndex >= 0 ? this.#dirtyStartIndex : 0;
        const end = this.#dirtyEndIndex >= 0 ? Math.min(this.#dirtyEndIndex, this.#instanceCount) : this.#instanceCount;
        if (end > start) {
            const byteOffset = start * INSTANCE_MATRIX_FLOATS * 4;
            const byteLength = (end - start) * INSTANCE_MATRIX_FLOATS * 4;
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                this.#instanceMatrixBuffer.gpuBuffer,
                byteOffset,
                this.#instanceMatrixData.buffer as ArrayBuffer,
                byteOffset,
                byteLength
            );
        }
        this.#dirtyStartIndex = -1;
        this.#dirtyEndIndex = -1;
        this.#instanceDataDirty = false;
    }

    markInstanceDataDirty(startInstanceIndex?: number, count?: number): void {
        this.#instanceDataDirty = true;
        if (startInstanceIndex !== undefined && count !== undefined && count > 0) {
            if (this.#dirtyStartIndex < 0) {
                this.#dirtyStartIndex = startInstanceIndex;
                this.#dirtyEndIndex = startInstanceIndex + count;
            } else {
                this.#dirtyStartIndex = Math.min(this.#dirtyStartIndex, startInstanceIndex);
                this.#dirtyEndIndex = Math.max(this.#dirtyEndIndex, startInstanceIndex + count);
            }
        } else {
            this.#dirtyStartIndex = 0;
            this.#dirtyEndIndex = this.#maxInstanceCount;
        }
    }

    /** Compute Pass 실행 전 Indirect Buffer 초기화 */
    resetIndirectArgs(indexCount: number): void {
        this.#indirectArgsData[0] = indexCount;
        this.#indirectArgsData[1] = 0;
        this.#indirectArgsData[2] = 0;
        this.#indirectArgsData[3] = 0;
        this.#indirectArgsData[4] = 0;
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#indirectBuffer,
            0,
            this.#indirectArgsData.buffer
        );
    }

    render(renderViewStateData: RenderViewStateData, _shadowRender: boolean = false): void {
        if (this.#instanceCount === 0) return;

        if (!this.#pipelineReady) {
            this.#initRenderPipeline();
        }
        if (!this.#pipelineReady) return;

        if (this.#instanceDataDirty) {
            this.flushInstanceData();
        }

        const {currentRenderPassEncoder, view} = renderViewStateData;
        if (!currentRenderPassEncoder) return;

        if (this.#material.dirtyPipeline) {
            this.#material._updateFragmentState();
            this.#initRenderPipeline();
        }

        const fragmentUniformBindGroup = this.#material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (!fragmentUniformBindGroup) return;

        this.#updateVertexUniforms();

        const encoder = currentRenderPassEncoder as any;
        if (!encoder._boundBindGroups) {
            encoder._boundBindGroups = [];
        }

        if (encoder._lastPipeline !== this.#renderPipeline) {
            currentRenderPassEncoder.setPipeline(this.#renderPipeline);
            encoder._lastPipeline = this.#renderPipeline;
        }

        const sysBG = view.systemUniform_Vertex_UniformBindGroup;
        if (encoder._boundBindGroups[0] !== sysBG) {
            currentRenderPassEncoder.setBindGroup(0, sysBG);
            encoder._boundBindGroups[0] = sysBG;
        }

        if (encoder._boundBindGroups[1] !== this.#vertexBindGroup) {
            currentRenderPassEncoder.setBindGroup(1, this.#vertexBindGroup);
            encoder._boundBindGroups[1] = this.#vertexBindGroup;
        }

        if (encoder._boundBindGroups[2] !== fragmentUniformBindGroup) {
            currentRenderPassEncoder.setBindGroup(2, fragmentUniformBindGroup);
            encoder._boundBindGroups[2] = fragmentUniformBindGroup;
        }

        const extraGroups = this.getExtraBindGroups();
        for (let i = 0; i < extraGroups.length; i++) {
            const slot = 3 + i;
            if (encoder._boundBindGroups[slot] !== extraGroups[i]) {
                currentRenderPassEncoder.setBindGroup(slot, extraGroups[i]);
                encoder._boundBindGroups[slot] = extraGroups[i];
            }
        }

        const geo = this.#geometry as any;
        const {vertexBuffer, indexBuffer} = geo;
        if (vertexBuffer) {
            currentRenderPassEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer ?? vertexBuffer);
        }

        if (indexBuffer?.gpuBuffer) {
            currentRenderPassEncoder.setIndexBuffer(indexBuffer.gpuBuffer, indexBuffer.format ?? 'uint16');
            currentRenderPassEncoder.drawIndexedIndirect(this.#indirectBuffer, 0);
        } else {
            currentRenderPassEncoder.drawIndirect(this.#indirectBuffer, 0);
        }

        this.children?.forEach((child: any) => {
            if (child?.render) child.render(renderViewStateData, _shadowRender);
        });
    }

    protected abstract getVertexShaderSource(): string;
    protected abstract getExtraBindGroupLayouts(): GPUBindGroupLayout[];
    protected abstract getExtraBindGroups(): GPUBindGroup[];
    protected abstract getHeightmapTexture(): any;
    protected abstract getHeightmapSampler(): any;
    protected abstract getSplatTexture(): any;

    #initBuffers(): void {
        const {gpuDevice} = this.redGPUContext;

        this.#instanceMatrixData = new Float32Array(this.#maxInstanceCount * INSTANCE_MATRIX_FLOATS);

        // 원본 인스턴스 버퍼
        this.#instanceMatrixBuffer = new StorageBuffer(
            this.redGPUContext,
            this.#instanceMatrixData.buffer as ArrayBuffer,
            `ProceduralInstanceMatrix_${this.uuid}`
        );

        // 컬링된 결과 저장용 버퍼
        this.#culledInstanceMatrixBuffer = new StorageBuffer(
            this.redGPUContext,
            this.#instanceMatrixData.buffer as ArrayBuffer,
            `ProceduralCulledInstanceMatrix_${this.uuid}`
        );

        // Indirect Draw Argument Buffer (5 * u32 = 20 Bytes)
        this.#indirectBuffer = gpuDevice.createBuffer({
            label: `ProceduralIndirectBuffer_${this.uuid}`,
            size: 5 * Uint32Array.BYTES_PER_ELEMENT,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        const vertexUniformData = new Uint32Array(VERTEX_UNIFORM_BYTES / 4);
        this.#vertexUniformBuffer = new StorageBuffer(
            this.redGPUContext,
            vertexUniformData.buffer as ArrayBuffer,
            `ProceduralVertexUniform_${this.uuid}`
        );
    }

    #initRenderPipeline(): void {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const material = this.#material;

        if (!material.gpuRenderInfo?.fragmentBindGroupLayout) {
            material._updateFragmentState();
        }
        if (!material.gpuRenderInfo?.fragmentBindGroupLayout) return;

        const vertexSource = this.getVertexShaderSource();
        const vertexModule = resourceManager.createGPUShaderModule(
            `ProceduralVertexModule_${this.uuid}`,
            {code: vertexSource}
        );

        // group(1): culledInstanceMatrixBuffer + vertexUniformBuffer
        this.#vertexBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `ProceduralVertexBGL_${this.uuid}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
            ]
        });

        const systemBGL = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const fragmentBGL = material.gpuRenderInfo.fragmentBindGroupLayout;
        const extraLayouts = this.getExtraBindGroupLayouts();

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `ProceduralPipelineLayout_${this.uuid}`,
            bindGroupLayouts: [systemBGL, this.#vertexBindGroupLayout, fragmentBGL, ...extraLayouts]
        });

        const geo = this.#geometry;
        const vertexBuffers: GPUVertexBufferLayout[] = [{
            arrayStride: (geo as any).vertexBuffer?.interleavedStruct?.arrayStride ?? 48,
            attributes: (geo as any).vertexBuffer?.interleavedStruct?.attributes ?? [
                {shaderLocation: 0, offset: 0, format: 'float32x3'},
                {shaderLocation: 1, offset: 12, format: 'float32x3'},
                {shaderLocation: 2, offset: 24, format: 'float32x2'},
                {shaderLocation: 3, offset: 32, format: 'float32x4'},
            ]
        }];

        this.#renderPipeline = gpuDevice.createRenderPipeline({
            label: `ProceduralRenderPipeline_${this.uuid}`,
            layout: pipelineLayout,
            vertex: {
                module: vertexModule,
                entryPoint: 'main',
                buffers: vertexBuffers,
            },
            fragment: material.gpuRenderInfo.fragmentState,
            primitive: {topology: 'triangle-list', cullMode: 'none'},
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {count: 1},
        });

        // Vertex Shader에는 컬링 통과 버퍼(#culledInstanceMatrixBuffer) 바인딩
        this.#vertexBindGroup = gpuDevice.createBindGroup({
            label: `ProceduralVertexBG_${this.uuid}`,
            layout: this.#vertexBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#culledInstanceMatrixBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.#vertexUniformBuffer.gpuBuffer}},
            ]
        });

        this.#pipelineReady = true;
    }

    #updateVertexUniforms(): void {
        this.#vertexUniformUintView[0] = this.#material.globalFragmentSlotIndex ?? 0;
        this.#vertexUniformFloatView[1] = this.maxDistance * this.maxDistance;
        this.#vertexUniformFloatView[2] = this.startFadeDistance * this.startFadeDistance;
        this.#vertexUniformFloatView[3] = this.windMaxDistance * this.windMaxDistance;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#vertexUniformBuffer.gpuBuffer,
            0,
            this.#vertexUniformBufferData
        );
    }
}

export default ProceduralInstancingMesh;