/**
 * [KO] 잔디(Grass) GPU 초고속 컬링 전담 모듈입니다.
 * [EN] Ultra-fast GPU Culling module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import grassCullWGSL from "./grassCull.wgsl";
import type GrassScatterMegaBuffer from "../buffer/GrassScatterMegaBuffer";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";

/**
 * [KO] 단일 컴퓨트 패스로 대규모 잔디 인스턴스 전체의 시야각(프러스텀) 및 거리 컬링을 처리하는 전담 GPU 컬러 클래스입니다.
 * [EN] Dedicated GPU culler class that performs view frustum and distance culling for large-scale grass instances in a single compute pass.
 */
class GrassCuller extends AScatterCuller {
    #globalUniformBuffer: GPUBuffer | null = null;

    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.initComputePipeline('Grass_Cull_ShaderModule', grassCullWGSL, 'Grass_Cull');

        const {gpuDevice} = this;
        const {UNIFORM, COPY_DST} = GPUBufferUsage;
        this.#globalUniformBuffer = gpuDevice.createBuffer({
            label: 'Grass_Cull_GlobalUniformBuffer',
            size: this.#uniformArrayBuffer.byteLength,
            usage: UNIFORM | COPY_DST
        });
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
        const {totalAllocatedInstances} = megaBuffer;
        if (totalAllocatedInstances <= 0) return;

        const {bindGroupLayout, gpuDevice} = this;
        const {view, frustumPlanesFlat} = renderViewStateData;
        const {rawCamera} = view;
        const {x, y, z} = rawCamera;
        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        uf[0] = x;
        uf[1] = y;
        uf[2] = z;
        uu[3] = totalAllocatedInstances;

        uf.set(frustumPlanesFlat, 4);

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

Object.freeze(GrassCuller);
export default GrassCuller;
