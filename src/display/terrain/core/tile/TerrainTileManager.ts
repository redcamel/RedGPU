import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import TerrainHeightmapManager from "./heightmap/TerrainHeightmapManager";
import TerrainHeightmapProcessor from "./heightmap/processor/TerrainHeightmapProcessor";
import parse16BitPngBuffer from "../../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";

export type {SpatialTileInfo};

export class TileStreamMetrics {
    frameLoadCount: number = 0;
    frameUnloadCount: number = 0;
    lastFrameLoadCount: number = 0;
    lastFrameUnloadCount: number = 0;
    lastMetricsResetTime: number = performance.now();

    update() {
        const now = performance.now();
        if (now - this.lastMetricsResetTime >= 1000) {
            this.lastFrameLoadCount = this.frameLoadCount;
            this.lastFrameUnloadCount = this.frameUnloadCount;
            this.frameLoadCount = 0;
            this.frameUnloadCount = 0;
            this.lastMetricsResetTime = now;
        }
    }
}

export interface TerrainOptions {
    cellSize?: number;
    loadingRadius?: number;
    verticesPerSide?: number;
    lodThreshold?: number;
    atlasSize?: number;
    atlasTileCountX?: number;
    atlasTileCountZ?: number;
    atlasTileSize?: number;
}

export function sanitizeVerticesPerSide(val: number): number {
    const minVal = 16;
    const maxVal = 512;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const powerOfTwo = Math.pow(2, Math.round(Math.log2(clamped)));
    if (powerOfTwo !== val) {
        console.warn(`[RedGPU Terrain] verticesPerSide는 2의 거듭제곱(16, 32, 64, 128...)이어야 합니다. (${val} -> ${powerOfTwo}로 자동 보정됨)`);
    }
    return powerOfTwo;
}

export interface ITerrainTarget {
    worldOffset: [number, number];
    worldSize: [number, number];
    minHeight: number;
    maxHeight: number;
    maxLOD: number;
    baseSlotIndex: number;
    globalVertexSlotIndex: number;
    lodRanges: Float32Array;
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;
    material: any;
    gpuRenderInfo: any;
    drawCommandSlot: any;
    drawBufferManager: any;
}

export class TerrainTileManager {
    #terrain: ITerrainTarget;
    #redGPUContext: RedGPUContext;

    #spatialGrid: TerrainSpatialGrid;
    #instanceBuffer: GPUBuffer;
    #instanceArrayBuffer: Float32Array;
    #cachedLodRanges: Float32Array = new Float32Array(32);

    #heightmapManager: TerrainHeightmapManager;

    #tileUrlResolver?: (tile: SpatialTileInfo) => string | void;
    #onTileLoadCallback?: (tile: SpatialTileInfo) => void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;

    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    #prevLodThreshold: number = 0;
    #lodThreshold: number = 2.0;

    #maxInstances: number = 65536;
    #tileStreamMetrics = new TileStreamMetrics();

    #currentInstanceCount: number = 0;
    #prevInstanceCount: number = -1;
    #isDirty: boolean = true;
    #cameraPosBuffer: [number, number, number] = [0, 0, 0];
    #lastCamX: number = NaN;
    #lastCamY: number = NaN;
    #lastCamZ: number = NaN;
    #lastCamRotX: number = NaN;
    #lastCamRotY: number = NaN;
    #lastCamRotZ: number = NaN;

    #processor?: TerrainHeightmapProcessor | null;

    constructor(terrain: ITerrainTarget, redGPUContext: RedGPUContext, options?: TerrainOptions) {
        this.#terrain = terrain;
        this.#redGPUContext = redGPUContext;

        const cellSize = options?.cellSize ?? 256;
        const loadingRadius = options?.loadingRadius ?? 2560;
        this.#lodThreshold = options?.lodThreshold ?? 2.0;

        this.#spatialGrid = new TerrainSpatialGrid(cellSize, loadingRadius);

        const atlasTileCountX = options?.atlasTileCountX ?? 16;
        const atlasTileCountZ = options?.atlasTileCountZ ?? 16;
        const atlasTileSize = options?.atlasTileSize ?? 512;

        this.#heightmapManager = new TerrainHeightmapManager(redGPUContext, {
            atlasTileCountX,
            atlasTileCountZ,
            atlasTileSize
        });

        this.#terrain.worldSize = [cellSize * atlasTileCountX, cellSize * atlasTileCountZ];
        this.#maxInstances = 65536;

        this.#instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: 65536 * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

        this.#instanceArrayBuffer = new Float32Array(65536 * 4);
    }

    get synthesizedTileCount(): number {
        return this.#heightmapManager.synthesizedTileCount;
    }

    get instanceBuffer(): GPUBuffer {
        return this.#instanceBuffer;
    }

    get atlasTileCountX(): number {
        return this.#heightmapManager.atlasTileCountX;
    }

    get atlasTileCountZ(): number {
        return this.#heightmapManager.atlasTileCountZ;
    }

    get atlasTileSize(): number {
        return this.#heightmapManager.atlasTileSize;
    }

    get spatialGrid(): TerrainSpatialGrid {
        return this.#spatialGrid;
    }

    get tileStreamMetrics(): TileStreamMetrics {
        return this.#tileStreamMetrics;
    }

    get flatHeightmapData(): Uint16Array {
        return this.#heightmapManager.flatHeightmapData;
    }

    get lodThreshold(): number {
        return this.#lodThreshold;
    }

    set lodThreshold(value: number) {
        this.#lodThreshold = value;
    }

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#heightmapManager.tileDataCache;
    }

    markDirty() {
        this.#isDirty = true;
    }

    getTerrainHeight(x: number, z: number): number {
        return this.#heightmapManager.getTerrainHeight(
            x, z, this.#terrain.worldOffset, this.#terrain.worldSize, this.#terrain.minHeight, this.#terrain.maxHeight
        );
    }

    updateTiles(renderViewStateData: any) {
        const currentWorldSize = this.#terrain.worldSize[0];
        const lodRangesChanged = this.#updateLODRanges(currentWorldSize);

        this.#terrain.baseSlotIndex = this.#terrain.globalVertexSlotIndex;

        const camera = renderViewStateData.view.rawCamera;
        const localCamX = camera.x - this.#terrain.worldOffset[0];
        const localCamY = camera.y;
        const localCamZ = camera.z - this.#terrain.worldOffset[1];
        const streamingChanged = this.#processTileStreaming(camera);

        const camRotX = camera.rotationX ?? 0;
        const camRotY = camera.rotationY ?? 0;
        const camRotZ = camera.rotationZ ?? 0;

        const dx = localCamX - this.#lastCamX;
        const dy = localCamY - this.#lastCamY;
        const dz = localCamZ - this.#lastCamZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        const dRotX = Math.abs(camRotX - this.#lastCamRotX);
        const dRotY = Math.abs(camRotY - this.#lastCamRotY);
        const dRotZ = Math.abs(camRotZ - this.#lastCamRotZ);
        const rotDiff = dRotX + dRotY + dRotZ;

        const shouldUpdate =
            this.#isDirty ||
            lodRangesChanged ||
            streamingChanged ||
            isNaN(distSq) ||
            distSq > 0.0025 ||
            rotDiff > 0.001;

        if (shouldUpdate) {
            this.#cameraPosBuffer[0] = localCamX;
            this.#cameraPosBuffer[1] = localCamY;
            this.#cameraPosBuffer[2] = localCamZ;
            this.#lastCamX = localCamX;
            this.#lastCamY = localCamY;
            this.#lastCamZ = localCamZ;
            this.#lastCamRotX = camRotX;
            this.#lastCamRotY = camRotY;
            this.#lastCamRotZ = camRotZ;
            this.#isDirty = false;

            this.#updateInstanceRenderBuffer(this.#cameraPosBuffer, renderViewStateData);
        } else if (this.#terrain.gpuRenderInfo && this.#terrain.drawCommandSlot && this.#terrain.drawBufferManager) {
            this.#terrain.drawBufferManager.setInstanceNum(this.#terrain.drawCommandSlot, this.#currentInstanceCount);
        }
    }

    #tileSpanX: number = 0;
    #tileSpanZ: number = 0;

    get tileSpanX(): number {
        if (this.#tileSpanX === 0) this.#recalculateTileSpan();
        return this.#tileSpanX;
    }

    get tileSpanZ(): number {
        if (this.#tileSpanZ === 0) this.#recalculateTileSpan();
        return this.#tileSpanZ;
    }

    #recalculateTileSpan() {
        const countX = this.atlasTileCountX || 16;
        const countZ = this.atlasTileCountZ || 16;
        this.#tileSpanX = this.#terrain.worldSize[0] / countX;
        this.#tileSpanZ = this.#terrain.worldSize[1] / countZ;
    }

    #updateLODRanges(currentWorldSize: number): boolean {
        if (
            this.#prevWorldSize !== currentWorldSize ||
            this.#prevMaxLOD !== this.#terrain.maxLOD ||
            this.#prevLodThreshold !== this.#lodThreshold
        ) {
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.#terrain.maxLOD;
            this.#prevLodThreshold = this.#lodThreshold;

            if (this.#spatialGrid) {
                this.#spatialGrid.cellSize = this.tileSpanX;
            }

            const lodRanges = this.#cachedLodRanges;
            const lodThreshold = this.lodThreshold;
            const morphConstant = 0.5;

            for (let i = 0; i <= this.#terrain.maxLOD; i++) {
                const worldScale = currentWorldSize / Math.pow(2, i);
                const morphEnd = worldScale * lodThreshold;
                const morphStart = morphEnd - (worldScale * morphConstant);

                lodRanges[i * 4 + 0] = morphStart * morphStart;
                lodRanges[i * 4 + 1] = morphEnd * morphEnd;
                lodRanges[i * 4 + 2] = 0;
                lodRanges[i * 4 + 3] = 0;
            }
            this.#terrain.lodRanges = lodRanges;
            return true;
        }
        return false;
    }

    #processTileStreaming(camera: any): boolean {
        if (!this.#spatialGrid) return false;

        const {toLoad, toUnload} = this.#spatialGrid.update(camera, this.#terrain.worldOffset, this.#terrain.worldSize);
        this.#tileStreamMetrics.update();

        const hasChanges = toLoad.length > 0 || toUnload.length > 0;

        if (toLoad.length > 0) {
            if (this.#tileUrlResolver) {
                const len = toLoad.length;
                for (let i = 0; i < len; i++) {
                    const tile = toLoad[i];
                    this.#enrichTileInfo(tile);
                    if (this.isTileSynthesized(tile)) continue;
                    this.#tileStreamMetrics.frameLoadCount++;
                    const result = this.#tileUrlResolver!(tile);
                    if (typeof result === 'string') {
                        this.#loadTileFromUrl(tile, result);
                    }
                }
            }
        }
        if (toUnload.length > 0) {
            this.#tileStreamMetrics.frameUnloadCount += toUnload.length;
            const rvt = this.#terrain.material?.rvt;
            const tileCountX = rvt ? rvt.pageTable.virtualCountX : 32;
            const tileCountZ = rvt ? rvt.pageTable.virtualCountZ : 32;

            const len = toUnload.length;
            for (let i = 0; i < len; i++) {
                const tile = toUnload[i];
                const cb = this.#onTileUnloadCallback;
                if (cb) {
                    cb(tile);
                }
                if (rvt) {
                    const vX = tile.tileCol ?? (tile.gridX + (tileCountX >> 1));
                    const vZ = tile.tileRow ?? (tile.gridZ + (tileCountZ >> 1));
                    if (vX >= 0 && vX < tileCountX && vZ >= 0 && vZ < tileCountZ) {
                        rvt.pageTable.clearEntry(vX, vZ);
                    }
                }
            }
        }
        return hasChanges;
    }

    destroy() {
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = null!;
        }
        if (this.#terrain && this.#terrain.heightmapAtlasTexture) {
            this.#terrain.heightmapAtlasTexture.destroy();
            this.#terrain.heightmapAtlasTexture = null;
        }
        if (this.#spatialGrid) {
            this.#spatialGrid.destroy();
        }
        if (this.#heightmapManager) {
            this.#heightmapManager.destroy();
        }
        if (this.#processor) {
            this.#processor.destroy();
            this.#processor = null;
        }
        this.#onTileLoadCallback = undefined;
        this.#onTileUnloadCallback = undefined;
        this.#tileUrlResolver = undefined;
        this.#instanceArrayBuffer = null!;
        this.#terrain = null!;
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        return this.#heightmapManager.isTileSynthesized(tile);
    }

    setTileUrlResolver(resolver: (tile: SpatialTileInfo) => string | void) {
        this.#tileUrlResolver = resolver;
    }

    setOnTileLoad(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileLoadCallback = callback;
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileUnloadCallback = callback;
    }

    #updateInstanceRenderBuffer(cameraPos: [number, number, number], renderViewStateData: any) {
        // TerrainSpatialGrid 기반 1차 공간 인스턴스 데이터 추출 (Zero-Allocation)
        const activeTiles = this.#spatialGrid ? this.#spatialGrid.activeTileList : [];
        const count = Math.min(activeTiles.length, this.#maxInstances);
        this.#currentInstanceCount = count;

        if (count > 0) {
            const arrayBuffer = this.#instanceArrayBuffer;
            const worldOffsetX = this.#terrain.worldOffset[0];
            const worldOffsetZ = this.#terrain.worldOffset[1];
            const device = this.#redGPUContext.gpuDevice;

            for (let i = 0; i < count; i++) {
                const tile = activeTiles[i];
                const scale = this.#spatialGrid.cellSize;
                const halfScale = scale * 0.5;

                // tile.worldBounds[0]은 이미 절대 월드 좌표(minX)이므로 worldOffset 중복 합산 제거
                const posX = tile.worldBounds[0] + halfScale;
                const posZ = tile.worldBounds[1] + halfScale;
                const lod = tile.lodLevel ?? 0;

                const idx = i * 4;
                const isNodeChanged =
                    arrayBuffer[idx + 0] !== posX ||
                    arrayBuffer[idx + 1] !== posZ ||
                    arrayBuffer[idx + 2] !== scale ||
                    arrayBuffer[idx + 3] !== lod;

                if (isNodeChanged) {
                    arrayBuffer[idx + 0] = posX;
                    arrayBuffer[idx + 1] = posZ;
                    arrayBuffer[idx + 2] = scale;
                    arrayBuffer[idx + 3] = lod;

                    const slotByteOffset = idx * 4;
                    device.queue.writeBuffer(
                        this.#instanceBuffer,
                        slotByteOffset,
                        arrayBuffer as BufferSource,
                        idx,
                        4
                    );
                }
            }
        }

        if (this.#terrain.gpuRenderInfo && this.#terrain.drawCommandSlot && this.#terrain.drawBufferManager) {
            this.#terrain.drawBufferManager.setInstanceNum(this.#terrain.drawCommandSlot, count);
        }
    }

    #createHeightmapTileAtlas(tileCountX: number = 16, tileCountZ: number = 16, tileSize: number = 512) {
        const device = this.#redGPUContext.gpuDevice;

        const atlasWidth = tileCountX * tileSize;
        const atlasHeight = tileCountZ * tileSize;
        const gpuTexture = device.createTexture({
            label: 'Terrain_HeightmapTileAtlasGPUTexture',
            size: [atlasWidth, atlasHeight, 1],
            format: 'rgba16float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
        });

        this.#terrain.heightmapAtlasTexture = new DirectTexture(
            this.#redGPUContext,
            'Terrain_HeightmapTileAtlasDirectTexture',
            gpuTexture
        );
    }

    loadTileFrom16BitBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        this.#heightmapManager.registerTileData(tile, data, this.#spatialGrid);
        this.#updateTileHeightmapFromBuffer(tile, data, width, height);
    }

    #enrichTileInfo(tile: SpatialTileInfo) {
        if (tile.tileColStr !== undefined && tile.tileRowStr !== undefined) return;

        const countX = this.atlasTileCountX;
        const countZ = this.atlasTileCountZ;
        const col = Math.max(0, Math.min(countX - 1, tile.gridX + (countX >> 1)));
        const rawRow = Math.max(0, Math.min(countZ - 1, tile.gridZ + (countZ >> 1)));
        const row = (countZ - 1) - rawRow;

        tile.tileCol = col;
        tile.tileRow = row;
        tile.atlasKey = `${col}_${row}`;
        tile.tileColStr = col < 10 ? `0${col}` : `${col}`;
        tile.tileRowStr = row < 10 ? `0${row}` : `${row}`;
    }

    #updateTileHeightmapFromBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        const tileX = tile.tileCol ?? 0;
        const tileZ = tile.tileRow ?? 0;

        if (!this.#terrain.heightmapAtlasTexture) {
            this.#createHeightmapTileAtlas(this.atlasTileCountX, this.atlasTileCountZ, this.atlasTileSize);
        }
        const gpuTexture = this.#terrain.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) return;

        if (!this.#processor) {
            this.#processor = new TerrainHeightmapProcessor(this.#redGPUContext);
        }

        const destX = tileX * this.atlasTileSize;
        const destZ = tileZ * this.atlasTileSize;

        this.#processor.processAndUploadTile(
            destX,
            destZ,
            data,
            width,
            height,
            gpuTexture,
            this.atlasTileSize
        );

        this.#heightmapManager.markTileSynthesized(`${tileX}_${tileZ}`);
        this.markDirty();

        if (this.#onTileLoadCallback) {
            this.#onTileLoadCallback(tile);
        }

        if (this.#terrain.material) {
            const mat = this.#terrain.material as any;
            if (typeof mat.bakeRVTTile === 'function') {
                mat.bakeRVTTile(tileX, tileZ, this.atlasTileCountX, this.atlasTileCountZ);
            }
        }
    }

    #loadTileFromUrl(tile: SpatialTileInfo, url: string) {
        const key = ((tile.gridX + 32768) << 16) | ((tile.gridZ + 32768) & 0xFFFF);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.arrayBuffer();
            })
            .then(async (buffer) => {
                if (!this.#spatialGrid.activeTiles.has(key)) {
                    return;
                }

                const parsed = await parse16BitPngBuffer(buffer);
                if (parsed) {
                    this.loadTileFrom16BitBuffer(tile, parsed.pixels, parsed.width, parsed.height);
                } else {
                    this.loadTileFrom16BitBuffer(tile, buffer, this.atlasTileSize, this.atlasTileSize);
                }
            })
            .catch(err => {
                console.error(`[Tile Streamer ❌] Failed to load 16-bit tile from ${url}`, err);
            });
    }
}

export default TerrainTileManager;
