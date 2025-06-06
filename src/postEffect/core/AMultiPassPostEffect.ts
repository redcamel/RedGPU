import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "./ASinglePassPostEffect";

class AMultiPassPostEffect extends ASinglePassPostEffect {
    #passList: ASinglePassPostEffect[] = []

    constructor(redGPUContext:RedGPUContext,passList: ASinglePassPostEffect[]) {
        super(redGPUContext);
        this.#passList.push(
            ...passList
        )
    }

    get passList(): ASinglePassPostEffect[] {
        return this.#passList;
    }

    clear() {
        this.#passList.forEach(v => v.clear())
    }

    render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
        let targetOutputView: GPUTextureView
        this.#passList.forEach((effect: ASinglePassPostEffect, index) => {
            if (index) sourceTextureView = targetOutputView
            targetOutputView = effect.render(
                view, width, height, sourceTextureView
            )
        })
        return targetOutputView
    }
}

Object.freeze(AMultiPassPostEffect)
export default AMultiPassPostEffect
