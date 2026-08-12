/**
 * [KO] LandscapeLODManager
 * [EN] LandscapeLODManager
 *
 * 카메라 위치 및 시야 조건에 따라 Landscape 청크들의 LOD 단계와 위치/스케일을 실시간 계산합니다.
 * 매 프레임 실행 시 가비지 컬렉션(GC) 부하를 방지하기 위해 Pre-allocated TypedArray 버퍼를 재사용합니다.
 */
export class LandscapeLODManager {
    // -------------------------------------------------------------------------
    readonly maxChunks: number;
    readonly instanceBuffer: Float32Array; // Stride = 4: [x, z, scale, lodLevel]
    activeChunkCount: number = 0;
    #worldSize: number;

    // -------------------------------------------------------------------------
    // Pre-allocated Buffer & State (GC-Free)
    #chunkSize: number;
    #maxLOD: number;
    #lodDistanceRatio: number;
    // Pre-calculated LOD Threshold Distances (Squared Distances for Fast Check)
    #lodThresholdSq: Float32Array;

    constructor(
        worldSize: number = 10000.0,
        chunkSize: number = 64.0,
        maxLOD: number = 5,
        maxChunks: number = 2048,
        lodDistanceRatio: number = 1.5
    ) {
        this.#worldSize = worldSize;
        this.#chunkSize = chunkSize;
        this.#maxLOD = maxLOD;
        this.maxChunks = maxChunks;
        this.#lodDistanceRatio = lodDistanceRatio;

        // Stride = 4 [x, z, scale, lodLevel]
        this.instanceBuffer = new Float32Array(this.maxChunks * 4);

        // Pre-allocate LOD Threshold Distance Array
        this.#lodThresholdSq = new Float32Array(this.#maxLOD + 1);
        this.updateLODThresholds();
    }

    // -------------------------------------------------------------------------
    // Reactive Properties (Getter / Setter)
    // -------------------------------------------------------------------------
    get worldSize(): number {
        return this.#worldSize;
    }

    set worldSize(value: number) {
        if (this.#worldSize === value) return;
        this.#worldSize = value;
        this.updateLODThresholds();
    }

    get chunkSize(): number {
        return this.#chunkSize;
    }

    set chunkSize(value: number) {
        if (this.#chunkSize === value) return;
        this.#chunkSize = value;
        this.updateLODThresholds();
    }

    get maxLOD(): number {
        return this.#maxLOD;
    }

    set maxLOD(value: number) {
        if (this.#maxLOD === value) return;
        this.#maxLOD = value;
        this.#lodThresholdSq = new Float32Array(this.#maxLOD + 1);
        this.updateLODThresholds();
    }

    get lodDistanceRatio(): number {
        return this.#lodDistanceRatio;
    }

    set lodDistanceRatio(value: number) {
        if (this.#lodDistanceRatio === value) return;
        this.#lodDistanceRatio = value;
        this.updateLODThresholds();
    }

    /**
     * [KO] LOD 레벨별 임계 거리를 수학적 노드 스케일(worldSize / 2^(maxLOD - lod))에 기반하여 계산합니다.
     * [EN] Pre-calculates threshold distances based on mathematical node scale (worldSize / 2^(maxLOD - lod)).
     */
    updateLODThresholds(): void {
        for (let lod = 0; lod <= this.#maxLOD; lod++) {
            // 해당 LOD 레벨에서의 실제 노드 월드 크기
            const nodeSizeAtLOD = this.#worldSize / Math.pow(2, this.#maxLOD - lod);
            const dist = nodeSizeAtLOD * this.#lodDistanceRatio;
            this.#lodThresholdSq[lod] = dist * dist;
        }
    }

    /**
     * [KO] 카메라 위치에 따라 청크 그리드 LOD를 재평가하고 instanceBuffer에 저장합니다.
     * [EN] Re-evaluates chunk grid LOD based on camera position and writes results to instanceBuffer.
     *
     * @param camX 카메라 X 좌표
     * @param camY 카메라 Y 좌표
     * @param camZ 카메라 Z 좌표
     */
    update(camX: number, camY: number, camZ: number): void {
        this.activeChunkCount = 0;

        const halfWorld = this.#worldSize * 0.5;
        // 루트 노드 평가부터 시작 (쿼드트리 동적 순회)
        this.#evaluateQuad(
            -halfWorld, -halfWorld,
            this.#worldSize,
            this.#maxLOD,
            camX, camY, camZ
        );
    }

    /**
     * [KO] 쿼드트리 재귀 순회 평가 (3D 공간 거리 및 수학적 스케일 기반)
     * [EN] Quadtree recursive evaluation based on 3D spatial distance and mathematical scale.
     */
    #evaluateQuad(
        nodeX: number, nodeZ: number,
        nodeSize: number,
        currentLOD: number,
        camX: number, camY: number, camZ: number
    ): void {
        if (this.activeChunkCount >= this.maxChunks) return;

        // 청크 중심 좌표 (지형 평면 Y = 0)
        const centerX = nodeX + nodeSize * 0.5;
        const centerY = 0.0;
        const centerZ = nodeZ + nodeSize * 0.5;

        // 카메라와의 3D 공간 제곱 거리
        const dx = camX - centerX;
        const dy = camY - centerY;
        const dz = camZ - centerZ;
        const distSq = dx * dx + dy * dy + dz * dz;

        // 세분화(Subdivision) 조건 검사
        // currentLOD가 0보다 크고, 거리가 해당 LOD 임계거리보다 가까운 경우 4개의 자식 노드로 분할
        const thresholdSq = this.#lodThresholdSq[currentLOD - 1];
        if (currentLOD > 0 && distSq < thresholdSq) {
            const halfSize = nodeSize * 0.5;
            const nextLOD = currentLOD - 1;

            // 4개 자식 Quadrant 순회
            this.#evaluateQuad(nodeX, nodeZ, halfSize, nextLOD, camX, camY, camZ);
            this.#evaluateQuad(nodeX + halfSize, nodeZ, halfSize, nextLOD, camX, camY, camZ);
            this.#evaluateQuad(nodeX, nodeZ + halfSize, halfSize, nextLOD, camX, camY, camZ);
            this.#evaluateQuad(nodeX + halfSize, nodeZ + halfSize, halfSize, nextLOD, camX, camY, camZ);
        } else {
            // 더 이상 분할하지 않고 현재 노드를 렌더링 청크로 확정
            const offset = this.activeChunkCount * 4;
            const scale = nodeSize; // Unit Mesh(1x1) 기준 nodeSize 크기로 직접 스케일 적용

            this.instanceBuffer[offset] = centerX;
            this.instanceBuffer[offset + 1] = centerZ;
            this.instanceBuffer[offset + 2] = scale;
            this.instanceBuffer[offset + 3] = currentLOD;

            this.activeChunkCount++;
        }
    }
}
