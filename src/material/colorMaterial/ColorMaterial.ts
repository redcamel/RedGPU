import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABaseMaterial from "../core/ABaseMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface ColorMaterial {
    color: ColorRGB
}

class ColorMaterial extends ABaseMaterial {
    constructor(redGPUContext: RedGPUContext, color: string = '#fff') {
        super(
            redGPUContext,
            'COLOR_MATERIAL',
            SHADER_INFO,
            2
        )
        this.initGPURenderInfos()
        this.color.setColorByHEX(color)
    }
}

DefineForFragment.defineByPreset(ColorMaterial, [
    DefineForFragment.PRESET_COLOR_RGB.COLOR,
])
Object.freeze(ColorMaterial)
export default ColorMaterial
