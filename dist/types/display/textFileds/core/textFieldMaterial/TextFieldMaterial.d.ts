import RedGPUContext from "../../../../context/RedGPUContext";
import ABitmapBaseMaterial from "../../../../material/core/ABitmapBaseMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
interface TextFieldMaterial {
    diffuseTexture: BitmapTexture;
    diffuseTextureSampler: Sampler;
}
/**
 * 텍스트 필드 렌더링에 사용되는 머티리얼 클래스입니다.
 *
 * `ABitmapBaseMaterial`을 확장하며, 텍스처와 샘플러를 기반으로 GPU 렌더링 정보를 초기화합니다.
 *
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 *
 */
declare class TextFieldMaterial extends ABitmapBaseMaterial {
    /**
     * 파이프라인 재생성 여부를 나타냅니다.
     * 머티리얼 설정이 변경되었을 때 true로 설정되어야 합니다.
     */
    dirtyPipeline: boolean;
    /**
     * `TextFieldMaterial` 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param diffuseTexture - 텍스트 필드에 사용할 비트맵 텍스처 (선택 사항)
     * @param name - 머티리얼의 이름 (선택 사항)
     */
    constructor(redGPUContext: RedGPUContext, diffuseTexture?: BitmapTexture, name?: string);
}
/**
 * `TextFieldMaterial` 클래스를 기본 export로 내보냅니다.
 */
export default TextFieldMaterial;
