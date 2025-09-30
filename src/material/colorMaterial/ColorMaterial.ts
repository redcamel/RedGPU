import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABaseMaterial from "../core/ABaseMaterial";
import fragmentModuleSource from './fragment.wgsl'

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface ColorMaterial {
	/**
	 * 머티리얼의 단색 컬러(ColorRGB)
	 */
	color: ColorRGB
}

/**
 * 단색(솔리드 컬러) 렌더링을 위한 머티리얼 클래스입니다.
 * ColorRGB 기반의 색상 지정이 가능하며, GPU 파이프라인에서 단일 색상으로 오브젝트를 렌더링할 때 사용합니다.
 *
 * @extends ABaseMaterial
 * @category Material
 */
class ColorMaterial extends ABaseMaterial {
	/**
	 * ColorMaterial 생성자
	 * @param redGPUContext - RedGPUContext 인스턴스
	 * @param color - HEX 문자열 또는 컬러 코드(기본값: '#fff')
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
