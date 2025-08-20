import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import postEffectSystemUniform from "../../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class SSR extends ASinglePassPostEffect {
	#maxSteps: number = 128;
	#maxDistance: number = 15.0;
	#stepSize: number = 0.015;
	#reflectionIntensity: number = 1;
	#fadeDistance: number = 12.0;
	#edgeFade: number = 0.15;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);

		// SSR에 최적화된 워크그룹 크기 설정
		this.WORK_SIZE_X = 8;
		this.WORK_SIZE_Y = 8;
		this.WORK_SIZE_Z = 1;

		this.useDepthTexture = true;


		// 직접 WGSL 코드 생성
		const shaderCode = this.#createSSRShaderCode();

		this.init(
			redGPUContext,
			'POST_EFFECT_SSR',
			{
				msaa: shaderCode.msaa,
				nonMsaa: shaderCode.nonMsaa
			}
		);

		// 초기값 설정
		this.maxSteps = this.#maxSteps;
		this.maxDistance = this.#maxDistance;
		this.stepSize = this.#stepSize;
		this.reflectionIntensity = this.#reflectionIntensity;
		this.fadeDistance = this.#fadeDistance;
		this.edgeFade = this.#edgeFade;
	}

	#createSSRShaderCode() {
		const createCode = (useMSAA: boolean) => {
			const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';

			return `
				${uniformStructCode}
				
				@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(1) var depthTexture : ${depthTextureType};
				@group(0) @binding(2) var gBufferNormalTexture : texture_2d<f32>;
				
				@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
				${postEffectSystemUniform}
				@group(1) @binding(2) var<uniform> uniforms: Uniforms;
				
				@compute @workgroup_size(${this.WORK_SIZE_X}, ${this.WORK_SIZE_Y}, ${this.WORK_SIZE_Z})
				fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
					${computeCode}
				}
			`;
		};

		return {
			msaa: createCode(true),
			nonMsaa: createCode(false)
		};
	}

	get maxSteps(): number {
		return this.#maxSteps;
	}

	set maxSteps(value: number) {
		validateNumberRange(value, 1, 512);
		this.#maxSteps = value;
		this.updateUniform('maxSteps', value);
	}

	get maxDistance(): number {
		return this.#maxDistance;
	}

	set maxDistance(value: number) {
		validatePositiveNumberRange(value, 1.0, 200.0);
		this.#maxDistance = value;
		this.updateUniform('maxDistance', value);
	}

	get stepSize(): number {
		return this.#stepSize;
	}

	set stepSize(value: number) {
		validatePositiveNumberRange(value, 0.001, 5.0);
		this.#stepSize = value;
		this.updateUniform('stepSize', value);
	}

	get reflectionIntensity(): number {
		return this.#reflectionIntensity;
	}

	set reflectionIntensity(value: number) {
		validateNumberRange(value, 0.0, 5.0);
		this.#reflectionIntensity = value;
		this.updateUniform('reflectionIntensity', value);
	}

	get fadeDistance(): number {
		return this.#fadeDistance;
	}

	set fadeDistance(value: number) {
		validatePositiveNumberRange(value, 1.0, 100.0);
		this.#fadeDistance = value;
		this.updateUniform('fadeDistance', value);
	}

	get edgeFade(): number {
		return this.#edgeFade;
	}

	set edgeFade(value: number) {
		validateNumberRange(value, 0.0, 0.5);
		this.#edgeFade = value;
		this.updateUniform('edgeFade', value);
	}

}

Object.freeze(SSR);
export default SSR;
