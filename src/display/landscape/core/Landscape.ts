import RedGPUContext from "../../../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import landscapeVertexSource from "../shader/landscapeVertex.wgsl";
import LANDSCAPE_BASE_GRID_SIZE, {validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "../spatial/LandscapeComponent";
import LandscapeInstanceBuffer from "../spatial/LandscapeInstanceBuffer";
import LandscapeMaterial from "../material/LandscapeMaterial";
import LandscapeOptions from "./LandscapeOptions";
import LandscapeSharedGeometry from "../spatial/LandscapeSharedGeometry";
import LandscapeSpatialGrid from "../spatial/LandscapeSpatialGrid";
import DirectTexture from "../../../resources/texture/DirectTexture";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "../spatial/LandscapeTileStreamer";
import LandscapeVNTGenerator from "../generator/LandscapeVNTGenerator";
import LandscapeVHTGenerator from "../generator/LandscapeVHTGenerator";
import LandscapeVBTGenerator from "../generator/LandscapeVBTGenerator";
import Object3DContainer from "../../mesh/core/Object3DContainer";
import LandscapeFoliageManager from "../foliage/LandscapeFoliageManager";
import {LandscapeGPUCuller} from "../spatial/LandscapeGPUCuller";
import computeViewFrustumPlanes from "../../../math/computeViewFrustumPlanes";
import LandscapeDebuggerManager from "../debugger";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";

export class Landscape extends Object3DContainer {
    #redGPUContext: RedGPUContext;
    #sharedGeometry: LandscapeSharedGeometry;
    #spatialGrid: LandscapeSpatialGrid;
    #instanceBuffer: LandscapeInstanceBuffer;
    #gpuCuller: LandscapeGPUCuller | null = null;
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #landscapeMaterial: LandscapeMaterial;
    #foliageManager: LandscapeFoliageManager;
    #debuggerManager: LandscapeDebuggerManager;

    #wireframe: boolean = false;
    #lodColoration: boolean = false;
    #lodFadeStartRatio: number = 0.7;
    #lodGeomorphStartRatio: number = 0.85;
    #heightScale: number = 500.0;
    #tileStreamer: LandscapeTileStreamer;
    #vhtAtlasTexture: DirectTexture | null = null;
    #vntAtlasTexture: DirectTexture | null = null;
    #vbtBaseColorAtlas: DirectTexture | null = null;
    #vbtNormalAtlas: DirectTexture | null = null;
    #vbtORMAtlas: DirectTexture | null = null;
    #vhtGenerator: LandscapeVHTGenerator;
    #vntGenerator: LandscapeVNTGenerator;
    #vbtGenerator: LandscapeVBTGenerator;
    #vhtSampler: GPUSampler | null = null;

    #worldSizeX: number;
    #worldSizeZ: number;
    #componentCountX: number;
    #componentCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #maxLODLevel: number;
    #componentSizeQuads: number;

    #worldSizeTuple: [number, number] = [0, 0];
    #componentCountTuple: [number, number] = [0, 0];
    #tileSizeTuple: [number, number] = [0, 0];

    #lodDistancesBuffer: Float32Array = new Float32Array(8);
    #frustumCullingActive: boolean = false;

    #vertexShaderModule: GPUShaderModule;
    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();

    constructor(redGPUContext: RedGPUContext, options: LandscapeOptions = {}) {
        super();
        this.#redGPUContext = redGPUContext;

        const parseValue = (val: number | [number, number] | undefined, defaultVal: number): [number, number] => {
            if (Array.isArray(val)) return [val[0], val[1]];
            if (typeof val === 'number') return [val, val];
            return [defaultVal, defaultVal];
        };

        let [worldSizeX, worldSizeZ] = parseValue(options.worldSize, 8000);
        let [rawComponentCountX, rawComponentCountZ] = parseValue(options.componentCount, 8);
        let componentCountX = this.#clampComponentCount(rawComponentCountX);
        let componentCountZ = this.#clampComponentCount(rawComponentCountZ);

        let [tileSizeX, tileSizeZ] = [worldSizeX / componentCountX, worldSizeZ / componentCountZ];

        if (options.tileSize !== undefined) {
            const [tsX, tsZ] = parseValue(options.tileSize, 1000);
            tileSizeX = tsX;
            tileSizeZ = tsZ;
            if (options.worldSize === undefined) {
                worldSizeX = tileSizeX * componentCountX;
                worldSizeZ = tileSizeZ * componentCountZ;
            }
        }

        const componentSizeQuads = options.componentSizeQuads ?? LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
        validateLandscapeBaseGridSize(componentSizeQuads);
        const maxLODLevel = Math.min(8, Math.max(1, options.maxLODLevel ?? 4));

        const landscapeMaterial = options.landscapeMaterial || new LandscapeMaterial(redGPUContext);
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, componentSizeQuads, maxLODLevel);

        this.#spatialGrid = new LandscapeSpatialGrid(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#landscapeMaterial = landscapeMaterial;
        this.#worldSizeX = worldSizeX;
        this.#worldSizeZ = worldSizeZ;
        this.#worldSizeTuple = [worldSizeX, worldSizeZ];
        this.#componentCountX = componentCountX;
        this.#componentCountZ = componentCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#maxLODLevel = maxLODLevel;
        this.#wireframe = options.wireframe ?? false;
        this.#lodColoration = options.lodColoration ?? false;
        this.#lodFadeStartRatio = options.lodFadeStartRatio ?? 0.7;
        this.#lodGeomorphStartRatio = options.lodGeomorphStartRatio ?? 0.85;
        this.#tileStreamer = new LandscapeTileStreamer(redGPUContext, this.#spatialGrid, options?.loadingRadius ?? 2500.0);
        if (options.tileUrlResolver) {
            this.#tileStreamer.tileUrlResolver = options.tileUrlResolver;
        }

        this.#heightScale = options.heightScale ?? 500.0;
        this.#updateTuples();

        const atlasWidth = componentCountX * 512;
        const atlasHeight = componentCountZ * 512;
        const rawAtlasTexture = redGPUContext.gpuDevice.createTexture({
            size: [atlasWidth, atlasHeight],
            format: 'r32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_VHT_Atlas_Texture'
        });
        const vhtAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VHT_Atlas_Texture', rawAtlasTexture);

        const rawVntTexture = redGPUContext.gpuDevice.createTexture({
            size: [atlasWidth, atlasHeight],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VNT_Atlas_Texture'
        });
        const vntAtlasTexture = new DirectTexture(redGPUContext, 'Landscape_VNT_Atlas_Texture', rawVntTexture);

        const rawVbtBaseColor = redGPUContext.gpuDevice.createTexture({
            size: [atlasWidth, atlasHeight],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_BaseColor_Atlas'
        });
        const vbtBaseColorAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_BaseColor_Atlas', rawVbtBaseColor);

        const rawVbtNormal = redGPUContext.gpuDevice.createTexture({
            size: [atlasWidth, atlasHeight],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_Normal_Atlas'
        });
        const vbtNormalAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_Normal_Atlas', rawVbtNormal);

        const rawVbtORM = redGPUContext.gpuDevice.createTexture({
            size: [atlasWidth, atlasHeight],
            mipLevelCount: 6,
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_VBT_ORM_Atlas'
        });
        const vbtORMAtlas = new DirectTexture(redGPUContext, 'Landscape_VBT_ORM_Atlas', rawVbtORM);

        const vhtSampler = redGPUContext.gpuDevice.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
            label: 'Landscape_VHT_Sampler'
        });

        this.#vhtAtlasTexture = vhtAtlasTexture;
        this.#vntAtlasTexture = vntAtlasTexture;
        this.#vbtBaseColorAtlas = vbtBaseColorAtlas;
        this.#vbtNormalAtlas = vbtNormalAtlas;
        this.#vbtORMAtlas = vbtORMAtlas;
        this.#vhtGenerator = new LandscapeVHTGenerator(redGPUContext);
        this.#vntGenerator = new LandscapeVNTGenerator(redGPUContext);
        this.#vbtGenerator = new LandscapeVBTGenerator(redGPUContext);
        this.#vhtSampler = vhtSampler;

        this.#tileStreamer.vhtAtlasTexture = vhtAtlasTexture;
        this.#tileStreamer.vntAtlasTexture = vntAtlasTexture;
        this.#tileStreamer.vbtBaseColorAtlas = vbtBaseColorAtlas;
        this.#tileStreamer.vbtNormalAtlas = vbtNormalAtlas;
        this.#tileStreamer.vbtORMAtlas = vbtORMAtlas;
        this.#tileStreamer.vhtGenerator = this.#vhtGenerator;
        this.#tileStreamer.vntGenerator = this.#vntGenerator;
        this.#tileStreamer.vbtGenerator = this.#vbtGenerator;
        this.#tileStreamer.material = landscapeMaterial;

        landscapeMaterial.onRebakeVBTRequested = () => {
            this.#tileStreamer.rebakeAllLoadedVBT();
        };

        this.#initSystems(redGPUContext, options, componentCountX, componentCountZ, maxLODLevel, vhtSampler, vhtAtlasTexture, vntAtlasTexture);
        this.#foliageManager = new LandscapeFoliageManager(this);
        this.#tileStreamer.onTileLoaded = (comp) => {
            this.#foliageManager?.handleTileLoaded(comp);
        };
        this.#debuggerManager = new LandscapeDebuggerManager(this, options?.debuggerOptions);
    }

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    get debuggerManager(): LandscapeDebuggerManager {
        return this.#debuggerManager;
    }

    update(camera: any, renderViewStateData?: any): void {
        if (!camera) return;

        if (this.landscapeMaterial) {
            this.landscapeMaterial.updateUniformsData();
        }

        const camX = camera.x ?? camera.position?.[0] ?? camera.camera?.x ?? 0;
        const camY = camera.y ?? camera.position?.[1] ?? camera.camera?.y ?? 0;
        const camZ = camera.z ?? camera.position?.[2] ?? camera.camera?.z ?? 0;

        const rawCamera = camera?.camera ?? camera;
        let frustumPlanes: number[][] | null = renderViewStateData?.frustumPlanes
            ?? renderViewStateData?.view?.frustumPlanes
            ?? camera?.frustumPlanes
            ?? rawCamera?.frustumPlanes
            ?? null;

        if (!frustumPlanes && rawCamera?.projectionMatrix && rawCamera?.viewMatrix) {
            frustumPlanes = computeViewFrustumPlanes(rawCamera.projectionMatrix, rawCamera.viewMatrix);
        }

        if (this.#foliageManager?.hasFoliageTypes) {
            this.#foliageManager.update(camera, renderViewStateData);
        }

        this.#tileStreamer.update(camX, camZ, camY);

        const totalComponents = this.#componentCountX * this.#componentCountZ;
        this.#frustumCullingActive = !!frustumPlanes;

        this.#instanceBuffer.resetIndirectDrawBuffer(this.#sharedGeometry, this.#maxLODLevel, this.#wireframe);

        const lodDistancesArray = this.#lodDistancesBuffer;
        lodDistancesArray.fill(1e15);
        const countDist = Math.min(8, this.#lodDistancesSq.length);
        for (let i = 0; i < countDist; i++) {
            const val = this.#lodDistancesSq[i];
            if (val && val > 0) {
                lodDistancesArray[i] = val;
            }
        }

        this.#gpuCuller?.updateUniforms(
            camX, camY, camZ,
            this.#maxLODLevel,
            this.#worldSizeX, this.#worldSizeZ,
            this.#tileSizeX, this.#tileSizeZ,
            this.#heightScale,
            totalComponents,
            frustumPlanes,
            lodDistancesArray
        );

        this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
            'Landscape_GPUCulling_ComputePass',
            this.#onPreProcessComputePass
        );

        this.#debuggerManager.update(camera, renderViewStateData);
    }

    get foliageManager(): LandscapeFoliageManager {
        return this.#foliageManager;
    }

    getHeightAt(x: number, z: number): number {
        return this.#tileStreamer.getHeightAt(x, z);
    }

    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const material = this.#landscapeMaterial;
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        if (material) {
            if (material.dirtyPipeline) {
                material._updateFragmentState();
                material.dirtyPipeline = false;
                this.#renderPipelineCache.clear();
                if (renderResults) {
                    renderResults.numDirtyPipelines++;
                }
            }
        }

        const instanceBuffer = this.#instanceBuffer;
        const sharedGeometry = this.#sharedGeometry;
        const combinedVB = sharedGeometry?.combinedVertexBuffer;
        const isWireframe = this.#wireframe;
        const combinedIB = isWireframe ? sharedGeometry?.combinedWireframeIndexBuffer : sharedGeometry?.combinedIndexBuffer;

        if (!instanceBuffer || !combinedVB || !combinedIB) return;

        const storageBG = instanceBuffer.instanceStorageBindGroup;
        const storageBGLayout = instanceBuffer.instanceStorageBindGroupLayout;
        if (!storageBG || !storageBGLayout) return;

        const pipeline = this.#getOrCreateRenderPipeline(combinedVB, storageBGLayout);
        if (!pipeline) return;

        renderPassEncoder.setPipeline(pipeline);

        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (systemBG) {
            renderPassEncoder.setBindGroup(0, systemBG);
        }

        renderPassEncoder.setBindGroup(1, storageBG);

        const matUniformBG = this.#landscapeMaterial?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(2, matUniformBG);
        }
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        const maxLODLevel = sharedGeometry.maxLODLevel;
        const indirectDrawBuffer = instanceBuffer.indirectDrawBuffer;

        if (indirectDrawBuffer) {
            for (let lod = 0; lod < maxLODLevel; lod++) {
                const offset = lod * 20;
                renderPassEncoder.drawIndexedIndirect(indirectDrawBuffer, offset);

                if (renderResults) {
                    renderResults.numDrawCalls++;
                }
            }
        }

        if (this.#foliageManager?.hasFoliageTypes) {
            this.#foliageManager.render(view, renderPassEncoder);
        }

    }

    get worldSize(): [number, number] {
        return this.#worldSizeTuple;
    }

    set worldSize(value: number | [number, number]) {
        let wx = this.#worldSizeX;
        let wz = this.#worldSizeZ;
        if (Array.isArray(value)) {
            wx = value[0];
            wz = value[1];
        } else if (typeof value === 'number') {
            wx = value;
            wz = value;
        }

        if (wx > 0 && wz > 0 && (this.#worldSizeX !== wx || this.#worldSizeZ !== wz)) {
            this.#worldSizeX = wx;
            this.#worldSizeZ = wz;
            this.#tileSizeX = wx / this.#componentCountX;
            this.#tileSizeZ = wz / this.#componentCountZ;
            this.#updateTuples();
            this.#updateLandscapeUniforms();
            this.#rebuildTiles();
        }
    }

    get componentCount(): [number, number] {
        return this.#componentCountTuple;
    }

    set componentCount(value: number | [number, number]) {
        let tcX = this.#componentCountX;
        let tcZ = this.#componentCountZ;
        if (Array.isArray(value)) {
            tcX = this.#clampComponentCount(value[0]);
            tcZ = this.#clampComponentCount(value[1]);
        } else if (typeof value === 'number') {
            const count = this.#clampComponentCount(value);
            tcX = count;
            tcZ = count;
        }

        if (this.#componentCountX !== tcX || this.#componentCountZ !== tcZ) {
            this.#componentCountX = tcX;
            this.#componentCountZ = tcZ;
            this.#tileSizeX = this.#worldSizeX / tcX;
            this.#tileSizeZ = this.#worldSizeZ / tcZ;
            this.#updateTuples();
            this.#rebuildTiles();
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
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                value,
                this.#maxLODLevel
            );
            this.#rebuildTiles();
        }
    }

    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    set maxLODLevel(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#maxLODLevel !== count) {
            this.#maxLODLevel = count;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                this.#componentSizeQuads,
                count
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    set heightScale(val: number) {
        if (this.#heightScale !== val) {
            this.#heightScale = val;
            this.#tileStreamer?.setTerrainConfig(val);
            this.#updateLandscapeUniforms();
            this.#tileStreamer?.rebakeAllLoadedVNT();
            this.#tileStreamer?.rebakeAllLoadedVBT();
        }
    }

    get landscapeMaterial(): LandscapeMaterial {
        return this.#landscapeMaterial;
    }

    get heightScale(): number {
        return this.#heightScale;
    }

    set lodColoration(value: boolean) {
        if (this.#lodColoration !== value) {
            this.#lodColoration = value;
            this.#updateLandscapeUniforms();
        }
    }

    /** @internal 내부 디버거 및 포리지 전용 텍스처 조회 */
    getInternalAtlasTexture(type: 'vht' | 'vnt' | 'vbtBaseColor' | 'vbtNormal' | 'vbtORM'): DirectTexture | null {
        switch (type) {
            case 'vht':
                return this.#vhtAtlasTexture;
            case 'vnt':
                return this.#vntAtlasTexture;
            case 'vbtBaseColor':
                return this.#vbtBaseColorAtlas;
            case 'vbtNormal':
                return this.#vbtNormalAtlas;
            case 'vbtORM':
                return this.#vbtORMAtlas;
            default:
                return null;
        }
    }

    set landscapeMaterial(val: LandscapeMaterial) {
        if (this.#landscapeMaterial !== val) {
            this.#landscapeMaterial = val;
            this.#renderPipelineCache.clear();
        }
    }

    get wireframe(): boolean {
        return this.#wireframe;
    }

    set wireframe(value: boolean) {
        if (this.#wireframe !== value) {
            this.#wireframe = value;
        }
    }

    get lodColoration(): boolean {
        return this.#lodColoration;
    }

    get lodFadeStartRatio(): number {
        return this.#lodFadeStartRatio;
    }

    set lodFadeStartRatio(value: number) {
        const clamped = Math.max(0.0, Math.min(0.99, value));
        if (this.#lodFadeStartRatio !== clamped) {
            this.#lodFadeStartRatio = clamped;
            this.#updateLandscapeUniforms();
        }
    }

    get lodGeomorphStartRatio(): number {
        return this.#lodGeomorphStartRatio;
    }

    set lodGeomorphStartRatio(value: number) {
        const clamped = Math.max(0.0, Math.min(0.99, value));
        if (this.#lodGeomorphStartRatio !== clamped) {
            this.#lodGeomorphStartRatio = clamped;
            this.#updateLandscapeUniforms();
        }
    }

    #updateLandscapeUniforms(): void {
        const vhtW = this.#vhtAtlasTexture?.gpuTexture?.width || (this.#componentCountX * 512);
        const vhtH = this.#vhtAtlasTexture?.gpuTexture?.height || (this.#componentCountZ * 512);
        this.#instanceBuffer?.updateUniforms(
            this.#heightScale,
            this.#worldSizeX,
            this.#worldSizeZ,
            this.#lodColoration,
            this.#componentCountX * this.#componentCountZ,
            this.#tileSizeX,
            this.#tileSizeZ,
            this.#componentSizeQuads,
            vhtW,
            vhtH,
            this.#lodFadeStartRatio,
            this.#lodGeomorphStartRatio,
            this.#lodColorsRGBA,
            this.#lodDistancesSq
        );
    }

    get landscapeComponents(): LandscapeComponent[] {
        return this.#spatialGrid.flatCells;
    }

    get tileSize(): [number, number] {
        return this.#tileSizeTuple;
    }

    #clampComponentCount(val: number): number {
        const maxTextureDim = this.#redGPUContext?.gpuDevice?.limits?.maxTextureDimension2D ?? 8192;
        const maxTilesForHardware = Math.floor(maxTextureDim / 512);
        const maxAllowed = Math.min(32, Math.max(1, maxTilesForHardware));
        return Math.min(maxAllowed, Math.max(1, Math.round(val)));
    }

    get loadedTileCount(): number {
        return this.#tileStreamer?.loadedTileCount ?? 0;
    }

    get pendingQueueSize(): number {
        return this.#tileStreamer?.pendingQueueSize ?? 0;
    }

    isTileLoaded(row: number, col: number): boolean {
        return this.#tileStreamer?.isTileLoaded(row, col) ?? false;
    }

    get loadingRadius(): number {
        return this.#tileStreamer.loadingRadius;
    }

    #updateTuples(): void {
        this.#worldSizeTuple[0] = this.#worldSizeX;
        this.#worldSizeTuple[1] = this.#worldSizeZ;
        this.#componentCountTuple[0] = this.#componentCountX;
        this.#componentCountTuple[1] = this.#componentCountZ;
        this.#tileSizeTuple[0] = this.#tileSizeX;
        this.#tileSizeTuple[1] = this.#tileSizeZ;
    }

    set loadingRadius(value: number) {
        this.#tileStreamer.loadingRadius = value;
    }

    get maxLoadsPerFrame(): number {
        return this.#tileStreamer.maxLoadsPerFrame;
    }

    set maxLoadsPerFrame(value: number) {
        this.#tileStreamer.maxLoadsPerFrame = value;
    }

    get frustumCullingActive(): boolean {
        return this.#frustumCullingActive;
    }

    get lodColors(): [number, number, number, number][] {
        return this.#lodColorsRGBA;
    }

    get lodDistancesSq(): number[] {
        return this.#lodDistancesSq;
    }

    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const totalComponents = this.#componentCountX * this.#componentCountZ;
        this.#gpuCuller?.dispatchPass(computePass, totalComponents);
    };

    #initSystems(
        redGPUContext: RedGPUContext,
        options: LandscapeOptions,
        componentCountX: number,
        componentCountZ: number,
        maxLODLevel: number,
        vhtSampler: GPUSampler,
        vhtAtlasTexture: DirectTexture,
        vntAtlasTexture: DirectTexture
    ) {
        this.#tileStreamer.setTerrainConfig(this.#heightScale);

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;

        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, componentCountX * componentCountZ, maxLODLevel);
        this.#instanceBuffer.updateBindGroup(
            vhtSampler,
            vhtAtlasTexture.gpuTextureView,
            vntAtlasTexture.gpuTextureView,
            this.#vbtBaseColorAtlas?.gpuTextureView,
            this.#vbtNormalAtlas?.gpuTextureView,
            this.#vbtORMAtlas?.gpuTextureView
        );

        this.#rebuildLODStructures(options.lodColors, options.lodMultipliers, options.lodDistances);
        this.#rebuildTiles();
    }

    #updateLODDistances(): void {
        this.#lodDistancesSq.length = 0;
        const tileSizeMax = Math.max(this.#tileSizeX, this.#tileSizeZ);
        const count = this.#lodMultipliers.length;

        for (let i = 0; i < count; i++) {
            const dist = tileSizeMax * this.#lodMultipliers[i];
            this.#lodDistancesSq.push(dist * dist);
        }
    }

    #rebuildLODStructures(userColors?: string[], userMultipliers?: number[], userDistances?: number[]): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        for (let i = 0; i < this.#maxLODLevel; i++) {
            this.#lodColorsRGBA.push(LANDSCAPE_DEFAULT_LOD_COLORS[i % LANDSCAPE_DEFAULT_LOD_COLORS.length] as [number, number, number, number]);
        }

        const defaultMultipliers = [1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0];
        const multipliers = userMultipliers ?? defaultMultipliers;

        for (let i = 0; i < this.#maxLODLevel - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.0 * Math.pow(1.8, i)));
        }

        if (userDistances && userDistances.length > 0) {
            this.#lodDistancesSq = userDistances.map(d => d * d);
        } else {
            this.#updateLODDistances();
        }

        this.#updateLandscapeUniforms();
    }

    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const material = this.#landscapeMaterial;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        const antialiasingManager = this.#redGPUContext.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const topology = this.#wireframe ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        const variantKey = (material.gpuRenderInfo.fragmentShaderModule as any)?.label || 'default';
        const key = `${topology}_${material.uuid}_${variantKey}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            return this.#renderPipelineCache.get(key);
        }

        try {
            const resourceManager = this.#redGPUContext.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragUniformBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: `LandscapePipelineLayout_${key}`,
                bindGroupLayouts: [systemBGLayout, storageBGLayout, fragUniformBGLayout]
            });

            const vertexBuffers: GPUVertexBufferLayout[] = [{
                arrayStride: geom?.interleavedStruct?.arrayStride ?? 20,
                attributes: geom?.interleavedStruct?.attributes ?? [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},
                    {shaderLocation: 1, offset: 12, format: 'float32x2'}
                ]
            }];

            const pipeline = gpuDevice.createRenderPipeline({
                label: `LandscapeRenderPipeline_${key}`,
                layout: pipelineLayout,
                vertex: {
                    module: this.#vertexShaderModule,
                    entryPoint: 'main',
                    buffers: vertexBuffers,
                },
                fragment: material.gpuRenderInfo.fragmentState,
                primitive: {
                    topology: topology,
                    cullMode: 'none'
                },
                depthStencil: {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                },
                multisample: {count: sampleCount}
            });

            this.#renderPipelineCache.set(key, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }

    #rebuildTiles(): void {
        this.#spatialGrid = new LandscapeSpatialGrid(this.#componentCountX, this.#componentCountZ, this.#tileSizeX, this.#tileSizeZ);
        if (this.#tileStreamer) {
            this.#tileStreamer.spatialGrid = this.#spatialGrid;
        }
        this.#sharedGeometry.updateTileSize(this.#tileSizeX, this.#tileSizeZ);
        this.#updateLODDistances();
        this.#renderPipelineCache.clear();

        const halfSizeX = this.#worldSizeX / 2;
        const halfSizeZ = this.#worldSizeZ / 2;
        const componentCountX = this.#componentCountX;
        const componentCountZ = this.#componentCountZ;
        const tileSizeX = this.#tileSizeX;
        const tileSizeZ = this.#tileSizeZ;
        const targetCount = componentCountX * componentCountZ;

        const targetAtlasW = componentCountX * 512;
        const targetAtlasH = componentCountZ * 512;
        let needRebuildBindGroup = false;

        if (!this.#vhtAtlasTexture || this.#vhtAtlasTexture.gpuTexture.width !== targetAtlasW || this.#vhtAtlasTexture.gpuTexture.height !== targetAtlasH) {
            if (this.#vhtAtlasTexture) {
                this.#vhtAtlasTexture.destroy();
            }
            if (this.#vntAtlasTexture) {
                this.#vntAtlasTexture.destroy();
            }
            const rawGpuTexture = this.#redGPUContext.gpuDevice.createTexture({
                size: [targetAtlasW, targetAtlasH],
                format: 'r32float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                label: 'Landscape_VHT_Atlas_Texture'
            });
            this.#vhtAtlasTexture = new DirectTexture(this.#redGPUContext, 'Landscape_VHT_Atlas_Texture', rawGpuTexture);

            const rawVntTexture = this.#redGPUContext.gpuDevice.createTexture({
                size: [targetAtlasW, targetAtlasH],
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'Landscape_VNT_Atlas_Texture'
            });
            this.#vntAtlasTexture = new DirectTexture(this.#redGPUContext, 'Landscape_VNT_Atlas_Texture', rawVntTexture);

            if (this.#vbtBaseColorAtlas) {
                this.#vbtBaseColorAtlas.destroy();
            }
            if (this.#vbtNormalAtlas) {
                this.#vbtNormalAtlas.destroy();
            }
            if (this.#vbtORMAtlas) {
                this.#vbtORMAtlas.destroy();
            }

            const rawVbtBaseColor = this.#redGPUContext.gpuDevice.createTexture({
                size: [targetAtlasW, targetAtlasH],
                mipLevelCount: 6,
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'Landscape_VBT_BaseColor_Atlas'
            });
            this.#vbtBaseColorAtlas = new DirectTexture(this.#redGPUContext, 'Landscape_VBT_BaseColor_Atlas', rawVbtBaseColor);

            const rawVbtNormal = this.#redGPUContext.gpuDevice.createTexture({
                size: [targetAtlasW, targetAtlasH],
                mipLevelCount: 6,
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'Landscape_VBT_Normal_Atlas'
            });
            this.#vbtNormalAtlas = new DirectTexture(this.#redGPUContext, 'Landscape_VBT_Normal_Atlas', rawVbtNormal);

            const rawVbtORM = this.#redGPUContext.gpuDevice.createTexture({
                size: [targetAtlasW, targetAtlasH],
                mipLevelCount: 6,
                format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST,
                label: 'Landscape_VBT_ORM_Atlas'
            });
            this.#vbtORMAtlas = new DirectTexture(this.#redGPUContext, 'Landscape_VBT_ORM_Atlas', rawVbtORM);

            if (this.#tileStreamer) {
                this.#tileStreamer.vhtAtlasTexture = this.#vhtAtlasTexture;
                this.#tileStreamer.vntAtlasTexture = this.#vntAtlasTexture;
                this.#tileStreamer.vbtBaseColorAtlas = this.#vbtBaseColorAtlas;
                this.#tileStreamer.vbtNormalAtlas = this.#vbtNormalAtlas;
                this.#tileStreamer.vbtORMAtlas = this.#vbtORMAtlas;
                this.#tileStreamer.vhtGenerator = this.#vhtGenerator;
                this.#tileStreamer.vntGenerator = this.#vntGenerator;
                this.#tileStreamer.vbtGenerator = this.#vbtGenerator;
                this.#tileStreamer.material = this.#landscapeMaterial;
                this.#tileStreamer.setTerrainConfig(this.#heightScale);
                this.#tileStreamer.resetTileState();
            }
            needRebuildBindGroup = true;
        }

        this.#sharedGeometry?.updateTileSize(tileSizeX, tileSizeZ);

        if (!this.#instanceBuffer || this.#instanceBuffer.maxComponentCount !== targetCount || this.#instanceBuffer.maxLODLevel !== this.#maxLODLevel) {
            if (this.#instanceBuffer) {
                this.#instanceBuffer.destroy();
            }
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.#redGPUContext, targetCount, this.#maxLODLevel);
            needRebuildBindGroup = true;
        }

        if (needRebuildBindGroup && this.#vhtSampler && this.#vhtAtlasTexture && this.#vntAtlasTexture) {
            this.#instanceBuffer.updateBindGroup(
                this.#vhtSampler,
                this.#vhtAtlasTexture.gpuTextureView,
                this.#vntAtlasTexture.gpuTextureView,
                this.#vbtBaseColorAtlas?.gpuTextureView,
                this.#vbtNormalAtlas?.gpuTextureView,
                this.#vbtORMAtlas?.gpuTextureView
            );
        }

        this.#spatialGrid.setConfig(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#gpuCuller = new LandscapeGPUCuller(this.#redGPUContext);

        let index = 0;
        for (let row = 0; row < componentCountZ; row++) {
            for (let col = 0; col < componentCountX; col++) {
                const posX = col * tileSizeX - halfSizeX + tileSizeX / 2;
                const posZ = row * tileSizeZ - halfSizeZ + tileSizeZ / 2;

                const comp = new LandscapeComponent(
                    posX,
                    posZ,
                    col,
                    row
                );
                this.#spatialGrid.registerTile(row, col, comp);

                this.#instanceBuffer.setStaticTileData(
                    index,
                    posX, posZ, posX, posZ,
                    0, 0, 0, 0.0
                );
                index++;
            }
        }

        this.#instanceBuffer.uploadStaticTilesToGPU();
        this.#updateLandscapeUniforms();

        if (this.#instanceBuffer.allInputTilesBuffer && this.#instanceBuffer.visibleTileIndicesBuffer && this.#instanceBuffer.indirectDrawBuffer) {
            this.#gpuCuller.updateBindGroup(
                this.#instanceBuffer.allInputTilesBuffer,
                this.#instanceBuffer.visibleTileIndicesBuffer,
                this.#instanceBuffer.indirectDrawBuffer
            );
        }

        this.#landscapeMaterial?.requestVBTRebake(true);
    }

    override destroy(): void {
        super.destroy();
        this.#debuggerManager?.destroy();
        if (this.#instanceBuffer) {
            this.#instanceBuffer.destroy();
        }
        if (this.#vhtAtlasTexture) {
            this.#vhtAtlasTexture.destroy();
            this.#vhtAtlasTexture = null;
        }
        if (this.#vntAtlasTexture) {
            this.#vntAtlasTexture.destroy();
            this.#vntAtlasTexture = null;
        }
        if (this.#vbtBaseColorAtlas) {
            this.#vbtBaseColorAtlas.destroy();
            this.#vbtBaseColorAtlas = null;
        }
        if (this.#vbtNormalAtlas) {
            this.#vbtNormalAtlas.destroy();
            this.#vbtNormalAtlas = null;
        }
        if (this.#vbtORMAtlas) {
            this.#vbtORMAtlas.destroy();
            this.#vbtORMAtlas = null;
        }
    }
}

export default Landscape;
