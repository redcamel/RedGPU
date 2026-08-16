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

    get worldSizeX(): number {
        return this.#tileCountX * this.#tileSizeX;
    }

    get worldSizeZ(): number {
        return this.#tileCountZ * this.#tileSizeZ;
    }

    get halfWorldSizeX(): number {
        return this.#halfWorldSizeX;
    }

    get halfWorldSizeZ(): number {
        return this.#halfWorldSizeZ;
    }

    /**
     * [KO] 공간 격자의 타일 개수 및 타일 크기를 동적으로 재설정합니다.
     * [EN] Dynamically reconfigures tile count and tile size of the spatial grid.
     */
    setConfig(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number): void {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
        this.clearTiles();
    }

    /**
     * [KO] 타일 등록을 초기화합니다.
     */
    clearTiles(): void {
        this.#flatCells.length = 0;
    }

    /**
     * [KO] 특정 행, 열 위치에 타일 컴포넌트를 등록합니다.
     */
    registerTile(row: number, col: number, component: LandscapeComponent): void {
        if (row >= 0 && row < this.#tileCountZ && col >= 0 && col < this.#tileCountX) {
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

    /**
     * [KO] 카메라 위치 (camX, camZ)와 시야 반경(loadingRadius) 내의 컴포넌트 타일들을 재사용 배열(outArray)에 작성합니다 (Zero-GC).
     * @returns 반경 내 활성 컴포넌트 타일 수
     */
    getActiveComponentsInRadius(camX: number, camZ: number, loadingRadius: number, outArray: LandscapeComponent[]): number {
        outArray.length = 0;
        const radiusSq = loadingRadius * loadingRadius;

        const minCol = Math.max(0, Math.floor((camX - loadingRadius + this.#halfWorldSizeX) / this.#tileSizeX));
        const maxCol = Math.min(this.#tileCountX - 1, Math.floor((camX + loadingRadius + this.#halfWorldSizeX) / this.#tileSizeX));

        const minRow = Math.max(0, Math.floor((camZ - loadingRadius + this.#halfWorldSizeZ) / this.#tileSizeZ));
        const maxRow = Math.min(this.#tileCountZ - 1, Math.floor((camZ + loadingRadius + this.#halfWorldSizeZ) / this.#tileSizeZ));

        for (let r = minRow; r <= maxRow; r++) {
            const rowOffset = r * this.#tileCountX;
            for (let c = minCol; c <= maxCol; c++) {
                const comp = this.#flatCells[rowOffset + c];
                if (comp) {
                    const dx = comp.worldX - camX;
                    const dz = comp.worldZ - camZ;
                    if (dx * dx + dz * dz <= radiusSq) {
                        outArray.push(comp);
                    }
                }
            }
        }
        return outArray.length;
    }

    getTilesInRadiusZeroGC(camX: number, camZ: number, loadingRadius: number, outArray: LandscapeComponent[]): number {
        return this.getActiveComponentsInRadius(camX, camZ, loadingRadius, outArray);
    }
}

export default LandscapeSpatialGrid;
