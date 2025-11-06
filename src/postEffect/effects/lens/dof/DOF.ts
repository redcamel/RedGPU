import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import DOFCoC from "./DOFCoC/DOFCoC";
import DOFUnified from "./DOFUnified";

/**
 * 피사계 심도(DOF, Depth of Field) 후처리 이펙트입니다.
 * CoC(혼란 원) 계산과 블러를 결합해 사실적인 심도 효과를 제공합니다.
 * 다양한 사진/영상 스타일 프리셋 메서드를 지원합니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.DOF(redGPUContext);
 * effect.focusDistance = 10;
 * effect.aperture = 2.0;
 * effect.maxCoC = 30;
 * effect.setCinematic(); // 시네마틱 프리셋 적용
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/dof/"></iframe>
 */
class DOF extends AMultiPassPostEffect {
	/** CoC 계산용 이펙트 */
	#effect_coc: DOFCoC;
	/** 블러/합성용 이펙트 */
	#effect_unified: DOFUnified;
	// CoC 파라미터
	/** 초점 거리. 기본값 15.0 */
	#focusDistance: number = 15.0;
	/** 조리개(F값). 기본값 2.8 */
	#aperture: number = 2.8;
	/** 최대 CoC. 기본값 25.0 */
	#maxCoC: number = 25.0;
	/** 근평면. 기본값 0.1 */
	#nearPlane: number = 0.1;
	/** 원평면. 기본값 1000.0 */
	#farPlane: number = 1000.0;
	// 블러 파라미터
	/** 근거리 블러 크기. 기본값 15 */
	#nearBlurSize: number = 15;
	/** 원거리 블러 크기. 기본값 15 */
	#farBlurSize: number = 15;
	/** 근거리 블러 강도. 기본값 1.0 */
	#nearStrength: number = 1.0;
	/** 원거리 블러 강도. 기본값 1.0 */
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
	/** 초점 거리 반환 */
	get focusDistance(): number {
		return this.#focusDistance;
	}

	/** 초점 거리 설정 */
	set focusDistance(value: number) {
		this.#focusDistance = value;
		this.#effect_coc.focusDistance = value;
	}

	/** 조리개 반환 */
	get aperture(): number {
		return this.#aperture;
	}

	/** 조리개 설정 */
	set aperture(value: number) {
		this.#aperture = value;
		this.#effect_coc.aperture = value;
	}

	/** 최대 CoC 반환 */
	get maxCoC(): number {
		return this.#maxCoC;
	}

	/** 최대 CoC 설정 */
	set maxCoC(value: number) {
		this.#maxCoC = value;
		this.#effect_coc.maxCoC = value;
	}

	/** 근평면 반환 */
	get nearPlane(): number {
		return this.#nearPlane;
	}

	/** 근평면 설정 */
	set nearPlane(value: number) {
		this.#nearPlane = value;
		this.#effect_coc.nearPlane = value;
	}

	/** 원평면 반환 */
	get farPlane(): number {
		return this.#farPlane;
	}

	/** 원평면 설정 */
	set farPlane(value: number) {
		this.#farPlane = value;
		this.#effect_coc.farPlane = value;
	}

	// 블러 관련 getter/setter
	/** 근거리 블러 크기 반환 */
	get nearBlurSize(): number {
		return this.#nearBlurSize;
	}

	/** 근거리 블러 크기 설정 */
	set nearBlurSize(value: number) {
		this.#nearBlurSize = value;
		this.#effect_unified.nearBlurSize = value;
	}

	/** 원거리 블러 크기 반환 */
	get farBlurSize(): number {
		return this.#farBlurSize;
	}

	/** 원거리 블러 크기 설정 */
	set farBlurSize(value: number) {
		this.#farBlurSize = value;
		this.#effect_unified.farBlurSize = value;
	}

	/** 근거리 블러 강도 반환 */
	get nearStrength(): number {
		return this.#nearStrength;
	}

	/** 근거리 블러 강도 설정 */
	set nearStrength(value: number) {
		this.#nearStrength = value;
		this.#effect_unified.nearStrength = value;
	}

	/** 원거리 블러 강도 반환 */
	get farStrength(): number {
		return this.#farStrength;
	}

	/** 원거리 블러 강도 설정 */
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

	/**
	 * DOF 효과를 렌더링합니다.
	 * @returns 최종 DOF 처리 결과
	 */
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
