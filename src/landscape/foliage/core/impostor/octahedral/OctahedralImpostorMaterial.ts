/**
 * [KO] 옥타헤드럴 임포스터 전용 머티리얼 모듈입니다.
 * [EN] Dedicated material module for octahedral impostors.
 * @packageDocumentation
 */

import RedGPUContext from "../../../../../context/RedGPUContext";
import type Sampler from "../../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../../resources/texture/BitmapTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import fragmentModuleSource from './octahedralImpostorFragment.wgsl';
import AUVTransformBaseMaterial from "../../../../../material/core/AUVTransformBaseMaterial";

import defineSampler from "../../../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../../../defineProperty/funcs/texture/defineTexture";
import definePositiveNumber from "../../../../../defineProperty/funcs/number/definePositiveNumber";
import defineBoolean from "../../../../../defineProperty/funcs/defineBoolean";

/**
 * [KO] 옥타헤드럴 임포스터 머티리얼 인터페이스입니다.
 * [EN] Interface for octahedral impostor material properties.
 */
interface OctahedralImpostorMaterial {
    /**
     * [KO] 베이스 컬러 아틀라스 텍스처
     * [EN] Base color atlas texture
     */
    baseColorTexture: BitmapTexture | DirectTexture;
    /**
     * [KO] 베이스 컬러 텍스처 샘플러
     * [EN] Base color texture sampler
     */
    baseColorTextureSampler: Sampler;

    /**
     * [KO] 노멀 아틀라스 텍스처
     * [EN] Normal atlas texture
     */
    normalTexture: BitmapTexture | DirectTexture;
    /**
     * [KO] 노멀 텍스처 샘플러
     * [EN] Normal texture sampler
     */
    normalTextureSampler: Sampler;

    /**
     * [KO] 패킹 ORM (Occlusion/Roughness/Metallic) 아틀라스 텍스처
     * [EN] Packed ORM (Occlusion/Roughness/Metallic) atlas texture
     */
    packedORMTexture: BitmapTexture | DirectTexture;

    /**
     * [KO] 알파 컷오프(Cutout) 사용 여부
     * [EN] Whether alpha cutoff is enabled
     */
    useCutOff: boolean;
    /**
     * [KO] 알파 컷오프 임계값
     * [EN] Alpha cutoff threshold
     */
    cutOff: number;
    /**
     * [KO] 양면 렌더링 활성화 여부
     * [EN] Whether double-sided rendering is enabled
     */
    doubleSided: boolean;
    /**
     * [KO] 식생 전용 셰이딩 플래그
     * [EN] Foliage dedicated shading flag
     */
    isFoliage: boolean;
}

/**
 * [KO] 옥타헤드럴 임포스터 빌보드를 위한 전용 셰이더 및 텍스처를 바인딩하는 머티리얼 클래스입니다.
 * [EN] Dedicated material class binding shaders and textures for octahedral impostor billboards.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(buildFoliageImpostorSubMesh)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (buildFoliageImpostorSubMesh).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class OctahedralImpostorMaterial extends AUVTransformBaseMaterial {
    /**
     * [KO] OctahedralImpostorMaterial 인스턴스를 생성합니다.
     * [EN] Creates an OctahedralImpostorMaterial instance.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param baseColorTexture -
     * [KO] 베이스 컬러 아틀라스 텍스처
     * [EN] Base color atlas texture
     * @param normalTexture -
     * [KO] 노멀 아틀라스 텍스처
     * [EN] Normal atlas texture
     * @param packedORMTexture -
     * [KO] 패킹 ORM (Occlusion/Roughness/Metallic) 아틀라스 텍스처
     * [EN] Packed ORM (Occlusion/Roughness/Metallic) atlas texture
     * @param name -
     * [KO] 머티리얼 이름
     * [EN] Material name
     * @param gridSize -
     * [KO] 옥타헤드럴 아틀라스 그리드 분할 수 (기본값: 8.0)
     * [EN] Octahedral atlas grid division count (default: 8.0)
     */
    constructor(
        redGPUContext: RedGPUContext,
        baseColorTexture?: BitmapTexture | DirectTexture,
        normalTexture?: BitmapTexture | DirectTexture,
        packedORMTexture?: BitmapTexture | DirectTexture,
        name?: string,
        gridSize: number = 8.0
    ) {
        super(
            redGPUContext,
            'OCTAHEDRAL_IMPOSTOR_MATERIAL',
            fragmentModuleSource,
            2
        );
        if (name) this.name = name;
        this.baseColorTexture = baseColorTexture;
        this.baseColorTextureSampler = this.redGPUContext.resourceManager.basicSampler;

        this.normalTexture = normalTexture;
        this.normalTextureSampler = this.redGPUContext.resourceManager.basicSampler;

        this.packedORMTexture = packedORMTexture;

        this.useCutOff = true;
        this.cutOff = 0.3333;
        this.doubleSided = false;

        this.isFoliage = true;
        this.transparent = false;

        this.initGPURenderInfos();

    }
}

defineSampler(OctahedralImpostorMaterial, [
    {key: 'baseColorTextureSampler'},
    {key: 'normalTextureSampler'}
]);
defineTexture(OctahedralImpostorMaterial, [
    {key: 'baseColorTexture'},
    {key: 'normalTexture'},
    {key: 'packedORMTexture'}
]);

definePositiveNumber(OctahedralImpostorMaterial, [
    {key: 'cutOff', value: 0.35}
]);
defineBoolean(OctahedralImpostorMaterial, [
    {key: 'isFoliage', value: true}
]);
Object.defineProperty(OctahedralImpostorMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

Object.freeze(OctahedralImpostorMaterial);
export default OctahedralImpostorMaterial;
