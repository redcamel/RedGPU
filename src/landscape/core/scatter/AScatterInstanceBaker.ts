import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import type Landscape from "../../Landscape";

/**
 * [KO] 지형 레이어에서 해석된 가중치(Weight) 텍스처 뷰 및 채널 정보를 담는 인터페이스입니다.
 * [EN] Interface containing the resolved weight texture view and channel information from a terrain layer.
 *
 * @category Landscape
 */
export interface ResolvedWeightLayerInfo {
    /**
     * [KO] 바인딩할 가중치 맵의 GPU 텍스처 뷰
     * [EN] GPU texture view of the weight map to bind
     */
    weightView: GPUTextureView;
    /**
     * [KO] 유효한 가중치 맵 존재 여부 플래그 (`1`: 존재, `0`: 없음)
     * [EN] Flag indicating whether a valid weight map exists (`1`: present, `0`: absent)
     */
    hasWeightMap: number;
    /**
     * [KO] 가중치 텍스처 내 참조할 색상 채널 인덱스 (`0`~`3`)
     * [EN] Color channel index (`0`~`3`) to reference within the weight texture
     */
    weightChannelIndex: number;
}

/**
 * [KO] 스캐터 인스턴스 베이킹용 바인드 그룹 캐시 엔트리 인터페이스입니다.
 * [EN] Bind group cache entry interface for scatter instance baking.
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
 * [KO] 지형 높이맵(VHT), 블렌드맵(VBT) 및 레이어 가중치 맵을 참조하여 스캐터 인스턴스 변환 데이터를 GPU에서 베이킹하는 추상 기반 클래스입니다.
 * [EN] Abstract base class that bakes scatter instance transform data on the GPU by referencing terrain heightmaps (VHT), blendmaps (VBT), and layer weight maps.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
abstract class AScatterInstanceBaker extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformGPUBuffer: GPUBuffer | null = null;
    #defaultSampler: GPUSampler | null = null;

    #bakeBindGroupCache: Map<number, ScatterBakeBindGroupCacheEntry> = new Map();
    #resolvedWeightInfo: ResolvedWeightLayerInfo = {
        weightView: null as any,
        hasWeightMap: 0,
        weightChannelIndex: 0
    };

    /**
     * [KO] AScatterInstanceBaker 인스턴스를 초기화합니다.
     * [EN] Initializes an AScatterInstanceBaker instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 인스턴스 베이킹용 WebGPU 컴퓨트 파이프라인을 반환합니다.
     * [EN] Returns the WebGPU compute pipeline for instance baking.
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 인스턴스 베이킹 셰이더의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the instance baking shader.
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 베이킹 파라미터 전송에 사용되는 유니폼 GPU 버퍼를 반환합니다.
     * [EN] Returns the uniform GPU buffer used for uploading baking parameters.
     */
    get uniformGPUBuffer(): GPUBuffer | null {
        return this.#uniformGPUBuffer;
    }

    /**
     * [KO] 지형 텍스처 샘플링에 사용되는 기본 GPU 샘플러를 반환합니다.
     * [EN] Returns the default GPU sampler used for terrain texture sampling.
     */
    get defaultSampler(): GPUSampler | null {
        return this.#defaultSampler;
    }

    /**
     * [KO] 베이커가 보유한 유니폼 GPU 버퍼와 바인드 그룹 캐시를 파기합니다.
     * [EN] Destroys the uniform GPU buffer and bind group cache held by the baker.
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
     * [KO] 타입 ID와 리소스 조합에 대응하는 베이킹용 GPU 바인드 그룹을 캐시에서 조회하거나 새로 생성합니다.
     * [EN] Retrieves from cache or creates a new baking GPU bind group corresponding to the type ID and resource combination.
     *
     * @param typeId -
     * [KO] 스캐터 타입 식별자 ID
     * [EN] Scatter type identifier ID
     * @param labelPrefix -
     * [KO] 생성될 바인드 그룹의 디버그 라벨 접두사
     * [EN] Debug label prefix for the created bind group
     * @param rawBuffer -
     * [KO] 베이킹된 원시 인스턴스 데이터를 저장할 스토리지 버퍼
     * [EN] Storage buffer to store baked raw instance data
     * @param vhtView -
     * [KO] 가상 높이 텍스처(VHT) 뷰
     * [EN] Virtual Height Texture (VHT) view
     * @param vbtView -
     * [KO] 가상 블렌드 텍스처(VBT) 뷰
     * [EN] Virtual Blend Texture (VBT) view
     * @param weightView -
     * [KO] 대상 레이어의 가중치 맵 텍스처 뷰
     * [EN] Weight map texture view of the target layer
     * @param tasksBuffer -
     * [KO] 베이킹 작업(Task) 목록이 담긴 GPU 버퍼
     * [EN] GPU buffer containing the list of baking tasks
     * @returns
     * [KO] 생성되었거나 캐시된 `GPUBindGroup` 또는 파이프라인 미초기화 시 `null`
     * [EN] Created or cached `GPUBindGroup`, or `null` if the pipeline is not initialized
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
        const {gpuDevice, bindGroupLayout, uniformGPUBuffer, defaultSampler} = this;
        if (!bindGroupLayout || !uniformGPUBuffer || !defaultSampler) return null;

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
                    {binding: 0, resource: {buffer: uniformGPUBuffer}},
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
     * [KO] 베이킹 컴퓨트 셰이더 모듈, 바인드 그룹 레이아웃, 파이프라인 및 유니폼 버퍼를 초기화합니다.
     * [EN] Initializes the baking compute shader module, bind group layout, pipeline, and uniform buffer.
     *
     * @param shaderCode -
     * [KO] 베이킹 컴퓨트 WGSL 셰이더 소스 코드
     * [EN] Baking compute WGSL shader source code
     * @param label -
     * [KO] GPU 리소스 디버그 라벨 접두사
     * [EN] GPU resource debug label prefix
     * @param uniformByteLength -
     * [KO] 베이킹 유니폼 버퍼의 바이트 크기 (기본값: `256`)
     * [EN] Byte size of the baking uniform buffer (default: `256`)
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

        const {UNIFORM, COPY_DST} = GPUBufferUsage;
        this.#uniformGPUBuffer = gpuDevice.createBuffer({
            label: `${label}_UniformBuffer`,
            size: uniformByteLength,
            usage: UNIFORM | COPY_DST
        });

        const {basicSampler} = resourceManager;
        this.#defaultSampler = basicSampler.gpuSampler;
    }

    /**
     * [KO] 대상 지형 레이어 이름 또는 인덱스를 기반으로 가중치 텍스처 뷰 및 채널 정보를 해석하여 반환합니다.
     * [EN] Resolves and returns the weight texture view and channel information based on the target terrain layer name or index.
     *
     * @param landscape -
     * [KO] 레이어 목록을 보유한 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance holding the layer list
     * @param targetLayer -
     * [KO] 참조할 지형 레이어의 이름(`string`) 또는 인덱스(`number`)
     * [EN] Name (`string`) or index (`number`) of the terrain layer to reference
     * @returns
     * [KO] 해석된 가중치 레이어 정보 객체 (`ResolvedWeightLayerInfo`)
     * [EN] Resolved weight layer information object (`ResolvedWeightLayerInfo`)
     */
    resolveWeightLayer(
        landscape: Landscape,
        targetLayer?: string | number | null
    ): ResolvedWeightLayerInfo {
        const info = this.#resolvedWeightInfo;
        const {resourceManager} = this.redGPUContext;
        const {emptyBitmapTextureView} = resourceManager;
        info.weightView = emptyBitmapTextureView;
        info.hasWeightMap = 0;
        info.weightChannelIndex = 0;

        const {layers} = landscape;
        if (targetLayer != null && targetLayer !== '' && layers) {
            const matchedLayer = typeof targetLayer === 'number'
                ? layers[targetLayer]
                : layers.find((l: any) => l.name === targetLayer);
            if (matchedLayer) {
                const {weightTexture, weightChannelIndex = 0} = matchedLayer;
                if (weightTexture?.gpuTexture) {
                    info.weightView = resourceManager.getGPUResourceBitmapTextureView(weightTexture);
                    info.hasWeightMap = 1;
                    info.weightChannelIndex = weightChannelIndex;
                }
            }
        }
        return info;
    }
}

Object.freeze(AScatterInstanceBaker);
export default AScatterInstanceBaker;
