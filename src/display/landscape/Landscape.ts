import RedGPUContext from "../../context/RedGPUContext";
import LANDSCAPE_BASE_GRID_SIZE from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeInstanceBuffer from "./LandscapeInstanceBuffer";
import LandscapeMaterial from "./LandscapeMaterial";
import LandscapeOptions from "./LandscapeOptions";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";

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

    // 매 프레임 카메라 Cell 및 LOD 카운팅 재사용 버퍼 (Zero-GC)
    #tempCellBuffer: Int32Array = new Int32Array(2);
    #lodCountsBuffer: Int32Array;

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

        this.#lodCountsBuffer = new Int32Array(lodCount);

        // WebGPU Multi-LOD Indirect & Instance Buffer 생성
        this.#instanceBuffer = new LandscapeInstanceBuffer(redGPUContext, tileCountX * tileCountZ, lodCount);

        this.#rebuildLODStructures(options.lodColors, options.lodMultipliers, options.lodDistances);
        this.#rebuildTiles();
    }

    /** [KO] RedGPUContext 인스턴스를 반환합니다. */
    public get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] LOD 팔레트 및 거리 임계 배열 재구축 헬퍼
     */
    #rebuildLODStructures(userColors?: string[], userMultipliers?: number[], userDistances?: number[]): void {
        this.#lodColorsRGBA.length = 0;
        this.#lodMultipliers.length = 0;

        const defaultColors: [number, number, number, number][] = [
            [0.18, 0.8, 0.44, 1.0],  // LOD 0: Green
            [0.95, 0.77, 0.06, 1.0], // LOD 1: Yellow
            [0.9, 0.49, 0.13, 1.0],  // LOD 2: Orange
            [0.91, 0.3, 0.24, 1.0],  // LOD 3: Red
            [0.61, 0.35, 0.71, 1.0], // LOD 4: Purple
            [0.1, 0.74, 0.61, 1.0],  // LOD 5: Cyan
            [0.2, 0.6, 0.86, 1.0],   // LOD 6: Blue
            [0.93, 0.94, 0.95, 1.0]  // LOD 7: White
        ];

        for (let i = 0; i < this.#lodCount; i++) {
            this.#lodColorsRGBA.push(defaultColors[i % defaultColors.length]);
        }

        const defaultMultipliers = [1.25, 2.5, 4.25, 7.0, 11.0, 16.0, 24.0];
        const multipliers = userMultipliers ?? defaultMultipliers;

        for (let i = 0; i < this.#lodCount - 1; i++) {
            this.#lodMultipliers.push(multipliers[i] ?? (1.25 * Math.pow(1.8, i)));
        }

        if (userDistances && userDistances.length > 0) {
            this.#lodDistancesSq = userDistances.map(d => d * d);
        } else {
            this.#updateLODDistances();
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

    public get worldSize(): [number, number] {
        return [this.#worldSizeX, this.#worldSizeZ];
    }

    public set worldSize(value: number | [number, number]) {
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
            this.#rebuildTiles();
        }
    }

    public get tileCount(): [number, number] {
        return [this.#tileCountX, this.#tileCountZ];
    }

    public set tileCount(value: number | [number, number]) {
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
            this.#rebuildTiles();
        }
    }

    public get gridSize(): number {
        return this.#gridSize;
    }

    public set gridSize(value: number) {
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

    public get lodCount(): number {
        return this.#lodCount;
    }

    public set lodCount(value: number) {
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

    public get tileSize(): [number, number] {
        return [this.#tileSizeX, this.#tileSizeZ];
    }

    public get wireframe(): boolean {
        return this.#wireframe;
    }

    public set wireframe(value: boolean) {
        if (this.#wireframe !== value) {
            this.#wireframe = value;
            const count = this.#components.length;
            for (let i = 0; i < count; i++) {
                this.#components[i].wireframe = value;
            }
        }
    }

    /**
     * [KO] 언리얼 엔진 5 표준 Landscape LOD Coloration 디버그 뷰 모드 활성화 여부
     * [EN] UE5 standard Landscape LOD Coloration debug view mode enabled state
     */
    public get lodColoration(): boolean {
        return this.#lodColoration;
    }

    public set lodColoration(value: boolean) {
        if (this.#lodColoration !== value) {
            this.#lodColoration = value;
        }
    }

    public get material(): LandscapeMaterial {
        return this.#baseMaterial;
    }

    public set material(val: LandscapeMaterial) {
        this.#baseMaterial = val;
        const count = this.#components.length;
        for (let i = 0; i < count; i++) {
            this.#components[i].material = val;
        }
    }

    /** [KO] GPU Indirect Buffer 객체를 반환합니다. */
    public get instanceBuffer(): LandscapeInstanceBuffer {
        return this.#instanceBuffer;
    }

    public get sharedGeometry(): LandscapeSharedGeometry {
        return this.#sharedGeometry;
    }

    /**
     * [KO] 언리얼 엔진 5 표준 타일 개수 클램핑 헬퍼 (최소 1개, 최대 32개 타일)
     */
    static #clampTileCount(val: number): number {
        return Math.min(32, Math.max(1, Math.round(val)));
    }

    /**
     * [KO] 매 프레임 카메라 위치 기반으로 SpatialGrid 셀 탐색 및 LOD 레벨별 인스턴스 StorageBuffer를 정렬 업데이트합니다 (Zero-GC 최적화).
     * [EN] Updates per-tile LOD and instance StorageBuffer sorted by LOD in Multi-LOD Batching via SpatialGrid cell exploration based on camera position every frame (Zero-GC optimized).
     *
     * @param camera - [KO] 현재 뷰의 카메라 객체 [EN] Current view camera object
     */
    public update(camera: any): void {
        if (!camera) return;

        const camX = camera.x ?? 0;
        const camY = camera.y ?? 0;
        const camZ = camera.z ?? 0;

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
            const dx = comp.x - camX;
            const dz = comp.z - camZ;
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

        // 3. 패스: LOD 그룹별로 정렬하여 인스턴스 데이터 작성 (Zero-GC)
        for (let i = 0; i < count; i++) {
            const comp = components[i];
            const activeLOD = comp.lodLevel;

            // UE5 표준 lodColoration 디버그 색상 결정
            const colorRGBA = this.#lodColoration
                ? this.#lodColorsRGBA[activeLOD]
                : [0.22, 0.49, 0.26, 1.0];

            instanceBuf.writeLODInstanceData(
                activeLOD,
                comp.x,
                comp.z,
                colorRGBA[0],
                colorRGBA[1],
                colorRGBA[2],
                colorRGBA[3]
            );
        }

        // 4. GPU 버퍼 동기화 제출
        instanceBuf.flushToGPU();
    }

    #rebuildTiles(): void {
        this.#spatialGrid = new LandscapeSpatialGrid(this.#tileCountX, this.#tileCountZ, this.#tileSizeX, this.#tileSizeZ);
        this.#sharedGeometry.updateTileSize(this.#tileSizeX, this.#tileSizeZ);
        this.#updateLODDistances();

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
                    comp.x = posX;
                    comp.z = posZ;
                    comp.updateSharedGeometry(this.#sharedGeometry);
                    this.#spatialGrid.registerTile(row, col, comp);
                } else {
                    const comp = new LandscapeComponent(
                        this.#redGPUContext,
                        this.#sharedGeometry,
                        posX,
                        posZ,
                        this.#baseMaterial,
                        this.#wireframe
                    );
                    this.#components.push(comp);
                    this.#spatialGrid.registerTile(row, col, comp);
                }
                index++;
            }
        }
    }

    public get spatialGrid(): LandscapeSpatialGrid {
        return this.#spatialGrid;
    }

    public get components(): LandscapeComponent[] {
        return this.#components;
    }
}

export default Landscape;
