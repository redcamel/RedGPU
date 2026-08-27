import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import FoliageInstanceBuffer from "./FoliageInstanceBuffer";
import type {FoliageDepthPassMode} from "./core/pipeline/FoliagePipelineRegistry";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import type LandscapeFoliageManager from "./LandscapeFoliageManager";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";

export interface FoliageSubMesh {
    mesh: Mesh;
    geometry: Geometry;
    material: ABaseMaterial | any;
    indexCount: number;
    vertexCount: number;
    isIndexed: boolean;
    indexFormat?: GPUIndexFormat;
    strideBytes: number;
    bottomOffset: number;
    relativeModelMatrix: mat4;
    relativeNormalMatrix: mat4;
    vertexUniformBuffer: GPUBuffer;
    vertexUniformBindGroup: GPUBindGroup;
    lodIndex: number;

    isDepthPrepass: boolean;
    isMainOpaqueOrMasked: boolean;
    mainDepthMode: FoliageDepthPassMode;
    isAlpha: boolean;
    isTransparent: boolean;
    isImpostor?: boolean;
    impostorWidth?: number;
    impostorHeight?: number;

    instanceBufferOffset: number;
    indirectOffsetBytes: number;
    pipelineCache?: Map<string, GPURenderPipeline>;
}

export interface FoliageLODConfig {
    /** The 3D mesh (or mesh hierarchy) to render at this LOD level */
    mesh: Mesh | Mesh[];

    /** LOD switch distance in meters (e.g. 40.0) */
    lodDistance?: number;
}

export interface FoliageLODInfo {
    lodIndex: number;
    lodDistance: number;
    subMeshOffset: number;
    subMeshCount: number;
}

export interface FoliageTypeOptions {
    name: string;

    /** Array of user-defined LOD configurations (LOD 0 to LOD 7) */
    lods: FoliageLODConfig[];

    maxInstances?: number;

    cullingDistance?: number;
    fadeStartDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    /** Whether to automatically generate and use an octahedral impostor at the end of the LOD chain (default: true) */
    useImpostor?: boolean;

    convertBlendToMasked?: boolean;

    isFoliage?: boolean;
}

class FoliageType {
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #instanceBuffer: FoliageInstanceBuffer;

    #activeInstanceCount: number = 0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #numLODs: number = 1;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<string> = new Set();

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        foliageManager?: LandscapeFoliageManager | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;

        const useImpostor = options.useImpostor !== false;

        const minScale: [number, number, number] = options.minScale ? [...options.minScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = options.maxScale ? [...options.maxScale] : [1.0, 1.0, 1.0];

        this.#options = Object.freeze({
            name: options.name,
            lods: options.lods,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: options.cullingDistance ?? 2000.0,
            fadeStartDistance: options.fadeStartDistance ?? 1500.0,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor,
            convertBlendToMasked: options.convertBlendToMasked ?? true,
            isFoliage: options.isFoliage !== false,
        });

        let hash = 0;
        const nameStr = this.#options.name || '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            this.#options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lodInfoList = assembleResult.lodInfoList || [];
        this.#bottomOffset = assembleResult.bottomOffset ?? 0;
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;

        const hasImpostor = this.#options.useImpostor !== false;
        this.#numLODs = this.#lodInfoList.length > 0 ? Math.min(this.#lodInfoList.length, 8) : (hasImpostor ? 2 : 1);
        const lod0SubCount = this.#lodInfoList[0]?.subMeshCount ?? this.#subMeshes.length;
        const lod0Dist = this.#lodInfoList[0]?.lodDistance ?? 80.0;

        this.#instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.#options.maxInstances, this.#subMeshes);
        this.#instanceBuffer.initStaticLODUniforms(
            this.#lodInfoList,
            lod0Dist,
            lod0SubCount,
            hasImpostor,
            this.#options.cullingDistance ?? 2000.0
        );
        this.resetIndirectBuffer();
    }

    get name(): string {
        return this.#options.name;
    }

    get nameHash(): number {
        return this.#nameHash;
    }

    get options(): FoliageTypeOptions {
        return this.#options;
    }

    get subMeshes(): readonly FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get lodInfoList(): readonly FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#instanceBuffer.culledGPUBuffer;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#instanceBuffer.indirectGPUBuffer;
    }

    getCullingBindGroup(layout: GPUBindGroupLayout, vhtView?: GPUTextureView, vhtSampler?: GPUSampler): GPUBindGroup | null {
        return this.#instanceBuffer.getOrCreateCullingBindGroup(layout, vhtView, vhtSampler);
    }

    updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        frustumPlanes: number[][] | null,
        fovFactor: number
    ): void {
        this.#instanceBuffer.updateCullingUniforms(
            camX, camY, camZ,
            this.#options.cullingDistance ?? 2000.0,
            this.#options.fadeStartDistance ?? 1500.0,
            this.#activeInstanceCount,
            this.#boundingRadius,
            worldSizeX, heightScale,
            this.#bottomOffset,
            hasVHT,
            frustumPlanes,
            fovFactor,
            this.#numLODs
        );
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0, subId: number = 0
    ): void {
        this.#instanceBuffer.setInstanceData(index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade, subId);
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        this.#instanceBuffer.uploadRangeToGPU(startIndex, count);
    }

    resetIndirectBuffer(): void {
        if (!this.#instanceBuffer || this.#subMeshes.length === 0) return;
        this.#instanceBuffer.resetMultiIndirectCount(this.#subMeshes);
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);
        this.#instanceBuffer.writeSubData(data.subarray(0, this.#activeInstanceCount * 12));
        this.#instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        this.resetIndirectBuffer();
    }

    populateTile(comp: any, landscape?: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        const addedCount = FoliageTilePopulator.populateTile(comp, this, landscape, targetCountPerTile);
        if (addedCount > 0) {
            this.#activeInstanceCount = Math.min(this.#activeInstanceCount + addedCount, this.#options.maxInstances);
        }
    }

    destroy(): void {
        this.#instanceBuffer.destroy();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.vertexUniformBuffer?.destroy();
        }
        this.#subMeshes.length = 0;
    }
}

Object.freeze(FoliageType);
export default FoliageType;
