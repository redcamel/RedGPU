import RedGPUContext from "../../../../../../context/RedGPUContext";
import type Sampler from "../../../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import AUVTransformBaseMaterial from "../../../../../../material/core/AUVTransformBaseMaterial";
interface OctahedralImpostorMaterial {
    /**
     * [KO] 팔면체 임포스터의 베이스 컬러 및 알파 아틀라스 텍스처입니다.
     * [EN] Base color and alpha atlas texture of the octahedral impostor.
     */
    baseColorTexture: BitmapTexture | DirectTexture;
    /**
     * [KO] 베이스 컬러 텍스처 샘플러입니다.
     * [EN] Base color texture sampler.
     */
    baseColorTextureSampler: Sampler;
    /**
     * [KO] 팔면체 임포스터의 월드 노멀 및 깊이 아틀라스 텍스처입니다.
     * [EN] World normal and depth atlas texture of the octahedral impostor.
     */
    normalTexture: BitmapTexture | DirectTexture;
    /**
     * [KO] 노멀 텍스처 샘플러입니다.
     * [EN] Normal texture sampler.
     */
    normalTextureSampler: Sampler;
    /**
     * [KO] 팔면체 임포스터의 패킹된 ORM(Occlusion, Roughness, Metallic) 아틀라스 텍스처입니다.
     * [EN] Packed ORM (Occlusion, Roughness, Metallic) atlas texture of the octahedral impostor.
     */
    packedORMTexture: BitmapTexture | DirectTexture;
    /**
     * [KO] 알파 컷오프(Alpha Cutoff) 사용 여부입니다.
     * [EN] Whether alpha cutoff is enabled.
     */
    useCutOff: boolean;
    /**
     * [KO] 알파 컷오프 임계값입니다.
     * [EN] Alpha cutoff threshold value.
     */
    cutOff: number;
    /**
     * [KO] 양면 렌더링 여부입니다.
     * [EN] Whether double-sided rendering is enabled.
     */
    doubleSided: boolean;
    /**
     * [KO] 식생 전용 머티리얼 여부입니다.
     * [EN] Whether this material is dedicated to foliage.
     */
    isFoliage: boolean;
    /**
     * [KO] 임포스터 대상 메시의 바운딩 스피어 반경(월드 단위)입니다.
     * [EN] Bounding sphere radius of the impostor target mesh in world units.
     */
    boundingRadius: number;
}
/**
 * [KO] 원거리 식생 LOD 렌더링을 위한 팔면체 임포스터(Octahedral Impostor) 전용 머티리얼 클래스입니다.
 * [EN] Material class dedicated to octahedral impostors for distant foliage LOD rendering.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class OctahedralImpostorMaterial extends AUVTransformBaseMaterial {
    /**
     * [KO] `OctahedralImpostorMaterial` 인스턴스를 생성합니다.
     * [EN] Creates an `OctahedralImpostorMaterial` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param baseColorTexture -
     * [KO] 베이킹된 베이스 컬러 아틀라스 텍스처 (선택)
     * [EN] Baked base color atlas texture (optional)
     * @param normalTexture -
     * [KO] 베이킹된 노멀 및 깊이 아틀라스 텍스처 (선택)
     * [EN] Baked normal and depth atlas texture (optional)
     * @param packedORMTexture -
     * [KO] 베이킹된 ORM 아틀라스 텍스처 (선택)
     * [EN] Baked ORM atlas texture (optional)
     * @param boundingRadius -
     * [KO] 대상 식생의 바운딩 반경 (기본값: `3.0`)
     * [EN] Bounding radius of the target foliage (default: `3.0`)
     * @param name -
     * [KO] 머티리얼 이름 (선택)
     * [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, baseColorTexture?: BitmapTexture | DirectTexture, normalTexture?: BitmapTexture | DirectTexture, packedORMTexture?: BitmapTexture | DirectTexture, boundingRadius?: number, name?: string);
}
export default OctahedralImpostorMaterial;
