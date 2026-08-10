export class QuadtreeNode {
    public children: QuadtreeNode[] = [];
    public hasChildren: boolean = false;
    public customMinY: number | null = null;
    public customMaxY: number | null = null;

    // X, Z 축 반경(Extent) 캐싱
    private readonly halfScale: number;

    constructor(
        public worldOffset: [number, number],
        public worldScale: number,
        public lodLevel: number,
        public maxLOD: number
    ) {
        this.halfScale = worldScale * 0.5;
        if (this.lodLevel < this.maxLOD) {
            this.hasChildren = true;
        }
    }

    // 자식 노드가 필요할 때 동적으로 지연 생성 (Lazy creation)
    public split() {
        if (this.children.length === 0 && this.hasChildren) {
            const nextLOD = this.lodLevel + 1;
            const c0 = new QuadtreeNode([this.worldOffset[0], this.worldOffset[1]], this.halfScale, nextLOD, this.maxLOD);
            const c1 = new QuadtreeNode([this.worldOffset[0] + this.halfScale, this.worldOffset[1]], this.halfScale, nextLOD, this.maxLOD);
            const c2 = new QuadtreeNode([this.worldOffset[0], this.worldOffset[1] + this.halfScale], this.halfScale, nextLOD, this.maxLOD);
            const c3 = new QuadtreeNode([this.worldOffset[0] + this.halfScale, this.worldOffset[1] + this.halfScale], this.halfScale, nextLOD, this.maxLOD);

            if (this.customMinY !== null && this.customMaxY !== null) {
                c0.customMinY = this.customMinY;
                c0.customMaxY = this.customMaxY;
                c1.customMinY = this.customMinY;
                c1.customMaxY = this.customMaxY;
                c2.customMinY = this.customMinY;
                c2.customMaxY = this.customMaxY;
                c3.customMinY = this.customMinY;
                c3.customMaxY = this.customMaxY;
            }

            this.children = [c0, c1, c2, c3];
        }
    }

    isInFrustum(
        planes: number[][],
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number,
        worldOffsetZ: number
    ): boolean {
        if (!planes) return true;

        const nodeMinY = this.customMinY !== null ? this.customMinY : minHeight;
        const nodeMaxY = this.customMaxY !== null ? this.customMaxY : maxHeight;

        const minX = this.worldOffset[0] + worldOffsetX;
        const maxX = this.worldOffset[0] + this.worldScale + worldOffsetX;
        const minZ = this.worldOffset[1] + worldOffsetZ;
        const maxZ = this.worldOffset[1] + this.worldScale + worldOffsetZ;

        const centerX = (minX + maxX) * 0.5;
        const centerY = (nodeMinY + nodeMaxY) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;

        // 미리 캐싱된 반경(extent) 및 노드 정밀 Height 반경(ey)을 활용하여 AABB 연산 정확도 극대화
        const ex = this.halfScale;
        const ey = (nodeMaxY - nodeMinY) * 0.5;
        const ez = this.halfScale;

        for (let i = 0; i < 6; i++) {
            const p = planes[i];
            const dist = p[0] * centerX + p[1] * centerY + p[2] * centerZ + p[3];

            // AABB 투영 크기 계산 (정확한 AABB 판정)
            const r = ex * Math.abs(p[0]) + ey * Math.abs(p[1]) + ez * Math.abs(p[2]);
            if (dist <= -r) return false;
        }
        return true;
    }

    shouldSplit(cameraPos: [number, number, number], lodThreshold: number = 1.5): boolean {
        if (this.lodLevel >= this.maxLOD) return false;

        const minX = this.worldOffset[0];
        const maxX = this.worldOffset[0] + this.worldScale;
        const minZ = this.worldOffset[1];
        const maxZ = this.worldOffset[1] + this.worldScale;

        const dx = Math.max(minX - cameraPos[0], 0, cameraPos[0] - maxX);
        const dz = Math.max(minZ - cameraPos[2], 0, cameraPos[2] - maxZ);

        // 제곱근 연산 제거
        const distSq = dx * dx + dz * dz;
        const threshold = this.worldScale * lodThreshold;
        return distSq < threshold * threshold;
    }
}

export class TerrainQuadtree {
    public leafNodes: QuadtreeNode[] = [];
    private rootNode: QuadtreeNode;

    constructor(worldSize: number, maxLOD: number) {
        this.rootNode = new QuadtreeNode([0, 0], worldSize, 0, maxLOD);
    }

    update(
        cameraPos: [number, number, number],
        frustumPlanes: number[][] | null,
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number = 0,
        worldOffsetZ: number = 0,
        lodThreshold: number = 1.5
    ) {
        this.leafNodes = [];
        this.#traverse(this.rootNode, cameraPos, frustumPlanes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
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
        if (!node.isInFrustum(planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ)) return;

        if (node.shouldSplit(cameraPos, lodThreshold) && node.hasChildren) {
            // 실제로 하위 노드로 분할되어 들어갈 때만 자식 노드들을 동적 지연 생성
            node.split();
            for (const child of node.children) {
                this.#traverse(child, cameraPos, planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
            }
        } else {
            // 새 객체를 힙에 할당하지 않고 기존 노드 인스턴스를 바로 등록 (GC 억제)
            this.leafNodes.push(node);
        }
    }
}
