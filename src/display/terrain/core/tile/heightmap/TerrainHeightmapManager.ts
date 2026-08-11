import RedGPUContext from "../../../../../context/RedGPUContext";
import {SpatialTileInfo} from "../TerrainSpatialGrid";

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

    #flatHeightmapData: Uint16Array;
    #tileDataCache: Map<string, ArrayBufferView | ArrayBuffer> = new Map();
    #synthesizedTilesSet: Set<string> = new Set();

    constructor(redGPUContext: RedGPUContext, options?: TerrainHeightmapOptions) {
        this.redGPUContext = redGPUContext;
        this.#atlasTileCountX = options?.atlasTileCountX ?? 16;
        this.#atlasTileCountZ = options?.atlasTileCountZ ?? 16;
        this.#atlasTileSize = options?.atlasTileSize ?? 512;

        const totalHeightmapDataSize = (this.#atlasTileCountX * this.#atlasTileSize) * (this.#atlasTileCountZ * this.#atlasTileSize);
        this.#flatHeightmapData = new Uint16Array(totalHeightmapDataSize);
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

    getTerrainHeight(
        x: number,
        z: number,
        worldOffset: [number, number],
        worldSize: [number, number],
        minHeight: number,
        maxHeight: number
    ): number {
        const [worldW, worldH] = worldSize;
        const [offX, offZ] = worldOffset;

        const tileSize = this.#atlasTileSize;
        const tileCount = this.#atlasTileCountX;

        const u = Math.max(0, Math.min(1, (x - offX) / worldW));
        const v = Math.max(0, Math.min(1, (z - offZ) / worldH));

        const totalWidth = tileCount * tileSize;
        const maxPixelIdx = totalWidth - 1;

        const tx = u * maxPixelIdx;
        const tz = (1.0 - v) * maxPixelIdx;

        const x0 = Math.floor(tx);
        const x1 = Math.min(maxPixelIdx, x0 + 1);
        const z0 = Math.floor(tz);
        const z1 = Math.min(maxPixelIdx, z0 + 1);

        const fx = tx - x0;
        const fz = tz - z0;

        const flatData = this.#flatHeightmapData;

        const getVal = (px: number, pz: number): number => {
            const ix = Math.max(0, Math.min(maxPixelIdx, Math.floor(px)));
            const iz = Math.max(0, Math.min(maxPixelIdx, Math.floor(pz)));
            const val = flatData[iz * totalWidth + ix];
            return val !== undefined ? val : 0;
        };

        const q00 = getVal(x0, z0);
        const q10 = getVal(x1, z0);
        const q01 = getVal(x0, z1);
        const q11 = getVal(x1, z1);

        const val = (1.0 - fx) * (1.0 - fz) * q00 +
            fx * (1.0 - fz) * q10 +
            (1.0 - fx) * fz * q01 +
            fx * fz * q11;

        const ratio = val / 65535.0;
        return minHeight + ratio * (maxHeight - minHeight);
    }

    registerTileData(tile: SpatialTileInfo | string, data: any, activeTilesCheck?: (key: string) => boolean): void {
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
                const isActive = activeTilesCheck ? activeTilesCheck(oldestKey) : false;
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
