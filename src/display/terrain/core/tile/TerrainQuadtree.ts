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

    isInFrustum(
        planes: number[][],
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number,
        worldOffsetZ: number
    ): boolean {
        if (!planes) return true;

        const minX = this.worldOffset[0] + worldOffsetX;
        const maxX = this.worldOffset[0] + this.worldScale + worldOffsetX;
        const minZ = this.worldOffset[1] + worldOffsetZ;
        const maxZ = this.worldOffset[1] + this.worldScale + worldOffsetZ;
        const minY = minHeight;
        const maxY = maxHeight;

        const centerX = (minX + maxX) * 0.5;
        const centerY = (minY + maxY) * 0.5;
        const centerZ = (minZ + maxZ) * 0.5;

        // AABB 반경 계산 (제곱근 없음)
        const ex = (maxX - minX) * 0.5;
        const ey = (maxY - minY) * 0.5;
        const ez = (maxZ - minZ) * 0.5;

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
            for (const child of node.children) {
                this.#traverse(child, cameraPos, planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
            }
        } else {
            // 새 객체를 힙에 할당하지 않고 기존 노드 인스턴스를 바로 등록 (GC 억제)
            this.leafNodes.push(node);
        }
    }
}
