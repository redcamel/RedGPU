import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class SSR extends ASinglePassPostEffect {
	#maxSteps: number = 128;
	#maxDistance: number = 15.0;
	#stepSize: number = 0.015;
	#reflectionIntensity: number = 1;
	#fadeDistance: number = 12.0;
	#edgeFade: number = 0.15;
	#frameCount: number = 0;
	#jitterStrength: number = 0.5;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);

		// SSR에 최적화된 워크그룹 크기 설정
		this.WORK_SIZE_X = 8;  // 8x8 = 64 threads per workgroup로 변경
		this.WORK_SIZE_Y = 8;  // GPU 웨이브프론트 크기에 최적화
		this.WORK_SIZE_Z = 1;  // 2D 텍스처이므로 1

		this.useDepthTexture = true;
		this.useNormalRougnessTexture = true;
		this.init(
			redGPUContext,
			'POST_EFFECT_SSR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);

		// 초기값 설정
		this.maxSteps = this.#maxSteps;
		this.maxDistance = this.#maxDistance;
		this.stepSize = this.#stepSize;
		this.reflectionIntensity = this.#reflectionIntensity;
		this.fadeDistance = this.#fadeDistance;
		this.edgeFade = this.#edgeFade;
		this.frameCount = this.#frameCount;
		this.jitterStrength = this.#jitterStrength;
	}

	/**
	 * 매 프레임마다 호출하여 지터 시스템을 위한 프레임 카운트를 업데이트
	 */
	update(): void {
		// this.frameCount = (this.#frameCount + 1) % 10000; // 오버플로우 방지
	}

	get maxSteps(): number {
		return this.#maxSteps;
	}

	set maxSteps(value: number) {
		validateNumberRange(value, 1, 512); // 최대값을 512로 증가
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

	get frameCount(): number {
		return this.#frameCount;
	}

	set frameCount(value: number) {
		validateNumberRange(value, 0, 99999);
		this.#frameCount = value;
		this.updateUniform('frameCount', value);
	}

	get jitterStrength(): number {
		return this.#jitterStrength;
	}

	set jitterStrength(value: number) {
		validateNumberRange(value, 0.0, 2.0);
		this.#jitterStrength = value;
		this.updateUniform('jitterStrength', value);
	}

	/**
	 * 지터 품질 프리셋 설정
	 */
	setJitterQuality(quality: 'low' | 'medium' | 'high' | 'ultra'): void {
		switch (quality) {
			case 'low':
				this.jitterStrength = 0.2;
				break;
			case 'medium':
				this.jitterStrength = 0.5;
				break;
			case 'high':
				this.jitterStrength = 0.8;
				break;
			case 'ultra':
				this.jitterStrength = 1.2;
				break;
		}
	}

	/**
	 * 성능 프리셋 설정 (스텝 수와 품질의 균형)
	 */
	setPerformancePreset(preset: 'performance' | 'balanced' | 'quality'): void {
		switch (preset) {
			case 'performance':
				this.maxSteps = 64;
				this.stepSize = 0.025;
				this.jitterStrength = 0.3;
				break;
			case 'balanced':
				this.maxSteps = 128;
				this.stepSize = 0.015;
				this.jitterStrength = 0.5;
				break;
			case 'quality':
				this.maxSteps = 256;
				this.stepSize = 0.01;
				this.jitterStrength = 0.8;
				break;
		}
	}
}

Object.freeze(SSR);
export default SSR;
