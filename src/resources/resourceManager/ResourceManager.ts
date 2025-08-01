import RedGPUContext from "../../context/RedGPUContext";
import {keepLog} from "../../utils";
import ManagementResourceBase from "../ManagementResourceBase";
import Sampler from "../sampler/Sampler";
import BitmapTexture from "../texture/BitmapTexture";
import DownSampleCubeMapGenerator from "../texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator";
import MipmapGenerator from "../texture/core/mipmapGenerator/MipmapGenerator";
import CubeTexture from "../texture/CubeTexture";
import IBLCubeTexture from "../texture/ibl/IBLCubeTexture";
import PackedTexture from "../texture/packedTexture/PackedTexture";
import preprocessWGSL from "../wgslParser/preprocessWGSL";
import ResourceStateIndexBuffer from "./resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "./resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "./resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "./resourceState/ResourceStateVertexBuffer";
import ResourceStatusInfo from "./resourceState/ResourceStatusInfo";
import ResourceStateBitmapTexture from "./resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture from "./resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture from "./resourceState/texture/ResourceStateHDRTexture";

enum ResourceType {
	GPUShaderModule = 'GPUShaderModule',
	GPUBindGroupLayout = 'GPUBindGroupLayout',
	GPUPipelineLayout = 'GPUPipelineLayout',
	GPUBuffer = 'GPUBuffer',
}

type ResourceState = ResourceStateVertexBuffer
	| ResourceStateIndexBuffer
	| ResourceStateUniformBuffer
	| ResourceStateStorageBuffer
	| ResourceStateCubeTexture
	| ResourceStateBitmapTexture
	| ResourceStateHDRTexture;

class ResourceManager {
	static PRESET_GPUBindGroupLayout_System = 'PRESET_GPUBindGroupLayout_System'
	static PRESET_VERTEX_GPUBindGroupLayout_Instancing = 'PRESET_VERTEX_GPUBindGroupLayout_Instancing'
	static PRESET_VERTEX_GPUBindGroupLayout = 'PRESET_VERTEX_GPUBindGroupLayout'
	static PRESET_VERTEX_GPUBindGroupLayout_SKIN = 'PRESET_VERTEX_GPUBindGroupLayout_SKIN'
	#gpuBufferVideoMemory: number = 0;
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
	readonly #mipmapGenerator: MipmapGenerator
	readonly #downSampleCubeMapGenerator: DownSampleCubeMapGenerator
	#basicSampler: Sampler
	#bitmapTextureViewCache: WeakMap<GPUTexture, Map<string, GPUTextureView>> = new WeakMap();
	#cubeTextureViewCache: WeakMap<GPUTexture, Map<string, GPUTextureView>> = new WeakMap();
	readonly #redGPUContext: RedGPUContext
	readonly #gpuDevice: GPUDevice

	constructor(redGPUContext: RedGPUContext) {
		this.#redGPUContext = redGPUContext
		this.#gpuDevice = redGPUContext.gpuDevice
		this.#mipmapGenerator = new MipmapGenerator(redGPUContext)
		this.#downSampleCubeMapGenerator = new DownSampleCubeMapGenerator(redGPUContext)
		this.#initPresets()
	}

	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext
	}

	get gpuDevice(): GPUDevice {
		return this.#gpuDevice
	}

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

	createManagedTexture(desc: GPUTextureDescriptor): GPUTexture {
		const texture = this.gpuDevice.createTexture(desc);
		const originalDestroy = texture.destroy.bind(texture);
		texture.destroy = () => {
			this.#clearTextureCache(texture, desc);
			originalDestroy();
		};
		return texture;
	}

	#clearTextureCache(texture: GPUTexture, desc: GPUTextureDescriptor) {
		const cache = desc.dimension === '3d' ?
			this.#cubeTextureViewCache :
			this.#bitmapTextureViewCache;
		cache.get(texture)?.clear();
		if (cache.delete(texture)) {
			const type = desc.dimension === '3d' ? '🧊 큐브' : '🔷 비트맵';
			keepLog(`${type} 텍스처 뷰 캐시 정리:`, texture.label);
		}
	}

	#createDescriptorKey(viewDescriptor?: GPUTextureViewDescriptor): string {
		return viewDescriptor ? JSON.stringify(viewDescriptor) : 'default';
	}

	getGPUResourceBitmapTextureView(
		texture: BitmapTexture | PackedTexture | GPUTexture,
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
			console.log('🎯 비트맵 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
		}
		return cachedView;
	}

	getGPUResourceCubeTextureView(
		cubeTexture: CubeTexture | GPUTexture | IBLCubeTexture,
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
		if(!(cubeTexture instanceof GPUTexture ) && !viewDescriptor) viewDescriptor = cubeTexture.viewDescriptor;
		const effectiveDescriptor = viewDescriptor ||  CubeTexture.defaultViewDescriptor;

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
			console.log('🎯 큐브 텍스처 뷰 캐시 히트:', targetGPUTexture.label, cacheKey);
		}
		return cachedView;
	}

	get basicSampler(): Sampler {
		return this.#basicSampler;
	}

	get mipmapGenerator(): MipmapGenerator {
		return this.#mipmapGenerator;
	}

	get downSampleCubeMapGenerator(): DownSampleCubeMapGenerator {
		return this.#downSampleCubeMapGenerator
	}

	get cachedBufferState(): any {
		return this.#cachedBufferState;
	}

	get emptyBitmapTextureView(): GPUTextureView {
		return this.#emptyBitmapTextureView;
	}

	get emptyCubeTextureView(): GPUTextureView {
		return this.#emptyCubeTextureView;
	}

	get managedBitmapTextureState(): ResourceStatusInfo {
		return this.#managedBitmapTextureState;
	}

	get managedCubeTextureState(): ResourceStatusInfo {
		return this.#managedCubeTextureState;
	}

	get managedHDRTextureState(): ResourceStatusInfo {
		return this.#managedHDRTextureState;
	}

	get managedUniformBufferState(): ResourceStatusInfo {
		return this.#managedUniformBufferState;
	}

	get managedVertexBufferState(): ResourceStatusInfo {
		return this.#managedVertexBufferState;
	}

	get managedIndexBufferState(): ResourceStatusInfo {
		return this.#managedIndexBufferState;
	}

	get managedStorageBufferState(): ResourceStatusInfo {
		return this.#managedStorageBufferState;
	}

	get resources(): ImmutableKeyMap {
		return this.#resources;
	}

	createGPUShaderModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor) {
		return this.#createResource(name, gpuShaderModuleDescriptor,
			descriptor => this.#createAndCacheModule(name, descriptor),
			ResourceType.GPUShaderModule);
	}

	getGPUShaderModule(name: string): GPUShaderModule {
		return this.#getResource(name, ResourceType.GPUShaderModule);
	}

	deleteGPUShaderModule(name: string) {
		this.#deleteResource(name, ResourceType.GPUShaderModule);
	}

	createBindGroupLayout(name: string, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
		return this.#createResource(name, bindGroupLayoutDescriptor,
			descriptor => {
				if (!descriptor.label) descriptor.label = name;
				return this.redGPUContext.gpuDevice.createBindGroupLayout(descriptor);
			}, ResourceType.GPUBindGroupLayout);
	}

	getGPUBindGroupLayout(name: string): GPUBindGroupLayout {
		return this.#getResource(name, ResourceType.GPUBindGroupLayout);
	}

	deleteGPUBindGroupLayout(name: string) {
		this.#deleteResource(name, ResourceType.GPUBindGroupLayout);
	}

	createGPUPipelineLayout(name: string, gpuPipelineLayoutDescriptor: GPUPipelineLayoutDescriptor) {
		return this.#createResource(name, gpuPipelineLayoutDescriptor,
			descriptor => {
				if (!descriptor.label) descriptor.label = name;
				return this.redGPUContext.gpuDevice.createPipelineLayout(descriptor);
			}, ResourceType.GPUPipelineLayout);
	}

	createGPUBuffer(name: string, gpuBufferDescriptor: GPUBufferDescriptor) {
		return this.#createResource(name, gpuBufferDescriptor,
			descriptor => {
				if (!descriptor.label) descriptor.label = name;
				return this.gpuDevice.createBuffer(descriptor);
			}, ResourceType.GPUBuffer);
	}

	#initPresets() {
		const {gpuDevice} = this.redGPUContext
		{
			const emptyBitmapTexture = gpuDevice.createTexture({
				size: {width: 1, height: 1, depthOrArrayLayers: 1},
				format: 'rgba8unorm',
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
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
			this.#basicSampler = new Sampler(this.redGPUContext)
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
				ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_SKIN,
				{
					entries: [
						{binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
						{binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
						{binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}},
						{binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
					],
				}
			)
			this.createBindGroupLayout(
				ResourceManager.PRESET_VERTEX_GPUBindGroupLayout_Instancing,
				{
					entries: [
						{binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
						{binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
						{binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}}
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
		const newCode = preprocessWGSL(code).defaultSource
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

Object.freeze(BitmapTexture)
export default ResourceManager

class ImmutableKeyMap extends Map {
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
			this.#videoMemory += (value as any)[videoMemoryKey];
		}
		const result = super.set(key, value);
		return result;
	}

	delete(key: K): boolean {
		if (this.has(key)) {
			const value = this.get(key) as any;
			const videoMemoryKey =
				(value && 'videoMemorySize' in (value as any)) ? 'videoMemorySize'
					: (value && 'size' in (value as any)) ? 'size'
						: undefined;
			if (value && value[videoMemoryKey]) {
				this.#videoMemory -= value[videoMemoryKey];
			}
		}
		const result = super.delete(key);
		return result;
	}

	clear(): void {
		this.#videoMemory = 0;
		super.clear();
	}

	get videoMemory(): number {
		return this.#videoMemory;
	}
}
