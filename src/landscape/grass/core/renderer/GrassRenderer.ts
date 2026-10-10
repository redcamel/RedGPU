/**
 * [KO] 잔디 WebGPU 렌더러 모듈입니다. GPURenderBundle 캐싱 엔진을 통해 매 프레임 단 1회의 executeBundles로 대규모 간접 드로우를 수행합니다.
 * [EN] Grass WebGPU renderer module. Executes large-scale indirect drawing with a single executeBundles call per frame via GPURenderBundle caching engine.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import GPU_PRIMITIVE_TOPOLOGY from "../../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import {Grass} from "../Grass";
import {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import {GrassSlotPooler} from "../buffer/GrassSlotPooler";
import ScatterRenderUnit from "../../../core/scatter/ScatterRenderUnit";
import type Geometry from "../../../../geometry/Geometry";
import type BitmapTexture from "../../../../resources/texture/BitmapTexture";
import grassVertexWGSL from "../pipeline/grassVertex.wgsl";
import grassFragmentNearWGSL from "../pipeline/grassFragmentNear.wgsl";
import grassFragmentFarWGSL from "../pipeline/grassFragmentFar.wgsl";
import grassShadowVertexWGSL from "../pipeline/grassShadowVertex.wgsl";
import grassShadowFragmentWGSL from "../pipeline/grassShadowFragment.wgsl";

/**
 * [KO] 렌더 유닛 머티리얼 바인드 그룹(Group 2) 캐시 엔트리 인터페이스입니다.
 * [EN] Interface for render unit material bind group (Group 2) cache entry.
 */
interface MaterialBindGroupCacheEntry {
    bindGroup: GPUBindGroup;
    cachedColorTexView: GPUTextureView;
    cachedSubTex: BitmapTexture | null | undefined;
    cachedTypeTexView: GPUTextureView | null;
}

/**
 * [KO] View3D별 메인 GPURenderBundle 캐시 엔트리 인터페이스입니다.
 * [EN] Interface for main GPURenderBundle cache entry per View3D.
 */
interface MainBundleCacheEntry {
    bundle: GPURenderBundle;
    systemBG: GPUBindGroup;
    sampleCount: number;
    grassCount: number;
    megaBufferInstance: GrassScatterMegaBuffer;
}

/**
 * [KO] GPU 컬링된 대규모 잔디 인스턴스들을 GPURenderBundle 기반 단일 executeBundles 호출로 메인 패스 및 섀도우 패스로 렌더링하는 렌더러 클래스입니다.
 * [EN] Renderer class that renders GPU-culled large-scale grass instances to main and shadow passes using single executeBundles calls based on GPURenderBundle.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(GrassManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (GrassManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class GrassRenderer extends AScatterRenderer<MainBundleCacheEntry> {
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

    /** 256B 정렬 Dynamic Offset 단일 Group 1 바인드그룹 및 캐시 */
    #unifiedGroup1BindGroup: GPUBindGroup | null = null;
    #lastCulledBuffer: GPUBuffer | null = null;
    #lastSlotPoolerBuffer: GPUBuffer | null = null;

    /** Group 2 (텍스처/샘플러) 캐시 (32-bit 정수 키: `(typeId << 16) | subIndex`) */
    #materialBindGroupCache: Map<number, MaterialBindGroupCacheEntry> = new Map();

    #lastShadowMegaBuffer: GrassScatterMegaBuffer | null = null;
    #lastShadowMaskLow: number = -1;
    #lastShadowMaskHigh: number = -1;

    #preferredCanvasFormat: GPUTextureFormat;

    /**
     * [KO] GrassRenderer 인스턴스를 생성하고 셰이더 모듈 및 파이프라인 레이아웃을 초기화합니다.
     * [EN] Creates a GrassRenderer instance and initializes shader modules and pipeline layouts.
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
        this.#initShadersAndLayouts();
    }


    /**
     * [KO] 캐시된 Group 1 바인드그룹을 무효화합니다 (메가버퍼 재생성 시 호출).
     * [EN] Invalidates the cached Group 1 bind group (invoked when mega-buffer is recreated).
     */
    invalidateGroup1BindGroup(): void {
        this.#unifiedGroup1BindGroup = null;
        this.#lastCulledBuffer = null;
        this.#lastSlotPoolerBuffer = null;
    }

    /**
     * [KO] 그림자 번들이 무효화될 때 잔디 도메인 고유 캐시를 정리합니다.
     * [EN] Cleans up grass domain-specific cache when shadow bundles are invalidated.
     */
    override onShadowBundleDirty(): void {
        this.#lastShadowMegaBuffer = null;
        this.#lastShadowMaskLow = -1;
        this.#lastShadowMaskHigh = -1;
    }

    /**
     * [KO] 잔디 생태계 변경(타입 추가/삭제/메가버퍼 재생성) 시 모든 렌더 번들 및 바인드그룹을 일괄 무효화합니다.
     * [EN] Invalidates all render bundles and bind groups at once on grass ecosystem changes.
     */
    override markAllBundlesDirty(): void {
        this.markMainBundleDirty();
        this.markShadowBundleDirty();
        this.invalidateGroup1BindGroup();
        this.#materialBindGroupCache.clear();
    }

    /**
     * [KO] 주어진 잔디 타입들의 인스턴스를 메인 렌더 패스에 드로우합니다 (GPURenderBundle 캐싱 지원).
     * [EN] Draws instances of the given grass types to the main render pass (supports GPURenderBundle caching).
     *
     * @param view - 현재 렌더링 중인 View3D 객체
     * @param passEncoder - 메인 씬 GPURenderPassEncoder
     * @param grassList - 렌더링할 잔디 타입 목록
     * @param megaBuffer - 잔디 스캐터 메가버퍼 인스턴스
     * @param slotPooler - 잔디 256B Dynamic Offset UBO 슬롯 풀러
     */
    render(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        slotPooler: GrassSlotPooler
    ): void {
        const {systemUniform_Vertex_UniformBindGroup: systemBG} = view;
        if (!systemBG) return;

        const count = grassList.length;
        if (count === 0) return;

        const {antialiasingManager} = this;
        if (!this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const {indirectGPUBuffer, culledGPUBuffer} = megaBuffer;
        const slotGPUBuffer = slotPooler.gpuBuffer;
        if (!indirectGPUBuffer || !culledGPUBuffer || !slotGPUBuffer) return;

        const unifiedGroup1 = this.#getOrCreateUnifiedGroup1BindGroup(culledGPUBuffer, slotGPUBuffer);
        if (!unifiedGroup1) return;

        const sampleCount = antialiasingManager.useMSAA ? 4 : 1;

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
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 잔디 그림자를 렌더링합니다 (GPURenderBundle 캐싱 지원).
     * [EN] Renders grass shadows in the cascaded shadow map (CSM) pass (supports GPURenderBundle caching).
     *
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     * @param grassList - 렌더링할 잔디 타입 목록
     * @param megaBuffer - 잔디 스캐터 메가버퍼 인스턴스
     * @param slotPooler - 잔디 256B Dynamic Offset UBO 슬롯 풀러
     */
    renderShadow(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        slotPooler: GrassSlotPooler
    ): void {
        const currentCascade = view.currentCascadeIndex ?? 0;
        if (currentCascade > 1) return;

        const {systemUniform_Vertex_UniformBindGroup: systemBG} = view;
        if (!systemBG) return;

        const count = grassList.length;
        if (count === 0) return;

        const {indirectGPUBuffer, culledGPUBuffer} = megaBuffer;
        if (!indirectGPUBuffer || !culledGPUBuffer) return;
        const slotGPUBuffer = slotPooler.gpuBuffer;

        const unifiedGroup1 = this.#getOrCreateUnifiedGroup1BindGroup(culledGPUBuffer, slotGPUBuffer);
        if (!unifiedGroup1) return;

        let shadowMaskLow = 0;
        let shadowMaskHigh = 0;
        for (let i = 0; i < count; i++) {
            const g = grassList[i];
            if (g.castShadow && g.slotIndex >= 0) {
                const bit = g.typeId;
                if (bit >= 64) continue;
                if (bit < 32) {
                    shadowMaskLow |= (1 << bit);
                } else {
                    shadowMaskHigh |= (1 << (bit - 32));
                }
            }
        }

        const needsRebuild = !this.isShadowBundleValid(currentCascade, systemBG)
            || this.#lastShadowMegaBuffer !== megaBuffer
            || this.#lastShadowMaskLow !== shadowMaskLow
            || this.#lastShadowMaskHigh !== shadowMaskHigh;

        if (needsRebuild) {
            this.#lastShadowMaskLow = shadowMaskLow;
            this.#lastShadowMaskHigh = shadowMaskHigh;
            const bundle = this.#recordShadowRenderBundle(currentCascade, systemBG, grassList, megaBuffer, unifiedGroup1);
            if (bundle) {
                this.setShadowBundle(currentCascade, bundle, systemBG);
                this.#lastShadowMegaBuffer = megaBuffer;
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
     * [KO] 렌더러의 내부 리소스(파이프라인 캐시, 렌더 번들 및 셰이더 참조)를 해제합니다.
     * [EN] Releases internal resources (pipeline caches, render bundles, and shader references) of the renderer.
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
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        unifiedGroup1: GPUBindGroup
    ): GPURenderBundle | null {
        const gpuDevice = this.gpuDevice;

        const nearPipeline = this.#getRenderPipeline(sampleCount, false);
        const farPipeline = this.#getRenderPipeline(sampleCount, true);
        if (!nearPipeline || !farPipeline) return null;

        const indirectGPUBuffer = megaBuffer.indirectGPUBuffer;
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

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = slot.indirectOffset * 5 * 4;
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

            const {vertexBuffer: lvb, indexBuffer: lib} = geometry as Geometry;

            this.dynamicOffsetArray[0] = slotIndex * 256;
            bundleEncoder.setBindGroup(1, unifiedGroup1, this.dynamicOffsetArray, 0, 1);
            bundleEncoder.setVertexBuffer(0, lvb.gpuBuffer);
            bundleEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

            const renderUnitCount = renderUnits.length;
            for (let s = 0; s < renderUnitCount; s++) {
                const renderUnit = renderUnits[s];
                const slot = alloc.farSlots[s];

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = slot.indirectOffset * 5 * 4;
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
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        unifiedGroup1: GPUBindGroup
    ): GPURenderBundle | null {
        const gpuDevice = this.gpuDevice;

        const shadowPipeline = this.#getShadowRenderPipeline();
        if (!shadowPipeline) return null;

        const indirectGPUBuffer = megaBuffer.indirectGPUBuffer;
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

            const {vertexBuffer: lvb, indexBuffer: lib} = geometry as Geometry;

            this.dynamicOffsetArray[0] = slotIndex * 256;
            bundleEncoder.setBindGroup(1, unifiedGroup1, this.dynamicOffsetArray, 0, 1);
            bundleEncoder.setVertexBuffer(0, lvb.gpuBuffer);
            bundleEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

            const renderUnitCount = renderUnits.length;
            for (let s = 0; s < renderUnitCount; s++) {
                const renderUnit = renderUnits[s];
                const nearSlot = alloc.nearSlots[s];

                const matBG = this.#getOrCreateMaterialBindGroup(renderUnit, type, s);
                if (matBG) {
                    bundleEncoder.setBindGroup(2, matBG);
                }
                const indirectOffsetBytes = nearSlot.indirectOffset * 5 * 4;
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

        const cacheKey = (type.typeId << 16) | (subIndex & 0xFFFF);
        let entry = this.#materialBindGroupCache.get(cacheKey);

        const subTex = renderUnit.baseColorTexture;
        const typeTexView = type.baseColorTextureView;

        if (entry && entry.cachedSubTex === subTex && entry.cachedTypeTexView === typeTexView) {
            return entry.bindGroup;
        }

        const subTexView = (subTex && resourceManager.getGPUResourceBitmapTextureView(subTex))
            || typeTexView;

        if (!entry || entry.cachedColorTexView !== subTexView) {
            const {basicSampler} = resourceManager;
            const bindGroup = gpuDevice.createBindGroup({
                label: `Grass_MaterialBindGroup_${type.name}_sub${subIndex}_${this.instanceId}`,
                layout: this.#pipelineBindGroupLayout2,
                entries: [
                    {binding: 0, resource: subTexView},
                    {binding: 1, resource: basicSampler.gpuSampler},
                ]
            });
            entry = {bindGroup, cachedColorTexView: subTexView, cachedSubTex: subTex, cachedTypeTexView: typeTexView};
            this.#materialBindGroupCache.set(cacheKey, entry);
            this.markMainBundleDirty();
            this.markShadowBundleDirty();
        } else {
            entry.cachedSubTex = subTex;
            entry.cachedTypeTexView = typeTexView;
        }

        return entry.bindGroup;
    }

    #getShadowRenderPipeline(): GPURenderPipeline | null {
        if (this.#shadowPipeline) return this.#shadowPipeline;

        const gpuDevice = this.gpuDevice;
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

        const gpuDevice = this.gpuDevice;
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
        const {gpuDevice, resourceManager} = this;

        if (!gpuDevice) return;

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

        this.#pipelineBindGroupLayout1 = resourceManager.createBindGroupLayout('Grass_Pipeline_Group1_Layout', {
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
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
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
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
