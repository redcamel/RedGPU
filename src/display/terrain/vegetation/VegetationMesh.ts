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
import cullVegetationSource from "./shader/cullVegetation.wgsl";
import {mat4} from "gl-matrix";

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
    boundingRadius?: number;
    meshRotationOffset?: [number, number, number];
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
    node: any;
    geometry: Geometry | Primitive;
    material: any;
    offsetX: number;
    offsetY: number;
    offsetZ: number;
}

class VegetationMesh extends ProceduralInstancingMesh {
    #terrain: Terrain;
    #rawCandidatePool: RawCandidate[] = [];
    #activeCandidates: RawCandidate[] = [];
    #tileToCandidateMap: Map<string, RawCandidate[]> = new Map();
    #loadedTilesSet: Set<string> = new Set();
    #subVegetationMeshes: ProceduralInstancingMesh[] = [];
    #subMeshDataList: SubMeshData[] = [];

    // Group(3) Vertex Uniforms
    #vegetationUniformBuffer: StorageBuffer;
    #vegetationBindGroup: GPUBindGroup;
    #vegetationBindGroupLayout: GPUBindGroupLayout;
    #vegetationUniformData: Float32Array;

    // Compute Culling Pipelines & Buffers
    #cullPipeline: GPUComputePipeline;
    #cullBindGroup: GPUBindGroup;
    #cullBindGroupLayout: GPUBindGroupLayout;
    #cullUniformBuffer: StorageBuffer;
    #frustumPlanesBuffer: StorageBuffer;
    #cullUniformData: Float32Array = new Float32Array(8);
    #frustumPlanesData: Float32Array = new Float32Array(24); // 6 planes * vec4

    #windStrength: number = 0.08;
    #maskChannel: 'r' | 'g' | 'b' | 'a' = 'g';
    #maskThreshold: number = 0.2;
    #splatImageData: ImageData | null = null;
    #splatWidth: number = 0;
    #splatHeight: number = 0;
    #baseScale: number = 1.0;
    #totalCount: number = 20000;
    #startTime: number = performance.now();
    #meshRotationOffset: [number, number, number] = [0, 0, 0];
    #baseModelMatrix: Float32Array = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
    ]);

    constructor(redGPUContext: RedGPUContext, terrain: Terrain, countOrOptions: number | VegetationMeshOptions = 20000) {
        const options: VegetationMeshOptions = typeof countOrOptions === 'number' ? {count: countOrOptions} : countOrOptions;
        const totalCount = options.count ?? 20000;
        const grassSize = options.grassSize ?? [1.5, 3.0];
        const baseScale = options.baseScale ?? 1.0;

        let geometry = options.geometry;
        let material = options.material;
        const subMeshList: SubMeshData[] = [];

        if (options.gltfMesh) {
            VegetationMesh.#extractGLTFSubMeshes(options.gltfMesh, subMeshList);
            if (subMeshList.length > 0) {
                geometry = subMeshList[0].geometry;
                material = subMeshList[0].material;
            }
        }

        if (!geometry) geometry = new Plane(redGPUContext, grassSize[0], grassSize[1]);
        if (!material) material = new PBRMaterial(redGPUContext);

        VegetationMesh.#setupVegetationMaterial(material);

        super(redGPUContext, totalCount, geometry, material);


        this.#terrain = terrain;
        this.#subMeshDataList = subMeshList;
        this.#windStrength = options.windStrength ?? 0.08;
        this.#maskChannel = options.maskChannel ?? 'g';
        this.#maskThreshold = options.maskThreshold ?? 0.2;
        this.maxDistance = options.maxDistance ?? 1500;
        this.startFadeDistance = options.startFadeDistance ?? (this.maxDistance * 0.8);
        this.windMaxDistance = options.windMaxDistance ?? 300;
        this.boundingRadius = options.boundingRadius ?? 3.0;
        this.#meshRotationOffset = options.meshRotationOffset ?? [0, 0, 0];
        this.#baseScale = baseScale;
        this.#totalCount = totalCount;

        const targetNode = subMeshList.length > 0 ? subMeshList[0].node : options.gltfMesh;
        if (targetNode) {
            const RADIAN = Math.PI / 180;
            const chain: any[] = [];
            let cur: any = targetNode;
            while (cur) {
                chain.unshift(cur);
                cur = cur.parent;
            }

            const rotMat = mat4.create();
            for (const node of chain) {
                const nodeRot = mat4.create();
                mat4.rotateX(nodeRot, nodeRot, (node.rotationX || 0) * RADIAN);
                mat4.rotateY(nodeRot, nodeRot, (node.rotationY || 0) * RADIAN);
                mat4.rotateZ(nodeRot, nodeRot, (node.rotationZ || 0) * RADIAN);
                mat4.multiply(rotMat, rotMat, nodeRot);
            }
            this.#baseModelMatrix = new Float32Array(rotMat);
        }

        const splatUrl = options.splatUrl || '../../../assets/terrain/terrainTest_001/splatMap.jpg';
        if (splatUrl) this.#initSplatImage(splatUrl);

        this.#vegetationUniformData = new Float32Array(24);
        this.#vegetationUniformBuffer = new StorageBuffer(
            redGPUContext,
            this.#vegetationUniformData.buffer as ArrayBuffer,
            `VegetationUniformBuffer_${this.uuid}`
        );
        this.#initVegetationBindGroup(redGPUContext);
        this.#initCullResources(redGPUContext);

        this.#rebuildCandidates();
    }

    static #extractGLTFSubMeshes(
        node: any,
        outList: SubMeshData[],
        parentX = 0, parentY = 0, parentZ = 0
    ) {
        if (!node) return;
        const curX = parentX + (node.x || 0);
        const curY = parentY + (node.y || 0);
        const curZ = parentZ + (node.z || 0);

        if (node.geometry && node.material) {
            outList.push({
                node,
                geometry: node.geometry,
                material: node.material,
                offsetX: curX,
                offsetY: curY,
                offsetZ: curZ,
            });
        }

        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                VegetationMesh.#extractGLTFSubMeshes(child, outList, curX, curY, curZ);
            }
        }
    }

    render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false): void {
        this.#updateVegetationUniforms();

        // 렌더 패스 진입 직전 Compute Culling Dispatch 수행
        if (this.instanceCount > 0) {
            this.#dispatchCullCompute(renderViewStateData);
        }

        super.render(renderViewStateData, shadowRender);
    }

    #initCullResources(redGPUContext: RedGPUContext): void {
        const {gpuDevice, resourceManager} = redGPUContext;

        this.#cullUniformBuffer = new StorageBuffer(
            redGPUContext,
            this.#cullUniformData.buffer as ArrayBuffer,
            `VegetationCullUniform_${this.uuid}`
        );

        this.#frustumPlanesBuffer = new StorageBuffer(
            redGPUContext,
            this.#frustumPlanesData.buffer as ArrayBuffer,
            `VegetationFrustumPlanes_${this.uuid}`
        );

        const cullShaderModule = resourceManager.createGPUShaderModule(
            `VegetationCullModule_${this.uuid}`,
            {code: cullVegetationSource}
        );

        this.#cullBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `VegetationCullBGL_${this.uuid}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                // {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
            ]
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `VegetationCullPipelineLayout_${this.uuid}`,
            bindGroupLayouts: [this.#cullBindGroupLayout]
        });

        this.#cullPipeline = gpuDevice.createComputePipeline({
            label: `VegetationCullPipeline_${this.uuid}`,
            layout: pipelineLayout,
            compute: {
                module: cullShaderModule,
                entryPoint: 'main',
            }
        });

        this.#cullBindGroup = gpuDevice.createBindGroup({
            label: `VegetationCullBG_${this.uuid}`,
            layout: this.#cullBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.rawInstanceMatrixBuffer.gpuBuffer}},
                {binding: 1, resource: {buffer: this.culledInstanceMatrixBuffer.gpuBuffer}},
                {binding: 2, resource: {buffer: this.indirectBuffer}},
                {binding: 3, resource: {buffer: this.#cullUniformBuffer.gpuBuffer}},
                {binding: 4, resource: {buffer: this.#frustumPlanesBuffer.gpuBuffer}},
            ]
        });
    }

    #dispatchCullCompute(renderViewStateData: RenderViewStateData): void {
        const {view} = renderViewStateData;
        const camera = view.rawCamera;

        // 1. Cull Uniform 갱신
        const u = this.#cullUniformData;
        u[0] = this.instanceCount;
        u[1] = this.maxDistance * this.maxDistance;
        u[2] = this.boundingRadius;
        u[3] = this.#terrain.minHeight;
        u[4] = this.#terrain.maxHeight;
        u[5] = camera.x;
        u[6] = camera.y;
        u[7] = camera.z;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#cullUniformBuffer.gpuBuffer,
            0,
            u.buffer as ArrayBuffer
        );

        // 2. Projection-View 행렬로부터 절두체 6개 평면 추출
        const test = mat4.create()
        mat4.multiply(test, view.projectionMatrix, view.rawCamera.viewMatrix)
        this.#extractFrustumPlanes(test as Float32Array);
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#frustumPlanesBuffer.gpuBuffer,
            0,
            this.#frustumPlanesData.buffer as ArrayBuffer
        );

        // 3. Indirect Buffer instanceCount 카운터 0으로 리셋
        const geo = this.geometry as any;
        const indexCount = geo.indexBuffer?.count ?? geo.indexBuffer?.indexCount ?? 0;
        this.resetIndirectArgs(indexCount);

        // 4. Compute Pass 실행
        const commandEncoder = this.redGPUContext.gpuDevice.createCommandEncoder({
            label: `VegetationCullCommandEncoder_${this.uuid}`
        });
        const computePass = commandEncoder.beginComputePass({
            label: `VegetationCullComputePass_${this.uuid}`
        });

        computePass.setPipeline(this.#cullPipeline);
        computePass.setBindGroup(0, this.#cullBindGroup);
        const workgroupCount = Math.ceil(this.instanceCount / 64);
        computePass.dispatchWorkgroups(workgroupCount);
        computePass.end();

        this.redGPUContext.gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    static #setupVegetationMaterial(mat: any) {
        if (!mat) return;
        if ('useAlphaMode' in mat) mat.useAlphaMode = true;
        if ('alphaCutoff' in mat && (mat.alphaCutoff === undefined || mat.alphaCutoff === 0)) mat.alphaCutoff = 0.3;
        if ('cullMode' in mat) mat.cullMode = 'none';
        if ('doubleSided' in mat) mat.doubleSided = true;
    }

    #extractFrustumPlanes(pvMatrix: Float32Array): void {
        const m = pvMatrix;
        const p = this.#frustumPlanesData;

        // Left, Right, Bottom, Top, Near, Far planes 추출 및 정규화
        const rawPlanes = [
            [m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]],  // Left
            [m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]],  // Right
            [m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]],  // Bottom
            [m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]],  // Top
            [m[2], m[6], m[10], m[14]],         // Near (WebGPU 0..1 Z)
            [m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14]], // Far
        ];

        for (let i = 0; i < 6; i++) {
            const pl = rawPlanes[i];
            const len = Math.hypot(pl[0], pl[1], pl[2]);
            const invLen = len > 0 ? 1.0 / len : 0;
            p[i * 4 + 0] = pl[0] * invLen;
            p[i * 4 + 1] = pl[1] * invLen;
            p[i * 4 + 2] = pl[2] * invLen;
            p[i * 4 + 3] = pl[3] * invLen;
        }
    }

    onTileLoaded(tile: SpatialTileInfo): void {
        const key = tile.atlasKey || `${tile.tileCol}_${tile.tileRow}`;
        if (this.#loadedTilesSet.has(key)) return;
        this.#loadedTilesSet.add(key);

        const targetCandidates = this.#tileToCandidateMap.get(key);
        if (!targetCandidates || targetCandidates.length === 0) return;

        this.#appendTileInstances(targetCandidates);
    }

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
                    this.#rebuildCandidates();
                    this.forceUpdate();
                }
            } catch (e) {
                console.warn('[VegetationMesh] splatMap 디코딩 실패:', e);
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
        let channelIdx = 1;
        if (this.#maskChannel === 'r') channelIdx = 0;
        else if (this.#maskChannel === 'b') channelIdx = 2;
        else if (this.#maskChannel === 'a') channelIdx = 3;

        return this.#splatImageData.data[idx + channelIdx] / 255.0;
    }

    #rebuildCandidates(): void {
        this.#rawCandidatePool = [];
        this.#tileToCandidateMap.clear();

        const [worldW, worldH] = this.#terrain.worldSize;
        const [offX, offZ] = this.#terrain.worldOffset;
        let created = 0, attempts = 0;
        const maxAttempts = this.#totalCount * 10;

        while (created < this.#totalCount && attempts < maxAttempts) {
            attempts++;
            const x = offX + Math.random() * worldW;
            const z = offZ + Math.random() * worldH;

            if (this.#splatImageData && this.#getMaskValueAt(x, z) < this.#maskThreshold) {
                continue;
            }

            const u = Math.max(0, Math.min(1, (x - offX) / worldW));
            const v = Math.max(0, Math.min(1, (z - offZ) / worldH));
            const tileCol = Math.max(0, Math.min(15, Math.floor(u * 16)));
            const tileRow = Math.max(0, Math.min(15, Math.floor((1 - v) * 16)));
            const tileKey = `${tileCol}_${tileRow}`;

            const rotY = Math.random() * Math.PI * 2;
            const s = (0.8 + Math.random() * 0.5) * this.#baseScale;

            const cand: RawCandidate = {
                x, z, rotY,
                scaleXZ: s,
                scaleY: s * (0.85 + Math.random() * 0.4),
                windOffset: Math.random() * Math.PI * 2,
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
                {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {sampleType: 'float', viewDimension: '2d'}},
            ]
        });

        this.#vegetationBindGroup = gpuDevice.createBindGroup({
            label: `VegetationBindGroup_${this.uuid}`,
            layout: this.#vegetationBindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: this.#vegetationUniformBuffer.gpuBuffer}},
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
        d.set(this.#baseModelMatrix, 8);

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

        const mainData = this.instanceData;
        const mainSubData = this.#subMeshDataList[0];
        const mainOffX = mainSubData ? mainSubData.offsetX : 0;
        const mainOffZ = mainSubData ? mainSubData.offsetZ : 0;

        for (let i = startIndex; i < newTotal; i++) {
            const cand = this.#activeCandidates[i];
            const s = cand.scaleXZ;
            const sy = cand.scaleY;
            const bm = this.#baseModelMatrix;

            const offset = i * 16;
            mainData[offset + 0] = bm[0] * s;
            mainData[offset + 1] = bm[1] * s;
            mainData[offset + 2] = bm[2] * s;
            mainData[offset + 3] = bm[3] * s;
            mainData[offset + 4] = bm[4] * sy;
            mainData[offset + 5] = bm[5] * sy;
            mainData[offset + 6] = bm[6] * sy;
            mainData[offset + 7] = bm[7] * sy;
            mainData[offset + 8] = bm[8] * s;
            mainData[offset + 9] = bm[9] * s;
            mainData[offset + 10] = bm[10] * s;
            mainData[offset + 11] = bm[11] * s;
            mainData[offset + 12] = cand.x + mainOffX;
            mainData[offset + 13] = 0;
            mainData[offset + 14] = cand.z + mainOffZ;
            mainData[offset + 15] = 1.0;
        }

        this.markInstanceDataDirty();
    }
}

export default VegetationMesh;