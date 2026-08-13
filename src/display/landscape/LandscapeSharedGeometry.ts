import RedGPUContext from "../../context/RedGPUContext";
import Plane from "../../primitive/Plane";

/**
 * [KO] Landscape LOD 0 ~ LOD N 단계별 공유 Plane 지오메트리를 사전 생성 및 보관하는 클래스입니다.
 * [EN] Class that pre-creates and retains shared Plane geometries for Landscape LOD levels 0 to N.
 */
export class LandscapeSharedGeometry {
    #redGPUContext: RedGPUContext;
    #tileSizeX: number;
    #tileSizeZ: number;
    #gridSize: number;
    #lodCount: number;
    #geometries: Plane[] = [];

    /**
     * [KO] LandscapeSharedGeometry 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSharedGeometry.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param tileSizeX - [KO] 타일 X 크기 [EN] Tile X size
     * @param tileSizeZ - [KO] 타일 Z 크기 [EN] Tile Z size
     * @param gridSize - [KO] 타일당 최고 LOD 쿼드 해상도 (기본 64) [EN] Base grid quad resolution for LOD 0 (default 64)
     * @param lodCount - [KO] LOD 단계 수 [EN] Number of LOD levels
     */
    constructor(redGPUContext: RedGPUContext, tileSizeX: number, tileSizeZ: number, gridSize: number, lodCount: number) {
        this.#redGPUContext = redGPUContext;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#gridSize = gridSize;
        this.#lodCount = lodCount;

        this.#buildGeometries();
    }

    /**
     * [KO] 전체 사전 생성된 지오메트리 리스트를 반환합니다.
     * [EN] Returns the entire list of pre-created geometries.
     */
    public get geometries(): Plane[] {
        return this.#geometries;
    }

    public get tileSizeX(): number {
        return this.#tileSizeX;
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

    public get tileSizeZ(): number {
        return this.#tileSizeZ;
    }

    /**
     * [KO] 타일 크기(tileSizeX, tileSizeZ)가 동적 변경되었을 때 공유 지오메트리 버퍼들을 새로 재생성합니다.
     * [EN] Recreates shared geometry buffers when the tile sizes change dynamically.
     */
    public updateTileSize(newTileSizeX: number, newTileSizeZ: number): void {
        if (newTileSizeX > 0 && newTileSizeZ > 0 && (this.#tileSizeX !== newTileSizeX || this.#tileSizeZ !== newTileSizeZ)) {
            this.#tileSizeX = newTileSizeX;
            this.#tileSizeZ = newTileSizeZ;
            this.#buildGeometries();
        }
    }

    #buildGeometries(): void {
        this.#geometries.length = 0;
        for (let level = 0; level < this.#lodCount; level++) {
            const quadRes = Math.max(1, Math.floor(this.#gridSize / Math.pow(2, level)));
            // XZ 평면에 맞게 tileSizeX, tileSizeZ 크기로 Plane 지오메트리 생성
            const plane = new Plane(this.#redGPUContext, this.#tileSizeX, this.#tileSizeZ, quadRes, quadRes);
            this.#geometries.push(plane);
        }
    }
}

export default LandscapeSharedGeometry;
