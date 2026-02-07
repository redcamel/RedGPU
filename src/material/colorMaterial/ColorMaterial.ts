import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABaseMaterial from "../core/ABaseMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

/**
 * [KO] 단색(솔리드 컬러) 렌더링을 위한 머티리얼 클래스입니다.
 * [EN] Material class for solid color rendering.
 *
 * [KO] ColorRGB 기반의 색상 지정이 가능하며, GPU 파이프라인에서 단일 색상으로 오브젝트를 렌더링할 때 사용합니다.
 * [EN] It allows color specification based on ColorRGB and is used when rendering objects with a single color in the GPU pipeline.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/colorMaterial/"></iframe>
 *
 * @category Material
 */
class ColorMaterial extends ABaseMaterial {
    /**
     * [KO] 머티리얼의 단색 컬러(ColorRGB)를 설정하거나 반환합니다.
     * [EN] Sets or returns the monochromatic color of the material (ColorRGB).
     */
    color: ColorRGB

    /**
     * [KO] ColorMaterial 인스턴스를 생성합니다.
     * [EN] Creates a ColorMaterial instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param color -
     * [KO] 초기 색상 (HEX 문자열 또는 컬러 코드, 기본값: '#fff')
     * [EN] Initial color (HEX string or color code, default: '#fff')
     */
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
