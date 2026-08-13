import RedGPUContext from "../../context/RedGPUContext";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import ABaseMaterial from "../../material/core/ABaseMaterial";
import Mesh from "../mesh/Mesh";
import LANDSCAPE_BASE_GRID_SIZE from "./LANDSCAPE_BASE_GRID_SIZE";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeOptions from "./LandscapeOptions";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";

/**
 * [KO] SpatialGrid $O(1)$ 공간 변환 및 언리얼 엔진 5 규격 파라미터 제어 기반 Landscape 지형 시스템 클래스입니다.
 * [EN] Landscape terrain system class based on SpatialGrid O(1) spatial transformation and Unreal Engine 5 spec parameter controls.
 */
export class Landscape extends Mesh {
    #sharedGeometry: LandscapeSharedGeometry;
    #spatialGrid: LandscapeSpatialGrid;
    #components: LandscapeComponent[] = [];
    #lodDistancesSq: number[] = [];
    #lodMultipliers: number[] = [];
    #lodMaterials: ColorMaterial[] = [];
    #baseMaterial: ABaseMaterial;

    #wireframe: boolean = false;
    #debugLODColorMode: boolean = false;

    #worldSizeX: number;
    #worldSizeZ: number;
    #tileCountX: number;
    #tileCountZ: number;
    #tileSizeX: number;
    #tileSizeZ: number;
    #lodCount: number;
    #gridSize: number;

    // 매 프레임 카메라 Cell 계산용 재사용 버퍼 (Zero-GC)
    #tempCellBuffer: Int32Array = new Int32Array(2);

    /**
     * [KO] Landscape 인스턴스를 생성합니다 (언리얼 엔진 5 공식 기본값: worldSize 8000m, tileCount 8x8, gridSize 63 [63x63 Quads, 4096 Vertices], lodCount 4).
     * [EN] Creates an instance of Landscape (Unreal Engine 5 official defaults: worldSize 8000m, tileCount 8x8, gridSize 63 [63x63 Quads, 4096 Vertices], lodCount 4).
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param options - [KO] Landscape 설정 옵션 [EN] Landscape configuration options
     */
    constructor(redGPUContext: RedGPUContext, options: LandscapeOptions = {}) {
        // 1. worldSize, tileCount, tileSize 파라미터 [X, Z] 파싱 및 언리얼 5 공식 기본값 적용 (8000m, 8x8)
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

        // 언리얼 엔진 5 공식 정석 베이스 쿼드 기본값: LANDSCAPE_BASE_GRID_SIZE.QUAD_63 (63x63 Quads)
        const gridSize = options.gridSize ?? LANDSCAPE_BASE_GRID_SIZE.QUAD_63;
        const lodCount = Math.min(8, Math.max(1, options.lodCount ?? 4));

        // 2. 기본 머티리얼 옵션 수용 (옵션 미지정 시 기본 ColorMaterial 자동 할당)
        const baseMaterial = options.material || new ColorMaterial(redGPUContext, '#3a7d44');

        // 3. 지형 공유 지오메트리 사전 생성 (LOD 0: gridSize -> LOD N: 1/2씩 감축)
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSizeX, tileSizeZ, gridSize, lodCount);

        // 메인 컨테이너 역할용 루트 메시 초기화 (자신의 geometry는 null로 세팅하여 중복 렌더링 방지)
        super(redGPUContext, null, baseMaterial);

        // 4. 2D SpatialGrid 공간 관할 객체 생성
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
        this.#debugLODColorMode = options.debugLODColorMode ?? false;

        // 5. LOD 시각화 팔레트 및 배율 초기화
        this.#rebuildLODStructures(options.lodColors, options.lodMultipliers, options.lodDistances);

        // 6. SpatialGrid 및 타일(LandscapeComponent) 격자 배치 생성
        this.#rebuildTiles();
    }

    /**
     * [KO] 전체 지형의 월드 공간 크기를 반환하거나 동적 변경합니다 (단일 수치 또는 [worldSizeX, worldSizeZ]).
     * [EN] Gets or sets the world space size of the entire terrain dynamically (single number or [worldSizeX, worldSizeZ]).
     */
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

    /**
     * [KO] 가로/세로 타일 개수를 반환하거나 동적 변경합니다 (언리얼 엔진 5 표준: 최소 1개 ~ 최대 32개 안전 클램핑 적용).
     * [EN] Gets or sets the number of tiles along width/height dynamically (Unreal Engine 5 standard: min 1 to max 32 safe clamping).
     */
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

    /**
     * [KO] 매 프레임 카메라 위치 기반으로 SpatialGrid 셀 탐색 및 타일별 LOD/색상을 업데이트합니다 (Zero-GC 최적화).
     * [EN] Updates per-tile LOD and debug color via SpatialGrid cell exploration based on camera position every frame (Zero-GC optimized).
     *
     * @param camera - [KO] 현재 뷰의 카메라 객체 [EN] Current view camera object
     */
    public update(camera: any): void {
        if (!camera) return;

        const camX = camera.x ?? 0;
        const camY = camera.y ?? 0;
        const camZ = camera.z ?? 0;

        // 1. 카메라 좌표가 속한 SpatialGrid 2D 셀 좌표 $O(1)$ 산출
        this.#spatialGrid.getCellCoordinates(camX, camZ, this.#tempCellBuffer);

        // 2. Y축 높이 차이 제곱값은 루프 밖에서 1회만 계산 (중복 계산 제거 최적화)
        const camYSq = camY * camY;

        // 3. SpatialGrid 타일들의 거리 기반 LOD 레벨 갱신 (Zero-GC)
        const components = this.#spatialGrid.flatCells;
        const count = components.length;
        const distSqList = this.#lodDistancesSq;
        const lodLimit = distSqList.length;

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

            if (comp.lodLevel !== lod) {
                comp.lodLevel = lod;
                if (this.#debugLODColorMode) {
                    comp.material = this.#lodMaterials[Math.min(lod, this.#lodMaterials.length - 1)];
                }
            }
        }
    }

    /**
     * [KO] 타일당 최고 LOD 쿼드 해상도를 반환하거나 동적으로 변경합니다 (LANDSCAPE_BASE_GRID_SIZE).
     * [EN] Gets or sets the base grid quad resolution per tile dynamically (LANDSCAPE_BASE_GRID_SIZE).
     */
    public get gridSize(): number {
        return this.#gridSize;
    }

    public set gridSize(value: number) {
        if (value > 0 && this.#gridSize !== value) {
            this.#gridSize = value;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                value,
                this.#lodCount
            );
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 지형의 최고 LOD 단계 수를 반환하거나 동적으로 변경합니다 (최소 1단계 ~ 최대 8단계).
     * [EN] Gets or sets the maximum number of LOD levels dynamically (min 1 to max 8 levels).
     */
    public get lodCount(): number {
        return this.#lodCount;
    }

    public set lodCount(value: number) {
        const count = Math.min(8, Math.max(1, Math.round(value)));
        if (this.#lodCount !== count) {
            this.#lodCount = count;
            this.#sharedGeometry = new LandscapeSharedGeometry(
                this.redGPUContext,
                this.#tileSizeX,
                this.#tileSizeZ,
                this.#gridSize,
                count
            );
            this.#rebuildLODStructures();
            this.#rebuildTiles();
        }
    }

    /**
     * [KO] 언리얼 엔진 5 표준 타일 개수 클램핑 헬퍼 (최소 1개, 최대 32개 타일)
     */
    static #clampTileCount(val: number): number {
        return Math.min(32, Math.max(1, Math.round(val)));
    }

    /**
     * [KO] LOD 팔레트 및 거리 임계 배열 재구축 헬퍼
     */
    #rebuildLODStructures(userColors?: string[], userMultipliers?: number[], userDistances?: number[]): void {
        this.#lodMaterials.length = 0;
        this.#lodMultipliers.length = 0;

        const defaultColors = [
            '#00ff00', // LOD 0: 초록
            '#ffff00', // LOD 1: 노랑
            '#ff8800', // LOD 2: 주황
            '#ff0000', // LOD 3: 빨강
            '#8800ff', // LOD 4: 보라
            '#00ffff', // LOD 5: 청록
            '#ff00ff', // LOD 6: 마젠타
            '#ffffff'  // LOD 7: 흰색
        ];
        const colors = userColors ?? defaultColors;

        for (let i = 0; i < this.#lodCount; i++) {
            const colorHex = colors[i % colors.length];
            this.#lodMaterials.push(new ColorMaterial(this.redGPUContext, colorHex));
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

    /**
     * [KO] tileSize 비례 상대적 LOD 제곱 임계 거리 계산 (Math.max 기준 보정)
     */
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
     * [KO] 타일 위치 배치 및 SpatialGrid 등록/지오메트리 갱신 전파 로직
     */
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

        while (this.#components.length > targetCount) {
            const comp = this.#components.pop();
            if (comp) this.removeChild(comp);
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
                        this.redGPUContext,
                        this.#sharedGeometry,
                        posX,
                        posZ,
                        this.#debugLODColorMode ? this.#lodMaterials[0] : this.#baseMaterial,
                        this.#wireframe
                    );
                    this.#components.push(comp);
                    this.#spatialGrid.registerTile(row, col, comp);
                    this.addChild(comp);
                }
                index++;
            }
        }
    }

    /**
     * [KO] 단일 타일 크기를 반환합니다 (언리얼 엔진 5 표준: [tileSizeX, tileSizeZ] 파생 읽기 전용 값).
     * [EN] Returns the size of a single tile (Unreal Engine 5 standard: derived readonly value of [tileSizeX, tileSizeZ]).
     */
    public get tileSize(): [number, number] {
        return [this.#tileSizeX, this.#tileSizeZ];
    }

    /**
     * [KO] 와이어프레임 렌더링 모드 설정 (모든 타일 자식 노드에 전파)
     * [EN] Sets wireframe rendering mode (propagates to all child tile components)
     */
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
     * [KO] LOD 레벨별 시각화 색상 오버레이 디버그 모드 설정
     * [EN] Sets LOD level color overlay debug mode
     */
    public get debugLODColorMode(): boolean {
        return this.#debugLODColorMode;
    }

    public set debugLODColorMode(value: boolean) {
        if (this.#debugLODColorMode !== value) {
            this.#debugLODColorMode = value;
            const count = this.#components.length;
            for (let i = 0; i < count; i++) {
                const comp = this.#components[i];
                comp.material = value
                    ? this.#lodMaterials[Math.min(comp.lodLevel, this.#lodMaterials.length - 1)]
                    : this.#baseMaterial;
            }
        }
    }

    /**
     * [KO] 2D SpatialGrid 관할 객체를 반환합니다.
     * [EN] Returns the 2D SpatialGrid manager object.
     */
    public get spatialGrid(): LandscapeSpatialGrid {
        return this.#spatialGrid;
    }

    /**
     * [KO] 전체 지형 타일 리스트를 반환합니다.
     * [EN] Returns the list of all terrain components.
     */
    public get components(): LandscapeComponent[] {
        return this.#components;
    }
}

export default Landscape;
