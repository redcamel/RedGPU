import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../../LandscapeMaterial";
/**
 * [KO] 지형 머티리얼의 다중 레이어를 합성하여 가상 블렌드 텍스처(VBT: BaseColor, Normal, ORM) 아틀라스와 밉맵 체인을 생성하는 클래스입니다.
 * [EN] Class that composites multiple terrain material layers to generate Virtual Blend Texture (VBT: BaseColor, Normal, ORM) atlases and mipmap chains.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeVBTGenerator extends ALandscapeAtlasGenerator {
    #private;
    /**
     * [KO] `LandscapeVBTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVBTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] VNT 아틀라스와 `LandscapeMaterial`의 레이어 데이터를 기반으로 전체 VBT 아틀라스(BaseColor, Normal, ORM) 및 밉맵을 베이킹합니다.
     * [EN] Bakes the full VBT atlases (BaseColor, Normal, ORM) and mipmaps based on the VNT atlas and layer data of `LandscapeMaterial`.
     *
     * @param vntAtlas -
     * [KO] 가상 노멀 텍스처(VNT) 아틀라스
     * [EN] Virtual Normal Texture (VNT) atlas
     * @param vbtBaseColorArray -
     * [KO] 베이킹 결과를 저장할 VBT BaseColor 아틀라스 텍스처
     * [EN] VBT BaseColor atlas texture to store the baked result
     * @param vbtNormalArray -
     * [KO] 베이킹 결과를 저장할 VBT Normal 아틀라스 텍스처
     * [EN] VBT Normal atlas texture to store the baked result
     * @param vbtORMArray -
     * [KO] 베이킹 결과를 저장할 VBT ORM(Occlusion, Roughness, Metallic) 아틀라스 텍스처
     * [EN] VBT ORM (Occlusion, Roughness, Metallic) atlas texture to store the baked result
     * @param material -
     * [KO] 합성할 레이어 정보를 가진 `LandscapeMaterial` 인스턴스
     * [EN] `LandscapeMaterial` instance containing layer information to composite
     * @param singleTilePixels -
     * [KO] 단일 타일당 픽셀 해상도 (기본값: `256`)
     * [EN] Pixel resolution per single tile (default: `256`)
     */
    bakeAtlas(vntAtlas: DirectTexture, vbtBaseColorArray: DirectTexture, vbtNormalArray: DirectTexture, vbtORMArray: DirectTexture, material: LandscapeMaterial, singleTilePixels?: number): void;
    /**
     * [KO] VBT 베이킹 및 타일 밉맵 생성에 사용된 GPU 버퍼와 캐시를 모두 해제합니다.
     * [EN] Releases all GPU buffers and caches used for VBT baking and tile mipmap generation.
     */
    destroy(): void;
}
export default LandscapeVBTGenerator;
