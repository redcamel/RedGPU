import RedGPUContext from "../../../context/RedGPUContext";
import TerrainMaterialBind from "./TerrainMaterialBind";

interface TerrainTileSystem {

}

class TerrainTileSystem extends TerrainMaterialBind {

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);

    }
};


Object.freeze(TerrainTileSystem);
export default TerrainTileSystem;