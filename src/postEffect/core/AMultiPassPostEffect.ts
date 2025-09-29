import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "./ASinglePassPostEffect";

/**
 * 다중 패스 후처리 이펙트(AMultiPassPostEffect) 추상 클래스입니다.
 * 여러 개의 단일 패스 이펙트를 순차적으로 적용할 수 있습니다.
 *
 * @category Core
 *
 */
class AMultiPassPostEffect extends ASinglePassPostEffect {
	/** 내부 패스 리스트 */
	#passList: ASinglePassPostEffect[] = []
	/** 비디오 메모리 사용량(byte) */
	#videoMemorySize: number = 0

	/**
	 * AMultiPassPostEffect 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 * @param passList 적용할 단일 패스 이펙트 배열
	 */
	constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]) {
		super(redGPUContext);
		this.#passList.push(
			...passList
		)
	}

	/** 비디오 메모리 사용량 반환 */
	get videoMemorySize(): number {
		this.#calcVideoMemory()
		return this.#videoMemorySize
	}

	/** 내부 패스 리스트 반환 */
	get passList(): ASinglePassPostEffect[] {
		return this.#passList;
	}

	/** 모든 패스 clear */
	clear() {
		this.#passList.forEach(v => v.clear())
	}

	/**
	 * 모든 패스를 순차적으로 렌더링합니다.
	 * @returns 마지막 패스의 결과
	 */
	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
		let targetOutputInfo: ASinglePassPostEffectResult
		this.#passList.forEach((effect: ASinglePassPostEffect, index) => {
			if (index) sourceTextureInfo = targetOutputInfo
			targetOutputInfo = effect.render(
				view, width, height, sourceTextureInfo
			)
		})
		return targetOutputInfo
	}

	/** 내부 비디오 메모리 계산 */
	#calcVideoMemory() {
		this.#videoMemorySize = 0
		this.#passList.forEach(texture => {
			this.#videoMemorySize += texture.videoMemorySize
		})
	}
}

Object.freeze(AMultiPassPostEffect)
export default AMultiPassPostEffect
