export class QuadtreeNodePool {
    private static pool: QuadtreeNode[] = [];

    public static acquire(
        worldOffset: [number, number],
        worldScale: number,
        lodLevel: number,
        maxLOD: number
    ): QuadtreeNode {
        let node: QuadtreeNode;
        if (this.pool.length > 0) {
            node = this.pool.pop() as QuadtreeNode;
            node.reset(worldOffset, worldScale, lodLevel, maxLOD);
        } else {
            node = new QuadtreeNode(worldOffset, worldScale, lodLevel, maxLOD);
        }
        return node;
    }

    public static release(node: QuadtreeNode) {
        node.collapse();
        node.customMinY = null;
        node.customMaxY = null;
        this.pool.push(node);
    }
}

export class QuadtreeNode {
    public children: QuadtreeNode[] = [];
    public hasChildren: boolean = false;
    public customMinY: number | null = null;
    public customMaxY: number | null = null;

    public worldOffset: [number, number] = [0, 0];
    public worldScale: number = 0;
    public lodLevel: number = 0;
    public maxLOD: number = 0;

    public localCenterX: number = 0;
    public localCenterZ: number = 0;
    private halfScale: number = 0;

    constructor(
        worldOffset: [number, number],
        worldScale: number,
        lodLevel: number,
        maxLOD: number
    ) {
        this.reset(worldOffset, worldScale, lodLevel, maxLOD);
    }

    public reset(
        worldOffset: [number, number],
        worldScale: number,
        lodLevel: number,
        maxLOD: number
    ) {
        this.worldOffset = worldOffset;
        this.worldScale = worldScale;
        this.lodLevel = lodLevel;
        this.maxLOD = maxLOD;

        this.halfScale = worldScale * 0.5;
        this.localCenterX = worldOffset[0] + this.halfScale;
        this.localCenterZ = worldOffset[1] + this.halfScale;
        this.hasChildren = this.lodLevel < this.maxLOD;
        this.customMinY = null;
        this.customMaxY = null;

        this.collapse();
    }

    public collapse() {
        if (this.children.length > 0) {
            for (let i = 0; i < this.children.length; i++) {
                QuadtreeNodePool.release(this.children[i]);
            }
            this.children.length = 0;
        }
    }

    // 자식 노드가 필요할 때 오브젝트 풀에서 재사용 (Lazy creation via Pool)
    public split() {
        if (this.children.length === 0 && this.hasChildren) {
            const nextLOD = this.lodLevel + 1;
            const c0 = QuadtreeNodePool.acquire([this.worldOffset[0], this.worldOffset[1]], this.halfScale, nextLOD, this.maxLOD);
            const c1 = QuadtreeNodePool.acquire([this.worldOffset[0] + this.halfScale, this.worldOffset[1]], this.halfScale, nextLOD, this.maxLOD);
            const c2 = QuadtreeNodePool.acquire([this.worldOffset[0], this.worldOffset[1] + this.halfScale], this.halfScale, nextLOD, this.maxLOD);
            const c3 = QuadtreeNodePool.acquire([this.worldOffset[0] + this.halfScale, this.worldOffset[1] + this.halfScale], this.halfScale, nextLOD, this.maxLOD);

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

            this.children[0] = c0;
            this.children[1] = c1;
            this.children[2] = c2;
            this.children[3] = c3;
        }
    }

    isInFrustum(
        planes: number[][],
        minHeight: number,
        maxHeight: number,
        worldOffsetX: number,
        worldOffsetZ: number
    ): boolean {
        if (!planes || planes.length < 6) return true;

        const nodeMinY = this.customMinY !== null ? this.customMinY : minHeight;
        const nodeMaxY = this.customMaxY !== null ? this.customMaxY : maxHeight;

        const centerX = this.localCenterX + worldOffsetX;
        const centerY = (nodeMinY + nodeMaxY) * 0.5;
        const centerZ = this.localCenterZ + worldOffsetZ;

        const ex = this.halfScale;
        const ey = (nodeMaxY - nodeMinY) * 0.5;
        const ez = this.halfScale;

        for (let i = 0; i < 6; i++) {
            const p = planes[i];
            const dist = p[0] * centerX + p[1] * centerY + p[2] * centerZ + p[3];

            const r = ex * Math.abs(p[0]) + ey * Math.abs(p[1]) + ez * Math.abs(p[2]);
            if (dist <= -r) return false;
        }
        return true;
    }

    shouldSplit(cameraPos: [number, number, number], lodThreshold: number = 1.5): boolean {
        if (this.lodLevel >= this.maxLOD) return false;

        const minX = this.worldOffset[0];
        const maxX = minX + this.worldScale;
        const minZ = this.worldOffset[1];
        const maxZ = minZ + this.worldScale;

        const camX = cameraPos[0];
        const camZ = cameraPos[2];

        const dx = camX < minX ? minX - camX : (camX > maxX ? camX - maxX : 0);
        const dz = camZ < minZ ? minZ - camZ : (camZ > maxZ ? camZ - maxZ : 0);

        const threshold = this.worldScale * lodThreshold;
        return (dx * dx + dz * dz) < (threshold * threshold);
    }
}

export class TerrainQuadtree {
    public leafNodes: QuadtreeNode[] = [];
    private rootNode: QuadtreeNode;

    constructor(worldSize: number, maxLOD: number) {
        this.rootNode = QuadtreeNodePool.acquire([0, 0], worldSize, 0, maxLOD);
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
        this.leafNodes.length = 0;
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
        if (!node.isInFrustum(planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ)) {
            node.collapse();
            return;
        }

        if (node.shouldSplit(cameraPos, lodThreshold) && node.hasChildren) {
            node.split();
            for (const child of node.children) {
                this.#traverse(child, cameraPos, planes, minHeight, maxHeight, worldOffsetX, worldOffsetZ, lodThreshold);
            }
        } else {
            node.collapse();
            this.leafNodes.push(node);
        }
    }
}
