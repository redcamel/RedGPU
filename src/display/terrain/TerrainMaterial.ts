import RedGPUContext from "../../context/RedGPUContext";
import PBRMaterial from "../../material/pbrMaterial/PBRMaterial";

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * PBRMaterial을 상속하며, 언리얼 엔진 Landscape 기준에 맞는 초기 재질 값을 사용합니다.
 *
 * [EN] Dedicated material class used for CDLOD terrain rendering.
 * Extends PBRMaterial with initial material values based on Unreal Engine Landscape defaults.
 */
class TerrainMaterial extends PBRMaterial {

    /**
     * [KO] TerrainMaterial 인스턴스를 생성합니다.
     * [EN] Creates a TerrainMaterial instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param name - [KO] 머티리얼 이름(옵션) [EN] Material name (optional)
     */
    constructor(redGPUContext: RedGPUContext, name?: string) {
        super(redGPUContext);
        if (name) this.name = name;

        // [KO] 언리얼 엔진 Landscape 기본값 기준 초기 재질 설정
        // [EN] Initial material settings based on Unreal Engine Landscape defaults

        // 지형은 비금속 (흙, 모래, 암석 등)
        // Terrain is non-metallic (dirt, sand, rock, etc.)
        this.metallicFactor = 0.0;

        // 지형 표면은 거칠다 (Unreal Landscape 기본 Roughness ≈ 0.85)
        // Terrain surface is rough (Unreal Landscape default Roughness ≈ 0.85)
        this.roughnessFactor = 1;

        // 흙빛 베이스 컬러 (텍스처 미설정 시 기본 지면 색상)
        // Earthy base color (default ground color when no texture is assigned)
        this.baseColorFactor = [0.5, 0.45, 0.38, 1.0];
    }
}

Object.freeze(TerrainMaterial);
export default TerrainMaterial;
