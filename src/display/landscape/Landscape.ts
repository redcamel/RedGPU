import RedGPUContext from "../../context/RedGPUContext.js";
import Ground from "../../primitive/Ground.js";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial.js";
import InstancingMesh from "../instancingMesh/InstancingMesh.js";
import {LandscapeLODManager} from "./core/LandscapeLODManager.js";

export interface LandscapeOptions {
    worldSize?: number;
    chunkSize?: number;
    maxLOD?: number;
    maxChunks?: number;
}

// LOD Level별 디버그 와이어프레임 색상 표 (LOD 0 = 빨강 ~ LOD 5+ = 보라)
const LOD_COLORS: string[] = [
    '#ff3333', // LOD 0: Red (가장 촘촘함)
    '#ff9933', // LOD 1: Orange
    '#ffff33', // LOD 2: Yellow
    '#33ff33', // LOD 3: Green
    '#3399ff', // LOD 4: Blue
    '#cc33ff', // LOD 5: Purple
    '#ff33cc', // LOD 6+
];

/**
 * [KO] Landscape (신규 지형 시스템 디스플레이 클래스)
 * [EN] Landscape (New Terrain System Display Class)
 *
 * 카메라 위치 변화에 따라 LandscapeLODManager를 호출하여 지오메트리 청크 그리드의 LOD 분할 및 조성을 제어하고,
 * LOD 레벨별 색상이 다변화된 InstancingMesh 레이어를 통해 와이어프레임 지오메트리를 시각화합니다.
 */
export class Landscape {
    readonly lodManager: LandscapeLODManager;
    #lodMeshes: InstancingMesh[] = [];
    #lodChunkCounts: Int32Array;
    #lodCursorIndex: Int32Array;
    #redGPUContext: RedGPUContext | null = null;

    constructor(redGPUContext?: RedGPUContext, options: LandscapeOptions = {}) {
        const {
            worldSize = 10000.0,
            chunkSize = 64.0,
            maxLOD = 5,
            maxChunks = 2048
        } = options;

        this.lodManager = new LandscapeLODManager(worldSize, chunkSize, maxLOD, maxChunks);
        this.#lodChunkCounts = new Int32Array(maxLOD + 2);
        this.#lodCursorIndex = new Int32Array(maxLOD + 2);

        if (redGPUContext) {
            this.initMesh(redGPUContext);
        }
    }

    get meshes(): InstancingMesh[] {
        return this.#lodMeshes;
    }

    /**
     * [KO] RedGPUContext를 주입받아 LOD 레벨별 InstancingMesh 레이어를 생성합니다.
     */
    initMesh(redGPUContext: RedGPUContext): void {
        this.#redGPUContext = redGPUContext;
        this.#lodMeshes = [];

        const maxLOD = this.lodManager.maxLOD;

        // 1. 단일 청크 단위 지오메트리 (1x1 크기 Unit Mesh, 16x16 세분화)
        const geometry = new Ground(
            redGPUContext,
            1.0,
            1.0,
            16,
            16
        );

        // 2. LOD 레벨별 InstancingMesh 레이어 구별 생성
        for (let lod = 0; lod <= maxLOD; lod++) {
            const colorHex = LOD_COLORS[lod] || '#ffffff';
            const material = new ColorMaterial(redGPUContext, colorHex);

            const mesh = new InstancingMesh(
                redGPUContext,
                this.lodManager.maxChunks,
                1,
                geometry,
                material
            );
            mesh.primitiveState.topology = 'line-list';
            this.#lodMeshes.push(mesh);
        }
    }

    /**
     * [KO] 매 프레임 카메라 위치 정보를 바탕으로 지형 청크 LOD 상태 및 LOD 레벨별 렌더 메쉬를 갱신합니다. (2-Pass GC-Free)
     */
    update(cameraPosition: { x: number; y: number; z: number } | number[] | Float32Array): void {
        let camX = 0, camY = 0, camZ = 0;

        if (Array.isArray(cameraPosition) || cameraPosition instanceof Float32Array) {
            camX = cameraPosition[0] || 0;
            camY = cameraPosition[1] || 0;
            camZ = cameraPosition[2] || 0;
        } else if (cameraPosition && typeof cameraPosition === 'object') {
            camX = cameraPosition.x || 0;
            camY = cameraPosition.y || 0;
            camZ = cameraPosition.z || 0;
        }

        // 1. LOD Manager 계산 (GC-Free)
        this.lodManager.update(camX, camY, camZ);

        if (this.#lodMeshes.length === 0) return;

        const activeCount = this.lodManager.activeChunkCount;
        const buffer = this.lodManager.instanceBuffer;
        const maxLOD = this.lodManager.maxLOD;

        // [Pass 1] 각 LOD 레벨별 총 청크 수 집계
        this.#lodChunkCounts.fill(0);
        for (let i = 0; i < activeCount; i++) {
            const offset = i * 4;
            const lodLevel = Math.min(Math.floor(buffer[offset + 3]), maxLOD);
            this.#lodChunkCounts[lodLevel]++;
        }

        // [Pass 2] InstancingMesh의 instanceCount 사전 세팅 (자식 인스턴스 배열 크기 확정)
        for (let lod = 0; lod <= maxLOD; lod++) {
            const mesh = this.#lodMeshes[lod];
            if (mesh) {
                mesh.instanceCount = Math.max(0, this.#lodChunkCounts[lod]);
            }
        }

        // [Pass 3] 사전 확정된 instanceChildren 배열에 Transform 안전 설정 (GC-Free)
        this.#lodCursorIndex.fill(0);
        for (let i = 0; i < activeCount; i++) {
            const offset = i * 4;
            const posX = buffer[offset];
            const posZ = buffer[offset + 1];
            const scale = buffer[offset + 2];
            const lodLevel = Math.min(Math.floor(buffer[offset + 3]), maxLOD);

            const mesh = this.#lodMeshes[lodLevel];
            if (mesh) {
                const curIdx = this.#lodCursorIndex[lodLevel];
                const child = mesh.instanceChildren[curIdx];
                if (child) {
                    child.setPosition(posX, 0, posZ);
                    child.setScale(scale);
                }
                this.#lodCursorIndex[lodLevel]++;
            }
        }
    }
}
