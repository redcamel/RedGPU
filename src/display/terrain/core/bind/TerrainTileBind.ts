import RedGPUContext from "../../../../context/RedGPUContext";
import TerrainMaterialBind from "./TerrainMaterialBind";
import TerrainGeometry from "../geometry/TerrainGeometry";
import TerrainTileManager, {
    sanitizeVerticesPerSide,
    SpatialTileInfo,
    TerrainOptions,
    TileStreamMetrics
} from "../tile/TerrainTileManager";
import defineTexture from "../../../../defineProperty/funcs/texture/defineTexture";
import defineVector2 from "../../../../defineProperty/funcs/vector/defineVector2";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../../../defineProperty/core/updateTargetUniform";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import {TerrainSpatialGrid} from "../tile/TerrainSpatialGrid";
import {TerrainQuadtree} from "../tile/TerrainQuadtree";

interface TerrainTileBind {
    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;
    worldOffset: [number, number];
    worldSize: [number, number];
    minHeight: number;
    maxHeight: number;
    maxLOD: number;
    baseSlotIndex: number;
}

class TerrainTileBind extends TerrainMaterialBind {
    #tileManager: TerrainTileManager;
    #verticesPerSide: number = 64;
    #lodRanges: Float32Array = new Float32Array(32);

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions) {
        super(redGPUContext, options);

        const verticesPerSide = sanitizeVerticesPerSide(options?.verticesPerSide ?? 64);
        this.#verticesPerSide = verticesPerSide;

        this.minHeight = 0;
        this.maxHeight = 0.5;
        this.worldOffset = [-0.5, -0.5];
        this.maxLOD = 4;
        this.baseSlotIndex = 0;

        this.#tileManager = new TerrainTileManager(this, redGPUContext, options);
    }

    get tileManager(): TerrainTileManager {
        return this.#tileManager;
    }

    // ==========================================================
    // Tile & LOD Proxies
    // ==========================================================
    get instanceBuffer(): GPUBuffer {
        return this.#tileManager.instanceBuffer;
    }

    get lodRanges(): Float32Array {
        return this.#lodRanges;
    }

    set lodRanges(value: Float32Array) {
        this.#lodRanges = value;
        updateTargetUniform(this, 'lodRanges', value);
    }

    get verticesPerSide(): number {
        return this.#verticesPerSide;
    }

    set verticesPerSide(value: number) {
        const safeValue = sanitizeVerticesPerSide(value);
        this.geometry = new TerrainGeometry(this.redGPUContext, safeValue);
        this.#verticesPerSide = safeValue;
        updateTargetUniform(this, 'verticesPerSide', safeValue);
    }

    get quadsPerSide(): number {
        return this.#verticesPerSide - 1;
    }

    get atlasTileCountX(): number {
        return this.#tileManager.atlasTileCountX;
    }

    get atlasTileCountZ(): number {
        return this.#tileManager.atlasTileCountZ;
    }

    get atlasTileSize(): number {
        return this.#tileManager.atlasTileSize;
    }

    get spatialGrid(): TerrainSpatialGrid {
        return this.#tileManager.spatialGrid;
    }

    get quadtree(): TerrainQuadtree {
        return this.#tileManager.quadtree;
    }

    get tileStreamMetrics(): TileStreamMetrics {
        return this.#tileManager.tileStreamMetrics;
    }

    get synthesizedTileCount(): number {
        return this.#tileManager.synthesizedTileCount;
    }

    get lodThreshold(): number {
        return this.#tileManager.lodThreshold;
    }

    set lodThreshold(value: number) {
        this.#tileManager.lodThreshold = value;
    }

    get flatHeightmapData(): Uint16Array {
        return this.#tileManager.flatHeightmapData;
    }

    get tileDataCache(): Map<string, ArrayBufferView | ArrayBuffer> {
        return this.#tileManager.tileDataCache;
    }

    getTerrainHeight(x: number, z: number): number {
        return this.#tileManager.getTerrainHeight(x, z);
    }

    checkQuadtree(renderViewStateData: any) {
        this.#tileManager.checkQuadtree(renderViewStateData);
    }

    isTileSynthesized(tile: SpatialTileInfo | string): boolean {
        return this.#tileManager.isTileSynthesized(tile);
    }

    setTileUrlResolver(resolver: (tile: SpatialTileInfo) => string | void) {
        this.#tileManager.setTileUrlResolver(resolver);
    }

    setOnTileLoad(callback: (tile: SpatialTileInfo) => void) {
        this.#tileManager.setOnTileLoad(callback);
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#tileManager.setOnTileUnload(callback);
    }

    loadTileFrom16BitBuffer(tile: SpatialTileInfo, data: ArrayBuffer | ArrayBufferView, width: number, height: number) {
        this.#tileManager.loadTileFrom16BitBuffer(tile, data, width, height);
    }

    markDirty() {
        this.#tileManager.markDirty();
    }

    override destroy() {
        if (this.#tileManager) {
            this.#tileManager.destroy();
        }
        super.destroy();
    }
}

defineNumber(TerrainTileBind, [
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0},
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1}
]);
defineVector2(TerrainTileBind, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]},
]);
defineTexture(TerrainTileBind, [
    {key: "heightmapAtlasTexture"}
]);

export default TerrainTileBind;
