import redGPUContext from "../../context/RedGPUContext";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {keepLog} from "../../utils";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class TAA extends ASinglePassPostEffect {
	#temporalBlendFactor: number = 0.95;
	#motionThreshold: number = 0.01;
	#colorBoxSize: number = 1.0;
	#jitterStrength: number = 0.5;
	#varianceClipping: boolean = true;
	#jitterSequence: number[][] = this.#generateHaltonSequence(64);




	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);

		// TAA에 최적화된 워크그룹 크기 설정
		this.WORK_SIZE_X = 8;
		this.WORK_SIZE_Y = 8;
		this.WORK_SIZE_Z = 1;
		// 🎯 직접 WGSL 코드 생성
		const shaderCode = this.#createTAAShaderCode();

		this.init(
			redGPUContext,
			'POST_EFFECT_TAA',
			{
				msaa: shaderCode.msaa,
				nonMsaa: shaderCode.nonMsaa
			}
		);

		// 초기값 설정
		this.temporalBlendFactor = this.#temporalBlendFactor;
		this.motionThreshold = this.#motionThreshold;
		this.colorBoxSize = this.#colorBoxSize;
		this.jitterStrength = this.#jitterStrength;
		this.varianceClipping = this.#varianceClipping;
	}

	#createTAAShaderCode() {
		const createCode = (useMSAA: boolean) => {
			const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';

			return `
				${uniformStructCode}
				
				@group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(1) var previousFrame : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(2) var depthTexture : ${depthTextureType};
				
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

	// TAA용 render 메서드 오버라이드
	render(view:View3D, width, height, currentFrameTextureView) {
		this.frameIndex++;

		// 이전 프레임 텍스처 가져오기 (순환 버퍼에서)
		const previousFrameTextureView = this.frameIndex > 1
			? this.getPreviousFrameTextureView()
			: view.redGPUContext.resourceManager.emptyBitmapTextureView;

		return super.render(view, width, height, currentFrameTextureView, previousFrameTextureView);

	}


	// Halton 시퀀스 생성 (지터링용)
	#generateHaltonSequence(count: number): number[][] {
		const sequence: number[][] = [];

		const halton = (index: number, base: number): number => {
			let result = 0;
			let fraction = 1;
			let i = index;

			while (i > 0) {
				fraction /= base;
				result += (i % base) * fraction;
				i = Math.floor(i / base);
			}

			return result;
		};

		for (let i = 0; i < count; i++) {
			const x = halton(i + 1, 2) * 2 - 1; // -1 to 1
			const y = halton(i + 1, 3) * 2 - 1; // -1 to 1
			sequence.push([x, y]);
		}

		return sequence;
	}

	get currentJitter(): number[] {
		const jitterIndex = this.frameIndex % this.#jitterSequence.length;
		return this.#jitterSequence[jitterIndex].map(v => v * this.#jitterStrength);
	}

	// Getter/Setter들
	get temporalBlendFactor(): number {
		return this.#temporalBlendFactor;
	}

	set temporalBlendFactor(value: number) {
		validateNumberRange(value, 0.0, 1.0);
		this.#temporalBlendFactor = value;
		this.updateUniform('temporalBlendFactor', value);
	}

	get motionThreshold(): number {
		return this.#motionThreshold;
	}

	set motionThreshold(value: number) {
		validatePositiveNumberRange(value, 0.001, 1.0);
		this.#motionThreshold = value;
		this.updateUniform('motionThreshold', value);
	}

	get colorBoxSize(): number {
		return this.#colorBoxSize;
	}

	set colorBoxSize(value: number) {
		validatePositiveNumberRange(value, 0.1, 5.0);
		this.#colorBoxSize = value;
		this.updateUniform('colorBoxSize', value);
	}

	get jitterStrength(): number {
		return this.#jitterStrength;
	}

	set jitterStrength(value: number) {
		validateNumberRange(value, 0.0, 2.0);
		this.#jitterStrength = value;
		this.updateUniform('jitterStrength', value);
	}

	get varianceClipping(): boolean {
		return this.#varianceClipping;
	}

	set varianceClipping(value: boolean) {
		this.#varianceClipping = value;
		this.updateUniform('varianceClipping', value ? 1.0 : 0.0);
	}

}

Object.freeze(TAA);
export default TAA;
