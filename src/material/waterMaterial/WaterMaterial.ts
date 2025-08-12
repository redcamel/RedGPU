import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from "./fragment.wgsl";
import WaterNormalTexture from "./WaterNormalTexture";

const SHADER_INFO = parseWGSL(fragmentModuleSource)

interface WaterMaterial {
	color: ColorRGB;
	normalMap: WaterNormalTexture;
}

class WaterMaterial extends ABitmapBaseMaterial {
	#normalTexture: WaterNormalTexture;

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			'WATER_MATERIAL',
			SHADER_INFO,
			2
		);

		// 기본 색상을 물색으로 설정
		this.color.setColorByHEX('#1FAE8C');
		// GPU 렌더링 정보 초기화
		this.initGPURenderInfos();
		this.#normalTexture = new WaterNormalTexture(redGPUContext, 1024, 1024);
		this.normalTexture = this.#normalTexture;
		this.use2PathRender = true

	}

	// 물 노멀맵 접근자
	get normalTexture(): WaterNormalTexture {
		return this.#normalTexture;
	}

	set normalTexture(value: WaterNormalTexture) {
		this.#normalTexture = value;
	}

}

// 표준 재질 속성 정의
DefineForFragment.defineByPreset(WaterMaterial, [
	DefineForFragment.PRESET_COLOR_RGB.COLOR,
])

Object.freeze(WaterMaterial)
export default WaterMaterial
