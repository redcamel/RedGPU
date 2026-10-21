import RedGPUContext from "../../../../context/RedGPUContext";
import grassCullWGSL from "./grassCull.wgsl";
import type GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";

/**
 * [KO] 컴퓨트 셰이더를 통해 잔디 인스턴스의 절두체 및 거리 기반 GPU 컬링을 수행하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that performs frustum and distance-based GPU culling of grass instances via a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class GrassCuller extends AScatterCuller {
    #globalUniformBuffer: GPUBuffer | null = null;

    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    /**
     * [KO] `GrassCuller` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassCuller` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
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
     * [KO] 현재 뷰의 카메라 및 절두체 정보를 업데이트하고 잔디 컬링 컴퓨트 패스를 디스패치합니다.
     * [EN] Updates camera and frustum information for the current view and dispatches the grass culling compute pass.
     *
     * @param computePass -
     * [KO] 대상 `GPUComputePassEncoder` 인스턴스
     * [EN] Target `GPUComputePassEncoder` instance
     * @param megaBuffer -
     * [KO] 잔디 메가 버퍼 인스턴스
     * [EN] Grass mega buffer instance
     * @param renderViewStateData -
     * [KO] 현재 렌더링 뷰 상태 데이터
     * [EN] Current render view state data
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassMegaBuffer,
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

    /**
     * [KO] 컬러가 점유한 GPU 유니폼 버퍼 및 파이프라인 리소스를 해제합니다.
     * [EN] Releases GPU uniform buffers and pipeline resources occupied by the culler.
     */
    override destroy(): void {
        super.destroy();
        this.#globalUniformBuffer.destroy();
        this.#globalUniformBuffer = null;
    }
}

Object.freeze(GrassCuller);
export default GrassCuller;

