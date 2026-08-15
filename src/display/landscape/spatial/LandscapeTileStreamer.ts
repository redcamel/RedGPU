import RedGPUContext from "../../../context/RedGPUContext";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import {
    parse16BitPngBuffer,
    parse16BitPngBufferToGPUTexture
} from "../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import DirectTexture from "../../../resources/texture/DirectTexture";
import LandscapeVNTGenerator from "../generator/LandscapeVNTGenerator";
import LandscapeVHTGenerator from "../generator/LandscapeVHTGenerator";

/**
 * [KO] 타일별 커스텀 URL 생성 리졸버 함수 타입입니다. (row, col 인자 제공)
 * [EN] Tile custom URL resolver function type. (provides row, col parameters)
 */
export type LandscapeTileUrlResolver = (row: number, col: number, comp?: LandscapeComponent) => string;

/**
 * [KO] SpatialGrid 카메라 수평 조망 거리 기반 16비트 고도맵 VHT 아틀라스 & VNT 노멀 아틀라스 스트리머 클래스입니다 (Real-time Tile Streaming Manager).
 * [EN] 16-bit Heightmap VHT Atlas & VNT Normal Atlas Streamer class based on SpatialGrid camera horizontal viewing distance.
 */
export class LandscapeTileStreamer {
    #redGPUContext: RedGPUContext;
    #spatialGrid: LandscapeSpatialGrid;

    #loadingRadius: number = 2500.0;
    #maxLoadsPerFrame: number = 2;
    #tileUrlResolver: LandscapeTileUrlResolver | null = null;

    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vhtGenerator: LandscapeVHTGenerator | null = null;
    #vntGenerator: LandscapeVNTGenerator | null = null;

    #heightScale: number = 500.0;
    #worldSizeX: number = 8000.0;
    #componentCountX: number = 8;

    #activeComponentsBuffer: LandscapeComponent[] = [];
    #pendingQueue: LandscapeComponent[] = [];
    #loadingMap: Map<string, boolean> = new Map();
    #loadedMap: Map<string, any> = new Map();
    #cpuHeightMap: Map<string, any> = new Map();
    #failedMap: Map<string, number> = new Map(); // key -> last failed timestamp (ms)

    constructor(redGPUContext: RedGPUContext, spatialGrid: LandscapeSpatialGrid, loadingRadius: number = 2500.0) {
        this.#redGPUContext = redGPUContext;
        this.#spatialGrid = spatialGrid;
        this.#loadingRadius = loadingRadius;
    }

    resetTileState(): void {
        this.#loadingMap.clear();
        this.#loadedMap.clear();
        this.#failedMap.clear();
        this.#pendingQueue.length = 0;
    }

    get vhtAtlasTexture(): DirectTexture | null {
        return this.#vhtAtlasTexture;
    }

    set vhtAtlasTexture(texture: DirectTexture | null) {
        this.#vhtAtlasTexture = texture;
    }

    get vntAtlasTexture(): DirectTexture | null {
        return this.#vntAtlasTexture;
    }

    set vntAtlasTexture(texture: DirectTexture | null) {
        this.#vntAtlasTexture = texture;
    }

    get vhtGenerator(): LandscapeVHTGenerator | null {
        return this.#vhtGenerator;
    }

    set vhtGenerator(generator: LandscapeVHTGenerator | null) {
        this.#vhtGenerator = generator;
    }

    get vntGenerator(): LandscapeVNTGenerator | null {
        return this.#vntGenerator;
    }

    set vntGenerator(generator: LandscapeVNTGenerator | null) {
        this.#vntGenerator = generator;
    }

    set spatialGrid(grid: LandscapeSpatialGrid) {
        this.#spatialGrid = grid;
        this.resetTileState();
    }

    get spatialGrid(): LandscapeSpatialGrid {
        return this.#spatialGrid;
    }

    set loadingRadius(val: number) {
        this.#loadingRadius = Math.max(100, val);
    }

    get loadingRadius(): number {
        return this.#loadingRadius;
    }

    set maxLoadsPerFrame(val: number) {
        this.#maxLoadsPerFrame = Math.max(1, val);
    }

    get maxLoadsPerFrame(): number {
        return this.#maxLoadsPerFrame;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileUrlResolver = resolver;
        this.resetTileState();
    }

    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileUrlResolver;
    }

    get loadedTileCount(): number {
        return this.#loadedMap.size;
    }

    get pendingQueueSize(): number {
        return this.#pendingQueue.length;
    }

    setTerrainConfig(heightScale: number, worldSizeX: number, componentCountX: number): void {
        this.#heightScale = heightScale;
        this.#worldSizeX = worldSizeX;
        this.#componentCountX = componentCountX;
    }

    setTileUrlResolver(resolver?: LandscapeTileUrlResolver): void {
        this.#tileUrlResolver = resolver ?? null;
        this.resetTileState();
    }

    isTileLoaded(row: number, col: number): boolean {
        return this.#loadedMap.has(`${row}_${col}`);
    }

    update(cameraX: number, cameraZ: number): void {
        const radius = this.#loadingRadius;
        const grid = this.#spatialGrid;
        if (!grid) return;

        const activeBuffer = this.#activeComponentsBuffer;
        grid.getTilesInRadiusZeroGC(cameraX, cameraZ, radius, activeBuffer);

        const now = performance.now();
        const RETRY_INTERVAL_MS = 10000;

        const pending = this.#pendingQueue;
        pending.length = 0;

        for (let i = 0; i < activeBuffer.length; i++) {
            const comp = activeBuffer[i];
            const key = `${comp.componentZ}_${comp.componentX}`;

            if (this.#loadedMap.has(key) || this.#loadingMap.has(key)) {
                continue;
            }

            const lastFailedTime = this.#failedMap.get(key);
            if (lastFailedTime !== undefined && now - lastFailedTime < RETRY_INTERVAL_MS) {
                continue;
            }

            pending.push(comp);
        }

        if (pending.length > 1) {
            pending.sort((a, b) => {
                const da = (a.worldX - cameraX) * (a.worldX - cameraX) + (a.worldZ - cameraZ) * (a.worldZ - cameraZ);
                const db = (b.worldX - cameraX) * (b.worldX - cameraX) + (b.worldZ - cameraZ) * (b.worldZ - cameraZ);
                return da - db;
            });
        }

        const loadCount = Math.min(pending.length, this.#maxLoadsPerFrame);
        for (let i = 0; i < loadCount; i++) {
            const comp = pending[i];
            this.#loadTileAsync(comp);
        }
    }

    async #loadTileAsync(comp: LandscapeComponent): Promise<void> {
        const key = `${comp.componentZ}_${comp.componentX}`;
        this.#loadingMap.set(key, true);

        try {
            let url: string;
            if (this.#tileUrlResolver) {
                url = this.#tileUrlResolver(comp.componentZ, comp.componentX, comp);
            } else {
                const rowStr = String(comp.componentZ).padStart(2, '0');
                const colStr = String(comp.componentX).padStart(2, '0');
                url = `https://redcamel.github.io/testAsset/terrain/tile_001/28_134_86_730_13_512_512_16bit_tile_${rowStr}_${colStr}.png`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const cpuParsed = await parse16BitPngBuffer(buffer.slice(0));
            const parsed = await parse16BitPngBufferToGPUTexture(this.#redGPUContext, buffer);

            if (parsed) {
                console.log(`[LandscapeTileStreamer ✅] Tile (${key}) loaded successfully! (${parsed.width}x${parsed.height})`);
                this.#loadedMap.set(key, parsed.gpuTexture);
                if (cpuParsed) {
                    this.#cpuHeightMap.set(key, cpuParsed);
                    // 🍃 새로운 VHT 타일 고도가 수신되면 식생 인스턴스의 Y 고도를 실시간 자동 재동기화
                    (this as any).landscape?.foliageManager?.realignAllHeights();
                }
                this.#failedMap.delete(key);

                if (this.#vhtAtlasTexture && this.#vhtAtlasTexture.gpuTexture) {
                    const rawAtlasTexture = this.#vhtAtlasTexture.gpuTexture;
                    const TILE_PIXEL_SIZE = 512;
                    const targetX = comp.componentX * TILE_PIXEL_SIZE;
                    const targetZ = comp.componentZ * TILE_PIXEL_SIZE;
                    const copyW = Math.min(parsed.width, TILE_PIXEL_SIZE);
                    const copyH = Math.min(parsed.height, TILE_PIXEL_SIZE);

                    if (
                        targetX + copyW <= rawAtlasTexture.width &&
                        targetZ + copyH <= rawAtlasTexture.height
                    ) {
                        if (this.#vhtGenerator) {
                            // ⚡ GPU Compute r32float VHT Height Baking
                            this.#vhtGenerator.bakeTileRegion(
                                parsed.gpuTexture,
                                this.#vhtAtlasTexture,
                                targetX,
                                targetZ,
                                copyW,
                                copyH
                            );
                        } else {
                            this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
                                commandEncoder.copyTextureToTexture(
                                    {texture: parsed.gpuTexture},
                                    {
                                        texture: rawAtlasTexture,
                                        origin: [targetX, targetZ, 0]
                                    },
                                    [copyW, copyH, 1]
                                );
                            });
                        }
                        console.log(`[LandscapeTileStreamer ⛰️] r32float VHT Atlas Sub-region (${key}) baked via GPU Compute Shader at [${targetX}, ${targetZ}]`);

                        // 🌀 GPU VNT (Virtual Normal Texture) Compute Pass 노멀 베이킹 트리거
                        if (this.#vntAtlasTexture && this.#vntGenerator) {
                            this.#vntGenerator.bakeTileRegion(
                                this.#vhtAtlasTexture,
                                this.#vntAtlasTexture,
                                targetX,
                                targetZ,
                                copyW,
                                copyH,
                                this.#heightScale,
                                this.#worldSizeX,
                                this.#componentCountX
                            );
                        }
                    }
                }
            }
        } catch (e) {
            console.warn(`[LandscapeTileStreamer ⚠️] Tile (${key}) load failed:`, e);
            this.#failedMap.set(key, performance.now());
        } finally {
            this.#loadingMap.delete(key);
        }
    }

    /**
     * [KO] 월드 좌표 (x, z) 위치의 VHT 16비트 높이값과 heightScale을 정밀 산출하여 Y 고도를 반환합니다.
     */
    getHeightAt(x: number, z: number): number {
        const halfW = this.#worldSizeX * 0.5;
        const halfZ = this.#worldSizeX * 0.5; // symmetrical square grid

        const normU = (x + halfW) / this.#worldSizeX;
        const normV = (z + halfZ) / this.#worldSizeX;

        if (normU < 0.0 || normU > 1.0 || normV < 0.0 || normV > 1.0) {
            return 0.0;
        }

        const countX = this.#componentCountX;
        const col = Math.min(countX - 1, Math.max(0, Math.floor(normU * countX)));
        const row = Math.min(countX - 1, Math.max(0, Math.floor(normV * countX)));
        const key = `${row}_${col}`;

        const tileData = this.#cpuHeightMap.get(key);
        if (!tileData) {
            return 0.0;
        }

        const localU = (normU * countX) - col;
        const localV = (normV * countX) - row;

        const px = Math.min(tileData.width - 1, Math.max(0, Math.floor(localU * tileData.width)));
        const py = Math.min(tileData.height - 1, Math.max(0, Math.floor(localV * tileData.height)));
        const idx = py * tileData.width + px;

        const rawVal = tileData.pixels[idx] || 0;
        const ratio = rawVal / 65535.0;

        return ratio * this.#heightScale;
    }
}


export default LandscapeTileStreamer;
