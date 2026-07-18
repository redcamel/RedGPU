import RedGPUContext from "../../context/RedGPUContext";
import fragmentModuleSource from "./fragment.wgsl";
import ABitmapBaseMaterial from "../../material/core/ABitmapBaseMaterial";

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class used for CDLOD terrain rendering.
 */
class TerrainMaterial extends ABitmapBaseMaterial {

    /**
     * [KO] TerrainMaterial 인스턴스를 생성합니다.
     * [EN] Creates a TerrainMaterial instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param displacementTexture - [KO] 적용할 초기 높이맵 비트맵 텍스처 (선택) [EN] Initial heightmap texture to apply (optional)
     * @param name - [KO] 머티리얼 이름(옵션) [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, displacementTexture?: any, name?: string) {
        super(
            redGPUContext,
            "TERRAIN_MATERIAL",
            fragmentModuleSource,
            2 // Bind group index 2 (Material group)
        );

        if (name) this.name = name;
        this.initGPURenderInfos();
    }
}

Object.defineProperty(TerrainMaterial.prototype, 'isBuiltInMaterial', {
    value: true,
    writable: false
});

Object.freeze(TerrainMaterial);
export default TerrainMaterial;
