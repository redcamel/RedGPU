import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageTilePopulator from "./core/populator/FoliageTilePopulator";

import FoliageSubMesh from "./FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./core/submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./core/buffer/FoliageMegaBuffer";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";

export {FoliageSubMesh, FoliageShadowMergedSubMesh};

export interface FoliageLODConfig {

    mesh: Mesh | Mesh[];

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

    lods: FoliageLODConfig[];

    maxInstances?: number;

    cullingDistance?: number;
    fadeStartDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    useImpostor?: boolean;

    isFoliage?: boolean;

    groundOffset?: number;

    /**
     * [KO] 그림자를 투영할지 여부 (기본값: true. 작은 풀/잔디는 false 권장).
     * [EN] Whether to cast shadows (default: true. Recommended: false for small grass/flowers).
     */
    castShadow?: boolean;

    /**
     * [KO] 그림자를 투영할 최대 캐스케이드 인덱스 (0~3, 기본값: 3). 잔디는 0, 관목은 1, 대형 나무는 2~3 권장.
     * [EN] Maximum cascade index to cast shadows (0 to 3, default: 3). Recommended: 0 for grass, 1 for shrubs, 2-3 for large trees.
     */
    maxShadowCascadeIndex?: number;

    /**
     * [KO] 알파 컷오프(discard)를 적용할 최대 캐스케이드 인덱스 (0~3, 기본값: 0).
     * 0이면 초근거리 Cascade 0에서만 잎사귀 실루엣을 따고, 원경 Cascade 1~3에서는 discard 없는 Opaque 섀도우로 초고속 렌더링하여 Early-Z 100% 가동.
     * [EN] Maximum cascade index to apply alpha cutoff (discard) (0 to 3, default: 0).
     * If 0, alpha cutoff is only applied in Cascade 0, and Cascade 1-3 render with Opaque shadow (0 fragment overhead, 100% Early-Z).
     */
    shadowCutoffCascadeIndex?: number;

    /**
     * [KO] 섀도우 패스에서 프래그먼트 셰이더를 생략(Null Fragment, shadowOpaque)할 최소 LOD 인덱스 (기본값: 1).
     * LOD 1 이상의 중경/원경 식생 메쉬는 discard를 바이패스하고 Opaque 섀도우(Double-Speed Z-Fill)로 초고속 렌더링합니다.
     * [EN] Minimum LOD index to omit fragment shader (Null Fragment, shadowOpaque) in shadow pass (default: 1).
     * Foliage meshes at LOD 1 or higher bypass discard and render with ultra-fast Opaque shadow (Double-Speed Z-Fill).
     */
    shadowOpaqueLodThreshold?: number;
}

class FoliageType {
    #options: FoliageTypeOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
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
    #numLODs: number = 1;
    #castShadow: boolean = true;
    #maxShadowCascadeIndex: number = 3;
    #shadowCutoffCascadeIndex: number = 0;
    #shadowOpaqueLodThreshold: number = 1;
    #useImpostor: boolean = true;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<number> = new Set();

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageTypeOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageMegaBuffer | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#options = options;
        this.#castShadow = options.castShadow !== false;
        this.#maxShadowCascadeIndex = options.maxShadowCascadeIndex ?? 3;
        this.#shadowCutoffCascadeIndex = options.shadowCutoffCascadeIndex !== undefined
            ? Math.max(0, Math.min(3, Math.floor(options.shadowCutoffCascadeIndex)))
            : 0;
        this.#shadowOpaqueLodThreshold = options.shadowOpaqueLodThreshold !== undefined
            ? Math.max(0, Math.floor(options.shadowOpaqueLodThreshold))
            : 1;
        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;
        this.#maxShadowCascadeIndex = options.maxShadowCascadeIndex !== undefined
            ? Math.max(0, Math.min(3, Math.floor(options.maxShadowCascadeIndex)))
            : 3;

        const useImpostor = options.useImpostor !== false;
        this.#useImpostor = useImpostor;
        this.#cullingDistance = options.cullingDistance ?? 2000.0;
        this.#fadeStartDistance = options.fadeStartDistance ?? 1500.0;

        const minScale: [number, number, number] = options.minScale ? [...options.minScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = options.maxScale ? [...options.maxScale] : [1.0, 1.0, 1.0];

        this.#options = Object.freeze({
            name: options.name,
            lods: options.lods,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: this.#cullingDistance,
            fadeStartDistance: this.#fadeStartDistance,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor,
            isFoliage: options.isFoliage !== false,
            groundOffset: options.groundOffset,
            castShadow: this.#castShadow,
            maxShadowCascadeIndex: this.#maxShadowCascadeIndex,
            shadowCutoffCascadeIndex: this.#shadowCutoffCascadeIndex,
            shadowOpaqueLodThreshold: this.#shadowOpaqueLodThreshold,
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
        this.#bottomOffset = options.groundOffset !== undefined ? options.groundOffset : (assembleResult.bottomOffset ?? 0);
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        this.#impostorSubMesh = this.#subMeshes.find(s => s.isImpostor) || null;

        this.#numLODs = this.#lodInfoList.length > 0 ? Math.min(this.#lodInfoList.length, 8) : (this.#impostorSubMesh ? 2 : 1);

        if (this.#megaBuffer) {
            this.#allocation = this.#megaBuffer.allocateTypeSegment(
                this.#options.name,
                this.#options.maxInstances,
                this.#subMeshes,
                this.#shadowMergedSubMeshes,
                this.#lodInfoList
            );
            this.#megaBuffer.registerSubMeshesToTemplate(
                this.#subMeshes,
                this.#allocation.indirectBaseOffset,
                this.#shadowMergedSubMeshes,
                this.#lodInfoList
            );
            const effectiveMaxShadowCascade = this.#castShadow ? this.#maxShadowCascadeIndex : 999;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                this.#lodInfoList,
                effectiveMaxShadowCascade
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

    get shadowMergedSubMeshes(): readonly FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }

    /**
     * [KO] 특정 LOD 레벨에 해당하는 그림자 전용 통합 서브메시(Shadow Merged Mesh)를 반환합니다.
     * [EN] Returns the shadow merged submesh for a specific LOD level.
     */
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

    get groundOffset(): number {
        return this.#bottomOffset;
    }

    set groundOffset(val: number) {
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
     * [KO] 그림자를 투영할 최대 캐스케이드 인덱스를 설정합니다 (0~3).
     * [EN] Sets the maximum cascade index to cast shadows (0 to 3).
     */
    set maxShadowCascadeIndex(value: number) {
        validateUintRange(value, 0, 3);
        if (this.#maxShadowCascadeIndex !== value) {
            this.#maxShadowCascadeIndex = value;
            this.#syncTypeParams();
        }
    }

    /**
     * [KO] 그림자를 투영할 최대 캐스케이드 인덱스를 반환합니다 (0~3).
     * [EN] Returns the maximum cascade index to cast shadows (0 to 3).
     */
    get maxShadowCascadeIndex(): number {
        return this.#maxShadowCascadeIndex;
    }

    /**
     * [KO] 그림자를 투영할지 여부를 반환합니다.
     * [EN] Returns whether to cast shadows.
     */
    get castShadow(): boolean {
        return this.#castShadow;
    }

    /**
     * [KO] 그림자를 투영할지 여부를 설정합니다.
     * [EN] Sets whether to cast shadows.
     */
    set castShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#castShadow !== boolVal) {
            this.#castShadow = boolVal;
            this.#syncTypeParams();
        }
    }

    /**
     * [KO] 알파 컷오프(discard)를 적용할 최대 캐스케이드 인덱스를 반환합니다 (0~3).
     * [EN] Returns the maximum cascade index to apply alpha cutoff (discard) (0 to 3).
     */
    get shadowCutoffCascadeIndex(): number {
        return this.#shadowCutoffCascadeIndex;
    }

    /**
     * [KO] 알파 컷오프(discard)를 적용할 최대 캐스케이드 인덱스를 설정합니다 (0~3).
     * [EN] Sets the maximum cascade index to apply alpha cutoff (discard) (0 to 3).
     */
    set shadowCutoffCascadeIndex(value: number) {
        validateUintRange(value, 0, 3);
        this.#shadowCutoffCascadeIndex = value;
    }

    /**
     * [KO] 섀도우 패스에서 프래그먼트 셰이더를 생략(Null Fragment, shadowOpaque)할 최소 LOD 인덱스를 반환합니다 (기본값: 1).
     * [EN] Returns the minimum LOD index to omit fragment shader (Null Fragment, shadowOpaque) in shadow pass (default: 1).
     */
    get shadowOpaqueLodThreshold(): number {
        return this.#shadowOpaqueLodThreshold;
    }

    /**
     * [KO] 섀도우 패스에서 프래그먼트 셰이더를 생략(Null Fragment, shadowOpaque)할 최소 LOD 인덱스를 설정합니다 (0~16).
     * [EN] Sets the minimum LOD index to omit fragment shader (Null Fragment, shadowOpaque) in shadow pass (0 to 16).
     */
    set shadowOpaqueLodThreshold(value: number) {
        validateUintRange(value, 0, 16);
        this.#shadowOpaqueLodThreshold = value;
    }

    /**
     * [KO] 임포스터 사용 여부를 반환합니다. 임포스터 서브메시가 없는 에셋이면 항상 false를 반환합니다.
     * [EN] Returns whether impostor is enabled. Returns false if the asset has no impostor.
     */
    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorSubMesh;
    }

    /**
     * [KO] 임포스터 사용 여부를 설정합니다. 임포스터가 없는 에셋인 경우 변경되지 않습니다.
     * [EN] Sets whether impostor is enabled. If the asset has no impostor, this has no effect.
     */
    set useImpostor(value: boolean) {
        if (!this.#impostorSubMesh) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#syncTypeParams();
        }
    }

    /**
     * [KO] 3D 메시에서 임포스터로 전환되는 거리를 반환합니다.
     * [EN] Returns the distance at which 3D mesh transitions to impostor.
     */
    get impostorDistance(): number {
        if (!this.#impostorSubMesh || this.#lodInfoList.length <= 1) return 0;
        return this.#lodInfoList[this.#lodInfoList.length - 2].lodDistance;
    }

    /**
     * [KO] 3D 메시에서 임포스터로 전환되는 거리를 설정합니다.
     * [EN] Sets the distance at which 3D mesh transitions to impostor.
     */
    set impostorDistance(value: number) {
        if (!this.#impostorSubMesh || this.#lodInfoList.length <= 1) return;
        const targetIdx = this.#lodInfoList.length - 2;
        const numVal = Math.max(0, value);
        if (this.#lodInfoList[targetIdx].lodDistance !== numVal) {
            (this.#lodInfoList[targetIdx] as any).lodDistance = numVal;
            this.#syncTypeParams();
        }
    }

    /**
     * [KO] 특정 LOD 단계의 전환 거리를 반환합니다.
     * [EN] Returns the transition distance for a specific LOD level.
     * @param lodIndex LOD 인덱스 (0부터 시작)
     */
    getLODDistance(lodIndex: number): number {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return 0;
        return this.#lodInfoList[lodIndex].lodDistance;
    }

    /**
     * [KO] 특정 LOD 단계의 전환 거리를 설정하고 GPU 버퍼에 즉시 동기화합니다.
     * [EN] Sets the transition distance for a specific LOD level and syncs to GPU buffer immediately.
     * @param lodIndex LOD 인덱스 (0부터 시작)
     * @param distance 전환 거리 (미터)
     */
    setLODDistance(lodIndex: number, distance: number): void {
        if (lodIndex < 0 || lodIndex >= this.#lodInfoList.length) return;
        const numVal = Math.max(0, distance);
        if (this.#lodInfoList[lodIndex].lodDistance !== numVal) {
            (this.#lodInfoList[lodIndex] as any).lodDistance = numVal;
            this.#syncTypeParams();
        }
    }

    populateTile(comp: any, landscape?: any, targetCountPerTile?: number): void {
        // 🚀 [최적화 6위 - Zero-GC] `${z}_${x}` 문자열 힙 생성 대신 32비트 정수 비트 패킹 키를 사용하여 힙 할당 0건 달성
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

    getShadowCulledGPUBuffer(cascadeIndex?: number): GPUBuffer | null {
        return this.#megaBuffer?.shadowCulledGPUBuffer || null;
    }

    getShadowIndirectGPUBuffer(cascadeIndex?: number): GPUBuffer | null {
        return this.#megaBuffer?.shadowIndirectGPUBuffer || null;
    }

    getCullingBindGroup(layout: GPUBindGroupLayout, vhtView?: GPUTextureView, vhtSampler?: GPUSampler): GPUBindGroup | null {
        return this.#megaBuffer?.getOrCreateUnifiedCullingBindGroup(layout, vhtView, vhtSampler) || null;
    }

    updateCullingUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        frustumPlanes: number[][] | null,
        fovFactor: number
    ): void {
        this.#syncTypeParams();
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

    #syncTypeParams(): void {
        if (this.#megaBuffer && this.#allocation) {
            const hasImp = !!this.#impostorSubMesh;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoList.length > 1)
                ? this.#lodInfoList.slice(0, -1)
                : this.#lodInfoList;

            const effectiveMaxShadowCascade = this.#castShadow ? this.#maxShadowCascadeIndex : 999;
            this.#megaBuffer.updateTypeParams(
                this.#allocation,
                this.#cullingDistance,
                this.#fadeStartDistance,
                this.#boundingRadius,
                this.#bottomOffset,
                effectiveLodList,
                effectiveMaxShadowCascade
            );
        }
    }
}

Object.freeze(FoliageType);
export default FoliageType;
