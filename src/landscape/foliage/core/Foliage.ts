import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import type Landscape from "../../Landscape";
import assembleFoliageRenderUnits from "./assembleFoliageRenderUnits";
import FoliageRenderUnit from "./FoliageRenderUnit";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./buffer/FoliageMegaBuffer";
import {AScatterType, AScatterTypeInitOptions} from "../../core/scatter";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";
import {FOLIAGE_SEED_GRID_SIZE} from "../FOLIAGE_CONSTANTS";

function sampleNormalizedLayerWeight(
    landscape: any,
    targetLayer: any,
    u: number,
    v: number
): number {
    if (!targetLayer) return 0.0;
    const {layers} = landscape;
    if (!layers || layers.length <= 1) {
        return typeof targetLayer.getWeightAtUV === 'function' ? targetLayer.getWeightAtUV(u, v) : 0.0;
    }

    let activeWeightLayerCount = 0;
    let totalWeight = 0.0;
    let targetWeight = 0.0;

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const {enabled, weightTexture} = layer;
        if (!enabled) continue;
        if (weightTexture?.src) {
            activeWeightLayerCount++;
        }
        const w = typeof layer.getWeightAtUV === 'function' ? layer.getWeightAtUV(u, v) : 0.0;
        totalWeight += w;
        if (layer === targetLayer) {
            targetWeight = w;
        }
    }

    if (activeWeightLayerCount <= 1 || totalWeight <= 0.001) {
        return targetWeight;
    }

    return targetWeight / totalWeight;
}

function computeScatterGridSeed(gridX: number, gridZ: number, nameHash: number): number {
    let seed = ((gridX * 73856093) ^ (gridZ * 19349663) ^ (nameHash * 83492791)) >>> 0;
    return seed === 0 ? 0x9e3779b9 : seed;
}

export interface FoliageSubCell {
    subCellKey: number;
    subCellX: number;
    subCellZ: number;
    centerX: number;
    centerZ: number;
    instanceCount: number;
    isMounted: boolean;
    mountedSlotIndex: number;
}

function packSubCellKey(scX: number, scZ: number): number {
    return ((scZ << 16) | (scX & 0xFFFF)) | 0;
}

function sortSubCellsByDistance<T extends { centerX: number; centerZ: number }>(
    subCells: T[],
    dists: Float32Array,
    camX: number,
    camZ: number,
    count: number
): void {
    if (count <= 1) return;

    for (let i = 0; i < count; i++) {
        const {centerX, centerZ} = subCells[i];
        const dx = centerX - camX;
        const dz = centerZ - camZ;
        dists[i] = dx * dx + dz * dz;
    }

    quickSortSubCells(subCells, dists, 0, count - 1);
}

function quickSortSubCells<T>(
    subCells: T[],
    dists: Float32Array,
    left: number,
    right: number
): void {
    if (left >= right) return;
    const pivotVal = dists[(left + right) >> 1];
    let i = left;
    let j = right;
    while (i <= j) {
        while (dists[i] < pivotVal) i++;
        while (dists[j] > pivotVal) j--;
        if (i <= j) {
            const tempSubCell = subCells[i];
            subCells[i] = subCells[j];
            subCells[j] = tempSubCell;

            const tempDist = dists[i];
            dists[i] = dists[j];
            dists[j] = tempDist;

            i++;
            j--;
        }
    }
    if (left < j) quickSortSubCells(subCells, dists, left, j);
    if (i < right) quickSortSubCells(subCells, dists, i, right);
}

export interface FoliageLODConfig {
    mesh: Mesh | Mesh[];
    lodDistance?: number;
    receiveShadow?: boolean;
}

export interface FoliageLODInfo {
    lodIndex: number;
    lodDistance: number;
    renderUnitOffset: number;
    renderUnitCount: number;
    receiveShadow?: boolean;
}

export interface FoliageOptions extends AScatterTypeInitOptions {
    lods: FoliageLODConfig[];
    receiveShadow?: boolean;

    maxInstances?: number;

    minScale?: [number, number, number];

    maxScale?: [number, number, number];

    randomRotationY?: boolean;

    useImpostor?: boolean;

    preservePivot?: boolean;

    trunkBendScale?: number;

    leafFlutterScale?: number;

    alignToNormal?: boolean;

    alignFactor?: number;

    groundBlendRange?: number;

    useDepthPrepass?: boolean;
}

class Foliage extends AScatterType<FoliageTypeAllocation> {
    static MAX_SAFE_TYPE_CAPACITY: number = 262144;

    #minScale: [number, number, number] = [1.0, 1.0, 1.0];
    #maxScale: [number, number, number] = [1.0, 1.0, 1.0];
    #randomRotationY: boolean = true;
    #maxInstances: number = 0;

    #renderUnits: FoliageRenderUnit[] = [];
    #shadowMergedRenderUnits: FoliageRenderUnit[] = [];
    #lod0RenderUnits: FoliageRenderUnit[] = [];
    #depthPrepassOpaqueRenderUnits: FoliageRenderUnit[] = [];
    #depthPrepassMaskedRenderUnits: FoliageRenderUnit[] = [];
    #mainRenderUnits: FoliageRenderUnit[] = [];
    #hasMaskedLOD0: boolean = false;
    #lodInfoList: FoliageLODInfo[] = [];
    #lodInfoListWithoutImpostor: FoliageLODInfo[] | null = null;

    #megaBuffer: FoliageMegaBuffer | null = null;

    #boundingRadius: number = 10.0;
    #nameHash: number = 0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #receiveShadow: boolean = true;
    #trunkBendScale: number = 1.0;
    #leafFlutterScale: number = 1.0;
    #alignToNormal: boolean = false;
    #alignFactor: number = 1.0;
    #groundBlendRange: number = 1.5;
    #impostorRenderUnit: FoliageRenderUnit | null = null;

    #subCells: Map<number, FoliageSubCell> = new Map();
    #mountedSubCells: FoliageSubCell[] = [];
    #tempCandidates: FoliageSubCell[] = [];
    #candidateDists: Float32Array = new Float32Array(512);
    #lastMountedCount: number = 0;
    #lastUnmountedCount: number = 0;
    #lastCamX: number = 0;
    #lastCamZ: number = 0;
    #streamingRadius: number = 0;

    #baker: FoliageInstanceBaker | null = null;
    onUniformDirty?: (typeId: number) => void;
    onRepopulateRequired?: (type: Foliage) => void;
    #slotPooler: FoliageSlotPooler | null = null;
    #landscape: Landscape | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        options: FoliageOptions,
        megaBuffer?: FoliageMegaBuffer | null,
        baker?: FoliageInstanceBaker | null,
        slotPooler?: FoliageSlotPooler | null,
        landscape?: Landscape | null
    ) {
        super(redGPUContext, options.name);
        this.#landscape = landscape ?? null;
        this.#slotPooler = slotPooler ?? null;

        const {
            name,
            receiveShadow = true,
            castShadow = true,
            useImpostor = true,
            cullingDistance = 2000.0,
            minScale,
            maxScale,
            densityPerHectare,
            densityMultiplier,
            maxInstances,
            trunkBendScale,
            leafFlutterScale,
            alignToNormal = false,
            alignFactor,
            groundBlendStrength,
            groundBlendRange,
            useDepthPrepass = true,
            shadowCullDistance,
            targetLayer,
            minSlope = 0.0,
            maxSlope = 45.0,
            densityScaleByWeight = true,
            randomRotationY,
            bottomOffset = 0.0,
            height
        } = options;

        this.#baker = baker ?? null;

        this.#receiveShadow = receiveShadow;
        this.#useImpostor = useImpostor;
        this.#useDepthPrepass = useDepthPrepass;
        this.#megaBuffer = megaBuffer ?? null;

        const [minX = 1.0, minY = 1.0, minZ = 1.0] = minScale ?? [];
        const [maxX = 1.0, maxY = 1.0, maxZ = 1.0] = maxScale ?? [];
        const resolvedMinScale: [number, number, number] = [minX, minY, minZ];
        const resolvedMaxScale: [number, number, number] = [maxX, maxY, maxZ];

        let resolvedDensityPerHectare = 20.0;
        if (densityPerHectare !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(densityPerHectare) || 0);
        }

        const resolvedDensityMultiplier = densityMultiplier !== undefined
            ? Math.max(0.0, Number(densityMultiplier) || 0.0)
            : 1.0;

        const resolvedTrunkBendScale = trunkBendScale !== undefined ? Math.max(0, Number(trunkBendScale) || 0) : 1.0;
        const resolvedLeafFlutterScale = leafFlutterScale !== undefined ? Math.max(0, Number(leafFlutterScale) || 0) : 1.0;

        const resolvedAlignToNormal = alignToNormal;
        const resolvedAlignFactor = alignFactor !== undefined
            ? Math.min(1.0, Math.max(0.0, Number(alignFactor) || 0))
            : 1.0;

        this.#trunkBendScale = resolvedTrunkBendScale;
        this.#leafFlutterScale = resolvedLeafFlutterScale;
        this.#alignToNormal = resolvedAlignToNormal;
        this.#alignFactor = resolvedAlignFactor;

        const resolvedGroundBlendStrength = groundBlendStrength !== undefined
            ? Math.max(0.0, Math.min(1.0, Number(groundBlendStrength) || 0.0))
            : 0.8;
        this.#groundBlendRange = groundBlendRange !== undefined
            ? Math.max(0.1, Number(groundBlendRange) || 0.1)
            : 1.5;

        let hash = 0;
        const nameStr = name ?? '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const {
            lodInfoList,
            boundingRadius,
            boundingHeight,
            renderUnits,
            shadowMergedRenderUnits
        } = assembleFoliageRenderUnits(
            redGPUContext,
            options,
            this.#slotPooler
        );
        this.#lodInfoList = lodInfoList;
        this.#lodInfoListWithoutImpostor = lodInfoList.length > 1 ? lodInfoList.slice(0, -1) : null;
        this.#boundingRadius = boundingRadius;
        const resolvedHeight = height !== undefined
            ? Math.max(0.1, Number(height) || 0.1)
            : (boundingHeight || 2.0);

        this.#initBuckets(
            renderUnits,
            shadowMergedRenderUnits
        );

        let defaultShadowDist = 300.0;
        const effectiveHeight = resolvedHeight * resolvedMaxScale[1];
        if (effectiveHeight < 0.6) {
            defaultShadowDist = 35.0;
        } else if (effectiveHeight < 1.5) {
            defaultShadowDist = 75.0;
        } else if (effectiveHeight < 3.5) {
            defaultShadowDist = 160.0;
        } else {
            defaultShadowDist = 350.0;
        }

        const resolvedShadowCullDistance = shadowCullDistance !== undefined
            ? Math.max(0, Number(shadowCullDistance) || 0)
            : defaultShadowDist;

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset,
            cullingDistance,
            shadowCullDistance: resolvedShadowCullDistance,
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare: resolvedDensityPerHectare,
            densityMultiplier: resolvedDensityMultiplier,
            castShadow,
            groundBlendStrength: resolvedGroundBlendStrength
        });

        this.#recalculateStreamingRadius();

        const effectiveRadius = this.#streamingRadius;
        const effectiveAreaMetersSq = Math.PI * effectiveRadius * effectiveRadius * 1.25;
        const activeHectares = effectiveAreaMetersSq / 10000.0;

        const expectedActiveInstances = activeHectares * resolvedDensityPerHectare * resolvedDensityMultiplier;
        const calculatedMax = Math.ceil((expectedActiveInstances * 1.30) / 64) * 64;

        const MAX_SAFE_CAPACITY = Foliage.MAX_SAFE_TYPE_CAPACITY;
        const minSafeCapacity = 16384;

        const resolvedMaxInstances = maxInstances !== undefined
            ? Math.min(MAX_SAFE_CAPACITY, Math.max(maxInstances, 64))
            : Math.min(MAX_SAFE_CAPACITY, Math.max(calculatedMax, minSafeCapacity));

        this.#minScale = resolvedMinScale;
        this.#maxScale = resolvedMaxScale;
        this.#randomRotationY = randomRotationY !== false;
        this.#maxInstances = resolvedMaxInstances;

        if (this.#megaBuffer) {
            const alloc = this.#megaBuffer.allocateType(
                this.name,
                resolvedMaxInstances,
                this.#renderUnits,
                this.#shadowMergedRenderUnits,
                this.#lodInfoList
            );
            this.bindAllocation(alloc);
            const {cullingDistance, bottomOffset, height, castShadow, shadowCullDistance} = this;
            const effectiveShadowDist = castShadow ? shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                cullingDistance,
                cullingDistance * 0.75,
                this.#boundingRadius,
                bottomOffset,
                this.#lodInfoList,
                effectiveShadowDist,
                height
            );
        }

        this.#syncInternalWind();
        this.flushAllRenderUnitUBOs();
    }

    get trunkBendScale(): number {
        return this.#trunkBendScale;
    }

    set trunkBendScale(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#trunkBendScale !== numVal) {
            this.#trunkBendScale = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    get nameHash(): number {
        return this.#nameHash;
    }

    get maxInstances(): number {
        return this.allocation ? this.allocation.maxInstances : this.#maxInstances;
    }

    set minScale(v: [number, number, number] | [number, number]) {
        if (!v) return;
        const [vx, vy, vz = vx] = v;
        const s = this.#minScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        const sz = Math.max(0.01, Number(vz) || 0.01);
        if (s[0] !== sx || s[1] !== sy || s[2] !== sz) {
            s[0] = sx;
            s[1] = sy;
            s[2] = sz;
            this.clearSubCellCache();
            this.#notifyRepopulateRequired();
        }
    }

    get minScale(): [number, number, number] {
        return this.#minScale;
    }

    set maxScale(v: [number, number, number] | [number, number]) {
        if (!v) return;
        const [vx, vy, vz = vx] = v;
        const s = this.#maxScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        const sz = Math.max(0.01, Number(vz) || 0.01);
        if (s[0] !== sx || s[1] !== sy || s[2] !== sz) {
            s[0] = sx;
            s[1] = sy;
            s[2] = sz;
            this.clearSubCellCache();
            this.#notifyRepopulateRequired();
        }
    }

    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    get randomRotationY(): boolean {
        return this.#randomRotationY;
    }

    get megaBuffer(): FoliageMegaBuffer | null {
        return this.#megaBuffer;
    }

    get landscape(): Landscape | null {
        return this.#landscape;
    }

    get renderUnits(): FoliageRenderUnit[] {
        return this.#renderUnits;
    }

    override get drawCallCount(): number {
        let count = this.#mainRenderUnits.length;
        if (this.#useDepthPrepass) {
            count += this.#depthPrepassOpaqueRenderUnits.length + this.#depthPrepassMaskedRenderUnits.length;
        }
        return count;
    }

    get depthPrepassOpaqueRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassOpaqueRenderUnits;
    }

    get depthPrepassMaskedRenderUnits(): FoliageRenderUnit[] {
        return this.#depthPrepassMaskedRenderUnits;
    }

    get mainRenderUnits(): FoliageRenderUnit[] {
        return this.#mainRenderUnits;
    }

    get lod0RenderUnits(): FoliageRenderUnit[] {
        return this.#lod0RenderUnits;
    }

    get shadowMergedRenderUnits(): FoliageRenderUnit[] {
        return this.#shadowMergedRenderUnits;
    }

    get lodInfoList(): FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.allocation ? this.allocation.instanceCount : 0;
    }

    get slotPooler(): FoliageSlotPooler | null {
        return this.#slotPooler;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }

    get leafFlutterScale(): number {
        return this.#leafFlutterScale;
    }

    set alignToNormal(val: boolean) {
        const boolVal = !!val;
        if (this.#alignToNormal !== boolVal) {
            this.#alignToNormal = boolVal;
            this.#notifyRepopulateRequired();
        }
    }

    set leafFlutterScale(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#leafFlutterScale !== numVal) {
            this.#leafFlutterScale = numVal;
            this.#syncInternalWind();
            this.#notifyUniformDirty();
        }
    }

    set alignFactor(val: number) {
        const numVal = Math.min(1.0, Math.max(0.0, Number(val) || 0.0));
        if (this.#alignFactor !== numVal) {
            this.#alignFactor = numVal;
            if (this.#alignToNormal) {
                this.#notifyRepopulateRequired();
            }
        }
    }

    get alignToNormal(): boolean {
        return this.#alignToNormal;
    }

    set groundBlendRange(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#groundBlendRange !== val) {
            this.#groundBlendRange = val;
            this.#updateRenderUnitGroundBlend();
            this.#notifyUniformDirty();
        }
    }

    get alignFactor(): number {
        return this.#alignFactor;
    }

    get hasImpostor(): boolean {
        return !!this.#impostorRenderUnit;
    }

    get useImpostor(): boolean {
        return this.#useImpostor && !!this.#impostorRenderUnit;
    }

    set useImpostor(value: boolean) {
        if (!this.#impostorRenderUnit) return;
        const boolVal = !!value;
        if (this.#useImpostor !== boolVal) {
            this.#useImpostor = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    set useDepthPrepass(value: boolean) {
        const boolVal = !!value;
        if (this.#useDepthPrepass !== boolVal) {
            this.#useDepthPrepass = boolVal;
            this.#updatePassBuckets();
            this.#notifyUniformDirty();
        }
    }

    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }

    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(value: boolean) {
        const boolVal = !!value;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.#updateRenderUnitReceiveShadow();
            this.onParameterChanged('receiveShadow', boolVal);
        }
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    get groundBlendRange(): number {
        return this.#groundBlendRange;
    }

    override destroy(): void {
        this.clearSubCellCache();

        const unitCount = this.#renderUnits.length;
        for (let i = 0; i < unitCount; i++) {
            this.#renderUnits[i].destroy();
        }
        this.#renderUnits.length = 0;
        this.#lod0RenderUnits.length = 0;
        this.#depthPrepassOpaqueRenderUnits.length = 0;
        this.#depthPrepassMaskedRenderUnits.length = 0;
        this.#mainRenderUnits.length = 0;

        const shadowCount = this.#shadowMergedRenderUnits.length;
        for (let i = 0; i < shadowCount; i++) {
            this.#shadowMergedRenderUnits[i].destroy();
        }
        this.#shadowMergedRenderUnits.length = 0;

        this.#lodInfoList.length = 0;
        this.#mountedSubCells.length = 0;
        this.#tempCandidates.length = 0;

        this.#impostorRenderUnit = null;
        this.#landscape = null;
        this.#slotPooler = null;
        this.#baker = null;
        this.#megaBuffer = null;
        this.onUniformDirty = undefined;
        this.onRepopulateRequired = undefined;

        super.destroy();
    }

    get mountedSubCellCount(): number {
        return this.#mountedSubCells.length;
    }

    get lastMountedCount(): number {
        return this.#lastMountedCount;
    }

    get lastUnmountedCount(): number {
        return this.#lastUnmountedCount;
    }

    flushAllRenderUnitUBOs(): void {
        this.#syncTypeParams();
        const unitList = this.#renderUnits;
        const count = unitList.length;
        for (let i = 0; i < count; i++) {
            unitList[i].flushSlotUBO();
        }
        const shadowList = this.#shadowMergedRenderUnits;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].flushSlotUBO();
        }
    }

    clearSubCellCache(): void {
        this.#tempCandidates.length = 0;
        const mounted = this.#mountedSubCells;
        for (let i = 0; i < mounted.length; i++) {
            mounted[i].isMounted = false;
            mounted[i].mountedSlotIndex = -1;
        }
        mounted.length = 0;
        this.#subCells.clear();
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;
        if (this.allocation) {
            this.allocation.instanceCount = 0;
        }
    }

    setLODDistance(lodIndex: number, distance: number): void {
        const info = this.#lodInfoList[lodIndex];
        if (info) {
            const val = Math.max(0, Number(distance) || 0);
            if (info.lodDistance !== val) {
                info.lodDistance = val;
                this.#recalculateStreamingRadius();
                this.#notifyUniformDirty();
            }
        }
    }

    override onParameterChanged(prop: string, value: any, prevValue?: any): void {
        switch (prop) {
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'densityPerHectare':
            case 'densityMultiplier':
            case 'minScale':
            case 'maxScale':
                this.clearSubCellCache();
                this.#notifyRepopulateRequired();
                break;
            case 'bottomOffset':
                this.#notifyUniformDirty();
                break;

            case 'cullingDistance': {
                this.#recalculateStreamingRadius();
                this.#notifyUniformDirty();
                break;
            }
            case 'shadowCullDistance':
            case 'castShadow':
                this.#notifyUniformDirty();
                break;
            case 'groundBlendStrength':
                this.#updateRenderUnitGroundBlend();
                this.#notifyUniformDirty();
                break;
            case 'receiveShadow':
                this.#updateRenderUnitReceiveShadow();
                break;
        }
    }

    #recalculateStreamingRadius(): void {
        const landscape = this.#landscape;
        if (!landscape) return;

        const subCellSize = landscape.foliageManager.subCellSize;

        let maxDrawableDistance = this.cullingDistance;
        if (!this.#useImpostor && this.#lodInfoList.length > 0) {
            const lastLOD = this.#lodInfoList[this.#lodInfoList.length - 1];
            if (lastLOD.lodDistance > 0 && lastLOD.lodDistance < 100000.0) {
                maxDrawableDistance = lastLOD.lodDistance;
            }
        }

        const effectiveVisualDistance = Math.min(this.cullingDistance, maxDrawableDistance);

        const streamingMargin = subCellSize * 1.5;
        const calculatedRadius = Math.ceil(effectiveVisualDistance + streamingMargin);

        const oldRadius = this.#streamingRadius;
        if (calculatedRadius !== oldRadius) {
            this.#streamingRadius = calculatedRadius;
            if (oldRadius > 0 && calculatedRadius < oldRadius) {
                this.#pruneMountedSubCellsOutOfRange(calculatedRadius, subCellSize);
            }
        }
    }

    #pruneMountedSubCellsOutOfRange(newRadius: number, subCellSize: number): void {
        const megaBuffer = this.#megaBuffer;
        const allocation = this.allocation;
        if (!megaBuffer || !allocation || this.#mountedSubCells.length === 0) return;

        const unmountMargin = subCellSize * 0.5;
        const unmountRadiusSq = (newRadius + unmountMargin) * (newRadius + unmountMargin);
        const mounted = this.#mountedSubCells;

        for (let i = mounted.length - 1; i >= 0; i--) {
            const {centerX, centerZ} = mounted[i];
            const dx = centerX - this.#lastCamX;
            const dz = centerZ - this.#lastCamZ;
            if (dx * dx + dz * dz > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation, subCellSize);
            }
        }
    }

    updateStreaming(
        camX: number,
        camZ: number,
        mountBudget: number = 16,
        unmountBudget: number = 32
    ): void {
        this.#lastMountedCount = 0;
        this.#lastUnmountedCount = 0;
        this.#lastCamX = camX;
        this.#lastCamZ = camZ;

        const allocation = this.allocation;
        const megaBuffer = this.#megaBuffer;
        const landscape = this.#landscape;
        if (!allocation || !megaBuffer || !landscape) return;

        const subCellSize = landscape.foliageManager.subCellSize;
        const typeRadius = this.streamingRadius;
        const unmountMargin = Math.max(10.0, subCellSize * 0.5);
        const unmountRadius = typeRadius + unmountMargin;
        const unmountRadiusSq = unmountRadius * unmountRadius;

        let unmountedThisFrame = 0;
        const mounted = this.#mountedSubCells;
        for (let i = mounted.length - 1; i >= 0; i--) {
            if (unmountedThisFrame >= unmountBudget) break;

            const {centerX, centerZ} = mounted[i];
            const dx = centerX - camX;
            const dz = centerZ - camZ;
            const distSq = dx * dx + dz * dz;

            if (distSq > unmountRadiusSq) {
                this.#unmountSubCellAt(i, megaBuffer, allocation, subCellSize);
                unmountedThisFrame++;
            }
        }
        this.#lastUnmountedCount = unmountedThisFrame;

        if (mountBudget <= 0) return;

        const candidates = this.#tempCandidates;
        candidates.length = 0;

        const {
            worldSizeX,
            worldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ
        } = landscape;

        const invSubCellSize = 1.0 / subCellSize;
        const totalCellsX = Math.max(1, Math.floor(worldSizeX * invSubCellSize));
        const totalCellsZ = Math.max(1, Math.floor(worldSizeZ * invSubCellSize));

        const minSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX - typeRadius + halfWorldX) * invSubCellSize)));
        const maxSX = Math.max(0, Math.min(totalCellsX - 1, Math.floor((camX + typeRadius + halfWorldX) * invSubCellSize)));
        const minSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ - typeRadius + halfWorldZ) * invSubCellSize)));
        const maxSZ = Math.max(0, Math.min(totalCellsZ - 1, Math.floor((camZ + typeRadius + halfWorldZ) * invSubCellSize)));

        const mountRadiusSq = typeRadius * typeRadius;

        for (let sz = minSZ; sz <= maxSZ; sz++) {
            const cellCenterZ = (sz + 0.5) * subCellSize - halfWorldZ;
            const diffZ = cellCenterZ - camZ;
            const diffZSq = diffZ * diffZ;

            for (let sx = minSX; sx <= maxSX; sx++) {
                const cellCenterX = (sx + 0.5) * subCellSize - halfWorldX;
                const diffX = cellCenterX - camX;

                if (diffX * diffX + diffZSq <= mountRadiusSq) {
                    const key = packSubCellKey(sx, sz);
                    let subCell = this.#subCells.get(key);
                    if (!subCell) {
                        subCell = {
                            subCellKey: key,
                            subCellX: sx,
                            subCellZ: sz,
                            centerX: cellCenterX,
                            centerZ: cellCenterZ,
                            instanceCount: -1,
                            isMounted: false,
                            mountedSlotIndex: -1
                        };
                        this.#subCells.set(key, subCell);
                    }
                    if (!subCell.isMounted && subCell.instanceCount !== 0) {
                        candidates.push(subCell);
                    }
                }
            }
        }

        const candidateCount = candidates.length;
        if (candidateCount === 0) return;

        if (this.#candidateDists.length < candidateCount) {
            this.#candidateDists = new Float32Array(Math.max(candidateCount, this.#candidateDists.length * 2));
        }
        sortSubCellsByDistance(candidates, this.#candidateDists, camX, camZ, candidateCount);

        let mountedThisFrame = 0;
        let populatedThisFrame = 0;
        const populateBudget = mountBudget;

        for (let i = 0; i < candidateCount; i++) {
            if (mountedThisFrame >= mountBudget) break;
            const subCell = candidates[i];

            if (subCell.instanceCount === -1) {
                if (populatedThisFrame >= populateBudget) {
                    continue;
                }
                this.#computeSubCellInstances(subCell, subCellSize, landscape);
                populatedThisFrame++;
                if (subCell.instanceCount <= 0) {
                    continue;
                }
            }

            this.#mountSubCell(subCell, megaBuffer, allocation, subCellSize);
            mountedThisFrame++;
        }
        this.#lastMountedCount = mountedThisFrame;
    }

    rebake(): void {
        const alloc = this.allocation;
        const landscape = this.#landscape;
        const baker = this.#baker;
        if (this.#megaBuffer && baker && alloc && landscape && alloc.instanceCount > 0) {
            const mounted = this.#mountedSubCells;
            const count = mounted.length;
            const {foliageManager} = landscape;
            const {subCellSize} = foliageManager;
            for (let i = 0; i < count; i++) {
                const subCell = mounted[i];
                const {isMounted, instanceCount, mountedSlotIndex} = subCell;
                if (isMounted && instanceCount > 0) {
                    baker.dispatchBakeSubCell(
                        this.#megaBuffer,
                        landscape,
                        this,
                        subCell,
                        alloc.rawBaseOffset + mountedSlotIndex,
                        instanceCount,
                        subCellSize
                    );
                }
            }
        }
    }

    #notifyUniformDirty(): void {
        this.onUniformDirty?.(this.typeId);
    }

    #notifyRepopulateRequired(): void {
        this.onRepopulateRequired?.(this);
        this.#notifyUniformDirty();
    }

    #syncInternalWind(): void {
        const unitList = this.#renderUnits;
        const count = unitList.length;
        const trunkScale = this.#trunkBendScale;
        const leafScale = this.#leafFlutterScale;
        const foliageH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const unit = unitList[i];
            const effectiveLeafScale = unit.isMasked ? leafScale : 0.0;
            unit.updateWindScales(
                trunkScale,
                effectiveLeafScale,
                foliageH
            );
        }

        const shadowList = this.#shadowMergedRenderUnits;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindScales(
                trunkScale,
                leafScale,
                foliageH
            );
        }
    }

    #initBuckets(
        renderUnits: FoliageRenderUnit[],
        shadowMergedRenderUnits: FoliageRenderUnit[]
    ): void {
        this.#renderUnits = renderUnits;
        this.#shadowMergedRenderUnits = shadowMergedRenderUnits;

        let impostorUnit: FoliageRenderUnit | null = null;
        const unitCount = renderUnits.length;
        for (let i = 0; i < unitCount; i++) {
            const unit = renderUnits[i];
            if (unit.isImpostor) {
                impostorUnit = unit;
                break;
            }
        }
        this.#impostorRenderUnit = impostorUnit;

        const lod0List = this.#lod0RenderUnits;
        lod0List.length = 0;
        let hasMaskedLOD0 = false;
        for (let i = 0; i < unitCount; i++) {
            const unit = renderUnits[i];
            const {lodIndex, isMasked} = unit;
            if (lodIndex === 0) {
                lod0List.push(unit);
                if (isMasked) {
                    hasMaskedLOD0 = true;
                }
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;

        this.#updatePassBuckets();
    }

    #updatePassBuckets(): void {
        const unitList = this.#renderUnits;
        const count = unitList.length;

        const prepassOpaqueList = this.#depthPrepassOpaqueRenderUnits;
        const prepassMaskedList = this.#depthPrepassMaskedRenderUnits;
        const mainList = this.#mainRenderUnits;

        prepassOpaqueList.length = 0;
        prepassMaskedList.length = 0;
        mainList.length = 0;

        const useImpostor = this.#useImpostor && !!this.#impostorRenderUnit;
        const useDepthPrepass = this.#useDepthPrepass;

        for (let i = 0; i < count; i++) {
            const unit = unitList[i];
            const {isImpostor, isMasked} = unit;
            if (!useImpostor && isImpostor) continue;
            if (useDepthPrepass && unit.canRenderInPass('depthPrepass')) {
                if (!isMasked) {
                    prepassOpaqueList.push(unit);
                } else {
                    prepassMaskedList.push(unit);
                }
            }
            if (unit.canRenderInPass('main')) {
                mainList.push(unit);
            }
        }
    }

    #updateRenderUnitGroundBlend(): void {
        const unitList = this.#renderUnits;
        const unitCount = unitList.length;
        for (let s = 0; s < unitCount; s++) {
            const unit = unitList[s];
            if (!unit.isImpostor) {
                unit.updateGroundBlendParams(this.groundBlendStrength, this.#groundBlendRange);
            }
        }
    }

    #updateRenderUnitReceiveShadow(): void {
        const unitList = this.#renderUnits;
        const unitCount = unitList.length;
        const receiveShadow = this.#receiveShadow;
        for (let s = 0; s < unitCount; s++) {
            const unit = unitList[s];
            if (!unit.isImpostor) {
                unit.updateReceiveShadow(receiveShadow);
            }
        }
    }

    #syncTypeParams(): void {
        const alloc = this.allocation;
        if (this.#megaBuffer && alloc) {
            const hasImp = !!this.#impostorRenderUnit;
            const effectiveLodList = (!this.#useImpostor && hasImp && this.#lodInfoListWithoutImpostor)
                ? this.#lodInfoListWithoutImpostor
                : this.#lodInfoList;

            const {cullingDistance, bottomOffset, height, castShadow, shadowCullDistance} = this;
            const effectiveShadowDist = castShadow ? shadowCullDistance : 0.0;
            this.#megaBuffer.updateTypeParams(
                alloc,
                cullingDistance,
                cullingDistance * 0.75,
                this.#boundingRadius,
                bottomOffset,
                effectiveLodList,
                effectiveShadowDist,
                height
            );
        }
    }

    #mountSubCell(subCell: FoliageSubCell, megaBuffer: FoliageMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
        if (subCell.isMounted) return;
        const {instanceCount: count} = subCell;
        const {instanceCount: currentActive, maxInstances, rawBaseOffset} = allocation;
        if (currentActive + count > maxInstances) return;

        const targetSlot = rawBaseOffset + currentActive;
        const landscape = this.#landscape;

        if (landscape?.hasValidScatterAtlas) {
            this.#baker.dispatchBakeSubCell(
                megaBuffer,
                landscape,
                this,
                subCell,
                targetSlot,
                count,
                subCellSize
            );
        }

        subCell.isMounted = true;
        subCell.mountedSlotIndex = currentActive;
        this.#mountedSubCells.push(subCell);

        allocation.instanceCount = currentActive + count;
    }

    #unmountSubCellAt(mountedIndex: number, megaBuffer: FoliageMegaBuffer, allocation: FoliageTypeAllocation, subCellSize: number): void {
        const mounted = this.#mountedSubCells;
        const targetSubCell = mounted[mountedIndex];
        const {mountedSlotIndex, instanceCount} = targetSubCell;
        const currentActive = allocation.instanceCount;

        const lastIndex = mounted.length - 1;
        const isLast = (mountedIndex === lastIndex);

        if (isLast) {
            mounted.pop();
            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;
            allocation.instanceCount = Math.max(0, currentActive - instanceCount);
        } else {
            const lastSubCell = mounted[lastIndex];
            mounted.length = lastIndex;
            const {instanceCount: lastCount} = lastSubCell;

            lastSubCell.mountedSlotIndex = mountedSlotIndex;
            mounted[mountedIndex] = lastSubCell;

            targetSubCell.isMounted = false;
            targetSubCell.mountedSlotIndex = -1;

            allocation.instanceCount = Math.max(0, currentActive - instanceCount);

            const landscape = this.#landscape;
            if (landscape?.hasValidScatterAtlas && lastCount > 0) {
                this.#baker.dispatchBakeSubCell(
                    megaBuffer,
                    landscape,
                    this,
                    lastSubCell,
                    allocation.rawBaseOffset + mountedSlotIndex,
                    lastCount,
                    subCellSize
                );
            }
        }
    }

    #computeSubCellInstances(cell: FoliageSubCell, subCellSize: number, currentLandscape?: Landscape): void {
        const landscape = currentLandscape ?? this.#landscape;
        if (!landscape) {
            cell.instanceCount = 0;
            return;
        }
        const {
            worldSizeX,
            worldSizeZ,
            invWorldSizeX,
            invWorldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ
        } = landscape;
        const {subCellX: scX, subCellZ: scZ} = cell;

        const {
            densityPerHectare,
            densityMultiplier = 1.0,
            targetLayer,
            densityScaleByWeight = true,
            minSlope = 0.0,
            maxSlope = 45.0
        } = this;
        const targetCountPerHectare = Math.max(0, Math.round(densityPerHectare * densityMultiplier));
        if (targetCountPerHectare <= 0) {
            cell.instanceCount = 0;
            return;
        }
        const hasTargetLayer = targetLayer !== undefined && targetLayer !== '';
        let targetLayerObj: any = null;
        if (hasTargetLayer && landscape.layers) {
            if (typeof targetLayer === 'string') {
                const layers = landscape.layers;
                const len = layers.length;
                for (let li = 0; li < len; li++) {
                    if (layers[li].name === targetLayer) {
                        targetLayerObj = layers[li];
                        break;
                    }
                }
            } else if (typeof targetLayer === 'number') {
                targetLayerObj = landscape.layers[targetLayer];
            }
        }
        if (hasTargetLayer && !targetLayerObj) {
            cell.instanceCount = 0;
            return;
        }

        const hasSlopeFilter = minSlope > 0.0 || maxSlope < 90.0;

        const subMinX = scX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = scZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FOLIAGE_SEED_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FOLIAGE_SEED_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FOLIAGE_SEED_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FOLIAGE_SEED_GRID_SIZE);

        const nameHash = this.#nameHash;
        let validCount = 0;

        for (let gz = startGz; gz <= endGz; gz++) {
            const gridMinZ = gz * FOLIAGE_SEED_GRID_SIZE - halfWorldZ;
            for (let gx = startGx; gx <= endGx; gx++) {
                const gridMinX = gx * FOLIAGE_SEED_GRID_SIZE - halfWorldX;
                let seed = computeScatterGridSeed(gx, gz, nameHash);

                const maxAttempts = densityScaleByWeight
                    ? targetCountPerHectare
                    : ((targetLayerObj || hasSlopeFilter) ? targetCountPerHectare * 2 : targetCountPerHectare);
                let generatedInGrid = 0;

                for (let i = 0; i < maxAttempts && generatedInGrid < targetCountPerHectare; i++) {
                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rX = (seed >>> 0) / 4294967296.0;

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;
                    const rZ = (seed >>> 0) / 4294967296.0;

                    const posX = gridMinX + rX * FOLIAGE_SEED_GRID_SIZE;
                    const posZ = gridMinZ + rZ * FOLIAGE_SEED_GRID_SIZE;

                    if (targetLayerObj) {
                        const u = (posX + halfWorldX) * invWorldSizeX;
                        const v = (posZ + halfWorldZ) * invWorldSizeZ;
                        const weight = sampleNormalizedLayerWeight(landscape, targetLayerObj, u, v);
                        if (weight < 0.1) continue;
                        if (densityScaleByWeight) {
                            seed ^= seed << 13;
                            seed ^= seed >>> 17;
                            seed ^= seed << 5;
                            const rReject = (seed >>> 0) / 4294967296.0;
                            if (rReject > weight) continue;
                        }
                    }

                    if (hasSlopeFilter) {
                        const step = 1.0;
                        const hL = landscape.getHeightAt(posX - step, posZ);
                        const hR = landscape.getHeightAt(posX + step, posZ);
                        const hD = landscape.getHeightAt(posX, posZ - step);
                        const hU = landscape.getHeightAt(posX, posZ + step);
                        const nx = (hL - hR) / (2 * step);
                        const nz = (hD - hU) / (2 * step);
                        const invLen = 1.0 / Math.sqrt(nx * nx + 1.0 + nz * nz);
                        const slopeDeg = Math.acos(Math.min(1.0, invLen)) * 57.29577951308232;
                        if (slopeDeg < minSlope || slopeDeg > maxSlope) continue;
                    }

                    seed ^= seed << 13;
                    seed ^= seed >>> 17;
                    seed ^= seed << 5;

                    if (this.randomRotationY) {
                        seed ^= seed << 13;
                        seed ^= seed >>> 17;
                        seed ^= seed << 5;
                    }

                    generatedInGrid++;

                    if (posX >= subMinX && posX < subMaxX && posZ >= subMinZ && posZ < subMaxZ) {
                        validCount++;
                    }
                }
            }
        }

        cell.instanceCount = validCount;
    }

    #populateSingleSubCell(scX: number, scZ: number, subCellSize: number, currentLandscape?: Landscape): FoliageSubCell {
        const landscape = currentLandscape ?? this.#landscape;
        const halfWorldX = landscape ? landscape.halfWorldSizeX : 0;
        const halfWorldZ = landscape ? landscape.halfWorldSizeZ : 0;
        const cell: FoliageSubCell = {
            subCellKey: packSubCellKey(scX, scZ),
            subCellX: scX,
            subCellZ: scZ,
            centerX: (scX + 0.5) * subCellSize - halfWorldX,
            centerZ: (scZ + 0.5) * subCellSize - halfWorldZ,
            instanceCount: -1,
            isMounted: false,
            mountedSlotIndex: -1
        };
        this.#computeSubCellInstances(cell, subCellSize, landscape);
        return cell;
    }
}

Object.freeze(Foliage);
export default Foliage;

