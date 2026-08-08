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
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

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
    alphaCutoff?: number;
    cutOff?: number;
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
    relativeMatrix: Float32Array;
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
    #baseScale: number = 1.0;
    #totalCount: number = 20000;
    #startTime: number = performance.now();
    #meshRotationOffset: [number, number, number] = [0, 0, 0];
    #baseModelMatrix: Float32Array = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1
    ]);

    #pvMatrixTemp: mat4 = mat4.create();
    #tempCandMat: mat4 = mat4.create();
    #tempFinalMat: mat4 = mat4.create();

    render(renderViewStateData: RenderViewStateData, shadowRender: boolean = false): void {
        this.#updateVegetationUniforms();

        // 렌더 패스 진입 직전 Compute Culling Dispatch 수행
        if (this.instanceCount > 0) {
            this.#dispatchCullCompute(renderViewStateData);
        }

        super.render(renderViewStateData, shadowRender);
    }

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

        const alphaCutoff = options.alphaCutoff ?? options.cutOff ?? 0.01;
        if (subMeshList.length > 0) {
            for (const subItem of subMeshList) {
                VegetationMesh.#setupVegetationMaterial(subItem.material, alphaCutoff);
            }
        }
        if (material) {
            VegetationMesh.#setupVegetationMaterial(material, alphaCutoff);
        }

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

        // 지오메트리 원본 반경 및 relativeMatrix Offset, baseScale 기반 boundingRadius 동적 자동 산출
        if (options.boundingRadius !== undefined) {
            this.boundingRadius = options.boundingRadius;
        } else {
            let maxGeomRadius = 0;
            const subItems = subMeshList.length > 0 ? subMeshList : [{
                node: null,
                geometry,
                material: null,
                relativeMatrix: null
            }];
            for (const item of subItems) {
                if (item && item.geometry) {
                    const vol = (item.geometry as any).volume;
                    if (vol) {
                        const relMat = item.relativeMatrix;
                        let nodeOffset = 0;
                        if (relMat) {
                            nodeOffset = Math.hypot(relMat[12] || 0, relMat[13] || 0, relMat[14] || 0);
                        }
                        const centerDist = Math.hypot(vol.centerX || 0, vol.centerY || 0, vol.centerZ || 0);
                        const r = (vol.geometryRadius || 0) + centerDist + nodeOffset;
                        if (r > maxGeomRadius) maxGeomRadius = r;
                    }
                }
            }
            // 기본 지오메트리 반경에 baseScale과 최대 인스턴스 스케일 안전 마진(1.8배) 반영
            const computedRadius = maxGeomRadius > 0 ? maxGeomRadius * baseScale * 1.8 : 4.0;
            this.boundingRadius = computedRadius;
        }

        this.#meshRotationOffset = options.meshRotationOffset ?? [0, 0, 0];
        this.#totalCount = totalCount;

        if (subMeshList.length > 1) {
            for (let i = 1; i < subMeshList.length; i++) {
                const subItem = subMeshList[i];
                const subInstMesh = new SubVegetationMesh(
                    redGPUContext,
                    totalCount,
                    subItem.geometry,
                    subItem.material,
                    this
                );
                subInstMesh.boundingRadius = this.boundingRadius;
                this.#subVegetationMeshes.push(subInstMesh);
                this.addChild(subInstMesh);
            }
        }

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

        // splatUrl은 더이상 CPU에서 로드하지 않고 GPU 쉐이더로 바인딩하여 처리하므로 로컬 이미지는 생성하지 않음.

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

    static #getNodeLocalMatrix(node: any): mat4 {
        const out = mat4.create();
        const RADIAN = Math.PI / 180;
        const x = node.x || 0;
        const y = node.y || 0;
        const z = node.z || 0;
        const rx = (node.rotationX || 0) * RADIAN;
        const ry = (node.rotationY || 0) * RADIAN;
        const rz = (node.rotationZ || 0) * RADIAN;
        const sx = node.scaleX ?? 1;
        const sy = node.scaleY ?? 1;
        const sz = node.scaleZ ?? 1;

        mat4.translate(out, out, [x, y, z]);
        if (rx) mat4.rotateX(out, out, rx);
        if (ry) mat4.rotateY(out, out, ry);
        if (rz) mat4.rotateZ(out, out, rz);
        if (sx !== 1 || sy !== 1 || sz !== 1) mat4.scale(out, out, [sx, sy, sz]);

        return out;
    }

    static #extractGLTFSubMeshes(
        node: any,
        outList: SubMeshData[],
        parentMatrix?: mat4
    ) {
        if (!node) return;

        const localMat = VegetationMesh.#getNodeLocalMatrix(node);
        const worldMat = mat4.create();
        if (parentMatrix) {
            mat4.multiply(worldMat, parentMatrix, localMat);
        } else {
            mat4.copy(worldMat, localMat);
        }

        if (node.geometry && node.material) {
            outList.push({
                node,
                geometry: node.geometry,
                material: node.material,
                relativeMatrix: new Float32Array(worldMat),
            });
        }

        if (node.children && Array.isArray(node.children)) {
            for (const child of node.children) {
                VegetationMesh.#extractGLTFSubMeshes(child, outList, worldMat);
            }
        }
    }

    static #setupVegetationMaterial(mat: any, cutoff: number = 0.3) {
        if (!mat) return;
        if ('useCutOff' in mat) {
            mat.useCutOff = true;
            if (mat.cutOff === undefined || mat.cutOff === 0) {
                mat.cutOff = cutoff;
            }
        }
        if ('alphaBlend' in mat) {
            mat.alphaBlend = 1; // 1 = MASK (Alpha Cutoff Mode)
        }
        if ('transparent' in mat) mat.transparent = false;
        if ('cullMode' in mat) mat.cullMode = 'none';
        if ('doubleSided' in mat) mat.doubleSided = true;
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
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 8, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 9, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 10, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
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

        const createCullBindGroup = (targetMesh: ProceduralInstancingMesh, labelName: string) => {
            const splatTex = (this.#terrain?.material as any)?.splatTexture;
            return gpuDevice.createBindGroup({
                label: labelName,
                layout: this.#cullBindGroupLayout,
                entries: [
                    {binding: 0, resource: {buffer: targetMesh.rawInstanceMatrixBuffer.gpuBuffer}},
                    {binding: 1, resource: {buffer: targetMesh.culledInstanceIndexBuffer.gpuBuffer}},
                    {binding: 2, resource: {buffer: targetMesh.indirectBuffer}},
                    {binding: 3, resource: {buffer: this.#cullUniformBuffer.gpuBuffer}},
                    {binding: 4, resource: {buffer: this.#frustumPlanesBuffer.gpuBuffer}},
                    {binding: 5, resource: {buffer: targetMesh.culledInstanceHeightBuffer.gpuBuffer}},
                    {binding: 6, resource: {buffer: this.#vegetationUniformBuffer.gpuBuffer}},
                    {
                        binding: 7,
                        resource: this.#terrain.heightmapSampler?.gpuSampler
                            || resourceManager.basicDisplacementSampler.gpuSampler
                    },
                    {
                        binding: 8,
                        resource: resourceManager.getGPUResourceBitmapTextureView(this.#terrain.heightmapAtlasTexture)
                            || resourceManager.emptyBitmapTextureView
                    },
                    {
                        binding: 9,
                        resource: this.#terrain.heightmapSampler?.gpuSampler
                            || resourceManager.basicDisplacementSampler.gpuSampler
                    },
                    {
                        binding: 10,
                        resource: splatTex ? resourceManager.getGPUResourceBitmapTextureView(splatTex) : resourceManager.emptyBitmapTextureView
                    },
                ]
            });
        };

        this.#cullBindGroup = createCullBindGroup(this, `VegetationCullBG_${this.uuid}`);
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

    // splatImage 및 getMaskValueAt 메서드 제거됨 (GPU 마스킹 이관)

    #dispatchCullCompute(renderViewStateData: RenderViewStateData): void {
        const {view} = renderViewStateData;
        const camera = view.rawCamera;

        // 1. Cull Uniform 갱신
        let channelNum = 1; // default 'g'
        if (this.#maskChannel === 'r') channelNum = 0;
        else if (this.#maskChannel === 'b') channelNum = 2;
        else if (this.#maskChannel === 'a') channelNum = 3;

        const u = this.#cullUniformData;
        u[0] = this.instanceCount;
        u[1] = this.maxDistance * this.maxDistance;
        u[2] = this.boundingRadius;
        u[3] = camera.x;
        u[4] = camera.y;
        u[5] = camera.z;
        u[6] = this.#maskThreshold;
        u[7] = channelNum;

        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#cullUniformBuffer.gpuBuffer,
            0,
            u.buffer as ArrayBuffer
        );

        // 2. Projection-View 행렬로부터 절두체 6개 평면 추출
        mat4.multiply(this.#pvMatrixTemp, view.projectionMatrix, view.rawCamera.viewMatrix);
        this.#extractFrustumPlanes(this.#pvMatrixTemp as Float32Array);
        this.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#frustumPlanesBuffer.gpuBuffer,
            0,
            this.#frustumPlanesData.buffer as ArrayBuffer
        );

        // 3. CommandEncoderManager를 사용하여 메인 인코더 파이프라인에 병합
        this.redGPUContext.commandEncoderManager.useEncoder(
            COMMAND_ENCODER_TYPE.PRE_PROCESS,
            (commandEncoder) => {
                const computePass = commandEncoder.beginComputePass({
                    label: `VegetationCullComputePass_${this.uuid}`
                });

                computePass.setPipeline(this.#cullPipeline);
                const workgroupCount = Math.ceil(this.instanceCount / 64);

                // 메인 메쉬 컬링 (1회 실행으로 최종 개수 산출)
                const geo = this.geometry as any;
                const indexCount = geo.indexBuffer?.count ?? geo.indexBuffer?.indexCount ?? 0;
                this.resetIndirectArgs(indexCount);

                computePass.setBindGroup(0, this.#cullBindGroup);
                computePass.dispatchWorkgroups(workgroupCount);

                computePass.end();

                // 4. 서브 메쉬들의 indirectBuffer.instanceCount 필드를 부모의 결과값으로 복사하여 컬링 패스 완전 스킵
                for (const subMesh of this.#subVegetationMeshes) {
                    if (subMesh.instanceCount > 0) {
                        const subGeo = subMesh.geometry as any;
                        const subIndexCount = subGeo.indexBuffer?.count ?? subGeo.indexBuffer?.indexCount ?? 0;
                        subMesh.resetIndirectArgs(subIndexCount);

                        // 부모의 indirectBuffer[4..7] (instanceCount)를 자식의 indirectBuffer[4..7]로 직접 복사
                        commandEncoder.copyBufferToBuffer(
                            this.indirectBuffer,
                            4,
                            subMesh.indirectBuffer,
                            4,
                            4
                        );
                    }
                }
            }
        );
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

    #extractFrustumPlanes(pvMatrix: Float32Array): void {
        const m = pvMatrix;
        const p = this.#frustumPlanesData;

        // Left, Right, Bottom, Top, Near, Far planes
        p[0] = m[3] + m[0];
        p[1] = m[7] + m[4];
        p[2] = m[11] + m[8];
        p[3] = m[15] + m[12];
        p[4] = m[3] - m[0];
        p[5] = m[7] - m[4];
        p[6] = m[11] - m[8];
        p[7] = m[15] - m[12];
        p[8] = m[3] + m[1];
        p[9] = m[7] + m[5];
        p[10] = m[11] + m[9];
        p[11] = m[15] + m[13];
        p[12] = m[3] - m[1];
        p[13] = m[7] - m[5];
        p[14] = m[11] - m[9];
        p[15] = m[15] - m[13];
        p[16] = m[2];
        p[17] = m[6];
        p[18] = m[10];
        p[19] = m[14];
        p[20] = m[3] - m[2];
        p[21] = m[7] - m[6];
        p[22] = m[11] - m[10];
        p[23] = m[15] - m[14];

        for (let i = 0; i < 6; i++) {
            const idx = i * 4;
            const len = Math.hypot(p[idx], p[idx + 1], p[idx + 2]);
            const invLen = len > 0 ? 1.0 / len : 0;
            p[idx] *= invLen;
            p[idx + 1] *= invLen;
            p[idx + 2] *= invLen;
            p[idx + 3] *= invLen;
        }
    }

    #rebuildCandidates(): void {
        this.#rawCandidatePool = [];
        this.#tileToCandidateMap.clear();

        const [worldW, worldH] = this.#terrain.worldSize;
        const [offX, offZ] = this.#terrain.worldOffset;
        let created = 0, attempts = 0;
        const maxAttempts = this.#totalCount * 10;

        // Fast Mulberry32 PRNG for zero-GC procedural placement
        let seed = 1337;
        const prng = () => {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };

        while (created < this.#totalCount) {
            const rx = prng();
            const rz = prng();
            const x = offX + rx * worldW;
            const z = offZ + rz * worldH;

            const u = Math.max(0, Math.min(1, (x - offX) / worldW));
            const v = Math.max(0, Math.min(1, (z - offZ) / worldH));
            const tileCol = Math.max(0, Math.min(15, Math.floor(u * 16)));
            const tileRow = Math.max(0, Math.min(15, Math.floor((1 - v) * 16)));
            const tileKey = `${tileCol}_${tileRow}`;

            const rotY = prng() * Math.PI * 2;
            const s = (0.8 + prng() * 0.5) * this.#baseScale;

            const cand: RawCandidate = {
                x, z, rotY,
                scaleXZ: s,
                scaleY: s * (0.85 + prng() * 0.4),
                windOffset: prng() * Math.PI * 2,
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

    #appendTileInstances(candidates: RawCandidate[]): void {
        const startIndex = this.#activeCandidates.length;
        for (let i = 0; i < candidates.length; i++) {
            this.#activeCandidates.push(candidates[i]);
        }

        const newTotal = this.#activeCandidates.length;
        const subCount = Math.max(1, this.#subMeshDataList.length);
        const RADIAN = Math.PI / 180;
        const meshRotX = this.#meshRotationOffset[0] * RADIAN;
        const meshRotY = this.#meshRotationOffset[1] * RADIAN;
        const meshRotZ = this.#meshRotationOffset[2] * RADIAN;

        for (let sIdx = 0; sIdx < subCount; sIdx++) {
            const subData = this.#subMeshDataList[sIdx];
            const targetMesh: ProceduralInstancingMesh = sIdx === 0 ? this : this.#subVegetationMeshes[sIdx - 1];
            if (!targetMesh) continue;

            targetMesh.instanceCount = newTotal;
            const mainData = targetMesh.instanceData;
            const subRelMat = subData ? subData.relativeMatrix : null;

            for (let i = startIndex; i < newTotal; i++) {
                const cand = this.#activeCandidates[i];

                mat4.identity(this.#tempCandMat);
                mat4.translate(this.#tempCandMat, this.#tempCandMat, [cand.x, 0, cand.z]);
                mat4.rotateY(this.#tempCandMat, this.#tempCandMat, cand.rotY);
                if (meshRotX) mat4.rotateX(this.#tempCandMat, this.#tempCandMat, meshRotX);
                if (meshRotY) mat4.rotateY(this.#tempCandMat, this.#tempCandMat, meshRotY);
                if (meshRotZ) mat4.rotateZ(this.#tempCandMat, this.#tempCandMat, meshRotZ);
                mat4.scale(this.#tempCandMat, this.#tempCandMat, [cand.scaleXZ, cand.scaleY, cand.scaleXZ]);

                if (subRelMat) {
                    mat4.multiply(this.#tempFinalMat, this.#tempCandMat, subRelMat as mat4);
                } else {
                    mat4.copy(this.#tempFinalMat, this.#tempCandMat);
                }

                const offset = i * 16;
                mainData.set(this.#tempFinalMat, offset);
            }

            targetMesh.markInstanceDataDirty(startIndex, newTotal - startIndex);
        }
    }
}

class SubVegetationMesh extends ProceduralInstancingMesh {
    #parentVegetation: VegetationMesh;

    constructor(
        redGPUContext: RedGPUContext,
        totalCount: number,
        geometry: Geometry | Primitive,
        material: any,
        parentVegetation: VegetationMesh
    ) {
        // 자체 메모리 중복 할당 방지를 위해 super 생성자에는 최소 크기(1)만 전달
        super(redGPUContext, 1, geometry, material);
        this.#parentVegetation = parentVegetation;
    }

    get maxInstanceCount(): number {
        return this.#parentVegetation ? this.#parentVegetation.maxInstanceCount : 1;
    }

    get rawInstanceMatrixBuffer(): StorageBuffer {
        return this.#parentVegetation ? this.#parentVegetation.rawInstanceMatrixBuffer : super.rawInstanceMatrixBuffer;
    }

    get instanceData(): Float32Array {
        return this.#parentVegetation ? this.#parentVegetation.instanceData : super.instanceData;
    }

    get culledInstanceIndexBuffer(): StorageBuffer {
        return this.#parentVegetation ? this.#parentVegetation.culledInstanceIndexBuffer : super.culledInstanceIndexBuffer;
    }

    get culledInstanceHeightBuffer(): StorageBuffer {
        return this.#parentVegetation ? this.#parentVegetation.culledInstanceHeightBuffer : super.culledInstanceHeightBuffer;
    }

    get vertexBindGroup(): GPUBindGroup {
        return this.#parentVegetation ? this.#parentVegetation.vertexBindGroup : super.vertexBindGroup;
    }

    flushInstanceData(): void {
        // 자식 메쉬는 자체 버퍼를 flush하지 않고 부모가 이미 업로드한 데이터를 공유하므로 스킵합니다.
    }

    protected getVertexShaderSource(): string {
        return vegetationVertexSource;
    }

    protected getExtraBindGroupLayouts(): GPUBindGroupLayout[] {
        return (this.#parentVegetation as any).getExtraBindGroupLayouts();
    }

    protected getExtraBindGroups(): GPUBindGroup[] {
        return (this.#parentVegetation as any).getExtraBindGroups();
    }

    protected getHeightmapTexture(): any {
        return null;
    }

    protected getHeightmapSampler(): any {
        return null;
    }

    protected getSplatTexture(): any {
        return null;
    }
}

export default VegetationMesh;