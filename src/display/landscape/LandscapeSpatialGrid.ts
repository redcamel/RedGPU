import LandscapeComponent from "./LandscapeComponent";

/**
 * [KO] 3D 월드 공간 좌표와 2D 공간 셀 직교 좌표 간 변환 및 그리드 셀 관리를 전담하는 SpatialGrid 클래스입니다.
 * [EN] SpatialGrid class that manages 2D spatial cell orthogonal coordinates and transforms with 3D world space.
 */
export class LandscapeSpatialGrid {
    #tileCount: number;
    #tileSize: number;
    #halfWorldSize: number;
    #gridCells: (LandscapeComponent | null)[][];
    #flatCells: LandscapeComponent[] = [];

    /**
     * [KO] LandscapeSpatialGrid 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSpatialGrid.
     *
     * @param tileCount - [KO] 가로/세로 타일 개수 [EN] Number of tiles along width/height
     * @param tileSize - [KO] 단일 타일 크기 [EN] Single tile size
     */
    constructor(tileCount: number, tileSize: number) {
        this.#tileCount = tileCount;
        this.#tileSize = tileSize;
        this.#halfWorldSize = (tileCount * tileSize) / 2;

        // 2D 셀 그리드 배열 사전 할당 (Zero-GC)
        this.#gridCells = new Array(tileCount);
        for (let row = 0; row < tileCount; row++) {
            this.#gridCells[row] = new Array(tileCount).fill(null);
        }
    }

    /**
     * [KO] 전체 타일 1차원 리스트를 반환합니다.
     * [EN] Returns the flat array of all registered tiles.
     */
    public get flatCells(): LandscapeComponent[] {
        return this.#flatCells;
    }

    public get tileCount(): number {
        return this.#tileCount;
    }

    public get tileSize(): number {
        return this.#tileSize;
    }

    /**
     * [KO] 지정된 행/열 좌표에 컴포넌트 타일을 등록합니다.
     * [EN] Registers a component tile at the specified row/column coordinates.
     */
    public registerTile(row: number, col: number, component: LandscapeComponent): void {
        if (row >= 0 && row < this.#tileCount && col >= 0 && col < this.#tileCount) {
            this.#gridCells[row][col] = component;
            this.#flatCells.push(component);
        }
    }

    /**
     * [KO] 월드 3D 좌표 (x, z)를 2D 그리드 셀 좌표 (row, col)로 $O(1)$ 변환합니다.
     * [EN] Transforms world 3D coordinates (x, z) into 2D grid cell coordinates (row, col) in O(1).
     *
     * @param worldX - [KO] 월드 X 좌표 [EN] World X coordinate
     * @param worldZ - [KO] 월드 Z 좌표 [EN] World Z coordinate
     * @param outCell - [KO] 결과를 담을 [row, col] 배열 [EN] Result [row, col] array
     */
    public getCellCoordinates(worldX: number, worldZ: number, outCell: Int32Array | number[]): void {
        const col = Math.floor((worldX + this.#halfWorldSize) / this.#tileSize);
        const row = Math.floor((worldZ + this.#halfWorldSize) / this.#tileSize);
        outCell[0] = Math.max(0, Math.min(this.#tileCount - 1, row));
        outCell[1] = Math.max(0, Math.min(this.#tileCount - 1, col));
    }

    /**
     * [KO] 특정 행/열 위치의 타일 컴포넌트를 $O(1)$로 가져옵니다.
     * [EN] Retrieves the tile component at a specific row/col location in O(1).
     */
    public getTile(row: number, col: number): LandscapeComponent | null {
        if (row >= 0 && row < this.#tileCount && col >= 0 && col < this.#tileCount) {
            return this.#gridCells[row][col];
        }
        return null;
    }
}

export default LandscapeSpatialGrid;
