import RedGPUContext from "../../../../../context/RedGPUContext";
import computeViewFrustumPlanes from "../../../../../math/computeViewFrustumPlanes";
import FoliageType from "../../FoliageType";
import foliageCullingComputeWGSL from "./foliageCullingCompute.wgsl";

class FoliageCullingDispatcher {
    #redGPUContext: RedGPUContext;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;

    #cachedVHTAtlasGPUTexture: GPUTexture | null = null;
    #cachedVHTView: GPUTextureView | null = null;

    #typeListRef: FoliageType[] = [];
    #landscapeRef: any = null;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#initComputePipeline();
    }

    get cullingBindGroupLayout(): GPUBindGroupLayout | null {
        return this.#cullingBindGroupLayout;
    }

    updateAndDispatch(
        typeList: FoliageType[],
        viewOrCamera: any,
        landscape: any,
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
        const hasVHT = !!(landscape?.vhtAtlasTexture?.gpuTexture);

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

            foliageType.updateIndirectBuffer();

            buffer.updateCullingUniforms(
                camX, camY, camZ,
                cullingDist, fadeStartDist, activeCount, boundingRadius,
                worldSizeX, heightScale, bottomOffset, hasVHT,
                frustumPlanes,
                foliageType.lodDistance,
                foliageType.lod0SubMeshCount,
                foliageType.hasBillboard,
                foliageType.lodFadeRange
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

        const layout = gpuDevice.createBindGroupLayout({
            label: 'FoliageCullingBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });
        this.#cullingBindGroupLayout = layout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'FoliageCullingPipelineLayout',
            bindGroupLayouts: [layout],
        });

        const computeModule = gpuDevice.createShaderModule({
            label: 'FoliageCullingComputeModule',
            code: foliageCullingComputeWGSL,
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

        const vhtAtlasTexture = this.#landscapeRef?.vhtAtlasTexture;
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
