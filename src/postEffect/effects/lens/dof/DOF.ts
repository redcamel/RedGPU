import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import DOFCoC from "./DOFCoC/DOFCoC";
import DOFUnified from "./DOFUnified";

class DOF extends AMultiPassPostEffect {
	#effect_coc: DOFCoC;
	#effect_unified: DOFUnified;
	// CoC 관련 파라미터
	#focusDistance: number = 15.0;
	#aperture: number = 2.8;
	#maxCoC: number = 25.0;
	#nearPlane: number = 0.1;
	#farPlane: number = 1000.0;
	// 블러 관련 파라미터
	#nearBlurSize: number = 15;
	#farBlurSize: number = 15;
	#nearStrength: number = 1.0;
	#farStrength: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new DOFCoC(redGPUContext),
				new DOFUnified(redGPUContext),
			],
		);
		this.#effect_coc = this.passList[0] as DOFCoC;
		this.#effect_unified = this.passList[1] as DOFUnified;
		// CoC 파라미터 초기화
		this.#effect_coc.focusDistance = this.#focusDistance;
		this.#effect_coc.aperture = this.#aperture;
		this.#effect_coc.maxCoC = this.#maxCoC;
		this.#effect_coc.nearPlane = this.#nearPlane;
		this.#effect_coc.farPlane = this.#farPlane;
		// 통합 효과 파라미터 초기화
		this.#effect_unified.nearBlurSize = this.#nearBlurSize;
		this.#effect_unified.farBlurSize = this.#farBlurSize;
		this.#effect_unified.nearStrength = this.#nearStrength;
		this.#effect_unified.farStrength = this.#farStrength;
	}

	// CoC 관련 getter/setter
	get focusDistance(): number {
		return this.#focusDistance;
	}

	set focusDistance(value: number) {
		this.#focusDistance = value;
		this.#effect_coc.focusDistance = value;
	}

	get aperture(): number {
		return this.#aperture;
	}

	set aperture(value: number) {
		this.#aperture = value;
		this.#effect_coc.aperture = value;
	}

	get maxCoC(): number {
		return this.#maxCoC;
	}

	set maxCoC(value: number) {
		this.#maxCoC = value;
		this.#effect_coc.maxCoC = value;
	}

	get nearPlane(): number {
		return this.#nearPlane;
	}

	set nearPlane(value: number) {
		this.#nearPlane = value;
		this.#effect_coc.nearPlane = value;
	}

	get farPlane(): number {
		return this.#farPlane;
	}

	set farPlane(value: number) {
		this.#farPlane = value;
		this.#effect_coc.farPlane = value;
	}

	// 블러 관련 getter/setter
	get nearBlurSize(): number {
		return this.#nearBlurSize;
	}

	set nearBlurSize(value: number) {
		this.#nearBlurSize = value;
		this.#effect_unified.nearBlurSize = value;
	}

	get farBlurSize(): number {
		return this.#farBlurSize;
	}

	set farBlurSize(value: number) {
		this.#farBlurSize = value;
		this.#effect_unified.farBlurSize = value;
	}

	get nearStrength(): number {
		return this.#nearStrength;
	}

	set nearStrength(value: number) {
		this.#nearStrength = value;
		this.#effect_unified.nearStrength = value;
	}

	get farStrength(): number {
		return this.#farStrength;
	}

	set farStrength(value: number) {
		this.#farStrength = value;
		this.#effect_unified.farStrength = value;
	}

	/**
	 * 🎮 게임 기본 프리셋 (균형잡힌 품질/성능)
	 */
	setGameDefault(): void {
		this.focusDistance = 15.0;
		this.aperture = 2.8;         // F/2.8 (자연스러운)
		this.maxCoC = 25.0;
		this.nearBlurSize = 15;
		this.farBlurSize = 15;
		this.nearStrength = 1.0;
		this.farStrength = 1.0;
	}

	/**
	 * 🎬 시네마틱 프리셋 (강한 DOF, 영화같은 느낌)
	 */
	setCinematic(): void {
		this.focusDistance = 20.0;
		this.aperture = 1.4;         // F/1.4 (매우 얕은 심도)
		this.maxCoC = 40.0;          // 큰 흐림원
		this.nearBlurSize = 25;      // 강한 블러
		this.farBlurSize = 30;
		this.nearStrength = 1.2;     // 강한 강도
		this.farStrength = 1.3;
	}

	/**
	 * 📷 인물 사진 프리셋 (배경 흐림, 인물 포커스)
	 */
	setPortrait(): void {
		this.focusDistance = 8.0;    // 가까운 거리 포커스
		this.aperture = 1.8;         // F/1.8 (인물 촬영 조리개)
		this.maxCoC = 35.0;
		this.nearBlurSize = 12;      // 근거리는 덜 흐림
		this.farBlurSize = 25;       // 배경은 많이 흐림
		this.nearStrength = 0.8;
		this.farStrength = 1.4;      // 배경 블러 강조
	}

	/**
	 * 🌄 풍경 사진 프리셋 (전체적으로 선명, 약간의 원거리 흐림)
	 */
	setLandscape(): void {
		this.focusDistance = 50.0;   // 멀리 포커스
		this.aperture = 8.0;         // F/8 (풍경 촬영 조리개)
		this.maxCoC = 20.0;
		this.nearBlurSize = 20;      // 근거리 흐림
		this.farBlurSize = 10;       // 원거리는 덜 흐림
		this.nearStrength = 1.1;
		this.farStrength = 0.6;      // 원거리 약하게
	}

	/**
	 * 🔍 매크로 촬영 프리셋 (극도로 얕은 심도)
	 */
	setMacro(): void {
		this.focusDistance = 2.0;    // 매우 가까운 거리
		this.aperture = 1.0;         // F/1.0 (극한 조리개)
		this.maxCoC = 50.0;          // 매우 큰 흐림원
		this.nearBlurSize = 30;      // 강한 근거리 블러
		this.farBlurSize = 35;       // 강한 원거리 블러
		this.nearStrength = 1.5;
		this.farStrength = 1.6;
	}

	/**
	 * 🏃 액션/스포츠 프리셋 (빠른 움직임에 적합)
	 */
	setSports(): void {
		this.focusDistance = 25.0;   // 중간 거리
		this.aperture = 4.0;         // F/4 (적당한 심도)
		this.maxCoC = 18.0;
		this.nearBlurSize = 10;      // 빠른 처리를 위해 작게
		this.farBlurSize = 12;
		this.nearStrength = 0.8;
		this.farStrength = 0.9;
	}

	/**
	 * 🌙 야간 촬영 프리셋 (저조도 환경)
	 */
	setNightMode(): void {
		this.focusDistance = 12.0;
		this.aperture = 2.0;         // F/2.0 (빛 확보)
		this.maxCoC = 30.0;
		this.nearBlurSize = 18;
		this.farBlurSize = 20;
		this.nearStrength = 1.1;
		this.farStrength = 1.2;
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
		// 1단계: CoC (Circle of Confusion) 계산
		const cocResult = this.#effect_coc.render(
			view, width, height, sourceTextureInfo
		);
		// 2단계: 통합된 DOF 블러 및 컴포지팅
		return this.#effect_unified.render(
			view, width, height, sourceTextureInfo, cocResult
		);
	}
}

Object.freeze(DOF);
export default DOF;
