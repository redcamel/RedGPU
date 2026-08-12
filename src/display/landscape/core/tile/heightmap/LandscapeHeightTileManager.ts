import RedGPUContext from "../../../../../context/RedGPUContext.js";
import DirectTexture from "../../../../../resources/texture/DirectTexture.js";
import {
    LandscapeHeightTileLoader,
    LandscapeTileAddress,
    LandscapeTileUrlResolver
} from "../loader/LandscapeHeightTileLoader.js";
import {ParsedImageData} from "../../../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer.js";

const INV_65535 = 1.0 / 65535.0;

export interface LandscapeHeightTileManagerOptions {
    atlasTileCountX?: number;
    atlasTileCountZ?: number;
    tileSize?: number;
    maxCacheSize?: number;
    urlResolver?: LandscapeTileUrlResolver;
}

export interface LoadedTileData {
    address: LandscapeTileAddress;
    key: string;
    pixels: Uint16Array;
    width: number;
    height: number;
    lastAccessedFrame: number;
}

/**
 * [KO] Landscape 높이맵 타일 통합 매니저 클래스
 * [EN] Landscape Heightmap Tile Manager Class
 *
 * 비동기 로딩, LRU 캐싱, 전체 평탄화 버퍼(Flat Array) 바인딩 및 런타임 쌍선형 높이 샘플링을 제공하며
 * 프레임 단위 GC 부하 최소화 규칙을 준수합니다.
 */
export class LandscapeHeightTileManager {
    readonly redGPUContext: RedGPUContext | null;
    readonly loader: LandscapeHeightTileLoader;

    #atlasTileCountX: number;
    #atlasTileCountZ: number;
    #tileSize: number;
    #maxCacheSize: number;

    #totalWidthCache: number = 0;
    #totalHeightCache: number = 0;
    #maxPixelIdxXCache: number = 0;
    #maxPixelIdxZCache: number = 0;

    // 통합 16비트 높이맵 평탄화 배열 (Flat Buffer)
    #flatHeightmapData: Uint16Array;
    #heightmapTexture: DirectTexture | null = null;
    #gpuTexture: GPUTexture | null = null;
    #rgbaSectorBuffer: Uint8Array = new Uint8Array(512 * 512 * 4);

    // 타일 캐시 맵 (Key -> LoadedTileData)
    #tileCache: Map<string, LoadedTileData> = new Map();

    // 런타임 갱신 프레임 카운터 (LRU 추적용)
    #currentFrameCount: number = 0;

    constructor(redGPUContext: RedGPUContext | null = null, options: LandscapeHeightTileManagerOptions = {}) {
        this.redGPUContext = redGPUContext;
        this.#atlasTileCountX = options.atlasTileCountX ?? 16;
        this.#atlasTileCountZ = options.atlasTileCountZ ?? 16;
        this.#tileSize = options.tileSize ?? 512;
        this.#maxCacheSize = options.maxCacheSize ?? 128;

        this.loader = new LandscapeHeightTileLoader(options.urlResolver);

        this.#updateDimensionsCache();

        // 전체 높이맵 평탄화 데이터 버퍼 동적 할당
        this.#flatHeightmapData = new Uint16Array(this.#totalWidthCache * this.#totalHeightCache);

        if (redGPUContext) {
            this.#initGPUTexture(redGPUContext);
        }
    }

    get heightmapTexture(): DirectTexture | null {
        return this.#heightmapTexture;
    }

    get gpuTexture(): GPUTexture | null {
        return this.#gpuTexture;
    }

    get flatHeightmapData(): Uint16Array {
        return this.#flatHeightmapData;
    }

    get cachedTileCount(): number {
        return this.#tileCache.size;
    }

    get tileSize(): number {
        return this.#tileSize;
    }

    setUrlResolver(resolver?: LandscapeTileUrlResolver): void {
        this.loader.setUrlResolver(resolver);
    }

    /**
     * [KO] 타일 비동기 로드 및 메모리 풀 / 섹터 데이터 갱신 (GC-Free)
     */
    async loadAndRegisterTile(tile: LandscapeTileAddress): Promise<boolean> {
        const key = LandscapeHeightTileLoader.getTileKey(tile);
        this.#currentFrameCount++;

        // 1. 이미 캐시에 존재하는 경우 프레임 카운트만 갱신
        const existing = this.#tileCache.get(key);
        if (existing) {
            existing.lastAccessedFrame = this.#currentFrameCount;
            return true;
        }

        // 2. 비동기 타일 데이터 Fetch & Parsing
        const parsedData: ParsedImageData | null = await this.loader.loadTile(tile);
        if (!parsedData || !parsedData.pixels) {
            return false;
        }

        let u16Pixels: Uint16Array;
        if (parsedData.pixels instanceof Uint16Array) {
            u16Pixels = parsedData.pixels;
        } else if (parsedData.pixels instanceof Float32Array) {
            u16Pixels = new Uint16Array(parsedData.pixels.length);
            for (let i = 0; i < parsedData.pixels.length; i++) {
                u16Pixels[i] = Math.max(0, Math.min(65535, Math.floor(parsedData.pixels[i] * 65535.0)));
            }
        } else {
            u16Pixels = new Uint16Array(parsedData.pixels.buffer, parsedData.pixels.byteOffset, Math.floor(parsedData.pixels.byteLength / 2));
        }

        const tileRecord: LoadedTileData = {
            address: tile,
            key,
            pixels: u16Pixels,
            width: parsedData.width,
            height: parsedData.height,
            lastAccessedFrame: this.#currentFrameCount
        };

        this.#tileCache.set(key, tileRecord);
        this.updateFlatHeightmapSector(tile, u16Pixels);

        // 3. LRU 캐시 용량 초과 시 오래된 타일 정리
        this.#evictOldestCacheIfNeeded();

        return true;
    }

    /**
     * [KO] 지정한 타일 섹터 영역의 데이터를 통합 평탄화 버퍼(#flatHeightmapData)에 복사하여 하나로 합칩니다.
     */
    updateFlatHeightmapSector(tile: LandscapeTileAddress, pixels: Uint16Array): void {
        const {gridX, gridZ} = tile;
        if (gridX < 0 || gridX >= this.#atlasTileCountX || gridZ < 0 || gridZ >= this.#atlasTileCountZ) {
            return;
        }

        const tileSize = this.#tileSize;
        const totalWidth = this.#totalWidthCache;
        const startX = gridX * tileSize;
        const startZ = gridZ * tileSize;

        for (let tz = 0; tz < tileSize; tz++) {
            const srcOffset = tz * tileSize;
            const dstOffset = (startZ + tz) * totalWidth + startX;
            this.#flatHeightmapData.set(
                pixels.subarray(srcOffset, srcOffset + tileSize),
                dstOffset
            );
        }

        // WebGPU GPUTexture가 존재하는 경우, 업데이트된 섹터를 RGBA 8비트 텍스처로 업로드 (BitmapMaterial 호환)
        if (this.redGPUContext?.gpuDevice && this.#gpuTexture) {
            const totalPixels = tileSize * tileSize;
            const requiredByteSize = totalPixels * 4;
            if (this.#rgbaSectorBuffer.length < requiredByteSize) {
                this.#rgbaSectorBuffer = new Uint8Array(requiredByteSize);
            }
            const rgbaBuf = this.#rgbaSectorBuffer;

            for (let i = 0; i < totalPixels; i++) {
                const val16 = pixels[i];
                const g8 = Math.floor((val16 / 65535.0) * 255);
                const idx = i * 4;
                rgbaBuf[idx] = g8;     // R
                rgbaBuf[idx + 1] = g8; // G
                rgbaBuf[idx + 2] = g8; // B
                rgbaBuf[idx + 3] = 255;// A
            }

            const bytesPerRow = tileSize * 4; // rgba8unorm
            this.redGPUContext.gpuDevice.queue.writeTexture(
                {
                    texture: this.#gpuTexture,
                    origin: [startX, startZ, 0]
                },
                rgbaBuf.buffer,
                {
                    offset: 0,
                    bytesPerRow: bytesPerRow,
                    rowsPerImage: tileSize
                },
                [tileSize, tileSize, 1]
            );
        }
    }

    /**
     * [KO] 월드 좌표(x, z) 위치의 높이값을 쌍선형 보간(Bilinear Interpolation)으로 구합니다.
     */
    getLandscapeHeight(
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

        const maxPixelX = this.#maxPixelIdxXCache;
        const maxPixelZ = this.#maxPixelIdxZCache;
        const totalWidth = this.#totalWidthCache;

        const tx = u * maxPixelX;
        const tz = (1.0 - v) * maxPixelZ;

        const x0 = Math.floor(tx);
        const x1 = Math.min(maxPixelX, x0 + 1);
        const z0 = Math.floor(tz);
        const z1 = Math.min(maxPixelZ, z0 + 1);

        const fx = tx - x0;
        const fz = tz - z0;

        const flatData = this.#flatHeightmapData;

        const ix0 = Math.max(0, Math.min(maxPixelX, x0));
        const ix1 = Math.max(0, Math.min(maxPixelX, x1));
        const iz0 = Math.max(0, Math.min(maxPixelZ, z0));
        const iz1 = Math.max(0, Math.min(maxPixelZ, z1));

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

    destroy(): void {
        this.#tileCache.clear();
        this.loader.clearPending();
    }

    #initGPUTexture(redGPUContext: RedGPUContext): void {
        const device = redGPUContext.gpuDevice;
        if (!device) return;

        const width = this.#totalWidthCache;
        const height = this.#totalHeightCache;

        // BitmapMaterial 셰이더와 100% 호환되는 rgba8unorm 포맷의 GPUTexture 생성
        this.#gpuTexture = device.createTexture({
            size: [width, height, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'LandscapeIntegratedHeightmapTexture'
        });

        this.#heightmapTexture = new DirectTexture(
            redGPUContext,
            'LandscapeIntegratedHeightmapTexture_' + Math.random(),
            this.#gpuTexture
        );
    }

    #updateDimensionsCache(): void {
        this.#totalWidthCache = this.#atlasTileCountX * this.#tileSize;
        this.#totalHeightCache = this.#atlasTileCountZ * this.#tileSize;
        this.#maxPixelIdxXCache = this.#totalWidthCache - 1;
        this.#maxPixelIdxZCache = this.#totalHeightCache - 1;
    }

    /**
     * [KO] LRU 규칙에 따라 가장 오래전 접근된 타일을 메모리 캐시에서 정리
     */
    #evictOldestCacheIfNeeded(): void {
        if (this.#tileCache.size <= this.#maxCacheSize) return;

        let oldestKey: string | null = null;
        let oldestFrame = Infinity;

        for (const [key, record] of this.#tileCache.entries()) {
            if (record.lastAccessedFrame < oldestFrame) {
                oldestFrame = record.lastAccessedFrame;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.#tileCache.delete(oldestKey);
        }
    }
}
