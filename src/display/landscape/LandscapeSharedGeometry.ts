import RedGPUContext from "../../context/RedGPUContext";
import Plane from "../../primitive/Plane";

/**
 * [KO] Landscape LOD 0 ~ LOD N 단계별 공유 Plane 지오메트리를 사전 생성 및 보관하는 클래스입니다.
 * [EN] Class that pre-creates and retains shared Plane geometries for Landscape LOD levels 0 to N.
 */
export class LandscapeSharedGeometry {
    #geometries: Plane[] = [];

    /**
     * [KO] LandscapeSharedGeometry 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSharedGeometry.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param tileSize - [KO] 타일 크기 [EN] Tile size
     * @param gridSize - [KO] 타일당 최고 LOD 쿼드 해상도 (기본 64) [EN] Base grid quad resolution for LOD 0 (default 64)
     * @param lodCount - [KO] LOD 단계 수 [EN] Number of LOD levels
     */
    constructor(redGPUContext: RedGPUContext, tileSize: number, gridSize: number, lodCount: number) {
        for (let level = 0; level < lodCount; level++) {
            const quadRes = Math.max(1, Math.floor(gridSize / Math.pow(2, level)));
            // XZ 평면(지형)에 맞게 렌더링되도록 Plane 지오메트리 생성
            const plane = new Plane(redGPUContext, tileSize, tileSize, quadRes, quadRes);
            this.#geometries.push(plane);
        }
    }

    /**
     * [KO] 전체 사전 생성된 지오메트리 리스트를 반환합니다.
     * [EN] Returns the entire list of pre-created geometries.
     */
    public get geometries(): Plane[] {
        return this.#geometries;
    }

    /**
     * [KO] 지정된 LOD 레벨에 해당하는 공유 지오메트리를 반환합니다.
     * [EN] Returns the shared geometry corresponding to the specified LOD level.
     *
     * @param lodLevel - [KO] LOD 레벨 번호 [EN] LOD level index
     */
    public getGeometry(lodLevel: number): Plane {
        const index = Math.min(Math.max(0, lodLevel), this.#geometries.length - 1);
        return this.#geometries[index];
    }
}

export default LandscapeSharedGeometry;
