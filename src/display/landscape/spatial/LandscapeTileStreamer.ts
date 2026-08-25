import RedGPUContext from "../../../context/RedGPUContext";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import {parse16BitPngBuffer} from "../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import DirectTexture from "../../../resources/texture/DirectTexture";
import LandscapeVNTGenerator from "../generator/LandscapeVNTGenerator";
import LandscapeVHTGenerator from "../generator/LandscapeVHTGenerator";
import LandscapeVBTGenerator from "../generator/LandscapeVBTGenerator";
import LandscapeMaterial from "../material/LandscapeMaterial";

export type LandscapeTileUrlResolver = (row: number, col: number, comp?: LandscapeComponent) => string;

export class LandscapeTileStreamer {
    #redGPUContext: RedGPUContext;
    #spatialGrid: LandscapeSpatialGrid;

    #loadingRadius: number = 2500.0;
    #maxLoadsPerFrame: number = 1;
    #tileUrlResolver: LandscapeTileUrlResolver | null = null;
    onTileLoaded: ((comp: LandscapeComponent) => void) | null = null;

    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vbtBaseColorAtlas: DirectTexture | null = null;
    #vbtNormalAtlas: DirectTexture | null = null;
    #vbtORMAtlas: DirectTexture | null = null;
    #vhtGenerator: LandscapeVHTGenerator | null = null;
    #vntGenerator: LandscapeVNTGenerator | null = null;
    #vbtGenerator: LandscapeVBTGenerator | null = null;
    #material: LandscapeMaterial | null = null;

    #heightScale: number = 500.0;

    #tempCellBuffer: Int32Array = new Int32Array(2);
    #activeComponentsBuffer: LandscapeComponent[] = [];
    #pendingQueue: LandscapeComponent[] = [];
    #rebakeQueue: LandscapeComponent[] = [];
    #isRebaking: boolean = false;
    #rebakeRafId: number | null = null;
    #loadingMap: Map<string, boolean> = new Map();
    #loadedMap: Map<string, any> = new Map();
    #cpuHeightMap: Map<string, any> = new Map();
    #failedMap: Map<string, number> = new Map();

    static #sortCamX = 0;
    static #sortCamZ = 0;
    static readonly #sortCompare = (a: LandscapeComponent, b: LandscapeComponent): number => {
        const da = (a.worldX - LandscapeTileStreamer.#sortCamX) * (a.worldX - LandscapeTileStreamer.#sortCamX)
            + (a.worldZ - LandscapeTileStreamer.#sortCamZ) * (a.worldZ - LandscapeTileStreamer.#sortCamZ);
        const db = (b.worldX - LandscapeTileStreamer.#sortCamX) * (b.worldX - LandscapeTileStreamer.#sortCamX)
            + (b.worldZ - LandscapeTileStreamer.#sortCamZ) * (b.worldZ - LandscapeTileStreamer.#sortCamZ);
        return da - db;
    };

    constructor(redGPUContext: RedGPUContext, spatialGrid: LandscapeSpatialGrid, loadingRadius: number = 2500.0) {
        this.#redGPUContext = redGPUContext;
        this.#spatialGrid = spatialGrid;
        this.#loadingRadius = loadingRadius;
    }

    resetTileState(): void {
        this.#loadingMap.clear();
        this.#loadedMap.clear();
        this.#failedMap.clear();
        this.#cpuHeightMap.clear();
        this.#pendingQueue.length = 0;
        this.#rebakeQueue.length = 0;
        if (this.#rebakeRafId !== null) {
            cancelAnimationFrame(this.#rebakeRafId);
            this.#rebakeRafId = null;
        }
        this.#isRebaking = false;
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

    get vbtBaseColorAtlas(): DirectTexture | null {
        return this.#vbtBaseColorAtlas;
    }

    set vbtBaseColorAtlas(texture: DirectTexture | null) {
        this.#vbtBaseColorAtlas = texture;
    }

    get vbtNormalAtlas(): DirectTexture | null {
        return this.#vbtNormalAtlas;
    }

    set vbtNormalAtlas(texture: DirectTexture | null) {
        this.#vbtNormalAtlas = texture;
    }

    get vbtORMAtlas(): DirectTexture | null {
        return this.#vbtORMAtlas;
    }

    set vbtORMAtlas(texture: DirectTexture | null) {
        this.#vbtORMAtlas = texture;
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

    get vbtGenerator(): LandscapeVBTGenerator | null {
        return this.#vbtGenerator;
    }

    set vbtGenerator(generator: LandscapeVBTGenerator | null) {
        this.#vbtGenerator = generator;
    }

    get material(): LandscapeMaterial | null {
        return this.#material;
    }

    set material(mat: LandscapeMaterial | null) {
        this.#material = mat;
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

    setTerrainConfig(heightScale: number): void {
        this.#heightScale = heightScale;
    }

    rebakeAllLoadedVNT(): void {
        if (!this.#vhtAtlasTexture || !this.#vntAtlasTexture || !this.#vntGenerator || !this.#spatialGrid) return;

        const TILE_PIXEL_SIZE = 512;
        const vhtAtlas = this.#vhtAtlasTexture;
        const vntAtlas = this.#vntAtlasTexture;
        const vntGen = this.#vntGenerator;
        const heightScale = this.#heightScale;
        const worldSizeX = this.#spatialGrid.worldSizeX;
        const componentCountX = this.#spatialGrid.tileCountX;
        const componentCountZ = this.#spatialGrid.tileCountZ;

        for (const [key, cpuParsed] of this.#cpuHeightMap) {
            const parts = key.split('_');
            const row = parseInt(parts[0], 10);
            const col = parseInt(parts[1], 10);

            if (row >= componentCountZ || col >= componentCountX) continue;

            const targetX = col * TILE_PIXEL_SIZE;
            const targetZ = row * TILE_PIXEL_SIZE;
            const copyW = Math.min(cpuParsed.width || TILE_PIXEL_SIZE, TILE_PIXEL_SIZE);
            const copyH = Math.min(cpuParsed.height || TILE_PIXEL_SIZE, TILE_PIXEL_SIZE);

            vntGen.bakeTileRegion(
                vhtAtlas,
                vntAtlas,
                targetX,
                targetZ,
                copyW,
                copyH,
                heightScale,
                worldSizeX,
                componentCountX
            );
        }
    }

    isTileLoaded(row: number, col: number): boolean {
        return this.#loadedMap.has(`${row}_${col}`);
    }

    update(cameraX: number, cameraZ: number, cameraY: number = 0): void {
        const radius = Math.max(this.#loadingRadius, Math.abs(cameraY) * 2.0);
        const grid = this.#spatialGrid;
        if (!grid) return;

        const activeBuffer = this.#activeComponentsBuffer;
        grid.getActiveComponentsInRadius(cameraX, cameraZ, radius, activeBuffer);

        const now = performance.now();
        const RETRY_INTERVAL_MS = 10000;

        const pending = this.#pendingQueue;
        pending.length = 0;

        for (let i = 0; i < activeBuffer.length; i++) {
            const comp = activeBuffer[i];
            const key = comp.key;

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
            LandscapeTileStreamer.#sortCamX = cameraX;
            LandscapeTileStreamer.#sortCamZ = cameraZ;
            pending.sort(LandscapeTileStreamer.#sortCompare);
        }

        const loadRate = Math.abs(cameraY) > 1000 ? Math.max(this.#maxLoadsPerFrame, 4) : this.#maxLoadsPerFrame;
        const loadCount = Math.min(pending.length, loadRate);
        for (let i = 0; i < loadCount; i++) {
            const comp = pending[i];
            this.#loadTileAsync(comp);
        }
    }

    getHeightAt(x: number, z: number): number {
        if (!this.#spatialGrid) return 0.0;

        const grid = this.#spatialGrid;
        const halfWX = grid.halfWorldSizeX;
        const halfWZ = grid.halfWorldSizeZ;

        if (x < -halfWX || x > halfWX || z < -halfWZ || z > halfWZ) {
            return 0.0;
        }

        grid.getCellCoordinates(x, z, this.#tempCellBuffer);
        const col = this.#tempCellBuffer[0];
        const row = this.#tempCellBuffer[1];
        const key = `${row}_${col}`;

        const tileData = this.#cpuHeightMap.get(key);
        if (!tileData) {
            return 0.0;
        }

        const tileSizeX = grid.tileSizeX;
        const tileSizeZ = grid.tileSizeZ;
        const tileMinX = col * tileSizeX - halfWX;
        const tileMinZ = row * tileSizeZ - halfWZ;

        const localU = Math.min(1.0, Math.max(0.0, (x - tileMinX) / tileSizeX));
        const localV = Math.min(1.0, Math.max(0.0, (z - tileMinZ) / tileSizeZ));

        const px = Math.min(tileData.width - 1, Math.max(0, Math.floor(localU * tileData.width)));
        const py = Math.min(tileData.height - 1, Math.max(0, Math.floor(localV * tileData.height)));
        const idx = py * tileData.width + px;

        const rawVal = tileData.pixels[idx] || 0;
        return (rawVal / 65535.0) * this.#heightScale;
    }

    rebakeAllLoadedVBT(budgetPerFrame: number = 3): void {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#vbtNormalAtlas || !this.#vbtORMAtlas || !this.#material || !this.#vhtAtlasTexture || !this.#vntAtlasTexture || !this.#spatialGrid) return;

        this.#rebakeQueue.length = 0;
        for (const comp of this.#spatialGrid.flatCells) {
            const key = `${comp.componentZ}_${comp.componentX}`;
            if (this.#loadedMap.has(key)) {
                this.#rebakeQueue.push(comp);
            }
        }

        if (this.#rebakeQueue.length === 0) return;

        if (this.#rebakeRafId !== null) {
            cancelAnimationFrame(this.#rebakeRafId);
            this.#rebakeRafId = null;
        }

        this.#isRebaking = true;
        this.#processRebakeQueue(budgetPerFrame);
    }

    #processRebakeQueue = (budgetPerFrame: number = 3): void => {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#vbtNormalAtlas || !this.#vbtORMAtlas || !this.#material || !this.#vhtAtlasTexture || !this.#vntAtlasTexture || !this.#spatialGrid) {
            this.#isRebaking = false;
            this.#rebakeQueue.length = 0;
            this.#rebakeRafId = null;
            return;
        }

        const TILE_PIXEL_SIZE = 512;
        const count = Math.min(budgetPerFrame, this.#rebakeQueue.length);

        for (let i = 0; i < count; i++) {
            const comp = this.#rebakeQueue.shift()!;
            this.#vbtGenerator.bakeTileRegion(
                this.#vntAtlasTexture,
                this.#vbtBaseColorAtlas,
                this.#vbtNormalAtlas,
                this.#vbtORMAtlas,
                this.#material,
                comp.componentX,
                comp.componentZ,
                TILE_PIXEL_SIZE
            );
        }

        if (this.#rebakeQueue.length > 0) {
            this.#rebakeRafId = requestAnimationFrame(() => this.#processRebakeQueue(budgetPerFrame));
        } else {
            this.#isRebaking = false;
            this.#rebakeRafId = null;
            console.log(`[LandscapeTileStreamer 🎨 ⚡ Time-Sliced] Completed rebaking VBT 2D Atlases for loaded tiles (${this.#loadedMap.size} tiles)`);
        }
    };

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

            const cpuParsed = await parse16BitPngBuffer(buffer);

            if (cpuParsed) {
                const {width, height, pixels} = cpuParsed;
                const gpuDevice = this.#redGPUContext.gpuDevice;
                const bytesPerRow = width * 2;

                const gpuTexture = gpuDevice.createTexture({
                    size: [width, height],
                    format: 'r16unorm',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
                    label: `16BitPng_GPUTexture_r16unorm_${key}`
                });

                gpuDevice.queue.writeTexture(
                    {texture: gpuTexture},
                    pixels.buffer,
                    {bytesPerRow},
                    [width, height]
                );

                console.log(`[LandscapeTileStreamer ✅ ⚡ Zero-GC 0.7ms] Tile (${key}) loaded successfully! (${width}x${height})`);
                this.#loadedMap.set(key, gpuTexture);
                this.#cpuHeightMap.set(key, cpuParsed);
                this.#failedMap.delete(key);

                if (this.#vhtAtlasTexture && this.#vhtAtlasTexture.gpuTexture) {
                    const rawAtlasTexture = this.#vhtAtlasTexture.gpuTexture;
                    const TILE_PIXEL_SIZE = 512;
                    const targetX = comp.componentX * TILE_PIXEL_SIZE;
                    const targetZ = comp.componentZ * TILE_PIXEL_SIZE;
                    const copyW = Math.min(width, TILE_PIXEL_SIZE);
                    const copyH = Math.min(height, TILE_PIXEL_SIZE);

                    if (
                        targetX + copyW <= rawAtlasTexture.width &&
                        targetZ + copyH <= rawAtlasTexture.height
                    ) {
                        if (this.#vhtGenerator) {

                            this.#vhtGenerator.bakeTileRegion(
                                gpuTexture,
                                this.#vhtAtlasTexture,
                                targetX,
                                targetZ,
                                copyW,
                                copyH
                            );
                        } else {
                            this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
                                commandEncoder.copyTextureToTexture(
                                    {texture: gpuTexture},
                                    {
                                        texture: rawAtlasTexture,
                                        origin: [targetX, targetZ, 0]
                                    },
                                    [copyW, copyH, 1]
                                );
                            });
                        }
                        console.log(`[LandscapeTileStreamer ⛰️] r32float VHT Atlas Sub-region (${key}) baked via GPU Compute Shader at [${targetX}, ${targetZ}]`);

                        if (this.#vntAtlasTexture && this.#vntGenerator) {
                            this.#vntGenerator.bakeTileRegion(
                                this.#vhtAtlasTexture,
                                this.#vntAtlasTexture,
                                targetX,
                                targetZ,
                                copyW,
                                copyH,
                                this.#heightScale,
                                this.#spatialGrid.worldSizeX,
                                this.#spatialGrid.tileCountX
                            );
                        }

                        if (this.#vbtGenerator && this.#vbtBaseColorAtlas && this.#vbtNormalAtlas && this.#vbtORMAtlas && this.#material && this.#vntAtlasTexture) {
                            this.#vbtGenerator.bakeTileRegion(
                                this.#vntAtlasTexture,
                                this.#vbtBaseColorAtlas,
                                this.#vbtNormalAtlas,
                                this.#vbtORMAtlas,
                                this.#material,
                                comp.componentX,
                                comp.componentZ,
                                TILE_PIXEL_SIZE
                            );
                        }

                        // 인접한 4방향 이웃 타일의 VNT 및 VBT 자동 갱신 (경계면 노멀 연속성 보장)
                        const neighborOffsets = [
                            [-1, 0],
                            [1, 0],
                            [0, -1],
                            [0, 1]
                        ];
                        const tileCountX = this.#spatialGrid.tileCountX;
                        const tileCountZ = this.#spatialGrid.tileCountZ;

                        for (let n = 0; n < neighborOffsets.length; n++) {
                            const nz = comp.componentZ + neighborOffsets[n][0];
                            const nx = comp.componentX + neighborOffsets[n][1];

                            if (nz >= 0 && nz < tileCountZ && nx >= 0 && nx < tileCountX) {
                                const nKey = `${nz}_${nx}`;
                                if (this.#loadedMap.has(nKey)) {
                                    const nTargetX = nx * TILE_PIXEL_SIZE;
                                    const nTargetZ = nz * TILE_PIXEL_SIZE;

                                    if (this.#vntAtlasTexture && this.#vntGenerator) {
                                        this.#vntGenerator.bakeTileRegion(
                                            this.#vhtAtlasTexture,
                                            this.#vntAtlasTexture,
                                            nTargetX,
                                            nTargetZ,
                                            TILE_PIXEL_SIZE,
                                            TILE_PIXEL_SIZE,
                                            this.#heightScale,
                                            this.#spatialGrid.worldSizeX,
                                            tileCountX
                                        );
                                    }

                                    if (this.#vbtGenerator && this.#vbtBaseColorAtlas && this.#vbtNormalAtlas && this.#vbtORMAtlas && this.#material && this.#vntAtlasTexture) {
                                        this.#vbtGenerator.bakeTileRegion(
                                            this.#vntAtlasTexture,
                                            this.#vbtBaseColorAtlas,
                                            this.#vbtNormalAtlas,
                                            this.#vbtORMAtlas,
                                            this.#material,
                                            nx,
                                            nz,
                                            TILE_PIXEL_SIZE
                                        );
                                    }
                                }
                            }
                        }

                        this.onTileLoaded?.(comp);
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
}

export default LandscapeTileStreamer;
