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

}

/**
 * [KO] GPU 인다이렉트 드로우(`drawIndexedIndirect`)와 렌더 번들(`GPURenderBundle`) 캐싱을 활용하여 대량 폴리지 인스턴스의 Depth Prepass, 메인 패스, 그림자 패스 렌더링을 수행하는 클래스입니다.
 * [EN] Renderer class that performs Depth Prepass, main pass, and shadow pass rendering for massive foliage instances using GPU indirect drawing (`drawIndexedIndirect`) and render bundle (`GPURenderBundle`) caching.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
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

    #depthPrepassBundlesByView: WeakMap<View3D, {
        bundle: GPURenderBundle;
        systemBG: GPUBindGroup | null;
        sampleCount: number;
        validTypeCount: number;
    }> = new WeakMap();

    #renderUnitDynamicBindGroup: GPUBindGroup | null = null;

    /**
     * [KO] `FoliageRenderer` 인스턴스를 초기화합니다.
     * [EN] Initializes a `FoliageRenderer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param pipelineRegistry -
     * [KO] 폴리지 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param renderUnitVertexBindGroupLayout -
     * [KO] 렌더 유닛 정점 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit vertex bind group layout (optional)
     * @param renderUnitDynamicBindGroup -
     * [KO] 공유 렌더 유닛 다이내믹 바인드 그룹 (선택)
     * [EN] Shared render unit dynamic bind group (optional)
     */
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

    /**
     * [KO] 캐싱된 모든 뷰의 Depth Prepass 렌더 번들을 무효화합니다.
     * [EN] Invalidates cached Depth Prepass render bundles for all views.
     */
    markDepthPrepassBundleDirty(): void {
        this.#depthPrepassBundlesByView = new WeakMap();
    }

    /**
     * [KO] 그림자, Depth Prepass, 메인 패스의 모든 캐싱된 렌더 번들을 무효화합니다.
     * [EN] Invalidates all cached render bundles for shadow, Depth Prepass, and main passes.
     */
    override markAllBundlesDirty(): void {
        this.markShadowBundleDirty();
        this.markDepthPrepassBundleDirty();
        this.markMainBundleDirty();
    }

    /**
     * [KO] 지정된 뷰와 렌더 패스 인코더에 활성화된 폴리지 타입 목록을 메인 렌더링(Depth Prepass 포함)합니다.
     * [EN] Renders the active foliage type list into the specified view and render pass encoder (including Depth Prepass).
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     * @param passEncoder -
     * [KO] 대상 렌더 패스 인코더
     * [EN] Target render pass encoder
     * @param typeList -
     * [KO] 렌더링할 `Foliage` 타입 배열
     * [EN] Array of `Foliage` types to render
     */
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

        if (true) {
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
            || mainViewCache.validTypeCount !== validCount;

        if (needsMainRebuild) {
            const bundle = this.#recordMainRenderBundle(validCount, systemBG, sampleCount, msaaID, view);
            if (bundle) {
                mainViewCache = {
                    bundle,
                    systemBG,
                    sampleCount,
                    validTypeCount: validCount,

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

                const {mainRenderUnits} = type;
                const unitCount = mainRenderUnits.length;


                for (let s = 0; s < unitCount; s++) {
                    const unit = mainRenderUnits[s];
                    const depthMode = unit.mainDepthMode;
                    this.#drawRenderUnit(passEncoder, unit, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, depthMode);
                }
            }
        }
    }

    /**
     * [KO] 방향성 조명 그림자(Directional Shadow / CSM) 패스에 폴리지 인스턴스들을 렌더링합니다.
     * [EN] Renders foliage instances into the directional shadow (CSM) pass.
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     * @param passEncoder -
     * [KO] 그림자 렌더 패스 인코더
     * [EN] Shadow render pass encoder
     * @param typeList -
     * [KO] 렌더링할 `Foliage` 타입 배열
     * [EN] Array of `Foliage` types to render
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        const {currentCascadeIndex = 0, systemUniform_Vertex_UniformBindGroup} = view;

        if (currentCascadeIndex > 3) return;
        const shadowSystemBindGroup = view.getCascadeUniformBindGroup(currentCascadeIndex) || systemUniform_Vertex_UniformBindGroup;
        if (!shadowSystemBindGroup) return;

        if (this.#lastRecordedTypeCount !== typeCount) {
            this.markShadowBundleDirty();
            this.#lastRecordedTypeCount = typeCount;
        }

        const needsRebuild = !this.isShadowBundleValid(currentCascadeIndex, shadowSystemBindGroup);

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
                const bundle = this.#recordShadowRenderBundle(currentCascadeIndex, validCount, shadowSystemBindGroup);
                this.setShadowBundle(currentCascadeIndex, bundle, shadowSystemBindGroup);
            } else {
                this.setShadowBundle(currentCascadeIndex, null, null);
            }
        }

        const bundle = this.getShadowBundle(currentCascadeIndex);
        if (bundle) {
            this.executeSingleBundle(passEncoder, bundle);
        }
    }

    /**
     * [KO] 렌더러가 보유한 캐시 및 내부 참조를 모두 정리하고 파기합니다.
     * [EN] Cleans up and destroys all caches and internal references held by the renderer.
     */
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
            const {depthPrepassOpaqueRenderUnits, depthPrepassMaskedRenderUnits} = type;
            if (depthPrepassOpaqueRenderUnits.length > 0 || depthPrepassMaskedRenderUnits.length > 0) {
                hasPrepassRenderUnits = true;
                break;
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

            const {depthPrepassOpaqueRenderUnits} = type;
            const unitCount = depthPrepassOpaqueRenderUnits.length;

            for (let s = 0; s < unitCount; s++) {
                this.#drawRenderUnit(bundleEncoder, depthPrepassOpaqueRenderUnits[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        for (let t = 0; t < validCount; t++) {
            const {type, culledGPU, indirectGPU} = this.#validTypesMain[t];

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
            const {mainRenderUnits} = type;
            const unitCount = mainRenderUnits.length;


            for (let s = 0; s < unitCount; s++) {
                const unit = mainRenderUnits[s];
                const depthMode = unit.mainDepthMode;
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

