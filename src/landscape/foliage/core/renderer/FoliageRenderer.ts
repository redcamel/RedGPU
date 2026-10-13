import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import FoliageRenderUnit from "../FoliageRenderUnit";
import Foliage from "../Foliage";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";

interface ValidFoliageTypeItem {
    type: Foliage;
    culledGPU: GPUBuffer;
    indirectGPU: GPUBuffer;
}

interface FoliageMainBundleCacheEntry {
    bundle: GPURenderBundle;
    systemBG: GPUBindGroup | null;
    sampleCount: number;
    validTypeCount: number;
    useDepthPrepass: boolean;
}

class FoliageRenderer extends AScatterRenderer<FoliageMainBundleCacheEntry> {
    static #MAX_POOLED_TYPES = 64;
    #pipelineRegistry: FoliagePipelineRegistry;
    #renderUnitVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #lastBoundPipeline: GPURenderPipeline | null = null;
    #lastBoundSystemBG: GPUBindGroup | null = null;
    #lastBoundMatBG: GPUBindGroup | null = null;
    #lastBoundGeometryVertexBuffer: GPUBuffer | null = null;
    #lastBoundIndexBuffer: GPUBuffer | null = null;
    #lastBoundInstanceBuffer: GPUBuffer | null = null;
    #lastBoundInstanceOffset: number = -1;

    #validTypesMain: ValidFoliageTypeItem[] = [];
    #validTypesShadow: ValidFoliageTypeItem[] = [];

    #lastRecordedTypeCount: number = 0;

    #useDepthPrepass: boolean = true;
    #depthPrepassBundlesByView: WeakMap<View3D, {
        bundle: GPURenderBundle;
        systemBG: GPUBindGroup | null;
        sampleCount: number;
        validTypeCount: number;
    }> = new WeakMap();

    #renderUnitDynamicBindGroup: GPUBindGroup | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        pipelineRegistry: FoliagePipelineRegistry,
        renderUnitVertexBindGroupLayout?: GPUBindGroupLayout | null,
        renderUnitDynamicBindGroup?: GPUBindGroup | null
    ) {
        super(redGPUContext);
        this.#pipelineRegistry = pipelineRegistry;
        this.#renderUnitVertexBindGroupLayout = renderUnitVertexBindGroupLayout ?? null;
        this.#renderUnitDynamicBindGroup = renderUnitDynamicBindGroup ?? null;

        for (let i = 0; i < FoliageRenderer.#MAX_POOLED_TYPES; i++) {
            this.#validTypesMain.push({
                type: null,
                culledGPU: null,
                indirectGPU: null
            } as unknown as ValidFoliageTypeItem);
            this.#validTypesShadow.push({
                type: null,
                culledGPU: null,
                indirectGPU: null
            } as unknown as ValidFoliageTypeItem);
        }
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.markDepthPrepassBundleDirty();
        }
    }

    markDepthPrepassBundleDirty(): void {
        this.#depthPrepassBundlesByView = new WeakMap();
    }

    override markAllBundlesDirty(): void {
        this.markShadowBundleDirty();
        this.markDepthPrepassBundleDirty();
        this.markMainBundleDirty();
    }

    render(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        this.#resetBoundState();

        const {msaaID, useMSAA} = this.antialiasingManager;
        const sampleCount = useMSAA ? 4 : 1;
        const {systemUniform_Vertex_UniformBindGroup: systemBG} = view;

        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            const {activeInstanceCount, megaBuffer, renderUnits} = foliageType;
            if (activeInstanceCount <= 0 || !megaBuffer || renderUnits.length === 0) continue;
            const {culledGPUBuffer, indirectGPUBuffer} = megaBuffer;
            if (!culledGPUBuffer || !indirectGPUBuffer) continue;

            const item = this.#validTypesMain[validCount];
            item.type = foliageType;
            item.culledGPU = culledGPUBuffer;
            item.indirectGPU = indirectGPUBuffer;
            validCount++;
        }
        if (validCount === 0) return;

        if (this.#useDepthPrepass) {
            let viewCache = this.#depthPrepassBundlesByView.get(view);
            const needsRebuild = !viewCache
                || viewCache.systemBG !== systemBG
                || viewCache.sampleCount !== sampleCount
                || viewCache.validTypeCount !== validCount;

            if (needsRebuild) {
                const bundle = this.#recordDepthPrepassRenderBundle(validCount, systemBG, sampleCount, msaaID, view);
                if (bundle) {
                    viewCache = {
                        bundle,
                        systemBG,
                        sampleCount,
                        validTypeCount: validCount
                    };
                    this.#depthPrepassBundlesByView.set(view, viewCache);
                } else {
                    viewCache = undefined;
                    this.#depthPrepassBundlesByView.delete(view);
                }
            }

            if (viewCache) {
                this.executeSingleBundle(passEncoder, viewCache.bundle);
            }
        }

        let mainViewCache = this.mainBundlesByView.get(view);
        const needsMainRebuild = !mainViewCache
            || mainViewCache.systemBG !== systemBG
            || mainViewCache.sampleCount !== sampleCount
            || mainViewCache.validTypeCount !== validCount
            || mainViewCache.useDepthPrepass !== this.#useDepthPrepass;

        if (needsMainRebuild) {
            const bundle = this.#recordMainRenderBundle(validCount, systemBG, sampleCount, msaaID, view);
            if (bundle) {
                mainViewCache = {
                    bundle,
                    systemBG,
                    sampleCount,
                    validTypeCount: validCount,
                    useDepthPrepass: this.#useDepthPrepass
                };
                this.mainBundlesByView.set(view, mainViewCache);
            } else {
                mainViewCache = undefined;
                this.mainBundlesByView.delete(view);
            }
        }

        if (mainViewCache) {
            this.executeSingleBundle(passEncoder, mainViewCache.bundle);
        } else {
            this.#resetBoundState();

            for (let t = 0; t < validCount; t++) {
                const {type, culledGPU, indirectGPU} = this.#validTypesMain[t];

                const {mainRenderUnits, useDepthPrepass} = type;
                const unitCount = mainRenderUnits.length;
                const effectiveUsePrepass = this.#useDepthPrepass && useDepthPrepass;

                for (let s = 0; s < unitCount; s++) {
                    const unit = mainRenderUnits[s];
                    const depthMode = effectiveUsePrepass ? unit.mainDepthMode : 'normal';
                    this.#drawRenderUnit(passEncoder, unit, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, depthMode);
                }
            }
        }
    }

    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        const {currentCascadeIndex = 0, systemUniform_Vertex_UniformBindGroup} = view;

        if (currentCascadeIndex > 3) return;

        if (this.#lastRecordedTypeCount !== typeCount) {
            this.markShadowBundleDirty();
            this.#lastRecordedTypeCount = typeCount;
        }

        const needsRebuild = !this.isShadowBundleValid(currentCascadeIndex, systemUniform_Vertex_UniformBindGroup);

        if (needsRebuild) {
            let validCount = 0;
            for (let t = 0; t < typeCount; t++) {
                const foliageType = typeList[t];
                const {castShadow, shadowCullDistance, megaBuffer, renderUnits} = foliageType;
                if (!castShadow || shadowCullDistance <= 0 || !megaBuffer || renderUnits.length === 0) continue;
                const {shadowCulledGPUBuffer, shadowIndirectGPUBuffer} = megaBuffer;
                if (!shadowCulledGPUBuffer || !shadowIndirectGPUBuffer) continue;

                const item = this.#validTypesShadow[validCount];
                item.type = foliageType;
                item.culledGPU = shadowCulledGPUBuffer;
                item.indirectGPU = shadowIndirectGPUBuffer;
                validCount++;
            }

            if (validCount > 0) {
                const bundle = this.#recordShadowRenderBundle(currentCascadeIndex, validCount, systemUniform_Vertex_UniformBindGroup);
                this.setShadowBundle(currentCascadeIndex, bundle, systemUniform_Vertex_UniformBindGroup);
            } else {
                this.setShadowBundle(currentCascadeIndex, null, null);
            }
        }

        const bundle = this.getShadowBundle(currentCascadeIndex);
        if (bundle) {
            this.executeSingleBundle(passEncoder, bundle);
        }
    }

    override destroy(): void {
        super.destroy();
        this.#renderUnitDynamicBindGroup = null;
        this.#renderUnitVertexBindGroupLayout = null;
        this.markDepthPrepassBundleDirty();
        this.markMainBundleDirty();
        this.#resetBoundState();
        for (let i = 0; i < this.#validTypesMain.length; i++) {
            (this.#validTypesMain[i] as any).type = null;
            (this.#validTypesMain[i] as any).culledGPU = null;
            (this.#validTypesMain[i] as any).indirectGPU = null;
            (this.#validTypesShadow[i] as any).type = null;
            (this.#validTypesShadow[i] as any).culledGPU = null;
            (this.#validTypesShadow[i] as any).indirectGPU = null;
        }
        this.#validTypesMain.length = 0;
        this.#validTypesShadow.length = 0;
    }

    #resetBoundState(): void {
        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;
    }

    #recordDepthPrepassRenderBundle(
        validCount: number,
        systemBG: GPUBindGroup | null,
        sampleCount: number,
        msaaID: string,
        view: View3D
    ): GPURenderBundle | null {
        const {gpuDevice} = this;

        let hasPrepassRenderUnits = false;
        for (let t = 0; t < validCount; t++) {
            const {type} = this.#validTypesMain[t];
            if (type.useDepthPrepass) {
                const {depthPrepassOpaqueRenderUnits, depthPrepassMaskedRenderUnits} = type;
                if (depthPrepassOpaqueRenderUnits.length > 0 || depthPrepassMaskedRenderUnits.length > 0) {
                    hasPrepassRenderUnits = true;
                    break;
                }
            }
        }
        if (!hasPrepassRenderUnits) return null;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Foliage_DepthPrepassBundleEncoder_${view.name}`,
            colorFormats: [
                'rgba16float',
                navigator.gpu.getPreferredCanvasFormat(),
                'rgba16float'
            ],
            depthStencilFormat: 'depth32float',
            sampleCount: sampleCount,
        });

        this.#resetBoundState();

        for (let t = 0; t < validCount; t++) {
            const {type, culledGPU, indirectGPU} = this.#validTypesMain[t];
            if (!type.useDepthPrepass) continue;
            const {depthPrepassOpaqueRenderUnits} = type;
            const unitCount = depthPrepassOpaqueRenderUnits.length;

            for (let s = 0; s < unitCount; s++) {
                this.#drawRenderUnit(bundleEncoder, depthPrepassOpaqueRenderUnits[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        for (let t = 0; t < validCount; t++) {
            const {type, culledGPU, indirectGPU} = this.#validTypesMain[t];
            if (!type.useDepthPrepass) continue;
            const {depthPrepassMaskedRenderUnits} = type;
            const unitCount = depthPrepassMaskedRenderUnits.length;

            for (let s = 0; s < unitCount; s++) {
                this.#drawRenderUnit(bundleEncoder, depthPrepassMaskedRenderUnits[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        const bundle = bundleEncoder.finish({
            label: `Foliage_DepthPrepassBundle_${view.name}`,
        });

        return bundle;
    }

    #recordMainRenderBundle(
        validCount: number,
        systemBG: GPUBindGroup | null,
        sampleCount: number,
        msaaID: string,
        view: View3D
    ): GPURenderBundle | null {
        const {gpuDevice} = this;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Foliage_MainBundleEncoder_${view.name}`,
            colorFormats: [
                'rgba16float',
                navigator.gpu.getPreferredCanvasFormat(),
                'rgba16float'
            ],
            depthStencilFormat: 'depth32float',
            sampleCount: sampleCount,
        });

        this.#resetBoundState();

        for (let t = 0; t < validCount; t++) {
            const {type, culledGPU, indirectGPU} = this.#validTypesMain[t];
            const {mainRenderUnits, useDepthPrepass} = type;
            const unitCount = mainRenderUnits.length;
            const effectiveUsePrepass = this.#useDepthPrepass && useDepthPrepass;

            for (let s = 0; s < unitCount; s++) {
                const unit = mainRenderUnits[s];
                const depthMode = effectiveUsePrepass ? unit.mainDepthMode : 'normal';
                this.#drawRenderUnit(bundleEncoder, unit, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, depthMode);
            }
        }

        const bundle = bundleEncoder.finish({
            label: `Foliage_MainBundle_${view.name}`,
        });

        return bundle;
    }

    #recordShadowRenderBundle(
        currentCascade: number,
        validCount: number,
        systemBG: GPUBindGroup | null
    ): GPURenderBundle | null {
        const {gpuDevice} = this;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Foliage_ShadowBundleEncoder_Cascade${currentCascade}`,
            colorFormats: [],
            depthStencilFormat: 'depth32float',
            sampleCount: 1,
        });

        this.#resetBoundState();

        const {megaBuffer} = this.#validTypesShadow[0].type;
        const {maxRenderUnits, instanceCapacity} = megaBuffer;

        const cascadeIndirectOffset = currentCascade * maxRenderUnits * 20;
        const cascadeInstanceOffset = currentCascade * (instanceCapacity * 8) * 32;

        for (let t = 0; t < validCount; t++) {
            const {type, culledGPU, indirectGPU} = this.#validTypesShadow[t];
            const {
                hasImpostor,
                lodInfoList,
                hasMaskedLOD0,
                lod0RenderUnits,
                shadowMergedRenderUnits,
                renderUnits
            } = type;

            const num3DLODs = hasImpostor ? Math.max(1, lodInfoList.length - 1) : lodInfoList.length;
            const maxShadowLOD = Math.max(0, num3DLODs - 1);

            if (currentCascade <= 1 && hasMaskedLOD0) {
                const unitCount = lod0RenderUnits.length;
                for (let l0 = 0; l0 < unitCount; l0++) {
                    const unit = lod0RenderUnits[l0];
                    const {instanceBufferOffset, indirectOffsetBytes} = unit;
                    const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                    this.#drawShadowRenderUnit(bundleEncoder, unit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                }

                if (num3DLODs > 1) {
                    for (let s = 0; s < shadowMergedRenderUnits.length; s++) {
                        const shadowUnit = shadowMergedRenderUnits[s];
                        if (shadowUnit.lodIndex === maxShadowLOD) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowMergedRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                }

                if (hasImpostor) {
                    for (let s = 0; s < shadowMergedRenderUnits.length; s++) {
                        const shadowUnit = shadowMergedRenderUnits[s];
                        if (shadowUnit.isImpostor) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                }
            } else {
                if (shadowMergedRenderUnits.length > 0) {
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < shadowMergedRenderUnits.length; s++) {
                        const shadowUnit = shadowMergedRenderUnits[s];
                        if (shadowUnit.isImpostor) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                        } else if (shadowUnit.lodIndex === targetLOD) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowMergedRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                        }
                    }
                } else {
                    const unitCount = renderUnits.length;
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < unitCount; s++) {
                        const unit = renderUnits[s];
                        const {isImpostor, lodIndex, instanceBufferOffset, indirectOffsetBytes} = unit;
                        if (!isImpostor && lodIndex !== targetLOD) continue;
                        const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                        const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                        this.#drawShadowRenderUnit(bundleEncoder, unit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                    }
                }
            }
        }

        const bundle = bundleEncoder.finish({
            label: `Foliage_ShadowBundle_Cascade${currentCascade}`,
        });

        return bundle;
    }

    #bindAndDrawUnit(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        unit: FoliageRenderUnit,
        pipeline: GPURenderPipeline,
        systemBG: GPUBindGroup | null,
        matUniformBG: GPUBindGroup | null,
        vertexGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        indirectGPUBuffer: GPUBuffer,
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        if (this.#lastBoundPipeline !== pipeline) {
            passEncoder.setPipeline(pipeline);
            this.#lastBoundPipeline = pipeline;
        }

        if (systemBG && this.#lastBoundSystemBG !== systemBG) {
            passEncoder.setBindGroup(0, systemBG);
            this.#lastBoundSystemBG = systemBG;
        }

        if (this.#renderUnitDynamicBindGroup && unit.slotIndex >= 0) {
            this.dynamicOffsetArray[0] = unit.slotIndex * 256;
            passEncoder.setBindGroup(1, this.#renderUnitDynamicBindGroup, this.dynamicOffsetArray, 0, 1);
        }

        if (matUniformBG && this.#lastBoundMatBG !== matUniformBG) {
            passEncoder.setBindGroup(2, matUniformBG);
            this.#lastBoundMatBG = matUniformBG;
        }

        if (this.#lastBoundGeometryVertexBuffer !== vertexGPUBuffer) {
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            this.#lastBoundGeometryVertexBuffer = vertexGPUBuffer;
        }

        const instanceBufferOffset = overrideInstanceOffset ?? unit.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        const {isIndexed, geometry, indexFormat} = unit;
        const indexBuffer = geometry.indexBuffer;
        if (isIndexed && indexBuffer) {
            const indexGPUBuffer = indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                passEncoder.setIndexBuffer(indexGPUBuffer, indexFormat);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
        }

        unit.draw(passEncoder, indirectGPUBuffer, overrideIndirectOffset);
    }

    #drawShadowMergedRenderUnit(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        shadowUnit: FoliageRenderUnit,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const {geometry, strideBytes} = shadowUnit;
        const vertexGPUBuffer = geometry.vertexBuffer.gpuBuffer;

        const pipeline = this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
            strideBytes,
            'none',
            this.#renderUnitVertexBindGroupLayout
        );
        if (!pipeline) return;

        this.#bindAndDrawUnit(
            passEncoder,
            shadowUnit,
            pipeline,
            systemBG,
            null,
            vertexGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            overrideInstanceOffset,
            overrideIndirectOffset
        );
    }

    #drawShadowRenderUnit(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        unit: FoliageRenderUnit,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const {geometry, lodIndex, isMasked, isImpostor, material, strideBytes} = unit;
        const vertexGPUBuffer = geometry.vertexBuffer.gpuBuffer;

        const useMasked = (lodIndex === 0 || isImpostor) && isMasked;
        const pipeline = useMasked
            ? this.#pipelineRegistry.getOrCreateShadowMaskedPipeline(
                material,
                strideBytes,
                'none',
                this.#renderUnitVertexBindGroupLayout
            )
            : this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
                strideBytes,
                'none',
                this.#renderUnitVertexBindGroupLayout
            );
        if (!pipeline) return;

        const matUniformBG = useMasked ? material.gpuRenderInfo?.fragmentUniformBindGroup ?? null : null;

        this.#bindAndDrawUnit(
            passEncoder,
            unit,
            pipeline,
            systemBG,
            matUniformBG,
            vertexGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            overrideInstanceOffset,
            overrideIndirectOffset
        );
    }

    #drawRenderUnit(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        unit: FoliageRenderUnit,
        sampleCount: number,
        msaaID: string,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        depthPassMode: FoliageDepthPassMode = 'normal',
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const {geometry, isMasked, material} = unit;
        const vertexGPUBuffer = geometry.vertexBuffer.gpuBuffer;

        const pipeline = unit.getPipeline(
            this.#pipelineRegistry,
            sampleCount,
            msaaID,
            depthPassMode,
            this.#renderUnitVertexBindGroupLayout
        );
        if (!pipeline) return;

        const emptyBG = this.resourceManager.emptyBindGroup;
        const isDepthPrepassOpaque = depthPassMode === 'depthPrepass' && !isMasked;
        const matUniformBG = isDepthPrepassOpaque
            ? emptyBG
            : (material.gpuRenderInfo?.fragmentUniformBindGroup ?? emptyBG);

        this.#bindAndDrawUnit(
            passEncoder,
            unit,
            pipeline,
            systemBG,
            matUniformBG,
            vertexGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            overrideInstanceOffset,
            overrideIndirectOffset
        );
    }
}

Object.freeze(FoliageRenderer);
export default FoliageRenderer;

