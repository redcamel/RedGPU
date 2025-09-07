import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "./ASinglePassPostEffect";

class AMultiPassPostEffect extends ASinglePassPostEffect {
	#passList: ASinglePassPostEffect[] = []
	#videoMemorySize: number = 0

	constructor(redGPUContext: RedGPUContext, passList: ASinglePassPostEffect[]) {
		super(redGPUContext);
		this.#passList.push(
			...passList
		)
	}

	get videoMemorySize(): number {
		this.#calcVideoMemory()
		return this.#videoMemorySize
	}

	get passList(): ASinglePassPostEffect[] {
		return this.#passList;
	}

	clear() {
		this.#passList.forEach(v => v.clear())
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult):ASinglePassPostEffectResult {
		let targetOutputInfo: ASinglePassPostEffectResult
		this.#passList.forEach((effect: ASinglePassPostEffect, index) => {
			if (index) sourceTextureInfo = targetOutputInfo
			targetOutputInfo = effect.render(
				view, width, height, sourceTextureInfo
			)
		})
		return targetOutputInfo
	}

	#calcVideoMemory() {
		this.#videoMemorySize = 0
		this.#passList.forEach(texture => {
			this.#videoMemorySize += texture.videoMemorySize
		})
	}
}

Object.freeze(AMultiPassPostEffect)
export default AMultiPassPostEffect
