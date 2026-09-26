import RedGPUContext from "../../../context/RedGPUContext";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import {parse16BitPngBuffer} from "../../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";
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
    #onTileLoaded: ((comp: LandscapeComponent) => void) | null = null;

    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vbtBaseColorAtlas: DirectTexture | null = null;
    #vbtNormalAtlas: DirectTexture | null = null;
    #vbtORMAtlas: DirectTexture | null = null;
    #vhtGenerator: LandscapeVHTGenerator | null = null;
    #vntGenerator: LandscapeVNTGenerator | null = null;
    #vbtGenerator: LandscapeVBTGenerator | null = null;
    #material: LandscapeMaterial | null = null;
    #globalHeightTexture: GPUTexture | null = null;
    #globalCPUHeightMap: { width: number; height: number; pixels: ArrayLike<number>; maxVal: number } | null = null;

    #heightScale: number = 500.0;
    lod0SizeQuads: number = 256;

    #tempCellBuffer: Int32Array = new Int32Array(2);
    #activeComponentsBuffer: LandscapeComponent[] = [];
    #pendingQueue: LandscapeComponent[] = [];
    #rebakeQueue: LandscapeComponent[] = [];
    #isRebaking: boolean = false;
    #rebakeRafId: number | null = null;
    #rebakeBudgetPerFrame: number = 3;
    #loadingMap: Map<string, boolean> = new Map();
    #loadedMap: Map<string, boolean> = new Map();
    #cpuHeightMap: Map<string, any> = new Map();
    #failedMap: Map<string, number> = new Map();

    static #sortCamX = 0;
    static #sortCamZ = 0;

    static #sortCompare(a: LandscapeComponent, b: LandscapeComponent): number {
        const da = (a.worldX - LandscapeTileStreamer.#sortCamX) * (a.worldX - LandscapeTileStreamer.#sortCamX)
            + (a.worldZ - LandscapeTileStreamer.#sortCamZ) * (a.worldZ - LandscapeTileStreamer.#sortCamZ);
        const db = (b.worldX - LandscapeTileStreamer.#sortCamX) * (b.worldX - LandscapeTileStreamer.#sortCamX)
            + (b.worldZ - LandscapeTileStreamer.#sortCamZ) * (b.worldZ - LandscapeTileStreamer.#sortCamZ);
        return da - db;
    }

    static readonly #NEIGHBOR_OFFSETS: readonly (readonly [number, number])[] = Object.freeze([
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
    ]);

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

    setAtlasTextures(
        vht: DirectTexture | null,
        vnt: DirectTexture | null,
        vbtBaseColor: DirectTexture | null,
        vbtNormal: DirectTexture | null,
        vbtORM: DirectTexture | null
    ): void {
        this.#vhtAtlasTexture = vht;
        this.#vntAtlasTexture = vnt;
        this.#vbtBaseColorAtlas = vbtBaseColor;
        this.#vbtNormalAtlas = vbtNormal;
        this.#vbtORMAtlas = vbtORM;
    }

    setGenerators(
        vht: LandscapeVHTGenerator | null,
        vnt: LandscapeVNTGenerator | null,
        vbt: LandscapeVBTGenerator | null
    ): void {
        this.#vhtGenerator = vht;
        this.#vntGenerator = vnt;
        this.#vbtGenerator = vbt;
    }

    setMaterial(mat: LandscapeMaterial | null): void {
        this.#material = mat;
    }

    setSpatialGrid(grid: LandscapeSpatialGrid): void {
        this.#spatialGrid = grid;
        this.resetTileState();
    }

    setOnTileLoaded(callback: ((comp: LandscapeComponent) => void) | null): void {
        this.#onTileLoaded = callback;
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

    setGlobalHeightTexture(tex: GPUTexture | null): void {
        this.#globalHeightTexture = tex;
    }

    setGlobalCPUHeightMap(data: {
        width: number;
        height: number;
        pixels: ArrayLike<number>;
        maxVal?: number
    } | null): void {
        if (!data) {
            this.#globalCPUHeightMap = null;
            return;
        }
        const maxVal = data.maxVal ?? (data.pixels instanceof Uint16Array ? 65535.0 : 255.0);
        this.#globalCPUHeightMap = {
            width: data.width,
            height: data.height,
            pixels: data.pixels,
            maxVal
        };
    }

    restoreTileToGlobalBase(comp: LandscapeComponent): void {
        if (!this.#globalHeightTexture || !this.#vhtAtlasTexture || !this.#vhtGenerator || !this.#spatialGrid) return;
        const TILE_PIXEL_SIZE = 512;
        const targetX = comp.componentX * TILE_PIXEL_SIZE;
        const targetZ = comp.componentZ * TILE_PIXEL_SIZE;
        const compCountX = this.#spatialGrid.tileCountX;
        const compCountZ = this.#spatialGrid.tileCountZ;

        const uMin = comp.componentX / compCountX;
        const vMin = comp.componentZ / compCountZ;
        const uMax = (comp.componentX + 1) / compCountX;
        const vMax = (comp.componentZ + 1) / compCountZ;

        this.#vhtGenerator.bakeGlobalRegion(
            this.#globalHeightTexture,
            this.#vhtAtlasTexture,
            targetX,
            targetZ,
            TILE_PIXEL_SIZE,
            TILE_PIXEL_SIZE,
            uMin,
            vMin,
            uMax,
            vMax
        );

        if (this.#vntAtlasTexture && this.#vntGenerator) {
            this.#vntGenerator.bakeTileRegion(
                this.#vhtAtlasTexture,
                this.#vntAtlasTexture,
                targetX,
                targetZ,
                TILE_PIXEL_SIZE,
                TILE_PIXEL_SIZE,
                this.#heightScale,
                this.#spatialGrid.worldSizeX,
                compCountX
            );
        }
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

            vntGen.bakeTileRegion(
                vhtAtlas,
                vntAtlas,
                targetX,
                targetZ,
                TILE_PIXEL_SIZE,
                TILE_PIXEL_SIZE,
                heightScale,
                worldSizeX,
                componentCountX
            );
        }
    }

    isTileLoaded(row: number, col: number): boolean {
        const comp = this.#spatialGrid?.getComponent(row, col);
        return comp ? this.#loadedMap.has(comp.key) : false;
    }

    update(cameraX: number, cameraZ: number, cameraY: number = 0): void {
        if (!this.#tileUrlResolver) return;

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
        const comp = grid.getComponent(row, col);
        if (!comp) return 0.0;

        const tileData = this.#cpuHeightMap.get(comp.key);
        if (!tileData && !this.#globalCPUHeightMap) {
            return 0.0;
        }

        const tileSizeX = grid.tileSizeX;
        const tileSizeZ = grid.tileSizeZ;
        const tileMinX = col * tileSizeX - halfWX;
        const tileMinZ = row * tileSizeZ - halfWZ;

        const segments = this.lod0SizeQuads || 256;
        const stepX = tileSizeX / segments;
        const stepZ = tileSizeZ / segments;

        const relX = Math.min(tileSizeX, Math.max(0.0, x - tileMinX));
        const relZ = Math.min(tileSizeZ, Math.max(0.0, z - tileMinZ));

        const gx = relX / stepX;
        const gz = relZ / stepZ;
        const ix = Math.min(segments - 1, Math.floor(gx));
        const iz = Math.min(segments - 1, Math.floor(gz));
        const fx = gx - ix;
        const fz = gz - iz;

        const worldSizeX = grid.worldSizeX;
        const worldSizeZ = grid.worldSizeZ;
        const texSizeX = grid.tileCountX * 512;
        const texSizeZ = grid.tileCountZ * 512;

        const v00_x = tileMinX + ix * stepX;
        const v00_z = tileMinZ + iz * stepZ;
        const v10_x = v00_x + stepX;
        const v01_z = v00_z + stepZ;

        const gU0 = (v00_x + halfWX) / worldSizeX;
        const gV0 = (v00_z + halfWZ) / worldSizeZ;
        const gU1 = (v10_x + halfWX) / worldSizeX;
        const gV1 = (v01_z + halfWZ) / worldSizeZ;

        const globalTexX0 = Math.min(texSizeX - 1, Math.max(0, Math.floor(gU0 * texSizeX)));
        const globalTexZ0 = Math.min(texSizeZ - 1, Math.max(0, Math.floor(gV0 * texSizeZ)));
        const globalTexX1 = Math.min(texSizeX - 1, Math.max(0, Math.floor(gU1 * texSizeX)));
        const globalTexZ1 = Math.min(texSizeZ - 1, Math.max(0, Math.floor(gV1 * texSizeZ)));

        let h00 = 0;
        let h10 = 0;
        let h01 = 0;
        let h11 = 0;

        if (tileData) {
            const tX0 = Math.min(511, Math.max(0, globalTexX0 - col * 512));
            const tZ0 = Math.min(511, Math.max(0, globalTexZ0 - row * 512));
            const tX1 = Math.min(511, Math.max(0, globalTexX1 - col * 512));
            const tZ1 = Math.min(511, Math.max(0, globalTexZ1 - row * 512));

            const pixels = tileData.pixels;
            const w = tileData.width;

            h00 = pixels[tZ0 * w + tX0] || 0;
            h10 = pixels[tZ0 * w + tX1] || 0;
            h01 = pixels[tZ1 * w + tX0] || 0;
            h11 = pixels[tZ1 * w + tX1] || 0;
        } else if (this.#globalCPUHeightMap) {
            const g = this.#globalCPUHeightMap;
            const sU0 = (globalTexX0 + 0.5) / texSizeX;
            const sV0 = (globalTexZ0 + 0.5) / texSizeZ;
            const sU1 = (globalTexX1 + 0.5) / texSizeX;
            const sV1 = (globalTexZ1 + 0.5) / texSizeZ;

            h00 = this.#sampleGlobalLinear(g, sU0, sV0);
            h10 = this.#sampleGlobalLinear(g, sU1, sV0);
            h01 = this.#sampleGlobalLinear(g, sU0, sV1);
            h11 = this.#sampleGlobalLinear(g, sU1, sV1);
        }

        let rawVal: number;
        if (fx + fz <= 1.0) {
            rawVal = h00 + (h10 - h00) * fx + (h01 - h00) * fz;
        } else {
            rawVal = h11 + (h01 - h11) * (1.0 - fx) + (h10 - h11) * (1.0 - fz);
        }

        return (rawVal / 65535.0) * this.#heightScale;
    }

    #sampleGlobalLinear(
        g: { width: number; height: number; pixels: ArrayLike<number>; maxVal: number },
        u: number,
        v: number
    ): number {
        const W = g.width;
        const H = g.height;
        const cx = Math.max(0.0, Math.min(W - 1.0, u * W - 0.5));
        const cy = Math.max(0.0, Math.min(H - 1.0, v * H - 0.5));

        const x0 = Math.floor(cx);
        const y0 = Math.floor(cy);
        const x1 = Math.min(x0 + 1, W - 1);
        const y1 = Math.min(y0 + 1, H - 1);
        const tx = cx - x0;
        const ty = cy - y0;

        const pixels = g.pixels;
        const p00 = pixels[y0 * W + x0] || 0;
        const p10 = pixels[y0 * W + x1] || 0;
        const p01 = pixels[y1 * W + x0] || 0;
        const p11 = pixels[y1 * W + x1] || 0;

        const top = p00 * (1.0 - tx) + p10 * tx;
        const bot = p01 * (1.0 - tx) + p11 * tx;
        const val = top * (1.0 - ty) + bot * ty;

        return (val / g.maxVal) * 65535.0;
    }

    rebakeAllLoadedVBT(budgetPerFrame: number = 3): void {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#vbtNormalAtlas || !this.#vbtORMAtlas || !this.#material || !this.#vntAtlasTexture) return;

        if (this.#rebakeRafId !== null) {
            cancelAnimationFrame(this.#rebakeRafId);
            this.#rebakeRafId = null;
        }
        this.#isRebaking = false;
        this.#rebakeQueue.length = 0;

        this.#vbtGenerator.bakeAtlas(
            this.#vntAtlasTexture,
            this.#vbtBaseColorAtlas,
            this.#vbtNormalAtlas,
            this.#vbtORMAtlas,
            this.#material,
            512
        );
    }

    async #loadTileAsync(comp: LandscapeComponent): Promise<void> {
        if (!this.#tileUrlResolver) return;

        const key = comp.key;
        this.#loadingMap.set(key, true);

        try {
            const url = this.#tileUrlResolver(comp.componentZ, comp.componentX, comp);
            if (!url) return;

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

                this.#loadedMap.set(key, true);
                this.#cpuHeightMap.set(key, cpuParsed);
                this.#failedMap.delete(key);

                if (this.#vhtAtlasTexture && this.#vhtAtlasTexture.gpuTexture) {
                    const rawAtlasTexture = this.#vhtAtlasTexture.gpuTexture;
                    const TILE_PIXEL_SIZE = 512;
                    const targetX = comp.componentX * TILE_PIXEL_SIZE;
                    const targetZ = comp.componentZ * TILE_PIXEL_SIZE;

                    if (
                        targetX + TILE_PIXEL_SIZE <= rawAtlasTexture.width &&
                        targetZ + TILE_PIXEL_SIZE <= rawAtlasTexture.height
                    ) {
                        if (this.#vhtGenerator) {
                            this.#vhtGenerator.bakeTileRegion(
                                gpuTexture,
                                this.#vhtAtlasTexture,
                                targetX,
                                targetZ,
                                TILE_PIXEL_SIZE,
                                TILE_PIXEL_SIZE
                            );
                        }
                        this.#redGPUContext.commandEncoderManager.addDeferredDestroy(gpuTexture);

                        if (this.#vntAtlasTexture && this.#vntGenerator) {
                            this.#vntGenerator.bakeTileRegion(
                                this.#vhtAtlasTexture,
                                this.#vntAtlasTexture,
                                targetX,
                                targetZ,
                                TILE_PIXEL_SIZE,
                                TILE_PIXEL_SIZE,
                                this.#heightScale,
                                this.#spatialGrid.worldSizeX,
                                this.#spatialGrid.tileCountX
                            );
                        }

                        const neighborOffsets = LandscapeTileStreamer.#NEIGHBOR_OFFSETS;
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
                                }
                            }
                        }

                        this.#onTileLoaded?.(comp);
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

    destroy(): void {
        this.resetTileState();
        this.#vhtAtlasTexture = null;
        this.#vntAtlasTexture = null;
        this.#vbtBaseColorAtlas = null;
        this.#vbtNormalAtlas = null;
        this.#vbtORMAtlas = null;
        this.#vhtGenerator = null;
        this.#vntGenerator = null;
        this.#vbtGenerator = null;
        this.#material = null;
        this.#tileUrlResolver = null;
        this.#onTileLoaded = null;
    }
}

Object.freeze(LandscapeTileStreamer);
export default LandscapeTileStreamer;
