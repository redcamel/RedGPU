import ColorRGB from "../../color/ColorRGB";
import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../gpuConst/GPU_BLEND_OPERATION";
import FragmentGPURenderInfo from "../../renderInfos/FragmentGPURenderInfo";
import BlendState from "../../renderState/BlendState";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import ResourceBase from "../../resources/ResourceBase";
import ResourceManager from "../../resources/resourceManager/ResourceManager";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import CubeTexture from "../../resources/texture/CubeTexture";
import PackedTexture from "../../resources/texture/PackedTexture";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "./getBindGroupLayoutDescriptorFromShaderInfo";

interface ABaseMaterial {
	opacity: number;
	tint: ColorRGBA;
	useTint: boolean;
}

/**
 * ABitmapBaseMaterial is a class that represents a material with a bitmap texture.
 * @extends ResourceBase
 */
class ABaseMaterial extends ResourceBase {
	gpuRenderInfo: FragmentGPURenderInfo
	dirtyPipeline: boolean = false
	transparent: boolean = false
	#writeMaskState: GPUFlagsConstant = GPUColorWrite.ALL
	readonly #blendColorState: BlendState
	readonly #blendAlphaState: BlendState
	#resourceManager: ResourceManager
	readonly #basicGPUSampler: GPUSampler
	readonly #emptyBitmapGPUTextureView: GPUTextureView
	readonly #emptyCubeTextureView: GPUTextureView
	readonly #FRAGMENT_SHADER_MODULE_NAME: string
	readonly #FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME: string
	readonly #FRAGMENT_BIND_GROUP_LAYOUT_NAME: string
	readonly #SHADER_INFO: any
	readonly #STORAGE_STRUCT: any
	readonly #UNIFORM_STRUCT: any
	readonly #TEXTURE_STRUCT: any
	readonly #SAMPLER_STRUCT: any
	readonly #MODULE_NAME: string
	readonly #bindGroupLayout: GPUBindGroupLayout
	#tintBlendMode: number = TINT_BLEND_MODE.MULTIPLY;

	constructor(
		redGPUContext: RedGPUContext,
		moduleName: string,
		SHADER_INFO: any,
		targetGroupIndex: number
	) {
		super(redGPUContext)
		// console.log('SHADER_INFO', moduleName, SHADER_INFO)
		this.#MODULE_NAME = moduleName
		this.#FRAGMENT_SHADER_MODULE_NAME = `FRAGMENT_MODULE_${this.#MODULE_NAME}`
		this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = `FRAGMENT_BIND_GROUP_DESCRIPTOR_${moduleName}`
		this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME = `FRAGMENT_BIND_GROUP_LAYOUT_${moduleName}`
		this.#SHADER_INFO = SHADER_INFO
		this.#STORAGE_STRUCT = SHADER_INFO?.storage;
		this.#UNIFORM_STRUCT = SHADER_INFO?.uniforms.uniforms;
		this.#TEXTURE_STRUCT = SHADER_INFO?.textures;
		this.#SAMPLER_STRUCT = SHADER_INFO?.samplers;
		this.#bindGroupLayout = redGPUContext.resourceManager.getGPUBindGroupLayout(this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME) || redGPUContext.resourceManager.createBindGroupLayout(
			this.#FRAGMENT_BIND_GROUP_LAYOUT_NAME,
			getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, targetGroupIndex)
		)
		// this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.ONE, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		// this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.ONE, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD)
		this.#resourceManager = redGPUContext.resourceManager
		this.#basicGPUSampler = this.#resourceManager.basicSampler.gpuSampler
		this.#emptyBitmapGPUTextureView = this.#resourceManager.emptyBitmapTextureView
		this.#emptyCubeTextureView = this.#resourceManager.emptyCubeTextureView
	}

	get tintBlendMode(): string {
		const entry = Object.entries(TINT_BLEND_MODE).find(([, value]) => value === this.#tintBlendMode);
		if (!entry) {
			throw new Error(`Invalid tint mode value: ${this.#tintBlendMode}`);
		}
		return entry[0]; // Return the key (e.g., "MULTIPLY")
	}

	set tintBlendMode(value: TINT_BLEND_MODE | keyof typeof TINT_BLEND_MODE) {
		const {fragmentUniformInfo, fragmentUniformBuffer} = this.gpuRenderInfo;
		let valueIdx: number;
		if (typeof value === "string") {
			if (!(value in TINT_BLEND_MODE)) {
				throw new Error(`Invalid tint mode key: ${value}`);
			}
			valueIdx = TINT_BLEND_MODE[value];
		} else if (typeof value === "number" && Object.values(TINT_BLEND_MODE).includes(value)) {
			valueIdx = value;
		} else {
			throw new Error(`Invalid tint mode: ${value}`);
		}
		fragmentUniformBuffer.writeBuffer(fragmentUniformInfo.members.tintBlendMode, valueIdx);
		this.#tintBlendMode = valueIdx;
	}

	get MODULE_NAME(): string {
		return this.#MODULE_NAME;
	}

	get FRAGMENT_SHADER_MODULE_NAME(): string {
		return this.#FRAGMENT_SHADER_MODULE_NAME;
	}

	get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string {
		return this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME;
	}

	get STORAGE_STRUCT(): any {
		return this.#STORAGE_STRUCT;
	}

	get UNIFORM_STRUCT(): any {
		return this.#UNIFORM_STRUCT;
	}

	get blendColorState(): BlendState {
		return this.#blendColorState;
	}

	get blendAlphaState(): BlendState {
		return this.#blendAlphaState;
	}

	get writeMaskState(): GPUFlagsConstant {
		return this.#writeMaskState;
	}

	set writeMaskState(value: GPUFlagsConstant) {
		this.#writeMaskState = value;
	}

	initGPURenderInfos() {
		const {redGPUContext} = this
		const {resourceManager} = redGPUContext
		const shaderModule = resourceManager.createGPUShaderModule(
			this.#FRAGMENT_SHADER_MODULE_NAME,
			{code: this.#SHADER_INFO.shaderSource}
		)
		// 데이터 작성
		const uniformData = new ArrayBuffer(
			Math.max(this.#UNIFORM_STRUCT.arrayBufferByteLength, 16)
		)
		const uniformBuffer = new UniformBuffer(
			redGPUContext,
			uniformData,
			`UniformBuffer_${this.#MODULE_NAME}_${this.uuid}`
		)
		this.gpuRenderInfo = new FragmentGPURenderInfo(
			shaderModule,
			this.#UNIFORM_STRUCT,
			this.#bindGroupLayout,
			uniformBuffer,
			null,
			null,
		)
		this._updateBaseProperty()
		this._updateFragmentState()
	}

	_updateFragmentState() {
		const {gpuDevice} = this.redGPUContext
		const entries: GPUBindGroupEntry[] = []
		// for (const k in this.#storageInfo) {
		// 	const info = this.#storageInfo[k]
		// 	const {binding, name} = info
		// 	entries.push(
		// 		{
		// 			binding: binding,
		// 			resource: name === 'outputTexture' ? targetOutputView : sourceTextureView[binding],
		// 		}
		// 	)
		// }
		for (const k in this.#TEXTURE_STRUCT) {
			const info = this.#TEXTURE_STRUCT[k]
			const {binding, name, group, type} = info
			const {name: textureType} = type
			console.log(this, name, this[name])
			let resource
			if (textureType === 'texture_cube') resource = this.getGPUResourceCubeTextureView(this[name])
			else if (this[name] instanceof PackedTexture) {
				if (this[name].gpuTexture) resource = this[name].gpuTexture.createView({})
				else resource = this.#emptyBitmapGPUTextureView
			} else {
				resource = this.getGPUResourceBitmapTextureView(this[name]) || this.#emptyBitmapGPUTextureView
			}
			if (group === 2) {
				entries.push(
					{
						binding: binding,
						resource
					}
				)
			}
		}
		for (const k in this.#SAMPLER_STRUCT) {
			const info = this.#SAMPLER_STRUCT[k]
			const {binding, name, group} = info
			if (group === 2) {
				entries.push(
					{
						binding: binding,
						resource: this.getGPUResourceSampler(this[name]),
					}
				)
			}
		}
		if (this.#UNIFORM_STRUCT) {
			entries.push(
				{
					binding: this.#UNIFORM_STRUCT.binding,
					resource: {
						buffer: this.gpuRenderInfo.fragmentUniformBuffer.gpuBuffer,
						offset: 0,
						size: this.gpuRenderInfo.fragmentUniformBuffer.size
					},
				}
			)
		}
		const bindGroupDescriptor: GPUBindGroupDescriptor = {
			layout: this.gpuRenderInfo.fragmentBindGroupLayout,
			label: this.#FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
			entries
		}
		const fragmentUniformBindGroup: GPUBindGroup = gpuDevice.createBindGroup(bindGroupDescriptor)
		this.gpuRenderInfo.fragmentState = this.getFragmentRenderState()
		this.gpuRenderInfo.fragmentUniformBindGroup = fragmentUniformBindGroup
	}

	getFragmentRenderState(entryPoint: string = 'main'): GPUFragmentState {
		return {
			module: this.gpuRenderInfo.fragmentShaderModule,
			entryPoint,
			targets: [
				{
					format: navigator.gpu.getPreferredCanvasFormat(),
					blend: {
						color: this.blendColorState.state,
						alpha: this.blendAlphaState.state
					},
					writeMask: this.writeMaskState,
				}
			]
		}
	}

	_updateBaseProperty() {
		const {fragmentUniformInfo, fragmentUniformBuffer} = this.gpuRenderInfo
		const {members} = fragmentUniformInfo
		for (const k in members) {
			const property = this[k]
			if (property instanceof ColorRGBA) {
				fragmentUniformBuffer.writeBuffer(fragmentUniformInfo.members[k], property.rgbaNormal)
			} else if (property instanceof ColorRGB) {
				fragmentUniformBuffer.writeBuffer(fragmentUniformInfo.members[k], property.rgbNormal)
			} else {
				if (!pattern.test(k)) this[k] = property
			}
		}
	}

	getGPUResourceBitmapTextureView(texture: BitmapTexture) {
		return texture?.gpuTexture?.createView({label: texture.src}) || this.#emptyBitmapGPUTextureView
	}

	getGPUResourceCubeTextureView(cubeTexture: CubeTexture, viewDescriptor?: GPUTextureViewDescriptor) {
		return cubeTexture?.gpuTexture?.createView(viewDescriptor || cubeTexture.viewDescriptor || CubeTexture.defaultViewDescriptor) || this.#emptyCubeTextureView
	}

	getGPUResourceSampler(sampler: Sampler) {
		return sampler?.gpuSampler || this.#basicGPUSampler
	}
}

const pattern = /^use\w+Texture$/;
DefineForFragment.defineByPreset(ABaseMaterial, [
	DefineForFragment.PRESET_POSITIVE_NUMBER.OPACITY,
])
DefineForFragment.defineBoolean(ABaseMaterial, [
	['useTint', false]
])
DefineForFragment.defineColorRGBA(ABaseMaterial, [
	'tint', '#ff0000'
])
Object.freeze(ABaseMaterial)
export default ABaseMaterial
