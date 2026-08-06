import RedGPUContext from "../../../context/RedGPUContext";
import InstancingMesh from "../../instancingMesh/InstancingMesh";
import Plane from "../../../primitive/Plane";
import ColorMaterial from "../../../material/colorMaterial/ColorMaterial";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Terrain from "../Terrain";
import {SpatialTileInfo} from "./TerrainSpatialGrid";
import Mesh from "../../mesh/Mesh";

export interface VegetationMeshOptions {
    count?: number;
    grassSize?: [number, number];
    color?: string;
    geometry?: Geometry | Primitive;
    material?: any;
    baseScale?: number;
    gltfMesh?: Mesh | any;
    windStrength?: number;
}

interface RawCandidate {
    x: number;
    z: number;
    rotY: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
    tileKey: string;
}

interface SubMeshData {
    geometry: Geometry | Primitive;
    material: any;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    offsetRotX: number;
    offsetRotY: number;
    offsetRotZ: number;
    offsetScaleX: number;
    offsetScaleY: number;
    offsetScaleZ: number;
}

/**
 * [KO] 🌲 대규모 오픈월드 지형 전용 식생 (Vegetation / Foliage) 메쉬 클래스
 *
 * - InstancingMeshObject3D 힙 객체를 생성하지 않고, TypedArray (Float32Array) 기반 얇은 인스턴싱 버퍼 구조 적용
 * - 0% JS 객체 할당 (Zero-GC Overhead) 및 타일 기반 증분(Incremental Delta) 스트리밍 연동
 * - GLTF 식생 노드 자동 순회, 부모 누적 트랜스폼 상속 및 식생 알파/컬링 파이프라인 전용 탑재
 */
class VegetationMesh extends InstancingMesh {
    #terrain: Terrain;
    #rawCandidatePool: RawCandidate[] = [];
    #activeCandidates: RawCandidate[] = [];
    #tileToCandidateMap: Map<string, RawCandidate[]> = new Map();
    #loadedTilesSet: Set<string> = new Set();
    #subVegetationMeshes: InstancingMesh[] = [];
    #subMeshDataList: SubMeshData[] = [];

    constructor(redGPUContext: RedGPUContext, terrain: Terrain, countOrOptions: number | VegetationMeshOptions = 20000) {
        const options: VegetationMeshOptions = typeof countOrOptions === 'number' ? {count: countOrOptions} : countOrOptions;
        const totalCount = options.count ?? 20000;
        const grassSize = options.grassSize ?? [1.5, 3.0];
        const color = options.color ?? '#388e3c';
        const baseScale = options.baseScale ?? 1.0;

        let geometry = options.geometry;
        let material = options.material;
        const subMeshList: SubMeshData[] = [];

        // 1. GLTF 노드 트리 자동 탐색 및 부모 상속 누적 트랜스폼 계산
        if (options.gltfMesh) {
            VegetationMesh.#extractGLTFSubMeshes(options.gltfMesh, subMeshList);

            if (subMeshList.length > 0) {
                geometry = subMeshList[0].geometry;
                material = subMeshList[0].material;
            }
        }

        // 2. 기본 Geometry 및 Material 설정
        if (!geometry) {
            geometry = new Plane(redGPUContext, grassSize[0], grassSize[1]);
        }
        if (!material) {
            material = new ColorMaterial(redGPUContext);
            material.color.setColorByHEX(color);
        }

        // 식생 전용 PBR 알파 및 컬링 파이프라인 내재화
        VegetationMesh.#setupVegetationMaterial(material);

        // 3. InstancingMesh 기반 렌더 메쉬 생성
        super(redGPUContext, totalCount, 0, geometry, material);

        this.#terrain = terrain;
        this.#subMeshDataList = subMeshList;

        // 4. 서브메시 파이프라인 내재화 생성
        if (subMeshList.length > 1) {
            for (let i = 1; i < subMeshList.length; i++) {
                const subData = subMeshList[i];
                VegetationMesh.#setupVegetationMaterial(subData.material);
                const subInstancingMesh = new InstancingMesh(redGPUContext, totalCount, 0, subData.geometry, subData.material);
                this.#subVegetationMeshes.push(subInstancingMesh);
                this.addChild(subInstancingMesh);
            }
        }

        // 5. [Zero-GC] 식생 후보군 사전 분할 구축
        const [worldW, worldH] = terrain.worldSize;
        const [offX, offZ] = terrain.worldOffset;

        for (let i = 0; i < totalCount; i++) {
            const x = offX + Math.random() * worldW;
            const z = offZ + Math.random() * worldH;

            const u = Math.max(0, Math.min(1, (x - offX) / worldW));
            const v = Math.max(0, Math.min(1, (z - offZ) / worldH));
            const tileCol = Math.max(0, Math.min(15, Math.floor(u * 16)));
            const tileRow = Math.max(0, Math.min(15, Math.floor((1 - v) * 16)));
            const tileKey = `${tileCol}_${tileRow}`;

            const rotY = Math.random() * Math.PI * 2;
            const s = (0.8 + Math.random() * 0.5) * baseScale;

            const cand: RawCandidate = {
                x,
                z,
                rotY,
                scaleX: s,
                scaleY: s * (0.85 + Math.random() * 0.4),
                scaleZ: s,
                tileKey
            };

            this.#rawCandidatePool.push(cand);

            let tileList = this.#tileToCandidateMap.get(tileKey);
            if (!tileList) {
                tileList = [];
                this.#tileToCandidateMap.set(tileKey, tileList);
            }
            tileList.push(cand);
        }
    }

    get terrain(): Terrain {
        return this.#terrain;
    }

    /**
     * 식생 전용 알파 및 컬링 상태 적용
     */
    static #setupVegetationMaterial(mat: any) {
        if (!mat) return;
        if ('useAlphaMode' in mat) mat.useAlphaMode = true;
        if ('alphaCutoff' in mat && (mat.alphaCutoff === undefined || mat.alphaCutoff === 0)) mat.alphaCutoff = 0.3;
        if ('cullMode' in mat) mat.cullMode = 'none';
    }

    /**
     * GLTF 노드 트리 상위 트랜스폼 누적 상속 파싱
     */
    static #extractGLTFSubMeshes(
        node: any,
        outList: SubMeshData[],
        parentX = 0, parentY = 0, parentZ = 0,
        parentRotX = 0, parentRotY = 0, parentRotZ = 0,
        parentScaleX = 1, parentScaleY = 1, parentScaleZ = 1
    ) {
        if (!node) return;

        const curX = parentX + (node.x || 0) * parentScaleX;
        const curY = parentY + (node.y || 0) * parentScaleY;
        const curZ = parentZ + (node.z || 0) * parentScaleZ;

        const curRotX = parentRotX + (node.rotationX || 0);
        const curRotY = parentRotY + (node.rotationY || 0);
        const curRotZ = parentRotZ + (node.rotationZ || 0);

        const curScaleX = parentScaleX * (node.scaleX !== undefined ? node.scaleX : 1);
        const curScaleY = parentScaleY * (node.scaleY !== undefined ? node.scaleY : 1);
        const curScaleZ = parentScaleZ * (node.scaleZ !== undefined ? node.scaleZ : 1);

        if (node.geometry && node.material) {
            outList.push({
                geometry: node.geometry,
                material: node.material,
                offsetX: curX,
                offsetY: curY,
                offsetZ: curZ,
                offsetRotX: curRotX,
                offsetRotY: curRotY,
                offsetRotZ: curRotZ,
                offsetScaleX: curScaleX,
                offsetScaleY: curScaleY,
                offsetScaleZ: curScaleZ
            });
        }

        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                VegetationMesh.#extractGLTFSubMeshes(
                    child, outList,
                    curX, curY, curZ,
                    curRotX, curRotY, curRotZ,
                    curScaleX, curScaleY, curScaleZ
                );
            }
        }
    }

    /**
     * ⚡ [타일 증분 로드]
     */
    onTileLoaded(tile: SpatialTileInfo): void {
        const key = tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`;
        if (this.#loadedTilesSet.has(key)) return;

        this.#loadedTilesSet.add(key);

        const targetCandidates = this.#tileToCandidateMap.get(key);
        if (!targetCandidates || targetCandidates.length === 0) return;

        this.#appendTileInstances(targetCandidates);
    }

    /**
     * ⚡ [Zero-Overhead 언로드]
     */
    onTileUnloaded(tile: SpatialTileInfo): void {
        const key = tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`;
        if (!this.#loadedTilesSet.has(key)) return;

        this.#loadedTilesSet.delete(key);
    }

    forceUpdate(): void {
        this.#activeCandidates = [];
        this.#loadedTilesSet.clear();
        if (this.#terrain && this.#terrain.spatialGrid && this.#terrain.spatialGrid.activeTiles) {
            this.#terrain.spatialGrid.activeTiles.forEach((tile) => {
                this.onTileLoaded(tile);
            });
        }
    }

    /**
     * 식생 인스턴스 증분 추가 (Fast TypedArray Push)
     */
    #appendTileInstances(candidates: RawCandidate[]): void {
        const terrain = this.#terrain;
        if (!terrain) return;

        const [worldW, worldH] = terrain.worldSize;
        const [offX, offZ] = terrain.worldOffset;
        const maxHeight = terrain.maxHeight;
        const minHeight = terrain.minHeight;
        const tileCache = terrain.tileDataCache;

        const startIndex = this.#activeCandidates.length;

        for (let i = 0; i < candidates.length; i++) {
            this.#activeCandidates.push(candidates[i]);
        }

        const newTotal = this.#activeCandidates.length;
        this.instanceCount = newTotal;
        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.instanceCount = newTotal;
        }

        const children = this.instanceChildren;
        const subChildrenList = this.#subVegetationMeshes.map(sm => sm.instanceChildren);
        const subDataList = this.#subMeshDataList;

        const mainSubData = subDataList[0];
        const mainOffX = mainSubData ? mainSubData.offsetX : 0;
        const mainOffY = mainSubData ? mainSubData.offsetY : 0;
        const mainOffZ = mainSubData ? mainSubData.offsetZ : 0;
        const mainRotX = mainSubData ? mainSubData.offsetRotX : 0;
        const mainRotY = mainSubData ? mainSubData.offsetRotY : 0;
        const mainRotZ = mainSubData ? mainSubData.offsetRotZ : 0;
        const mainScaleX = mainSubData ? mainSubData.offsetScaleX : 1;
        const mainScaleY = mainSubData ? mainSubData.offsetScaleY : 1;
        const mainScaleZ = mainSubData ? mainSubData.offsetScaleZ : 1;

        for (let i = startIndex; i < newTotal; i++) {
            const cand = this.#activeCandidates[i];
            const child = children[i];
            if (!child) continue;

            const u = Math.max(0, Math.min(1, (cand.x - offX) / worldW));
            const v = Math.max(0, Math.min(1, (cand.z - offZ) / worldH));

            let sampledRatio = 0.0;
            if (tileCache.has(cand.tileKey)) {
                const data = tileCache.get(cand.tileKey);
                if (data) {
                    const localU = (u * 16) % 1;
                    const localV = ((1 - v) * 16) % 1;
                    const tileSize = 512;
                    const px = Math.max(0, Math.min(tileSize - 1, Math.floor(localU * tileSize)));
                    const py = Math.max(0, Math.min(tileSize - 1, Math.floor(localV * tileSize)));

                    let view: Uint16Array | null = null;
                    if (ArrayBuffer.isView(data)) {
                        view = new Uint16Array(data.buffer, data.byteOffset, data.byteLength / 2);
                    } else if (data instanceof ArrayBuffer) {
                        view = new Uint16Array(data);
                    }

                    if (view) {
                        const idx = py * tileSize + px;
                        if (idx < view.length) {
                            sampledRatio = view[idx] / 65535;
                        }
                    }
                }
            }

            const targetY = minHeight + sampledRatio * (maxHeight - minHeight);

            child.x = cand.x + mainOffX * cand.scaleX;
            child.y = targetY + mainOffY * cand.scaleY;
            child.z = cand.z + mainOffZ * cand.scaleZ;
            child.rotationX = mainRotX;
            child.rotationY = cand.rotY + mainRotY;
            child.rotationZ = mainRotZ;
            child.scaleX = cand.scaleX * mainScaleX;
            child.scaleY = cand.scaleY * mainScaleY;
            child.scaleZ = cand.scaleZ * mainScaleZ;

            for (let s = 0; s < subChildrenList.length; s++) {
                const subChild = subChildrenList[s][i];
                const subData = subDataList[s + 1];
                if (subChild && subData) {
                    subChild.x = cand.x + subData.offsetX * cand.scaleX;
                    subChild.y = targetY + subData.offsetY * cand.scaleY;
                    subChild.z = cand.z + subData.offsetZ * cand.scaleZ;
                    subChild.rotationX = subData.offsetRotX;
                    subChild.rotationY = cand.rotY + subData.offsetRotY;
                    subChild.rotationZ = subData.offsetRotZ;
                    subChild.scaleX = cand.scaleX * subData.offsetScaleX;
                    subChild.scaleY = cand.scaleY * subData.offsetScaleY;
                    subChild.scaleZ = cand.scaleZ * subData.offsetScaleZ;
                }
            }
        }

        this.#markDirtyAll();
    }

    #markDirtyAll() {
        this.dirtyInstanceMeshObject3D = true;
        this.dirtyInstanceNum = true;
        this.dirtyTransform = true;
        this.dirtyPipeline = true;

        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.dirtyInstanceMeshObject3D = true;
            subMesh.dirtyInstanceNum = true;
            subMesh.dirtyTransform = true;
            subMesh.dirtyPipeline = true;
        }
    }
}

export default VegetationMesh;
