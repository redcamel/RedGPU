/**
 * [KO] 식생 GPU 프러스텀/거리/HZB 컬링 및 베이킹 컬러 모듈입니다.
 * [EN] Foliage GPU frustum/distance/HZB culling and baking culler module.
 * @packageDocumentation
 */
import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import type Landscape from "../../../Landscape";
import type Foliage from "../Foliage";
import foliageCullingComputeWGSL from "./foliageCullingCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";

import FoliageScatterMegaBuffer, {CascadeCullingParam} from "../buffer/FoliageScatterMegaBuffer";
import {ScatterInstanceBaker} from "../../../core/scatter";
import foliageBakeComputeSource from "../baking/foliageBakeCompute.wgsl";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {computeFrustumPlanes, computeFrustumPlanesFromPVMatrix} from "../../../../math/computeFrustumPlanes";

/**
 * [KO] 모든 식생 인스턴스에 대해 GPU 컴퓨트 셰이더를 통한 프러스텀 컬링, 거리 LOD 판별, HZB 오클루전 컬링 및 베이킹 작업을 수행하는 클래스입니다.
 * [EN] Class that executes GPU compute shader passes for frustum culling, distance LOD selection, HZB occlusion culling, and baking across all foliage instances.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class FoliageCuller extends RedGPUObject {
    #tempPVMatrix: mat4 = mat4.create();
    #cachedFrustumPlanes: number[][] = [
        new Array(4), new Array(4), new Array(4),
        new Array(4), new Array(4), new Array(4)
    ];
    #cachedShadowFrustumPlanes: number[][][] = [
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)],
        [new Array(4), new Array(4), new Array(4), new Array(4), new Array(4), new Array(4)]
    ];

    #cachedCascadeParams: CascadeCullingParam[] = [
        {maxDistance: 3.2, hasShadow: false, frustumPlanes: null},
        {maxDistance: 25.0, hasShadow: false, frustumPlanes: null},
        {maxDistance: 85.0, hasShadow: false, frustumPlanes: null},
        {maxDistance: 200.0, hasShadow: false, frustumPlanes: null}
    ];
    #megaBuffer: FoliageScatterMegaBuffer | null = null;
    #baker: ScatterInstanceBaker;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;
    #lastHZBTextureView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;

    #landscapeRef: Landscape | null = null;

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
        this.#baker = new ScatterInstanceBaker(this.redGPUContext, {
            computeShaderCode: foliageBakeComputeSource,
            label: 'FoliageInstanceBaker',
            initialTaskCapacity: 8192,
        });
        this.#initComputePipeline();
    }

    /**
     * [KO] 식생 인스턴스 물리 베이커 인스턴스
     * [EN] Foliage instance physical baker instance
     */
    get baker(): ScatterInstanceBaker {
        return this.#baker;
    }

    /**
     * [KO] 카메라 위치와 프러스텀, 그림자 캐스케이드 상태를 기반으로 컬링 파라미터를 갱신하고 GPU 디스패치를 준비합니다.
     * [EN] Updates culling parameters and prepares GPU compute dispatches based on camera position, frustum, and shadow cascades.
     * @param foliageList -
     * [KO] 활성 식생 목록
     * [EN] Active foliage list
     * @param viewOrCamera -
     * [KO] 카메라 또는 뷰 객체
     * [EN] Camera or view object
     * @param landscape -
     * [KO] 부모 Landscape 인스턴스
     * [EN] Parent Landscape instance
     * @param stateData -
     * [KO] 렌더 패스 상태 데이터
     * [EN] Render pass state data
     */
    updateAndDispatch(
        foliageList: Foliage[],
        viewOrCamera: any,
        landscape?: Landscape | null,
        stateData?: any
    ): void {
        const typeCount = foliageList.length;
        if (typeCount === 0) return;

        const camera = viewOrCamera?.rawCamera || viewOrCamera?.camera || viewOrCamera;
        const camX = camera?.x ?? camera?.position?.[0] ?? 0;
        const camY = camera?.y ?? camera?.position?.[1] ?? 0;
        const camZ = camera?.z ?? camera?.position?.[2] ?? 0;

        let frustumPlanes: Float32Array | number[][] | null = stateData?.frustumPlanesFlat
            ?? viewOrCamera?.frustumPlanesFlat
            ?? null;

        if (!frustumPlanes && camera?.projectionMatrix && camera?.viewMatrix) {
            frustumPlanes = computeFrustumPlanes(
                camera.projectionMatrix,
                camera.viewMatrix,
                this.#cachedFrustumPlanes
            );
        }

        const fov = camera?.fov ?? 60.0;
        if (fov !== this.#lastFOV) {
            this.#lastFOV = fov;
            const fovRad = (fov * Math.PI) / 180.0;
            this.#cachedFovFactor = Math.tan(fovRad * 0.5);
        }
        const fovFactor = this.#cachedFovFactor;

        if (this.#megaBuffer) {

            const shadowManager = stateData?.view?.scene?.shadowManager;
            const dirShadow = shadowManager?.directionalShadowManager;
            const cascadeParams = this.#cachedCascadeParams;
            const activeCascadeCount = dirShadow ? Math.min(dirShadow.cascadeCount ?? 4, 4) : 0;

            if (stateData && stateData.activeCascadeCount > 0) {

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
                        param.frustumPlanes = computeFrustumPlanesFromPVMatrix(
                            pv,
                            this.#cachedShadowFrustumPlanes[c]
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

            const currentView = stateData?.view || (viewOrCamera?.camera ? viewOrCamera : null);
            const hzb = currentView?.hierarchicalZBuffer;
            const hzbTextureView = hzb?.textureView || null;
            const hzbSampler = hzb?.sampler || null;
            this.#lastHZBTextureView = hzbTextureView;
            this.#lastHZBSampler = hzbSampler;
            const hasHZB = !!hzbTextureView;

            let viewProjectionMatrix: mat4 | null = camera?.viewProjectionMatrix || null;
            if (!viewProjectionMatrix && camera?.projectionMatrix && camera?.viewMatrix) {
                mat4.multiply(this.#tempPVMatrix, camera.projectionMatrix, camera.viewMatrix);
                viewProjectionMatrix = this.#tempPVMatrix;
            }

            const viewportHeight = stateData?.view?.height || viewOrCamera?.height || 1080.0;
            this.#megaBuffer.updateUnifiedGlobalUniforms(
                camX, camY, camZ,
                fovFactor,
                frustumPlanes,
                cascadeParams,
                activeCascadeCount,
                viewportHeight,
                hasHZB,
                viewProjectionMatrix,
                512.0,
                256.0,
                0.002
            );
        }

        if (this.#cullingComputePipeline && this.#cullingBindGroupLayout) {
            this.#landscapeRef = landscape;

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

    #initComputePipeline(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('Foliage_Cull_ShaderModule', foliageCullingComputeWGSL);

        let computeModule = resourceManager.getGPUShaderModule('Foliage_Cull_ShaderModule');
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule('Foliage_Cull_ShaderModule', {
                code: foliageCullingComputeWGSL,
            });
        }

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        const layout = resourceManager.createBindGroupLayout('Foliage_Cull_BindGroupLayout', {
            label: 'Foliage_Cull_BindGroupLayout',
            ...descriptor
        });
        this.#cullingBindGroupLayout = layout;

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Foliage_Cull_PipelineLayout', {
            bindGroupLayouts: [layout],
        });

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            label: 'Foliage_Cull_ComputePipeline',
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

    /**
     * [KO] 컬링 및 베이커 리소스를 해제합니다.
     * [EN] Destroys culler and baker resources.
     */
    destroy(): void {
        this.#baker.destroy();
        this.#cullingComputePipeline = null;
        this.#cullingBindGroupLayout = null;
        this.#lastHZBTextureView = null;
        this.#lastHZBSampler = null;
        this.#megaBuffer = null;
        this.#landscapeRef = null;
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const pipeline = this.#cullingComputePipeline;
        const bindGroupLayout = this.#cullingBindGroupLayout;
        if (!pipeline || !bindGroupLayout) return;

        if (this.#baker.hasPendingTasks && this.#megaBuffer) {
            const vbtAtlasTexture = this.#landscapeRef?.vbtBaseColorAtlas;
            const vbtView = vbtAtlasTexture?.gpuTextureView;
            const worldSizeX = (this.#landscapeRef && this.#landscapeRef.worldSize) ? this.#landscapeRef.worldSize[0] : 8000.0;
            const worldSizeZ = (this.#landscapeRef && this.#landscapeRef.worldSize) ? this.#landscapeRef.worldSize[1] : 8000.0;

            this.#baker.dispatchPass(
                computePass,
                this.#megaBuffer,
                worldSizeX,
                worldSizeZ,
                vbtView
            );
        }

        computePass.setPipeline(pipeline);

        if (this.#megaBuffer) {
            const totalAllocatedInstances = this.#megaBuffer.totalAllocatedInstances;
            if (totalAllocatedInstances <= 0) return;

            const unifiedBindGroup = this.#megaBuffer.getOrCreateUnifiedCullingBindGroup(
                bindGroupLayout,
                this.#lastHZBTextureView,
                this.#lastHZBSampler
            );
            if (unifiedBindGroup) {
                const workgroupCount = Math.ceil(totalAllocatedInstances / 64);
                computePass.setBindGroup(0, unifiedBindGroup);
                computePass.dispatchWorkgroups(workgroupCount);
            }
        }
    };
}

Object.freeze(FoliageCuller);
export default FoliageCuller;
