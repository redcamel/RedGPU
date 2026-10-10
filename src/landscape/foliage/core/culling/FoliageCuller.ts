/**
 * [KO] 식생 GPU 프러스텀/거리/HZB 컬링 및 베이킹 컬러 모듈입니다.
 * [EN] Foliage GPU frustum/distance/HZB culling and baking culler module.
 * @packageDocumentation
 */
import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import type Foliage from "../Foliage";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import type PerspectiveCamera from "../../../../camera/camera/PerspectiveCamera";
import foliageCullWGSL from "./foliageCull.wgsl";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import FoliageScatterMegaBuffer from "../buffer/FoliageScatterMegaBuffer";
import FoliageInstanceBaker from "../baking/FoliageInstanceBaker";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 모든 식생 인스턴스에 대해 GPU 컴퓨트 셰이더를 통한 프러스텀 컬링, 거리 LOD 판별, HZB 오클루전 컬링 작업을 수행하는 클래스입니다.
 * [EN] Class that executes GPU compute shader passes for frustum culling, distance LOD selection, and HZB occlusion culling across all foliage instances.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class FoliageCuller extends AScatterCuller {
    #tempPVMatrix: mat4 = mat4.create();
    #megaBuffer: FoliageScatterMegaBuffer | null = null;
    #baker: FoliageInstanceBaker;
    #lastHZBTextureView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;

    #lastFOV: number = -1;
    #cachedFovFactor: number = 1.0;

    /**
     * [KO] FoliageCuller 인스턴스를 생성하고 내부 컴퓨트 파이프라인을 초기화합니다.
     * [EN] Creates a FoliageCuller instance and initializes the internal compute pipeline.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param megaBuffer -
     * [KO] 식생 메가 버퍼 (선택사항)
     * [EN] Foliage mega buffer (optional)
     */
    constructor(redGPUContext: RedGPUContext, megaBuffer?: FoliageScatterMegaBuffer | null) {
        super(redGPUContext);
        this.#megaBuffer = megaBuffer || null;
        this.#baker = new FoliageInstanceBaker(this.redGPUContext);
        this.initComputePipeline('Foliage_Cull_ShaderModule', foliageCullWGSL, 'Foliage_Cull');
    }

    /**
     * [KO] 식생 인스턴스 물리 베이커 인스턴스
     * [EN] Foliage instance physical baker instance
     */
    get baker(): FoliageInstanceBaker {
        return this.#baker;
    }

    /**
     * [KO] 카메라 위치와 프러스텀, 그림자 캐스케이드 상태를 기반으로 컬링 파라미터를 갱신하고 GPU 디스패치를 준비합니다.
     * [EN] Updates culling parameters and prepares GPU compute dispatches based on camera position, frustum, and shadow cascades.
     * @param foliageList -
     * [KO] 활성 식생 목록
     * [EN] Active foliage list
     * @param renderViewStateData -
     * [KO] 렌더 패스 상태 데이터
     * [EN] Render pass state data
     */
    update(
        foliageList: Foliage[],
        renderViewStateData: RenderViewStateData
    ): void {
        const typeCount = foliageList.length;
        if (typeCount === 0) return;

        const {view} = renderViewStateData;
        const camera = view.rawCamera;
        const cam3D = camera as PerspectiveCamera;

        const fov = cam3D.fieldOfView ?? 60.0;
        if (fov !== this.#lastFOV) {
            this.#lastFOV = fov;
            const fovRad = (fov * Math.PI) / 180.0;
            this.#cachedFovFactor = Math.tan(fovRad * 0.5);
        }
        const fovFactor = this.#cachedFovFactor;

        const megaBuffer = this.#megaBuffer;
        if (!megaBuffer) return;

        const {hierarchicalZBuffer: hzb, projectionMatrix} = view;
        this.#lastHZBTextureView = hzb?.textureView || null;
        this.#lastHZBSampler = hzb?.sampler || null;

        mat4.multiply(this.#tempPVMatrix, projectionMatrix, cam3D.viewMatrix);

        megaBuffer.updateUnifiedGlobalUniforms(
            renderViewStateData,
            fovFactor,
            this.#tempPVMatrix
        );
    }

    /**
     * [KO] 인다이렉트 드로우 커맨드 카운터 리셋 커맨드를 기록합니다.
     * [EN] Records indirect draw command counter reset commands.
     */
    recordResetCommands(encoder: GPUCommandEncoder): void {
        if (this.#megaBuffer) {
            this.#megaBuffer.resetMultiIndirectCommands(encoder);
        }
    }

    /**
     * [KO] 주어진 GPU 컴퓨트 패스 인코더를 통해 식생 인스턴스 컬링을 디스패치합니다.
     * [EN] Dispatches foliage instance culling through the given GPU compute pass encoder.
     */
    dispatchPass(computePass: GPUComputePassEncoder): void {
        const {computePipeline, bindGroupLayout} = this;
        const megaBuffer = this.#megaBuffer;
        if (!computePipeline || !bindGroupLayout || !megaBuffer) return;

        const totalAllocatedInstances = megaBuffer.totalAllocatedInstances;
        if (totalAllocatedInstances <= 0) return;

        const unifiedBindGroup = megaBuffer.getOrCreateUnifiedCullingBindGroup(
            bindGroupLayout,
            this.#lastHZBTextureView,
            this.#lastHZBSampler
        );
        if (unifiedBindGroup) {
            this.dispatchCompute(computePass, unifiedBindGroup, totalAllocatedInstances, 64);
        }
    }

    /**
     * [KO] 단독 실행 모드로 컬링 파라미터를 갱신하고 독립적인 전처리 컴퓨트 패스를 발행합니다.
     * [EN] Updates culling parameters and issues an independent pre-process compute pass in standalone mode.
     */
    updateAndDispatch(
        foliageList: Foliage[],
        renderViewStateData: RenderViewStateData
    ): void {
        this.update(foliageList, renderViewStateData);

        if (this.computePipeline && this.bindGroupLayout) {
            this.commandEncoderManager.useEncoder(
                COMMAND_ENCODER_TYPE.PRE_PROCESS,
                this.#onResetMultiIndirectCommands
            );

            this.commandEncoderManager.addPreProcessComputePass(
                'Foliage_GPUCulling_ComputePass',
                this.#onPreProcessComputePass
            );
        }
    }

    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.recordResetCommands(encoder);
    };

    /**
     * [KO] 컬링 및 베이커 리소스를 해제합니다.
     * [EN] Destroys culler and baker resources.
     */
    override destroy(): void {
        super.destroy();
        this.#baker.destroy();
        this.#lastHZBTextureView = null;
        this.#lastHZBSampler = null;
        this.#megaBuffer = null;
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        this.dispatchPass(computePass);
    };
}

Object.freeze(FoliageCuller);
export default FoliageCuller;
