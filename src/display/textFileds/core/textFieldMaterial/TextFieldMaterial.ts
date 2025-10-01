import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import DefineForFragment from "../../../../resources/defineProperty/DefineForFragment";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import fragmentModuleSource from './fragment.wgsl';

const SHADER_INFO = parseWGSL(fragmentModuleSource)

/**
 * 텍스트 필드 렌더링에 사용되는 머티리얼 클래스입니다.
 *
 * `ABitmapBaseMaterial`을 확장하며, 텍스처와 샘플러를 기반으로 GPU 렌더링 정보를 초기화합니다.
 *
 * @remarks
 * 이 클래스는 RedGPU 시스템 내부에서 텍스트 필드를 처리하기 위해 사용됩니다.
 * 일반 사용자나 외부 개발자가 `직접 사용할 필요는 없습니다.`
 */
class TextFieldMaterial extends ABitmapBaseMaterial {
	/**
	 * 파이프라인 재생성 여부를 나타냅니다.
	 * 머티리얼 설정이 변경되었을 때 true로 설정되어야 합니다.
	 */
	dirtyPipeline: boolean = false

	/**
	 * 텍스트 필드에 사용할 비트맵 텍스처입니다.
	 */
	diffuseTexture: BitmapTexture

	/**
	 * 텍스처 샘플링에 사용되는 샘플러입니다.
	 */
	diffuseTextureSampler: Sampler

	/**
	 * `TextFieldMaterial` 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 * @param diffuseTexture - 텍스트 필드에 사용할 비트맵 텍스처 (선택 사항)
	 * @param name - 머티리얼의 이름 (선택 사항)
	 */
	constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string) {
		super(
			redGPUContext,
			'TEXT_FILED_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.diffuseTexture = diffuseTexture
		this.diffuseTextureSampler = new Sampler(this.redGPUContext)
		this.initGPURenderInfos()
	}
}

/**
 * 프래그먼트 셰이더에서 사용할 텍스처 및 샘플러 속성을 정의합니다.
 */
DefineForFragment.defineByPreset(TextFieldMaterial, [
	DefineForFragment.PRESET_TEXTURE.DIFFUSE_TEXTURE,
	DefineForFragment.PRESET_SAMPLER.DIFFUSE_TEXTURE_SAMPLER,
])

/**
 * `TextFieldMaterial` 클래스의 속성을 변경할 수 없도록 고정합니다.
 */
Object.freeze(TextFieldMaterial)

/**
 * `TextFieldMaterial` 클래스를 기본 export로 내보냅니다.
 */
export default TextFieldMaterial
