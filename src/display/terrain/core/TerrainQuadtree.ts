/**
 * [KO] CDLOD 쿼드트리 노드 — 지형 가변 그리드 분할의 기본 단위입니다.
 * [EN] CDLOD quadtree node — the basic unit of terrain variable grid subdivision.
 *
 * 좌표계 규칙:
 * - worldOffset/worldScale 은 쿼드트리 로컬 공간 [0, worldSize] 기준입니다.
 * - isInFrustum 에는 worldOffsetX/Z (=terrain.worldOffset) 를 받아 월드 공간으로 변환합니다.
 * - shouldSplit 의 cameraPos 는 쿼드트리 로컬 공간으로 변환된 값을 받습니다.
 *   (Terrain.render 에서 camera.x - terrain.worldOffset[0] 처리 후 전달)
 */
export class QuadtreeNode {
    public children: QuadtreeNode[] = [];
    public hasChildren: boolean = false;

    constructor(
        public worldOffset: [number, number],
        public worldScale: number,
        public lodLevel: number,
        public maxLOD: number
    ) {
        if (this.lodLevel < this.maxLOD) {
            this.hasChildren = true;
            const halfScale = worldScale * 0.5;
            const nextLOD = lodLevel + 1;
            this.children = [
                new QuadtreeNode([worldOffset[0], worldOffset[1]], halfScale, nextLOD, maxLOD),
                new QuadtreeNode([worldOffset[0] + halfScale, worldOffset[1]], halfScale, nextLOD, maxLOD),
                new QuadtreeNode([worldOffset[0], worldOffset[1] + halfScale], halfScale, nextLOD, maxLOD),
                new QuadtreeNode([worldOffset[0] + halfScale, worldOffset[1] + halfScale], halfScale, nextLOD, maxLOD)
            ];
        }
    }

    /**
     * [KO] 노드가 카메라 프러스텀 안에 있는지 Sphere-Plane 검사합니다.
     *      frustumPlanes 는 월드 공간 기준이므로, worldOffsetX/Z 로 로컬→월드 변환합니다.
     * [EN] Tests whether the node is inside the camera frustum (Sphere-Plane test).
     *      frustumPlanes are in world space, so worldOffsetX/Z converts local→world.
     *
     * @param planes        - [KO] 6개의 프러스텀 평면 [EN] Six frustum planes
     * @param minHeight     - [KO] 지형 최소 높이 (Y) [EN] Terrain minimum height (Y)
     * @param maxHeight     - [KO] 지형 최대 높이 (Y) [EN] Terrain maximum height (Y)
     * @param worldOffsetX  - [KO] 지형 X 월드 오프셋 [EN] Terrain world offset X
     * @param worldOffsetZ  - [KO] 지형 Z 월드 오프셋 [EN] Terrain world offset Z
     */
    isInFrustum(
        planes: number[][],
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number,
        worldOffsetZ: number
    ): boolean {
        if (!planes) return true;

        // 로컬 → 월드 변환
        const minX = this.worldOffset[0] + worldOffsetX;
        const maxX = this.worldOffset[0] + this.worldScale + worldOffsetX;
        const minZ = this.worldOffset[1] + worldOffsetZ;
        const maxZ = this.worldOffset[1] + this.worldScale + worldOffsetZ;
        const minY = minHeight;
        const maxY = maxHeight;

        // AABB 중심과 구 반지름 계산
        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;

        const ex = (maxX - minX) * 0.5;
        const ey = (maxY - minY) * 0.5;
        const ez = (maxZ - minZ) * 0.5;
        const radius = Math.sqrt(ex * ex + ey * ey + ez * ez);

        // 6개 평면 모두 통과해야 시야 내부
        for (let i = 0; i < 6; i++) {
            const p = planes[i];
            const dist = p[0] * centerX + p[1] * centerY + p[2] * centerZ + p[3];
            if (dist <= -radius) return false;
        }
        return true;
    }

    /**
     * [KO] 수평(XZ) 거리만으로 분할 필요 여부를 판단합니다.
     *
     *  ✅ 수평 거리만 사용하는 이유:
     *     - 지형은 XZ 평면에 펼쳐진 구조이므로 Y(높이)는 LOD 품질에 관계없습니다.
     *     - Y를 포함하면 카메라가 높이 떠 있을수록 가까운 패치도 낮은 LOD를 받습니다.
     *
     *  임계값(threshold) = worldScale × lodThreshold
     *     - 노드의 크기에 비례하여, 카메라가 노드 크기의 N배 이내로 가까워지면 분할합니다.
     *
     * [EN] Determines split necessity using horizontal (XZ) distance only.
     *
     * @param cameraPos    - [KO] 쿼드트리 로컬 공간의 카메라 XZ 위치 [EN] Camera XZ position in local space
     * @param lodThreshold - [KO] LOD 전환 임계값 배율 (기본 1.5) [EN] LOD transition threshold multiplier (default 1.5)
     */
    shouldSplit(cameraPos: [number, number, number], lodThreshold: number = 1.5): boolean {
        if (this.lodLevel >= this.maxLOD) return false;

        const minX = this.worldOffset[0];
        const maxX = this.worldOffset[0] + this.worldScale;
        const minZ = this.worldOffset[1];
        const maxZ = this.worldOffset[1] + this.worldScale;

        // ✅ XZ 수평 거리만 계산 (Y 제외)
        // 카메라가 노드 AABB 내부에 있으면 dx=dz=0 → 항상 분할
        const dx = Math.max(minX - cameraPos[0], 0, cameraPos[0] - maxX);
        const dz = Math.max(minZ - cameraPos[2], 0, cameraPos[2] - maxZ);
        const distXZ = Math.sqrt(dx * dx + dz * dz);

        // 노드 크기의 lodThreshold 배 이내면 분할
        return distXZ < this.worldScale * lodThreshold;
    }
}

export class TerrainQuadtree {
    public leafNodes: Array<{ offset: [number, number], scale: number, lod: number }> = [];
    private rootNode: QuadtreeNode;

    constructor(worldSize: number, maxLOD: number) {
        this.rootNode = new QuadtreeNode([0, 0], worldSize, 0, maxLOD);
    }

    /**
     * [KO] 카메라 위치와 프러스텀 정보를 기반으로 쿼드트리를 순회하여 렌더링할 리프 노드들을 수집합니다.
     * [EN] Traverses the quadtree based on camera position and frustum to collect leaf nodes to render.
     *
     * @param cameraPos    - [KO] 쿼드트리 로컬 공간으로 변환된 카메라 위치 [EN] Camera position in quadtree local space
     * @param planes       - [KO] 월드 공간 프러스텀 평면 (6개) [EN] World-space frustum planes (6 planes)
     * @param minHeight    - [KO] 지형 최소 Y 높이 [EN] Terrain minimum Y height
     * @param maxHeight    - [KO] 지형 최대 Y 높이 [EN] Terrain maximum Y height
     * @param worldOffsetX - [KO] 지형 X 월드 오프셋 (프러스텀 테스트에 사용) [EN] Terrain world offset X (for frustum test)
     * @param worldOffsetZ - [KO] 지형 Z 월드 오프셋 (프러스텀 테스트에 사용) [EN] Terrain world offset Z (for frustum test)
     * @param lodThreshold - [KO] LOD 분할 임계값 배율 [EN] LOD split threshold multiplier
     */
    update(
        cameraPos: [number, number, number],
        planes: number[][] | null,
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number = 0,
        worldOffsetZ: number = 0,
        lodThreshold: number = 1.5
    ) {
        this.leafNodes = [];
        this.#traverse(this.rootNode, cameraPos, planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
    }

    #traverse(
        node: QuadtreeNode,
        cameraPos: [number, number, number],
        planes: number[][] | null,
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number,
        worldOffsetZ: number,
        lodThreshold: number
    ) {
        // 1. 프러스텀 컬링 (월드 공간에서 판정)
        if (!node.isInFrustum(planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ)) return;

        // 2. LOD 분할 판정 (로컬 공간에서 판정)
        if (node.shouldSplit(cameraPos, lodThreshold) && node.hasChildren) {
            for (const child of node.children) {
                this.#traverse(child, cameraPos, planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
            }
        } else {
            this.leafNodes.push({
                offset: node.worldOffset,
                scale: node.worldScale,
                lod: node.lodLevel
            });
        }
    }
}
