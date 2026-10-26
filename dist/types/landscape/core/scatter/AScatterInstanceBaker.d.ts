import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
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
declare abstract class AScatterInstanceBaker extends RedGPUObject {
    #private;
    /**
     * [KO] `AScatterInstanceBaker` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AScatterInstanceBaker` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 인스턴스 베이킹용 WebGPU 컴퓨트 파이프라인을 반환합니다.
     * [EN] Returns the WebGPU compute pipeline for instance baking.
     *
     * @returns
     * [KO] 컴퓨트 파이프라인(`GPUComputePipeline`) 또는 미초기화 시 `null`
     * [EN] Compute pipeline (`GPUComputePipeline`), or `null` if not initialized
     */
    get computePipeline(): GPUComputePipeline | null;
    /**
     * [KO] 인스턴스 베이킹 셰이더의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the instance baking shader.
     *
     * @returns
     * [KO] 바인드 그룹 레이아웃(`GPUBindGroupLayout`) 또는 미초기화 시 `null`
     * [EN] Bind group layout (`GPUBindGroupLayout`), or `null` if not initialized
     */
    get bindGroupLayout(): GPUBindGroupLayout | null;
    /**
     * [KO] 베이킹 파라미터 전송에 사용되는 유니폼 GPU 버퍼를 반환합니다.
     * [EN] Returns the uniform GPU buffer used for uploading baking parameters.
     *
     * @returns
     * [KO] 유니폼 버퍼(`GPUBuffer`) 또는 미초기화 시 `null`
     * [EN] Uniform buffer (`GPUBuffer`), or `null` if not initialized
     */
    get uniformGPUBuffer(): GPUBuffer | null;
    /**
     * [KO] 지형 텍스처 샘플링에 사용되는 기본 GPU 샘플러를 반환합니다.
     * [EN] Returns the default GPU sampler used for terrain texture sampling.
     *
     * @returns
     * [KO] 기본 샘플러(`GPUSampler`) 또는 미초기화 시 `null`
     * [EN] Default sampler (`GPUSampler`), or `null` if not initialized
     */
    get defaultSampler(): GPUSampler | null;
    /**
     * [KO] 베이커가 보유한 유니폼 GPU 버퍼와 바인드 그룹 캐시를 파기합니다.
     * [EN] Destroys the uniform GPU buffer and bind group cache held by the baker.
     */
    destroy(): void;
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
    getOrCreateBindGroup(typeId: number, labelPrefix: string, rawBuffer: GPUBuffer, vhtView: GPUTextureView, vbtView: GPUTextureView, weightView: GPUTextureView, tasksBuffer: GPUBuffer): GPUBindGroup | null;
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
    initComputePipeline(shaderCode: string, label: string, uniformByteLength?: number): void;
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
    resolveWeightLayer(landscape: Landscape, targetLayer?: string | number | null): ResolvedWeightLayerInfo;
}
export default AScatterInstanceBaker;
