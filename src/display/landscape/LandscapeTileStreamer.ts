import RedGPUContext from "../../context/RedGPUContext";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import {
    parse16BitPngBufferToGPUTexture
} from "../../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";

export type LandscapeTileUrlResolver = (row: number, col: number) => string;

/**
 * [KO] Landscape 16비트/8비트 타일 동적 호스트 스트리밍 전담 관리자 클래스입니다.
 * [EN] Dedicated manager class for Landscape 16-bit/8-bit tile dynamic host streaming.
 */
export class LandscapeTileStreamer {
    #redGPUContext: RedGPUContext;
    #spatialGrid: LandscapeSpatialGrid;

    #loadingRadius: number = 2500.0;
    #maxLoadsPerFrame: number = 2;
    #tileUrlResolver: LandscapeTileUrlResolver | null = null;
    #vhtAtlasTexture: GPUTexture | null = null;

    #activeComponentsBuffer: LandscapeComponent[] = [];
    #pendingQueue: LandscapeComponent[] = [];
    #loadingMap: Map<string, boolean> = new Map();
    #loadedMap: Map<string, any> = new Map();

    constructor(redGPUContext: RedGPUContext, spatialGrid: LandscapeSpatialGrid, loadingRadius: number = 2500.0) {
        this.#redGPUContext = redGPUContext;
        this.#spatialGrid = spatialGrid;
        this.#loadingRadius = loadingRadius;
    }

    get vhtAtlasTexture(): GPUTexture | null {
        return this.#vhtAtlasTexture;
    }

    set vhtAtlasTexture(texture: GPUTexture | null) {
        this.#vhtAtlasTexture = texture;
    }

    get spatialGrid(): LandscapeSpatialGrid {
        return this.#spatialGrid;
    }

    set spatialGrid(grid: LandscapeSpatialGrid) {
        this.#spatialGrid = grid;
    }

    get loadingRadius(): number {
        return this.#loadingRadius;
    }

    set loadingRadius(val: number) {
        this.#loadingRadius = val;
    }

    get maxLoadsPerFrame(): number {
        return this.#maxLoadsPerFrame;
    }

    set maxLoadsPerFrame(val: number) {
        this.#maxLoadsPerFrame = val;
    }

    get pendingQueueSize(): number {
        return this.#pendingQueue.length;
    }

    get loadedTileCount(): number {
        return this.#loadedMap.size;
    }

    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileUrlResolver = resolver;
        if (resolver) {
            console.log('[LandscapeTileStreamer 🛰️] Tile URL Resolver registered successfully!');
        }
    }

    /**
     * [KO] 매 프레임 카메라 위치를 기준으로 시야 반경 내 타일을 추적하고 동적 로딩을 수행합니다 (Zero-GC).
     */
    update(camX: number, camZ: number): void {
        if (!this.#tileUrlResolver) return;
        // 1. 시야 반경 내 활성 컴포넌트 목록 수집 (Zero-GC 재사용 버퍼)
        this.#spatialGrid.getActiveComponentsInRadius(
            camX,
            camZ,
            this.#loadingRadius,
            this.#activeComponentsBuffer
        );

        // 2. 미로딩 컴포넌트 스트리밍 큐에 추가
        const activeLen = this.#activeComponentsBuffer.length;
        for (let i = 0; i < activeLen; i++) {
            const comp = this.#activeComponentsBuffer[i];
            const key = `${comp.componentZ}_${comp.componentX}`;

            if (!this.#loadedMap.has(key) && !this.#loadingMap.has(key)) {
                this.#loadingMap.set(key, true);
                this.#pendingQueue.push(comp);
            }
        }

        // 3. 프레임당 로딩 예산(maxLoadsPerFrame)만큼 큐 처리
        let loadsThisFrame = 0;
        while (this.#pendingQueue.length > 0 && loadsThisFrame < this.#maxLoadsPerFrame) {
            const comp = this.#pendingQueue.shift();
            if (comp) {
                loadsThisFrame++;
                this.#loadTile(comp);
            }
        }
    }

    async #loadTile(comp: LandscapeComponent): Promise<void> {
        if (!this.#tileUrlResolver) return;
        const key = `${comp.componentZ}_${comp.componentX}`;
        const url = this.#tileUrlResolver(comp.componentZ, comp.componentX);

        try {
            console.log(`[LandscapeTileStreamer 🛰️] Loading tile (${key}) from:`, url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();

            const parsed = await parse16BitPngBufferToGPUTexture(this.#redGPUContext, buffer);
            if (parsed) {
                console.log(`[LandscapeTileStreamer ✅] Tile (${key}) loaded successfully! (${parsed.width}x${parsed.height})`);
                this.#loadedMap.set(key, parsed.gpuTexture);

                if (this.#vhtAtlasTexture) {
                    const {gpuDevice} = this.#redGPUContext;
                    const commandEncoder = gpuDevice.createCommandEncoder({label: `VHT_SubRegion_Copy_${key}`});
                    const targetX = comp.componentX * parsed.width;
                    const targetZ = comp.componentZ * parsed.height;

                    commandEncoder.copyTextureToTexture(
                        {texture: parsed.gpuTexture},
                        {
                            texture: this.#vhtAtlasTexture,
                            origin: [targetX, targetZ, 0]
                        },
                        [parsed.width, parsed.height, 1]
                    );
                    gpuDevice.queue.submit([commandEncoder.finish()]);
                    console.log(`[LandscapeTileStreamer ⛰️] VHT Atlas Sub-region (${key}) copied at [${targetX}, ${targetZ}]`);
                }
            }
        } catch (e) {
            console.warn(`[LandscapeTileStreamer ⚠️] Tile (${key}) load failed:`, e);
        } finally {
            this.#loadingMap.delete(key);
        }
    }
}

export default LandscapeTileStreamer;
