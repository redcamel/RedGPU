import LandscapeComponent from "./LandscapeComponent";

/**
 * [KO] Landscape 타일 공간 관리자입니다 ($O(1)$ 공간 변환 2D 공간 격자).
 * [EN] Landscape tile spatial manager ($O(1)$ spatial transform 2D spatial grid).
 */
export class LandscapeSpatialGrid {
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #halfWorldSizeX: number;
    #halfWorldSizeZ: number;

    #cells: LandscapeComponent[][];
    #flatCells: LandscapeComponent[] = [];

    /**
     * [KO] LandscapeSpatialGrid 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeSpatialGrid.
     */
    constructor(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number) {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;

        this.#cells = Array.from({length: tileCountZ}, () => []);
    }

    /** [KO] 2D 평탄화된 타일 컴포넌트 리스트를 반환합니다. */
    get flatCells(): LandscapeComponent[] {
        return this.#flatCells;
    }

    get tileCountX(): number {
        return this.#tileCountX;
    }

    get tileCountZ(): number {
        return this.#tileCountZ;
    }

    get tileSizeX(): number {
        return this.#tileSizeX;
    }

    get tileSizeZ(): number {
        return this.#tileSizeZ;
    }

    /**
     * [KO] 특정 행, 열 위치에 타일 컴포넌트를 등록합니다.
     */
    registerTile(row: number, col: number, component: LandscapeComponent): void {
        if (row >= 0 && row < this.#tileCountZ && col >= 0 && col < this.#tileCountX) {
            this.#cells[row][col] = component;
            this.#flatCells.push(component);
        }
    }

    /**
     * [KO] 월드 좌표 (x, z)를 공간 격자 셀 행/열 좌표로 $O(1)$ 즉시 변환합니다 (Zero-GC 재사용 버퍼 작성).
     */
    getCellCoordinates(x: number, z: number, outBuffer: Int32Array): void {
        const col = Math.floor((x + this.#halfWorldSizeX) / this.#tileSizeX);
        const row = Math.floor((z + this.#halfWorldSizeZ) / this.#tileSizeZ);

        outBuffer[0] = Math.min(Math.max(0, col), this.#tileCountX - 1);
        outBuffer[1] = Math.min(Math.max(0, row), this.#tileCountZ - 1);
    }
}

export default LandscapeSpatialGrid;
