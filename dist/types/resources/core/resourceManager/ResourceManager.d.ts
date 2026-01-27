import RedGPUContext from "../../../context/RedGPUContext";
import Sampler from "../../sampler/Sampler";
import BitmapTexture from "../../texture/BitmapTexture";
import DownSampleCubeMapGenerator from "../../texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator";
import MipmapGenerator from "../../texture/core/mipmapGenerator/MipmapGenerator";
import CubeTexture from "../../texture/CubeTexture";
import IBLCubeTexture from "../../texture/ibl/IBLCubeTexture";
import PackedTexture from "../../texture/packedTexture/PackedTexture";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateIndexBuffer from "./resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "./resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "./resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "./resourceState/ResourceStateVertexBuffer";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
import ResourceStateBitmapTexture from "./resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture from "./resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture from "./resourceState/texture/ResourceStateHDRTexture";
type ResourceState = ResourceStateVertexBuffer | ResourceStateIndexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer | ResourceStateCubeTexture | ResourceStateBitmapTexture | ResourceStateHDRTexture;
/**
 * [KO] RedGPU의 모든 GPU 리소스를 통합 관리하는 핵심 클래스입니다.
 * [EN] The core class that integrates and manages all GPU resources in RedGPU.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * * ### Example
 * ```typescript
 * // RedGPUContext를 통해 접근합니다.
 * const resourceManager = redGPUContext.resourceManager;
 * ```
 * @category Resource
 */
declare class ResourceManager {
    #private;
    static PRESET_GPUBindGroupLayout_System: string;
    static PRESET_VERTEX_GPUBindGroupLayout_Instancing: string;
    static PRESET_VERTEX_GPUBindGroupLayout: string;
    static PRESET_VERTEX_GPUBindGroupLayout_SKIN: string;
    /**
     * [KO] ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ResourceManager instance. (Internal system only)
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance.
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] GPU 디바이스를 반환합니다.
     * [EN] Returns the GPU device.
     */
    get gpuDevice(): GPUDevice;
    /**
     * [KO] 기본 샘플러를 반환합니다.
     * [EN] Returns the basic sampler.
     */
    get basicSampler(): Sampler;
    /**
     * [KO] 밉맵 생성기를 반환합니다.
     * [EN] Returns the mipmap generator.
     */
    get mipmapGenerator(): MipmapGenerator;
    /**
     * [KO] 큐브맵 다운샘플링 생성기를 반환합니다.
     * [EN] Returns the down-sample cube map generator.
     */
    get downSampleCubeMapGenerator(): DownSampleCubeMapGenerator;
    /**
     * [KO] 캐시된 버퍼 상태를 반환합니다.
     * [EN] Returns the cached buffer state.
     */
    get cachedBufferState(): any;
    /**
     * [KO] 빈 비트맵 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty bitmap texture view.
     */
    get emptyBitmapTextureView(): GPUTextureView;
    /**
     * [KO] 빈 큐브 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty cube texture view.
     */
    get emptyCubeTextureView(): GPUTextureView;
    /**
     * [KO] 비트맵 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed bitmap texture state.
     */
    get managedBitmapTextureState(): ResourceStatusInfo;
    /**
     * [KO] 큐브 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed cube texture state.
     */
    get managedCubeTextureState(): ResourceStatusInfo;
    /**
     * [KO] HDR 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed HDR texture state.
     */
    get managedHDRTextureState(): ResourceStatusInfo;
    /**
     * [KO] 유니폼 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed uniform buffer state.
     */
    get managedUniformBufferState(): ResourceStatusInfo;
    /**
     * [KO] 버텍스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed vertex buffer state.
     */
    get managedVertexBufferState(): ResourceStatusInfo;
    /**
     * [KO] 인덱스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed index buffer state.
     */
    get managedIndexBufferState(): ResourceStatusInfo;
    /**
     * [KO] Storage 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed storage buffer state.
     */
    get managedStorageBufferState(): ResourceStatusInfo;
    /**
     * [KO] 내부 리소스 맵을 반환합니다.
     * [EN] Returns the internal resource map.
     */
    get resources(): ImmutableKeyMap;
    /**
     * [KO] 리소스를 관리 대상으로 등록합니다.
     * [EN] Registers a resource for management.
     * @param target -
     * [KO] 대상 리소스
     * [EN] Target resource
     * @param resourceState -
     * [KO] 리소스 상태 정보
     * [EN] Resource state information
     */
    registerManagementResource(target: ManagementResourceBase, resourceState: ResourceState): void;
    /**
     * [KO] 리소스를 관리 대상에서 해제합니다.
     * [EN] Unregisters a resource from management.
     * @param target -
     * [KO] 대상 리소스
     * [EN] Target resource
     */
    unregisterManagementResource(target: ManagementResourceBase): void;
    /**
     * [KO] GPU 텍스처를 생성하고 관리합니다.
     * [EN] Creates and manages a GPU texture.
     * @param desc -
     * [KO] 텍스처 디스크립터
     * [EN] Texture descriptor
     * @returns
     * [KO] 생성된 GPUTexture
     * [EN] Created GPUTexture
     */
    createManagedTexture(desc: GPUTextureDescriptor): GPUTexture;
    /**
     * [KO] 비트맵 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.
     * [EN] Retrieves or creates a view for a bitmap texture from cache.
     * @param texture -
     * [KO] 대상 텍스처 (BitmapTexture, PackedTexture 또는 GPUTexture)
     * [EN] Target texture (BitmapTexture, PackedTexture, or GPUTexture)
     * @param viewDescriptor -
     * [KO] 뷰 디스크립터 (선택)
     * [EN] View descriptor (optional)
     * @returns
     * [KO] GPUTextureView
     * [EN] GPUTextureView
     */
    getGPUResourceBitmapTextureView(texture: BitmapTexture | PackedTexture | GPUTexture, viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView | null;
    /**
     * [KO] 큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.
     * [EN] Retrieves or creates a view for a cube texture from cache.
     * @param cubeTexture -
     * [KO] 대상 큐브 텍스처 (CubeTexture, IBLCubeTexture 또는 GPUTexture)
     * [EN] Target cube texture (CubeTexture, IBLCubeTexture, or GPUTexture)
     * @param viewDescriptor -
     * [KO] 뷰 디스크립터 (선택)
     * [EN] View descriptor (optional)
     * @returns
     * [KO] GPUTextureView
     * [EN] GPUTextureView
     */
    getGPUResourceCubeTextureView(cubeTexture: CubeTexture | GPUTexture | IBLCubeTexture, viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView | null;
    /**
     * [KO] GPUShaderModule을 생성하고 캐싱합니다.
     * [EN] Creates and caches a GPUShaderModule.
     * @param name -
     * [KO] 셰이더 모듈 이름
     * [EN] Shader module name
     * @param gpuShaderModuleDescriptor -
     * [KO] 셰이더 모듈 디스크립터
     * [EN] Shader module descriptor
     * @returns
     * [KO] 생성된 GPUShaderModule
     * [EN] Created GPUShaderModule
     */
    createGPUShaderModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor): any;
    /**
     * [KO] 캐싱된 GPUShaderModule을 반환합니다.
     * [EN] Returns the cached GPUShaderModule.
     * @param name -
     * [KO] 셰이더 모듈 이름
     * [EN] Shader module name
     * @returns
     * [KO] GPUShaderModule
     * [EN] GPUShaderModule
     */
    getGPUShaderModule(name: string): GPUShaderModule;
    /**
     * [KO] GPUShaderModule을 삭제합니다.
     * [EN] Deletes a GPUShaderModule.
     * @param name -
     * [KO] 셰이더 모듈 이름
     * [EN] Shader module name
     */
    deleteGPUShaderModule(name: string): void;
    /**
     * [KO] GPUBindGroupLayout을 생성하고 캐싱합니다.
     * [EN] Creates and caches a GPUBindGroupLayout.
     * @param name -
     * [KO] 레이아웃 이름
     * [EN] Layout name
     * @param bindGroupLayoutDescriptor -
     * [KO] 바인드 그룹 레이아웃 디스크립터
     * [EN] Bind group layout descriptor
     * @returns
     * [KO] GPUBindGroupLayout
     * [EN] GPUBindGroupLayout
     */
    createBindGroupLayout(name: string, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
    /**
     * [KO] 캐싱된 GPUBindGroupLayout을 반환합니다.
     * [EN] Returns the cached GPUBindGroupLayout.
     * @param name -
     * [KO] 레이아웃 이름
     * [EN] Layout name
     * @returns
     * [KO] GPUBindGroupLayout
     * [EN] GPUBindGroupLayout
     */
    getGPUBindGroupLayout(name: string): GPUBindGroupLayout;
    /**
     * [KO] GPUBindGroupLayout을 삭제합니다.
     * [EN] Deletes a GPUBindGroupLayout.
     * @param name -
     * [KO] 레이아웃 이름
     * [EN] Layout name
     */
    deleteGPUBindGroupLayout(name: string): void;
    /**
     * [KO] GPUPipelineLayout을 생성하고 캐싱합니다.
     * [EN] Creates and caches a GPUPipelineLayout.
     * @param name -
     * [KO] 레이아웃 이름
     * [EN] Layout name
     * @param gpuPipelineLayoutDescriptor -
     * [KO] 파이프라인 레이아웃 디스크립터
     * [EN] Pipeline layout descriptor
     * @returns
     * [KO] GPUPipelineLayout
     * [EN] GPUPipelineLayout
     */
    createGPUPipelineLayout(name: string, gpuPipelineLayoutDescriptor: GPUPipelineLayoutDescriptor): any;
    /**
     * [KO] GPUBuffer를 생성하고 캐싱합니다.
     * [EN] Creates and caches a GPUBuffer.
     * @param name -
     * [KO] 버퍼 이름
     * [EN] Buffer name
     * @param gpuBufferDescriptor -
     * [KO] 버퍼 디스크립터
     * [EN] Buffer descriptor
     * @returns
     * [KO] 생성된 GPUBuffer
     * [EN] Created GPUBuffer
     */
    createGPUBuffer(name: string, gpuBufferDescriptor: GPUBufferDescriptor): any;
}
export default ResourceManager;
declare class ImmutableKeyMap extends Map {
    constructor(initValues?: [any, any][]);
    set(key: any, value: any): this;
}
