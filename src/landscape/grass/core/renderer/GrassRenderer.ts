import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import GPU_PRIMITIVE_TOPOLOGY from "../../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import Grass from "../Grass";
import GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import GrassSlotPooler from "../buffer/GrassSlotPooler";
import ScatterRenderUnit from "../../../core/scatter/ScatterRenderUnit";
import type Geometry from "../../../../geometry/Geometry";
import type BitmapTexture from "../../../../resources/texture/BitmapTexture";
import grassVertexWGSL from "../pipeline/grassVertex.wgsl";
import grassFragmentNearWGSL from "../pipeline/grassFragmentNear.wgsl";
import grassFragmentFarWGSL from "../pipeline/grassFragmentFar.wgsl";
import grassShadowVertexWGSL from "../pipeline/grassShadowVertex.wgsl";
import grassShadowFragmentWGSL from "../pipeline/grassShadowFragment.wgsl";

/**
 * [KO] 잔디 서브메시 재질 바인드 그룹 캐시 엔트리 인터페이스입니다.
 * [EN] Material bind group cache entry interface for grass submeshes.
 */
interface MaterialBindGroupCacheEntry {
    /**
     * [KO] 캐싱된 `GPUBindGroup` 인스턴스
     * [EN] Cached `GPUBindGroup` instance
     */
    bindGroup: GPUBindGroup;
    /**
     * [KO] 캐싱된 베이스 컬러 `GPUTextureView`
     * [EN] Cached base color `GPUTextureView`
     */
    cachedColorTexView: GPUTextureView;
    /**
     * [KO] 캐싱된 서브메시 `BitmapTexture`
     * [EN] Cached submesh `BitmapTexture`
     */
    cachedSubTex: BitmapTexture | null | undefined;
    /**
     * [KO] 캐싱된 잔디 타입 기본 `GPUTextureView`
     * [EN] Cached grass type default `GPUTextureView`
     */
    cachedTypeTexView: GPUTextureView | null;
}

/**
 * [KO] 뷰별 잔디 메인 렌더 번들 캐시 엔트리 인터페이스입니다.
 * [EN] Per-view grass main render bundle cache entry interface.
 */
interface MainBundleCacheEntry {
    /**
     * [KO] 기록된 `GPURenderBundle` 인스턴스
     * [EN] Recorded `GPURenderBundle` instance
     */
    bundle: GPURenderBundle;
    /**
     * [KO] 시스템 유니폼 바인드 그룹
     * [EN] System uniform bind group
     */
    systemBG: GPUBindGroup;
    /**
     * [KO] 멀티샘플링 수 (1 또는 4)
     * [EN] Sample count for multisampling (1 or 4)
     */
    sampleCount: number;
    /**
     * [KO] 번들 기록 시점의 잔디 타입 수
     * [EN] Number of grass types at the time of bundle recording
     */
    grassCount: number;
    /**
     * [KO] 번들 기록에 사용된 `GrassMegaBuffer` 인스턴스
     * [EN] `GrassMegaBuffer` instance used for bundle recording
     */
    megaBufferInstance: GrassMegaBuffer;
}

/**
 * [KO] 컬링된 잔디 인스턴스를 `GPURenderBundle` 및 간접 드로우(Indirect Draw) 방식으로 메인 패스와 그림자 패스에 렌더링하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that renders culled grass instances in main and shadow passes using `GPURenderBundle` and indirect draw calls.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class GrassRenderer extends AScatterRenderer<MainBundleCacheEntry> {
    #vertexModule: GPUShaderModule | null = null;
    #vertexShadowModule: GPUShaderModule | null = null;
    #fragmentNearModule: GPUShaderModule | null = null;
    #fragmentFarModule: GPUShaderModule | null = null;
    #fragmentShadowModule: GPUShaderModule | null = null;

    #pipelineLayout: GPUPipelineLayout | null = null;
    #pipelineBindGroupLayout1: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout2: GPUBindGroupLayout | null = null;

    #renderPipelinesNear: Map<number, GPURenderPipeline> = new Map();
    #renderPipelinesFar: Map<number, GPURenderPipeline> = new Map();
    #shadowPipeline: GPURenderPipeline | null = null;

    #unifiedGroup1BindGroup: GPUBindGroup | null = null;
    #lastCulledBuffer: GPUBuffer | null = null;
    #lastSlotPoolerBuffer: GPUBuffer | null = null;

    #materialBindGroupCache: Map<number, MaterialBindGroupCacheEntry> = new Map();

    #lastShadowMegaBuffer: GrassMegaBuffer | null = null;
    #lastShadowMaskLow: number = -1;
    #lastShadowMaskHigh: number = -1;

    #preferredCanvasFormat: GPUTextureFormat;

    /**
     * [KO] `GrassRenderer` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassRenderer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
        this.#initShadersAndLayouts();
    }

    /**
     * [KO] 캐싱된 Group 1 통합 바인드 그룹을 무효화합니다.
     * [EN] Invalidates the cached unified Group 1 bind group.
     */
    invalidateGroup1BindGroup(): void {
        this.#unifiedGroup1BindGroup = null;
        this.#lastCulledBuffer = null;
        this.#lastSlotPoolerBuffer = null;
    }

    /**
     * [KO] 그림자 렌더 번들이 더티 상태가 될 때 내부 캐시 상태를 초기화합니다.
     * [EN] Resets internal cache states when the shadow render bundle becomes dirty.
     */
    override onShadowBundleDirty(): void {
        this.#lastShadowMegaBuffer = null;
        this.#lastShadowMaskLow = -1;
        this.#lastShadowMaskHigh = -1;
    }

    /**
     * [KO] 메인 및 그림자 렌더 번들과 바인드 그룹 캐시를 모두 더티 상태로 표시합니다.
     * [EN] Marks all main and shadow render bundles and bind group caches as dirty.
     */
    override markAllBundlesDirty(): void {
        this.markMainBundleDirty();
        this.markShadowBundleDirty();
        this.invalidateGroup1BindGroup();
        this.#materialBindGroupCache.clear();
    }

    /**
     * [KO] 메인 렌더 패스에서 근거리 및 원거리 잔디 인스턴스를 렌더링합니다.
     * [EN] Renders near and far grass instances in the main render pass.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param passEncoder -
     * [KO] 현재 `GPURenderPassEncoder` 인스턴스
     * [EN] Current `GPURenderPassEncoder` instance
     * @param grassList -
     * [KO] 렌더링할 잔디 타입 배열
     * [EN] Array of grass types to render
     * @param megaBuffer -
     * [KO] 잔디 메가 버퍼 인스턴스
     * [EN] Grass mega buffer instance
     * @param slotPooler -
     * [KO] 잔디 유니폼 슬롯 풀러 인스턴스
     * [EN] Grass uniform slot pooler instance
     */
    render(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: Grass[],
        megaBuffer: GrassMegaBuffer,
        slotPooler: GrassSlotPooler
    ): void {
        const {systemUniform_Vertex_UniformBindGroup: systemBG} = view;
        if (!systemBG) return;

        const count = grassList.length;
        if (count === 0) return;

        const {antialiasingManager} = this;
        if (!this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const {indirectGPUBuffer, culledGPUBuffer} = megaBuffer;
        const {gpuBuffer} = slotPooler;
        if (!indirectGPUBuffer || !culledGPUBuffer || !gpuBuffer) return;

        const unifiedGroup1 = this.#getOrCreateUnifiedGroup1BindGroup(culledGPUBuffer, gpuBuffer);
        if (!unifiedGroup1) return;

        const {useMSAA} = antialiasingManager;
        const sampleCount = useMSAA ? 4 : 1;

        let cacheEntry = this.mainBundlesByView.get(view);
        const needsRebuild = !cacheEntry
            || cacheEntry.systemBG !== systemBG
            || cacheEntry.sampleCount !== sampleCount
            || cacheEntry.grassCount !== count
            || cacheEntry.megaBufferInstance !== megaBuffer;

        if (needsRebuild) {
            const bundle = this.#recordMainRenderBundle(sampleCount, systemBG, grassList, megaBuffer, unifiedGroup1);
            if (bundle) {
                cacheEntry = {
                    bundle,
                    systemBG,
                    sampleCount,
                    grassCount: count,
                    megaBufferInstance: megaBuffer
                };
                this.mainBundlesByView.set(view, cacheEntry);
            } else {
                this.mainBundlesByView.delete(view);
                return;
            }
        }

        if (cacheEntry) {
            this.executeSingleBundle(passEncoder, cacheEntry.bundle);
        }
    }

    /**
     * [KO] 디렉셔널 섀도우 맵(CSM) 렌더 패스에서 잔디 그림자를 렌더링합니다.
     * [EN] Renders grass shadows in the directional shadow map (CSM) render pass.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param passEncoder -
     * [KO] 그림자 패스용 `GPURenderPassEncoder` 인스턴스
     * [EN] `GPURenderPassEncoder` instance for the shadow pass
     * @param grassList -
     * [KO] 렌더링할 잔디 타입 배열
     * [EN] Array of grass types to render
     * @param megaBuffer -
     * [KO] 잔디 메가 버퍼 인스턴스
     * [EN] Grass mega buffer instance
     * @param slotPooler -
     * [KO] 잔디 유니폼 슬롯 풀러 인스턴스
     * [EN] Grass uniform slot pooler instance
     */
    renderShadow(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: Grass[],
        megaBuffer: GrassMegaBuffer,
        slotPooler: GrassSlotPooler
    ): void {
        const currentCascade = view.currentCascadeIndex ?? 0;
        if (currentCascade > 1) return;
        const shadowSystemBG = view.getCascadeUniformBindGroup(currentCascade) || view.systemUniform_Vertex_UniformBindGroup;
        if (!shadowSystemBG) return;

        const count = grassList.length;
        if (count === 0) return;

        const {indirectGPUBuffer, culledGPUBuffer} = megaBuffer;
        const {gpuBuffer} = slotPooler;
        if (!indirectGPUBuffer || !culledGPUBuffer || !gpuBuffer) return;

        const unifiedGroup1 = this.#getOrCreateUnifiedGroup1BindGroup(culledGPUBuffer, gpuBuffer);
        if (!unifiedGroup1) return;

        let shadowMaskLow = 0;
        let shadowMaskHigh = 0;
        for (let i = 0; i < count; i++) {
            const g = grassList[i];
            const {castShadow, slotIndex, typeId} = g;
            if (castShadow && slotIndex >= 0) {
                const bit = typeId;
                if (bit >= 64) continue;
                if (bit < 32) {
                    shadowMaskLow |= (1 << bit);
                } else {
                    shadowMaskHigh |= (1 << (bit - 32));
                }
            }
        }

        if (
            this.#lastShadowMegaBuffer !== megaBuffer ||
            this.#lastShadowMaskLow !== shadowMaskLow ||
            this.#lastShadowMaskHigh !== shadowMaskHigh
        ) {
            this.markShadowBundleDirty();
            this.#lastShadowMegaBuffer = megaBuffer;
            this.#lastShadowMaskLow = shadowMaskLow;
            this.#lastShadowMaskHigh = shadowMaskHigh;
        }

        if (shadowMaskLow === 0 && shadowMaskHigh === 0) {
            return;
        }

        const needsRebuild = !this.isShadowBundleValid(currentCascade, shadowSystemBG);

        if (needsRebuild) {
            const bundle = this.#recordShadowRenderBundle(currentCascade, shadowSystemBG, grassList, megaBuffer, unifiedGroup1);
            if (bundle) {
                this.setShadowBundle(currentCascade, bundle, shadowSystemBG);
            } else {
                this.setShadowBundle(currentCascade, null, null);
                return;
            }
        }

        const bundle = this.getShadowBundle(currentCascade);
        if (bundle) {
            this.executeSingleBundle(passEncoder, bundle);
        }
    }

    /**
     * [KO] 렌더러가 점유한 파이프라인, 셰이더 모듈, 바인드 그룹 및 렌더 번들 캐시를 모두 해제합니다.
     * [EN] Releases all pipelines, shader modules, bind groups, and render bundle caches occupied by the renderer.
     */
    override destroy(): void {
        super.destroy();
        this.markMainBundleDirty();
        this.invalidateGroup1BindGroup();
        this.#renderPipelinesNear.clear();
        this.#renderPipelinesFar.clear();
        this.#materialBindGroupCache.clear();
        this.#shadowPipeline = null;
        this.#unifiedGroup1BindGroup = null;
        this.#lastCulledBuffer = null;
        this.#lastSlotPoolerBuffer = null;
        this.#vertexModule = null;
        this.#vertexShadowModule = null;
        this.#fragmentNearModule = null;
        this.#fragmentFarModule = null;
        this.#fragmentShadowModule = null;
        this.#pipelineLayout = null;
        this.#pipelineBindGroupLayout1 = null;
        this.#pipelineBindGroupLayout2 = null;
    }

    #recordMainRenderBundle(
        sampleCount: number,
        systemBG: GPUBindGroup,
        grassList: Grass[],
        megaBuffer: GrassMegaBuffer,
        unifiedGroup1: GPUBindGroup
    ): GPURenderBundle | null {
        const {gpuDevice} = this;

        const nearPipeline = this.#getRenderPipeline(sampleCount, false);
        const farPipeline = this.#getRenderPipeline(sampleCount, true);
        if (!nearPipeline || !farPipeline) return null;

        const {indirectGPUBuffer} = megaBuffer;
        if (!indirectGPUBuffer) return null;

        const preferredNormalFormat = this.#preferredCanvasFormat;
        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Grass_Main_RenderBundle_msaa${sampleCount}_${this.instanceId}`,
            colorFormats: ['rgba16float', preferredNormalFormat, 'rgba16float'],
            depthStencilFormat: 'depth32float',
            sampleCount
        });

        bundleEncoder.setBindGroup(0, systemBG);

        const count = grassList.length;

        bundleEncoder.setPipeline(nearPipeline);
        for (let i = 0; i < count; i++) {
            const type = grassList[i];
            const {slotIndex, typeId, geometry, renderUnits} = type;
            if (slotIndex < 0) continue;

            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.nearSlots.length === 0) continue;

            const {vertexBuffer, indexBuffer} = geometry as Geometry;

            this.dynamicOffsetArray[0] = slotIndex * 256;
            bundleEncoder.setBindGroup(1, unifiedGroup1, this.dynamicOffsetArray, 0, 1);
            bundleEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint32');

            const renderUnitCount = renderUnits.length;
            for (let s = 0; s < renderUnitCount; s++) {
                const renderUnit = renderUnits[s];
                const slot = alloc.nearSlots[s];
                const {indirectOffset} = slot;

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = indirectOffset * 5 * 4;
                renderUnit.draw(bundleEncoder, indirectGPUBuffer, indirectOffsetBytes);
            }
        }

        bundleEncoder.setPipeline(farPipeline);
        for (let i = 0; i < count; i++) {
            const type = grassList[i];
            const {slotIndex, typeId, geometry, renderUnits} = type;
            if (slotIndex < 0) continue;

            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.farSlots.length === 0) continue;

            const {vertexBuffer, indexBuffer} = geometry as Geometry;

            this.dynamicOffsetArray[0] = slotIndex * 256;
            bundleEncoder.setBindGroup(1, unifiedGroup1, this.dynamicOffsetArray, 0, 1);
            bundleEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint32');

            const renderUnitCount = renderUnits.length;
            for (let s = 0; s < renderUnitCount; s++) {
                const renderUnit = renderUnits[s];
                const slot = alloc.farSlots[s];
                const {indirectOffset} = slot;

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = indirectOffset * 5 * 4;
                renderUnit.draw(bundleEncoder, indirectGPUBuffer, indirectOffsetBytes);
            }
        }

        return bundleEncoder.finish({
            label: `Grass_Main_RenderBundle_msaa${sampleCount}_finished_${this.instanceId}`
        });
    }

    #recordShadowRenderBundle(
        cascadeIndex: number,
        systemBG: GPUBindGroup,
        grassList: Grass[],
        megaBuffer: GrassMegaBuffer,
        unifiedGroup1: GPUBindGroup
    ): GPURenderBundle | null {
        const {gpuDevice} = this;

        const shadowPipeline = this.#getShadowRenderPipeline();
        if (!shadowPipeline) return null;

        const {indirectGPUBuffer} = megaBuffer;
        if (!indirectGPUBuffer) return null;

        const bundleEncoder = gpuDevice.createRenderBundleEncoder({
            label: `Grass_Shadow_RenderBundle_c${cascadeIndex}_${this.instanceId}`,
            colorFormats: [],
            depthStencilFormat: 'depth32float',
            sampleCount: 1
        });

        bundleEncoder.setPipeline(shadowPipeline);
        bundleEncoder.setBindGroup(0, systemBG);

        const count = grassList.length;
        for (let i = 0; i < count; i++) {
            const type = grassList[i];
            const {castShadow, slotIndex, typeId, geometry, renderUnits} = type;
            if (!castShadow || slotIndex < 0) continue;

            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.nearSlots.length === 0) continue;

            const {vertexBuffer, indexBuffer} = geometry as Geometry;

            this.dynamicOffsetArray[0] = slotIndex * 256;
            bundleEncoder.setBindGroup(1, unifiedGroup1, this.dynamicOffsetArray, 0, 1);
            bundleEncoder.setVertexBuffer(0, vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(indexBuffer.gpuBuffer, 'uint32');

            const renderUnitCount = renderUnits.length;
            for (let s = 0; s < renderUnitCount; s++) {
                const renderUnit = renderUnits[s];
                const nearSlot = alloc.nearSlots[s];
                const {indirectOffset} = nearSlot;

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = indirectOffset * 5 * 4;
                renderUnit.draw(bundleEncoder, indirectGPUBuffer, indirectOffsetBytes);
            }
        }

        return bundleEncoder.finish({
            label: `Grass_Shadow_RenderBundle_c${cascadeIndex}_finished_${this.instanceId}`
        });
    }

    #getOrCreateUnifiedGroup1BindGroup(culledGPUBuffer: GPUBuffer, slotPoolerBuffer: GPUBuffer): GPUBindGroup | null {
        if (this.#unifiedGroup1BindGroup && this.#lastCulledBuffer === culledGPUBuffer && this.#lastSlotPoolerBuffer === slotPoolerBuffer) {
            return this.#unifiedGroup1BindGroup;
        }

        const gpuDevice = this.gpuDevice;
        if (!this.#pipelineBindGroupLayout1) return null;

        this.#unifiedGroup1BindGroup = gpuDevice.createBindGroup({
            label: `Grass_Unified_Group1_BindGroup_${this.instanceId}`,
            layout: this.#pipelineBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: culledGPUBuffer}},
                {
                    binding: 1,
                    resource: {buffer: slotPoolerBuffer, offset: 0, size: GrassSlotPooler.PARAMS_SIZE_BYTES}
                },
            ]
        });

        this.#lastCulledBuffer = culledGPUBuffer;
        this.#lastSlotPoolerBuffer = slotPoolerBuffer;
        return this.#unifiedGroup1BindGroup;
    }

    #getOrCreateMaterialBindGroup(renderUnit: ScatterRenderUnit, type: Grass, subIndex: number): GPUBindGroup | null {
        const {gpuDevice, resourceManager} = this;
        if (!this.#pipelineBindGroupLayout2) return null;

        const {typeId, name, baseColorTextureView} = type;
        const cacheKey = (typeId << 16) | (subIndex & 0xFFFF);
        let entry = this.#materialBindGroupCache.get(cacheKey);

        const {baseColorTexture} = renderUnit;

        if (entry) {
            const {cachedSubTex, cachedTypeTexView, bindGroup} = entry;
            if (cachedSubTex === baseColorTexture && cachedTypeTexView === baseColorTextureView) {
                return bindGroup;
            }
        }

        const subTexView = (baseColorTexture ? resourceManager.getGPUResourceBitmapTextureView(baseColorTexture) : null)
            ?? baseColorTextureView;

        if (!entry || entry.cachedColorTexView !== subTexView) {
            const {basicSampler} = resourceManager;
            const bindGroup = gpuDevice.createBindGroup({
                label: `Grass_MaterialBindGroup_${name}_sub${subIndex}_${this.instanceId}`,
                layout: this.#pipelineBindGroupLayout2,
                entries: [
                    {binding: 0, resource: subTexView},
                    {binding: 1, resource: basicSampler.gpuSampler},
                ]
            });
            entry = {
                bindGroup,
                cachedColorTexView: subTexView,
                cachedSubTex: baseColorTexture,
                cachedTypeTexView: baseColorTextureView
            };
            this.#materialBindGroupCache.set(cacheKey, entry);
            this.markMainBundleDirty();
            this.markShadowBundleDirty();
        } else {
            entry.cachedSubTex = baseColorTexture;
            entry.cachedTypeTexView = baseColorTextureView;
        }

        return entry.bindGroup;
    }

    #getShadowRenderPipeline(): GPURenderPipeline | null {
        if (this.#shadowPipeline) return this.#shadowPipeline;

        const {gpuDevice} = this;
        if (!this.#pipelineLayout || !this.#vertexShadowModule || !this.#fragmentShadowModule) return null;

        this.#shadowPipeline = gpuDevice.createRenderPipeline({
            label: `Grass_Shadow_RenderPipeline_${this.instanceId}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexShadowModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    }
                ]
            },
            fragment: {
                module: this.#fragmentShadowModule,
                entryPoint: 'main',
                targets: []
            },
            primitive: {
                topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST,
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: 1
            }
        });

        return this.#shadowPipeline;
    }

    #getRenderPipeline(sampleCount: number = 1, isFar: boolean = false): GPURenderPipeline | null {
        const cache = isFar ? this.#renderPipelinesFar : this.#renderPipelinesNear;
        let pipeline = cache.get(sampleCount);
        if (pipeline) return pipeline;

        const {gpuDevice} = this;
        const fragModule = isFar ? this.#fragmentFarModule : this.#fragmentNearModule;
        if (!this.#pipelineLayout || !this.#vertexModule || !fragModule) return null;

        const preferredNormalFormat = this.#preferredCanvasFormat;

        pipeline = gpuDevice.createRenderPipeline({
            label: `Grass_RenderPipeline_${isFar ? 'Far' : 'Near'}_msaa${sampleCount}_${this.instanceId}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fragModule,
                entryPoint: 'main',
                targets: [
                    {format: 'rgba16float'},
                    {format: preferredNormalFormat},
                    {format: 'rgba16float'}
                ]
            },
            primitive: {
                topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST,
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: sampleCount
            }
        });

        cache.set(sampleCount, pipeline);
        return pipeline;
    }

    #initShadersAndLayouts(): void {
        const {resourceManager} = this;

        this.#vertexModule = resourceManager.createGPUShaderModule('Grass_VertexModule', {
            code: grassVertexWGSL
        });

        this.#fragmentNearModule = resourceManager.createGPUShaderModule('Grass_FragmentNearModule', {
            code: grassFragmentNearWGSL
        });

        this.#fragmentFarModule = resourceManager.createGPUShaderModule('Grass_FragmentFarModule', {
            code: grassFragmentFarWGSL
        });

        this.#vertexShadowModule = resourceManager.createGPUShaderModule('Grass_VertexShadowModule', {
            code: grassShadowVertexWGSL
        });

        this.#fragmentShadowModule = resourceManager.createGPUShaderModule('Grass_FragmentShadowModule', {
            code: grassShadowFragmentWGSL
        });

        const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');

        const {VERTEX, FRAGMENT} = GPUShaderStage;

        this.#pipelineBindGroupLayout1 = resourceManager.createBindGroupLayout('Grass_Pipeline_Group1_Layout', {
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: VERTEX, buffer: {type: 'read-only-storage'}},
                {
                    binding: 1,
                    visibility: VERTEX | FRAGMENT,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: GrassSlotPooler.PARAMS_SIZE_BYTES
                    }
                },
            ]
        });

        this.#pipelineBindGroupLayout2 = resourceManager.createBindGroupLayout('Grass_Pipeline_Group2_Layout', {
            label: 'Grass_Pipeline_Group2_Layout',
            entries: [
                {binding: 0, visibility: FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: FRAGMENT, sampler: {type: 'filtering'}},
            ]
        });

        this.#pipelineLayout = resourceManager.createGPUPipelineLayout(
            `Grass_PipelineLayout_${this.instanceId}`,
            {
                label: `Grass_PipelineLayout_${this.instanceId}`,
                bindGroupLayouts: [
                    systemBGLayout,
                    this.#pipelineBindGroupLayout1,
                    this.#pipelineBindGroupLayout2
                ]
            }
        );
    }
}

Object.freeze(GrassRenderer);
export default GrassRenderer;

