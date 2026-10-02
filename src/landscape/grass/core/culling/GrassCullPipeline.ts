/**
 * [KO] GPU 초고속 컬링 파이프라인 매니저 모듈입니다.
 * [EN] Ultra-fast GPU Culling Pipeline manager module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassCullWGSL from "./grassCull.wgsl";
import type Grass from "../Grass";
import type {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";

export default class GrassCullPipeline extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #typeUniformBuffers: Map<number, GPUBuffer> = new Map();

    // Zero-GC: 256B ArrayBuffer 및 뷰 재사용
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    #cachedBindGroups: Map<number, GPUBindGroup> = new Map();
    #cachedRawBuffer: GPUBuffer | null = null;
    #cachedCulledBuffer: GPUBuffer | null = null;
    #cachedIndirectBuffer: GPUBuffer | null = null;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#initPipeline();
    }

    /**
     * [KO] 캐시된 바인드그룹을 무효화합니다 (메가버퍼 재생성 시 호출).
     * [EN] Invalidates cached bind groups (called when mega-buffers are recreated).
     */
    invalidateBindGroups(): void {
        this.#cachedBindGroups.clear();
        this.#cachedRawBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
    }

    /**
     * [KO] 매 프레임 GPU 컴퓨트 패스를 통해 잔디 거리 및 프러스텀 컬링을 초고속으로 수행합니다 (위치 계산 0%).
     * [EN] Dispatches ultra-fast GPU distance and frustum culling every frame (0% position calculations).
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassScatterMegaBuffer,
        grassList: Grass[],
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanesF32: Float32Array | null
    ): void {
        const pipeline = this.#computePipeline;
        const bindGroupLayout = this.#bindGroupLayout;
        const gpuDevice = this.gpuDevice;
        if (!pipeline || !bindGroupLayout || !gpuDevice) return;

        const rawBuffer = megaBuffer.rawGPUBuffer;
        const culledBuffer = megaBuffer.culledGPUBuffer;
        const indirectBuffer = megaBuffer.indirectGPUBuffer;
        if (!rawBuffer || !culledBuffer || !indirectBuffer) return;

        if (
            this.#cachedRawBuffer !== rawBuffer ||
            this.#cachedCulledBuffer !== culledBuffer ||
            this.#cachedIndirectBuffer !== indirectBuffer
        ) {
            this.invalidateBindGroups();
            this.#cachedRawBuffer = rawBuffer;
            this.#cachedCulledBuffer = culledBuffer;
            this.#cachedIndirectBuffer = indirectBuffer;
        }

        computePass.setPipeline(pipeline);

        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        const listLen = grassList.length;
        for (let i = 0; i < listLen; i++) {
            const grass = grassList[i];
            const typeId = grass.typeId;
            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.instanceCount <= 0) continue;

            const totalInstances = alloc.instanceCount;
            const cullingDist = grass.cullingDistance || 80.0;
            const farDist = grass.farDistance || (cullingDist * 0.5);

            uf[0] = camX;
            uf[1] = camY;
            uf[2] = camZ;
            uf[3] = cullingDist * cullingDist;

            uf[4] = farDist * farDist;
            uu[5] = totalInstances;
            uu[6] = alloc.rawBaseOffset;
            uu[7] = alloc.culledBaseOffset;

            const nearSlotIdx = alloc.nearSlots.length > 0 ? alloc.nearSlots[0].indirectOffset : 0;
            const farSlotIdx = alloc.farSlots.length > 0 ? alloc.farSlots[0].indirectOffset : nearSlotIdx;

            uu[8] = alloc.culledBaseOffset + alloc.maxInstances; // culledFarBaseOffset
            uu[9] = nearSlotIdx;
            uu[10] = farSlotIdx;
            uu[11] = alloc.subMeshCount;

            uu[12] = alloc.farSlots.length > 0 ? 1 : 0;
            uu[13] = 0;
            uu[14] = 0;
            uu[15] = 0;

            if (frustumPlanesF32 && frustumPlanesF32.length === 24) {
                uf.set(frustumPlanesF32, 16);
            } else {
                for (let p = 0; p < 24; p++) uf[16 + p] = 0;
            }

            let uBuf = this.#typeUniformBuffers.get(typeId);
            if (!uBuf) {
                uBuf = gpuDevice.createBuffer({
                    label: `Grass_Cull_UniformBuffer_Type_${typeId}`,
                    size: this.#uniformArrayBuffer.byteLength,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
                this.#typeUniformBuffers.set(typeId, uBuf);
            }

            gpuDevice.queue.writeBuffer(uBuf, 0, this.#uniformArrayBuffer);

            let bg = this.#cachedBindGroups.get(typeId);
            if (!bg) {
                bg = gpuDevice.createBindGroup({
                    label: `Grass_Cull_BG_Type_${typeId}`,
                    layout: bindGroupLayout,
                    entries: [
                        {binding: 0, resource: {buffer: uBuf}},
                        {binding: 1, resource: {buffer: rawBuffer}},
                        {binding: 2, resource: {buffer: culledBuffer}},
                        {binding: 3, resource: {buffer: indirectBuffer}},
                    ]
                });
                this.#cachedBindGroups.set(typeId, bg);
            }

            computePass.setBindGroup(0, bg);
            const workgroups = Math.ceil(totalInstances / 64);
            computePass.dispatchWorkgroups(workgroups);
        }
    }

    destroy(): void {
        for (const buf of this.#typeUniformBuffers.values()) {
            buf.destroy();
        }
        this.#typeUniformBuffers.clear();
        this.#cachedBindGroups.clear();
        this.#cachedRawBuffer = null;
        this.#cachedCulledBuffer = null;
        this.#cachedIndirectBuffer = null;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }

    #initPipeline(): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        if (!gpuDevice) return;

        const shaderInfo = resourceManager.wgslParser.parse('Grass_Cull_ShaderModule', grassCullWGSL);
        let computeModule = resourceManager.getGPUShaderModule('Grass_Cull_ShaderModule');
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule('Grass_Cull_ShaderModule', {
                code: grassCullWGSL
            });
        }

        const bglDesc = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout('Grass_Cull_BGL', bglDesc);

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Grass_Cull_PipelineLayout', {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: 'Grass_Cull_Pipeline',
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main'
            }
        });
    }
}

Object.freeze(GrassCullPipeline);
