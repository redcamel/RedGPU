/**
 * [KO] GPU 초고속 컬링 파이프라인 매니저 모듈입니다.
 * [EN] Ultra-fast GPU Culling Pipeline manager module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassCullWGSL from "./grassCull.wgsl";
import type {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";

export default class GrassCullPipeline extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #globalUniformBuffer: GPUBuffer | null = null;

    // Zero-GC: 256B ArrayBuffer 및 뷰 재사용
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#initPipeline();
    }


    /**
     * [KO] 매 프레임 GPU 컴퓨트 패스를 통해 등록된 모든 잔디 타입의 거리 및 프러스텀 컬링을 단 1회의 디스패치로 초고속 수행합니다 (위치 계산 0%).
     * [EN] Dispatches ultra-fast GPU distance and frustum culling across all registered grass types in a single dispatch every frame (0% position calculations).
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassScatterMegaBuffer,
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanesF32: Float32Array | null
    ): void {
        const pipeline = this.#computePipeline;
        const bindGroupLayout = this.#bindGroupLayout;
        const gpuDevice = this.gpuDevice;
        if (!pipeline || !bindGroupLayout || !gpuDevice) return;

        const totalAllocatedInstances = megaBuffer.totalAllocatedInstances;
        if (totalAllocatedInstances <= 0) return;

        if (!this.#globalUniformBuffer) {
            this.#globalUniformBuffer = gpuDevice.createBuffer({
                label: 'Grass_Cull_GlobalUniformBuffer',
                size: this.#uniformArrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }

        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        uf[0] = camX;
        uf[1] = camY;
        uf[2] = camZ;
        uu[3] = totalAllocatedInstances;

        if (frustumPlanesF32 && frustumPlanesF32.length === 24) {
            uf.set(frustumPlanesF32, 4);
        } else {
            for (let p = 0; p < 24; p++) uf[4 + p] = 0;
        }

        // 28 floats (112 bytes) 정확한 바이트 크기 전송으로 버스 대역폭 낭비 방지
        gpuDevice.queue.writeBuffer(this.#globalUniformBuffer, 0, this.#uniformArrayBuffer, 0, 112);

        const unifiedBG = megaBuffer.getOrCreateUnifiedCullingBindGroup(
            bindGroupLayout,
            this.#globalUniformBuffer
        );
        if (!unifiedBG) return;

        computePass.setPipeline(pipeline);
        computePass.setBindGroup(0, unifiedBG);
        const workgroups = Math.ceil(totalAllocatedInstances / 64);
        computePass.dispatchWorkgroups(workgroups);
    }

    destroy(): void {
        this.#globalUniformBuffer?.destroy();
        this.#globalUniformBuffer = null;
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
