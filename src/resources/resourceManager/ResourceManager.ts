import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "../ResourceBase";
import Sampler from "../sampler/Sampler";
import BitmapTexture from "../texture/BitmapTexture";
import MipmapGenerator from "../texture/core/mipmapGenerator/MipmapGenerator";
import CubeTexture from "../texture/CubeTexture";
import preprocessWGSL from "../wgslParser/preprocessWGSL";
import ResourceState from "./resourceState/ResourceState";

// Resource types
/**
 * Represents a resource type in a GPU.
 * @enum {string}
 * @typedef {('GPUShaderModule' | 'GPUBindGroupLayout' | 'GPUPipelineLayout')} ResourceType
 */
enum ResourceType {
	GPUShaderModule = 'GPUShaderModule',
	GPUBindGroupLayout = 'GPUBindGroupLayout',
	GPUPipelineLayout = 'GPUPipelineLayout',
}

/**
 * Class representing a resource manager.
 *
 * @class
 * @extends ResourceBase
 */
class ResourceManager extends ResourceBase {
	static PRESET_GPUBindGroupLayout_System = 'PRESET_GPUBindGroupLayout_System'
	static PRESET_VERTEX_GPUBindGroupLayout_Instancing = 'PRESET_VERTEX_GPUBindGroupLayout_Instancing'
	static PRESET_VERTEX_GPUBindGroupLayout = 'PRESET_VERTEX_GPUBindGroupLayout'
	static PRESET_VERTEX_GPUBindGroupLayout_SKIN = 'PRESET_VERTEX_GPUBindGroupLayout_SKIN'
	/**
	 * Represents a collection of resources for a GPU application.
	 * @typedef {Object} Resources
	 * @property {ImmutableKeyMap} resources - A map containing different types of resources.
	 */
	#resources = new ImmutableKeyMap([
		[ResourceType.GPUShaderModule, new Map()],
		[ResourceType.GPUBindGroupLayout, new Map()],
		[ResourceType.GPUPipelineLayout, new Map()],
	])
	#managedBitmapTextureState: ResourceState = new ResourceState()
	#managedCubeTextureState: ResourceState = new ResourceState()
	#managedHDRTextureState: ResourceState = new ResourceState()
	#managedUniformBufferState: ResourceState = new ResourceState()
	#managedVertexBufferState: ResourceState = new ResourceState()
	#managedIndexBufferState: ResourceState = new ResourceState()
	#managedStorageBufferState: ResourceState = new ResourceState()
	#cachedBufferState: any = {}
	#emptyBitmapTextureView: GPUTextureView
	#emptyCubeTextureView: GPUTextureView
	readonly #mipmapGenerator: MipmapGenerator
	#basicSampler: Sampler

	/**
	 * Create a new instance of the constructor.
	 *
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext object used for initialization.
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext)
		this.#mipmapGenerator = new MipmapGenerator(redGPUContext)
		this.#initPresets()
	}

	get basicSampler(): Sampler {
		return this.#basicSampler;
	}

	get mipmapGenerator(): MipmapGenerator {
		return this.#mipmapGenerator;
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

	get managedBitmapTextureState(): ResourceState {
		return this.#managedBitmapTextureState;
	}

	get managedCubeTextureState(): ResourceState {
		return this.#managedCubeTextureState;
	}

	get managedHDRTextureState(): ResourceState {
		return this.#managedHDRTextureState;
	}

	get managedUniformBufferState(): ResourceState {
		return this.#managedUniformBufferState;
	}

	get managedVertexBufferState(): ResourceState {
		return this.#managedVertexBufferState;
	}

	get managedIndexBufferState(): ResourceState {
		return this.#managedIndexBufferState;
	}

	get managedStorageBufferState(): ResourceState {
		return this.#managedStorageBufferState;
	}

	/**
	 * Returns the resources as an ImmutableKeyMap.
	 * @returns {ImmutableKeyMap} The resources.
	 */
	get resources(): ImmutableKeyMap {
		return this.#resources;
	}

	/**
	 * Creates a GPU shader module with the specified name and descriptor.
	 *
	 * @param {string} name - The name of the GPU shader module.
	 * @param {GPUShaderModuleDescriptor} gpuShaderModuleDescriptor - The descriptor for the GPU shader module.
	 *
	 * @return {Promise<GPUShaderModule>} A Promise that resolves to the created GPU shader module.
	 */
	createGPUShaderModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor) {
		return this.#createResource(name, gpuShaderModuleDescriptor,
			descriptor => this.#createAndCacheModule(name, descriptor),
			ResourceType.GPUShaderModule);
	}

	/**
	 * Retrieves a GPU shader module by its name.
	 *
	 * @param {string} name - The name of the shader module.
	 *
	 * @return {GPUShaderModule} - The requested GPU shader module.
	 */
	getGPUShaderModule(name: string): GPUShaderModule {
		return this.#getResource(name, ResourceType.GPUShaderModule);
	}

	/**
	 * Deletes a GPU shader module.
	 *
	 * @param {string} name - The name of the shader module to delete.
	 */
	deleteGPUShaderModule(name: string) {
		this.#deleteResource(name, ResourceType.GPUShaderModule);
	}

	/**
	 * Create a bind group layout.
	 *
	 * @param {string} name - The name of the bind group layout.
	 * @param {GPUBindGroupLayoutDescriptor} bindGroupLayoutDescriptor - The descriptor for the bind group layout.
	 * @return {GPUBindGroupLayout} - The created bind group layout.
	 */
	createBindGroupLayout(name: string, bindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
		return this.#createResource(name, bindGroupLayoutDescriptor,
			descriptor => {
				if (!descriptor.label) descriptor.label = name;
				return this.redGPUContext.gpuDevice.createBindGroupLayout(descriptor);
			}, ResourceType.GPUBindGroupLayout);
	}

	/**
	 * Retrieves the GPU bind group layout with the specified name.
	 *
	 * @param {string} name - The name of the GPU bind group layout.
	 *
	 * @return {GPUBindGroupLayout} - The GPU bind group layout object.
	 */
	getGPUBindGroupLayout(name: string): GPUBindGroupLayout {
		return this.#getResource(name, ResourceType.GPUBindGroupLayout);
	}

	/**
	 * Deletes the GPU bind group layout with the given name.
	 *
	 * @param {string} name - The name of the GPU bind group layout to delete.
	 *
	 */
	deleteGPUBindGroupLayout(name: string) {
		this.#deleteResource(name, ResourceType.GPUBindGroupLayout);
	}

	/**
	 * Creates a GPU pipeline layout with the given name and descriptor.
	 *
	 * @param {string} name - The name of the GPU pipeline layout.
	 * @param {GPUPipelineLayoutDescriptor} gpuPipelineLayoutDescriptor - The descriptor for the GPU pipeline layout.
	 *
	 * @return {GPUPipelineLayout} - The created GPU pipeline layout.
	 */

	createGPUPipelineLayout(name: string, gpuPipelineLayoutDescriptor: GPUPipelineLayoutDescriptor) {
		return this.#createResource(name, gpuPipelineLayoutDescriptor,
			descriptor => {
				if (!descriptor.label) descriptor.label = name;
				return this.redGPUContext.gpuDevice.createPipelineLayout(descriptor);
			}, ResourceType.GPUPipelineLayout);
	}

	getGPUPipelineLayout(name: string) {
		return this.#getResource(name, ResourceType.GPUPipelineLayout);
	}

	/** Deletes the GPU pipeline layout with the given name.
	 *
	 * @param {string} name - The name of the GPU pipeline layout to delete.
	 *
	 * @return {void}
	 */
	deleteGPUPipelineLayout(name: string) {
		this.#deleteResource(name, ResourceType.GPUPipelineLayout);
	}

	#initPresets() {
		const {gpuDevice} = this.redGPUContext
		{
			// 1x1 투명 텍스처 생성 (싱글 레이어)
			const emptyBitmapTexture = gpuDevice.createTexture({
				size: {width: 1, height: 1, depthOrArrayLayers: 1},
				format: 'rgba8unorm', // RGBA 포맷으로 변경 (r8unorm은 단일 채널 미지원)
				usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, // 데이터 복사 가능하도록 COPY_DST 추가
				label: 'emptyBitmapTexture',
			});
			this.#emptyBitmapTextureView = emptyBitmapTexture.createView({label: emptyBitmapTexture.label}); // 뷰 생성
			const transparentPixel = new Uint8Array([0, 0, 0, 0]); // 투명 RGBA (1x1)
			// 텍스처 초기화
			gpuDevice.queue.writeTexture(
				{texture: emptyBitmapTexture}, // 텍스처 자체를 대상으로
				transparentPixel, // 업로드할 데이터
				{bytesPerRow: 4, rowsPerImage: 1}, // 데이터 레이아웃
				{width: 1, height: 1, depthOrArrayLayers: 1} // 텍스처 크기
			);
			// 1x1 투명 큐브 텍스처 생성 (6개 레이어)
			const emptyCubeTexture = gpuDevice.createTexture({
				size: {width: 1, height: 1, depthOrArrayLayers: 6}, // 6 레이어로 구성된 큐브 맵
				format: 'rgba8unorm', // 큐브 맵도 RGBA 포맷 사용
				usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST, // 복사 가능하도록 COPY_DST 포함
				label: 'emptyCubeTexture',
			});
			this.#emptyCubeTextureView = emptyCubeTexture.createView(CubeTexture.defaultViewDescriptor); // 뷰 생성
			// 각 큐브 면 초기화 데이터 (RGBA)
			const cubeTransparentPixels = new Uint8Array([0, 0, 0, 0]); // 동일한 데이터를 사용할 경우 1x1 픽셀만 필요
			// 각 큐브 맵의 6면 초기화
			for (let i = 0; i < 6; i++) {
				gpuDevice.queue.writeTexture(
					{texture: emptyCubeTexture, origin: {x: 0, y: 0, z: i}}, // 해당 레이어 선택
					cubeTransparentPixels, // 각 레이어에 동일한 데이터 업로드
					{bytesPerRow: 4, rowsPerImage: 1}, // 데이터 레이아웃
					{width: 1, height: 1, depthOrArrayLayers: 1} // 크기 설정
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

	/**
	 * Retrieves the target map associated with a given resource type key.
	 *
	 * @param {ResourceType} key - The resource type key.
	 * @returns {Map} - The target map associated with the resource type key.
	 */
	#getTargetMap(key: ResourceType) {
		return this.#resources.get(key);
	}

	/**
	 * Creates a GPU shader module and caches it with the specified name.
	 *
	 * @param {string} name - The name for caching the shader module.
	 * @param {GPUShaderModuleDescriptor} gpuShaderModuleDescriptor - The descriptor object for creating the shader module.
	 * @return {GPUShaderModule} The created GPU shader module.
	 */
	#createAndCacheModule(name: string, gpuShaderModuleDescriptor: GPUShaderModuleDescriptor) {
		const {code} = gpuShaderModuleDescriptor
		const newCode = preprocessWGSL(code).defaultSource
		///
		const newModule: GPUShaderModule = this.redGPUContext.gpuDevice.createShaderModule({
			...gpuShaderModuleDescriptor,
			code: newCode,
		})
		const targetMap = this.#getTargetMap(ResourceType.GPUShaderModule);
		targetMap.set(name, newModule)
		return newModule
	}

	/**
	 * Retrieves the target map and verifies the given name for a specific resource type.
	 *
	 * @param {string} name - The name to verify.
	 * @param {ResourceType} resourceType - The type of the resource.
	 *
	 * @returns {ImmutableKeyMap} - The target map associated with the resource type.
	 *
	 * @throws {Error} If the name parameter is empty.
	 */
	#getTargetMapAndVerifyName(name: string, resourceType: ResourceType): ImmutableKeyMap {
		if (!name) throw new Error('Name is required');
		return this.#getTargetMap(resourceType);
	}

	/**
	 * Create a resource with the given name, descriptor, create function, and resource type.
	 *
	 * @param {string} name - The name of the resource.
	 * @param {any} descriptor - The descriptor of the resource.
	 * @param {Function} createFn - The function used to create the resource.
	 * @param {ResourceType} resourceType - The type of the resource.
	 * @returns {any} - The created resource.
	 */
	#createResource(name: string, descriptor: any, createFn: Function, resourceType: ResourceType) {
		const targetMap = this.#getTargetMapAndVerifyName(name, resourceType);
		if (targetMap.has(name)) {
			// console.log(`::: ${resourceType} with name ${name} already exists. Use a cached Resource.`, targetMap.get(name));
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

	/**
	 * Deletes a resource with the given name and resource type.
	 *
	 * @param {string} name - The name of the resource to be deleted.
	 * @param {ResourceType} resourceType - The type of the resource to be deleted.
	 * @throws {Error} If the resource with the given name doesn't exist.
	 */
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

/**
 * @class ImmutableKeyMap
 * @extends Map
 *
 * @classdesc
 * A class that represents an immutable key-value map.
 * Once a key-value pair is set, it cannot be changed or removed.
 *
 * @constructor
 * @param {Array<[any, any]>} [initValues=[]] - An array of initial key-value pairs to initialize the map with.
 */
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
