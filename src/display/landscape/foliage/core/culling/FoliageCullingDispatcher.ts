import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import type Landscape from "../../../core/Landscape";
import FoliageType from "../../FoliageType";
import foliageCullingComputeWGSL from "./foliageCullingCompute.wgsl";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../../material/core";

class FoliageCullingDispatcher {
    static readonly #tempPVMatrix: mat4 = mat4.create();
    static readonly #cachedFrustumPlanes: number[][] = [
        new Array(4), new Array(4), new Array(4),
        new Array(4), new Array(4), new Array(4)
    ];

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
        const fovRad = (fov * Math.PI) / 180.0;
        const tanHalfFov = Math.tan(fovRad * 0.5);
        const fovFactorSq = tanHalfFov * tanHalfFov;

        for (let i = 0; i < typeCount; i++) {
            const foliageType = typeList[i];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const subCount = foliageType.subMeshes.length;
            if (subCount === 0) continue;

            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const boundingRadius = foliageType.boundingRadius;
            const bottomOffset = foliageType.bottomOffset;

            foliageType.resetIndirectBuffer();

            foliageType.updateCullingUniforms(
                camX, camY, camZ,
                cullingDist, fadeStartDist, activeCount, boundingRadius,
                worldSizeX, heightScale, bottomOffset, hasVHT,
                frustumPlanes,
                fovFactorSq
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

            const cullingBindGroup = foliageType.getCullingBindGroup(bindGroupLayout, vhtView, vhtSampler);
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
