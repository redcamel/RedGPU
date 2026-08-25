import RedGPUContext from "../../../../../context/RedGPUContext";
import type Landscape from "../../../core/Landscape";
import computeViewFrustumPlanes from "../../../../../math/computeViewFrustumPlanes";
import FoliageType from "../../FoliageType";
import foliageCullingComputeWGSL from "./foliageCullingCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../../material/core";

class FoliageCullingDispatcher {
    #redGPUContext: RedGPUContext;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;

    #cachedVHTAtlasGPUTexture: GPUTexture | null = null;
    #cachedVHTView: GPUTextureView | null = null;

    #typeListRef: FoliageType[] = [];
    #landscapeRef: Landscape | null = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#initComputePipeline();
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
            frustumPlanes = computeViewFrustumPlanes(camera.projectionMatrix, camera.viewMatrix);
        }

        const worldSizeX = (landscape && landscape.worldSize) ? landscape.worldSize[0] : 8000.0;
        const heightScale = landscape?.heightScale ?? 600.0;
        const hasVHT = !!(landscape?.getInternalAtlasTexture('vht')?.gpuTexture);

        for (let i = 0; i < typeCount; i++) {
            const foliageType = typeList[i];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const subCount = foliageType.subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const boundingRadius = 20.0;
            const bottomOffset = foliageType.bottomOffset;

            buffer.resetMultiIndirectCount(foliageType.subMeshes);

            buffer.updateCullingUniforms(
                camX, camY, camZ,
                cullingDist, fadeStartDist, activeCount, boundingRadius,
                worldSizeX, heightScale, bottomOffset, hasVHT,
                frustumPlanes,
                foliageType.lodDistance,
                foliageType.lod0SubMeshCount,
                foliageType.hasBillboard
            );
        }

        if (this.#cullingComputePipeline && this.#cullingBindGroupLayout) {
            this.#typeListRef = typeList;
            this.#landscapeRef = landscape;
            this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
                'Foliage_GPUCulling_ComputePass',
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

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const pipeline = this.#cullingComputePipeline;
        const bindGroupLayout = this.#cullingBindGroupLayout;
        if (!pipeline || !bindGroupLayout) return;

        computePass.setPipeline(pipeline);

        const typeList = this.#typeListRef;
        const count = typeList.length;

        const vhtAtlasTexture = this.#landscapeRef?.getInternalAtlasTexture('vht');
        const rawGPUTexture = vhtAtlasTexture?.gpuTexture || null;
        if (rawGPUTexture && this.#cachedVHTAtlasGPUTexture !== rawGPUTexture) {
            this.#cachedVHTAtlasGPUTexture = rawGPUTexture;
            this.#cachedVHTView = rawGPUTexture.createView();
        }
        const vhtView = this.#cachedVHTView || undefined;
        const vhtSampler = this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        for (let i = 0; i < count; i++) {
            const foliageType = typeList[i];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0 || foliageType.subMeshes.length === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const cullingBindGroup = buffer.getOrCreateCullingBindGroup(bindGroupLayout, vhtView, vhtSampler);
            if (cullingBindGroup) {
                const workgroupCount = Math.ceil(activeCount / 64);
                computePass.setBindGroup(0, cullingBindGroup);
                computePass.dispatchWorkgroups(workgroupCount);
            }
        }
    };
}

Object.freeze(FoliageCullingDispatcher);
export default FoliageCullingDispatcher;
