/**
 * [KO] GPU 초고속 컬링 파이프라인 매니저 모듈입니다.
 * [EN] Ultra-fast GPU Culling Pipeline manager module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import grassCullWGSL from "./grassCull.wgsl";
import type {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import AScatterCullPipeline from "../../../core/scatter/AScatterCullPipeline";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";

export default class GrassCullPipeline extends AScatterCullPipeline {
    #globalUniformBuffer: GPUBuffer | null = null;

    // Zero-GC: 256B ArrayBuffer 및 뷰 재사용
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.initComputePipeline('Grass_Cull_ShaderModule', grassCullWGSL, 'Grass_Cull');
    }

    /**
     * [KO] 매 프레임 GPU 컴퓨트 패스를 통해 등록된 모든 잔디 타입의 거리 및 프러스텀 컬링을 단 1회의 디스패치로 초고속 수행합니다 (위치 계산 0%).
     * [EN] Dispatches ultra-fast GPU distance and frustum culling across all registered grass types in a single dispatch every frame (0% position calculations).
     *
     * @param computePass - GPU 컴퓨트 패스 인코더
     * @param megaBuffer - 잔디 스캐터 메가버퍼
     * @param renderViewStateData - 렌더 뷰 상태 데이터 SSOT
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassScatterMegaBuffer,
        renderViewStateData: RenderViewStateData
    ): void {
        const bindGroupLayout = this.bindGroupLayout;
        const gpuDevice = this.gpuDevice;
        if (!this.computePipeline || !bindGroupLayout || !gpuDevice) return;

        const totalAllocatedInstances = megaBuffer.totalAllocatedInstances;
        if (totalAllocatedInstances <= 0) return;

        if (!this.#globalUniformBuffer) {
            this.#globalUniformBuffer = gpuDevice.createBuffer({
                label: 'Grass_Cull_GlobalUniformBuffer',
                size: this.#uniformArrayBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
        }

        const {view} = renderViewStateData;
        const camera = view.rawCamera;
        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        uf[0] = camera.x;
        uf[1] = camera.y;
        uf[2] = camera.z;
        uu[3] = totalAllocatedInstances;

        const frustumPlanesF32 = renderViewStateData.frustumPlanesFlat;
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

        this.dispatchCompute(computePass, unifiedBG, totalAllocatedInstances, 64);
    }

    override destroy(): void {
        super.destroy();
        this.#globalUniformBuffer?.destroy();
        this.#globalUniformBuffer = null;
    }
}

Object.freeze(GrassCullPipeline);
