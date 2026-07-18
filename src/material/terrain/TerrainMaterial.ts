import RedGPUContext from "../../context/RedGPUContext";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import fragmentModuleSource from "./fragment.wgsl";
import ABaseMaterial from "../core/ABaseMaterial";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";

/**
 * [KO] 지형 렌더링에 사용되는 전용 PBR 머티리얼의 1단계 높이맵 바인딩 규격 클래스입니다.
 * [EN] Dedicated PBR material class for terrain rendering, supporting step 1 heightmap binding.
 */
interface TerrainMaterial {
    /**
     * [KO] 지형의 Y축 고도를 투영할 높이맵 비트맵 텍스처
     * [EN] Heightmap bitmap texture to project Y-axis elevation of the terrain
     */
    heightTexture: BitmapTexture;
    /**
     * [KO] 높이맵 텍스처 전용 샘플러
     * [EN] Dedicated sampler for heightmap texture
     */
    heightTextureSampler: Sampler;
}

class TerrainMaterial extends ABaseMaterial {
    /**
     * [KO] TerrainMaterial 인스턴스를 생성합니다.
     * [EN] Creates a TerrainMaterial instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param heightTexture - [KO] 적용할 초기 높이맵 비트맵 텍스처 (선택) [EN] Initial heightmap texture to apply (optional)
     * @param name - [KO] 머티리얼 이름 [EN] Material name
     */
    constructor(redGPUContext: RedGPUContext, heightTexture?: BitmapTexture, name?: string) {
        super(
            redGPUContext,
            "TERRAIN_MATERIAL",
            fragmentModuleSource,
            2 // Bind group index 2 (Material group)
        );
        if (name) this.name = name;
        this.heightTexture = heightTexture;
        this.heightTextureSampler = new Sampler(this.redGPUContext);
        this.initGPURenderInfos();
    }
}

// 텍스처 및 샘플러 프로퍼티 정의 주입
defineSampler(TerrainMaterial, [
    {key: "heightTextureSampler"}
]);
defineTexture(TerrainMaterial, [
    {key: "heightTexture"}
]);

Object.freeze(TerrainMaterial);
export default TerrainMaterial;
