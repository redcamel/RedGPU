import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import ABaseMaterial from "../core/ABaseMaterial";
import fragmentModuleSource from './fragment.wgsl'
import defineColorRGB from "../../defineProperty/funcs/color/defineColorRGB";

/**
 * [KO] ColorMaterial의 동적 색상 속성 인터페이스입니다.
 * [EN] Dynamic color property interface for ColorMaterial.
 * @category Material
 */
interface ColorMaterial {
    /**
     * [KO] 머티리얼의 단색 컬러 (ColorRGB)
     * [EN] Solid color of the material (ColorRGB)
     */
    color: ColorRGB
}

/**
 * [KO] 조명 연산 없이 단일 색상(Solid Color)으로 오브젝트를 렌더링하는 머티리얼 클래스입니다.
 * [EN] Material class that renders objects with a solid color without lighting calculations.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/material/colorMaterial/" style="width:100%; height:500px;"></iframe>
 *
 * @see [ColorMaterial example](/RedGPU/examples/3d/material/colorMaterial/)
 * @see [Material Opacity example](/RedGPU/examples/3d/material/opacity/)
 * @category Material
 */
class ColorMaterial extends ABaseMaterial {
    /**
     * [KO] ColorMaterial 인스턴스를 생성합니다.
     * [EN] Creates a ColorMaterial instance.
     *
     * ### Example
     * ```typescript
     * const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param color -
     * [KO] HEX 형식의 기본 색상 문자열 (기본값: `'#fff'`)
     * [EN] Base color string in HEX format (default: `'#fff'`)
     */
    constructor(redGPUContext: RedGPUContext, color: string = '#fff') {
        super(
            redGPUContext,
            'COLOR_MATERIAL',
            fragmentModuleSource,
            2
        )
        this.initGPURenderInfos()
        this.color.setColorByHEX(color)
    }
}

Object.defineProperty(ColorMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});
defineColorRGB(ColorMaterial, [
    {key: 'color'},
])
Object.freeze(ColorMaterial)
export default ColorMaterial
