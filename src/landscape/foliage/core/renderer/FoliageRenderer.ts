/**
 * [KO] 식생 WebGPU 렌더러 모듈입니다.
 * [EN] Foliage WebGPU renderer module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import FoliageRenderUnit from "../FoliageRenderUnit";
import Foliage from "../Foliage";
import FoliagePipelineRegistry, {type FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";

/**
 * [KO] 렌더링 가능한 유효 식생 타입 항목 인터페이스입니다.
 * [EN] Interface for valid renderable foliage type items.
 */
export interface ValidFoliageTypeItem {
    type: Foliage | null;
    culledGPU: GPUBuffer | null;
    indirectGPU: GPUBuffer | null;
}

/**
 * [KO] GPU 컬링된 식생 인스턴스들을 간접 드로우(drawIndexedIndirect / drawIndirect)를 통해 메인 패스 및 섀도우 패스로 렌더링하는 렌더러 클래스입니다.
 * [EN] Renderer class that renders GPU-culled foliage instances to main and shadow passes using indirect drawing (drawIndexedIndirect / drawIndirect).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class FoliageRenderer extends AScatterRenderer {
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
        systemBG: GPUBindGroup;
        sampleCount: number;
        validTypeCount: number;
    }> = new WeakMap();
    #mainBundlesByView: WeakMap<View3D, {
        bundle: GPURenderBundle;
        systemBG: GPUBindGroup;
        sampleCount: number;
        validTypeCount: number;
        useDepthPrepass: boolean;
    }> = new WeakMap();

    #renderUnitDynamicBindGroup: GPUBindGroup | null = null;

    /**
     * [KO] FoliageRenderer 인스턴스를 생성합니다.
     * [EN] Creates a FoliageRenderer instance.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param pipelineRegistry -
     * [KO] 식생 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param renderUnitVertexBindGroupLayout -
     * [KO] 렌더 유닛 유니폼 바인드 그룹 레이아웃 (선택사항)
     * [EN] Render unit uniform bind group layout (optional)
     * @param renderUnitDynamicBindGroup -
     * [KO] 256B 정렬 Dynamic Offset UBO 바인드 그룹 (선택사항)
     * [EN] 256B aligned Dynamic Offset UBO bind group (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        pipelineRegistry: FoliagePipelineRegistry,
        renderUnitVertexBindGroupLayout?: GPUBindGroupLayout | null,
        renderUnitDynamicBindGroup?: GPUBindGroup | null
    ) {
        super(redGPUContext);
        this.#pipelineRegistry = pipelineRegistry;
        this.#renderUnitVertexBindGroupLayout = renderUnitVertexBindGroupLayout || null;
        this.#renderUnitDynamicBindGroup = renderUnitDynamicBindGroup || null;

        for (let i = 0; i < FoliageRenderer.#MAX_POOLED_TYPES; i++) {
            this.#validTypesMain.push({type: null, culledGPU: null, indirectGPU: null});
            this.#validTypesShadow.push({type: null, culledGPU: null, indirectGPU: null});
        }
    }

    /**
     * [KO] 메인 렌더링 시 뎁스 프리패스(Early-Z) 패스를 활성화할지 여부를 반환합니다.
     * [EN] Returns whether the depth prepass (Early-Z) is enabled during main rendering.
     */
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

    /**
     * [KO] 캐시된 모든 메인 뎁스 프리패스 렌더 번들을 무효화하여 다음 렌더링 시 재생성하도록 합니다.
     * [EN] Invalidates all cached main depth prepass render bundles to force regeneration on the next render.
     */
    markDepthPrepassBundleDirty(): void {
        this.#depthPrepassBundlesByView = new WeakMap();
    }

    /**
     * [KO] 캐시된 모든 메인 패스 렌더 번들을 무효화하여 다음 렌더링 시 재생성하도록 합니다.
     * [EN] Invalidates all cached main pass render bundles to force regeneration on the next render.
     */
    markMainBundleDirty(): void {
        this.#mainBundlesByView = new WeakMap();
    }

    /**
     * [KO] 식생 생태계 변경 시 모든 렌더 번들(메인, 섀도우 및 뎁스 프리패스)을 일괄 무효화합니다. (GrassRenderer 대칭 메서드)
     * [EN] Invalidates all render bundles (main, shadow and depth prepass) at once on foliage ecosystem changes. (Symmetric to GrassRenderer)
     */
    override markAllBundlesDirty(): void {
        this.markShadowBundleDirty();
        this.markDepthPrepassBundleDirty();
        this.markMainBundleDirty();
    }

    /**
     * [KO] 주어진 식생 타입들의 인스턴스를 메인 렌더 패스(뎁스 프리패스 포함)에 드로우합니다.
     * [EN] Draws instances of the given foliage types to the main render pass (including depth prepass).
     * @param view -
     * [KO] 렌더링 뷰 인스턴스
     * [EN] Rendering View3D instance
     * @param passEncoder -
     * [KO] GPURenderPassEncoder 인스턴스
     * [EN] GPURenderPassEncoder instance
     * @param typeList -
     * [KO] 렌더링할 식생 타입 배열
     * [EN] Array of foliage types to render
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        this.#resetBoundState();

        const {msaaID, useMSAA} = this.antialiasingManager;
        const sampleCount = useMSAA ? 4 : 1;
        const systemBG = view.systemUniform_Vertex_UniformBindGroup;

        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const megaBuffer = foliageType.megaBuffer;
            if (!megaBuffer) continue;
            const {culledGPUBuffer: culledGPU, indirectGPUBuffer: indirectGPU} = megaBuffer;
            if (!culledGPU || !indirectGPU || foliageType.renderUnits.length === 0) continue;

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
                        systemBG: systemBG!,
                        sampleCount,
                        validTypeCount: validCount
                    };
                    this.#depthPrepassBundlesByView.set(view, viewCache);
                } else {
                    viewCache = undefined;
                    this.#depthPrepassBundlesByView.delete(view);
                }
            }

            if (viewCache?.bundle) {
                this.executeSingleBundle(passEncoder, viewCache.bundle);
            }
        }

        let mainViewCache = this.#mainBundlesByView.get(view);
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
                    systemBG: systemBG!,
                    sampleCount,
                    validTypeCount: validCount,
                    useDepthPrepass: this.#useDepthPrepass
                };
                this.#mainBundlesByView.set(view, mainViewCache);
            } else {
                mainViewCache = undefined;
                this.#mainBundlesByView.delete(view);
            }
        }

        if (mainViewCache?.bundle) {
            this.executeSingleBundle(passEncoder, mainViewCache.bundle);
        } else {
            this.#resetBoundState();

            for (let t = 0; t < validCount; t++) {
                const item = this.#validTypesMain[t];
                const foliageType = item.type!;
                const culledGPU = item.culledGPU!;
                const indirectGPU = item.indirectGPU!;
                const renderUnits = foliageType.mainRenderUnits;
                const unitCount = renderUnits.length;
                const effectiveUsePrepass = this.#useDepthPrepass && foliageType.useDepthPrepass;

                for (let s = 0; s < unitCount; s++) {
                    const unit = renderUnits[s];
                    const depthMode = effectiveUsePrepass ? unit.mainDepthMode : 'normal';
                    this.#drawRenderUnit(passEncoder, unit, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, depthMode);
                }
            }
        }
    }

    /**
     * [KO] 지정된 캐스케이드 인덱스에 대해 식생 인스턴스를 그림자 맵 패스에 드로우합니다 (렌더 번들 캐싱 지원).
     * [EN] Draws foliage instances to the shadow map pass for the specified cascade index (supports render bundle caching).
     * @param view -
     * [KO] 렌더링 뷰 인스턴스 (캐스케이드 정보 포함)
     * [EN] Rendering View3D instance (including cascade info)
     * @param passEncoder -
     * [KO] GPURenderPassEncoder 인스턴스
     * [EN] GPURenderPassEncoder instance
     * @param typeList -
     * [KO] 그림자를 캐스팅할 식생 타입 배열
     * [EN] Array of shadow-casting foliage types
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        const currentCascade = view.currentCascadeIndex ?? 0;

        if (currentCascade > 3) return;

        const systemBG = view.systemUniform_Vertex_UniformBindGroup;

        if (this.#lastRecordedTypeCount !== typeCount) {
            this.markShadowBundleDirty();
            this.#lastRecordedTypeCount = typeCount;
        }

        const needsRebuild = !this.isShadowBundleValid(currentCascade, systemBG);

        if (needsRebuild) {
            let validCount = 0;
            for (let t = 0; t < typeCount; t++) {
                const foliageType = typeList[t];
                if (!foliageType.castShadow || foliageType.shadowCullDistance <= 0) continue;
                const megaBuffer = foliageType.megaBuffer;
                const culledGPU = megaBuffer?.shadowCulledGPUBuffer;
                const indirectGPU = megaBuffer?.shadowIndirectGPUBuffer;
                if (!culledGPU || !indirectGPU || foliageType.renderUnits.length === 0) continue;

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
                const bundle = this.#recordShadowRenderBundle(currentCascade, validCount, systemBG);
                this.setShadowBundle(currentCascade, bundle, systemBG);
            } else {
                this.setShadowBundle(currentCascade, null, null);
            }
        }

        const bundle = this.getShadowBundle(currentCascade);
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
            this.#validTypesMain[i].type = null;
            this.#validTypesMain[i].culledGPU = null;
            this.#validTypesMain[i].indirectGPU = null;
            this.#validTypesShadow[i].type = null;
            this.#validTypesShadow[i].culledGPU = null;
            this.#validTypesShadow[i].indirectGPU = null;
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
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return null;

        let hasPrepassRenderUnits = false;
        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type;
            if (foliageType && foliageType.useDepthPrepass) {
                if (foliageType.depthPrepassOpaqueRenderUnits.length > 0 || foliageType.depthPrepassMaskedRenderUnits.length > 0) {
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
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypesMain[t];
            if (!foliageType.useDepthPrepass || !culledGPU || !indirectGPU) continue;
            const renderUnits = foliageType.depthPrepassOpaqueRenderUnits;
            const unitCount = renderUnits.length;
            if (unitCount === 0) continue;

            for (let s = 0; s < unitCount; s++) {
                this.#drawRenderUnit(bundleEncoder, renderUnits[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypesMain[t];
            if (!foliageType.useDepthPrepass || !culledGPU || !indirectGPU) continue;
            const renderUnits = foliageType.depthPrepassMaskedRenderUnits;
            const unitCount = renderUnits.length;
            if (unitCount === 0) continue;

            for (let s = 0; s < unitCount; s++) {
                this.#drawRenderUnit(bundleEncoder, renderUnits[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
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
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return null;

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
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const renderUnits = foliageType.mainRenderUnits;
            const unitCount = renderUnits.length;
            const effectiveUsePrepass = this.#useDepthPrepass && foliageType.useDepthPrepass;

            for (let s = 0; s < unitCount; s++) {
                const unit = renderUnits[s];
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
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return null;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Foliage_ShadowBundleEncoder_Cascade${currentCascade}`,
            colorFormats: [],
            depthStencilFormat: 'depth32float',
            sampleCount: 1,
        });

        this.#resetBoundState();

        const firstType = validCount > 0 ? this.#validTypesShadow[0].type : null;
        const megaBuffer = firstType?.megaBuffer;
        const maxRenderUnits = megaBuffer?.maxRenderUnits ?? 256;
        const instanceCapacity = megaBuffer?.instanceCapacity ?? 65536;

        const cascadeIndirectOffset = currentCascade * maxRenderUnits * 20;
        const cascadeInstanceOffset = currentCascade * (instanceCapacity * 8) * 32;

        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypesShadow[t];
            if (!foliageType || !culledGPU || !indirectGPU) continue;

            const num3DLODs = foliageType.hasImpostor ? Math.max(1, foliageType.lodInfoList.length - 1) : foliageType.lodInfoList.length;
            const maxShadowLOD = Math.max(0, num3DLODs - 1);

            if (currentCascade === 0 && foliageType.hasMaskedLOD0) {
                const lod0Units = foliageType.lod0RenderUnits;
                const unitCount = lod0Units.length;
                for (let l0 = 0; l0 < unitCount; l0++) {
                    const unit = lod0Units[l0];
                    const {instanceBufferOffset, indirectOffsetBytes} = unit;
                    const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                    this.#drawShadowRenderUnit(bundleEncoder, unit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                }

                if (num3DLODs > 1) {
                    const shadowMergedUnits = foliageType.shadowMergedRenderUnits;
                    for (let s = 0; s < shadowMergedUnits.length; s++) {
                        const shadowUnit = shadowMergedUnits[s];
                        if (shadowUnit.lodIndex === maxShadowLOD) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowMergedRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                }
            } else {
                const shadowMergedUnits = foliageType.shadowMergedRenderUnits;
                if (shadowMergedUnits.length > 0) {
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < shadowMergedUnits.length; s++) {
                        const shadowUnit = shadowMergedUnits[s];
                        if (shadowUnit.lodIndex === targetLOD) {
                            const {instanceBufferOffset, indirectOffsetBytes} = shadowUnit;
                            const instOffset = cascadeInstanceOffset + instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + indirectOffsetBytes;
                            this.#drawShadowMergedRenderUnit(bundleEncoder, shadowUnit, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                } else {
                    const allRenderUnits = foliageType.renderUnits;
                    const unitCount = allRenderUnits.length;
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < unitCount; s++) {
                        const unit = allRenderUnits[s];
                        if (unit.isImpostor || unit.lodIndex !== targetLOD) continue;
                        const {instanceBufferOffset, indirectOffsetBytes} = unit;
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

        const instanceBufferOffset = overrideInstanceOffset !== undefined ? overrideInstanceOffset : unit.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        const {isIndexed, geometry, indexFormat} = unit;
        if (isIndexed && geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = geometry.indexBuffer.gpuBuffer;
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
        const vertexGPUBuffer = shadowUnit.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const pipeline = this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
            shadowUnit.strideBytes,
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
        const vertexGPUBuffer = unit.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const useMasked = (unit.lodIndex === 0) && unit.isMasked;
        const pipeline = useMasked
            ? this.#pipelineRegistry.getOrCreateShadowMaskedPipeline(
                unit.material,
                unit.strideBytes,
                'none',
                this.#renderUnitVertexBindGroupLayout
            )
            : this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
                unit.strideBytes,
                'none',
                this.#renderUnitVertexBindGroupLayout
            );
        if (!pipeline) return;

        const matUniformBG = useMasked ? (unit.material.gpuRenderInfo?.fragmentUniformBindGroup || null) : null;

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
        const vertexGPUBuffer = unit.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const pipeline = unit.getPipeline(
            this.#pipelineRegistry,
            sampleCount,
            msaaID,
            depthPassMode,
            this.#renderUnitVertexBindGroupLayout
        );
        if (!pipeline) return;

        const emptyBG = this.resourceManager.emptyBindGroup;
        const isDepthPrepassOpaque = depthPassMode === 'depthPrepass' && !unit.isMasked;
        const matUniformBG = isDepthPrepassOpaque
            ? emptyBG
            : (unit.material.gpuRenderInfo?.fragmentUniformBindGroup || emptyBG);

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
