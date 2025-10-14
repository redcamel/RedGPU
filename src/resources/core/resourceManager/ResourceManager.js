import { keepLog } from "../../../utils";
import Sampler from "../../sampler/Sampler";
import BitmapTexture from "../../texture/BitmapTexture";
import DownSampleCubeMapGenerator from "../../texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator";
import MipmapGenerator from "../../texture/core/mipmapGenerator/MipmapGenerator";
import CubeTexture from "../../texture/CubeTexture";
import preprocessWGSL from "../../wgslParser/core/preprocessWGSL";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
var ResourceType;
(function (ResourceType) {
    ResourceType["GPUShaderModule"] = "GPUShaderModule";
    ResourceType["GPUBindGroupLayout"] = "GPUBindGroupLayout";
    ResourceType["GPUPipelineLayout"] = "GPUPipelineLayout";
    ResourceType["GPUBuffer"] = "GPUBuffer";
})(ResourceType || (ResourceType = {}));
class ResourceManager {
    static PRESET_GPUBindGroupLayout_System = 'PRESET_GPUBindGroupLayout_System';
    static PRESET_VERTEX_GPUBindGroupLayout_Instancing = 'PRESET_VERTEX_GPUBindGroupLayout_Instancing';
    static PRESET_VERTEX_GPUBindGroupLayout = 'PRESET_VERTEX_GPUBindGroupLayout';
    static PRESET_VERTEX_GPUBindGroupLayout_SKIN = 'PRESET_VERTEX_GPUBindGroupLayout_SKIN';
    #gpuBufferVideoMemory = 0;
    #resources = new ImmutableKeyMap([
        [ResourceType.GPUShaderModule, new Map()],
        [ResourceType.GPUBindGroupLayout, new Map()],
        [ResourceType.GPUPipelineLayout, new Map()],
        [ResourceType.GPUBuffer, new MemoryTrackingMap()]
    ]);
    #managedBitmapTextureState = new ResourceStatusInfo();
    #managedCubeTextureState = new ResourceStatusInfo();
    #managedHDRTextureState = new ResourceStatusInfo();
    #managedUniformBufferState = new ResourceStatusInfo();
    #managedVertexBufferState = new ResourceStatusInfo();
    #managedIndexBufferState = new ResourceStatusInfo();
    #managedStorageBufferState = new ResourceStatusInfo();
    #cachedBufferState = {};
    #emptyBitmapTextureView;
    #emptyCubeTextureView;
    #mipmapGenerator;
    #downSampleCubeMapGenerator;
    #basicSampler;
    #bitmapTextureViewCache = new WeakMap();
    #cubeTextureViewCache = new WeakMap();
    #redGPUContext;
    #gpuDevice;
    constructor(redGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#gpuDevice = redGPUContext.gpuDevice;
        this.#mipmapGenerator = new MipmapGenerator(redGPUContext);
        this.#downSampleCubeMapGenerator = new DownSampleCubeMapGenerator(redGPUContext);
        this.#initPresets();
    }
    get redGPUContext() {
        return this.#redGPUContext;
    }
    get gpuDevice() {
        return this.#gpuDevice;
    }
    get basicSampler() {
        return this.#basicSampler;
    }
    get mipmapGenerator() {
        return this.#mipmapGenerator;
    }
    get downSampleCubeMapGenerator() {
        return this.#downSampleCubeMapGenerator;
    }
    get cachedBufferState() {
        return this.#cachedBufferState;
    }
    get emptyBitmapTextureView() {
        return this.#emptyBitmapTextureView;
    }
    get emptyCubeTextureView() {
        return this.#emptyCubeTextureView;
    }
    get managedBitmapTextureState() {
        return this.#managedBitmapTextureState;
    }
    get managedCubeTextureState() {
        return this.#managedCubeTextureState;
    }
    get managedHDRTextureState() {
        return this.#managedHDRTextureState;
    }
    get managedUniformBufferState() {
        return this.#managedUniformBufferState;
    }
    get managedVertexBufferState() {
        return this.#managedVertexBufferState;
    }
    get managedIndexBufferState() {
        return this.#managedIndexBufferState;
    }
    get managedStorageBufferState() {
        return this.#managedStorageBufferState;
    }
    get resources() {
        return this.#resources;
    }
    registerManagementResource(target, resourceState) {
        const { cacheKey, targetResourceManagedState } = target;
        const { table } = targetResourceManagedState;
        if (table.get(cacheKey)) {
            keepLog(`Resource with cacheKey ${cacheKey} is already registered.`);
            return;
        }
        table.set(cacheKey, resourceState);
        targetResourceManagedState.videoMemory += target.videoMemorySize;
    }
    unregisterManagementResource(target) {
        const { cacheKey, targetResourceManagedState } = target;
        const { table } = targetResourceManagedState;
        const resourceState = table.get(cacheKey);
        // keepLog(target,table,'cacheKey',cacheKey,'resourceState',resourceState)
        if (!resourceState) {
            return;
        }
        targetResourceManagedState.videoMemory -= target.videoMemorySize;
        table.delete(cacheKey);
    }
    createManagedTexture(desc) {
        const texture = this.gpuDevice.createTexture(desc);
        const originalDestroy = texture.destroy.bind(texture);
        texture.destroy = () => {
            this.#clearTextureCache(texture, desc);
            originalDestroy();
        };
        return texture;
    }
    getGPUResourceBitmapTextureView(texture, viewDescriptor) {
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
        }
        else {
            console.log('비트맵 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
        }
        return cachedView;
    }
    getGPUResourceCubeTextureView(cubeTexture, viewDescriptor) {
        const targetGPUTexture = cubeTexture instanceof GPUTexture ? cubeTexture : cubeTexture?.gpuTexture;
        if (!targetGPUTexture) {
            return this.#emptyCubeTextureView;
        }
        let textureViewMap = this.#cubeTextureViewCache.get(targetGPUTexture);
        if (!textureViewMap) {
            textureViewMap = new Map();
            this.#cubeTextureViewCache.set(targetGPUTexture, textureViewMap);
        }
        if (!(cubeTexture instanceof GPUTexture) && !viewDescriptor)
            viewDescriptor = cubeTexture.viewDescriptor;
        const effectiveDescriptor = viewDescriptor || CubeTexture.defaultViewDescriptor;
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
        }
        else {
            console.log('큐브 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
        }
        return cachedView;
    }
    createGPUShaderModule(name, gpuShaderModuleDescriptor) {
        return this.#createResource(name, gpuShaderModuleDescriptor, descriptor => this.#createAndCacheModule(name, descriptor), ResourceType.GPUShaderModule);
    }
    getGPUShaderModule(name) {
        return this.#getResource(name, ResourceType.GPUShaderModule);
    }
    deleteGPUShaderModule(name) {
        this.#deleteResource(name, ResourceType.GPUShaderModule);
    }
    createBindGroupLayout(name, bindGroupLayoutDescriptor) {
        return this.#createResource(name, bindGroupLayoutDescriptor, descriptor => {
            if (!descriptor.label)
                descriptor.label = name;
            return this.redGPUContext.gpuDevice.createBindGroupLayout(descriptor);
        }, ResourceType.GPUBindGroupLayout);
    }
    getGPUBindGroupLayout(name) {
        return this.#getResource(name, ResourceType.GPUBindGroupLayout);
    }
    deleteGPUBindGroupLayout(name) {
        this.#deleteResource(name, ResourceType.GPUBindGroupLayout);
    }
    createGPUPipelineLayout(name, gpuPipelineLayoutDescriptor) {
        return this.#createResource(name, gpuPipelineLayoutDescriptor, descriptor => {
            if (!descriptor.label)
                descriptor.label = name;
            return this.redGPUContext.gpuDevice.createPipelineLayout(descriptor);
        }, ResourceType.GPUPipelineLayout);
    }
    createGPUBuffer(name, gpuBufferDescriptor) {
        return this.#createResource(name, gpuBufferDescriptor, descriptor => {
            if (!descriptor.label)
                descriptor.label = name;
            return this.gpuDevice.createBuffer(descriptor);
        }, ResourceType.GPUBuffer);
    }
    #clearTextureCache(texture, desc) {
        const cache = desc.dimension === '3d' ?
            this.#cubeTextureViewCache :
            this.#bitmapTextureViewCache;
        cache.get(texture)?.clear();
        if (cache.delete(texture)) {
            const type = desc.dimension === '3d' ? '🧊 큐브' : '🔷 비트맵';
            // keepLog(`${type} 텍스처 뷰 캐시 정리:`, texture.label);
        }
    }
    #createDescriptorKey(viewDescriptor) {
        return viewDescriptor ? JSON.stringify(viewDescriptor) : 'default';
    }
    #initPresets() {
        const { gpuDevice } = this.redGPUContext;
        {
            const emptyBitmapTexture = gpuDevice.createTexture({
                size: { width: 1, height: 1, depthOrArrayLayers: 1 },
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.STORAGE_BINDING,
                label: 'EMPTY_BITMAP_TEXTURE',
            });
            this.#emptyBitmapTextureView = emptyBitmapTexture.createView({ label: emptyBitmapTexture.label });
            const transparentPixel = new Uint8Array([0, 0, 0, 0]);
            gpuDevice.queue.writeTexture({ texture: emptyBitmapTexture }, transparentPixel, { bytesPerRow: 4, rowsPerImage: 1 }, { width: 1, height: 1, depthOrArrayLayers: 1 });
            const emptyCubeTexture = gpuDevice.createTexture({
                size: { width: 1, height: 1, depthOrArrayLayers: 6 },
                format: 'rgba8unorm',
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'EMPTY_CUBE_TEXTURE',
            });
            this.#emptyCubeTextureView = emptyCubeTexture.createView(CubeTexture.defaultViewDescriptor);
            const cubeTransparentPixels = new Uint8Array([0, 0, 0, 0]);
            for (let i = 0; i < 6; i++) {
                gpuDevice.queue.writeTexture({ texture: emptyCubeTexture, origin: { x: 0, y: 0, z: i } }, cubeTransparentPixels, { bytesPerRow: 4, rowsPerImage: 1 }, { width: 1, height: 1, depthOrArrayLayers: 1 });
            }
            this.#basicSampler = new Sampler(this.redGPUContext);
        }
        {
            this.createBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System, {
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                        buffer: { type: 'uniform', }
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                        sampler: { type: 'comparison' }
                    },
                    { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "depth" } },
                    { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                    {
                        binding: 5,
                        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                        buffer: { type: 'read-only-storage', }
                    },
                    {
                        binding: 6,
                        visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE,
                        buffer: { type: 'storage', }
                    },
                    { binding: 7, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                    { binding: 8, visibility: GPUShaderStage.FRAGMENT, texture: {} },
                    { binding: 9, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' } },
                    { binding: 10, visibility: GPUShaderStage.FRAGMENT, texture: { viewDimension: "cube" } },
                    { binding: 11, visibility: GPUShaderStage.FRAGMENT, texture: { viewDimension: "cube" } },
                ],
            });
            this.createBindGroupLayout(ResourceManager.PRESET_VERTEX_GPUBindGroupLayout, {
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                    { binding: 1, visibility: GPUShaderStage.VERTEX, sampler: { type: 'filtering' } },
                    { binding: 2, visibility: GPUShaderStage.VERTEX, texture: {} }
                ],
            });
            this.createBindGroupLayout(ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_SKIN, {
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } },
                    { binding: 1, visibility: GPUShaderStage.VERTEX, sampler: { type: 'filtering' } },
                    { binding: 2, visibility: GPUShaderStage.VERTEX, texture: {} },
                    { binding: 3, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
                ],
            });
            this.createBindGroupLayout(ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing, {
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'read-only-storage' } },
                    { binding: 1, visibility: GPUShaderStage.VERTEX, sampler: { type: 'filtering' } },
                    { binding: 2, visibility: GPUShaderStage.VERTEX, texture: {} }
                ],
            });
        }
    }
    #getTargetMap(key) {
        return this.#resources.get(key);
    }
    #createAndCacheModule(name, gpuShaderModuleDescriptor) {
        const { code } = gpuShaderModuleDescriptor;
        const newCode = preprocessWGSL(code).defaultSource;
        const newModule = this.redGPUContext.gpuDevice.createShaderModule({
            ...gpuShaderModuleDescriptor,
            code: newCode,
        });
        const targetMap = this.#getTargetMap(ResourceType.GPUShaderModule);
        targetMap.set(name, newModule);
        return newModule;
    }
    #getTargetMapAndVerifyName(name, resourceType) {
        if (!name)
            throw new Error('Name is required');
        return this.#getTargetMap(resourceType);
    }
    #createResource(name, descriptor, createFn, resourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        if (targetMap.has(name)) {
            return targetMap.get(name);
        }
        if (!descriptor.label)
            descriptor.label = name;
        const resource = createFn(descriptor);
        targetMap.set(name, resource);
        return resource;
    }
    #getResource(name, resourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        return targetMap.get(name);
    }
    #deleteResource(name, resourceType) {
        const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
        if (!targetMap.has(name)) {
            throw new Error(`${resourceType} with name ${name} doesn't exist.`);
        }
        targetMap.delete(name);
    }
}
Object.freeze(BitmapTexture);
export default ResourceManager;
class ImmutableKeyMap extends Map {
    constructor(initValues = []) {
        super();
        initValues?.forEach(([key, value]) => super.set(key, value));
    }
    set(key, value) {
        if (this.has(key)) {
            throw new Error("Cannot change the value of an existing key");
        }
        else {
            return super.set(key, value);
        }
    }
}
class MemoryTrackingMap extends Map {
    #videoMemory = 0;
    constructor() {
        super();
    }
    get videoMemory() {
        return this.#videoMemory;
    }
    set(key, value) {
        // 기존 값이 있다면 메모리에서 제거
        const videoMemoryKey = (value && 'videoMemorySize' in value) ? 'videoMemorySize'
            : (value && 'size' in value) ? 'size'
                : undefined;
        if (this.has(key)) {
            const existingValue = this.get(key);
            if (existingValue && existingValue[videoMemoryKey]) {
                this.#videoMemory -= existingValue[videoMemoryKey];
            }
        }
        // 새 값의 메모리 추가
        if (value && value) {
            this.#videoMemory += value[videoMemoryKey];
        }
        const result = super.set(key, value);
        return result;
    }
    delete(key) {
        if (this.has(key)) {
            const value = this.get(key);
            const videoMemoryKey = (value && 'videoMemorySize' in value) ? 'videoMemorySize'
                : (value && 'size' in value) ? 'size'
                    : undefined;
            if (value && value[videoMemoryKey]) {
                this.#videoMemory -= value[videoMemoryKey];
            }
        }
        const result = super.delete(key);
        return result;
    }
    clear() {
        this.#videoMemory = 0;
        super.clear();
    }
}
