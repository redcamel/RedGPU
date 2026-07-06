import RedGPUContext from "../../../context/RedGPUContext";
import Sampler from "../../sampler/Sampler";
import { BRDFGenerator, EquirectangularToCubeGenerator, IrradianceGenerator, PrefilterGenerator } from "../../texture/ibl/core";
import DownSampleCubeMapGenerator from "../../texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator";
import MipmapGenerator from "../../texture/core/mipmapGenerator/MipmapGenerator";
import ManagementResourceBase from "../ManagementResourceBase";
import ResourceStateIndexBuffer from "./resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "./resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "./resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "./resourceState/ResourceStateVertexBuffer";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
import ResourceStateBitmapTexture from "./resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture from "./resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture from "./resourceState/texture/ResourceStateHDRTexture";
import RedGPUObject from "../../../base/RedGPUObject";
export type { ResourceStateIndexBuffer, ResourceStateStorageBuffer, ResourceStateUniformBuffer, ResourceStateVertexBuffer, ResourceStateBitmapTexture, ResourceStateCubeTexture, ResourceStateHDRTexture };
export type ResourceState = ResourceStateVertexBuffer | ResourceStateIndexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer | ResourceStateCubeTexture | ResourceStateBitmapTexture | ResourceStateHDRTexture;
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
declare class ResourceManager extends RedGPUObject {
    #private;
    static PRESET_GPUBindGroupLayout_System: string;
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing: string;
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout: string;
    static PRESET_VERTEX_GPUBindGroupLayout: string;
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN: string;
    static GLOBAL_VERTEX_STRUCT: any;
    static GLOBAL_FRAGMENT_STRUCT_PBR: any;
    static GLOBAL_FRAGMENT_STRUCT_BUILT_IN: any;
    /**
     * [KO] ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ResourceManager instance. (Internal system only)
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 기본 샘플러를 반환합니다.
     * [EN] Returns the basic sampler.
     *
     * @returns
     * [KO] 기본 Sampler 인스턴스
     * [EN] Basic Sampler instance
     */
    get basicSampler(): Sampler;
    /**
     * [KO] 기본 디스플레이스먼트 맵용 샘플러를 반환합니다.
     * [EN] Returns the basic displacement sampler.
     *
     * @returns
     * [KO] displacement Sampler 인스턴스
     * [EN] Displacement Sampler instance
     */
    get basicDisplacementSampler(): Sampler;
    /**
     * [KO] BRDF 생성기를 반환합니다.
     * [EN] Returns the BRDF generator.
     *
     * @returns
     * [KO] BRDFGenerator 인스턴스
     * [EN] BRDFGenerator instance
     */
    get brdfGenerator(): BRDFGenerator;
    /**
     * [KO] Irradiance 생성기를 반환합니다.
     * [EN] Returns the Irradiance generator.
     *
     * @returns
     * [KO] IrradianceGenerator 인스턴스
     * [EN] IrradianceGenerator instance
     */
    get irradianceGenerator(): IrradianceGenerator;
    /**
     * [KO] Prefilter 생성기를 반환합니다.
     * [EN] Returns the Prefilter generator.
     *
     * @returns
     * [KO] PrefilterGenerator 인스턴스
     * [EN] PrefilterGenerator instance
     */
    get prefilterGenerator(): PrefilterGenerator;
    /**
     * [KO] Equirectangular(2D)를 CubeMap으로 변환하는 생성기를 반환합니다.
     * [EN] Returns the generator that converts Equirectangular (2D) to CubeMap.
     *
     * @returns
     * [KO] EquirectangularToCubeGenerator 인스턴스
     * [EN] EquirectangularToCubeGenerator instance
     */
    get equirectangularToCubeGenerator(): EquirectangularToCubeGenerator;
    /**
     * [KO] 밉맵 생성기를 반환합니다.
     * [EN] Returns the mipmap generator.
     *
     * @returns
     * [KO] MipmapGenerator 인스턴스
     * [EN] MipmapGenerator instance
     */
    get mipmapGenerator(): MipmapGenerator;
    /**
     * [KO] 큐브맵 다운샘플링 생성기를 반환합니다.
     * [EN] Returns the down-sample cube map generator.
     *
     * @returns
     * [KO] DownSampleCubeMapGenerator 인스턴스
     * [EN] DownSampleCubeMapGenerator instance
     */
    get downSampleCubeMapGenerator(): DownSampleCubeMapGenerator;
    /**
     * [KO] 캐시된 버퍼 상태를 반환합니다.
     * [EN] Returns the cached buffer state.
     *
     * @returns
     * [KO] 캐시된 버퍼 상태 객체
     * [EN] Cached buffer state object
     */
    get cachedBufferState(): any;
    /**
     * [KO] 빈 비트맵 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty bitmap texture view.
     *
     * @returns
     * [KO] 빈 비트맵 GPUTextureView
     * [EN] Empty bitmap GPUTextureView
     */
    get emptyBitmapTextureView(): GPUTextureView;
    /**
     * [KO] 빈 큐브 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty cube texture view.
     *
     * @returns
     * [KO] 빈 큐브 GPUTextureView
     * [EN] Empty cube GPUTextureView
     */
    get emptyCubeTextureView(): GPUTextureView;
    /**
     * [KO] 빈 3D 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty 3D texture view.
     *
     * @returns
     * [KO] 빈 3D GPUTextureView
     * [EN] Empty 3D GPUTextureView
     */
    get emptyTexture3DView(): GPUTextureView;
    /**
     * [KO] 빈 깊이 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty depth texture view.
     *
     * @returns
     * [KO] 빈 깊이 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get emptyDepthTextureView(): GPUTextureView;
    /**
     * [KO] 비트맵 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed bitmap texture state.
     *
     * @returns
     * [KO] 비트맵 텍스처 관리 상태 정보 객체
     * [EN] Managed bitmap texture status info object
     */
    get managedBitmapTextureState(): ResourceStatusInfo;
    /**
     * [KO] 큐브 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed cube texture state.
     *
     * @returns
     * [KO] 큐브 텍스처 관리 상태 정보 객체
     * [EN] Managed cube texture status info object
     */
    get managedCubeTextureState(): ResourceStatusInfo;
    /**
     * [KO] HDR 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed HDR texture state.
     *
     * @returns
     * [KO] HDR 텍스처 관리 상태 정보 객체
     * [EN] Managed HDR texture status info object
     */
    get managedHDRTextureState(): ResourceStatusInfo;
    /**
     * [KO] 유니폼 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed globalStruct buffer state.
     *
     * @returns
     * [KO] 유니폼 버퍼 관리 상태 정보 객체
     * [EN] Managed globalStruct buffer status info object
     */
    get managedUniformBufferState(): ResourceStatusInfo;
    /**
     * [KO] 버텍스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed vertex buffer state.
     *
     * @returns
     * [KO] 버텍스 버퍼 관리 상태 정보 객체
     * [EN] Managed vertex buffer status info object
     */
    get managedVertexBufferState(): ResourceStatusInfo;
    /**
     * [KO] 인덱스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed index buffer state.
     *
     * @returns
     * [KO] 인덱스 버퍼 관리 상태 정보 객체
     * [EN] Managed index buffer status info object
     */
    get managedIndexBufferState(): ResourceStatusInfo;
    /**
     * [KO] Storage 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed storage buffer state.
     *
     * @returns
     * [KO] 스토리지 버퍼 관리 상태 정보 객체
     * [EN] Managed storage buffer status info object
     */
    get managedStorageBufferState(): ResourceStatusInfo;
    /**
     * [KO] 내부 리소스 맵을 반환합니다.
     * [EN] Returns the internal resource map.
     *
     * @returns
     * [KO] ImmutableKeyMap 기반 리소스 맵
     * [EN] ImmutableKeyMap based resource map
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
     * [KO] 대상 텍스처 (BitmapTexture, PackedTexture, DirectTexture 또는 GPUTexture)
     * [EN] Target texture (BitmapTexture, PackedTexture, DirectTexture, or GPUTexture)
     * @param viewDescriptor -
     * [KO] 뷰 디스크립터 (선택)
     * [EN] View descriptor (optional)
     * @returns
     * [KO] GPUTextureView
     * [EN] GPUTextureView
     */
    getGPUResourceBitmapTextureView(texture: any, viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView | null;
    /**
     * [KO] 큐브 텍스처의 뷰를 캐시에서 가져오거나 새로 생성합니다.
     * [EN] Retrieves or creates a view for a cube texture from cache.
     * @param cubeTexture -
     * [KO] 대상 큐브 텍스처 (CubeTexture, DirectCubeTexture 또는 GPUTexture)
     * [EN] Target cube texture (CubeTexture, DirectCubeTexture, or GPUTexture)
     * @param viewDescriptor -
     * [KO] 뷰 디스크립터 (선택)
     * [EN] View descriptor (optional)
     * @returns
     * [KO] GPUTextureView
     * [EN] GPUTextureView
     */
    getGPUResourceCubeTextureView(cubeTexture: any, viewDescriptor?: GPUTextureViewDescriptor): GPUTextureView | null;
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
export declare class ImmutableKeyMap extends Map {
    constructor(initValues?: [any, any][]);
    set(key: any, value: any): this;
}
