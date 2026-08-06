import RedGPUContext from "../../../context/RedGPUContext";
import ProceduralInstancingMesh from "./ProceduralInstancingMesh";
import Plane from "../../../primitive/Plane";
import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import Terrain from "../Terrain";
import {SpatialTileInfo} from "../core/TerrainSpatialGrid";
import Mesh from "../../mesh/Mesh";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import StorageBuffer from "../../../resources/buffer/storageBuffer/StorageBuffer";
import vegetationVertexSource from "./shader/vegetationVertex.wgsl";

export interface VegetationMeshOptions {
    count?: number;
    grassSize?: [number, number];
    geometry?: Geometry | Primitive;
    material?: any;
    baseScale?: number;
    gltfMesh?: Mesh | any;
    windStrength?: number;
    maskChannel?: 'r' | 'g' | 'b' | 'a';
    maskThreshold?: number;
    splatUrl?: string;
    maxDistance?: number;
    startFadeDistance?: number;
    windMaxDistance?: number;
}

interface RawCandidate {
    x: number;
    z: number;
    rotY: number;
    scaleXZ: number;
    scaleY: number;
    windOffset: number;
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

const VEGETATION_UNIFORM_FLOAT_COUNT = 8;
const INSTANCE_FLOATS = 8;

/**
 * [KO] 🌲 대규모 오픈월드 지형 전용 절차적 식생 (Vegetation / Foliage) 메쉬 클래스
 *
 * - ProceduralInstancingMesh 상속 (경량 per-instance, GPU Culling, Indirect Draw)
 * - GPU Vertex Shader에서 heightmap atlas 직접 샘플링하여 높이 결정
 * - GPU Vertex Shader에서 바람(Wind) 애니메이션 처리
 */
class VegetationMesh extends ProceduralInstancingMesh {
    #terrain: Terrain;
    #rawCandidatePool: RawCandidate[] = [];
    #activeCandidates: RawCandidate[] = [];
    #tileToCandidateMap: Map<string, RawCandidate[]> = new Map();
    #loadedTilesSet: Set<string> = new Set();
    #subVegetationMeshes: ProceduralInstancingMesh[] = [];
    #subMeshDataList: SubMeshData[] = [];

    // Vegetation group(3) 전용 리소스
    #vegetationUniformBuffer: StorageBuffer;
    #vegetationBindGroup: GPUBindGroup;
    #vegetationBindGroupLayout: GPUBindGroupLayout;
    #vegetationUniformData: Float32Array;
    #windStrength: number = 0.08;
    #maskChannel: 'r' | 'g' | 'b' | 'a' = 'g';
    #maskThreshold: number = 0.2;
    #splatImageData: ImageData | null = null;
    #splatWidth: number = 0;
    #splatHeight: number = 0;
    #baseScale: number = 1.0;
    #totalCount: number = 20000;
    #startTime: number = performance.now();

    constructor(redGPUContext: RedGPUContext, terrain: Terrain, countOrOptions: number | VegetationMeshOptions = 20000) {
        const options: VegetationMeshOptions = typeof countOrOptions === 'number' ? {count: countOrOptions} : countOrOptions;
        const totalCount = options.count ?? 20000;
        const grassSize = options.grassSize ?? [1.5, 3.0];
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
            material = new PBRMaterial(redGPUContext);
        }

        // 식생 전용 PBR 알파 및 컬링 파이프라인 설정
        VegetationMesh.#setupVegetationMaterial(material);

        // 3. ProceduralInstancingMesh 기반 렌더 메쉬 생성
        super(redGPUContext, totalCount, geometry, material);

        this.#terrain = terrain;
        this.#subMeshDataList = subMeshList;
        this.#windStrength = options.windStrength ?? 0.08;
        this.#maskChannel = options.maskChannel ?? 'g';
        this.#maskThreshold = options.maskThreshold ?? 0.2;
        this.maxDistance = options.maxDistance ?? 1500;
        this.startFadeDistance = options.startFadeDistance ?? (this.maxDistance * 0.8);
        this.windMaxDistance = options.windMaxDistance ?? 300;
        this.#baseScale = baseScale;
        this.#totalCount = totalCount;

        // Splatmap 이미지 로딩 시도 (options.splatUrl 사용)
        const splatUrl = options.splatUrl || '../../../assets/terrain/terrainTest_001/splatMap.jpg';
        if (splatUrl) {
            this.#initSplatImage(splatUrl);
        }

        // 서브메시 파이프라인 생성 (부속 노드가 더 있을 경우)
        if (subMeshList.length > 1) {
            for (let i = 1; i < subMeshList.length; i++) {
                const subData = subMeshList[i];
                VegetationMesh.#setupVegetationMaterial(subData.material);
                const subMeshSelf = this;
                const subInstancingMesh = new class extends ProceduralInstancingMesh {
                    protected getVertexShaderSource(): string {
                        return subMeshSelf.getVertexShaderSource();
                    }

                    protected getExtraBindGroupLayouts(): GPUBindGroupLayout[] {
                        return subMeshSelf.getExtraBindGroupLayouts();
                    }

                    protected getExtraBindGroups(): GPUBindGroup[] {
                        return subMeshSelf.getExtraBindGroups();
                    }

                    protected getHeightmapTexture(): any {
                        return subMeshSelf.getHeightmapTexture();
                    }

                    protected getHeightmapSampler(): any {
                        return subMeshSelf.getHeightmapSampler();
                    }

                    protected getSplatTexture(): any {
                        return subMeshSelf.getSplatTexture();
                    }
                }(redGPUContext, totalCount, subData.geometry, subData.material);

                this.#subVegetationMeshes.push(subInstancingMesh);
                this.addChild(subInstancingMesh as any);
            }
        }

        // Vegetation 전용 GPU 유니폼 버퍼 및 BindGroup 초기화
        this.#vegetationUniformData = new Float32Array(VEGETATION_UNIFORM_FLOAT_COUNT);
        this.#vegetationUniformBuffer = new StorageBuffer(
            redGPUContext,
            this.#vegetationUniformData.buffer as ArrayBuffer,
            `VegetationUniformBuffer_${this.uuid}`
        );
        this.#initVegetationBindGroup(redGPUContext);

        // 초기 후보군 생성
        this.#rebuildCandidates();
    }

    get terrain(): Terrain {
        return this.#terrain;
    }

    static #setupVegetationMaterial(mat: any) {
        if (!mat) return;
        if ('useAlphaMode' in mat) mat.useAlphaMode = true;
        if ('alphaCutoff' in mat && (mat.alphaCutoff === undefined || mat.alphaCutoff === 0)) mat.alphaCutoff = 0.3;
        if ('cullMode' in mat) mat.cullMode = 'none';
        if ('doubleSided' in mat) mat.doubleSided = true;
    }

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
     * render 호출 시, uniform 데이터를 갱신
     */
    render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false): void {
        this.#updateVegetationUniforms();
        super.render(renderViewStateData, shadowRender);
    }

    /**
     * [타일 로드 시 호출]
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
     * [타일 언로드 시 호출]
     * 성능 최적화를 위해 실시간 데이터 축소는 하지 않고 로드 상태 셋에서만 제외
     */
    onTileUnloaded(tile: SpatialTileInfo): void {
        const key = tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`;
        this.#loadedTilesSet.delete(key);
    }

    forceUpdate(): void {
        this.#activeCandidates = [];
        this.#loadedTilesSet.clear();
        this.instanceCount = 0;
        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.instanceCount = 0;
        }
        if (this.#terrain?.spatialGrid?.activeTiles) {
            this.#terrain.spatialGrid.activeTiles.forEach((tile) => {
                this.onTileLoaded(tile);
            });
        }
    }

    protected getVertexShaderSource(): string {
        return vegetationVertexSource;
    }

    protected getExtraBindGroupLayouts(): GPUBindGroupLayout[] {
        return [this.#vegetationBindGroupLayout];
    }

    protected getExtraBindGroups(): GPUBindGroup[] {
        return [this.#vegetationBindGroup];
    }

    protected getHeightmapTexture(): any {
        try {
            return this.#terrain?.heightmapAtlasTexture ?? null;
        } catch (e) {
            return null;
        }
    }

    // =========================================================
    // Private
    // =========================================================

    protected getHeightmapSampler(): any {
        try {
            return this.#terrain?.heightmapSampler ?? null;
        } catch (e) {
            return null;
        }
    }

    protected getSplatTexture(): any {
        try {
            return (this.#terrain?.material as any)?.splatTexture ?? null;
        } catch (e) {
            return null;
        }
    }

    #initSplatImage(url: string) {
        if (typeof window === 'undefined' || !url) return;
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    this.#splatImageData = ctx.getImageData(0, 0, img.width, img.height);
                    this.#splatWidth = img.width;
                    this.#splatHeight = img.height;
                    // Splatmap 마스크 정보가 준비되었으므로 식생 후보군 재배치
                    this.#rebuildCandidates();
                    this.forceUpdate();
                }
            } catch (e) {
                console.warn('[VegetationMesh] splatMap.jpg 픽셀 디코딩에 실패하여 무작위 배치를 유지합니다:', e);
            }
        };
        img.src = url;
    }

    #getMaskValueAt(x: number, z: number): number {
        if (!this.#splatImageData) return 1.0;

        const [worldW, worldH] = this.#terrain.worldSize;
        const [offX, offZ] = this.#terrain.worldOffset;

        const u = Math.max(0, Math.min(1, (x - offX) / worldW));
        const v = Math.max(0, Math.min(1, (z - offZ) / worldH));

        const px = Math.max(0, Math.min(this.#splatWidth - 1, Math.floor(u * this.#splatWidth)));
        const py = Math.max(0, Math.min(this.#splatHeight - 1, Math.floor(v * this.#splatHeight)));

        const idx = (py * this.#splatWidth + px) * 4;
        const data = this.#splatImageData.data;

        let channelIdx = 1; // 기본 'g' (Grass/풀밭)
        if (this.#maskChannel === 'r') channelIdx = 0;
        else if (this.#maskChannel === 'b') channelIdx = 2;
        else if (this.#maskChannel === 'a') channelIdx = 3;

        return data[idx + channelIdx] / 255.0;
    }

    #rebuildCandidates(): void {
        this.#rawCandidatePool = [];
        this.#tileToCandidateMap.clear();

        const [worldW, worldH] = this.#terrain.worldSize;
        const [offX, offZ] = this.#terrain.worldOffset;
        let created = 0;
        let attempts = 0;
        const maxAttempts = this.#totalCount * 10;

        while (created < this.#totalCount && attempts < maxAttempts) {
            attempts++;
            const x = offX + Math.random() * worldW;
            const z = offZ + Math.random() * worldH;

            // Splatmap 마스킹 농도 검사
            const maskVal = this.#getMaskValueAt(x, z);
            if (this.#splatImageData && maskVal < this.#maskThreshold) {
                continue; // 지정 채널(풀밭 등) 농도가 낮은 땅에는 식생 생장 불가!
            }

            const u = Math.max(0, Math.min(1, (x - offX) / worldW));
            const v = Math.max(0, Math.min(1, (z - offZ) / worldH));
            const tileCol = Math.max(0, Math.min(15, Math.floor(u * 16)));
            const tileRow = Math.max(0, Math.min(15, Math.floor((1 - v) * 16)));
            const tileKey = `${tileCol}_${tileRow}`;

            const rotY = Math.random() * Math.PI * 2;
            const s = (0.8 + Math.random() * 0.5) * this.#baseScale;
            const windOffset = Math.random() * Math.PI * 2;

            const cand: RawCandidate = {
                x, z, rotY,
                scaleXZ: s,
                scaleY: s * (0.85 + Math.random() * 0.4),
                windOffset,
                tileKey
            };

            this.#rawCandidatePool.push(cand);

            let tileList = this.#tileToCandidateMap.get(tileKey);
            if (!tileList) {
                tileList = [];
                this.#tileToCandidateMap.set(tileKey, tileList);
            }
            tileList.push(cand);
            created++;
        }
    }

    #initVegetationBindGroup(redGPUContext: RedGPUContext): void {
        const {gpuDevice, resourceManager} = redGPUContext;
        const terrain = this.#terrain;

        this.#vegetationBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `VegetationBindGroupLayout_${this.uuid}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX,
                    texture: {sampleType: 'float', viewDimension: '2d', multisampled: false}
                },
            ]
        });

        this.#vegetationBindGroup = gpuDevice.createBindGroup({
            label: `VegetationBindGroup_${this.uuid}`,
            layout: this.#vegetationBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: this.#vegetationUniformBuffer.gpuBuffer}
                },
                {
                    binding: 1,
                    resource: terrain.heightmapSampler?.gpuSampler
                        || resourceManager.basicDisplacementSampler.gpuSampler
                },
                {
                    binding: 2,
                    resource: resourceManager.getGPUResourceBitmapTextureView(terrain.heightmapAtlasTexture)
                        || resourceManager.emptyBitmapTextureView
                },
            ]
        });
    }

    #updateVegetationUniforms(): void {
        const terrain = this.#terrain;
        if (!terrain) return;

        this.minHeight = terrain.minHeight;
        this.maxHeight = terrain.maxHeight;
        this.worldSize = terrain.worldSize;
        this.worldOffset = terrain.worldOffset;
        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.minHeight = terrain.minHeight;
            subMesh.maxHeight = terrain.maxHeight;
            subMesh.worldSize = terrain.worldSize;
            subMesh.worldOffset = terrain.worldOffset;
        }

        const [worldW, worldH] = terrain.worldSize;
        const [offX, offZ] = terrain.worldOffset;
        const time = (performance.now() - this.#startTime) * 0.001;

        const d = this.#vegetationUniformData;
        d[0] = worldW;
        d[1] = worldH;
        d[2] = offX;
        d[3] = offZ;
        d[4] = terrain.maxHeight;
        d[5] = terrain.minHeight;
        d[6] = time;
        d[7] = this.#windStrength;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#vegetationUniformBuffer.gpuBuffer,
            0,
            d.buffer as ArrayBuffer,
            d.byteOffset,
            d.byteLength
        );
    }

    #appendTileInstances(candidates: RawCandidate[]): void {
        const startIndex = this.#activeCandidates.length;

        for (let i = 0; i < candidates.length; i++) {
            this.#activeCandidates.push(candidates[i]);
        }

        const newTotal = this.#activeCandidates.length;
        this.instanceCount = newTotal;
        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.instanceCount = newTotal;
        }

        const terrain = this.#terrain;
        const [worldW, worldH] = terrain.worldSize;
        const [offX, offZ] = terrain.worldOffset;
        const minHeight = terrain.minHeight;
        // ProceduralInstancingMesh의 instanceData 채우기
        const mainData = this.instanceData;
        const subDataLists = this.#subVegetationMeshes.map(sm => sm.instanceData);
        const subDataInfoList = this.#subMeshDataList;

        const mainSubData = subDataInfoList[0];
        const mainOffX = mainSubData ? mainSubData.offsetX : 0;
        const mainOffZ = mainSubData ? mainSubData.offsetZ : 0;
        const mainRotY = mainSubData ? mainSubData.offsetRotY : 0;
        const mainScaleX = mainSubData ? mainSubData.offsetScaleX : 1;
        const mainScaleY = mainSubData ? mainSubData.offsetScaleY : 1;

        for (let i = startIndex; i < newTotal; i++) {
            const cand = this.#activeCandidates[i];

            const targetY = 0;

            // Main Mesh Instance Data
            let offset = i * INSTANCE_FLOATS;
            mainData[offset] = cand.x + mainOffX * cand.scaleXZ;
            mainData[offset + 1] = cand.z + mainOffZ * cand.scaleXZ;
            mainData[offset + 2] = cand.rotY + mainRotY;
            mainData[offset + 3] = cand.scaleXZ * mainScaleX;
            mainData[offset + 4] = cand.scaleY * mainScaleY;
            mainData[offset + 5] = cand.windOffset;
            mainData[offset + 6] = targetY; // 로컬 Y = 0 (GPU가 heightmap 텍스처를 직접 샘플링하여 최종 월드 Y 높이 결정)
            // pad1 = 0

            // Sub Mesh Instance Data
            for (let s = 0; s < subDataLists.length; s++) {
                const subData = subDataInfoList[s + 1];
                const subInstData = subDataLists[s];
                if (subInstData && subData) {
                    subInstData[offset] = cand.x + subData.offsetX * cand.scaleXZ;
                    subInstData[offset + 1] = cand.z + subData.offsetZ * cand.scaleXZ;
                    subInstData[offset + 2] = cand.rotY + subData.offsetRotY;
                    subInstData[offset + 3] = cand.scaleXZ * subData.offsetScaleX;
                    subInstData[offset + 4] = cand.scaleY * subData.offsetScaleY;
                    subInstData[offset + 5] = cand.windOffset;
                    subInstData[offset + 6] = targetY;
                }
            }
        }

        this.markInstanceDataDirty();
        for (const subMesh of this.#subVegetationMeshes) {
            subMesh.markInstanceDataDirty();
        }
    }
}

export default VegetationMesh;
