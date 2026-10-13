import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import type Foliage from "../Foliage";
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import type PerspectiveCamera from "../../../../camera/camera/PerspectiveCamera";
import foliageCullWGSL from "./foliageCull.wgsl";
import AScatterCuller from "../../../core/scatter/AScatterCuller";
import FoliageMegaBuffer from "../buffer/FoliageMegaBuffer";
import FoliageInstanceBaker from "../baking/FoliageInstanceBaker";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

class FoliageCuller extends AScatterCuller {
    #tempPVMatrix: mat4 = mat4.create();
    #megaBuffer: FoliageMegaBuffer | null = null;
    #baker: FoliageInstanceBaker;
    #lastHZBTextureView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;

    #lastFOV: number = -1;
    #cachedFovFactor: number = 1.0;

    constructor(redGPUContext: RedGPUContext, megaBuffer?: FoliageMegaBuffer | null) {
        super(redGPUContext);
        this.#megaBuffer = megaBuffer ?? null;
        this.#baker = new FoliageInstanceBaker(redGPUContext);
        this.initComputePipeline('Foliage_Cull_ShaderModule', foliageCullWGSL, 'Foliage_Cull');
    }

    get baker(): FoliageInstanceBaker {
        return this.#baker;
    }

    update(
        foliageList: Foliage[],
        renderViewStateData: RenderViewStateData
    ): void {
        const typeCount = foliageList.length;
        if (typeCount === 0) return;

        const {view} = renderViewStateData;
        const {rawCamera, hierarchicalZBuffer, projectionMatrix} = view;
        const cam3D = rawCamera as PerspectiveCamera;

        const fov = cam3D.fieldOfView ?? 60.0;
        if (fov !== this.#lastFOV) {
            this.#lastFOV = fov;
            const fovRad = (fov * Math.PI) / 180.0;
            this.#cachedFovFactor = Math.tan(fovRad * 0.5);
        }
        const fovFactor = this.#cachedFovFactor;

        const megaBuffer = this.#megaBuffer;
        if (!megaBuffer) return;

        this.#lastHZBTextureView = hierarchicalZBuffer?.textureView ?? null;
        this.#lastHZBSampler = hierarchicalZBuffer?.sampler ?? null;

        mat4.multiply(this.#tempPVMatrix, projectionMatrix, cam3D.viewMatrix);

        megaBuffer.updateUnifiedGlobalUniforms(
            renderViewStateData,
            fovFactor,
            this.#tempPVMatrix
        );
    }

    recordResetCommands(encoder: GPUCommandEncoder): void {
        if (this.#megaBuffer) {
            this.#megaBuffer.resetMultiIndirectCommands(encoder);
        }
    }

    dispatchPass(computePass: GPUComputePassEncoder): void {
        const megaBuffer = this.#megaBuffer;
        if (!megaBuffer) return;

        const {bindGroupLayout} = this;

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

    updateAndDispatch(
        foliageList: Foliage[],
        renderViewStateData: RenderViewStateData
    ): void {
        this.update(foliageList, renderViewStateData);

        const {computePipeline, bindGroupLayout, commandEncoderManager} = this;
        if (computePipeline && bindGroupLayout) {
            commandEncoderManager.useEncoder(
                COMMAND_ENCODER_TYPE.PRE_PROCESS,
                this.#onResetMultiIndirectCommands
            );

            commandEncoderManager.addPreProcessComputePass(
                'Foliage_GPUCulling_ComputePass',
                this.#onPreProcessComputePass
            );
        }
    }

    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.recordResetCommands(encoder);
    };

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

