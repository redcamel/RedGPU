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
    #components: LandscapeComponent[] = [];
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodColorsRGBA: [number, number, number, number][] = [];
    #defaultTerrainColorRGBA: [number, number, number, number] = [0.22, 0.49, 0.26, 1.0];
    #baseMaterial: LandscapeMaterial;

    #wireframe: boolean = false;
    #lodColoration: boolean = false;

    #worldSizeX: number;
    #worldSizeZ: number;
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #lodCount: number;
    #gridSize: number;

    // Zero-GC Getter 재사용 튜플 버퍼
    #worldSizeTuple: [number, number] = [0, 0];
    #tileCountTuple: [number, number] = [0, 0];
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
     * [KO] Landscape 인스턴스를 생성합니다 (언리얼 엔진 5 공식 기본값: worldSize 8000m, tileCount 8x8, gridSize 63 [63x63 Quads, 4096 Vertices], lodCount 4).
     * [EN] Creates an instance of Landscape (Unreal Engine 5 official defaults: worldSize 8000m, tileCount 8x8, gridSize 63 [63x63 Quads, 4096 Vertices], lodCount 4).
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
        let [rawTileCountX, rawTileCountZ] = parseValue(options.tileCount, 8);
        let tileCountX = Landscape.#clampTileCount(rawTileCountX);
        let tileCountZ = Landscape.#clampTileCount(rawTileCountZ);

        let [tileSizeX, tileSizeZ] = [worldSizeX / tileCountX, worldSizeZ / tileCountZ];

        if (options.tileSize !== undefined) {
            const [tsX, tsZ] = parseValue(options.tileSize, 1000);
            tileSizeX = tsX;
            tileSizeZ = tsZ;
            if (options.worldSize === undefined) {
                worldSizeX = tileSizeX * tileCountX;
                worldSizeZ = tileSizeZ * tileCountZ;
            }
        }

        const gridSize = options.gridSize ?? LANDSCAPE_BASE_GRID_SIZE.QUAD_63;
        const lodCount = Math.min(8, Math.max(1, options.lodCount ?? 4));

        const baseMaterial = options.material || new LandscapeMaterial(redGPUContext, '#387d42');
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, gridSize, lodCount);

        this.#spatialGrid = new LandscapeSpatialGrid(tileCountX, tileCountZ, tileSizeX, tileSizeZ);
        this.#sharedGeometry = sharedGeometry;
        this.#baseMaterial = baseMaterial;
        this.#worldSizeX = worldSizeX;
        this.#worldSizeZ = worldSizeZ;
        this.#tileCountX = tileCountX;
        this.#tileCountZ = tileCountZ;
        this.#tileSizeX = tileSizeX;
        this.#tileSizeZ = tileSizeZ;
        this.#gridSize = gridSize;
        this.#lodCount = lodCount;
        this.#wireframe = options.wireframe ?? false;
        this.#lodColoration = options.lodColoration ?? false;

        this.#updateTuples();

        const resourceManager = redGPUContext.resourceManager;
        let vModule = resourceManager.getGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule');
        if (!vModule) {
            vModule = resourceManager.createGPUShaderModule('LandscapeFullCompatibleFlatVertexShaderModule', {
                code: landscapeVertexSource
            });
        }
        this.#vertexShaderModule = vModule;

        this.#lodCountsBuffer = new Int32Array(lodCount);

        // WebGPU Multi-LOD Indirect & Instance Buffer 생성
        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, tileCountX * tileCountZ, lodCount);

        this.#rebuildLODStructures(options.lodColors, options.lodMultipliers, options.lodDistances);
        this.#rebuildTiles();
    }

    get worldSize(): [number, number] {
        return this.#worldSizeTuple;
    }

    update(camera: any): void {
        if (!camera) return;

        // 카메라 및 컨트롤러 유형에 관계없이 3D 월드 위치(camX, camY, camZ) 안전 추출
        const camX = camera.x ?? camera.position?.[0] ?? camera.camera?.x ?? 0;
        const camY = camera.y ?? camera.position?.[1] ?? camera.camera?.y ?? 0;
        const camZ = camera.z ?? camera.position?.[2] ?? camera.camera?.z ?? 0;

        this.#spatialGrid.getCellCoordinates(camX, camZ, this.#tempCellBuffer);
        const camYSq = camY * camY;

        const components = this.#spatialGrid.flatCells;
        const count = components.length;
        const distSqList = this.#lodDistancesSq;
        const lodLimit = distSqList.length;

        // 1. 패스: 각 타일별 LOD 계산 및 LOD 그룹별 타일 개수 집계
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

            const activeLOD = Math.min(lod, this.#lodCount - 1);
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
            this.#tileSizeX = wx / this.#tileCountX;
            this.#tileSizeZ = wz / this.#tileCountZ;
            this.#updateTuples();
            this.#rebuildTiles();
        }
    }

    get tileCount(): [number, number] {
        return this.#tileCountTuple;
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
     * [KO] 언리얼 엔진 5 표준 타일 개수 클램핑 헬퍼 (최소 1개, 최대 32개 타일)
     */
    static #clampTileCount(val: number): number {
        return Math.min(32, Math.max(1, Math.round(val)));
    }

    set tileCount(value: number | [number, number]) {
        let tcX = this.#tileCountX;
        let tcZ = this.#tileCountZ;
        if (Array.isArray(value)) {
            tcX = Landscape.#clampTileCount(value[0]);
            tcZ = Landscape.#clampTileCount(value[1]);
        } else if (typeof value === 'number') {
            const count = Landscape.#clampTileCount(value);
            tcX = count;
            tcZ = count;
        }

        if (this.#tileCountX !== tcX || this.#tileCountZ !== tcZ) {
            this.#tileCountX = tcX;
            this.#tileCountZ = tcZ;
            this.#tileSizeX = this.#worldSizeX / tcX;
            this.#tileSizeZ = this.#worldSizeZ / tcZ;
            this.#updateTuples();
            this.#rebuildTiles();
        }
    }

    get tileSize(): [number, number] {
        return this.#tileSizeTuple;
    }

    set material(val: LandscapeMaterial) {
        if (this.#baseMaterial !== val) {
            this.#baseMaterial = val;
            this.#renderPipelineCache.clear();
        }
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
        const combinedIB = sharedGeometry?.combinedIndexBuffer;

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

        const matUniformBG = this.#baseMaterial?.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            renderPassEncoder.setBindGroup(1, matUniformBG);
        }

        renderPassEncoder.setBindGroup(2, storageBG);
        renderPassEncoder.setVertexBuffer(0, combinedVB.gpuBuffer);
        renderPassEncoder.setIndexBuffer(combinedIB.gpuBuffer, 'uint32');

        const renderResults = (view as RenderViewStateData)?.renderResults || (view3D as any)?.renderViewStateData?.renderResults;

        const lodCount = sharedGeometry.lodCount;
        for (let lod = 0; lod < lodCount; lod++) {
            const instanceCount = instanceBuffer.getLODInstanceCount(lod);
            if (instanceCount === 0) continue;

            const lodRange = sharedGeometry.getLODRange(lod);
            const firstInstance = instanceBuffer.getLODFirstInstance(lod);

            renderPassEncoder.drawIndexed(
                lodRange.indexCount,
                instanceCount,
                lodRange.firstIndex,
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
        this.#tileCountTuple[0] = this.#tileCountX;
        this.#tileCountTuple[1] = this.#tileCountZ;
        this.#tileSizeTuple[0] = this.#tileSizeX;
        this.#tileSizeTuple[1] = this.#tileSizeZ;
    }

    #getOrCreateRenderPipeline(geom: any, storageBGLayout: GPUBindGroupLayout): GPURenderPipeline | null {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const material = this.#baseMaterial;
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

    get gridSize(): number {
        return this.#gridSize;
    }

    set gridSize(value: number) {
        if (value > 0 && this.#gridSize !== value) {
            this.#gridSize = value;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                value,
                this.#lodCount
            );
            this.#rebuildTiles();
        }
    }

    get lodCount(): number {
        return this.#lodCount;
    }

    set lodCount(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#lodCount !== count) {
            this.#lodCount = count;
            this.#lodCountsBuffer = new Int32Array(count);
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.#redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                this.#gridSize,
                count
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    #rebuildLODStructures(userColors?: string[], userMultipliers?: number[], userDistances?: number[]): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        for (let i = 0; i < this.#lodCount; i++) {
            this.#lodColorsRGBA.push(DEFAULT_LOD_COLORS[i % DEFAULT_LOD_COLORS.length]);
        }

        const defaultMultipliers = [1.0, 2.0, 3.5, 6.0, 9.5, 14.0, 20.0];
        const multipliers = userMultipliers ?? defaultMultipliers;

        for (let i = 0; i < this.#lodCount - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.0 * Math.pow(1.8, i)));
        }

        if (userDistances && userDistances.length > 0) {
            this.#lodDistancesSq = userDistances.map(d => d * d);
        } else {
            this.#updateLODDistances();
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

    set lodColoration(value: boolean) {
        if (this.#lodColoration !== value) {
            this.#lodColoration = value;
        }
    }

    get material(): LandscapeMaterial {
        return this.#baseMaterial;
    }

    #rebuildTiles(): void {
        this.#spatialGrid = new LandscapeSpatialGrid(this.#tileCountX, this.#tileCountZ, this.#tileSizeX, this.#tileSizeZ);
        this.#sharedGeometry.updateTileSize(this.#tileSizeX, this.#tileSizeZ);
        this.#updateLODDistances();
        this.#renderPipelineCache.clear();

        const halfSizeX = this.#worldSizeX / 2;
        const halfSizeZ = this.#worldSizeZ / 2;
        const tileCountX = this.#tileCountX;
        const tileCountZ = this.#tileCountZ;
        const tileSizeX = this.#tileSizeX;
        const tileSizeZ = this.#tileSizeZ;
        const targetCount = tileCountX * tileCountZ;

        if (this.#instanceBuffer.maxTileCount < targetCount || this.#instanceBuffer.lodCount !== this.#lodCount) {
            this.#instanceBuffer.destroy();
            this.#instanceBuffer = new LandscapeInstanceBuffer(this.#redGPUContext, targetCount, this.#lodCount);
        }

        while (this.#components.length > targetCount) {
            this.#components.pop();
        }

        let index = 0;
        for (let row = 0; row < tileCountZ; row++) {
            for (let col = 0; col < tileCountX; col++) {
                const posX = col * tileSizeX - halfSizeX + tileSizeX / 2;
                const posZ = row * tileSizeZ - halfSizeZ + tileSizeZ / 2;

                if (index < this.#components.length) {
                    const comp = this.#components[index];
                    comp.worldX = posX;
                    comp.worldZ = posZ;
                    comp.componentX = col;
                    comp.componentZ = row;
                    comp.updateSharedGeometry(this.#sharedGeometry);
                    this.#spatialGrid.registerTile(row, col, comp);
                } else {
                    const comp = new LandscapeComponent(
                        this.#redGPUContext,
                        this.#sharedGeometry,
                        posX,
                        posZ,
                        this.#baseMaterial,
                        this.#wireframe,
                        col,
                        row
                    );
                    this.#components.push(comp);
                    this.#spatialGrid.registerTile(row, col, comp);
                }
                index++;
            }
        }
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

    get components(): LandscapeComponent[] {
        return this.#components;
    }
}

export default Landscape;
