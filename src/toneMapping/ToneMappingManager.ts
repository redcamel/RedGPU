import View3D from "../display/view/View3D";
import RedGPUContext from "../context/RedGPUContext";
import AToneMappingEffect from "./core/AToneMappingEffect";
import TONE_MAPPING_MODE from "./TONE_MAPPING_MODE";
import {keepLog} from "../utils";
import ToneLinear from "./linearToneMapping/ToneLinear";
import ToneKhronosPBRNeutral from "./khronosPbrNeutral/ToneKhronosPBRNeutral";
import ToneACESFilmicNarkowicz from "./ACESFilmicNarkowicz/ToneACESFilmicNarkowicz";
import ToneACESFilmicHill from "./ACESFilmicHill/ToneACESFilmicHill";
import {ASinglePassPostEffectResult} from "../postEffect/core/ASinglePassPostEffect";

class ToneMappingManager {
    #redGPUContext:RedGPUContext
    #view:View3D
    #toneMapping: AToneMappingEffect
    #toneMappingMode: TONE_MAPPING_MODE = TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL

    constructor(view:View3D) {
        this.#redGPUContext = view.redGPUContext
        this.#view = view
    }
    #createToneMapping() {
        if (!this.#toneMapping) {
            keepLog('보자', this.#toneMappingMode)
            switch (this.#toneMappingMode) {
                case TONE_MAPPING_MODE.LINEAR:
                    this.#toneMapping = new ToneLinear(this.#redGPUContext)
                    break;
                case TONE_MAPPING_MODE.KHRONOS_PBR_NEUTRAL:
                    this.#toneMapping = new ToneKhronosPBRNeutral(this.#redGPUContext)
                    break;
                case TONE_MAPPING_MODE.ACES_FILMIC_NARKOWICZ:
                    this.#toneMapping = new ToneACESFilmicNarkowicz(this.#redGPUContext)
                    break;
                case TONE_MAPPING_MODE.ACES_FILMIC_HILL:
                    this.#toneMapping = new ToneACESFilmicHill(this.#redGPUContext)
                    break;
            }

        }
    }

    get toneMapping(): AToneMappingEffect {
        this.#createToneMapping()
        return this.#toneMapping;
    }


    get toneMappingMode(): TONE_MAPPING_MODE {
        return this.#toneMappingMode;
    }

    set toneMappingMode(value: TONE_MAPPING_MODE) {
        this.#toneMappingMode = value;
        this.#toneMapping?.clear()
        this.#toneMapping = undefined
        this.#createToneMapping()
    }

    render(width: number, height: number, currentTextureView: ASinglePassPostEffectResult){
        if(this.toneMapping) {
            const result = this.toneMapping.render(
                this.#view,
                width,
                height,
                currentTextureView
            )
            return result
        }else{
            return currentTextureView
        }

    }

}
export default ToneMappingManager