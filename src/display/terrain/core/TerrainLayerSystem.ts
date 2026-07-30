import Mesh from "../../mesh/Mesh";
import RedGPUContext from "../../../context/RedGPUContext";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial, {TerrainLayerConfig} from "./material/TerrainMaterial";

class TerrainLayerSystem extends Mesh {
    constructor(redGPUContext: RedGPUContext, verticesPerSide: number = 64) {
        const geometry = new TerrainGeometry(redGPUContext, verticesPerSide);
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

    addLayer(config: TerrainLayerConfig): number {
        return this.material.addLayer(config);
    }

    removeLayer(indexOrName: number | string): boolean {
        return this.material.removeLayer(indexOrName);
    }

    updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        return this.material.updateLayer(indexOrName, partialConfig);
    }
}

Object.freeze(TerrainLayerSystem);
export default TerrainLayerSystem;