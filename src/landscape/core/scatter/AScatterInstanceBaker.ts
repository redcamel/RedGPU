/**
 * [KO] 스캐터 시스템(잔디, 식생 등)을 위한 GPU Compute 기반 인스턴스 베이커 추상 베이스 모듈입니다.
 * [EN] Abstract base module for GPU Compute-based instance bakers across scatter systems (Grass, Foliage, etc.).
 * @packageDocumentation
 */

import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import type Landscape from "../../Landscape";

/**
 * [KO] 레이어 가중치 텍스처 뷰 및 채널 인덱스 해석 결과 인터페이스입니다.
 * [EN] Interface for resolved weight texture view and channel index of landscape layer.
 */
export interface ResolvedWeightLayerInfo {
    weightView: GPUTextureView;
    hasWeightMap: number;
    weightChannelIndex: number;
}

/**
 * [KO] 베이커 바인드 그룹 캐시 엔트리 인터페이스입니다.
 * [EN] Interface for baker bind group cache entry.
 */
interface ScatterBakeBindGroupCacheEntry {
    bindGroup: GPUBindGroup;
    rawBuffer: GPUBuffer;
    vhtView: GPUTextureView;
    vbtView: GPUTextureView;
    weightView: GPUTextureView;
    tasksBuffer: GPUBuffer;
}

/**
 * [KO] 지형(Landscape) 표면에 대규모 스캐터 인스턴스를 GPU Compute Shader로 물리 안착 및 원스톱 생성하는 추상 베이스 클래스입니다.
 * [EN] Abstract base class for physically conforming and generating large-scale scatter instances onto landscape terrain using GPU Compute Shaders.
 */
export abstract class AScatterInstanceBaker extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformGPUBuffer: GPUBuffer | null = null;
    #defaultSampler: GPUSampler | null = null;

    readonly #bakeBindGroupCache: Map<number, ScatterBakeBindGroupCacheEntry> = new Map();
    readonly #resolvedWeightInfo: ResolvedWeightLayerInfo = {
        weightView: null as any,
        hasWeightMap: 0,
        weightChannelIndex: 0
    };

    /**
     * [KO] AScatterInstanceBaker 인스턴스를 초기화합니다.
     * [EN] Initializes an AScatterInstanceBaker instance.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 베이커가 소유한 GPU 리소스 및 캐시를 완전히 해제합니다.
     * [EN] Completely releases GPU resources and caches owned by the baker.
     */
    destroy(): void {
        this.#resolvedWeightInfo.weightView = null as any;
        this.#uniformGPUBuffer?.destroy();
        this.#uniformGPUBuffer = null;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
        this.#defaultSampler = null;
        this.#bakeBindGroupCache.clear();
    }

    /**
     * [KO] 생성된 GPUComputePipeline 인스턴스를 반환합니다.
     * [EN] Returns the created GPUComputePipeline instance.
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 생성된 GPUBindGroupLayout 인스턴스를 반환합니다.
     * [EN] Returns the created GPUBindGroupLayout instance.
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 베이킹 파라미터가 기록되는 유니폼 GPU 버퍼를 반환합니다.
     * [EN] Returns the uniform GPU buffer where baking parameters are recorded.
     */
    get uniformGPUBuffer(): GPUBuffer | null {
        return this.#uniformGPUBuffer;
    }

    /**
     * [KO] 특정 타입 ID에 대해 유효한 GPUBindGroup을 반환하거나, 리소스가 변경된 경우 재생성하여 캐싱합니다.
     * [EN] Returns a valid GPUBindGroup for the specified type ID, or re-creates and caches it if resources have changed.
     */
    getOrCreateBindGroup(
        typeId: number,
        labelPrefix: string,
        rawBuffer: GPUBuffer,
        vhtView: GPUTextureView,
        vbtView: GPUTextureView,
        weightView: GPUTextureView,
        tasksBuffer: GPUBuffer
    ): GPUBindGroup | null {
        const {gpuDevice} = this;
        const bindGroupLayout = this.#bindGroupLayout;
        const uniformBuffer = this.#uniformGPUBuffer;
        const defaultSampler = this.#defaultSampler;
        if (!bindGroupLayout || !uniformBuffer || !defaultSampler) return null;

        let cacheEntry = this.#bakeBindGroupCache.get(typeId);
        const needsNewBindGroup = !cacheEntry
            || cacheEntry.rawBuffer !== rawBuffer
            || cacheEntry.vhtView !== vhtView
            || cacheEntry.vbtView !== vbtView
            || cacheEntry.weightView !== weightView
            || cacheEntry.tasksBuffer !== tasksBuffer;

        if (needsNewBindGroup) {
            const bindGroup = gpuDevice.createBindGroup({
                label: `${labelPrefix}_BG_Type_${typeId}`,
                layout: bindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: uniformBuffer}},
                    {binding: 1, resource: {buffer: rawBuffer}},
                    {binding: 2, resource: vhtView},
                    {binding: 3, resource: vbtView},
                    {binding: 4, resource: defaultSampler},
                    {binding: 5, resource: weightView},
                    {binding: 6, resource: {buffer: tasksBuffer}}
                ]
            });

            cacheEntry = {
                bindGroup,
                rawBuffer,
                vhtView,
                vbtView,
                weightView,
                tasksBuffer
            };
            this.#bakeBindGroupCache.set(typeId, cacheEntry);
        }

        return cacheEntry.bindGroup;
    }

    /**
     * [KO] 지정된 WGSL 셰이더와 라벨을 기반으로 WebGPU 컴퓨트 파이프라인 및 공통 바인드 그룹 레이아웃을 생성합니다.
     * [EN] Creates the WebGPU compute pipeline and common bind group layout based on the provided WGSL shader and label.
     *
     * @param shaderCode - 컴파일할 WGSL 셰이더 코드
     * @param label - 파이프라인 및 바인드그룹 디버그 라벨
     * @param uniformByteLength - 유니폼 버퍼 바이트 크기 (기본값: 256)
     */
    initComputePipeline(
        shaderCode: string,
        label: string,
        uniformByteLength: number = 256
    ): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        const {wgslParser} = resourceManager;

        const shaderName = `${label}_ShaderModule`;
        const shaderInfo = wgslParser.parse(shaderName, shaderCode);
        let computeModule = resourceManager.getGPUShaderModule(shaderName);
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule(shaderName, {
                code: shaderCode
            });
        }

        const layoutDesc = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(`${label}_BindGroupLayout`, {
            label: `${label}_BindGroupLayout`,
            ...layoutDesc
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout(`${label}_PipelineLayout`, {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${label}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main'
            }
        });

        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: `${label}_UniformBuffer`,
            size: uniformByteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        const {basicSampler} = resourceManager;
        this.#defaultSampler = basicSampler.gpuSampler;
    }

    /**
     * [KO] 지형 스플랫 레이어에서 대상 레이어의 가중치 텍스처 뷰 및 채널 인덱스를 안전하게 추출합니다. (Zero-GC 재사용 객체 반환)
     * [EN] Safely resolves the weight texture view and channel index of the target layer from landscape layers. (Returns zero-GC reused object)
     *
     * @param landscape - 대상 Landscape 지형 인스턴스
     * @param targetLayer - 대상 레이어 식별자 (레이어 인덱스 또는 고유 이름)
     */
    protected resolveWeightLayer(
        landscape: Landscape,
        targetLayer?: string | number | null
    ): ResolvedWeightLayerInfo {
        const info = this.#resolvedWeightInfo;
        const {resourceManager} = this.redGPUContext;
        const {emptyBitmapTextureView} = resourceManager;
        info.weightView = emptyBitmapTextureView;
        info.hasWeightMap = 0;
        info.weightChannelIndex = 0;

        if (targetLayer != null && targetLayer !== '' && landscape.layers) {
            const matchedLayer = typeof targetLayer === 'number'
                ? landscape.layers[targetLayer]
                : landscape.layers.find((l: any) => l.name === targetLayer);
            if (matchedLayer?.weightTexture?.gpuTexture) {
                info.weightView = resourceManager.getGPUResourceBitmapTextureView(matchedLayer.weightTexture);
                info.hasWeightMap = 1;
                info.weightChannelIndex = matchedLayer.weightChannelIndex ?? 0;
            }
        }
        return info;
    }
}

Object.freeze(AScatterInstanceBaker);
export default AScatterInstanceBaker;
