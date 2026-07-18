import RedGPUContext from "../../context/RedGPUContext";
import PBRMaterial from "../../material/pbrMaterial/PBRMaterial";

/**
 * [KO] CDLOD 지형 렌더링에 사용되는 전용 머티리얼 클래스입니다.
 * [EN] Dedicated material class used for CDLOD terrain rendering.
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
    }
}

Object.defineProperty(TerrainMaterial.prototype, 'isPBRMaterial', {
    value: true,
    writable: false
});

Object.freeze(TerrainMaterial);
export default TerrainMaterial;
