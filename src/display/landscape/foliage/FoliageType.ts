import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import FoliageInstanceBuffer from "./FoliageInstanceBuffer";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";

import FoliageSubMesh from "./FoliageSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./core/buffer/FoliageMegaBuffer";

export {FoliageSubMesh};

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

    isFoliage?: boolean;

    /**
     * [KO] 식생이 지면에 자연스럽게 박히도록 하는 하단 오프셋 (단위: 미터). 미지정 시 모델 크기에 맞춘 최적 안착값 적용
     * [EN] Ground sink offset in meters to ensure seamless planting on uneven terrain.
     */
    groundOffset?: number;
}

class FoliageType {
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageMegaBuffer | null = null;
    #allocation: FoliageTypeAllocation | null = null;
    #instanceBuffer: FoliageInstanceBuffer | null = null;

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
        megaBuffer?: FoliageMegaBuffer | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

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
            isFoliage: options.isFoliage !== false,
            groundOffset: options.groundOffset,
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
        this.#bottomOffset = options.groundOffset !== undefined ? options.groundOffset : (assembleResult.bottomOffset ?? 0);
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;

        const hasImpostor = this.#options.useImpostor !== false;
        this.#numLODs = this.#lodInfoList.length > 0 ? Math.min(this.#lodInfoList.length, 8) : (hasImpostor ? 2 : 1);

        if (this.#megaBuffer) {
            this.#allocation = this.#megaBuffer.allocateTypeSegment(
                this.#options.name,
                this.#options.maxInstances,
                this.#subMeshes
            );
            this.#megaBuffer.registerSubMeshesToTemplate(this.#subMeshes, this.#allocation.indirectBaseOffset);
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#options.cullingDistance ?? 2000.0,
                this.#options.fadeStartDistance ?? 1500.0,
                this.#boundingRadius,
                this.#bottomOffset,
                this.#lodInfoList
            );
        } else {
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
        }
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

    get allocation(): FoliageTypeAllocation | null {
        return this.#allocation;
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

    /**
     * [KO] 식생의 지면 밀착/파묻힘 깊이 오프셋 (단위: 미터)
     * [EN] Ground sink offset in meters
     */
    get groundOffset(): number {
        return this.#bottomOffset;
    }

    set groundOffset(val: number) {
        if (this.#bottomOffset !== val) {
            this.#bottomOffset = val;
            if (this.#megaBuffer && this.#allocation) {
                this.#megaBuffer.updateTypeParams(
                    this.#allocation,
                    this.#options.cullingDistance ?? 2000.0,
                    this.#options.fadeStartDistance ?? 1500.0,
                    this.#boundingRadius,
                    this.#bottomOffset,
                    this.#lodInfoList
                );
            }
        }
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer ? this.#megaBuffer.culledGPUBuffer : this.#instanceBuffer?.culledGPUBuffer || null;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer ? this.#megaBuffer.indirectGPUBuffer : this.#instanceBuffer?.indirectGPUBuffer || null;
    }

    getShadowCulledGPUBuffer(cascadeIndex: number): GPUBuffer | null {
        return this.#megaBuffer ? this.#megaBuffer.getShadowCulledGPUBuffer(cascadeIndex) : this.#instanceBuffer?.culledGPUBuffer || null;
    }

    getShadowIndirectGPUBuffer(cascadeIndex: number): GPUBuffer | null {
        return this.#megaBuffer ? this.#megaBuffer.getShadowIndirectGPUBuffer(cascadeIndex) : this.#instanceBuffer?.indirectGPUBuffer || null;
    }

    getCullingBindGroup(layout: GPUBindGroupLayout, vhtView?: GPUTextureView, vhtSampler?: GPUSampler): GPUBindGroup | null {
        if (this.#megaBuffer) {
            return this.#megaBuffer.getOrCreateGlobalCullingBindGroup(layout, vhtView, vhtSampler);
        }
        return this.#instanceBuffer?.getOrCreateCullingBindGroup(layout, vhtView, vhtSampler) || null;
    }

    updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        frustumPlanes: number[][] | null,
        fovFactor: number
    ): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#options.cullingDistance ?? 2000.0,
                this.#options.fadeStartDistance ?? 1500.0,
                this.#boundingRadius,
                this.#bottomOffset,
                this.#lodInfoList
            );
        } else if (this.#instanceBuffer) {
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
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0, subId: number = 0
    ): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.setInstanceData(this.#allocation, index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade);
        } else if (this.#instanceBuffer) {
            this.#instanceBuffer.setInstanceData(index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade, subId);
        }
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.uploadAllocationRangeToGPU(this.#allocation, startIndex, count);
        } else if (this.#instanceBuffer) {
            this.#instanceBuffer.uploadRangeToGPU(startIndex, count);
        }
    }

    resetIndirectBuffer(): void {
        if (this.#megaBuffer) {
            this.#megaBuffer.resetMultiIndirectCommands();
        } else if (this.#instanceBuffer && this.#subMeshes.length > 0) {
            this.#instanceBuffer.resetMultiIndirectCount(this.#subMeshes);
        }
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);

        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.writeInstancesData(this.#allocation, data, this.#activeInstanceCount);
        } else if (this.#instanceBuffer) {
            this.#instanceBuffer.writeSubData(data.subarray(0, this.#activeInstanceCount * 12));
            this.#instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        }
        this.resetIndirectBuffer();
    }

    populateTile(comp: any, landscape?: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        const addedCount = FoliageTilePopulator.populateTile(comp, this, landscape, targetCountPerTile);
        if (addedCount > 0) {
            this.#activeInstanceCount = Math.min(this.#activeInstanceCount + addedCount, this.#options.maxInstances);
            if (this.#allocation) {
                this.#allocation.activeCount = this.#activeInstanceCount;
            }
        }
    }

    destroy(): void {
        this.#instanceBuffer?.destroy();
        this.#instanceBuffer = null;
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.destroy();
        }
        this.#subMeshes.length = 0;
    }
}

Object.freeze(FoliageType);
export default FoliageType;
