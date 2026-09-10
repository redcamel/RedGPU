import type Landscape from "../../../core/Landscape";

export class LandscapeFoliageSpatialGrid {

    static readonly MAX_ACTIVE_SUB_CELLS: number = 2048;

    #landscape: Landscape;
    #subCellSize: number = 100.0;
    #streamingRadius: number = 600.0;

    readonly #activeSubCellKeys: Int32Array = new Int32Array(LandscapeFoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS);
    readonly #activeSubCellKeySet: Set<number> = new Set();
    #activeSubCellCount: number = 0;

    #lastCamX: number = 1e9;
    #lastCamZ: number = 1e9;
    #lastRadius: number = -1;
    #lastCellSize: number = -1;
    #updateThresholdSq: number = 25.0;

    constructor(landscape: Landscape, subCellSize: number = 100.0, streamingRadius: number = 600.0) {
        this.#landscape = landscape;
        this.#subCellSize = Math.max(10.0, subCellSize);
        this.#streamingRadius = Math.max(10.0, streamingRadius);
    }

    get subCellSize(): number {
        return this.#subCellSize;
    }

    set subCellSize(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#subCellSize !== clamped) {
            this.#subCellSize = clamped;
            this.invalidateCache();
        }
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(val: number) {
        const clamped = Math.max(10.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.invalidateCache();
        }
    }

    get activeSubCellCount(): number {
        return this.#activeSubCellCount;
    }

    get activeSubCellKeys(): Int32Array {
        return this.#activeSubCellKeys;
    }

    get activeSubCellKeySet(): ReadonlySet<number> {
        return this.#activeSubCellKeySet;
    }

    invalidateCache(): void {
        this.#lastCamX = 1e9;
        this.#lastCamZ = 1e9;
    }

    update(camX: number, camZ: number, force: boolean = false): boolean {
        const dx = camX - this.#lastCamX;
        const dz = camZ - this.#lastCamZ;
        const distSq = dx * dx + dz * dz;

        if (!force && distSq < this.#updateThresholdSq &&
            this.#lastRadius === this.#streamingRadius &&
            this.#lastCellSize === this.#subCellSize) {
            return false;
        }

        this.#lastCamX = camX;
        this.#lastCamZ = camZ;
        this.#lastRadius = this.#streamingRadius;
        this.#lastCellSize = this.#subCellSize;

        const worldSizeX = this.#landscape.worldSize[0] || 16000.0;
        const worldSizeZ = this.#landscape.worldSize[1] || 16000.0;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;
        const cellSize = this.#subCellSize;
        const radius = this.#streamingRadius;

        const totalCellsX = Math.max(1, Math.floor(worldSizeX / cellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ / cellSize));

        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - radius + halfWorldX) / cellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + radius + halfWorldX) / cellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - radius + halfWorldZ) / cellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + radius + halfWorldZ) / cellSize)));

        const effectiveRadius = radius + cellSize * 0.70710678;
        const effectiveRadiusSq = effectiveRadius * effectiveRadius;

        let count = 0;
        const keys = this.#activeSubCellKeys;
        const maxCapacity = LandscapeFoliageSpatialGrid.MAX_ACTIVE_SUB_CELLS;

        for (let sz = minSZ; sz <= maxSZ; sz++) {
            const cellCenterZ = (sz + 0.5) * cellSize - halfWorldZ;
            const diffZ = cellCenterZ - camZ;
            const diffZSq = diffZ * diffZ;

            for (let sx = minSX; sx <= maxSX; sx++) {
                const cellCenterX = (sx + 0.5) * cellSize - halfWorldX;
                const diffX = cellCenterX - camX;

                if (diffX * diffX + diffZSq <= effectiveRadiusSq) {
                    if (count < maxCapacity) {
                        keys[count] = ((sz << 16) | (sx & 0xFFFF)) | 0;
                        count++;
                    }
                }
            }
        }

        this.#activeSubCellCount = count;
        this.#activeSubCellKeySet.clear();
        for (let i = 0; i < count; i++) {
            this.#activeSubCellKeySet.add(keys[i]);
        }
        return true;
    }
}

Object.freeze(LandscapeFoliageSpatialGrid);
export default LandscapeFoliageSpatialGrid;
