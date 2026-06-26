import RedGPUContext from "../../../context/RedGPUContext";
import {keepLog} from "../../../utils";
import Sampler from "../../sampler/Sampler";
import {
    BRDFGenerator,
    EquirectangularToCubeGenerator,
    IrradianceGenerator,
    PrefilterGenerator
} from "../../texture/ibl/core";
import DownSampleCubeMapGenerator from "../../texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator";
import MipmapGenerator from "../../texture/core/mipmapGenerator/MipmapGenerator";
import CubeTexture from "../../texture/CubeTexture";
import preprocessWGSL from "../../wgslParser/core/preprocessWGSL";
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
import parseWGSL from "../../wgslParser/parseWGSL";
import ShaderLibrary from "../../../systemCodeManager/ShaderLibrary";

const SHADER_INFO = parseWGSL('VIEW3D_SYSTEM_UNIFORM', ShaderLibrary.SYSTEM_UNIFORM)
const GLOBAL_SSAO_VERTEX_STRUCT = SHADER_INFO.storage.globalVertexUniformBuffer.type.format;
const GLOBAL_SSAO_FRAGMENT_PBR_STRUCT = SHADER_INFO.storage.globalPBRUniformBuffer.type.format;
enum ResourceType {
    GPUShaderModule = 'GPUShaderModule',
    GPUBindGroupLayout = 'GPUBindGroupLayout',
    GPUPipelineLayout = 'GPUPipelineLayout',
    GPUBuffer = 'GPUBuffer',
}

export type {
    ResourceStateIndexBuffer,
    ResourceStateStorageBuffer,
    ResourceStateUniformBuffer,
    ResourceStateVertexBuffer,
    ResourceStateBitmapTexture,
    ResourceStateCubeTexture,
    ResourceStateHDRTexture
};

export type ResourceState = ResourceStateVertexBuffer
    | ResourceStateIndexBuffer
    | ResourceStateUniformBuffer
    | ResourceStateStorageBuffer
    | ResourceStateCubeTexture
    | ResourceStateBitmapTexture
    | ResourceStateHDRTexture;

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
class ResourceManager extends RedGPUObject {
    static PRESET_GPUBindGroupLayout_System = 'PRESET_GPUBindGroupLayout_System'
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing = 'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing'
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout = 'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout'
    static PRESET_VERTEX_GPUBindGroupLayout = 'PRESET_VERTEX_GPUBindGroupLayout'
    static PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN = 'PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN'
    static GLOBAL_SSAO_VERTEX_STRUCT = GLOBAL_SSAO_VERTEX_STRUCT
    static GLOBAL_SSAO_FRAGMENT_PBR_STRUCT = GLOBAL_SSAO_FRAGMENT_PBR_STRUCT

    #resources = new ImmutableKeyMap([
        [ResourceType.GPUShaderModule, new Map()],
        [ResourceType.GPUBindGroupLayout, new Map()],
        [ResourceType.GPUPipelineLayout, new Map()],
        [ResourceType.GPUBuffer, new MemoryTrackingMap<string, GPUBuffer>()]
    ])
    #managedBitmapTextureState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedCubeTextureState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedHDRTextureState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedUniformBufferState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedVertexBufferState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedIndexBufferState: ResourceStatusInfo = new ResourceStatusInfo()
    #managedStorageBufferState: ResourceStatusInfo = new ResourceStatusInfo()
    #cachedBufferState: any = {}
    #emptyBitmapTextureView: GPUTextureView
    #emptyCubeTextureView: GPUTextureView
    #emptyTexture3DView: GPUTextureView
    #emptyDepthTextureView: GPUTextureView
    readonly #mipmapGenerator: MipmapGenerator
    readonly #downSampleCubeMapGenerator: DownSampleCubeMapGenerator
    readonly #brdfGenerator: BRDFGenerator
    readonly #irradianceGenerator: IrradianceGenerator
    readonly #prefilterGenerator: PrefilterGenerator
    readonly #equirectangularToCubeGenerator: EquirectangularToCubeGenerator
    #basicSampler: Sampler
    #basicDisplacementSampler: Sampler
    #bitmapTextureViewCache: WeakMap<GPUTexture, Map<string, GPUTextureView>> = new WeakMap();
    #cubeTextureViewCache: WeakMap<GPUTexture, Map<string, GPUTextureView>> = new WeakMap();


    /**
     * [KO] ResourceManager 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ResourceManager instance. (Internal system only)
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext)
        this.#mipmapGenerator = new MipmapGenerator(redGPUContext)
        this.#downSampleCubeMapGenerator = new DownSampleCubeMapGenerator(redGPUContext)
        this.#brdfGenerator = new BRDFGenerator(redGPUContext)
        this.#irradianceGenerator = new IrradianceGenerator(redGPUContext)
        this.#prefilterGenerator = new PrefilterGenerator(redGPUContext)
        this.#equirectangularToCubeGenerator = new EquirectangularToCubeGenerator(redGPUContext)
        this.#initPresets()
    }


    /**
     * [KO] 기본 샘플러를 반환합니다.
     * [EN] Returns the basic sampler.
     *
     * @returns
     * [KO] 기본 Sampler 인스턴스
     * [EN] Basic Sampler instance
     */
    get basicSampler(): Sampler {
        return this.#basicSampler;
    }

    /**
     * [KO] 기본 디스플레이스먼트 맵용 샘플러를 반환합니다.
     * [EN] Returns the basic displacement sampler.
     *
     * @returns
     * [KO] displacement Sampler 인스턴스
     * [EN] Displacement Sampler instance
     */
    get basicDisplacementSampler(): Sampler {
        return this.#basicDisplacementSampler
    }

    /**
     * [KO] BRDF 생성기를 반환합니다.
     * [EN] Returns the BRDF generator.
     *
     * @returns
     * [KO] BRDFGenerator 인스턴스
     * [EN] BRDFGenerator instance
     */
    get brdfGenerator(): BRDFGenerator {
        return this.#brdfGenerator;
    }

    /**
     * [KO] Irradiance 생성기를 반환합니다.
     * [EN] Returns the Irradiance generator.
     *
     * @returns
     * [KO] IrradianceGenerator 인스턴스
     * [EN] IrradianceGenerator instance
     */
    get irradianceGenerator(): IrradianceGenerator {
        return this.#irradianceGenerator;
    }

    /**
     * [KO] Prefilter 생성기를 반환합니다.
     * [EN] Returns the Prefilter generator.
     *
     * @returns
     * [KO] PrefilterGenerator 인스턴스
     * [EN] PrefilterGenerator instance
     */
    get prefilterGenerator(): PrefilterGenerator {
        return this.#prefilterGenerator;
    }

    /**
     * [KO] Equirectangular(2D)를 CubeMap으로 변환하는 생성기를 반환합니다.
     * [EN] Returns the generator that converts Equirectangular (2D) to CubeMap.
     *
     * @returns
     * [KO] EquirectangularToCubeGenerator 인스턴스
     * [EN] EquirectangularToCubeGenerator instance
     */
    get equirectangularToCubeGenerator(): EquirectangularToCubeGenerator {
        return this.#equirectangularToCubeGenerator;
    }

    /**
     * [KO] 밉맵 생성기를 반환합니다.
     * [EN] Returns the mipmap generator.
     *
     * @returns
     * [KO] MipmapGenerator 인스턴스
     * [EN] MipmapGenerator instance
     */
    get mipmapGenerator(): MipmapGenerator {
        return this.#mipmapGenerator;
    }

    /**
     * [KO] 큐브맵 다운샘플링 생성기를 반환합니다.
     * [EN] Returns the down-sample cube map generator.
     *
     * @returns
     * [KO] DownSampleCubeMapGenerator 인스턴스
     * [EN] DownSampleCubeMapGenerator instance
     */
    get downSampleCubeMapGenerator(): DownSampleCubeMapGenerator {
        return this.#downSampleCubeMapGenerator
    }

    /**
     * [KO] 캐시된 버퍼 상태를 반환합니다.
     * [EN] Returns the cached buffer state.
     *
     * @returns
     * [KO] 캐시된 버퍼 상태 객체
     * [EN] Cached buffer state object
     */
    get cachedBufferState(): any {
        return this.#cachedBufferState;
    }

    /**
     * [KO] 빈 비트맵 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty bitmap texture view.
     *
     * @returns
     * [KO] 빈 비트맵 GPUTextureView
     * [EN] Empty bitmap GPUTextureView
     */
    get emptyBitmapTextureView(): GPUTextureView {
        return this.#emptyBitmapTextureView;
    }

    /**
     * [KO] 빈 큐브 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty cube texture view.
     *
     * @returns
     * [KO] 빈 큐브 GPUTextureView
     * [EN] Empty cube GPUTextureView
     */
    get emptyCubeTextureView(): GPUTextureView {
        return this.#emptyCubeTextureView;
    }

    /**
     * [KO] 빈 3D 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty 3D texture view.
     *
     * @returns
     * [KO] 빈 3D GPUTextureView
     * [EN] Empty 3D GPUTextureView
     */
    get emptyTexture3DView(): GPUTextureView {
        return this.#emptyTexture3DView;
    }

    /**
     * [KO] 빈 깊이 텍스처 뷰를 반환합니다.
     * [EN] Returns the empty depth texture view.
     *
     * @returns
     * [KO] 빈 깊이 GPUTextureView
     * [EN] Empty depth GPUTextureView
     */
    get emptyDepthTextureView(): GPUTextureView {
        return this.#emptyDepthTextureView;
    }

    /**
     * [KO] 비트맵 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed bitmap texture state.
     *
     * @returns
     * [KO] 비트맵 텍스처 관리 상태 정보 객체
     * [EN] Managed bitmap texture status info object
     */
    get managedBitmapTextureState(): ResourceStatusInfo {
        return this.#managedBitmapTextureState;
    }

    /**
     * [KO] 큐브 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed cube texture state.
     *
     * @returns
     * [KO] 큐브 텍스처 관리 상태 정보 객체
     * [EN] Managed cube texture status info object
     */
    get managedCubeTextureState(): ResourceStatusInfo {
        return this.#managedCubeTextureState;
    }

    /**
     * [KO] HDR 텍스처 관리 상태를 반환합니다.
     * [EN] Returns the managed HDR texture state.
     *
     * @returns
     * [KO] HDR 텍스처 관리 상태 정보 객체
     * [EN] Managed HDR texture status info object
     */
    get managedHDRTextureState(): ResourceStatusInfo {
        return this.#managedHDRTextureState;
    }

    /**
     * [KO] 유니폼 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed uniform buffer state.
     *
     * @returns
     * [KO] 유니폼 버퍼 관리 상태 정보 객체
     * [EN] Managed uniform buffer status info object
     */
    get managedUniformBufferState(): ResourceStatusInfo {
        return this.#managedUniformBufferState;
    }

    /**
     * [KO] 버텍스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed vertex buffer state.
     *
     * @returns
     * [KO] 버텍스 버퍼 관리 상태 정보 객체
     * [EN] Managed vertex buffer status info object
     */
    get managedVertexBufferState(): ResourceStatusInfo {
        return this.#managedVertexBufferState;
    }

    /**
     * [KO] 인덱스 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed index buffer state.
     *
     * @returns
     * [KO] 인덱스 버퍼 관리 상태 정보 객체
     * [EN] Managed index buffer status info object
     */
    get managedIndexBufferState(): ResourceStatusInfo {
        return this.#managedIndexBufferState;
    }

    /**
     * [KO] Storage 버퍼 관리 상태를 반환합니다.
     * [EN] Returns the managed storage buffer state.
     *
     * @returns
     * [KO] 스토리지 버퍼 관리 상태 정보 객체
     * [EN] Managed storage buffer status info object
     */
    get managedStorageBufferState(): ResourceStatusInfo {
        return this.#managedStorageBufferState;
    }

    /**
     * [KO] 내부 리소스 맵을 반환합니다.
     * [EN] Returns the internal resource map.
     *
     * @returns
     * [KO] ImmutableKeyMap 기반 리소스 맵
     * [EN] ImmutableKeyMap based resource map
     */
    get resources(): ImmutableKeyMap {
        return this.#resources;
    }

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
    registerManagementResource(target: ManagementResourceBase, resourceState: ResourceState) {
        const {cacheKey, targetResourceManagedState} = target;
        const {table} = targetResourceManagedState;
        if (table.get(cacheKey)) {
            keepLog(`Resource with cacheKey ${cacheKey} is already registered.`);
            return;
        }
        table.set(cacheKey, resourceState);
        targetResourceManagedState.videoMemory += (target as any).videoMemorySize;
    }

    /**
     * [KO] 리소스를 관리 대상에서 해제합니다.
     * [EN] Unregisters a resource from management.
     * @param target -
     * [KO] 대상 리소스
     * [EN] Target resource
     */
    unregisterManagementResource(target: ManagementResourceBase) {
        const {cacheKey, targetResourceManagedState} = target;
        const {table} = targetResourceManagedState;
        const resourceState = table.get(cacheKey);
        if (!resourceState) {
            return;
        }
        targetResourceManagedState.videoMemory -= (target as any).videoMemorySize;
        table.delete(cacheKey);
    }

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
    createManagedTexture(desc: GPUTextureDescriptor): GPUTexture {
        const texture = this.gpuDevice.createTexture(desc);
        const originalDestroy = texture.destroy.bind(texture);
        texture.destroy = (): undefined => {
            this.#clearTextureCache(texture, desc);
            originalDestroy();
        };
        return texture;
    }

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
    getGPUResourceBitmapTextureView(
        texture: any,
        viewDescriptor?: GPUTextureViewDescriptor
    ): GPUTextureView | null {
        const targetGPUTexture = texture instanceof GPUTexture ? texture : texture?.gpuTexture;
        if (!targetGPUTexture) {
            return this.#emptyBitmapTextureView;
        }
        let textureViewMap = this.#bitmapTextureViewCache.get(targetGPUTexture);
        if (!textureViewMap) {
            textureViewMap = new Map();
            this.#bitmapTextureViewCache.set(targetGPUTexture, textureViewMap);
        }
        const cacheKey = this.#createDescriptorKey(viewDescriptor);
        let cachedView = textureViewMap.get(cacheKey);
        if (!cachedView) {
            const targetDescriptor = viewDescriptor ? {
                ...viewDescriptor,
                label: viewDescriptor.label || targetGPUTexture.label
            } : {
                label: targetGPUTexture.label
            };
            cachedView = targetGPUTexture.createView(targetDescriptor);
            textureViewMap.set(cacheKey, cachedView);
            console.log('🔷 새 비트맵 텍스처 뷰 생성:', targetGPUTexture.label, cacheKey);
        } else {
            console.log('비트맵 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
        }
        return cachedView;
    }

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
    getGPUResourceCubeTextureView(
        cubeTexture: any,
        viewDescriptor?: GPUTextureViewDescriptor
    ): GPUTextureView | null {
        const targetGPUTexture = cubeTexture instanceof GPUTexture ? cubeTexture : cubeTexture?.gpuTexture;
        if (!targetGPUTexture) {
            return this.#emptyCubeTextureView;
        }
        let textureViewMap = this.#cubeTextureViewCache.get(targetGPUTexture);
        if (!textureViewMap) {
            textureViewMap = new Map();
            this.#cubeTextureViewCache.set(targetGPUTexture, textureViewMap);
        }
        const effectiveDescriptor: GPUTextureViewDescriptor = viewDescriptor || (cubeTexture instanceof GPUTexture ? CubeTexture.defaultViewDescriptor : cubeTexture.viewDescriptor);
        const cacheKey = this.#createDescriptorKey(effectiveDescriptor);
        let cachedView = textureViewMap.get(cacheKey);
        if (!cachedView) {
            const targetDescriptor = {
                ...effectiveDescriptor,
                label: targetGPUTexture.label
            };
            cachedView = targetGPUTexture.createView(targetDescriptor);
            textureViewMap.set(cacheKey, cachedView);
            console.log('🧊 새 큐브 텍스처 뷰 생성:', targetGPUTexture.label, cacheKey);
        } else {
            console.log('큐브 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
        }
        return cachedView;
    }

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
    createGPUShaderModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor) {
        return this.#createResource(name, gpuShaderModuleDescriptor,
            descriptor => this.#createAndCacheModule(name, descriptor),
            ResourceType.GPUShaderModule);
    }

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
    getGPUShaderModule(name: string): GPUShaderModule {
        return this.#getResource(name, ResourceType.GPUShaderModule);
    }

    /**
     * [KO] GPUShaderModule을 삭제합니다.
     * [EN] Deletes a GPUShaderModule.
     * @param name -
     * [KO] 셰이더 모듈 이름
     * [EN] Shader module name
     */
    deleteGPUShaderModule(name: string) {
        this.#deleteResource(name, ResourceType.GPUShaderModule);
    }

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
    createBindGroupLayout(name: string, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
        return this.#createResource(name, bindGroupLayoutDescriptor,
            descriptor => {
                if (!descriptor.label) descriptor.label = name;
                return this.redGPUContext.gpuDevice.createBindGroupLayout(descriptor);
            }, ResourceType.GPUBindGroupLayout);
    }

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
    getGPUBindGroupLayout(name: string): GPUBindGroupLayout {
        return this.#getResource(name, ResourceType.GPUBindGroupLayout);
    }

    /**
     * [KO] GPUBindGroupLayout을 삭제합니다.
     * [EN] Deletes a GPUBindGroupLayout.
     * @param name -
     * [KO] 레이아웃 이름
     * [EN] Layout name
     */
    deleteGPUBindGroupLayout(name: string) {
        this.#deleteResource(name, ResourceType.GPUBindGroupLayout);
    }

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
    createGPUPipelineLayout(name: string, gpuPipelineLayoutDescriptor: GPUPipelineLayoutDescriptor) {
        return this.#createResource(name, gpuPipelineLayoutDescriptor,
            descriptor => {
                if (!descriptor.label) descriptor.label = name;
                return this.redGPUContext.gpuDevice.createPipelineLayout(descriptor);
            }, ResourceType.GPUPipelineLayout);
    }

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
    createGPUBuffer(name: string, gpuBufferDescriptor: GPUBufferDescriptor) {
        return this.#createResource(name, gpuBufferDescriptor,
            descriptor => {
                if (!descriptor.label) descriptor.label = name;
                return this.gpuDevice.createBuffer(descriptor);
            }, ResourceType.GPUBuffer);
    }

    /**
     * [KO] 텍스처 뷰 캐시를 정리합니다.
     * [EN] Clears the texture view cache.
     */
    #clearTextureCache(texture: GPUTexture, desc: GPUTextureDescriptor) {
        const cache = desc.dimension === '3d' ?
            this.#cubeTextureViewCache :
            this.#bitmapTextureViewCache;
        cache.get(texture)?.clear();
        if (cache.delete(texture)) {
            // const type = desc.dimension === '3d' ? '🧊 큐브' : '🔷 비트맵';
            // keepLog(`${type} 텍스처 뷰 캐시 정리:`, texture.label);
        }
    }

    /**
     * [KO] 디스크립터를 기반으로 캐시 키를 생성합니다.
     * [EN] Creates a cache key based on the descriptor.
     */
    #createDescriptorKey(viewDescriptor?: GPUTextureViewDescriptor): string {
        return viewDescriptor ? JSON.stringify(viewDescriptor) : 'default';
    }

    /**
     * [KO] 시스템 프리셋을 초기화합니다.
     * [EN] Initializes system presets.
     */
    #initPresets() {
        const {gpuDevice} = this.redGPUContext
        {
            const emptyBitmapTexture = gpuDevice.createTexture({
                size: {width: 1, height: 1, depthOrArrayLayers: 1},
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING,
                label: 'EMPTY_BITMAP_TEXTURE',
            });
            this.#emptyBitmapTextureView = emptyBitmapTexture.createView({label: emptyBitmapTexture.label});
            const transparentPixel = new Uint8Array([0, 0, 0, 0]);
            gpuDevice.queue.writeTexture(
                {texture: emptyBitmapTexture},
                transparentPixel,
                {bytesPerRow: 4, rowsPerImage: 1},
                {width: 1, height: 1, depthOrArrayLayers: 1}
            );
            const emptyCubeTexture = gpuDevice.createTexture({
                size: {width: 1, height: 1, depthOrArrayLayers: 6},
                format: 'rgba8unorm',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'EMPTY_CUBE_TEXTURE',
            });
            this.#emptyCubeTextureView = emptyCubeTexture.createView(CubeTexture.defaultViewDescriptor);
            const cubeTransparentPixels = new Uint8Array([0, 0, 0, 0]);
            for (let i = 0; i < 6; i++) {
                gpuDevice.queue.writeTexture(
                    {texture: emptyCubeTexture, origin: {x: 0, y: 0, z: i}},
                    cubeTransparentPixels,
                    {bytesPerRow: 4, rowsPerImage: 1},
                    {width: 1, height: 1, depthOrArrayLayers: 1}
                );
            }

            const emptyTexture3D = gpuDevice.createTexture({
                size: {width: 1, height: 1, depthOrArrayLayers: 1},
                dimension: '3d',
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'EMPTY_TEXTURE_3D',
            });
            this.#emptyTexture3DView = emptyTexture3D.createView({
                label: emptyTexture3D.label,
                dimension: '3d'
            });

            const emptyDepthTexture = gpuDevice.createTexture({
                size: {width: 1, height: 1, depthOrArrayLayers: 1},
                format: 'depth24plus',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
                label: 'EMPTY_DEPTH_TEXTURE',
            });
            this.#emptyDepthTextureView = emptyDepthTexture.createView({label: emptyDepthTexture.label});

            this.#basicSampler = new Sampler(this.redGPUContext)
            this.#basicDisplacementSampler = new Sampler(this.redGPUContext, {
                magFilter: 'linear',
                minFilter: 'linear',
                mipmapFilter: 'linear',
                addressModeU: 'repeat',
                addressModeV: 'repeat',
                addressModeW: 'repeat',
            })
        }
        {
            this.createBindGroupLayout(
                ResourceManager.PRESET_GPUBindGroupLayout_System,
                {
                    entries: [
                        {
                            binding: 0,
                            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                            buffer: {type: 'uniform',}
                        },
                        {
                            binding: 1,
                            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                            sampler: {type: 'comparison'}
                        },
                        {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: "depth"}},
                        {binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                        {
                            binding: 5,
                            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                            buffer: {type: 'read-only-storage',}
                        },
                        {
                            binding: 6,
                            visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                            buffer: {type: 'storage',}
                        },
                        {binding: 7, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                        {binding: 8, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 9, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                        {binding: 10, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: "cube"}},
                        {binding: 11, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: "cube"}},
                        {binding: 12, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 13, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                        {binding: 14, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                        {binding: 15, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: "cube"}},
                        {binding: 16, visibility: GPUShaderStage.FRAGMENT, texture: {viewDimension: "cube"}},
                        {
                            binding: 17,
                            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                            buffer: {type: 'read-only-storage'}
                        },
                        {
                            binding: 18,
                            visibility: GPUShaderStage.FRAGMENT,
                            buffer: {type: 'read-only-storage'}
                        },
                    ],
                }
            )
            this.createBindGroupLayout(
                ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout,
                {
                    entries: [

                        {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                        {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}}
                    ],
                }
            )
            this.createBindGroupLayout(
                ResourceManager.PRESET_VERTEX_GPUBindGroupLayout,
                {
                    entries: [
                        {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                        {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                        {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}}
                    ],
                }
            )
            this.createBindGroupLayout(
                ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_SKIN,
                {
                    entries: [
                        {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                        {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}},
                        {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                        {binding: 4, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                    ],
                }
            )
            this.createBindGroupLayout(
                ResourceManager.PRESET_GLOBAL_VERTEX_GPUBindGroupLayout_Instancing,
                {
                    entries: [
                        {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                        {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                        {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}},
                        {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                    ],
                }
            )
        }
    }

    #getTargetMap(key: ResourceType) {
        return this.#resources.get(key);
    }

    #createAndCacheModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor) {
        const {code} = gpuShaderModuleDescriptor
        const newCode = preprocessWGSL(name, code).defaultSource
        const newModule: GPUShaderModule = this.redGPUContext.gpuDevice.createShaderModule({
            ...gpuShaderModuleDescriptor,
            code: newCode,
        })
        const targetMap = this.#getTargetMap(ResourceType.GPUShaderModule);
        targetMap.set(name, newModule)
        return newModule
    }

    #getTargetMapAndVerifyName(name: string, resourceType: ResourceType): ImmutableKeyMap {
        if (!name) throw new Error('Name is required');
        return this.#getTargetMap(resourceType);
    }

    #createResource(name: string, descriptor: any, createFn: Function, resourceType: ResourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        if (targetMap.has(name)) {
            return targetMap.get(name);
        }
        if (!descriptor.label) descriptor.label = name
        const resource = createFn(descriptor);
        targetMap.set(name, resource);
        return resource;
    }

    #getResource(name: string, resourceType: ResourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        return targetMap.get(name);
    }

    #deleteResource(name: string, resourceType: ResourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        if (!targetMap.has(name)) {
            throw new Error(`${resourceType} with name ${name} doesn't exist.`);
        }
        targetMap.delete(name);
    }
}

Object.freeze(ResourceManager)
export default ResourceManager

export class ImmutableKeyMap extends Map {
    constructor(initValues: [any, any][] = []) {
        super();
        initValues?.forEach(([key, value]) => super.set(key, value));
    }

    set(key: any, value: any): this {
        if (this.has(key)) {
            throw new Error("Cannot change the value of an existing key");
        } else {
            return super.set(key, value);
        }
    }
}

class MemoryTrackingMap<K, V> extends Map<K, V> {
    #videoMemory: number = 0;

    constructor() {
        super();
    }

    get videoMemory(): number {
        return this.#videoMemory;
    }

    set(key: K, value: V): this {
        // 기존 값이 있다면 메모리에서 제거
        const videoMemoryKey =
            (value && 'videoMemorySize' in (value as any)) ? 'videoMemorySize'
                : (value && 'size' in (value as any)) ? 'size'
                    : undefined;
        if (this.has(key)) {
            const existingValue = this.get(key) as any;
            if (existingValue && existingValue[videoMemoryKey]) {
                this.#videoMemory -= existingValue[videoMemoryKey];
            }
        }
        // 새 값의 메모리 추가
        if (value && (value as any)) {
            const size = (value as any)[videoMemoryKey];
            if (typeof size === 'number') this.#videoMemory += size;
        }
        return super.set(key, value);
    }

    delete(key: K): boolean {
        if (this.has(key)) {
            const value = this.get(key) as any;
            const videoMemoryKey =
                (value && 'videoMemorySize' in (value as any)) ? 'videoMemorySize'
                    : (value && 'size' in (value as any)) ? 'size'
                        : undefined;
            if (value && typeof value[videoMemoryKey] === 'number') {
                this.#videoMemory -= value[videoMemoryKey];
            }
        }
        return super.delete(key);
    }

    clear(): void {
        this.#videoMemory = 0;
        super.clear();
    }
}
