import RedGPUContext from "../../context/RedGPUContext";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import RenderViewStateData from "../view/core/RenderViewStateData";
import landscapeVertexSource from "./shader/landscapeVertex.wgsl";
import LANDSCAPE_BASE_GRID_SIZE from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeInstanceBuffer from "./LandscapeInstanceBuffer";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeOptions from "./LandscapeOptions";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";
import LandscapeTileStreamer, {LandscapeTileUrlResolver} from "./LandscapeTileStreamer";

const DEFAULT_LOD_COLORS: [number, number, number, number][] = [
    [0.18, 0.8, 0.44, 1.0],  // LOD 0: Green
    [0.95, 0.77, 0.06, 1.0], // LOD 1: Yellow
    [0.9, 0.49, 0.13, 1.0],  // LOD 2: Orange
    [0.91, 0.3, 0.24, 1.0],  // LOD 3: Red
    [0.61, 0.35, 0.71, 1.0], // LOD 4: Purple
    [0.1, 0.74, 0.61, 1.0],  // LOD 5: Cyan
    [0.2, 0.6, 0.86, 1.0],   // LOD 6: Blue
    [0.93, 0.94, 0.95, 1.0]  // LOD 7: White
];

/**
 * [KO] SpatialGrid $O(1)$ 공간 변환 및 Multi-LOD Batching Instanced Rendering 지원 기반 Landscape 지형 시스템 클래스입니다 (Pure Terrain System Manager).
 * [EN] Landscape terrain system class based on SpatialGrid O(1) spatial transformation and Multi-LOD Batching Instanced Rendering (Pure Terrain System Manager).
 */
export class Landscape {
    #redGPUContext: RedGPUContext;
    #sharedGeometry: LandscapeSharedGeometry;
    #spatialGrid: LandscapeSpatialGrid;
    #instanceBuffer: LandscapeInstanceBuffer;
    #landscapeComponents: LandscapeComponent[] = [];
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #defaultTerrainColorRGBA: [number, number, number, number] = [0.22, 0.49, 0.26, 1.0];
    #landscapeMaterial: LandscapeMaterial;

    #wireframe: boolean = false;
    #lodColoration: boolean = false;
    #tileStreamer: LandscapeTileStreamer;

    #worldSizeX: number;
    #worldSizeZ: number;
    #componentCountX: number;
    #componentCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #maxLODLevel: number;
    #componentSizeQuads: number;

    // Zero-GC Getter 재사용 튜플 버퍼
    #worldSizeTuple: [number, number] = [0, 0];
    #componentCountTuple: [number, number] = [0, 0];
    #tileSizeTuple: [number, number] = [0, 0];

    // 매 프레임 카메라 Cell 및 LOD 카운팅 재사용 버퍼 (Zero-GC)
    #tempCellBuffer: Int32Array = new Int32Array(2);
    #lodCountsBuffer: Int32Array;

    #vertexShaderModule: GPUShaderModule;
    #renderPipelineCache: Map<string, GPURenderPipeline> = new Map();

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] Landscape 인스턴스를 생성합니다 (언리얼 엔진 5 공식 기본값: worldSize 8000m, componentCount 8x8, componentSizeQuads 63 [63x63 Quads, 4096 Vertices], maxLODLevel 4).
     * [EN] Creates an instance of Landscape (Unreal Engine 5 official defaults: worldSize 8000m, componentCount 8x8, componentSizeQuads 63 [63x63 Quads, 4096 Vertices], maxLODLevel 4).
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param options - [KO] Landscape 설정 옵션 [EN] Landscape configuration options
     */
    constructor(redGPUContext: RedGPUContext, options: LandscapeOptions = {}) {
        this.#redGPUContext = redGPUContext;

        const parseValue = (val: number | [number, number] | undefined, defaultVal: number): [number, number] => {
            if (Array.isArray(val)) return [val[0], val[1]];
            if (typeof val === 'number') return [val, val];
            return [defaultVal, defaultVal];
        };

        let [worldSizeX, worldSizeZ] = parseValue(options.worldSize, 8000);
        let [rawComponentCountX, rawComponentCountZ] = parseValue(options.componentCount, 8);
        let componentCountX = Landscape.#clampComponentCount(rawComponentCountX);
        let componentCountZ = Landscape.#clampComponentCount(rawComponentCountZ);

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

        const componentSizeQuads = options.componentSizeQuads ?? LANDSCAPE_BASE_GRID_SIZE.QUAD_63;
        const maxLODLevel = Math.min(8, Math.max(1, options.maxLODLevel ?? 4));

        const landscapeMaterial = options.landscapeMaterial || new LandscapeMaterial(redGPUContext, '#387d42');
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, componentSizeQuads, maxLODLevel);

        this.#spatialGrid = new LandscapeSpatialGrid(componentCountX, componentCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#landscapeMaterial = landscapeMaterial;
        this.#worldSizeX = worldSizeX;
        this.#worldSizeZ = worldSizeZ;
        this.#componentCountX = componentCountX;
        this.#componentCountZ = componentCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#componentSizeQuads = componentSizeQuads;
        this.#maxLODLevel = maxLODLevel;
        this.#wireframe = options.wireframe ?? false;
        this.#lodColoration = options.lodColoration ?? false;
        this.#tileStreamer = new LandscapeTileStreamer(redGPUContext, this.#spatialGrid, options.loadingRadius ?? 2500.0);
        if (options.tileUrlResolver) {
            this.#tileStreamer.tileUrlResolver = options.tileUrlResolver;
        }

        this.#updateTuples();

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;

        this.#lodCountsBuffer = new Int32Array(maxLODLevel);

        // WebGPU Multi-LOD Indirect & Instance Buffer 생성
        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, componentCountX * componentCountZ, maxLODLevel);

        this.#rebuildLODStructures(options.lodColors, options.lodMultipliers, options.lodDistances);
        this.#rebuildTiles();
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
            this.#rebuildTiles();
        }
    }

    /** [KO] UE5 공식 컴포넌트 타일 개수 (ComponentCountX / ComponentCountY) */
    get componentCount(): [number, number] {
        return this.#componentCountTuple;
    }

    set componentCount(value: number | [number, number]) {
        let tcX = this.#componentCountX;
        let tcZ = this.#componentCountZ;
        if (Array.isArray(value)) {
            tcX = Landscape.#clampComponentCount(value[0]);
            tcZ = Landscape.#clampComponentCount(value[1]);
        } else if (typeof value === 'number') {
            const count = Landscape.#clampComponentCount(value);
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

    /** [KO] UE5 공식 컴포넌트 쿼드 그리드 해상도 (ComponentSizeQuads) */
    get componentSizeQuads(): number {
        return this.#componentSizeQuads;
    }

    set componentSizeQuads(value: number) {
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

    /** [KO] UE5 공식 최대 LOD 레벨 단계 수 (MaxLODLevel) */
    get maxLODLevel(): number {
        return this.#maxLODLevel;
    }

    set maxLODLevel(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#maxLODLevel !== count) {
            this.#maxLODLevel = count;
            this.#lodCountsBuffer = new Int32Array(count);
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

    /** [KO] UE5 공식 메인 지형 머티리얼 (LandscapeMaterial) */
    get landscapeMaterial(): LandscapeMaterial {
        return this.#landscapeMaterial;
    }

    set landscapeMaterial(val: LandscapeMaterial) {
        if (this.#landscapeMaterial !== val) {
            this.#landscapeMaterial = val;
            this.#renderPipelineCache.clear();
        }
    }

    // =========================================================================
    // UE5 (Unreal Engine 5) Official Primary Properties
    // =========================================================================

    /** [KO] 와이어프레임 표시 플래그 (wireframe) */
    get wireframe(): boolean {
        return this.#wireframe;
    }

    set wireframe(value: boolean) {
        if (this.#wireframe !== value) {
            this.#wireframe = value;
        }
    }

    /** [KO] LOD 색상 디버그 플래그 (lodColoration) */
    get lodColoration(): boolean {
        return this.#lodColoration;
    }

    set lodColoration(value: boolean) {
        if (this.#lodColoration !== value) {
            this.#lodColoration = value;
        }
    }

    /** [KO] UE5 공식 컴포넌트 타일 리스트 (LandscapeComponents) */
    get landscapeComponents(): LandscapeComponent[] {
        return this.#landscapeComponents;
    }

    get tileSize(): [number, number] {
        return this.#tileSizeTuple;
    }

    /**
     * [KO] 언리얼 엔진 5 표준 타일 개수 클램핑 헬퍼 (최소 1개, 최대 32개 타일)
     */
    static #clampComponentCount(val: number): number {
        return Math.min(32, Math.max(1, Math.round(val)));
    }

    get tileStreamer(): LandscapeTileStreamer {
        return this.#tileStreamer;
    }

    /**
     * [KO] Multi-LOD Batching 인스턴싱으로 전체 지형 타일을 디스패치하고 RenderViewStateData 통계를 기록합니다 (Zero-GC).
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void {
        const renderPassEncoder = passEncoder || view?.currentRenderPassEncoder || view?.renderPassEncoder;
        const view3D = view?.view || view;
        if (!renderPassEncoder) return;

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

        const matUniformBG = this.#landscapeMaterial?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(1, matUniformBG);
        }

        renderPassEncoder.setBindGroup(2, storageBG);
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        const maxLODLevel = sharedGeometry.maxLODLevel;
        for (let lod = 0; lod < maxLODLevel; lod++) {
            const instanceCount = instanceBuffer.getLODInstanceCount(lod);
            if (instanceCount === 0) continue;

            const lodRange = sharedGeometry.getLODRange(lod);
            const firstInstance = instanceBuffer.getLODFirstInstance(lod);

            const indexCount = isWireframe ? lodRange.wireframeIndexCount : lodRange.indexCount;
            const firstIndex = isWireframe ? lodRange.wireframeFirstIndex : lodRange.firstIndex;

            renderPassEncoder.drawIndexed(
                indexCount,
                instanceCount,
                firstIndex,
                lodRange.baseVertex,
                firstInstance
            );

            if (renderResults) {
                renderResults.numDrawCalls++;
                renderResults.numInstances += instanceCount;
                renderResults.num3DObjects += instanceCount;
                renderResults.numTriangles += (lodRange.indexCount / 3) * instanceCount;
            }
        }
    }

    #updateTuples(): void {
        this.#worldSizeTuple[0] = this.#worldSizeX;
        this.#worldSizeTuple[1] = this.#worldSizeZ;
        this.#componentCountTuple[0] = this.#componentCountX;
        this.#componentCountTuple[1] = this.#componentCountZ;
        this.#tileSizeTuple[0] = this.#tileSizeX;
        this.#tileSizeTuple[1] = this.#tileSizeZ;
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
        const key = `${topology}_${material.uuid}_${msaaID}`;

        if (this.#renderPipelineCache.has(key)) {
            return this.#renderPipelineCache.get(key);
        }

        try {
            const resourceManager = this.#redGPUContext.resourceManager;
            const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');
            const fragUniformBGLayout = material.gpuRenderInfo.fragmentBindGroupLayout;

            const pipelineLayout = gpuDevice.createPipelineLayout({
                label: `LandscapePipelineLayout_${key}`,
                bindGroupLayouts: [systemBGLayout, fragUniformBGLayout, storageBGLayout]
            });

            const vertexBuffers: GPUVertexBufferLayout[] = [{
                arrayStride: geom?.interleavedStruct?.arrayStride ?? 32,
                attributes: geom?.interleavedStruct?.attributes ?? [
                    {shaderLocation: 0, offset: 0, format: 'float32x3'},
                    {shaderLocation: 1, offset: 12, format: 'float32x3'},
                    {shaderLocation: 2, offset: 24, format: 'float32x2'}
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
            this.#lodColorsRGBA.push(DEFAULT_LOD_COLORS[i % DEFAULT_LOD_COLORS.length]);
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
    }

    get loadingRadius(): number {
        return this.#tileStreamer.loadingRadius;
    }

    get instanceBuffer(): LandscapeInstanceBuffer {
        return this.#instanceBuffer;
    }

    get sharedGeometry(): LandscapeSharedGeometry {
        return this.#sharedGeometry;
    }

    get spatialGrid(): LandscapeSpatialGrid {
        return this.#spatialGrid;
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

    get tileUrlResolver(): LandscapeTileUrlResolver | null {
        return this.#tileStreamer.tileUrlResolver;
    }

    set tileUrlResolver(resolver: LandscapeTileUrlResolver | null) {
        this.#tileStreamer.tileUrlResolver = resolver;
    }

    update(camera: any): void {
        if (!camera) return;

        // 카메라 및 컨트롤러 유형에 관계없이 3D 월드 위치(camX, camY, camZ) 안전 추출
        const camX = camera.x ?? camera.position?.[0] ?? camera.camera?.x ?? 0;
        const camY = camera.y ?? camera.position?.[1] ?? camera.camera?.y ?? 0;
        const camZ = camera.z ?? camera.position?.[2] ?? camera.camera?.z ?? 0;

        this.#spatialGrid.getCellCoordinates(camX, camZ, this.#tempCellBuffer);
        this.#tileStreamer.update(camX, camZ);
        const camYSq = camY * camY;

        const components = this.#spatialGrid.flatCells;
        const count = components.length;
        const distSqList = this.#lodDistancesSq;
        const lodLimit = distSqList.length;

        // 1. 패스: 각 컴포넌트별 LOD 계산 및 LOD 그룹별 개수 집계
        this.#lodCountsBuffer.fill(0);

        for (let i = 0; i < count; i++) {
            const comp = components[i];
            const dx = comp.worldX - camX;
            const dz = comp.worldZ - camZ;
            const distSq = dx * dx + dz * dz + camYSq;

            let lod = lodLimit;
            for (let j = 0; j < lodLimit; j++) {
                if (distSq < distSqList[j]) {
                    lod = j;
                    break;
                }
            }

            const activeLOD = Math.min(lod, this.#maxLODLevel - 1);
            comp.lodLevel = activeLOD;
            this.#lodCountsBuffer[activeLOD]++;
        }

        // 2. 패스: InstanceBuffer에 LOD 그룹 오프셋 할당
        const instanceBuf = this.#instanceBuffer;
        instanceBuf.prepareLODAllocation(this.#lodCountsBuffer);

        // 3. 패스: LOD 그룹별로 정렬하여 인스턴스 데이터 작성 (Zero-GC 재사용 버퍼 타격 + Mesh 표준 prevTileX/Z 100% 동기화)
        const lodColorationActive = this.#lodColoration;
        const lodColorsRGBA = this.#lodColorsRGBA;
        const defaultColor = this.#defaultTerrainColorRGBA;

        for (let i = 0; i < count; i++) {
            const comp = components[i];
            const activeLOD = comp.lodLevel;

            const colorRGBA = lodColorationActive
                ? lodColorsRGBA[activeLOD]
                : defaultColor;

            instanceBuf.writeLODInstanceData(
                activeLOD,
                comp.worldX,
                comp.worldZ,
                comp.prevWorldX,
                comp.prevWorldZ,
                colorRGBA[0],
                colorRGBA[1],
                colorRGBA[2],
                colorRGBA[3]
            );

            // 프레임 위치 동기화 완료 후 이전 위치 갱신
            comp.updatePrevPosition();
        }

        // 4. GPU 버퍼 동기화 제출
        instanceBuf.flushToGPU();
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

        if (this.#instanceBuffer.maxComponentCount < targetCount || this.#instanceBuffer.maxLODLevel !== this.#maxLODLevel) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.#redGPUContext, targetCount, this.#maxLODLevel);
        }

        while (this.#landscapeComponents.length > targetCount) {
            this.#landscapeComponents.pop();
        }

        this.#spatialGrid.clearTiles();

        let index = 0;
        for (let row = 0; row < componentCountZ; row++) {
            for (let col = 0; col < componentCountX; col++) {
                const posX = col * tileSizeX - halfSizeX + tileSizeX / 2;
                const posZ = row * tileSizeZ - halfSizeZ + tileSizeZ / 2;

                if (index < this.#landscapeComponents.length) {
                    const comp = this.#landscapeComponents[index];
                    comp.worldX = posX;
                    comp.worldZ = posZ;
                    comp.componentX = col;
                    comp.componentZ = row;
                    this.#spatialGrid.registerTile(row, col, comp);
                } else {
                    const comp = new LandscapeComponent(
                        posX,
                        posZ,
                        col,
                        row
                    );
                    this.#landscapeComponents.push(comp);
                    this.#spatialGrid.registerTile(row, col, comp);
                }
                index++;
            }
        }
    }
}

export default Landscape;
