import RedGPUContext from "../context/RedGPUContext";
import LandscapeRenderer from "./core/renderer/LandscapeRenderer";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import PerspectiveCamera from "../camera/camera/PerspectiveCamera";
import landscapeVertexSource from "./core/shader/landscapeVertex.wgsl";
import LANDSCAPE_BASE_GRID_SIZE, {validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./core/spatial/LandscapeComponent";
import LandscapeInstanceBuffer from "./core/spatial/LandscapeInstanceBuffer";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeWeightMapCPUSampler from "./core/cache/LandscapeWeightMapCPUSampler";
import LandscapeLayer, {LandscapeLayerOptions} from "./LandscapeLayer";
import LandscapeSharedGeometry from "./core/spatial/LandscapeSharedGeometry";
import ColorRGBA from "../color/ColorRGBA";
import LandscapeSpatialGrid from "./core/spatial/LandscapeSpatialGrid";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "./core/spatial/LandscapeTileStreamer";
import RedGPUObject from "../base/RedGPUObject";
import FoliageManager from "./foliage/FoliageManager";
import {FOLIAGE_SUB_CELL_SIZE} from "./foliage/FOLIAGE_CONSTANTS";
import GrassManager from "./grass/GrassManager";
import LandscapeGPUCuller from "./core/spatial/LandscapeGPUCuller";
import LandscapeDebuggerManager from "./debugger/LandscapeDebuggerManager";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {mat4} from 'gl-matrix';
import {COMMAND_ENCODER_TYPE} from "../commandEncoderManager/COMMAND_ENCODER_TYPE";

const DEFAULT_LOD_MULTIPLIERS: number[] = [1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0];
const tempPVMatrix: Float32Array = new Float32Array(16);

class Landscape extends RedGPUObject {

    #spatialGrid: LandscapeSpatialGrid;
    #sharedGeometry: LandscapeSharedGeometry;
    #instanceBuffer: LandscapeInstanceBuffer;
    #tileStreamer: LandscapeTileStreamer;
    #material: LandscapeMaterial;
    #weightMapCPUSampler: LandscapeWeightMapCPUSampler;
    #gpuCuller: LandscapeGPUCuller | null = null;

    #foliageManager: FoliageManager;
    #grassManager: GrassManager;
    #debuggerManager: LandscapeDebuggerManager;

    #heightScale: number = 500.0;
    #componentSizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
    #lod0SizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;

    #lodMetric: 'distance' | 'screenSize' = 'screenSize';
    #lodMaxLevel: number;
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #lodDistancesBuffer: Float32Array = new Float32Array(8);
    #lastTanHalfFOV: number = 1.0;
    #tileHeightBuffer: Float32Array = new Float32Array(2);

    #receiveShadow: boolean = true;
    #castHeightmapShadow: boolean = false;
    #heightmapShadowSteps: number = 16;
    #heightmapShadowDistance: number = 3000.0;
    #heightmapShadowSoftness: number = 8.0;

    #renderer: LandscapeRenderer;
    #vertexShaderModule: GPUShaderModule;
    #lastHZBView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;
    #currentRenderViewStateData: RenderViewStateData | null = null;

    constructor(redGPUContext: RedGPUContext, worldSize: number | [number, number] = 2000) {
        super(redGPUContext);

        let wsX = 2000;
        let wsZ = 2000;
        if (Array.isArray(worldSize)) {
            [wsX, wsZ] = worldSize;
        } else if (typeof worldSize === 'number') {
            wsX = wsZ = worldSize;
        }

        const worldSizeX = wsX;
        const worldSizeZ = wsZ;
        const componentCountX = 16;
        const componentCountZ = 16;
        const tileSizeX = worldSizeX / componentCountX;
        const tileSizeZ = worldSizeZ / componentCountZ;
        const {QUAD_64: componentSizeQuads, QUAD_256: lod0SizeQuads} = LANDSCAPE_BASE_GRID_SIZE;
        const lodMaxLevel = 5;

        const material = new LandscapeMaterial(redGPUContext);
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, componentSizeQuads, lodMaxLevel, lod0SizeQuads);

        this.#spatialGrid = new LandscapeSpatialGrid(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#material = material;
        this.#weightMapCPUSampler = new LandscapeWeightMapCPUSampler();
        this.#componentSizeQuads = componentSizeQuads;
        this.#lod0SizeQuads = lod0SizeQuads;
        this.#lodMaxLevel = lodMaxLevel;
        this.#lodMetric = 'screenSize';
        this.#tileStreamer = new LandscapeTileStreamer(redGPUContext, this.#spatialGrid, 2500.0);
        this.#tileStreamer.lod0SizeQuads = lod0SizeQuads;
        this.#heightScale = 500.0;

        this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
        this.#tileStreamer.setMaterial(material);

        material.setOnRebakeVBTRequested(() => {
            this.#tileStreamer.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
        });

        this.#initSystems(redGPUContext, componentCountX, componentCountZ, lodMaxLevel);
        this.#foliageManager = new FoliageManager(this, () => {
            this.#updateLandscapeUniforms();
        });
        this.#grassManager = new GrassManager(this);
        this.#tileStreamer.setOnTileLoaded((tileComponent) => {
            this.#onTileHeightBoundsLoaded(tileComponent);
        });
        this.#tileStreamer.setOnGlobalHeightmapBaked(() => {
            this.#syncAllTileHeightBoundsFromGlobalHeightmap();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.repopulateAll();
        });
        this.#debuggerManager = new LandscapeDebuggerManager(this, this.#tileStreamer, {
            onDebugPropertyChange: (key) => {
                if (key === 'debugMode' || key === 'lodColoration') {
                    this.#updateLandscapeUniforms();
                }
            }
        });
        this.#renderer = new LandscapeRenderer(this);
        this.#updateLandscapeUniforms();
    }

    get sharedGeometry(): LandscapeSharedGeometry {
        return this.#sharedGeometry;
    }

    get instanceBuffer(): LandscapeInstanceBuffer {
        return this.#instanceBuffer;
    }

    get vertexShaderModule(): GPUShaderModule {
        return this.#vertexShaderModule;
    }

    get debuggerManager(): LandscapeDebuggerManager {
        return this.#debuggerManager;
    }

    get foliageManager(): FoliageManager {
        return this.#foliageManager;
    }

    get grassManager(): GrassManager {
        return this.#grassManager;
    }

    get material(): LandscapeMaterial {
        return this.#material;
    }

    get worldSize(): [number, number] {
        return this.#spatialGrid.worldSize;
    }

    set worldSize(value: number | [number, number]) {
        let wx = this.#spatialGrid.worldSizeX;
        let wz = this.#spatialGrid.worldSizeZ;
        if (Array.isArray(value)) {
            wx = value[0];
            wz = value[1];
        } else if (typeof value === 'number') {
            wx = value;
            wz = value;
        }

        if (wx > 0 && wz > 0 && (this.#spatialGrid.worldSizeX !== wx || this.#spatialGrid.worldSizeZ !== wz)) {
            const tcX = this.#spatialGrid.tileCountX;
            const tcZ = this.#spatialGrid.tileCountZ;
            this.#spatialGrid.setConfig(tcX, tcZ, wx / tcX, wz / tcZ);
            this.#updateLandscapeUniforms();
            this.#rebuildTiles();
        }
    }

    get worldSizeX(): number {
        return this.#spatialGrid.worldSizeX;
    }

    get worldSizeZ(): number {
        return this.#spatialGrid.worldSizeZ;
    }

    get invWorldSizeX(): number {
        return this.#spatialGrid.invWorldSizeX;
    }

    get invWorldSizeZ(): number {
        return this.#spatialGrid.invWorldSizeZ;
    }

    get halfWorldSizeX(): number {
        return this.#spatialGrid.halfWorldSizeX;
    }

    get halfWorldSizeZ(): number {
        return this.#spatialGrid.halfWorldSizeZ;
    }

    get componentCount(): [number, number] {
        return this.#spatialGrid.componentCount;
    }

    set componentCount(value: number | [number, number]) {
        let tcX = this.#spatialGrid.tileCountX;
        let tcZ = this.#spatialGrid.tileCountZ;
        if (Array.isArray(value)) {
            tcX = this.#clampComponentCount(value[0]);
            tcZ = this.#clampComponentCount(value[1]);
        } else if (typeof value === 'number') {
            const count = this.#clampComponentCount(value);
            tcX = count;
            tcZ = count;
        }

        if (this.#spatialGrid.tileCountX !== tcX || this.#spatialGrid.tileCountZ !== tcZ) {
            const wx = this.#spatialGrid.worldSizeX;
            const wz = this.#spatialGrid.worldSizeZ;
            this.#spatialGrid.setConfig(tcX, tcZ, wx / tcX, wz / tcZ);
            this.#rebuildTiles();
        }
    }

    get tileSize(): [number, number] {
        return this.#spatialGrid.tileSize;
    }

    get heightScale(): number {
        return this.#heightScale;
    }

    set heightScale(val: number) {
        if (this.#heightScale !== val) {
            this.#heightScale = val;
            this.#tileStreamer?.setTerrainConfig(val);
            this.#updateLandscapeUniforms();
            this.#tileStreamer?.rebakeAllLoadedVNT();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.repopulateAll();
        }
    }

    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    set componentSizeQuads(value: number) {
        validateLandscapeBaseGridSize(value);
        if (value > 0 && this.#componentSizeQuads !== value) {
            this.#componentSizeQuads = value;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                value,
                this.#lodMaxLevel,
                this.#lod0SizeQuads
            );
            this.#rebuildTiles();
        }
    }

    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    set lod0SizeQuads(value: number) {
        const clamped = Math.max(this.#componentSizeQuads, Math.round(value));
        if (this.#lod0SizeQuads !== clamped) {
            this.#lod0SizeQuads = clamped;
            this.#tileStreamer.lod0SizeQuads = clamped;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                this.#componentSizeQuads,
                this.#lodMaxLevel,
                clamped
            );
            this.#rebuildTiles();
        }
    }

    get components(): LandscapeComponent[] {
        return this.#spatialGrid.flatCells;
    }

    get lodMetric(): 'distance' | 'screenSize' {
        return this.#lodMetric;
    }

    set lodMetric(value: 'distance' | 'screenSize') {
        if (this.#lodMetric !== value) {
            this.#lodMetric = value;
            this.#updateLandscapeUniforms();
        }
    }

    get lodMaxLevel(): number {
        return this.#lodMaxLevel;
    }

    set lodMaxLevel(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#lodMaxLevel !== count) {
            this.#lodMaxLevel = count;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#spatialGrid.tileSizeX,
                this.#spatialGrid.tileSizeZ,
                this.#componentSizeQuads,
                count,
                this.#lod0SizeQuads
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    get lodDistancesSq(): number[] {
        return this.#lodDistancesSq;
    }

    get baseColor(): ColorRGBA {
        return this.#material.baseColor;
    }

    get layers(): LandscapeLayer[] {
        return this.#material.layers;
    }

    get nearDetailDistance(): number {
        return this.#material.nearDetailDistance;
    }

    set nearDetailDistance(val: number) {
        this.#material.nearDetailDistance = val;
    }

    get globalHeightmapUrl(): string {
        return this.#tileStreamer?.globalHeightmapUrl ?? '';
    }

    set globalHeightmapUrl(val: string) {
        if (this.#tileStreamer) {
            this.#tileStreamer.globalHeightmapUrl = val;
        }
    }

    get tileLoadingRadius(): number {
        return this.#tileStreamer.tileLoadingRadius;
    }

    set tileLoadingRadius(value: number) {
        this.#tileStreamer.tileLoadingRadius = value;
    }

    get tileMaxLoadsPerFrame(): number {
        return this.#tileStreamer.tileMaxLoadsPerFrame;
    }

    set tileMaxLoadsPerFrame(value: number) {
        this.#tileStreamer.tileMaxLoadsPerFrame = value;
    }

    get tileLoadedCount(): number {
        return this.#tileStreamer?.tileLoadedCount ?? 0;
    }

    get vhtTextureView(): GPUTextureView | null {
        return this.#tileStreamer?.vhtAtlasTexture?.gpuTextureView ?? null;
    }

    get vbtTextureView(): GPUTextureView | null {
        return this.#tileStreamer?.vbtBaseColorAtlas?.gpuTextureView ?? null;
    }

    get hasValidScatterAtlas(): boolean {
        const streamer = this.#tileStreamer;
        return !!(
            streamer?.vhtAtlasTexture?.gpuTextureView &&
            streamer?.vbtBaseColorAtlas?.gpuTextureView &&
            streamer?.tileLoadedCount > 0
        );
    }

    get hasValidVbtAtlas(): boolean {
        const streamer = this.#tileStreamer;
        return !!(
            streamer?.vbtBaseColorAtlas?.gpuTextureView &&
            streamer?.tileLoadedCount > 0
        );
    }

    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }

    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(value: boolean) {
        if (this.#receiveShadow !== value) {
            this.#receiveShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    get castHeightmapShadow(): boolean {
        return this.#castHeightmapShadow;
    }

    set castHeightmapShadow(value: boolean) {
        if (this.#castHeightmapShadow !== value) {
            this.#castHeightmapShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    get heightmapShadowDistance(): number {
        return this.#heightmapShadowDistance;
    }

    set heightmapShadowDistance(value: number) {
        if (this.#heightmapShadowDistance !== value) {
            this.#heightmapShadowDistance = Math.max(10.0, value);
            this.#updateLandscapeUniforms();
        }
    }

    get heightmapShadowSteps(): number {
        return this.#heightmapShadowSteps;
    }

    set heightmapShadowSteps(value: number) {
        if (this.#heightmapShadowSteps !== value) {
            this.#heightmapShadowSteps = Math.max(4, Math.min(64, Math.round(value)));
            this.#updateLandscapeUniforms();
        }
    }

    get heightmapShadowSoftness(): number {
        return this.#heightmapShadowSoftness;
    }

    set heightmapShadowSoftness(value: number) {
        if (this.#heightmapShadowSoftness !== value) {
            this.#heightmapShadowSoftness = Math.max(0.1, value);
            this.#updateLandscapeUniforms();
        }
    }

    getHeightAt(x: number, z: number): number {
        return this.#tileStreamer.getHeightAt(x, z);
    }

    isTileLoaded(row: number, col: number): boolean {
        return this.#tileStreamer?.isTileLoaded(row, col) ?? false;
    }

    addLayer(options: LandscapeLayerOptions): LandscapeLayer {
        const layer = new LandscapeLayer(this.redGPUContext, options);
        layer.weightMapCPUSampler = this.#weightMapCPUSampler;
        const weightSrc = layer.weightTexture?.src;
        if (weightSrc) {
            this.#weightMapCPUSampler.load(weightSrc);
        }
        this.#material.addLayer(layer);
        return layer;
    }

    removeLayer(layer: LandscapeLayer | string): boolean {
        if (!layer) return false;
        return this.#material.removeLayer(layer);
    }

    clearLayers(): void {
        this.#material.clearLayers();
    }

    getLayer(name: string): LandscapeLayer | undefined {
        if (!name) return undefined;
        return this.#material.getLayer(name);
    }

    update(renderViewStateData: RenderViewStateData): void {
        if (!renderViewStateData) return;

        const {view, frustumPlanesFlat} = renderViewStateData;
        const rawCamera = view.rawCamera as PerspectiveCamera;
        if (!rawCamera) return;

        if (this.#material) {
            this.#material.updateUniformsData();
        }

        const {x, y, z, viewMatrix, fieldOfView} = rawCamera;
        const {projectionMatrix, hierarchicalZBuffer} = view;

        this.#tileStreamer.update(x, z, y);

        const {tileCountX, tileCountZ, tileSizeX, tileSizeZ} = this.#spatialGrid;
        const totalComponents = tileCountX * tileCountZ;

        this.#instanceBuffer.resetIndirectDrawBuffer(this.#sharedGeometry, this.#lodMaxLevel, !!this.#debuggerManager?.landscapeWireframe);

        const fovDeg = fieldOfView ?? 60.0;
        const tanHalfFOV = Math.tan(((fovDeg * Math.PI) / 180.0) * 0.5);
        if (Math.abs(this.#lastTanHalfFOV - tanHalfFOV) > 1e-4) {
            this.#lastTanHalfFOV = tanHalfFOV;
            this.#updateLandscapeUniforms();
        }
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;

        const effectiveHZBTextureView = hierarchicalZBuffer?.textureView || null;
        const effectiveHZBSampler = hierarchicalZBuffer?.sampler || null;

        if (this.#lastHZBView !== effectiveHZBTextureView) {
            this.#lastHZBView = effectiveHZBTextureView;
            this.#lastHZBSampler = effectiveHZBSampler;
            const instanceBuffer = this.#instanceBuffer;
            if (instanceBuffer) {
                const {allTilesBuffer, visibleTilesBuffer, indirectDrawBuffer} = instanceBuffer;
                if (allTilesBuffer && visibleTilesBuffer && indirectDrawBuffer) {
                    this.#gpuCuller?.updateBindGroup(
                        allTilesBuffer,
                        visibleTilesBuffer,
                        indirectDrawBuffer,
                        effectiveHZBTextureView,
                        effectiveHZBSampler
                    );
                }
            }
        }

        let mainPVMatrix: Float32Array | null = null;
        if (projectionMatrix && viewMatrix) {
            mainPVMatrix = tempPVMatrix;
            mat4.multiply(mainPVMatrix, projectionMatrix, viewMatrix);
        }

        this.#gpuCuller?.updateUniforms(
            x, y, z,
            this.#lodMaxLevel,
            tileSizeX, tileSizeZ,
            this.#heightScale,
            totalComponents,
            frustumPlanesFlat,
            this.#lodDistancesBuffer,
            tanHalfFOV,
            lodMetricVal,
            !!effectiveHZBTextureView,
            mainPVMatrix
        );

        this.#foliageManager?.update(renderViewStateData);
        this.#grassManager?.update(renderViewStateData);
        this.#currentRenderViewStateData = renderViewStateData;

        this.commandEncoderManager.useEncoder(
            COMMAND_ENCODER_TYPE.PRE_PROCESS,
            this.#onResetEcosystemIndirectCommands
        );

        this.commandEncoderManager.addPreProcessComputePass(
            'Landscape_UnifiedCulling_ComputePass',
            this.#onPreProcessUnifiedComputePass
        );

        this.#debuggerManager.update(rawCamera);
    }

    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        this.#renderer.render(view, passEncoder);
    }

    destroy(): void {
        this.#debuggerManager?.destroy();
        this.#weightMapCPUSampler?.destroy();
        this.#foliageManager?.destroy?.();
        this.#grassManager?.destroy?.();
        this.#sharedGeometry?.destroy();
        this.#gpuCuller?.destroy();
        this.#tileStreamer?.destroy();

        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
        }
        this.#renderer?.destroy();
        this.#currentRenderViewStateData = null;
    }

    #initSystems(
        redGPUContext: RedGPUContext,
        componentCountX: number,
        componentCountZ: number,
        lodMaxLevel: number
    ) {
        this.#tileStreamer.setTerrainConfig(this.#heightScale);

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('Landscape_Flat_VertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('Landscape_Flat_VertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;

        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, componentCountX * componentCountZ, lodMaxLevel);
        const tileStreamer = this.#tileStreamer;
        if (tileStreamer?.vhtAtlasTexture && tileStreamer?.vntAtlasTexture) {
            const {vhtAtlasTexture, vntAtlasTexture, vbtBaseColorAtlas, vbtNormalAtlas, vbtORMAtlas} = tileStreamer;
            this.#instanceBuffer.updateBindGroup(
                vhtAtlasTexture.gpuTextureView,
                vntAtlasTexture.gpuTextureView,
                vbtBaseColorAtlas?.gpuTextureView,
                vbtNormalAtlas?.gpuTextureView,
                vbtORMAtlas?.gpuTextureView
            );
        }

        this.#rebuildLODStructures();
        this.#rebuildTiles();
    }

    #rebuildTiles(): void {
        const {tileCountX, tileCountZ, tileSizeX, tileSizeZ} = this.#spatialGrid;
        const componentCountX = tileCountX;
        const componentCountZ = tileCountZ;
        const targetCount = componentCountX * componentCountZ;

        this.#tileStreamer.resetTileState();
        this.#sharedGeometry.updateTileSize(tileSizeX, tileSizeZ);
        this.#updateLODDistances();
        this.#renderer?.clearPipelineCaches();

        let needRebuildBindGroup = false;
        const changed = this.#tileStreamer.ensureAtlasSize(componentCountX, componentCountZ);
        if (changed) {
            this.#tileStreamer.setTerrainConfig(this.#heightScale);
            this.#tileStreamer.resetTileState();
            needRebuildBindGroup = true;
        }

        if (!this.#instanceBuffer || this.#instanceBuffer.maxComponentCount !== targetCount || this.#instanceBuffer.lodMaxLevel !== this.#lodMaxLevel) {
            if (this.#instanceBuffer) {
                this.#instanceBuffer.destroy();
            }
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.redGPUContext, targetCount, this.#lodMaxLevel);
            needRebuildBindGroup = true;
        }

        if (needRebuildBindGroup && this.#tileStreamer.vhtAtlasTexture && this.#tileStreamer.vntAtlasTexture) {
            const {
                vhtAtlasTexture,
                vntAtlasTexture,
                vbtBaseColorAtlas,
                vbtNormalAtlas,
                vbtORMAtlas,
                globalHeightTexture
            } = this.#tileStreamer;
            this.#instanceBuffer.updateBindGroup(
                vhtAtlasTexture.gpuTextureView,
                vntAtlasTexture.gpuTextureView,
                vbtBaseColorAtlas?.gpuTextureView,
                vbtNormalAtlas?.gpuTextureView,
                vbtORMAtlas?.gpuTextureView
            );
            if (globalHeightTexture) {
                this.#bakeGlobalBaseToVHT();
            }
        }

        this.#gpuCuller = new LandscapeGPUCuller(this.redGPUContext);

        this.#spatialGrid.rebuildTiles((comp, index) => {
            comp.setHeightBounds(0.0, 1.0);
            this.#instanceBuffer.setStaticTileData(
                index,
                comp.worldX,
                comp.worldZ,
                comp.minHeightNorm,
                comp.maxHeightNorm
            );
        });

        this.#instanceBuffer.uploadStaticTilesToGPU();
        this.#updateLandscapeUniforms();

        const instanceBuffer = this.#instanceBuffer;
        if (instanceBuffer) {
            const {allTilesBuffer, visibleTilesBuffer, indirectDrawBuffer} = instanceBuffer;
            if (allTilesBuffer && visibleTilesBuffer && indirectDrawBuffer) {
                this.#gpuCuller.updateBindGroup(
                    allTilesBuffer,
                    visibleTilesBuffer,
                    indirectDrawBuffer,
                    this.#lastHZBView,
                    this.#lastHZBSampler
                );
            }
        }

        this.#material?.requestVBTRebake(true);
    }

    #rebuildLODStructures(): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        for (let i = 0; i < this.#lodMaxLevel; i++) {
            this.#lodColorsRGBA.push(LANDSCAPE_DEFAULT_LOD_COLORS[i % LANDSCAPE_DEFAULT_LOD_COLORS.length] as [number, number, number, number]);
        }

        const multipliers = DEFAULT_LOD_MULTIPLIERS;
        for (let i = 0; i < this.#lodMaxLevel - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.0 * Math.pow(1.8, i)));
        }

        this.#updateLODDistances();
        this.#updateLandscapeUniforms();
    }

    #updateLODDistances(): void {
        this.#lodDistancesSq.length = 0;
        const tileSizeMax = Math.max(this.#spatialGrid.tileSizeX, this.#spatialGrid.tileSizeZ);
        const count = this.#lodMultipliers.length;

        for (let i = 0; i < count; i++) {
            const dist = tileSizeMax * this.#lodMultipliers[i];
            this.#lodDistancesSq.push(dist * dist);
        }

        const lodDistancesArray = this.#lodDistancesBuffer;
        lodDistancesArray.fill(1e15);
        const countDist = Math.min(8, this.#lodDistancesSq.length);
        for (let i = 0; i < countDist; i++) {
            const val = this.#lodDistancesSq[i];
            if (val && val > 0) {
                lodDistancesArray[i] = val;
            }
        }
    }

    #updateLandscapeUniforms(): void {
        const {
            tileCountX: countX,
            tileCountZ: countZ,
            worldSizeX,
            worldSizeZ,
            tileSizeX,
            tileSizeZ
        } = this.#spatialGrid;
        const vhtW = this.#tileStreamer?.vhtAtlasTexture?.gpuTexture?.width || (countX * 512);
        const vhtH = this.#tileStreamer?.vhtAtlasTexture?.gpuTexture?.height || (countZ * 512);
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;
        this.#instanceBuffer?.updateUniforms(
            this.#heightScale,
            worldSizeX,
            worldSizeZ,
            this.#debuggerManager?.landscapeLodColoration ?? false,
            countX * countZ,
            tileSizeX,
            tileSizeZ,
            this.#componentSizeQuads,
            vhtW,
            vhtH,
            this.#lodColorsRGBA,
            this.#lodDistancesSq,
            this.#lastTanHalfFOV,
            lodMetricVal,
            this.#lod0SizeQuads,
            this.#receiveShadow,
            this.#castHeightmapShadow,
            this.#heightmapShadowSteps,
            this.#heightmapShadowDistance,
            this.#heightmapShadowSoftness,
            this.#foliageManager?.debugSubCellColoration ?? false,
            FOLIAGE_SUB_CELL_SIZE,
            this.#debuggerManager?.landscapeDebugMode ?? 0
        );
    }

    #onResetEcosystemIndirectCommands = (encoder: GPUCommandEncoder): void => {
        this.#foliageManager?.recordResetCommands(encoder);
        this.#grassManager?.recordResetCommands(encoder);
    };

    #onPreProcessUnifiedComputePass = (computePass: GPUComputePassEncoder): void => {
        const totalComponents = this.#spatialGrid.tileCountX * this.#spatialGrid.tileCountZ;
        this.#gpuCuller?.dispatchPass(computePass, totalComponents);
        this.#foliageManager?.dispatchCullingPass(computePass);
        if (this.#currentRenderViewStateData) {
            this.#grassManager?.dispatchCullingPass(computePass, this.#currentRenderViewStateData);
        }
    };

    #onTileHeightBoundsLoaded(comp: LandscapeComponent): void {
        const index = comp.componentZ * this.#spatialGrid.tileCountX + comp.componentX;
        this.#instanceBuffer.updateTileHeightBounds(index, comp.minHeightNorm, comp.maxHeightNorm);
        const gpuDevice = this.redGPUContext.gpuDevice;
        const allTilesBuffer = this.#instanceBuffer.allTilesBuffer;
        if (gpuDevice && allTilesBuffer) {
            this.#tileHeightBuffer[0] = comp.minHeightNorm;
            this.#tileHeightBuffer[1] = comp.maxHeightNorm;
            gpuDevice.queue.writeBuffer(
                allTilesBuffer,
                index * 16 + 8,
                this.#tileHeightBuffer.buffer,
                0,
                8
            );
        }
    }

    #syncAllTileHeightBoundsFromGlobalHeightmap(): void {
        const g = this.#tileStreamer?.globalCPUHeightMap;
        if (!g) return;
        const {width, height, pixels, maxVal} = g;
        const tileCountX = this.#spatialGrid.tileCountX;
        const tileCountZ = this.#spatialGrid.tileCountZ;
        const maxNorm = maxVal || (pixels instanceof Uint16Array ? 65535.0 : 255.0);

        const flatCells = this.#spatialGrid.flatCells;
        for (let idx = 0; idx < flatCells.length; idx++) {
            const comp = flatCells[idx];
            if (!comp) continue;
            const {componentX, componentZ} = comp;
            const uMin = componentX / tileCountX;
            const uMax = (componentX + 1) / tileCountX;
            const vMin = componentZ / tileCountZ;
            const vMax = (componentZ + 1) / tileCountZ;

            const pxMinX = Math.floor(uMin * width);
            const pxMaxX = Math.min(width - 1, Math.ceil(uMax * width));
            const pxMinZ = Math.floor(vMin * height);
            const pxMaxZ = Math.min(height - 1, Math.ceil(vMax * height));

            let minP = Infinity;
            let maxP = -Infinity;
            for (let z = pxMinZ; z <= pxMaxZ; z++) {
                const rowOffset = z * width;
                for (let x = pxMinX; x <= pxMaxX; x++) {
                    const p = pixels[rowOffset + x];
                    if (p < minP) minP = p;
                    if (p > maxP) maxP = p;
                }
            }

            if (minP !== Infinity && maxP !== -Infinity) {
                const minHeightNorm = minP / maxNorm;
                const maxHeightNorm = maxP / maxNorm;
                comp.setHeightBounds(minHeightNorm, maxHeightNorm);
                this.#instanceBuffer.updateTileHeightBounds(idx, minHeightNorm, maxHeightNorm);
            }
        }
        this.#instanceBuffer.uploadStaticTilesToGPU();
    }

    #bakeGlobalBaseToVHT(): void {
        if (!this.#tileStreamer?.globalHeightTexture) return;

        this.#tileStreamer.bakeGlobalBase();
        this.#grassManager?.rebakeAll();
    }

    #clampComponentCount(val: number): number {
        const maxTextureDim = this.gpuDevice?.limits?.maxTextureDimension2D ?? 8192;
        const maxTilesForHardware = Math.floor(maxTextureDim / 512);
        const maxAllowed = Math.min(32, Math.max(1, maxTilesForHardware));
        return Math.min(maxAllowed, Math.max(1, Math.round(val)));
    }
}

Object.freeze(Landscape);
export default Landscape;

