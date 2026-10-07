/**
 * [KO] 식생 WebGPU 렌더러 모듈입니다.
 * [EN] Foliage WebGPU renderer module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import View3D from "../../../../display/view/View3D";
import FoliageSubMesh from "../submesh/FoliageSubMesh";
import Foliage from "../Foliage";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "../pipeline/FoliagePipelineRegistry";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";

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
class FoliageRenderer extends RedGPUObject {
    static #MAX_POOLED_TYPES = 64;
    #pipelineRegistry: FoliagePipelineRegistry;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #lastBoundPipeline: GPURenderPipeline | null = null;
    #lastBoundSystemBG: GPUBindGroup | null = null;
    #lastBoundMatBG: GPUBindGroup | null = null;
    #lastBoundGeometryVertexBuffer: GPUBuffer | null = null;
    #lastBoundIndexBuffer: GPUBuffer | null = null;
    #lastBoundInstanceBuffer: GPUBuffer | null = null;
    #lastBoundInstanceOffset: number = -1;

    #validTypesMain: ValidFoliageTypeItem[] = [];
    #validTypesShadow: ValidFoliageTypeItem[] = [];

    #shadowRenderBundles: (GPURenderBundle | null)[] = [null, null, null, null];
    #shadowBundleValid: boolean[] = [false, false, false, false];
    #lastSystemBGByCascade: (GPUBindGroup | null)[] = [null, null, null, null];
    #lastRecordedTypeCount: number = 0;
    #singleBundleArray: [GPURenderBundle] = [null as any];

    #useDepthPrepass: boolean = true;
    #depthPrepassBundlesByView: WeakMap<View3D, {
        bundle: GPURenderBundle;
        systemBG: GPUBindGroup;
        sampleCount: number;
        validTypeCount: number;
    }> = new WeakMap();
    #singlePrepassBundleArray: [GPURenderBundle] = [null as any];

    #subMeshDynamicBindGroup: GPUBindGroup | null = null;
    #dynamicOffsetArray: Uint32Array = new Uint32Array(1);

    /**
     * [KO] FoliageRenderer 인스턴스를 생성합니다.
     * [EN] Creates a FoliageRenderer instance.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param pipelineRegistry -
     * [KO] 식생 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param subMeshVertexBindGroupLayout -
     * [KO] 서브메시 유니폼 바인드 그룹 레이아웃 (선택사항)
     * [EN] Sub-mesh uniform bind group layout (optional)
     * @param subMeshDynamicBindGroup -
     * [KO] 256B 정렬 Dynamic Offset UBO 바인드 그룹 (선택사항)
     * [EN] 256B aligned Dynamic Offset UBO bind group (optional)
     */
    constructor(
        redGPUContext: RedGPUContext,
        pipelineRegistry: FoliagePipelineRegistry,
        subMeshVertexBindGroupLayout?: GPUBindGroupLayout | null,
        subMeshDynamicBindGroup?: GPUBindGroup | null
    ) {
        super(redGPUContext);
        this.#pipelineRegistry = pipelineRegistry;
        this.#subMeshVertexBindGroupLayout = subMeshVertexBindGroupLayout || null;
        this.#subMeshDynamicBindGroup = subMeshDynamicBindGroup || null;

        for (let i = 0; i < FoliageRenderer.#MAX_POOLED_TYPES; i++) {
            this.#validTypesMain.push({type: null, culledGPU: null, indirectGPU: null});
            this.#validTypesShadow.push({type: null, culledGPU: null, indirectGPU: null});
        }
    }

    /**
     * [KO] 256B 정렬 Dynamic Offset UBO 바인드 그룹을 반환합니다.
     * [EN] Returns the 256B aligned Dynamic Offset UBO bind group.
     */
    get subMeshDynamicBindGroup(): GPUBindGroup | null {
        return this.#subMeshDynamicBindGroup;
    }

    /**
     * [KO] 256B 정렬 Dynamic Offset UBO 바인드 그룹을 설정합니다.
     * [EN] Sets the 256B aligned Dynamic Offset UBO bind group.
     */
    set subMeshDynamicBindGroup(value: GPUBindGroup | null) {
        this.#subMeshDynamicBindGroup = value;
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
     * [KO] 캐시된 모든 그림자 렌더 번들을 무효화하여 다음 그림자 렌더링 시 재생성하도록 합니다.
     * [EN] Invalidates all cached shadow render bundles to force regeneration on the next shadow pass.
     */
    markShadowBundleDirty(): void {
        for (let i = 0; i < 4; i++) {
            this.#shadowRenderBundles[i] = null;
            this.#shadowBundleValid[i] = false;
            this.#lastSystemBGByCascade[i] = null;
        }
    }

    /**
     * [KO] 캐시된 모든 메인 뎁스 프리패스 렌더 번들을 무효화하여 다음 렌더링 시 재생성하도록 합니다.
     * [EN] Invalidates all cached main depth prepass render bundles to force regeneration on the next render.
     */
    markDepthPrepassBundleDirty(): void {
        this.#depthPrepassBundlesByView = new WeakMap();
        this.#singlePrepassBundleArray[0] = null as any;
    }

    /**
     * [KO] 식생 생태계 변경 시 모든 렌더 번들(섀도우 및 뎁스 프리패스)을 일괄 무효화합니다. (GrassRenderer 대칭 메서드)
     * [EN] Invalidates all render bundles (shadow and depth prepass) at once on foliage ecosystem changes. (Symmetric to GrassRenderer)
     */
    markAllBundlesDirty(): void {
        this.markShadowBundleDirty();
        this.markDepthPrepassBundleDirty();
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

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        const antialiasingManager = this.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const systemBG = view.systemUniform_Vertex_UniformBindGroup ?? null;

        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const megaBuffer = foliageType.megaBuffer;
            const culledGPU = megaBuffer?.culledGPUBuffer;
            const indirectGPU = megaBuffer?.indirectGPUBuffer;
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
                this.#singlePrepassBundleArray[0] = viewCache.bundle;
                passEncoder.executeBundles(this.#singlePrepassBundleArray);
            }
        }

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const subMeshes = foliageType.mainSubMeshes;
            const subCount = subMeshes.length;
            const effectiveUsePrepass = this.#useDepthPrepass && foliageType.useDepthPrepass;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                const depthMode = effectiveUsePrepass ? sub.mainDepthMode : 'normal';
                this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, depthMode);
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

        const systemBG = view.systemUniform_Vertex_UniformBindGroup ?? null;

        if (this.#lastRecordedTypeCount !== typeCount) {
            this.markShadowBundleDirty();
            this.#lastRecordedTypeCount = typeCount;
        }

        const needsRebuild = !this.#shadowBundleValid[currentCascade] || this.#lastSystemBGByCascade[currentCascade] !== systemBG;

        if (needsRebuild) {
            let validCount = 0;
            for (let t = 0; t < typeCount; t++) {
                const foliageType = typeList[t];
                if (!foliageType.castShadow || foliageType.shadowCullDistance <= 0) continue;
                const megaBuffer = foliageType.megaBuffer;
                const culledGPU = megaBuffer?.shadowCulledGPUBuffer;
                const indirectGPU = megaBuffer?.shadowIndirectGPUBuffer;
                if (!culledGPU || !indirectGPU || foliageType.subMeshes.length === 0) continue;

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
                this.#shadowRenderBundles[currentCascade] = this.#recordShadowRenderBundle(currentCascade, validCount, systemBG);
                this.#shadowBundleValid[currentCascade] = true;
                this.#lastSystemBGByCascade[currentCascade] = systemBG;
            } else {
                this.#shadowRenderBundles[currentCascade] = null;
                this.#shadowBundleValid[currentCascade] = false;
                this.#lastSystemBGByCascade[currentCascade] = null;
            }
        }

        const bundle = this.#shadowRenderBundles[currentCascade];
        if (bundle) {
            this.#singleBundleArray[0] = bundle;
            passEncoder.executeBundles(this.#singleBundleArray);
        }
    }

    destroy(): void {
        this.#subMeshDynamicBindGroup = null;
        this.#subMeshVertexBindGroupLayout = null;
        this.markShadowBundleDirty();
        this.markDepthPrepassBundleDirty();
        this.#singleBundleArray[0] = null as any;
        this.#singlePrepassBundleArray[0] = null as any;
        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
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
        this.#validTypesMain.length = 0;
        this.#validTypesShadow.length = 0;
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

        let hasPrepassSubMeshes = false;
        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type;
            if (foliageType && foliageType.useDepthPrepass) {
                if (foliageType.depthPrepassOpaqueSubMeshes.length > 0 || foliageType.depthPrepassMaskedSubMeshes.length > 0) {
                    hasPrepassSubMeshes = true;
                    break;
                }
            }
        }
        if (!hasPrepassSubMeshes) return null;

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

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        // [1단계] 모든 식생 타입의 Opaque Fast-Z 서브메시 선행 일괄 드로우
        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            if (!foliageType.useDepthPrepass) continue;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const subMeshes = foliageType.depthPrepassOpaqueSubMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            for (let s = 0; s < subCount; s++) {
                this.#drawSubMesh(bundleEncoder, subMeshes[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        // [2단계] 모든 식생 타입의 Masked 서브메시 알파 컷오프 드로우 (가려진 잎사귀는 Early-Z로 탈락)
        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesMain[t];
            const foliageType = item.type!;
            if (!foliageType.useDepthPrepass) continue;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;
            const subMeshes = foliageType.depthPrepassMaskedSubMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            for (let s = 0; s < subCount; s++) {
                this.#drawSubMesh(bundleEncoder, subMeshes[s], sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
            }
        }

        const bundle = bundleEncoder.finish({
            label: `Foliage_DepthPrepassBundle_${view.name}`,
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

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        const firstType = validCount > 0 ? this.#validTypesShadow[0].type : null;
        const megaBuffer = firstType?.megaBuffer;
        const maxSubMeshes = megaBuffer?.maxSubMeshes ?? 256;
        const instanceCapacity = megaBuffer?.instanceCapacity ?? 65536;

        const cascadeIndirectOffset = currentCascade * maxSubMeshes * 20;
        const cascadeInstanceOffset = currentCascade * (instanceCapacity * 8) * 32;

        for (let t = 0; t < validCount; t++) {
            const item = this.#validTypesShadow[t];
            const foliageType = item.type!;
            const culledGPU = item.culledGPU!;
            const indirectGPU = item.indirectGPU!;

            const num3DLODs = foliageType.hasImpostor ? Math.max(1, foliageType.lodInfoList.length - 1) : foliageType.lodInfoList.length;
            const maxShadowLOD = Math.max(0, num3DLODs - 1);

            if (currentCascade === 0 && foliageType.hasMaskedLOD0) {
                const lod0Subs = foliageType.lod0SubMeshes;
                const subCount = lod0Subs.length;
                for (let l0 = 0; l0 < subCount; l0++) {
                    const sub = lod0Subs[l0];
                    const instOffset = cascadeInstanceOffset + sub.instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + sub.indirectOffsetBytes;
                    this.#drawShadowSubMesh(bundleEncoder, sub, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                }

                if (num3DLODs > 1) {
                    const shadowMergedSubs = foliageType.shadowMergedSubMeshes;
                    for (let s = 0; s < shadowMergedSubs.length; s++) {
                        const shadowSub = shadowMergedSubs[s];
                        if (shadowSub.lodIndex === maxShadowLOD) {
                            const instOffset = cascadeInstanceOffset + shadowSub.instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + shadowSub.indirectOffsetBytes;
                            this.#drawShadowMergedSubMesh(bundleEncoder, shadowSub, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                }
            } else {
                const shadowMergedSubs = foliageType.shadowMergedSubMeshes;
                if (shadowMergedSubs.length > 0) {
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < shadowMergedSubs.length; s++) {
                        const shadowSub = shadowMergedSubs[s];
                        if (shadowSub.lodIndex === targetLOD) {
                            const instOffset = cascadeInstanceOffset + shadowSub.instanceBufferOffset;
                            const indOffset = cascadeIndirectOffset + shadowSub.indirectOffsetBytes;
                            this.#drawShadowMergedSubMesh(bundleEncoder, shadowSub, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                            break;
                        }
                    }
                } else {
                    const allSubMeshes = foliageType.subMeshes;
                    const subCount = allSubMeshes.length;
                    const targetLOD = num3DLODs > 1 ? maxShadowLOD : 0;
                    for (let s = 0; s < subCount; s++) {
                        const sub = allSubMeshes[s];
                        if (sub.isImpostor || sub.lodIndex !== targetLOD) continue;
                        const instOffset = cascadeInstanceOffset + sub.instanceBufferOffset;
                        const indOffset = cascadeIndirectOffset + sub.indirectOffsetBytes;
                        this.#drawShadowSubMesh(bundleEncoder, sub, systemBG, indirectGPU, culledGPU, instOffset, indOffset);
                    }
                }
            }
        }

        const bundle = bundleEncoder.finish({
            label: `Foliage_ShadowBundle_Cascade${currentCascade}`,
        });

        this.#shadowRenderBundles[currentCascade] = bundle;
        this.#lastSystemBGByCascade[currentCascade] = systemBG;
        return bundle;
    }

    #bindAndDrawUnit(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        unit: FoliageSubMesh | FoliageShadowMergedSubMesh,
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

        if (this.#subMeshDynamicBindGroup && unit.slotIndex >= 0) {
            this.#dynamicOffsetArray[0] = unit.slotIndex * 256;
            passEncoder.setBindGroup(1, this.#subMeshDynamicBindGroup, this.#dynamicOffsetArray, 0, 1);
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

        if (unit.isIndexed && unit.geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = unit.geometry.indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                passEncoder.setIndexBuffer(indexGPUBuffer, unit.indexFormat);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
        }

        unit.draw(passEncoder, indirectGPUBuffer, overrideIndirectOffset);
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
            'none',
            this.#subMeshVertexBindGroupLayout
        );
        if (!pipeline) return;

        this.#bindAndDrawUnit(
            passEncoder,
            shadowSub,
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

    #drawShadowSubMesh(
        passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder,
        sub: FoliageSubMesh,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const useMasked = (sub.lodIndex === 0) && sub.isMasked;
        const pipeline = useMasked
            ? this.#pipelineRegistry.getOrCreateShadowMaskedPipeline(
                sub.material,
                sub.strideBytes,
                'none',
                this.#subMeshVertexBindGroupLayout
            )
            : this.#pipelineRegistry.getOrCreateShadowMergedPipeline(
                sub.strideBytes,
                'none',
                this.#subMeshVertexBindGroupLayout
            );
        if (!pipeline) return;

        const matUniformBG = useMasked ? (sub.material.gpuRenderInfo?.fragmentUniformBindGroup || null) : null;

        this.#bindAndDrawUnit(
            passEncoder,
            sub,
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

        const emptyBG = this.resourceManager.emptyBindGroup;
        const isDepthPrepassOpaque = depthPassMode === 'depthPrepass' && !sub.isMasked;
        const matUniformBG = isDepthPrepassOpaque
            ? emptyBG
            : (sub.material.gpuRenderInfo?.fragmentUniformBindGroup || emptyBG);

        this.#bindAndDrawUnit(
            passEncoder,
            sub,
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
