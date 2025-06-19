import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import createUUID from "../../../../utils/createUUID";
import UniformBuffer from "../../../buffer/uniformBuffer/UniformBuffer";
import ManagedResourceBase from "../../../ManagedResourceBase";
import basicRegisterResource from "../../../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../../../resourceManager/core/basicUnregisterResource";
import ResourceStateBitmapTexture from "../../../resourceManager/resourceState/ResourceStateBitmapTexture";
import parseWGSL from "../../../wgslParser/parseWGSL";
import NOISE_DIMENSION from "../NOISE_DIMENSION";
import noiseBaseFunctions from './compute.wgsl';

const validDimensions = Object.values(NOISE_DIMENSION) as number[];
const MANAGED_STATE_KEY = 'managedBitmapTextureState';

export interface NoiseDefine {
	mainLogic: string;
	uniformStruct: string;
	uniformDefaults: {};
	helperFunctions?: string;
}

const BASIC_OPTIONS = {
	frequency: 8.0,
	amplitude: 1.0,
	octaves: 1,
	persistence: 0.5,
	lacunarity: 2.0,
	seed: 0.0,
	noiseDimension: NOISE_DIMENSION.MODE_2D,
	animationDirectionX:1,
	animationDirectionY:1
}

class ANoiseTexture extends ManagedResourceBase {
	cacheKey;
//
	mipLevelCount;
	videoMemorySize;
	useMipmap;
	src;
	#gpuTexture: GPUTexture;
	#COMPUTE_WORKGROUP_SIZE_X = 8;
	#COMPUTE_WORKGROUP_SIZE_Y = 8;
	#COMPUTE_WORKGROUP_SIZE_Z = 1;
	#textureComputeShaderModule: GPUShaderModule;
	#textureComputeBindGroup: GPUBindGroup;
	#textureComputeBindGroupLayout: GPUBindGroupLayout;
	#textureComputePipeline: GPUComputePipeline;
	#uniformBuffer: UniformBuffer;
	#uniformInfo: any;
	#width: number;
	#height: number;
	#currentEffect: NoiseDefine;
	///
	#frequency: number = BASIC_OPTIONS.frequency;      /* 노이즈 패턴의 밀도/크기 (값이 클수록 세밀함) */
	#amplitude: number = BASIC_OPTIONS.amplitude;      /* 노이즈의 강도/대비 (값이 클수록 명암 대비 강함) */
	#octaves: number = BASIC_OPTIONS.octaves;          /* 합성할 노이즈 레이어 개수 (값이 클수록 복잡한 디테일) */
	#persistence: number = BASIC_OPTIONS.persistence;    /* 각 옥타브마다 진폭 감소 비율 (값이 클수록 거친 디테일) */
	#lacunarity: number = BASIC_OPTIONS.lacunarity;     /* 각 옥타브마다 주파수 증가 비율 (값이 클수록 극명한 대비) */
	#seed: number = BASIC_OPTIONS.seed;           /* 노이즈 패턴의 시작점 (같은 시드 = 같은 패턴) */
	#noiseDimension: number = BASIC_OPTIONS.noiseDimension
	//
	#time:number=0
	#animationDirectionX:number=BASIC_OPTIONS.animationDirectionX
	#animationDirectionY:number=BASIC_OPTIONS.animationDirectionY

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		effect: NoiseDefine
	) {
		super(redGPUContext, MANAGED_STATE_KEY);
		validateUintRange(width, 2, 2048);
		validateUintRange(height, 2, 2048);
		this.#width = width;
		this.#height = height;
		this.#currentEffect = effect;
		this.#init(redGPUContext);
		this.#gpuTexture = this.#createStorageTexture(redGPUContext, width, height);
		this.#executeComputePass();
		this.#registerResource();
	}

	get uniformInfo(): any {
		return this.#uniformInfo;
	}

	get gpuTexture(): GPUTexture {
		return this.#gpuTexture;
	}

	/* 개별 파라미터 업데이트 */
	updateUniform(name: string, value: any) {
		if (this.#uniformInfo.members[name]) {
			this.#uniformBuffer.writeBuffer(this.#uniformInfo.members[name], value);
			this.#currentEffect[name] = value
		}
		this.#executeComputePass();
	}

	/* 여러 파라미터 일괄 업데이트 */
	updateUniforms(uniforms: Record<string, any>) {
		Object.entries(uniforms).forEach(([name, value]) => {
			if (this.#uniformInfo.members[name]) {
				this.#uniformBuffer.writeBuffer(this.#uniformInfo.members[name], value);
				this.#currentEffect[name] = value
			}
		});
		this.#executeComputePass();
	}

	get time(): number {
		return this.#time;
	}

	set time(value: number) {
		validatePositiveNumberRange(value);
		this.#time = value;
		this.updateUniform('time', value);
	}

	get animationDirectionX(): number {
		return this.#animationDirectionX;
	}

	set animationDirectionX(value: number) {
		validateNumber(value);
		this.#animationDirectionX = value;
		this.updateUniform('animationDirectionX', value);
	}

	get animationDirectionY(): number {
		return this.#animationDirectionY;
	}

	set animationDirectionY(value: number) {
		validateNumber(value);
		this.#animationDirectionY = value;
		this.updateUniform('animationDirectionY', value);
	}

	/* 렌더링 */
	render(time: number) {
		this.updateUniform('time', time);
		this.#executeComputePass();
	}

	#init(redGPUContext: RedGPUContext) {
		const {gpuDevice} = redGPUContext;
		const textureComputeShader = this.#generateShader();
		this.cacheKey = createUUID()
		this.#textureComputeShaderModule = gpuDevice.createShaderModule({
			code: textureComputeShader,
		});
		this.#textureComputeBindGroupLayout = this.#createTextureBindGroupLayout(redGPUContext);
		this.#textureComputePipeline = this.#createTextureComputePipeline(
			gpuDevice,
			this.#textureComputeShaderModule,
			this.#textureComputeBindGroupLayout
		);
		const SHADER_INFO = parseWGSL(textureComputeShader);
		this.#uniformInfo = SHADER_INFO.uniforms.uniforms;
		const uniformData = new ArrayBuffer(this.#uniformInfo.arrayBufferByteLength);
		this.#uniformBuffer = new UniformBuffer(
			redGPUContext,
			uniformData,
			`${this.constructor.name}_UniformBuffer`,
		);
		/* 기본값 설정 */
		if (this.#currentEffect.uniformDefaults) {
			this.updateUniforms({
				...BASIC_OPTIONS,
				...this.#currentEffect.uniformDefaults
			});
		}
	}

	#generateShader(): string {
		const baseUniforms = `
            struct Uniforms {
                time: f32,
                noiseDimension : f32,
                animationDirectionX: f32,
                animationDirectionY: f32,
								frequency: f32,
								amplitude: f32,
								octaves: i32,
								persistence: f32,
								lacunarity: f32,
								seed: f32,
                ${this.#currentEffect.uniformStruct || ''}
            };
        `;
		const helperFunctions = this.#currentEffect.helperFunctions || '';
		return `
            ${baseUniforms}
            @group(0) @binding(0) var<uniform> uniforms : Uniforms;
            @group(0) @binding(1) var outputTexture : texture_storage_2d<rgba8unorm, write>;
            
            ${noiseBaseFunctions}
            ${helperFunctions}
            @compute @workgroup_size(${this.#COMPUTE_WORKGROUP_SIZE_X},${this.#COMPUTE_WORKGROUP_SIZE_Y},${this.#COMPUTE_WORKGROUP_SIZE_Z})
            fn main (
              @builtin(global_invocation_id) global_id : vec3<u32>,
            ){
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(outputTexture);
                
                /* 경계 체크 */
                if (index.x >= dimensions.x || index.y >= dimensions.y) {
                    return;
                }
                
                let dimW = f32(dimensions.x);
                let dimH = f32(dimensions.y);
                let base_uv = vec2<f32>((f32(index.x) + 0.5) / dimW, (f32(index.y) + 0.5) / dimH);
                
              
let uv = base_uv + vec2<f32>(uniforms.time * 0.001 * uniforms.animationDirectionX, uniforms.time * 0.001 * uniforms.animationDirectionY) * 0.1;
                ${this.#currentEffect.mainLogic}
                
                textureStore(outputTexture, index, color);
            }
        `;
	}

	#executeComputePass() {
		if (!this.#textureComputeBindGroup) return
		const commandEncoder = this.redGPUContext.gpuDevice.createCommandEncoder();
		const computePassEncoder = commandEncoder.beginComputePass();
		computePassEncoder.setPipeline(this.#textureComputePipeline);
		computePassEncoder.setBindGroup(0, this.#textureComputeBindGroup);
		computePassEncoder.dispatchWorkgroups(
			Math.ceil(this.#width / this.#COMPUTE_WORKGROUP_SIZE_X),
			Math.ceil(this.#height / this.#COMPUTE_WORKGROUP_SIZE_Y)
		);
		computePassEncoder.end();
		this.redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()]);
	}

	#createTextureBindGroupLayout(redGPUContext: RedGPUContext) {
		return redGPUContext.resourceManager.createBindGroupLayout('NoiseTextureBindGroupLayout', {
			entries: [
				{binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
				{binding: 1, visibility: GPUShaderStage.COMPUTE, storageTexture: {format: 'rgba8unorm'}},
			]
		});
	}

	#createStorageTexture(redGPUContext: RedGPUContext, width: number, height: number) {
		const storageTexture = redGPUContext.gpuDevice.createTexture({
			size: {width: width, height: height},
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
			label: `NoiseTexture_${width}x${height}_${Date.now()}`,
		});
		const storageTextureView = storageTexture.createView();
		this.#textureComputeBindGroup = this.#createTextureBindGroup(
			redGPUContext,
			this.#textureComputeBindGroupLayout,
			storageTextureView,
		);
		return storageTexture;
	}

	#createTextureBindGroup(redGPUContext: RedGPUContext, bindGroupLayout: GPUBindGroupLayout, storageTextureView: GPUTextureView) {
		return redGPUContext.gpuDevice.createBindGroup({
			layout: bindGroupLayout,
			entries: [
				{
					binding: 0,
					resource: {
						buffer: this.#uniformBuffer.gpuBuffer,
						offset: 0,
						size: this.#uniformBuffer.gpuBuffer.size
					}
				},
				{binding: 1, resource: storageTextureView},
			]
		});
	}

	#createTextureComputePipeline(gpuDevice: GPUDevice, shaderModule: GPUShaderModule, bindGroupLayout: GPUBindGroupLayout) {
		return gpuDevice.createComputePipeline({
			layout: gpuDevice.createPipelineLayout({
				bindGroupLayouts: [bindGroupLayout]
			}),
			compute: {
				module: shaderModule,
				entryPoint: 'main',
			}
		});
	}

	get noiseDimension(): number {
		return this.#noiseDimension;
	}

	set noiseDimension(value: number) {
		if (validDimensions.includes(value)) {
			this.#noiseDimension = value;
			this.updateUniform('noiseDimension', value);
		} else {
			consoleAndThrowError(`Invalid value for noiseDimension. Received ${value}. Expected one of: ${validDimensions.join(", ")}`);
		}
	}

	/* Frequency (주파수/스케일) */
	get frequency(): number {
		return this.#frequency;
	}

	set frequency(value: number) {
		validatePositiveNumberRange(value);
		this.#frequency = value;
		this.updateUniform('frequency', value);
	}

	/* Amplitude (진폭) */
	get amplitude(): number {
		return this.#amplitude;
	}

	set amplitude(value: number) {
		validatePositiveNumberRange(value);
		this.#amplitude = value;
		this.updateUniform('amplitude', value);
	}

	/* Octaves (옥타브 수) */
	get octaves(): number {
		return this.#octaves;
	}

	set octaves(value: number) {
		validateUintRange(value, 1, 8)
		this.#octaves = value;
		this.updateUniform('octaves', value);
	}

	/* Persistence (지속성) */
	get persistence(): number {
		return this.#persistence;
	}

	set persistence(value: number) {
		validatePositiveNumberRange(value, 0, 1)
		this.#persistence = value;
		this.updateUniform('persistence', value);
	}

	/* Lacunarity (간극성) */
	get lacunarity(): number {
		return this.#lacunarity;
	}

	set lacunarity(value: number) {
		validatePositiveNumberRange(value);
		this.#lacunarity = value;
		this.updateUniform('lacunarity', value);
	}

	/* Seed (시드) */
	get seed(): number {
		return this.#seed;
	}

	set seed(value: number) {
		this.#seed = value;
		this.updateUniform('seed', value);
	}

	randomizeSeed(): void {
		this.seed = Math.random() * 1000.0;
	}

	getSettings(): {
		frequency: number;
		amplitude: number;
		octaves: number;
		persistence: number;
		lacunarity: number;
		seed: number;
	} {
		return {
			frequency: this.#frequency,
			amplitude: this.#amplitude,
			octaves: this.#octaves,
			persistence: this.#persistence,
			lacunarity: this.#lacunarity,
			seed: this.#seed
		};
	}

	applySettings(settings: Partial<{
		frequency: number;
		amplitude: number;
		octaves: number;
		persistence: number;
		lacunarity: number;
		seed: number;
	}>): void {
		if (settings.frequency !== undefined) this.frequency = settings.frequency;
		if (settings.amplitude !== undefined) this.amplitude = settings.amplitude;
		if (settings.octaves !== undefined) this.octaves = settings.octaves;
		if (settings.persistence !== undefined) this.persistence = settings.persistence;
		if (settings.lacunarity !== undefined) this.lacunarity = settings.lacunarity;
		if (settings.seed !== undefined) this.seed = settings.seed;
	}

	#registerResource() {
		basicRegisterResource(this, new ResourceStateBitmapTexture(this));
	}

	#unregisterResource() {
		basicUnregisterResource(this);
	}
}

export default ANoiseTexture;
