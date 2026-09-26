import RedGPUContext from "../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import landscapeVertexSource from "./core/shader/landscapeVertex.wgsl";
import LANDSCAPE_BASE_GRID_SIZE, {validateLandscapeBaseGridSize} from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./core/spatial/LandscapeComponent";
import LandscapeInstanceBuffer from "./core/spatial/LandscapeInstanceBuffer";
import LandscapeMaterial from "./core/material/LandscapeMaterial";
import LandscapeLayer, {LandscapeLayerOptions} from "./core/material/LandscapeLayer";
import LandscapeSharedGeometry from "./core/spatial/LandscapeSharedGeometry";
import ColorRGBA from "../color/ColorRGBA";
import LandscapeSpatialGrid from "./core/spatial/LandscapeSpatialGrid";
import DirectTexture from "../resources/texture/DirectTexture";
import parse16BitPngBuffer from "../utils/texture/textureParser/parse16BitPngBuffer/parse16BitPngBuffer";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "./core/spatial/LandscapeTileStreamer";
import LandscapeVNTGenerator from "./core/generator/LandscapeVNTGenerator";
import LandscapeVHTGenerator from "./core/generator/LandscapeVHTGenerator";
import LandscapeVBTGenerator from "./core/generator/LandscapeVBTGenerator";
import Object3DContainer from "../display/mesh/core/Object3DContainer";
import LandscapeFoliageManager from "./foliage/LandscapeFoliageManager";
import LandscapeGrassManager from "./grass/LandscapeGrassManager";
import {LandscapeGPUCuller} from "./core/spatial/LandscapeGPUCuller";
import computeViewFrustumPlanes from "../math/computeViewFrustumPlanes";
import LandscapeDebuggerManager from "./debugger";
import LANDSCAPE_DEFAULT_LOD_COLORS from "./LANDSCAPE_DEFAULT_LOD_COLORS";
import {LANDSCAPE_DEBUG_MODE} from "./LANDSCAPE_DEBUG_MODE";
import {mat4} from 'gl-matrix';

const DEFAULT_LOD_MULTIPLIERS: readonly number[] = Object.freeze([1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0]);
const tempPVMatrix: Float32Array = new Float32Array(16);
const COMPUTE_PASS_DESCRIPTOR: GPUComputePassDescriptor = Object.freeze({
    label: 'Landscape_GPUCulling_ComputePass'
});

/**
 * [KO] 대규모 오픈월드 지형(Landscape) 렌더링, 동적 타일 스트리밍, 복합 생태계 서브시스템을 총괄하는 핵심 클래스입니다.
 * [EN] Core orchestration class for large-scale open-world landscape terrain rendering, dynamic tile streaming, and ecosystem subsystem integration.
 *
 * [KO] 가상 텍스처 아틀라스 파이프라인을 기반으로 고정밀 32비트 높이맵(VHT), 지형 법선(VNT), 다중 스플랫 레이어 머티리얼(VBT)을 효율적으로 결합하고 관리합니다.
 * [EN] Manages a virtual texture atlas pipeline that efficiently combines high-precision 32-bit heightmaps (VHT), terrain normals (VNT), and multi-layer splat materials (VBT).
 *
 * [KO] 카메라 거리 및 화면 투영 크기에 기반한 쿼드트리 연속 LOD(Continuous LOD)와 메시 전환 시 팝핑 현상을 제거하는 지오모핑(Geomorphing) 및 디더 페이드를 지원합니다.
 * [EN] Features quadtree-based hierarchical continuous LOD driven by camera distance or screen size, paired with vertex geomorphing and dither cross-fading to eliminate popping artifacts during LOD transitions.
 *
 * [KO] GPU 컴퓨트 셰이더 기반의 프러스텀 및 HZB(Hierarchical Z-Buffer) 오클루전 컬링과 인다이렉트 드로우(Indirect Draw), 실시간 높이맵 레이마칭 그림자를 통해 고성능 렌더링을 구현합니다.
 * [EN] Delivers high-performance rendering powered by GPU compute-based view frustum and HZB (Hierarchical Z-Buffer) occlusion culling, indirect draw calls, and real-time heightmap raymarching self-shadows.
 *
 * [KO] 절차적 잔디(`grassManager`), 대규모 식생 및 3D 임포스터(`foliageManager`), 실시간 진단 도구(`debuggerManager`)와 유기적으로 연동되어 풍부한 오픈월드 환경을 구축합니다.
 * [EN] Seamlessly integrates with procedural grass (`grassManager`), large-scale foliage with 3D impostors (`foliageManager`), and real-time diagnostic tools (`debuggerManager`) to build rich, cohesive open-world environments.
 *
 * <iframe src="/RedGPU/examples/3d/landscape/openWorldIntegration/"></iframe>
 *
 * ### Example
 * ```typescript
 * const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
 *
 * // 지형 레이어(스플랫 텍스처) 추가 / Add terrain splat layer
 * landscape.addLayer({
 *     diffuseTexture: grassTexture,
 *     normalTexture: grassNormalTexture,
 *     uvScale: [50, 50]
 * });
 *
 * // 씬에 지형 추가 / Add landscape to scene
 * scene.addLandscape(landscape);
 * ```
 *
 * @see
 * [KO] 아래는 Landscape의 구조와 동작을 이해하는 데 도움이 되는 공식 예제 목록입니다.
 * [EN] Below is a list of official examples to help understand the structure and operation of Landscape.
 * @see [Open World Integration](/RedGPU/examples/3d/landscape/openWorldIntegration/)
 * @see [Tile Streaming & Continuous LOD](/RedGPU/examples/3d/landscape/tileStreaming/)
 * @see [Multi-Layer Splatting](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 * @see [Procedural Grass Field](/RedGPU/examples/3d/landscape/proceduralGrass/)
 * @see [Foliage & Impostors](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @see [Landscape & Water System](/RedGPU/examples/3d/landscape/landscapeAndWater/)
 *
 */
export class Landscape extends Object3DContainer {
    #redGPUContext: RedGPUContext;
    #sharedGeometry: LandscapeSharedGeometry;
    #spatialGrid: LandscapeSpatialGrid;
    #instanceBuffer: LandscapeInstanceBuffer;
    #gpuCuller: LandscapeGPUCuller | null = null;
    #lastHZBView: GPUTextureView | null = null;
    #lastHZBSampler: GPUSampler | null = null;
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #material: LandscapeMaterial;
    #debugMode: number = LANDSCAPE_DEBUG_MODE.NONE;
    #worldSizeX: number = 2048.0;
    #worldSizeZ: number = 2048.0;
    #componentCountX: number = 4;
    #componentCountZ: number = 4;
    #tileSizeX: number = 512.0;
    #tileSizeZ: number = 512.0;
    #componentSizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
    #receiveShadow: boolean = true;
    #castHeightmapShadow: boolean = true;
    #heightmapShadowSteps: number = 16;
    #heightmapShadowDistance: number = 3000.0;
    #heightmapShadowSoftness: number = 8.0;
    #lodColoration: boolean = false;
    #lodMetric: 'distance' | 'screenSize' = 'screenSize';
    #lod0SizeQuads: number = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;
    #foliageManager: LandscapeFoliageManager;
    #grassManager: LandscapeGrassManager;
    #debuggerManager: LandscapeDebuggerManager;

    #wireframe: boolean = false;
    #lastTanHalfFOV: number = 1.0;
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
    #globalHeightmapUrl: string = '';
    #globalHeightTexture: GPUTexture | null = null;

    #maxLODLevel: number;

    #worldSizeTuple: [number, number] = [0, 0];
    #componentCountTuple: [number, number] = [0, 0];
    #tileSizeTuple: [number, number] = [0, 0];

    #lodDistancesBuffer: Float32Array = new Float32Array(8);

    #vertexShaderModule: GPUShaderModule;
    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();
    #cachedRenderPipeline: GPURenderPipeline | null = null;
    #lastRenderTopology: string = '';
    #lastRenderMaterialUUID: string = '';
    #lastRenderVariantModule: any = null;
    #lastRenderMsaaID: string = '';

    /**
     * [KO] Landscape 인스턴스를 생성하고 가상 텍스처 아틀라스 및 지형 파이프라인을 초기화합니다.
     * [EN] Creates a Landscape instance and initializes virtual texture atlases and terrain pipelines.
     *
     * ### Example
     * ```typescript
     * const landscape = new RedGPU.Landscape.Landscape(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super();
        this.#redGPUContext = redGPUContext;

        const worldSizeX = 8000;
        const worldSizeZ = 8000;
        const componentCountX = 16;
        const componentCountZ = 16;
        const tileSizeX = worldSizeX / componentCountX;
        const tileSizeZ = worldSizeZ / componentCountZ;
        const componentSizeQuads = LANDSCAPE_BASE_GRID_SIZE.QUAD_64;
        const lod0SizeQuads = LANDSCAPE_BASE_GRID_SIZE.QUAD_256;
        const maxLODLevel = 5;

        const material = new LandscapeMaterial(redGPUContext);
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, componentSizeQuads, maxLODLevel, lod0SizeQuads);

        this.#spatialGrid = new LandscapeSpatialGrid(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#material = material;
        this.#worldSizeX = worldSizeX;
        this.#worldSizeZ = worldSizeZ;
        this.#worldSizeTuple = [worldSizeX, worldSizeZ];
        this.#componentCountX = componentCountX;
        this.#componentCountZ = componentCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#lod0SizeQuads = lod0SizeQuads;
        this.#maxLODLevel = maxLODLevel;
        this.#wireframe = false;
        this.#lodColoration = false;
        this.#lodMetric = 'screenSize';
        this.#lodFadeStartRatio = 0.7;
        this.#lodGeomorphStartRatio = 0.85;
        this.#tileStreamer = new LandscapeTileStreamer(redGPUContext, this.#spatialGrid, 2500.0);
        this.#tileStreamer.lod0SizeQuads = lod0SizeQuads;
        this.#heightScale = 500.0;
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

        this.#vhtAtlasTexture = vhtAtlasTexture;
        this.#vntAtlasTexture = vntAtlasTexture;
        this.#vbtBaseColorAtlas = vbtBaseColorAtlas;
        this.#vbtNormalAtlas = vbtNormalAtlas;
        this.#vbtORMAtlas = vbtORMAtlas;
        this.#vhtGenerator = new LandscapeVHTGenerator(redGPUContext);
        this.#vntGenerator = new LandscapeVNTGenerator(redGPUContext);
        this.#vbtGenerator = new LandscapeVBTGenerator(redGPUContext);

        this.#tileStreamer.setAtlasTextures(
            vhtAtlasTexture,
            vntAtlasTexture,
            vbtBaseColorAtlas,
            vbtNormalAtlas,
            vbtORMAtlas
        );
        this.#tileStreamer.setGenerators(this.#vhtGenerator, this.#vntGenerator, this.#vbtGenerator);
        this.#tileStreamer.setMaterial(material);

        material.setOnRebakeVBTRequested(() => {
            this.#tileStreamer.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
        });

        this.#initSystems(redGPUContext, componentCountX, componentCountZ, maxLODLevel, vhtAtlasTexture, vntAtlasTexture);
        this.#foliageManager = new LandscapeFoliageManager(this, () => {
            this.#updateLandscapeUniforms();
        });
        this.#grassManager = new LandscapeGrassManager(this);
        this.#tileStreamer.setOnTileLoaded((comp) => {
            this.#foliageManager?.handleTileLoaded(comp);
            this.#grassManager?.handleTileLoaded(comp);
        });
        this.#debuggerManager = new LandscapeDebuggerManager(this);
        this.#updateLandscapeUniforms();
    }

    /**
     * [KO] 지형이 속한 RedGPUContext 인스턴스를 반환합니다.
     * [EN] Returns the RedGPUContext instance this landscape belongs to.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] 지형의 시각화 디버깅(타일 바운드, 노멀, LOD 와이어프레임 등)을 총괄하는 디버거 매니저를 반환합니다.
     * [EN] Returns the debugger manager that coordinates visual debugging (tile bounds, normals, LOD wireframes, etc.).
     */
    get debuggerManager(): LandscapeDebuggerManager {
        return this.#debuggerManager;
    }

    /**
     * [KO] 현재 적용된 LOD 계산 방식(`'distance'` 또는 `'screenSize'`)을 반환합니다.
     * [EN] Returns the current LOD calculation metric (`'distance'` or `'screenSize'`).
     */
    get lodMetric(): 'distance' | 'screenSize' {
        return this.#lodMetric;
    }

    /**
     * @example
     * ```ts
     * // 화면 투영 크기 기반 LOD 선택 모드로 전환
     * landscape.lodMetric = 'screenSize';
     * ```
     *
     * [KO]
     * LOD 계산 메트릭 방식을 설정합니다.
     * - `'distance'`: 카메라와 타일 간의 유클리드 거리를 기준으로 LOD를 결정합니다.
     * - `'screenSize'`: 카메라 FOV 및 화면 투영 크기(픽셀 오차)를 기준으로 LOD를 동적으로 결정합니다.
     *
     * [EN]
     * Sets the LOD metric calculation method.
     * - `'distance'`: Determines LOD based on Euclidean distance between the camera and tile.
     * - `'screenSize'`: Dynamically determines LOD based on camera FOV and screen-projected size (pixel error).
     *
     * @defaultValue 'distance'
     */
    set lodMetric(value: 'distance' | 'screenSize') {
        if (this.#lodMetric !== value) {
            this.#lodMetric = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * [KO] 지형 상에 배치되는 나무, 바위 등의 3D 식생 및 임포스터 인스턴싱 매니저를 반환합니다.
     * [EN] Returns the foliage manager for 3D vegetation, rocks, and impostor instancing on the terrain.
     */
    get foliageManager(): LandscapeFoliageManager {
        return this.#foliageManager;
    }

    /**
     * [KO] 절차적 잔디 필드 및 Multi-Draw Indirect 렌더링 매니저를 반환합니다.
     * [EN] Returns the procedural grass field and Multi-Draw Indirect rendering manager.
     */
    get grassManager(): LandscapeGrassManager {
        return this.#grassManager;
    }

    /**
     * [KO] 지형의 기본 베이스 틴트 색상(`ColorRGBA`)을 반환합니다.
     * [EN] Returns the base tint color (`ColorRGBA`) of the landscape.
     */
    get baseColor(): ColorRGBA {
        return this.#material.baseColor;
    }

    /**
     * [KO] 지형에 등록된 텍스처 블렌딩 레이어 목록을 읽기 전용 배열로 반환합니다.
     * [EN] Returns a read-only array of texture blending layers registered on the landscape.
     */
    get layers(): readonly LandscapeLayer[] {
        return this.#material.layers;
    }

    /**
     * [KO] 지형의 월드 크기 `[sizeX, sizeZ]`를 튜플로 반환합니다.
     * [EN] Returns the world dimensions `[sizeX, sizeZ]` of the landscape as a tuple.
     */
    get worldSize(): readonly [number, number] {
        return this.#worldSizeTuple;
    }

    /**
     * [KO] 지형의 월드 크기를 설정합니다. 단일 숫자 전달 시 가로/세로 동일 크기로 지정됩니다.
     * [EN] Sets the world size of the landscape. Providing a single number applies to both dimensions.
     *
     * @param value -
     * [KO] 월드 크기 (숫자 또는 `[sizeX, sizeZ]` 배열)
     * [EN] World size (number or `[sizeX, sizeZ]` array)
     */
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

    /**
     * [KO] 지형을 구성하는 X축 및 Z축 컴포넌트(타일) 분할 개수 `[countX, countZ]`를 반환합니다.
     * [EN] Returns the number of component (tile) subdivisions along X and Z axes as `[countX, countZ]`.
     */
    get componentCount(): readonly [number, number] {
        return this.#componentCountTuple;
    }

    /**
     * [KO] 지형 컴포넌트 타일 분할 개수를 설정합니다. (1~32 범위로 클램핑)
     * [EN] Sets the number of component tile subdivisions (clamped between 1 and 32).
     *
     * @param value -
     * [KO] 컴포넌트 개수 (숫자 또는 `[countX, countZ]` 배열)
     * [EN] Component count (number or `[countX, countZ]` array)
     */
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

    /**
     * [KO] 각 컴포넌트 타일 1개의 월드 크기 `[sizeX, sizeZ]`를 반환합니다.
     * [EN] Returns the world dimensions `[sizeX, sizeZ]` of a single component tile.
     */
    get tileSize(): readonly [number, number] {
        return this.#tileSizeTuple;
    }

    /**
     * [KO] 각 컴포넌트 메시 타일의 기본 쿼드 그리드 해상도를 반환합니다.
     * [EN] Returns the base quad grid resolution for each component mesh tile.
     */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    /**
     * [KO] 각 컴포넌트 메시 타일의 기본 쿼드 해상도를 설정합니다. (`LANDSCAPE_BASE_GRID_SIZE` 값 사용)
     * [EN] Sets the base quad resolution for component mesh tiles (use `LANDSCAPE_BASE_GRID_SIZE` values).
     *
     * @param value -
     * [KO] 그리드 크기 (`16`, `32`, `64`, `128`, `256`, `512`)
     * [EN] Grid size (`16`, `32`, `64`, `128`, `256`, `512`)
     */
    set componentSizeQuads(value: number) {
        validateLandscapeBaseGridSize(value);
        if (value > 0 && this.#componentSizeQuads !== value) {
            this.#componentSizeQuads = value;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                value,
                this.#maxLODLevel,
                this.#lod0SizeQuads
            );
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 최고 해상도(LOD 0) 타일의 쿼드 해상도를 반환합니다.
     * [EN] Returns the quad resolution for highest detail (LOD 0) tiles.
     */
    get lod0SizeQuads(): number {
        return this.#lod0SizeQuads;
    }

    /**
     * [KO] 최고 해상도(LOD 0) 타일의 쿼드 해상도를 설정합니다.
     * [EN] Sets the quad resolution for highest detail (LOD 0) tiles.
     *
     * @param value -
     * [KO] LOD 0 쿼드 해상도
     * [EN] LOD 0 quad resolution
     */
    set lod0SizeQuads(value: number) {
        const clamped = Math.max(this.#componentSizeQuads, Math.round(value));
        if (this.#lod0SizeQuads !== clamped) {
            this.#lod0SizeQuads = clamped;
            this.#tileStreamer.lod0SizeQuads = clamped;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                this.#componentSizeQuads,
                this.#maxLODLevel,
                clamped
            );
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 지형의 최대 LOD 단계 수(1~8)를 반환합니다.
     * [EN] Returns the maximum number of LOD levels (1 to 8) for the landscape.
     */
    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    /**
     * [KO] 지형의 최대 LOD 단계 수를 설정합니다.
     * [EN] Sets the maximum number of LOD levels for the landscape.
     *
     * @param value -
     * [KO] 최대 LOD 단계 수 (1 ~ 8)
     * [EN] Maximum LOD levels (1 to 8)
     */
    set maxLODLevel(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#maxLODLevel !== count) {
            this.#maxLODLevel = count;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                this.#componentSizeQuads,
                count,
                this.#lod0SizeQuads
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 지형의 최대 고도 스케일(높이 비율)을 반환합니다.
     * [EN] Returns the maximum elevation height scale of the landscape.
     */
    get heightScale(): number {
        return this.#heightScale;
    }

    /**
     * [KO] 지형의 고도 스케일을 설정하고, 가상 노멀 및 텍스처 아틀라스를 재베이킹합니다.
     * [EN] Sets the elevation height scale of the landscape and triggers atlas re-baking.
     *
     * @param val -
     * [KO] 지형 고도 스케일
     * [EN] Terrain elevation height scale
     */
    set heightScale(val: number) {
        if (this.#heightScale !== val) {
            this.#heightScale = val;
            this.#tileStreamer?.setTerrainConfig(val);
            this.#updateLandscapeUniforms();
            this.#tileStreamer?.rebakeAllLoadedVNT();
            this.#tileStreamer?.rebakeAllLoadedVBT();
            this.#grassManager?.rebakeAll();
            this.#foliageManager?.rebakeAll();
        }
    }

    /**
     * [KO] 지형 렌더링에 사용되는 `LandscapeMaterial` 재질 인스턴스를 반환합니다.
     * [EN] Returns the `LandscapeMaterial` instance used for terrain rendering.
     */
    get material(): LandscapeMaterial {
        return this.#material;
    }

    /**
     * [KO] 지형 렌더링 재질을 교체합니다.
     * [EN] Replaces the terrain rendering material.
     *
     * @param val -
     * [KO] 새 LandscapeMaterial 인스턴스
     * [EN] New LandscapeMaterial instance
     */
    set material(val: LandscapeMaterial) {
        if (this.#material !== val) {
            this.#material = val;
            this.#tileStreamer?.setMaterial(val);
            if (val) {
                val.setOnRebakeVBTRequested(() => {
                    this.#tileStreamer?.rebakeAllLoadedVBT();
                    this.#grassManager?.rebakeAll();
                });
            }
            this.#clearPipelineCaches();
        }
    }

    /**
     * [KO] 카메라 근접 텍스처 디테일이 최대로 유지되는 시작 거리(월드 단위)를 반환합니다.
     * [EN] Returns the near-distance threshold (world units) where close-up texture detail remains fully visible.
     */
    get nearDetailDistance(): number {
        return this.#material.nearDetailDistance;
    }

    /**
     * [KO] 카메라 근접 텍스처 디테일 시작 거리를 설정합니다.
     * [EN] Sets the near-distance threshold for close-up texture detail.
     *
     * @param val -
     * [KO] 근접 디테일 유지 거리
     * [EN] Near detail distance
     */
    set nearDetailDistance(val: number) {
        this.#material.nearDetailDistance = val;
    }

    /**
     * [KO] 근접 디테일에서 원거리 텍스처로 페이드 전환되는 구간 길이를 반환합니다.
     * [EN] Returns the fade transition range from near detail to distant textures.
     */
    get nearDetailFade(): number {
        return this.#material.nearDetailFade;
    }

    /**
     * [KO] 근접 디테일 페이드 전환 구간 길이를 설정합니다.
     * [EN] Sets the fade transition range from near detail to distant textures.
     *
     * @param val -
     * [KO] 페이드 전환 거리
     * [EN] Near detail fade range
     */
    set nearDetailFade(val: number) {
        this.#material.nearDetailFade = val;
    }

    /**
     * [KO] 비동기로 로드할 전체 지형 16비트 높이맵 이미지의 URL을 반환합니다.
     * [EN] Returns the URL of the global 16-bit heightmap image to load asynchronously.
     */
    get globalHeightmapUrl(): string {
        return this.#globalHeightmapUrl;
    }

    /**
     * [KO] 전체 지형 16비트 높이맵 이미지 URL을 설정하고 비동기 다운로드 및 가상 텍스처 베이킹을 시작합니다.
     * [EN] Sets the global 16-bit heightmap image URL and triggers asynchronous download and VT baking.
     *
     * @param val -
     * [KO] 높이맵 이미지 파일 URL
     * [EN] Heightmap image file URL
     */
    set globalHeightmapUrl(val: string) {
        if (this.#globalHeightmapUrl !== val) {
            this.#globalHeightmapUrl = val;
            this.#loadGlobalHeightmapAsync();
        }
    }

    /**
     * [KO] 로드된 전체 지형 원본 GPUTexture 인스턴스를 반환합니다.
     * [EN] Returns the loaded global raw terrain GPUTexture instance.
     */
    get globalHeightTexture(): GPUTexture | null {
        return this.#globalHeightTexture;
    }

    /**
     * @example
     * ```ts
     * // 외부 광원 그림자 수신 비활성화
     * landscape.receiveShadow = false;
     * console.log(landscape.receiveShadow); // false
     * ```
     *
     * [KO]
     * 지형 표면이 Directional Light 등 외부 섀도우 맵으로부터 그림자를 수신할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether the terrain surface receives shadows from external shadow maps (e.g. Directional Light).
     *
     * @defaultValue true
     */
    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(value: boolean) {
        if (this.#receiveShadow !== value) {
            this.#receiveShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 높이맵 레이마칭 자체 그림자 활성화
     * landscape.castHeightmapShadow = true;
     * landscape.heightmapShadowSteps = 32;
     * ```
     *
     * [KO]
     * 주 광원(Sun Direction) 방향으로 가상 높이맵 텍스처(VHT)를 레이마칭하여 지형 자체의 산맥이나 굴곡으로 인한 그림자(Self-Shadowing)를 계산할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to calculate terrain self-shadowing by raymarching the Virtual Heightmap Texture (VHT) towards the primary light direction.
     *
     * @defaultValue false
     */
    get castHeightmapShadow(): boolean {
        return this.#castHeightmapShadow;
    }

    set castHeightmapShadow(value: boolean) {
        if (this.#castHeightmapShadow !== value) {
            this.#castHeightmapShadow = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 자체 그림자 최대 탐색 거리를 500으로 설정
     * landscape.heightmapShadowDistance = 500.0;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자 계산 시 광선(Ray)이 지형 표면을 추적하는 최대 거리(월드 단위)를 설정하거나 가져옵니다. 최소값은 10.0입니다.
     *
     * [EN]
     * Gets or sets the maximum raymarching trace distance (in world units) for heightmap self-shadow calculations. Minimum value is 10.0.
     *
     * @defaultValue 3000.0
     */
    get heightmapShadowDistance(): number {
        return this.#heightmapShadowDistance;
    }

    set heightmapShadowDistance(value: number) {
        if (this.#heightmapShadowDistance !== value) {
            this.#heightmapShadowDistance = Math.max(10.0, value);
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 레이마칭 품질 향상을 위해 스텝 수 증가
     * landscape.heightmapShadowSteps = 32;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자 레이마칭의 샘플링 스텝 수를 설정하거나 가져옵니다. 4에서 64 사이의 정수로 클램프됩니다.
     *
     * [EN]
     * Gets or sets the number of sampling steps for heightmap self-shadow raymarching. Clamped between 4 and 64.
     *
     * @defaultValue 16
     */
    get heightmapShadowSteps(): number {
        return this.#heightmapShadowSteps;
    }

    set heightmapShadowSteps(value: number) {
        if (this.#heightmapShadowSteps !== value) {
            this.#heightmapShadowSteps = Math.max(4, Math.min(64, Math.round(value)));
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // 부드러운 반그림자 표현
     * landscape.heightmapShadowSoftness = 2.0;
     * ```
     *
     * [KO]
     * 높이맵 자체 그림자의 반그림자(Penumbra) 소프트니스 계수를 설정하거나 가져옵니다. 최소값은 0.1입니다.
     *
     * [EN]
     * Gets or sets the penumbra softness factor for heightmap self-shadows. Minimum value is 0.1.
     *
     * @defaultValue 8.0
     */
    get heightmapShadowSoftness(): number {
        return this.#heightmapShadowSoftness;
    }

    set heightmapShadowSoftness(value: number) {
        if (this.#heightmapShadowSoftness !== value) {
            this.#heightmapShadowSoftness = Math.max(0.1, value);
            this.#updateLandscapeUniforms();
        }
    }

    async #loadGlobalHeightmapAsync(): Promise<void> {
        if (!this.#globalHeightmapUrl) return;
        try {
            const response = await fetch(this.#globalHeightmapUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const cpuParsed = await parse16BitPngBuffer(buffer);

            if (cpuParsed) {
                const {width, height, pixels} = cpuParsed;
                const gpuDevice = this.#redGPUContext.gpuDevice;
                const count = width * height;
                const f32Pixels = new Float32Array(count);
                const inv65535 = 1.0 / 65535.0;
                for (let i = 0; i < count; i++) {
                    f32Pixels[i] = pixels[i] * inv65535;
                }
                const bytesPerRow = width * 4;

                if (this.#globalHeightTexture) {
                    this.#globalHeightTexture.destroy();
                }

                this.#globalHeightTexture = gpuDevice.createTexture({
                    size: [width, height],
                    format: 'r32float',
                    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
                    label: 'Landscape_GlobalHeightTexture_r32float'
                });

                gpuDevice.queue.writeTexture(
                    {texture: this.#globalHeightTexture},
                    f32Pixels.buffer,
                    {bytesPerRow},
                    [width, height]
                );

                this.#tileStreamer?.setGlobalHeightTexture(this.#globalHeightTexture);
                this.#tileStreamer?.setGlobalCPUHeightMap(cpuParsed);
                this.#bakeGlobalBaseToVHT();
            }
        } catch (e) {
            console.warn('[Landscape ⚠️] Failed to load globalHeightmapUrl:', this.#globalHeightmapUrl, e);
        }
    }

    #bakeGlobalBaseToVHT(): void {
        if (!this.#globalHeightTexture || !this.#vhtAtlasTexture || !this.#vntAtlasTexture) return;

        const atlasW = this.#componentCountX * 512;
        const atlasH = this.#componentCountZ * 512;

        this.#vhtGenerator?.bakeGlobalBase(
            this.#globalHeightTexture,
            this.#vhtAtlasTexture,
            this.#componentCountX,
            this.#componentCountZ
        );

        this.#vntGenerator?.bakeTileRegion(
            this.#vhtAtlasTexture,
            this.#vntAtlasTexture,
            0, 0,
            atlasW, atlasH,
            this.#heightScale,
            this.#worldSizeX,
            this.#componentCountX
        );

        this.#bakeGlobalVBT();
        this.#grassManager?.rebakeAll();
    }

    #bakeGlobalVBT(): void {
        if (!this.#vbtGenerator || !this.#vbtBaseColorAtlas || !this.#vbtNormalAtlas || !this.#vbtORMAtlas || !this.#material || !this.#vntAtlasTexture) return;

        this.#vbtGenerator.bakeAtlas(
            this.#vntAtlasTexture,
            this.#vbtBaseColorAtlas,
            this.#vbtNormalAtlas,
            this.#vbtORMAtlas,
            this.#material,
            512
        );
    }

    /**
     * @example
     * ```ts
     * // 지형 와이어프레임 모드 전환
     * landscape.wireframe = true;
     * ```
     *
     * [KO]
     * 지형 메쉬를 와이어프레임(Line List 토폴로지)으로 렌더링할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to render the terrain mesh in wireframe mode (Line List topology).
     *
     * @defaultValue false
     */
    get wireframe(): boolean {
        return this.#wireframe;
    }

    set wireframe(value: boolean) {
        if (this.#wireframe !== value) {
            this.#wireframe = value;
        }
    }

    /**
     * @example
     * ```ts
     * // 노멀 벡터 시각화 모드로 변경
     * landscape.debugMode = RedGPU.LANDSCAPE_DEBUG_MODE.NORMAL;
     * ```
     *
     * [KO]
     * 지형 셰이더의 디버그 시각화 모드를 설정하거나 가져옵니다. {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} 상수를 사용합니다.
     *
     * [EN]
     * Gets or sets the shader debug visualization mode for the landscape. Uses {@link RedGPU.Landscape.LANDSCAPE_DEBUG_MODE} constants.
     *
     * @defaultValue 0 (LANDSCAPE_DEBUG_MODE.NONE)
     */
    get debugMode(): number {
        return this.#debugMode;
    }

    set debugMode(value: number) {
        if (this.#debugMode !== value) {
            this.#debugMode = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * // LOD 단계별 색상 시각화 켜기
     * landscape.lodColoration = true;
     * ```
     *
     * [KO]
     * 지형 타일의 LOD 단계별로 고유 색상을 오버레이하여 시각화할지 여부를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets whether to overlay distinct colors for each LOD level of terrain tiles for debugging.
     *
     * @defaultValue false
     */
    get lodColoration(): boolean {
        return this.#lodColoration;
    }

    set lodColoration(value: boolean) {
        if (this.#lodColoration !== value) {
            this.#lodColoration = value;
            this.#updateLandscapeUniforms();
        }
    }

    /**
     * @example
     * ```ts
     * landscape.lodFadeStartRatio = 0.7;
     * ```
     *
     * [KO]
     * LOD 전환 시 디더링(Dithered cross-fade) 보간이 시작되는 거리 비율(0.0 ~ 0.99)을 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the distance ratio (0.0 to 0.99) at which dithered cross-fade transitions begin between LOD levels.
     *
     * @defaultValue 0.75
     */
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

    /**
     * @example
     * ```ts
     * landscape.lodGeomorphStartRatio = 0.7;
     * ```
     *
     * [KO]
     * LOD 지오모핑(Geomorphing) 보간 시작 비율(0.0 ~ 0.99)을 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the LOD geomorphing interpolation start ratio (0.0 to 0.99).
     *
     * @defaultValue 0.7
     */
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

    /**
     * @example
     * ```ts
     * // 타일 스트리밍 로딩 반경을 3000으로 확장
     * landscape.loadingRadius = 3000.0;
     * ```
     *
     * [KO]
     * 카메라 주변에서 가상 지형 타일을 능동적으로 메모리에 스트리밍할 로딩 반경(월드 단위)을 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the streaming loading radius (in world units) around the camera within which terrain tiles are actively loaded into memory.
     *
     * @defaultValue 2000.0
     */
    get loadingRadius(): number {
        return this.#tileStreamer.loadingRadius;
    }

    set loadingRadius(value: number) {
        this.#tileStreamer.loadingRadius = value;
    }

    /**
     * @example
     * ```ts
     * // 프레임당 최대 4개 타일 비동기 로드
     * landscape.maxLoadsPerFrame = 4;
     * ```
     *
     * [KO]
     * 단일 프레임당 비동기로 로드 및 업로드할 수 있는 최대 타일 텍스처 수를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the maximum number of tile textures that can be asynchronously loaded and uploaded per frame.
     *
     * @defaultValue 2
     */
    get maxLoadsPerFrame(): number {
        return this.#tileStreamer.maxLoadsPerFrame;
    }

    set maxLoadsPerFrame(value: number) {
        this.#tileStreamer.maxLoadsPerFrame = value;
    }

    /**
     * @example
     * ```ts
     * console.log(`현재 로드된 타일: ${landscape.loadedTileCount}`);
     * ```
     *
     * [KO]
     * 가상 텍스처 아틀라스에 현재 로드되어 메모리에 유지되고 있는 타일의 총 개수를 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the total number of tiles currently loaded and active in the virtual texture atlas. (Read-only)
     *
     */
    get loadedTileCount(): number {
        return this.#tileStreamer?.loadedTileCount ?? 0;
    }

    /**
     * @example
     * ```ts
     * console.log(`대기 중인 타일 로드 요청: ${landscape.pendingQueueSize}`);
     * ```
     *
     * [KO]
     * 현재 로드 대기열(Streaming Queue)에 머물러 있는 타일 요청의 수를 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the number of tile loading requests currently waiting in the streaming queue. (Read-only)
     *
     */
    get pendingQueueSize(): number {
        return this.#tileStreamer?.pendingQueueSize ?? 0;
    }

    /**
     * @example
     * ```ts
     * landscape.tileUrlResolver = (row, col) => ({
     *     heightUrl: `/assets/terrain/tiles/tile_${row}_${col}_height.png`,
     *     normalUrl: `/assets/terrain/tiles/tile_${row}_${col}_normal.png`
     * });
     * ```
     *
     * [KO]
     * 타일 그리드의 행/열 좌표 `(row, col)`를 기반으로 해당 타일의 높이맵 및 관련 텍스처 URL을 반환하는 해석 함수를 설정하거나 가져옵니다.
     *
     * [EN]
     * Gets or sets the resolver callback function that returns texture URLs for a tile given its grid coordinates `(row, col)`.
     *
     */
    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }

    /**
     * @example
     * ```ts
     * const tiles = landscape.landscapeComponents;
     * console.log(`총 타일 컴포넌트: ${tiles.length}`);
     * ```
     *
     * [KO]
     * 지형 공간 그리드에 등록된 모든 `LandscapeComponent` 인스턴스 배열을 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the array of all `LandscapeComponent` instances registered in the landscape spatial grid. (Read-only)
     *
     */
    get landscapeComponents(): readonly LandscapeComponent[] {
        return this.#spatialGrid.flatCells;
    }

    /**
     * @example
     * ```ts
     * console.log(landscape.lodDistancesSq);
     * ```
     *
     * [KO]
     * LOD 레벨 전환 기준 거리의 제곱값 배열을 가져옵니다. (읽기 전용)
     *
     * [EN]
     * Gets the array of squared distance thresholds used for LOD level transitions. (Read-only)
     *
     */
    get lodDistancesSq(): readonly number[] {
        return this.#lodDistancesSq;
    }

    /**
     * [KO] 월드 좌표 `(x, z)` 위치에서의 보간된 지형 표면 높이(Y값)를 반환합니다.
     * [EN] Returns the interpolated terrain surface height (Y coordinate) at the specified world `(x, z)` position.
     *
     * ### Example
     * ```typescript
     * const groundY = landscape.getHeightAt(100, 250);
     * character.y = groundY;
     * ```
     *
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @returns
     * [KO] 보간된 지형 높이값 (Y)
     * [EN] Interpolated terrain height value (Y)
     */
    getHeightAt(x: number, z: number): number {
        return this.#tileStreamer.getHeightAt(x, z);
    }

    /**
     * [KO] 새로운 텍스처 블렌딩 레이어(`LandscapeLayer`)를 생성하여 지형에 추가합니다.
     * [EN] Creates and adds a new texture blending layer (`LandscapeLayer`) to the landscape.
     *
     * ### Example
     * ```typescript
     * const grassLayer = landscape.addLayer({
     *     diffuseTexture: grassTexture,
     *     normalTexture: grassNormalTexture,
     *     uvScale: [40, 40]
     * });
     * ```
     *
     * @param options -
     * [KO] 지형 레이어 생성 옵션
     * [EN] Terrain layer creation options
     * @returns
     * [KO] 생성된 LandscapeLayer 인스턴스
     * [EN] The created LandscapeLayer instance
     */
    addLayer(options: LandscapeLayerOptions): LandscapeLayer {
        const layer = new LandscapeLayer(this.#redGPUContext, options);
        this.#material.addLayer(layer);
        return layer;
    }

    /**
     * [KO] 지정된 레이어 인스턴스 또는 레이어 UUID를 전달받아 지형에서 제거합니다.
     * [EN] Removes the specified layer instance or layer by UUID from the landscape.
     *
     * @param layer -
     * [KO] 제거할 LandscapeLayer 인스턴스 또는 UUID 문자열
     * [EN] LandscapeLayer instance or UUID string to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether removal succeeded
     */
    removeLayer(layer: LandscapeLayer | string): boolean {
        return this.#material.removeLayer(layer);
    }

    /**
     * [KO] 지형에 등록된 모든 텍스처 레이어를 제거합니다.
     * [EN] Clears all texture layers registered on the landscape.
     */
    clearLayers(): void {
        this.#material.clearLayers();
    }

    /**
     * @example
     * ```ts
     * // 렌더 패스 인코더를 전달하여 지형 드로우 콜 기록
     * landscape.render(view, renderPassEncoder);
     * ```
     *
     * [KO]
     * 지형의 인다이렉트 드로우(Indirect Draw) 파이프라인을 실행하여 현재 렌더 패스에 지형 렌더링 커맨드를 기록합니다.
     * GPU 인스턴스 버퍼와 결합 인덱스/버텍스 버퍼, 바인드 그룹(시스템 유니폼, 인스턴스 스토리지, 머티리얼)을 바인딩하고
     * LOD별 인다이렉트 드로우 콜을 순차적으로 발행합니다.
     *
     * [EN]
     * Executes the indirect draw pipeline of the landscape to record terrain rendering commands into the active render pass.
     * Binds the GPU instance buffer, combined vertex/index buffers, and bind groups (system uniform, instance storage, material),
     * and sequentially issues indirect draw calls for each LOD level.
     *
     * @param view - {@link RedGPU.Display.View3D} 또는 렌더 뷰 상태 객체 / {@link RedGPU.Display.View3D} or render view state data.
     * @param passEncoder - 대상 WebGPU 렌더 패스 인코더 (생략 시 view에서 추출) / Optional target WebGPU render pass encoder.
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

        const material = this.#material;
        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        if (material) {
            if (material.dirtyPipeline) {
                material._updateFragmentState();
                material.dirtyPipeline = false;
                this.#clearPipelineCaches();
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

        const matUniformBG = this.#material?.gpuRenderInfo?.fragmentUniformBindGroup;
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
    }

    /**
     * @example
     * ```ts
     * // 렌더 루프에서 매 프레임 호출
     * landscape.update(camera, renderViewStateData);
     * ```
     *
     * [KO]
     * 매 프레임 카메라 위치 및 뷰 프러스텀, HZB(Hierarchical Z-Buffer)를 기반으로 지형 서브시스템을 갱신합니다.
     * 타일 스트리밍, GPU 인스턴스 인다이렉트 드로우 버퍼 리셋, GPU 컬링 컴퓨트 패스 등록, 디버거 갱신을 일괄 수행합니다.
     *
     * [EN]
     * Updates terrain subsystems every frame based on the camera position, view frustum, and HZB (Hierarchical Z-Buffer).
     * Performs tile streaming updates, GPU instance indirect draw buffer resets, GPU culling compute pass dispatch registration, and debugger updates.
     *
     * @param camera - 주 카메라 인스턴스 (예: {@link RedGPU.Camera.PerspectiveCamera}) / Primary camera instance (e.g. {@link RedGPU.Camera.PerspectiveCamera}).
     * @param renderViewStateData - 현재 뷰 상태 및 렌더 데이터 / Current view state and rendering data.
     */
    update(camera: any, renderViewStateData?: any): void {
        if (!camera) return;

        if (this.#material) {
            this.#material.updateUniformsData();
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

        this.#tileStreamer.update(camX, camZ, camY);

        const totalComponents = this.#componentCountX * this.#componentCountZ;

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

        const fovDeg = rawCamera?.fov ?? camera?.fov ?? 60.0;
        const tanHalfFOV = Math.tan(((fovDeg * Math.PI) / 180.0) * 0.5);
        if (Math.abs(this.#lastTanHalfFOV - tanHalfFOV) > 1e-4) {
            this.#lastTanHalfFOV = tanHalfFOV;
            this.#updateLandscapeUniforms();
        }
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;

        const currentView = renderViewStateData?.view || (camera as any)?.view;
        const hzb = currentView?.hierarchicalZBuffer;
        const effectiveHZBTextureView = hzb?.textureView || null;
        const effectiveHZBSampler = hzb?.sampler || null;

        if (this.#lastHZBView !== effectiveHZBTextureView) {
            this.#lastHZBView = effectiveHZBTextureView;
            this.#lastHZBSampler = effectiveHZBSampler;
            if (this.#instanceBuffer?.allInputTilesBuffer && this.#instanceBuffer?.visibleTileIndicesBuffer && this.#instanceBuffer?.indirectDrawBuffer) {
                this.#gpuCuller?.updateBindGroup(
                    this.#instanceBuffer.allInputTilesBuffer,
                    this.#instanceBuffer.visibleTileIndicesBuffer,
                    this.#instanceBuffer.indirectDrawBuffer,
                    effectiveHZBTextureView,
                    effectiveHZBSampler
                );
            }
        }

        let mainPVMatrix: Float32Array | null = null;
        if (rawCamera?.projectionMatrix && rawCamera?.viewMatrix) {
            mainPVMatrix = tempPVMatrix;
            mat4.multiply(mainPVMatrix, rawCamera.projectionMatrix, rawCamera.viewMatrix);
        }

        this.#gpuCuller?.updateUniforms(
            camX, camY, camZ,
            this.#maxLODLevel,
            this.#worldSizeX, this.#worldSizeZ,
            this.#tileSizeX, this.#tileSizeZ,
            this.#heightScale,
            totalComponents,
            frustumPlanes,
            lodDistancesArray,
            tanHalfFOV,
            lodMetricVal,
            !!effectiveHZBTextureView,
            mainPVMatrix
        );

        this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
            COMPUTE_PASS_DESCRIPTOR,
            this.#onPreProcessComputePass
        );

        this.#debuggerManager.update(camera);
    }

    /**
     * @example
     * ```ts
     * if (landscape.isTileLoaded(0, 0)) {
     *     console.log('타일 (0, 0) 로드 완료');
     * }
     * ```
     *
     * [KO]
     * 특정 행(row)과 열(col) 좌표의 지형 타일이 가상 텍스처 아틀라스에 완전히 로드되어 렌더링 가능한 상태인지 확인합니다.
     *
     * [EN]
     * Checks whether the terrain tile at the specified row and column coordinates is fully loaded and ready for rendering in the virtual texture atlas.
     *
     * @param row - 타일 그리드 행 인덱스 / Tile grid row index.
     * @param col - 타일 그리드 열 인덱스 / Tile grid column index.
     * @returns 로드 완료 여부 / Whether the tile is loaded.
     */
    isTileLoaded(row: number, col: number): boolean {
        return this.#tileStreamer?.isTileLoaded(row, col) ?? false;
    }

    /**
     * @internal
     */
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

    #clampComponentCount(val: number): number {
        const maxTextureDim = this.#redGPUContext?.gpuDevice?.limits?.maxTextureDimension2D ?? 8192;
        const maxTilesForHardware = Math.floor(maxTextureDim / 512);
        const maxAllowed = Math.min(32, Math.max(1, maxTilesForHardware));
        return Math.min(maxAllowed, Math.max(1, Math.round(val)));
    }

    #updateTuples(): void {
        this.#worldSizeTuple[0] = this.#worldSizeX;
        this.#worldSizeTuple[1] = this.#worldSizeZ;
        this.#componentCountTuple[0] = this.#componentCountX;
        this.#componentCountTuple[1] = this.#componentCountZ;
        this.#tileSizeTuple[0] = this.#tileSizeX;
        this.#tileSizeTuple[1] = this.#tileSizeZ;
    }

    #updateLandscapeUniforms(): void {
        const vhtW = this.#vhtAtlasTexture?.gpuTexture?.width || (this.#componentCountX * 512);
        const vhtH = this.#vhtAtlasTexture?.gpuTexture?.height || (this.#componentCountZ * 512);
        const lodMetricVal = this.#lodMetric === 'screenSize' ? 1.0 : 0.0;
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
            this.#foliageManager?.subCellSize ?? 100.0,
            this.#foliageManager?.streamingRadius ?? 600.0,
            this.#debugMode
        );
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        const totalComponents = this.#componentCountX * this.#componentCountZ;
        this.#gpuCuller?.dispatchPass(computePass, totalComponents);
    };

    #initSystems(
        redGPUContext: RedGPUContext,
        componentCountX: number,
        componentCountZ: number,
        maxLODLevel: number,
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
            vhtAtlasTexture.gpuTextureView,
            vntAtlasTexture.gpuTextureView,
            this.#vbtBaseColorAtlas?.gpuTextureView,
            this.#vbtNormalAtlas?.gpuTextureView,
            this.#vbtORMAtlas?.gpuTextureView
        );

        this.#rebuildLODStructures();
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

    /**
     * @example
     * ```ts
     * landscape.destroy();
     * ```
     *
     * [KO]
     * 지형 인스턴스와 관련된 모든 GPU 리소스(텍스처 아틀라스, 인스턴스 버퍼, 지오메트리, 파이프라인 캐시) 및 서브시스템 매니저를 해제하고 파기합니다.
     *
     * [EN]
     * Releases and destroys all GPU resources (texture atlases, instance buffer, geometry, pipeline caches) and subsystem managers associated with this landscape instance.
     *
     */
    override destroy(): void {
        super.destroy();
        this.#debuggerManager?.destroy();
        this.#foliageManager?.destroy?.();
        this.#grassManager?.destroy?.();
        this.#sharedGeometry?.destroy();
        this.#gpuCuller?.destroy();
        this.#tileStreamer?.destroy();
        this.#vhtGenerator?.destroy();
        this.#vntGenerator?.destroy();
        this.#vbtGenerator?.destroy();

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
        this.#clearPipelineCaches();
    }

    #rebuildLODStructures(): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        for (let i = 0; i < this.#maxLODLevel; i++) {
            this.#lodColorsRGBA.push(LANDSCAPE_DEFAULT_LOD_COLORS[i % LANDSCAPE_DEFAULT_LOD_COLORS.length] as [number, number, number, number]);
        }

        const multipliers = DEFAULT_LOD_MULTIPLIERS;
        for (let i = 0; i < this.#maxLODLevel - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.0 * Math.pow(1.8, i)));
        }

        this.#updateLODDistances();
        this.#updateLandscapeUniforms();
    }

    #clearPipelineCaches(): void {
        this.#renderPipelineCache.clear();
        this.#cachedRenderPipeline = null;
        this.#lastRenderTopology = '';
        this.#lastRenderMaterialUUID = '';
        this.#lastRenderVariantModule = null;
        this.#lastRenderMsaaID = '';
    }

    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const material = this.#material;
        if (!gpuDevice || !material || !material.gpuRenderInfo) return null;

        const antialiasingManager = this.#redGPUContext.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const topology = this.#wireframe ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        const fragModule = material.gpuRenderInfo.fragmentShaderModule;

        if (
            this.#cachedRenderPipeline &&
            this.#lastRenderTopology === topology &&
            this.#lastRenderMaterialUUID === material.uuid &&
            this.#lastRenderVariantModule === fragModule &&
            this.#lastRenderMsaaID === msaaID
        ) {
            return this.#cachedRenderPipeline;
        }

        const variantKey = (fragModule as any)?.label || 'default';
        const key = `${topology}_${material.uuid}_${variantKey}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            const pipeline = this.#renderPipelineCache.get(key)!;
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
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
                    cullMode: this.#wireframe ? 'none' : 'back'
                },
                depthStencil: {
                    format: 'depth32float',
                    depthWriteEnabled: true,
                    depthCompare: 'less-equal',
                },
                multisample: {count: sampleCount}
            });

            this.#renderPipelineCache.set(key, pipeline);
            this.#cachedRenderPipeline = pipeline;
            this.#lastRenderTopology = topology;
            this.#lastRenderMaterialUUID = material.uuid;
            this.#lastRenderVariantModule = fragModule;
            this.#lastRenderMsaaID = msaaID;
            return pipeline;
        } catch (e) {
            console.warn('Failed to create Landscape RenderPipeline:', e);
            return null;
        }
    }

    #rebuildTiles(): void {
        this.#spatialGrid = new LandscapeSpatialGrid(this.#componentCountX, this.#componentCountZ, this.#tileSizeX, this.#tileSizeZ);
        if (this.#tileStreamer) {
            this.#tileStreamer.setSpatialGrid(this.#spatialGrid);
        }
        this.#sharedGeometry.updateTileSize(this.#tileSizeX, this.#tileSizeZ);
        this.#updateLODDistances();
        this.#clearPipelineCaches();

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
                this.#tileStreamer.setAtlasTextures(
                    this.#vhtAtlasTexture,
                    this.#vntAtlasTexture,
                    this.#vbtBaseColorAtlas,
                    this.#vbtNormalAtlas,
                    this.#vbtORMAtlas
                );
                this.#tileStreamer.setGenerators(this.#vhtGenerator, this.#vntGenerator, this.#vbtGenerator);
                this.#tileStreamer.setMaterial(this.#material);
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

        if (needRebuildBindGroup && this.#vhtAtlasTexture && this.#vntAtlasTexture) {
            this.#instanceBuffer.updateBindGroup(
                this.#vhtAtlasTexture.gpuTextureView,
                this.#vntAtlasTexture.gpuTextureView,
                this.#vbtBaseColorAtlas?.gpuTextureView,
                this.#vbtNormalAtlas?.gpuTextureView,
                this.#vbtORMAtlas?.gpuTextureView
            );
            if (this.#globalHeightTexture) {
                this.#bakeGlobalBaseToVHT();
            }
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
                    posX, posZ,
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
                this.#instanceBuffer.indirectDrawBuffer,
                this.#lastHZBView,
                this.#lastHZBSampler
            );
        }

        this.#material?.requestVBTRebake(true);
    }
}

Object.freeze(Landscape);
export default Landscape;
