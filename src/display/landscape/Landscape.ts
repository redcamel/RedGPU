import RedGPUContext from "../../context/RedGPUContext";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import Mesh from "../mesh/Mesh";
import LandscapeComponent from "./LandscapeComponent";
import LandscapeOptions from "./LandscapeOptions";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";
import LandscapeSpatialGrid from "./LandscapeSpatialGrid";

/**
 * [KO] SpatialGrid $O(1)$ 공간 변환 및 동적 LOD 처리 기반 Landscape 지형 시스템 클래스입니다.
 * [EN] Landscape terrain system class based on SpatialGrid O(1) spatial transformation and dynamic LOD processing.
 */
export class Landscape extends Mesh {
    #sharedGeometry: LandscapeSharedGeometry;
    #spatialGrid: LandscapeSpatialGrid;
    #components: LandscapeComponent[] = [];
    #lodDistancesSq: number[] = [];
    #lodMaterials: ColorMaterial[] = [];
    #baseMaterial: ColorMaterial;

    #wireframe: boolean = false;
    #debugLODColorMode: boolean = false;
    #tileSize: number;
    #tileCount: number;
    #lodCount: number;

    // 매 프레임 카메라 Cell 계산용 재사용 버퍼 (Zero-GC)
    #tempCellBuffer: Int32Array = new Int32Array(2);

    /**
     * [KO] Landscape 인스턴스를 생성합니다.
     * [EN] Creates an instance of Landscape.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param options - [KO] Landscape 설정 옵션 [EN] Landscape configuration options
     */
    constructor(redGPUContext: RedGPUContext, options: LandscapeOptions = {}) {
        const tileCount = options.tileCount ?? 4;
        const tileSize = options.tileSize ?? 1000;
        const gridSize = options.gridSize ?? 64;
        const lodCount = options.lodCount ?? 4;

        // 1. 지형 공유 지오메트리 사전 생성 (LOD 0: gridSize -> LOD N: 1/2씩 감축)
        const sharedGeometry = new LandscapeSharedGeometry(redGPUContext, tileSize, gridSize, lodCount);
        const baseMaterial = new ColorMaterial(redGPUContext, '#3a7d44');

        // 메인 컨테이너 역할용 루트 메시 초기화 (자신의 geometry는 null로 세팅하여 중복 렌더링 방지)
        super(redGPUContext, null, baseMaterial);

        // 2. 2D SpatialGrid 공간 관할 객체 생성
        this.#spatialGrid = new LandscapeSpatialGrid(tileCount, tileSize);
        this.#sharedGeometry = sharedGeometry;
        this.#baseMaterial = baseMaterial;
        this.#tileCount = tileCount;
        this.#tileSize = tileSize;
        this.#lodCount = lodCount;
        this.#wireframe = options.wireframe ?? false;
        this.#debugLODColorMode = options.debugLODColorMode ?? false;

        // 3. LOD 시각화 팔레트 사전 할당 (Zero-GC)
        const defaultColors = [
            '#00ff00', // LOD 0: 초록 (고해상도)
            '#ffff00', // LOD 1: 노랑
            '#ff8800', // LOD 2: 주황
            '#ff0000', // LOD 3: 빨강 (저해상도)
            '#8800ff', // LOD 4: 보라
            '#00ffff'  // LOD 5+: 청록
        ];

        for (let i = 0; i < lodCount; i++) {
            const colorHex = defaultColors[i % defaultColors.length];
            const mat = new ColorMaterial(redGPUContext, colorHex);
            this.#lodMaterials.push(mat);
        }

        // 4. LOD 전환 임계 거리 제곱 배열 산출
        const defaultDistances = [600, 1200, 2000, 3200, 5000];
        const userDistances = options.lodDistances ?? defaultDistances;

        for (let i = 0; i < lodCount - 1; i++) {
            const dist = userDistances[i] ?? (600 * Math.pow(2, i));
            this.#lodDistancesSq.push(dist * dist);
        }

        // 5. SpatialGrid 및 타일(LandscapeComponent) 격자 배치 생성
        const halfSize = (tileCount * tileSize) / 2;
        for (let row = 0; row < tileCount; row++) {
            for (let col = 0; col < tileCount; col++) {
                const posX = col * tileSize - halfSize + tileSize / 2;
                const posZ = row * tileSize - halfSize + tileSize / 2;

                const comp = new LandscapeComponent(
                    redGPUContext,
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
     * [KO] 전체 지형 타일 리스트를 반환합니다.
     * [EN] Returns the list of all terrain components.
     */
    public get components(): LandscapeComponent[] {
        return this.#components;
    }
}

export default Landscape;
