import LandscapeComponent from "./LandscapeComponent";

/**
 * [KO] 3D 월드 공간 좌표와 2D 공간 셀 직교 좌표 간 변환 및 그리드 셀 관리를 전담하는 SpatialGrid 클래스입니다 (가로/세로 독립 비정방 지원).
 * [EN] SpatialGrid class that manages 2D spatial cell orthogonal coordinates and transforms with 3D world space (supports non-square X/Z ratios).
 */
export class LandscapeSpatialGrid {
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #halfWorldSizeX: number;
    #halfWorldSizeZ: number;
    #gridCells: (LandscapeComponent | null)[][];
    #flatCells: LandscapeComponent[] = [];

    /**
     * [KO] LandscapeSpatialGrid 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSpatialGrid.
     *
     * @param tileCountX - [KO] 가로 타일 개수 [EN] Number of tiles along width (X)
     * @param tileCountZ - [KO] 세로 타일 개수 [EN] Number of tiles along height (Z)
     * @param tileSizeX - [KO] 단일 타일 X 크기 [EN] Single tile X size
     * @param tileSizeZ - [KO] 단일 타일 Z 크기 [EN] Single tile Z size
     */
    constructor(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number) {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;

        // 2D 셀 그리드 배열 사전 할당 [row(Z)][col(X)] (Zero-GC)
        this.#gridCells = new Array(tileCountZ);
        for (let row = 0; row < tileCountZ; row++) {
            this.#gridCells[row] = new Array(tileCountX).fill(null);
        }
    }

    /**
     * [KO] 전체 타일 1차원 리스트를 반환합니다.
     * [EN] Returns the flat array of all registered tiles.
     */
    public get flatCells(): LandscapeComponent[] {
        return this.#flatCells;
    }

    public get tileCountX(): number {
        return this.#tileCountX;
    }

    public get tileCountZ(): number {
        return this.#tileCountZ;
    }

    public get tileSizeX(): number {
        return this.#tileSizeX;
    }

    public get tileSizeZ(): number {
        return this.#tileSizeZ;
    }

    /**
     * [KO] 지정된 행/열 좌표에 컴포넌트 타일을 등록합니다.
     * [EN] Registers a component tile at the specified row/column coordinates.
     */
    public registerTile(row: number, col: number, component: LandscapeComponent): void {
        if (row >= 0 && row < this.#tileCountZ && col >= 0 && col < this.#tileCountX) {
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
        const col = Math.floor((worldX + this.#halfWorldSizeX) / this.#tileSizeX);
        const row = Math.floor((worldZ + this.#halfWorldSizeZ) / this.#tileSizeZ);
        outCell[0] = Math.max(0, Math.min(this.#tileCountZ - 1, row));
        outCell[1] = Math.max(0, Math.min(this.#tileCountX - 1, col));
    }

    /**
     * [KO] 특정 행/열 위치의 타일 컴포넌트를 $O(1)$로 가져옵니다.
     * [EN] Retrieves the tile component at a specific row/col location in O(1).
     */
    public getTile(row: number, col: number): LandscapeComponent | null {
        if (row >= 0 && row < this.#tileCountZ && col >= 0 && col < this.#tileCountX) {
            return this.#gridCells[row][col];
        }
        return null;
    }
}

export default LandscapeSpatialGrid;
