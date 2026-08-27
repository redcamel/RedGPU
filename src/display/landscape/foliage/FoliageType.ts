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

export interface FoliageCrossBillboardOptions {

    enabled?: boolean;

    material?: any;

    width?: number;

    height?: number;

    lodDistance?: number;
}

export interface FoliageLODConfig {
    /** The 3D mesh (or mesh hierarchy) to render at this LOD level */
    mesh: Mesh | Mesh[];

    /** LOD switch distance in meters (e.g. 40.0) */
    lodDistance?: number;

    /** Dithered cross-fade range buffer in meters (default: 10.0) */
    fadeRange?: number;

    /** Optional material override for this LOD level */
    materialOverride?: ABaseMaterial;

    /** Whether to combine sub-meshes sharing identical materials (default: true) */
    combineSubMeshesByMaterial?: boolean;
}

export interface FoliageLODInfo {
    lodIndex: number;
    lodDistance: number;
    fadeRange: number;
    subMeshOffset: number;
    subMeshCount: number;
}

export interface FoliageTypeOptions {
    name: string;

    /** [Legacy & Single LOD] Mesh or array of meshes */
    mesh?: Mesh | Mesh[];

    /** [Multi-LOD] Array of user-defined LOD configurations (LOD 0 to LOD 7) */
    lods?: FoliageLODConfig[];

    maxInstances?: number;

    cullingDistance?: number;
    fadeStartDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    lodDistance?: number;

    billboard?: FoliageCrossBillboardOptions;

    impostor?: FoliageCrossBillboardOptions;

    convertBlendToMasked?: boolean;

    combineSubMeshesByMaterial?: boolean;

    isFoliage?: boolean;
}

class FoliageType {
    #name: string;
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #foliageManager: LandscapeFoliageManager | null = null;

    #subMeshes: FoliageSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #instanceBuffer: FoliageInstanceBuffer;

    #lod0SubMeshCount: number = 1;
    #activeInstanceCount: number = 0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<string> = new Set();

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        foliageManager?: LandscapeFoliageManager | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#foliageManager = foliageManager || null;
        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#name = options.name;

        const billboardOpt = options.billboard || options.impostor;

        this.#options = {
            name: options.name,
            mesh: options.mesh,
            lods: options.lods,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: options.cullingDistance ?? 2000.0,
            fadeStartDistance: options.fadeStartDistance ?? 1500.0,
            minScale: options.minScale ?? [1.0, 1.0, 1.0],
            maxScale: options.maxScale ?? [1.0, 1.0, 1.0],
            randomRotationY: options.randomRotationY ?? true,
            lodDistance: options.lodDistance ?? (billboardOpt?.lodDistance ?? 80.0),
            billboard: billboardOpt ?? {enabled: false},
            convertBlendToMasked: options.convertBlendToMasked ?? true,
            combineSubMeshesByMaterial: options.combineSubMeshesByMaterial ?? true,
            isFoliage: options.isFoliage !== false,
        };

        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            this.#options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lodInfoList = assembleResult.lodInfoList || [];
        this.#lod0SubMeshCount = assembleResult.lod0SubMeshCount;
        this.#bottomOffset = assembleResult.bottomOffset ?? 0;
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;

        this.#instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.#options.maxInstances, this.#subMeshes);
        this.#instanceBuffer.initStaticLODUniforms(
            this.#lodInfoList,
            this.lodDistance,
            this.#lod0SubMeshCount,
            this.hasBillboard,
            this.#options.cullingDistance ?? 2000.0
        );
        this._resetIndirectBuffer();
    }

    get foliageManager(): LandscapeFoliageManager | null {
        return this.#foliageManager;
    }

    get name(): string {
        return this.#name;
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

    get lod0SubMeshCount(): number {
        return this.#lod0SubMeshCount;
    }

    get hasBillboard(): boolean {
        return !!this.#options.billboard?.enabled;
    }

    get lodDistance(): number {
        return this.#options.lodDistance;
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get _culledGPUBuffer(): GPUBuffer | null {
        return this.#instanceBuffer.getCulledGPUBuffer();
    }

    get _indirectGPUBuffer(): GPUBuffer | null {
        return this.#instanceBuffer.getIndirectGPUBuffer();
    }

    _getCullingBindGroup(layout: GPUBindGroupLayout, vhtView?: GPUTextureView, vhtSampler?: GPUSampler): GPUBindGroup | null {
        return this.#instanceBuffer.getOrCreateCullingBindGroup(layout, vhtView, vhtSampler);
    }

    _updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        frustumPlanes: number[][] | null,
        fovFactorSq: number
    ): void {
        const numLODs = this.#lodInfoList.length > 0 ? Math.min(this.#lodInfoList.length, 8) : (this.hasBillboard ? 2 : 1);
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
            fovFactorSq,
            numLODs
        );
    }

    _setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0, subId: number = 0
    ): void {
        this.#instanceBuffer.setInstanceData(index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade, subId);
    }

    _uploadRangeToGPU(startIndex: number, count: number): void {
        this.#instanceBuffer.uploadRangeToGPU(startIndex, count);
    }

    _resetIndirectBuffer(): void {
        if (!this.#instanceBuffer || this.#subMeshes.length === 0) return;
        this.#instanceBuffer.resetMultiIndirectCount(this.#subMeshes);
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);
        this.#instanceBuffer.writeSubData(data.subarray(0, this.#activeInstanceCount * 12));
        this.#instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        this._resetIndirectBuffer();
    }

    _populateTile(comp: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        const addedCount = FoliageTilePopulator.populateTile(comp, this, targetCountPerTile);
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
