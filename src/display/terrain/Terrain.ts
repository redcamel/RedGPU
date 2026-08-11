import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import TerrainGeometry from "./core/TerrainGeometry";
import TerrainMaterial, {TerrainLayerConfig} from "./core/material/TerrainMaterial";
import TerrainExporter from "./core/exporter/TerrainExporter";
import TerrainTileManager, {
    sanitizeVerticesPerSide,
    SpatialTileInfo,
    TerrainOptions,
    TileStreamMetrics
} from "./core/tile/TerrainTileManager";
import Sampler from "../../resources/sampler/Sampler";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import vertexModuleSource from "./vertex.wgsl";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineVector2 from "../../defineProperty/funcs/vector/defineVector2";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import updateTargetUniform from "../../defineProperty/core/updateTargetUniform";
import DirectTexture from "../../resources/texture/DirectTexture";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import {TerrainSpatialGrid} from "./core/tile/TerrainSpatialGrid";
import {TerrainQuadtree} from "./core/tile/TerrainQuadtree";

export type {TerrainLayerConfig, TerrainOptions};

interface Terrain {
    heightmapSampler: Sampler;

    heightmapAtlasTexture: DirectTexture | BitmapTexture | null;
    worldOffset: [number, number];
    worldSize: [number, number];
    minHeight: number;
    maxHeight: number;
    maxLOD: number;
    baseSlotIndex: number;
}

class Terrain extends Mesh {
    customVertexBindGroupLayout!: GPUBindGroupLayout;

    #tileManager: TerrainTileManager;
    #verticesPerSide: number = 64;
    #lodRanges: Float32Array = new Float32Array(32);

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions, name?: string) {
        const verticesPerSide = sanitizeVerticesPerSide(options?.verticesPerSide ?? 64);
        const geometry = new TerrainGeometry(redGPUContext, verticesPerSide);
        const material = new TerrainMaterial(redGPUContext, options);

        super(redGPUContext, geometry, material);

        this.#verticesPerSide = verticesPerSide;
        if (name) {
            this.name = name;
        }

        this.ignoreFrustumCulling = true;
        this.receiveShadow = true;

        this.heightmapSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

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

    override get material(): TerrainMaterial {
        return super.material as TerrainMaterial;
    }

    override set material(val: any) {
        throw new Error('Terrain.material is read-only and cannot be reassigned.');
    }

    // ==========================================================
    // Layer & Material Proxies (기존 TerrainLayerSystem, TerrainMaterialBind)
    // ==========================================================
    get layers(): TerrainLayerConfig[] {
        return this.material.layers || [];
    }

    get normalScale(): number {
        return this.material.normalScale;
    }

    set normalScale(value: number) {
        this.material.normalScale = value;
    }

    get occlusionStrength(): number {
        return this.material.occlusionStrength;
    }

    set occlusionStrength(value: number) {
        this.material.occlusionStrength = value;
    }

    get blendContrast(): number {
        return this.material.blendContrast;
    }

    set blendContrast(value: number) {
        this.material.blendContrast = value;
    }

    get baseColorWeight(): number {
        return this.material.baseColorWeight;
    }

    set baseColorWeight(value: number) {
        this.material.baseColorWeight = value;
    }

    get baseColorBlendMode(): 'mix' | 'multiply' {
        return this.material.baseColorBlendMode;
    }

    set baseColorBlendMode(value: 'mix' | 'multiply') {
        this.material.baseColorBlendMode = value;
    }

    get baseColorTexture(): BitmapTexture {
        return this.material.baseColorTexture;
    }

    set baseColorTexture(texture: BitmapTexture) {
        this.material.baseColorTexture = texture;
    }

    get ormTexture(): BitmapTexture {
        return this.material.ormTexture;
    }

    set ormTexture(texture: BitmapTexture) {
        this.material.ormTexture = texture;
    }

    get splatTexture(): BitmapTexture {
        return this.material.splatTexture;
    }

    set splatTexture(texture: BitmapTexture) {
        this.material.splatTexture = texture;
    }

    get tileScale(): number {
        return this.material.tileScale;
    }

    set tileScale(value: number) {
        this.material.tileScale = value;
    }

    get macroScale(): number {
        return this.material.macroScale;
    }

    set macroScale(value: number) {
        this.material.macroScale = value;
    }

    get metallicFactor(): number {
        return this.material.metallicFactor;
    }

    set metallicFactor(value: number) {
        this.material.metallicFactor = value;
    }

    get roughnessFactor(): number {
        return this.material.roughnessFactor;
    }

    set roughnessFactor(value: number) {
        this.material.roughnessFactor = value;
    }

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

    // ==========================================================
    // Tile & LOD Proxies (TerrainTileManager 대리 호출)

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

    addLayer(config: TerrainLayerConfig): number {
        return this.material.addLayer(config);
    }

    removeLayer(indexOrName: number | string): boolean {
        return this.material.removeLayer(indexOrName);
    }

    updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        return this.material.updateLayer(indexOrName, partialConfig);
    }

    setup(options: {
        height?: string;
        baseColor?: string;
        orm?: string;
        splat?: string;
    }): this {
        const ctx = this.redGPUContext;

        if (options.height) {
            this.heightmapAtlasTexture = new BitmapTexture(ctx, options.height, false, null, null, 'r16float');
        }

        if (options.baseColor) {
            this.material.baseColorTexture = new BitmapTexture(ctx, options.baseColor);
        }

        if (options.orm) {
            this.material.ormTexture = new BitmapTexture(ctx, options.orm, true, null, null, 'rgba8unorm');
        }

        if (options.splat) {
            this.material.splatTexture = new BitmapTexture(ctx, options.splat, true, null, null, 'rgba8unorm');
        }

        return this;
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

    // ==========================================================
    // Render & Exporter Methods
    // ==========================================================
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        if (!this.customVertexBindGroupLayout) {
            this.customVertexBindGroupLayout = this.redGPUContext.gpuDevice.createBindGroupLayout({
                label: 'TERRAIN_VERTEX_GPUBindGroupLayout',
                entries: [
                    {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                    {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                    {
                        binding: 2,
                        visibility: GPUShaderStage.VERTEX,
                        texture: {sampleType: 'float', viewDimension: '2d', multisampled: false}
                    },
                    {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                ]
            });
        }
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
            getTerrainVertexBindGroupDescriptor(this, this.customVertexBindGroupLayout)
        );

        return shaderModule;
    }

    updateTexture(prevTexture: DirectTexture | BitmapTexture | null, texture: DirectTexture | BitmapTexture | null) {
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        this.#dirtyPipelineListener();
    }

    updateSampler() {
        this.#dirtyPipelineListener();
    }

    destroy() {
        if (this.heightmapSampler) {
            this.heightmapSampler = null;
        }
        if (this.heightmapAtlasTexture) {
            this.heightmapAtlasTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (this.#tileManager) {
            this.#tileManager.destroy();
        }
        super.destroy();
    }

    downloadHeightmapAtlasAsPNG(fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png') {
        return TerrainExporter.downloadHeightmapAtlasAsPNG(
            this.redGPUContext,
            this.heightmapAtlasTexture,
            fileName
        );
    }

    renderAtlasPreview(ctx: CanvasRenderingContext2D, width: number = 512, height: number = 512) {
        return TerrainExporter.renderAtlasPreview(
            ctx,
            this.atlasTileCountX,
            this.atlasTileCountZ,
            this.tileDataCache,
            width,
            height
        );
    }

    #dirtyPipelineListener = () => {
        if (this.gpuRenderInfo && this.redGPUContext && this.customVertexBindGroupLayout) {
            this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
                getTerrainVertexBindGroupDescriptor(this, this.customVertexBindGroupLayout)
            );
            this.dirtyPipeline = true;
        }
    }
}

const getTerrainVertexBindGroupDescriptor = (mesh: Terrain, layout: GPUBindGroupLayout) => {
    const {redGPUContext} = mesh;
    const {resourceManager} = redGPUContext;

    return {
        label: `TERRAIN_VERTEX_GPUBindGroup`,
        layout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mesh.gpuRenderInfo.vertexUniformBuffer.gpuBuffer
                }
            },
            {
                binding: 1,
                resource: mesh.heightmapSampler?.gpuSampler || resourceManager.basicDisplacementSampler.gpuSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(mesh.heightmapAtlasTexture) || resourceManager.emptyBitmapTextureView
            },
            {
                binding: 3,
                resource: {
                    buffer: mesh.instanceBuffer
                }
            }
        ]
    };
};

defineNumber(Terrain, [
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0},
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1}
]);
defineVector2(Terrain, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]},
]);
defineTexture(Terrain, [
    {key: "heightmapAtlasTexture"}
]);
defineSampler(Terrain, [
    {key: "heightmapSampler"}
]);

Object.defineProperty(Terrain.prototype, 'isTerrain', {
    value: true,
    writable: false
});

Object.freeze(Terrain);
export default Terrain;