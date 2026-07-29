import Mesh from "../mesh/Mesh";
import RedGPUContext from "../../context/RedGPUContext";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial, {TerrainLayerConfig} from "./material/TerrainMaterial";

class TerrainLayerSystem extends Mesh {
    constructor(redGPUContext: RedGPUContext) {
        const geometry = new TerrainGeometry(redGPUContext);
        const material = new TerrainMaterial(redGPUContext);
        super(redGPUContext, geometry, material);
    }

    override get material(): TerrainMaterial {
        return super.material as TerrainMaterial;
    }

    override set material(val: any) {
        throw new Error('Terrain.material is read-only and cannot be reassigned.');
    }

    get layers(): TerrainLayerConfig[] {
        return this.material.layers || [];
    }

    /**
     * [KO] 단일 지형 디테일 레이어를 추가합니다. (최대 4개)
     * [EN] Adds a single terrain detail layer. (Maximum 4)
     */
    addLayer(config: TerrainLayerConfig): number {
        return this.material.addLayer(config);
    }

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어를 제거합니다.
     * [EN] Removes a specific layer by index or name.
     */
    removeLayer(indexOrName: number | string): boolean {
        return this.material.removeLayer(indexOrName);
    }

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어의 속성을 부분 수정합니다.
     * [EN] Partially updates properties of a specific layer by index or name.
     */
    updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        return this.material.updateLayer(indexOrName, partialConfig);
    }
}

Object.freeze(TerrainLayerSystem);
export default TerrainLayerSystem;