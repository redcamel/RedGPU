import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial from "./TerrainMaterial";
import BitmapTexture from "../../resources/texture/BitmapTexture";

/**
 * [KO] CDLOD 기반 지형 시스템을 총괄하는 디스플레이 메시 객체 클래스입니다.
 * [EN] Display mesh object class that manages the CDLOD-based terrain system.
 *
 * ### Example
 * ```typescript
 * const terrain = new RedGPU.Display.Terrain(redGPUContext, "assets/heightmap.png");
 * scene.addChild(terrain);
 * ```
 * @category Mesh
 */
class Terrain extends Mesh {
    /**
     * [KO] Terrain 인스턴스를 생성합니다.
     * [EN] Creates a Terrain instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param heightmapUrl - [KO] 지형 높이맵 이미지의 자원 경로 (선택) [EN] Resource URL of the terrain heightmap image (optional)
     * @param name - [KO] 지형 객체 이름 [EN] Terrain object name
     */
    constructor(redGPUContext: RedGPUContext, heightmapUrl?: string, name?: string) {
        const geometry = new TerrainGeometry(redGPUContext);
        const heightTexture = heightmapUrl ? new BitmapTexture(redGPUContext, heightmapUrl) : undefined;
        const material = new TerrainMaterial(redGPUContext, heightTexture);

        super(redGPUContext, geometry, material, name);
    }

    /**
     * [KO] 지형의 Y축 높이를 투영할 높이맵 비트맵 텍스처를 반환하거나 설정합니다.
     * [EN] Gets or sets the heightmap bitmap texture to project Y-axis elevation.
     */
    get heightTexture(): BitmapTexture {
        return (this.material as TerrainMaterial).heightTexture;
    }

    set heightTexture(value: BitmapTexture) {
        (this.material as TerrainMaterial).heightTexture = value;
    }
}

Object.freeze(Terrain);
export default Terrain;
