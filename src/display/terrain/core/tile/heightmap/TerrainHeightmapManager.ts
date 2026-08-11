import RedGPUContext from "../../../../../context/RedGPUContext";
import {SpatialTileInfo} from "../TerrainSpatialGrid";

const INV_65535 = 1.0 / 65535.0;

export interface TerrainHeightmapOptions {
    atlasTileCountX?: number;
    atlasTileCountZ?: number;
    atlasTileSize?: number;
}

export default class TerrainHeightmapManager {
    readonly redGPUContext: RedGPUContext;
    #atlasTileCountX: number = 16;
    #atlasTileCountZ: number = 16;
    #atlasTileSize: number = 512;
    #totalWidthCache: number = 8192;
    #maxPixelIdxCache: number = 8191;

    #flatHeightmapData: Uint16Array;
    #tileDataCache: Map<string, ArrayBufferView | ArrayBuffer> = new Map();
    #synthesizedTilesSet: Set<string> = new Set();

    constructor(redGPUContext: RedGPUContext, options?: TerrainHeightmapOptions) {
        this.redGPUContext = redGPUContext;
        this.#atlasTileCountX = options?.atlasTileCountX ?? 16;
        this.#atlasTileCountZ = options?.atlasTileCountZ ?? 16;
        this.#atlasTileSize = options?.atlasTileSize ?? 512;

        this.#updateDimensionsCache();

        const totalWidth = this.#totalWidthCache;
        const totalHeight = this.#atlasTileCountZ * this.#atlasTileSize;
        this.#flatHeightmapData = new Uint16Array(totalWidth * totalHeight);
    }

    getTerrainHeight(
        x: number,
        z: number,
        worldOffset: [number, number],
        worldSize: [number, number],
        minHeight: number,
        maxHeight: number
    ): number {
        const invWorldW = 1.0 / worldSize[0];
        const invWorldH = 1.0 / worldSize[1];
        const [offX, offZ] = worldOffset;

        const u = Math.max(0, Math.min(1, (x - offX) * invWorldW));
        const v = Math.max(0, Math.min(1, (z - offZ) * invWorldH));

        const maxPixelIdx = this.#maxPixelIdxCache;
        const totalWidth = this.#totalWidthCache;

        const tx = u * maxPixelIdx;
        const tz = (1.0 - v) * maxPixelIdx;

        const x0 = Math.floor(tx);
        const x1 = Math.min(maxPixelIdx, x0 + 1);
        const z0 = Math.floor(tz);
        const z1 = Math.min(maxPixelIdx, z0 + 1);

        const fx = tx - x0;
        const fz = tz - z0;

        const flatData = this.#flatHeightmapData;

        const ix0 = Math.max(0, Math.min(maxPixelIdx, x0));
        const ix1 = Math.max(0, Math.min(maxPixelIdx, x1));
        const iz0 = Math.max(0, Math.min(maxPixelIdx, z0));
        const iz1 = Math.max(0, Math.min(maxPixelIdx, z1));

        const q00 = flatData[iz0 * totalWidth + ix0] || 0;
        const q10 = flatData[iz0 * totalWidth + ix1] || 0;
        const q01 = flatData[iz1 * totalWidth + ix0] || 0;
        const q11 = flatData[iz1 * totalWidth + ix1] || 0;

        const val = (1.0 - fx) * (1.0 - fz) * q00 +
            fx * (1.0 - fz) * q10 +
            (1.0 - fx) * fz * q01 +
            fx * fz * q11;

        const ratio = val * INV_65535;
        return minHeight + ratio * (maxHeight - minHeight);
    }

    get atlasTileCountX(): number {
        return this.#atlasTileCountX;
    }

    get atlasTileCountZ(): number {
        return this.#atlasTileCountZ;
    }

    get atlasTileSize(): number {
        return this.#atlasTileSize;
    }

    get flatHeightmapData(): Uint16Array {
        return this.#flatHeightmapData;
    }

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#tileDataCache;
    }

    get synthesizedTileCount(): number {
        return this.#synthesizedTilesSet.size;
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        return this.#synthesizedTilesSet.has(key);
    }

    markTileSynthesized(tile: SpatialTileInfo | string): void {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);
        this.#synthesizedTilesSet.add(key);
    }

    #updateDimensionsCache() {
        this.#totalWidthCache = this.#atlasTileCountX * this.#atlasTileSize;
        this.#maxPixelIdxCache = this.#totalWidthCache - 1;
    }

    registerTileData(tile: SpatialTileInfo | string, data: any, spatialGrid?: any): void {
        const key = typeof tile === 'string' ? tile : (tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`);

        if (this.#tileDataCache.has(key)) {
            this.#tileDataCache.delete(key);
        }

        this.#tileDataCache.set(key, data);
        this.updateFlatHeightmapSector(key, data);

        const MAX_CACHE_SIZE = 128;
        if (this.#tileDataCache.size > MAX_CACHE_SIZE) {
            const keysIterator = this.#tileDataCache.keys();
            for (const oldestKey of keysIterator) {
                const isActive = spatialGrid &&
                    (spatialGrid.activeTiles.has(oldestKey) ||
                        Array.from(spatialGrid.activeTiles.values()).some((t: any) => t.atlasKey === oldestKey));

                if (!isActive) {
                    this.#tileDataCache.delete(oldestKey);
                    break;
                }
            }
        }
    }

    updateFlatHeightmapSector(key: string, data: any): void {
        const parts = key.split('_');
        const tileCol = parseInt(parts[0], 10);
        const tileRow = parseInt(parts[1], 10);

        const tileSize = this.#atlasTileSize;
        const totalWidth = this.#atlasTileCountX * tileSize;

        let tileData: Uint16Array;
        if (data instanceof Float32Array) {
            tileData = new Uint16Array(data.length);
            for (let i = 0; i < data.length; i++) tileData[i] = data[i] * 65535.0;
        } else if (data instanceof Uint16Array) {
            tileData = data;
        } else if (data instanceof ArrayBuffer) {
            tileData = new Uint16Array(data);
        } else if (ArrayBuffer.isView(data)) {
            tileData = new Uint16Array(data.buffer, data.byteOffset, data.byteLength / 2);
        } else {
            return;
        }

        const startX = tileCol * tileSize;
        const startZ = tileRow * tileSize;

        for (let tz = 0; tz < tileSize; tz++) {
            const srcOffset = tz * tileSize;
            const dstOffset = (startZ + tz) * totalWidth + startX;
            this.#flatHeightmapData.set(
                tileData.subarray(srcOffset, srcOffset + tileSize),
                dstOffset
            );
        }
    }

    destroy(): void {
        this.#tileDataCache.clear();
        this.#synthesizedTilesSet.clear();
    }
}
