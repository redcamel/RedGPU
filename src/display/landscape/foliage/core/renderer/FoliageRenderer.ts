import RedGPUContext from "../../../../../context/RedGPUContext";
import FoliageSubMesh from "../../FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";
import FoliageType from "../../FoliageType";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "../pipeline/FoliagePipelineRegistry";

export interface ValidFoliageTypeItem {
    type: FoliageType | null;
    culledGPU: GPUBuffer | null;
    indirectGPU: GPUBuffer | null;
}

class FoliageRenderer {
    static readonly #MAX_POOLED_TYPES = 64;

    #redGPUContext: RedGPUContext;
    #pipelineRegistry: FoliagePipelineRegistry;
    #emptyBindGroup: GPUBindGroup | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #lastBoundPipeline: GPURenderPipeline | null = null;
    #lastBoundSystemBG: GPUBindGroup | null = null;
    #lastBoundVertexUniformBG: GPUBindGroup | null = null;
    #lastBoundMatBG: GPUBindGroup | null = null;
    #lastBoundGeometryVertexBuffer: GPUBuffer | null = null;
    #lastBoundIndexBuffer: GPUBuffer | null = null;
    #lastBoundInstanceBuffer: GPUBuffer | null = null;
    #lastBoundInstanceOffset: number = -1;


    readonly #validTypesMain: ValidFoliageTypeItem[] = [];
    readonly #validTypesShadow: ValidFoliageTypeItem[] = [];


    #shadowRenderBundles: (GPURenderBundle | null)[] = [null, null, null, null];
    #isShadowBundleDirty: boolean = true;
    #lastSystemBGByCascade: (GPUBindGroup | null)[] = [null, null, null, null];
    #lastRecordedTypeCount: number = 0;

    constructor(
        redGPUContext: RedGPUContext,
        pipelineRegistry: FoliagePipelineRegistry,
        emptyBindGroup?: GPUBindGroup | null,
        subMeshVertexBindGroupLayout?: GPUBindGroupLayout | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#pipelineRegistry = pipelineRegistry;
        this.#emptyBindGroup = emptyBindGroup || null;
        this.#subMeshVertexBindGroupLayout = subMeshVertexBindGroupLayout || null;

        for (let i = 0; i < FoliageRenderer.#MAX_POOLED_TYPES; i++) {
            this.#validTypesMain.push({type: null, culledGPU: null, indirectGPU: null});
            this.#validTypesShadow.push({type: null, culledGPU: null, indirectGPU: null});
        }
    }


    markShadowBundleDirty(): void {
        this.#isShadowBundleDirty = true;
        for (let i = 0; i < 4; i++) {
            this.#shadowRenderBundles[i] = null;
            this.#lastSystemBGByCascade[i] = null;
        }
    }

    render(passEncoder: GPURenderPassEncoder, typeList: readonly FoliageType[], view: any): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundVertexUniformBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        const view3D = view as any;
        const antialiasingManager = this.#redGPUContext.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup ?? (view as any)?.systemUniform_Vertex_UniformBindGroup ?? null;

        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const culledGPU = foliageType.culledGPUBuffer;
            const indirectGPU = foliageType.indirectGPUBuffer;
            if (!culledGPU || !indirectGPU || foliageType.subMeshes.length === 0) continue;

            let item = this.#validTypesMain[validCount];
            if (!item) {
                item = {type: foliageType, culledGPU, indirectGPU};
                this.#validTypesMain[validCount] = item;
            } else {
                item.type = foliageType;
                item.culledGPU = culledGPU;
                item.indirectGPU = indirectGPU;
            }
            validCount++;
        }
        if (validCount === 0) return;

        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            const useImp = foliageType.useImpostor;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (!useImp && sub.isImpostor) continue;
                if (sub.canRenderInPass('depthPrepass')) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
                }
            }
        }

        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            const useImp = foliageType.useImpostor;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (!useImp && sub.isImpostor) continue;
                if (sub.canRenderInPass('main')) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, sub.mainDepthMode);
                }
            }
        }
    }

    renderShadow(passEncoder: GPURenderPassEncoder, typeList: readonly FoliageType[], view: any): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        const view3D = view as any;
        const currentCascade = view3D?.currentCascadeIndex ?? 0;

        if (currentCascade > 3) return;

        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup ?? (view as any)?.systemUniform_Vertex_UniformBindGroup ?? null;

        if (this.#lastRecordedTypeCount !== typeCount) {
            this.#isShadowBundleDirty = true;
            this.#lastRecordedTypeCount = typeCount;
        }

        let bundle = this.#shadowRenderBundles[currentCascade];
        const needsRebuild = this.#isShadowBundleDirty || !bundle || this.#lastSystemBGByCascade[currentCascade] !== systemBG;

        if (needsRebuild) {
            let validCount = 0;
            for (let t = 0; t < typeCount; t++) {
                const foliageType = typeList[t];
                if (!foliageType.castShadow) continue;
                if (currentCascade > foliageType.maxShadowCascadeIndex) continue;
                const culledGPU = foliageType.shadowCulledGPUBuffer;
                const indirectGPU = foliageType.shadowIndirectGPUBuffer;
                if (!culledGPU || !indirectGPU || (foliageType.shadowMergedSubMeshes.length === 0 && foliageType.subMeshes.length === 0)) continue;

                let item = this.#validTypesShadow[validCount];
                if (!item) {
                    item = {type: foliageType, culledGPU, indirectGPU};
                    this.#validTypesShadow[validCount] = item;
                } else {
                    item.type = foliageType;
                    item.culledGPU = culledGPU;
                    item.indirectGPU = indirectGPU;
                }
                validCount++;
            }

            if (validCount > 0) {
                bundle = this.#recordShadowRenderBundle(currentCascade, validCount, systemBG);
            }
        }

        if (bundle) {
            passEncoder.executeBundles([bundle]);
        }
    }

    destroy(): void {
        this.markShadowBundleDirty();
        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundVertexUniformBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        for (let i = 0; i < this.#validTypesMain.length; i++) {
            this.#validTypesMain[i].type = null;
            this.#validTypesMain[i].culledGPU = null;
            this.#validTypesMain[i].indirectGPU = null;
            this.#validTypesShadow[i].type = null;
            this.#validTypesShadow[i].culledGPU = null;
            this.#validTypesShadow[i].indirectGPU = null;
        }
    }

    #recordShadowRenderBundle(
        currentCascade: number,
        validCount: number,
        systemBG: GPUBindGroup | null
    ): GPURenderBundle | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return null;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `FoliageShadowBundleEncoder_Cascade${currentCascade}`,
            colorFormats: [],
            depthStencilFormat: 'depth32float',
            sampleCount: 1,
        });

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundVertexUniformBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        const cascadeIndirectOffset = currentCascade * 256 * 20;
        const cascadeInstanceOffset = currentCascade * (500000 * 8) * 32;

        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesShadow[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;

            const numLODs = foliageType.lodInfoList.length;
            const hasImp = foliageType.useImpostor;
            const maxShadowLOD = numLODs > 1 ? (hasImp ? Math.max(numLODs - 2, 0) : numLODs - 1) : 0;
            const isFarCascade = currentCascade >= 1;

            const shadowSubMeshes = foliageType.shadowMergedSubMeshes;
            const shadowCount = shadowSubMeshes.length;

            if (shadowCount > 0) {
                for (let s = 0; s < shadowCount; s++) {
                    const shadowSub = shadowSubMeshes[s];
                    const lodIdx = shadowSub.lodIndex;

                    if (numLODs > 1) {
                        if (isFarCascade && lodIdx !== maxShadowLOD) continue;
                        if (!isFarCascade && lodIdx !== 0 && lodIdx !== maxShadowLOD) continue;
                    }

                    const instOffset = cascadeInstanceOffset + shadowSub.instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + shadowSub.indirectOffsetBytes;
                    this.#drawShadowMergedSubMesh(bundleEncoder, shadowSub, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                }
            } else {
                const subMeshes = foliageType.subMeshes;
                const subCount = subMeshes.length;
                for (let s = 0; s < subCount; s++) {
                    const sub = subMeshes[s];
                    if (!sub.canRenderInPass('shadow') || sub.isImpostor) continue;
                    if (numLODs > 1) {
                        if (isFarCascade && sub.lodIndex !== maxShadowLOD) continue;
                        if (!isFarCascade && sub.lodIndex !== 0 && sub.lodIndex !== maxShadowLOD) continue;
                    }
                    const instOffset = cascadeInstanceOffset + sub.instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + sub.indirectOffsetBytes;
                    this.#drawSubMesh(bundleEncoder, sub, 1, 'shadow', systemBG, indirectGPU, culledGPU, 'shadowOpaque', instOffset, indOffset);
                }
            }
        }

        const bundle = bundleEncoder.finish({
            label: `FoliageShadowBundle_Cascade${currentCascade}`,
        });

        this.#shadowRenderBundles[currentCascade] = bundle;
        this.#lastSystemBGByCascade[currentCascade] = systemBG;
        return bundle;
    }

    #drawShadowMergedSubMesh(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        shadowSub: FoliageShadowMergedSubMesh,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const vertexGPUBuffer = shadowSub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const pipeline = this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
            shadowSub.strideBytes,
            'back',
            this.#subMeshVertexBindGroupLayout
        );
        if (!pipeline) return;

        if (this.#lastBoundPipeline !== pipeline) {
            passEncoder.setPipeline(pipeline);
            this.#lastBoundPipeline = pipeline;
        }

        if (systemBG && this.#lastBoundSystemBG !== systemBG) {
            passEncoder.setBindGroup(0, systemBG);
            this.#lastBoundSystemBG = systemBG;
        }

        const vertexUniformBG = shadowSub.vertexUniformBindGroup || this.#emptyBindGroup;
        if (vertexUniformBG && this.#lastBoundVertexUniformBG !== vertexUniformBG) {
            passEncoder.setBindGroup(1, vertexUniformBG);
            this.#lastBoundVertexUniformBG = vertexUniformBG;
        }

        if (this.#lastBoundGeometryVertexBuffer !== vertexGPUBuffer) {
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            this.#lastBoundGeometryVertexBuffer = vertexGPUBuffer;
        }

        const instanceBufferOffset = overrideInstanceOffset !== undefined ? overrideInstanceOffset : shadowSub.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        if (shadowSub.isIndexed && shadowSub.geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = shadowSub.geometry.indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                passEncoder.setIndexBuffer(indexGPUBuffer, shadowSub.indexFormat);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
        }

        shadowSub.draw(passEncoder, indirectGPUBuffer, overrideIndirectOffset);
    }

    #drawSubMesh(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        sub: FoliageSubMesh,
        sampleCount: number,
        msaaID: string,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        depthPassMode: FoliageDepthPassMode = 'normal',
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const pipeline = sub.getPipeline(
            this.#pipelineRegistry,
            sampleCount,
            msaaID,
            depthPassMode,
            this.#subMeshVertexBindGroupLayout
        );
        if (!pipeline) return;

        if (this.#lastBoundPipeline !== pipeline) {
            passEncoder.setPipeline(pipeline);
            this.#lastBoundPipeline = pipeline;
        }

        if (systemBG && this.#lastBoundSystemBG !== systemBG) {
            passEncoder.setBindGroup(0, systemBG);
            this.#lastBoundSystemBG = systemBG;
        }

        const vertexUniformBG = sub.vertexUniformBindGroup || this.#emptyBindGroup;
        if (vertexUniformBG && this.#lastBoundVertexUniformBG !== vertexUniformBG) {
            passEncoder.setBindGroup(1, vertexUniformBG);
            this.#lastBoundVertexUniformBG = vertexUniformBG;
        }

        const isShadowDepth = depthPassMode === 'shadow' || depthPassMode === 'shadowOpaque';
        const needsMatBG = !isShadowDepth || sub.needsShadowFragment(depthPassMode);
        if (needsMatBG) {
            const matUniformBG = sub.material.gpuRenderInfo?.fragmentUniformBindGroup;
            if (matUniformBG && this.#lastBoundMatBG !== matUniformBG) {
                passEncoder.setBindGroup(2, matUniformBG);
                this.#lastBoundMatBG = matUniformBG;
            }
        }

        if (this.#lastBoundGeometryVertexBuffer !== vertexGPUBuffer) {
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            this.#lastBoundGeometryVertexBuffer = vertexGPUBuffer;
        }

        const instanceBufferOffset = overrideInstanceOffset !== undefined ? overrideInstanceOffset : sub.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = sub.geometry.indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                passEncoder.setIndexBuffer(indexGPUBuffer, sub.indexFormat);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
        }

        sub.draw(passEncoder, indirectGPUBuffer, overrideIndirectOffset);
    }
}

Object.freeze(FoliageRenderer);
export default FoliageRenderer;
