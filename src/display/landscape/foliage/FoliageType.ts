import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";

import FoliageSubMesh from "./FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./core/submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./core/buffer/FoliageMegaBuffer";
import FOLIAGE_TYPE from "./FOLIAGE_TYPE";

export {FoliageSubMesh, FoliageShadowMergedSubMesh};

export interface FoliageLODConfig {

    mesh: Mesh | Mesh[];

    lodDistance?: number;

    receiveShadow?: boolean;
}

export interface FoliageLODInfo {
    lodIndex: number;
    lodDistance: number;
    subMeshOffset: number;
    subMeshCount: number;
    receiveShadow?: boolean;
}

export interface FoliageTypeOptions {
    name: string;

    lods: FoliageLODConfig[];

    maxInstances?: number;

    cullingDistance?: number;
    fadeStartDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    useImpostor?: boolean;

    /**
     * [KO] 스캐터 인스턴스 분류 타입 ('foliage' | 'grass' | 'basic')
     * [EN] Scatter instance classification type ('foliage' | 'grass' | 'basic')
     * @default FOLIAGE_TYPE.FOLIAGE
     */
    type?: FOLIAGE_TYPE;

    /** @deprecated Use type instead */
    isFoliage?: boolean;

    useDepthPrepass?: boolean;

    bottomOffset?: number;

    castShadow?: boolean;

    /**
     * [KO] 해당 식생이 그림자를 투영(Casting)할 최대 물리적 거리 (m)
     * [EN] Maximum shadow casting distance in meters
     * @default 300.0
     */
    maxShadowDistance?: number;
}

class FoliageType {
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
    #depthPrepassSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageMegaBuffer | null = null;
    #allocation: FoliageTypeAllocation | null = null;

    #cullingDistance: number = 2000.0;
    #fadeStartDistance: number = 1500.0;
    #activeInstanceCount: number = 0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #type: FOLIAGE_TYPE = FOLIAGE_TYPE.FOLIAGE;
    #castShadow: boolean = true;
    #maxShadowDistance: number = 300.0;
    #useImpostor: boolean = true;
    #isFoliage: boolean = true;
    #useDepthPrepass: boolean = true;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<number> = new Set();
    #onDirty?: () => void;

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageMegaBuffer | null,
        onDirty?: () => void
    ) {
        this.#redGPUContext = redGPUContext;
        this.#options = options;
        this.#onDirty = onDirty;
        this.#castShadow = options.castShadow !== false;

        const resolvedType: FOLIAGE_TYPE = options.type
            || (options.isFoliage === false ? FOLIAGE_TYPE.BASIC : FOLIAGE_TYPE.FOLIAGE);
        this.#type = resolvedType;

        const isBasic = resolvedType === FOLIAGE_TYPE.BASIC;
        const isGrass = resolvedType === FOLIAGE_TYPE.GRASS;

        this.#isFoliage = !isBasic;
        this.#useImpostor = options.useImpostor !== undefined
            ? options.useImpostor
            : (!isBasic && !isGrass);
        this.#useDepthPrepass = options.useDepthPrepass !== undefined
            ? options.useDepthPrepass
            : !isBasic;

        let defaultShadowDist = 300.0;
        if (isGrass) defaultShadowDist = 35.0;
        else if (isBasic) defaultShadowDist = 150.0;

        this.#maxShadowDistance = options.maxShadowDistance !== undefined
            ? Math.max(0, Number(options.maxShadowDistance) || 0)
            : defaultShadowDist;

        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

        this.#cullingDistance = options.cullingDistance ?? 2000.0;
        this.#fadeStartDistance = options.fadeStartDistance ?? 1500.0;

        const minScale: [number, number, number] = options.minScale ? [...options.minScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = options.maxScale ? [...options.maxScale] : [1.0, 1.0, 1.0];

        this.#options = Object.freeze({
            name: options.name,
            type: this.#type,
            lods: options.lods,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: this.#cullingDistance,
            fadeStartDistance: this.#fadeStartDistance,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor: this.#useImpostor,
            isFoliage: this.#isFoliage,
            useDepthPrepass: this.#useDepthPrepass,
            bottomOffset: options.bottomOffset,
            castShadow: this.#castShadow,
            maxShadowDistance: this.#maxShadowDistance,
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
        this.#shadowMergedSubMeshes = assembleResult.shadowMergedSubMeshes || [];
        this.#lodInfoList = assembleResult.lodInfoList || [];
        const userOffset = options.bottomOffset;
        this.#bottomOffset = userOffset !== undefined ? userOffset : (assembleResult.bottomOffset ?? 0);
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        let impostorSub: FoliageSubMesh | null = null;
        for (let i = 0; i < this.#subMeshes.length; i++) {
            if (this.#subMeshes[i].isImpostor) {
                impostorSub = this.#subMeshes[i];
                break;
            }
        }
        this.#impostorSubMesh = impostorSub;

        this.#updatePassBuckets();

        if (this.#megaBuffer) {
            this.#allocation = this.#megaBuffer.allocateTypeSegment(
                this.#options.name,
                this.#options.maxInstances,
                this.#subMeshes,
                this.#shadowMergedSubMeshes,
                this.#lodInfoList
            );
            const effectiveShadowDist = this.#castShadow ? this.#maxShadowDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                this.#lodInfoList,
                effectiveShadowDist
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

    get megaBuffer(): FoliageMegaBuffer | null {
        return this.#megaBuffer;
    }

    get subMeshes(): readonly FoliageSubMesh[] {
        return this.#subMeshes;
    }

    get depthPrepassSubMeshes(): readonly FoliageSubMesh[] {
        return this.#depthPrepassSubMeshes;
    }

    get mainSubMeshes(): readonly FoliageSubMesh[] {
        return this.#mainSubMeshes;
    }

    get shadowMergedSubMeshes(): readonly FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }


    getShadowMergedMesh(lodIndex: number): FoliageShadowMergedSubMesh | null {
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            if (this.#shadowMergedSubMeshes[i].lodIndex === lodIndex) {
                return this.#shadowMergedSubMeshes[i];
            }
        }
        return null;
    }

    get lodInfoList(): readonly FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        if (this.#bottomOffset !== val) {
            this.#bottomOffset = val;
            this.#syncTypeParams();
        }
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.#syncTypeParams();
        }
    }

    get fadeStartDistance(): number {
        return this.#fadeStartDistance;
    }

    set fadeStartDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#fadeStartDistance !== numVal) {
            this.#fadeStartDistance = numVal;
            this.#syncTypeParams();
        }
    }


    /**
     * [KO] 해당 식생이 그림자를 투영(Casting)할 최대 물리적 거리 (m)
     * [EN] Maximum shadow casting distance in meters
     */
    get maxShadowDistance(): number {
        return this.#maxShadowDistance;
    }

    set maxShadowDistance(value: number) {
        const numVal = Math.max(0, Number(value) || 0);
        if (this.#maxShadowDistance !== numVal) {
            this.#maxShadowDistance = numVal;
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }


    get castShadow(): boolean {
        return this.#castShadow;
    }


    set castShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#castShadow !== boolVal) {
            this.#castShadow = boolVal;
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }


    getLODReceiveShadow(lodIndex: number): boolean {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return false;
        return this.#lodInfoList[lodIndex].receiveShadow !== false;
    }

    setLODReceiveShadow(lodIndex: number, value: boolean): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const boolVal = !!value;
        const lodInfo = this.#lodInfoList[lodIndex];
        if (lodInfo.receiveShadow === boolVal) return;

        (lodInfo as any).receiveShadow = boolVal;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            const subMeshes = this.#subMeshes;
            const count = subMeshes.length;
            for (let i = 0; i < count; i++) {
                if (subMeshes[i].lodIndex === lodIndex) {
                    subMeshes[i].updateReceiveShadow(gpuDevice, boolVal);
                }
            }
        }
        this.#onDirty?.();
    }


    get hasImpostor(): boolean {
        return !!this.#impostorSubMesh;
    }

    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorSubMesh;
    }


    set useImpostor(value: boolean) {
        if (!this.#impostorSubMesh) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    /**
     * [KO] 스캐터 인스턴스 분류 타입 ('foliage' | 'grass' | 'basic')
     * [EN] Scatter instance classification type ('foliage' | 'grass' | 'basic')
     */
    get type(): FOLIAGE_TYPE {
        return this.#type;
    }

    set type(value: FOLIAGE_TYPE) {
        if (this.#type !== value) {
            this.#type = value;
            this.#isFoliage = value !== FOLIAGE_TYPE.BASIC;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    /** @deprecated Use type instead */
    get isFoliage(): boolean {
        return this.#isFoliage;
    }

    /** @deprecated Use type instead */
    set isFoliage(value: boolean) {
        const boolVal = !!value;
        if (this.#isFoliage !== boolVal) {
            this.#isFoliage = boolVal;
            this.#type = boolVal ? FOLIAGE_TYPE.FOLIAGE : FOLIAGE_TYPE.BASIC;
            this.#updatePassBuckets();
            this.#syncTypeParams();
            this.#onDirty?.();
        }
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#updatePassBuckets();
            this.#onDirty?.();
        }
    }


    getLODDistance(lodIndex: number): number {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return 0;
        return this.#lodInfoList[lodIndex].lodDistance;
    }


    setLODDistance(lodIndex: number, distance: number): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const numVal = Math.max(0, distance);
        if (this.#lodInfoList[lodIndex].lodDistance !== numVal) {
            (this.#lodInfoList[lodIndex] as any).lodDistance = numVal;
            this.#syncTypeParams();
        }
    }

    populateTile(comp: any, landscape?: any, targetCountPerTile?: number): void {

        const cz = (comp.componentZ ?? 0) & 0xffff;
        const cx = (comp.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
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

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.culledGPUBuffer || null;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.indirectGPUBuffer || null;
    }

    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.shadowCulledGPUBuffer || null;
    }

    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#megaBuffer?.shadowIndirectGPUBuffer || null;
    }

    setInstanceData(
        index: number,
        posX: number, posY: number, posZ: number,
        rotX: number, rotY: number, rotZ: number, rotW: number,
        scaleX: number, scaleY: number, scaleZ: number,
        fade: number = 1.0
    ): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.setInstanceData(this.#allocation, index, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, fade);
        }
    }

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.uploadAllocationRangeToGPU(this.#allocation, startIndex, count);
        }
    }

    resetIndirectBuffer(): void {
        if (this.#megaBuffer) {
            this.#megaBuffer.resetMultiIndirectCommands();
        }
    }

    setInstancesData(data: Float32Array, count?: number): void {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 8);
        this.#activeInstanceCount = Math.min(instanceCount, this.#options.maxInstances);

        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.writeInstancesData(this.#allocation, data, this.#activeInstanceCount);
        }
        this.resetIndirectBuffer();
    }

    destroy(): void {
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.destroy();
        }
        this.#subMeshes.length = 0;
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            const shadowSub = this.#shadowMergedSubMeshes[i];
            shadowSub.destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;
        this.#loadedTileKeys.clear();
    }

    #updatePassBuckets(): void {
        const useImp = this.#useImpostor;
        const isFoliage = this.#isFoliage;
        const useDepthPrepass = this.#useDepthPrepass;
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassList: FoliageSubMesh[] = [];
        const mainList: FoliageSubMesh[] = [];

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImp && sub.isImpostor) continue;
            if (isFoliage && useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
                prepassList.push(sub);
            }
            if (sub.canRenderInPass('main')) {
                mainList.push(sub);
            }
        }

        this.#depthPrepassSubMeshes = prepassList;
        this.#mainSubMeshes = mainList;
    }

    #syncTypeParams(): void {
        if (this.#megaBuffer && this.#allocation) {
            const hasImp = !!this.#impostorSubMesh;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoList.length > 1)
                ? this.#lodInfoList.slice(0, -1)
                : this.#lodInfoList;

            const effectiveShadowDist = this.#castShadow ? this.#maxShadowDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                effectiveLodList,
                effectiveShadowDist
            );
        }
    }
}

Object.freeze(FoliageType);
export default FoliageType;
