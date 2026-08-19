import LandscapeComponent from "./LandscapeComponent";

export class LandscapeSpatialGrid {
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #halfWorldSizeX: number;
    #halfWorldSizeZ: number;

    #flatCells: LandscapeComponent[] = [];

    constructor(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number) {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
    }

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

    setConfig(tileCountX: number, tileCountZ: number, tileSizeX: number, tileSizeZ: number): void {
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#halfWorldSizeX = (tileCountX * tileSizeX) / 2;
        this.#halfWorldSizeZ = (tileCountZ * tileSizeZ) / 2;
        this.clearTiles();
    }

    clearTiles(): void {
        this.#flatCells.length = 0;
    }

    registerTile(row: number, col: number, component: LandscapeComponent): void {
        if (row >= 0 && row < this.#tileCountZ && col >= 0 && col < this.#tileCountX) {
            this.#flatCells.push(component);
        }
    }

    getCellCoordinates(x: number, z: number, outBuffer: Int32Array): void {
        const col = Math.floor((x + this.#halfWorldSizeX) / this.#tileSizeX);
        const row = Math.floor((z + this.#halfWorldSizeZ) / this.#tileSizeZ);

        outBuffer[0] = Math.min(Math.max(0, col), this.#tileCountX - 1);
        outBuffer[1] = Math.min(Math.max(0, row), this.#tileCountZ - 1);
    }

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
}

export default LandscapeSpatialGrid;
