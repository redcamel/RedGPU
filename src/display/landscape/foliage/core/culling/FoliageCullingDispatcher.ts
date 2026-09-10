import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import type Landscape from "../../../core/Landscape";
import type FoliageType from "../../FoliageType";
import foliageCullingComputeWGSL from "./foliageCullingCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../../material/core";

import FoliageMegaBuffer, {CascadeCullingParam} from "../buffer/FoliageMegaBuffer";
import {FoliageBaker} from "../baking/FoliageBaker";
import {COMMAND_ENCODER_TYPE} from "../../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

class FoliageCullingDispatcher {
    static readonly #tempPVMatrix: mat4 = mat4.create();
    static readonly #cachedFrustumPlanes: number[][] = [
        new Array(4), new Array(4), new Array(4),
        new Array(4), new Array(4), new Array(4)
    ];
    static readonly #cachedShadowFrustumPlanes: number[][][] = [
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)]
    ];

    static readonly #cachedCascadeParams: CascadeCullingParam[] = [
        {maxDistance: 3.2, hasShadow: false, frustumPlanes: null},
        {maxDistance: 25.0, hasShadow: false, frustumPlanes: null},
        {maxDistance: 85.0, hasShadow: false, frustumPlanes: null},
        {maxDistance: 200.0, hasShadow: false, frustumPlanes: null}
    ];


    static readonly #COMPUTE_PASS_DESCRIPTOR: GPUComputePassDescriptor = Object.freeze({
        label: 'Foliage_GPUCulling_ComputePass'
    });

    #redGPUContext: RedGPUContext;
    #megaBuffer: FoliageMegaBuffer | null = null;
    #baker: FoliageBaker;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;

    #landscapeRef: Landscape | null = null;

    #lastFOV: number = -1;
    #cachedFovFactor: number = 1.0;

    constructor(redGPUContext: RedGPUContext, megaBuffer?: FoliageMegaBuffer | null) {
        this.#redGPUContext = redGPUContext;
        this.#megaBuffer = megaBuffer || null;
        this.#baker = new FoliageBaker(this.#redGPUContext);
        this.#initComputePipeline();
    }

    get baker(): FoliageBaker {
        return this.#baker;
    }

    static #computeFrustumPlanesFromMatrix(m: mat4, out: number[][]): number[][] {
        const p0 = out[0], p1 = out[1], p2 = out[2], p3 = out[3], p4 = out[4], p5 = out[5];

        p0[0] = m[3] + m[0];
        p0[1] = m[7] + m[4];
        p0[2] = m[11] + m[8];
        p0[3] = m[15] + m[12];
        p1[0] = m[3] - m[0];
        p1[1] = m[7] - m[4];
        p1[2] = m[11] - m[8];
        p1[3] = m[15] - m[12];
        p2[0] = m[3] + m[1];
        p2[1] = m[7] + m[5];
        p2[2] = m[11] + m[9];
        p2[3] = m[15] + m[13];
        p3[0] = m[3] - m[1];
        p3[1] = m[7] - m[5];
        p3[2] = m[11] - m[9];
        p3[3] = m[15] - m[13];
        p4[0] = m[2];
        p4[1] = m[6];
        p4[2] = m[10];
        p4[3] = m[14];
        p5[0] = m[3] - m[2];
        p5[1] = m[7] - m[6];
        p5[2] = m[11] - m[10];
        p5[3] = m[15] - m[14];

        for (let i = 0; i < 6; i++) {
            const plane = out[i];
            const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
            if (norm > 0.000001) {
                const invNorm = 1.0 / norm;
                plane[0] *= invNorm;
                plane[1] *= invNorm;
                plane[2] *= invNorm;
                plane[3] *= invNorm;
            }
        }
        return out;
    }

    static #computeFrustumPlanesToBuffer(projectionMatrix: mat4, viewMatrix: mat4, out: number[][]): number[][] {
        const m = FoliageCullingDispatcher.#tempPVMatrix;
        mat4.multiply(m, projectionMatrix, viewMatrix);

        const p0 = out[0], p1 = out[1], p2 = out[2], p3 = out[3], p4 = out[4], p5 = out[5];

        p0[0] = m[3] - m[0];
        p0[1] = m[7] - m[4];
        p0[2] = m[11] - m[8];
        p0[3] = m[15] - m[12];
        p1[0] = m[3] + m[0];
        p1[1] = m[7] + m[4];
        p1[2] = m[11] + m[8];
        p1[3] = m[15] + m[12];
        p2[0] = m[3] + m[1];
        p2[1] = m[7] + m[5];
        p2[2] = m[11] + m[9];
        p2[3] = m[15] + m[13];
        p3[0] = m[3] - m[1];
        p3[1] = m[7] - m[5];
        p3[2] = m[11] - m[9];
        p3[3] = m[15] - m[13];
        p4[0] = m[3] - m[2];
        p4[1] = m[7] - m[6];
        p4[2] = m[11] - m[10];
        p4[3] = m[15] - m[14];
        p5[0] = m[3] + m[2];
        p5[1] = m[7] + m[6];
        p5[2] = m[11] + m[10];
        p5[3] = m[15] + m[14];

        for (let i = 0; i < 6; i++) {
            const plane = out[i];
            const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
            if (norm > 0.000001) {
                const invNorm = 1.0 / norm;
                plane[0] *= invNorm;
                plane[1] *= invNorm;
                plane[2] *= invNorm;
                plane[3] *= invNorm;
            }
        }
        return out;
    }

    updateAndDispatch(
        typeList: FoliageType[],
        viewOrCamera: any,
        landscape?: Landscape | null,
        stateData?: any
    ): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        const camera = viewOrCamera?.rawCamera || viewOrCamera?.camera || viewOrCamera;
        const camX = camera?.x ?? camera?.position?.[0] ?? 0;
        const camY = camera?.y ?? camera?.position?.[1] ?? 0;
        const camZ = camera?.z ?? camera?.position?.[2] ?? 0;

        let frustumPlanes: number[][] | null = stateData?.frustumPlanes
            ?? stateData?.view?.frustumPlanes
            ?? viewOrCamera?.frustumPlanes
            ?? camera?.frustumPlanes
            ?? null;

        if (!frustumPlanes && camera?.projectionMatrix && camera?.viewMatrix) {
            frustumPlanes = FoliageCullingDispatcher.#computeFrustumPlanesToBuffer(
                camera.projectionMatrix,
                camera.viewMatrix,
                FoliageCullingDispatcher.#cachedFrustumPlanes
            );
        }

        const worldSizeX = (landscape && landscape.worldSize) ? landscape.worldSize[0] : 8000.0;
        const heightScale = landscape?.heightScale ?? 600.0;
        const hasVHT = !!(landscape?.getInternalAtlasTexture('vht')?.gpuTexture);

        const fov = camera?.fov ?? 60.0;
        if (fov !== this.#lastFOV) {
            this.#lastFOV = fov;
            const fovRad = (fov * Math.PI) / 180.0;
            this.#cachedFovFactor = Math.tan(fovRad * 0.5);
        }
        const fovFactor = this.#cachedFovFactor;

        if (this.#megaBuffer) {

            const shadowManager = stateData?.view?.scene?.shadowManager || (landscape as any)?.scene?.shadowManager;
            const dirShadow = shadowManager?.directionalShadowManager;
            const cascadeParams = FoliageCullingDispatcher.#cachedCascadeParams;
            const activeCascadeCount = dirShadow ? Math.min(dirShadow.cascadeCount ?? 4, 4) : 0;

            if (stateData && stateData.activeCascadeCount > 0) {
                // 🌟 RenderViewStateData에서 사전 계산 및 더티 캐싱된 섀도우 평면을 직접 사용 (계산 0회)
                const cCount = stateData.activeCascadeCount;
                for (let c = 0; c < 4; c++) {
                    const param = cascadeParams[c];
                    param.maxDistance = stateData.cascadeSplitDepths[c];
                    param.hasShadow = c < cCount;
                    param.frustumPlanes = (c < cCount) ? stateData.shadowFrustumPlanes[c] : null;
                }
            } else if (dirShadow && activeCascadeCount > 0) {
                const cascadePV = dirShadow.cascadeProjectionViewMatrices;
                const splitDepths = dirShadow.cascadeSplitDepths;
                for (let c = 0; c < 4; c++) {
                    const pv = (c < activeCascadeCount) ? cascadePV[c] : null;
                    const param = cascadeParams[c];
                    param.maxDistance = splitDepths[c] ?? 200.0;
                    param.hasShadow = !!pv;
                    if (pv) {
                        param.frustumPlanes = FoliageCullingDispatcher.#computeFrustumPlanesFromMatrix(
                            pv,
                            FoliageCullingDispatcher.#cachedShadowFrustumPlanes[c]
                        );
                    } else {
                        param.frustumPlanes = null;
                    }
                }
            } else {
                for (let c = 0; c < 4; c++) {
                    cascadeParams[c].hasShadow = false;
                }
            }

            const viewportHeight = stateData?.view?.height || viewOrCamera?.height || 1080.0;
            this.#megaBuffer.updateUnifiedGlobalUniforms(
                camX, camY, camZ,
                worldSizeX, heightScale, hasVHT,
                fovFactor,
                frustumPlanes,
                cascadeParams,
                activeCascadeCount,
                viewportHeight
            );
        }

        if (this.#cullingComputePipeline && this.#cullingBindGroupLayout) {
            this.#landscapeRef = landscape;


            this.#redGPUContext.commandEncoderManager.useEncoder(
                COMMAND_ENCODER_TYPE.PRE_PROCESS,
                this.#onResetMultiIndirectCommands
            );


            this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
                FoliageCullingDispatcher.#COMPUTE_PASS_DESCRIPTOR,
                this.#onPreProcessComputePass
            );
        }
    }

    #initComputePipeline(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.#redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('FoliageCullingComputeModule', foliageCullingComputeWGSL);

        let computeModule = resourceManager.getGPUShaderModule('FoliageCullingComputeModule');
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule('FoliageCullingComputeModule', {
                code: foliageCullingComputeWGSL,
            });
        }

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        const layout = gpuDevice.createBindGroupLayout({
            label: 'FoliageCullingBindGroupLayout',
            ...descriptor
        });
        this.#cullingBindGroupLayout = layout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'FoliageCullingPipelineLayout',
            bindGroupLayouts: [layout],
        });

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            label: 'FoliageCullingComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main',
            },
        });
    }

    #onResetMultiIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#megaBuffer?.resetMultiIndirectCommands(encoder);
    };

    destroy(): void {
        this.#baker.destroy();
        this.#cullingComputePipeline = null;
        this.#cullingBindGroupLayout = null;
        this.#megaBuffer = null;
        this.#landscapeRef = null;
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const pipeline = this.#cullingComputePipeline;
        const bindGroupLayout = this.#cullingBindGroupLayout;
        if (!pipeline || !bindGroupLayout) return;

        // 1. 신규 마운트된 식생 인스턴스가 있다면 VHT 1회성 베이크 선행 실행 (마운트 없는 프레임에는 0회)
        if (this.#baker.hasPendingTasks && this.#megaBuffer) {
            const vhtAtlasTexture = this.#landscapeRef?.getInternalAtlasTexture('vht');
            const vhtView = vhtAtlasTexture?.gpuTextureView;
            const vhtSampler = this.#redGPUContext.resourceManager.basicSampler.gpuSampler;
            const worldSizeX = (this.#landscapeRef && this.#landscapeRef.worldSize) ? this.#landscapeRef.worldSize[0] : 8000.0;
            const worldSizeZ = (this.#landscapeRef && this.#landscapeRef.worldSize) ? this.#landscapeRef.worldSize[1] : 8000.0;
            const heightScale = this.#landscapeRef?.heightScale ?? 600.0;

            this.#baker.dispatchPass(
                computePass,
                this.#megaBuffer,
                vhtView,
                vhtSampler,
                worldSizeX,
                worldSizeZ,
                heightScale
            );
        }

        // 2. 순수 ALU 초고속 프러스텀/LOD 컬링 실행 (VHT 바인딩 0%)
        computePass.setPipeline(pipeline);

        if (this.#megaBuffer) {
            const totalAllocatedRange = this.#megaBuffer.totalAllocatedRange;
            if (totalAllocatedRange <= 0) return;

            const unifiedBindGroup = this.#megaBuffer.getOrCreateUnifiedCullingBindGroup(bindGroupLayout);
            if (unifiedBindGroup) {
                const workgroupCount = Math.ceil(totalAllocatedRange / 64);
                computePass.setBindGroup(0, unifiedBindGroup);
                computePass.dispatchWorkgroups(workgroupCount);
            }
        }
    };
}

Object.freeze(FoliageCullingDispatcher);
export default FoliageCullingDispatcher;
