import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
import FoliageInstanceBuffer from "./FoliageInstanceBuffer";
import {createOctahedralImpostorGeometry} from "./core/impostor/octahedral/createOctahedralImpostorGeometry";
import type {FoliageDepthPassMode} from "./core/pipeline/FoliagePipelineRegistry";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";
import type LandscapeFoliageManager from "./LandscapeFoliageManager";

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
}

export interface FoliageCrossBillboardOptions {

    enabled?: boolean;

    texture?: any;

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

    /** [Legacy alias for lodDistance] */
    distance?: number;

    /** Screen size fraction (0.0 to 1.0) */
    screenSize?: number;

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
    #bottomOffset: number | null = null;
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
        };

        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            this.#options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lodInfoList = assembleResult.lodInfoList || [];
        this.#lod0SubMeshCount = assembleResult.lod0SubMeshCount;
        this.#bottomOffset = assembleResult.bottomOffset;

        this.#instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.#options.maxInstances, this.#subMeshes);
        this.#updateIndirectBuffer();
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

    get subMeshes(): FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get lodInfoList(): FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get lodCount(): number {
        return this.#lodInfoList.length;
    }

    get instanceBuffer(): FoliageInstanceBuffer {
        return this.#instanceBuffer;
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

    incrementActiveInstanceCount(count: number): void {
        this.#activeInstanceCount += count;
    }

    get bottomOffset(): number {
        return this.#bottomOffset ?? 0;
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);
        this.#instanceBuffer.dataBuffer.set(data.subarray(0, this.#activeInstanceCount * 12));
        this.#instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        this.#updateIndirectBuffer();
    }

    setBillboardWireframe(wireframe: boolean): void {
        const billboardSub = this.subMeshes.find(s => (s as any)._octahedralWidth !== undefined || (s as any)._bakedWidth !== undefined);
        if (!billboardSub) return;

        const bbWidth = (billboardSub as any)._octahedralWidth ?? (billboardSub as any)._bakedWidth ?? 6.0;
        const bbHeight = (billboardSub as any)._octahedralHeight ?? (billboardSub as any)._bakedHeight ?? 8.0;
        const bbBottomOffset = (billboardSub as any)._bottomOffset ?? 0.0;

        const newGeom = createOctahedralImpostorGeometry(this.#redGPUContext, bbWidth, bbHeight, wireframe, bbBottomOffset);
        billboardSub.geometry = newGeom;
        billboardSub.mesh.geometry = newGeom;
        billboardSub.indexCount = newGeom.indexBuffer?.indexCount || 0;
        billboardSub.vertexCount = newGeom.vertexBuffer?.vertexCount || 0;
        billboardSub.isIndexed = !!newGeom.indexBuffer;

        if (billboardSub.material) {
            billboardSub.material.wireframe = wireframe;
            billboardSub.material.useCutOff = !wireframe;
            if (billboardSub.material._updateFragmentState) {
                billboardSub.material._updateFragmentState();
            }
        }
        this.#updateIndirectBuffer();
    }

    populateTile(comp: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        FoliageTilePopulator.populateTile(comp, this, targetCountPerTile);
    }

    destroy(): void {
        this.#instanceBuffer.destroy();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.vertexUniformBuffer?.destroy();
        }
        this.#subMeshes.length = 0;
    }

    #updateIndirectBuffer(): void {
        if (!this.#instanceBuffer || this.#subMeshes.length === 0) return;
        this.#instanceBuffer.resetMultiIndirectCount(this.#subMeshes);
    }
}

Object.freeze(FoliageType);
export default FoliageType;
