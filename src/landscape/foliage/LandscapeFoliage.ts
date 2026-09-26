import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import FoliageSubMeshAssembler from "./core/assembler/FoliageSubMeshAssembler";
import FoliageSubCellPartitioner from "./core/spatial/FoliageSubCellPartitioner";
import FoliageSubCellStreamer from "./core/spatial/FoliageSubCellStreamer";

import FoliageSubMesh from "./FoliageSubMesh";
import FoliageShadowMergedSubMesh from "./core/submesh/FoliageShadowMergedSubMesh";
import FoliageMegaBuffer, {FoliageTypeAllocation} from "./core/buffer/FoliageMegaBuffer";
import type FoliageBaker from "./core/baking/FoliageBaker";

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

export interface LandscapeFoliageOptions {
    name: string;

    lods: FoliageLODConfig[];

    densityPerHectare?: number;

    density?: number;

    maxInstances?: number;

    cullingDistance?: number;

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    useImpostor?: boolean;

    bottomOffset?: number;

    preservePivot?: boolean;

    castShadow?: boolean;

    maxShadowDistance?: number;

    enableStreaming?: boolean;

    streamingRadius?: number;

    subCellSize?: number;

    targetLayer?: string | number;

    minSlope?: number;

    maxSlope?: number;

    densityScaleByWeight?: boolean;

    windMultiplier?: number;

    windFlutterMultiplier?: number;


    alignToNormal?: boolean;
    alignFactor?: number;

    densityMultiplier?: number;
    groundBlendStrength?: number;
    groundBlendRange?: number;
}

export class LandscapeFoliage {
    #options: LandscapeFoliageOptions;
    #redGPUContext: RedGPUContext;

    #subMeshes: FoliageSubMesh[] = [];
    #lod0SubMeshes: FoliageSubMesh[] = [];
    #depthPrepassSubMeshes: FoliageSubMesh[] = [];
    #mainSubMeshes: FoliageSubMesh[] = [];
    #shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    #lodInfoList: FoliageLODInfo[] = [];

    #megaBuffer: FoliageMegaBuffer | null = null;
    #allocation: FoliageTypeAllocation | null = null;

    #cullingDistance: number = 2000.0;
    #fadeStartDistance: number = 1500.0;
    #bottomOffset: number = 0;
    #boundingRadius: number = 10.0;
    #boundingHeight: number = 2.0;
    #nameHash: number = 0;
    #castShadow: boolean = true;
    #maxShadowDistance: number = 300.0;
    #useImpostor: boolean = true;
    #useDepthPrepass: boolean = true;
    #hasMaskedLOD0: boolean = false;
    #enableStreaming: boolean = true;
    #streamingRadius: number = 600.0;
    #subCellSize: number = 100.0;
    #targetLayer?: string | number;
    #minSlope: number = 0.0;
    #maxSlope: number = 45.0;
    #densityScaleByWeight: boolean = true;
    #densityPerHectare: number = 20.0;
    #densityMultiplier: number = 1.0;
    #windMultiplier: number = 1.0;
    #windFlutterMultiplier: number = 1.0;
    #alignToNormal: boolean = false;
    #alignFactor: number = 1.0;
    #groundBlendStrength: number = 0.8;
    #groundBlendRange: number = 1.5;
    #lastWindParams: {
        windDirX: number;
        windDirY: number;
        windSpeed: number;
        windStrength: number;
        windFreq: number;
        windFlutterStrength: number;
        windEnabled: boolean;
    } | null = null;
    #impostorSubMesh: FoliageSubMesh | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #loadedTileKeys: Set<number> = new Set();
    #streamer: FoliageSubCellStreamer;
    #baker: FoliageBaker | null = null;
    #onDirty?: () => void;
    #onRepopulateRequired?: (type: LandscapeFoliage) => void;

    /**
     * [KO] 지형 식생/나무 인스턴스를 생성합니다.
     * @remarks 사용자가 직접 생성하지 마시고 `landscape.foliageManager.addFoliage(options)` 팩토리 메서드를 사용하십시오.
     * [EN] Creates a landscape foliage instance.
     * @remarks Do not instantiate directly; use the `landscape.foliageManager.addFoliage(options)` factory method instead.
     */
    constructor(
        redGPUContext: RedGPUContext,
        options: LandscapeFoliageOptions,
        sharedSubMeshBindGroupLayout?: GPUBindGroupLayout | null,
        megaBuffer?: FoliageMegaBuffer | null,
        onDirty?: () => void,
        onRepopulateRequired?: (type: LandscapeFoliage) => void,
        baker?: FoliageBaker | null
    ) {
        this.#streamer = new FoliageSubCellStreamer(this);
        this.#redGPUContext = redGPUContext;
        this.#options = options;
        this.#onDirty = onDirty;
        this.#onRepopulateRequired = onRepopulateRequired;
        this.#baker = baker || null;
        this.#castShadow = options.castShadow !== false;

        this.#useImpostor = options.useImpostor !== undefined
            ? options.useImpostor
            : true;
        this.#useDepthPrepass = true;

        this.#subMeshVertexBindGroupLayout = sharedSubMeshBindGroupLayout || null;
        this.#megaBuffer = megaBuffer || null;

        this.#cullingDistance = options.cullingDistance ?? 2000.0;
        this.#fadeStartDistance = this.#cullingDistance * 0.75;

        const minScale: [number, number, number] = options.minScale ? [...options.minScale] : [1.0, 1.0, 1.0];
        const maxScale: [number, number, number] = options.maxScale ? [...options.maxScale] : [1.0, 1.0, 1.0];

        let resolvedDensityPerHectare = 20.0;
        if (options.densityPerHectare !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(options.densityPerHectare) || 0);
        } else if (options.density !== undefined) {
            resolvedDensityPerHectare = Math.max(0, Number(options.density) || 0);
        }
        this.#densityPerHectare = resolvedDensityPerHectare;

        const densityMultiplier = options.densityMultiplier !== undefined
            ? Math.max(0.0, Number(options.densityMultiplier) || 0.0)
            : 1.0;
        this.#densityMultiplier = densityMultiplier;
        const streamingRadius = options.streamingRadius ?? 600.0;
        const subCellSize = options.subCellSize ?? 100.0;

        const effectiveRadius = streamingRadius + 150.0;
        const effectiveAreaMetersSq = Math.PI * effectiveRadius * effectiveRadius * 1.25;
        const activeHectares = effectiveAreaMetersSq / 10000.0;

        const expectedActiveInstances = activeHectares * resolvedDensityPerHectare * densityMultiplier;
        const calculatedMax = Math.ceil((expectedActiveInstances * 1.30) / 64) * 64;

        const minSafeCapacity = 16384;

        const resolvedMaxInstances = options.maxInstances !== undefined
            ? Math.max(options.maxInstances, calculatedMax, minSafeCapacity)
            : Math.max(calculatedMax, minSafeCapacity);

        const resolvedWindMultiplier = options.windMultiplier !== undefined ? Math.max(0, Number(options.windMultiplier) || 0) : 1.0;
        const resolvedWindFlutterMultiplier = options.windFlutterMultiplier !== undefined ? Math.max(0, Number(options.windFlutterMultiplier) || 0) : 1.0;

        const resolvedAlignToNormal = options.alignToNormal ?? false;
        const resolvedAlignFactor = options.alignFactor !== undefined
            ? Math.min(1.0, Math.max(0.0, Number(options.alignFactor) || 0))
            : 1.0;

        this.#windMultiplier = resolvedWindMultiplier;
        this.#windFlutterMultiplier = resolvedWindFlutterMultiplier;
        this.#alignToNormal = resolvedAlignToNormal;
        this.#alignFactor = resolvedAlignFactor;

        this.#groundBlendStrength = options.groundBlendStrength !== undefined
            ? Math.max(0.0, Math.min(1.0, Number(options.groundBlendStrength) || 0.0))
            : 0.8;
        this.#groundBlendRange = options.groundBlendRange !== undefined
            ? Math.max(0.1, Number(options.groundBlendRange) || 0.1)
            : 1.5;

        let hash = 0;
        const nameStr = options.name || '';
        for (let c = 0; c < nameStr.length; c++) {
            hash = (hash * 31 + nameStr.charCodeAt(c)) | 0;
        }
        this.#nameHash = hash;

        const assembleResult = FoliageSubMeshAssembler.assemble(
            this.#redGPUContext,
            options,
            this.#subMeshVertexBindGroupLayout!
        );
        this.#subMeshes = assembleResult.subMeshes;
        this.#lod0SubMeshes = this.#subMeshes.filter(sub => sub.lodIndex === 0);
        let hasMaskedLOD0 = false;
        for (let i = 0; i < this.#lod0SubMeshes.length; i++) {
            if (this.#lod0SubMeshes[i].isMasked) {
                hasMaskedLOD0 = true;
                break;
            }
        }
        this.#hasMaskedLOD0 = hasMaskedLOD0;
        this.#shadowMergedSubMeshes = assembleResult.shadowMergedSubMeshes || [];
        this.#lodInfoList = assembleResult.lodInfoList || [];
        this.#bottomOffset = options.bottomOffset ?? 0;
        this.#boundingRadius = assembleResult.boundingRadius || 10.0;
        this.#boundingHeight = assembleResult.boundingHeight || 2.0;

        let defaultShadowDist = 300.0;
        const effectiveHeight = this.#boundingHeight * maxScale[1];
        if (effectiveHeight < 0.6) {
            defaultShadowDist = 35.0;
        } else if (effectiveHeight < 1.5) {
            defaultShadowDist = 75.0;
        } else if (effectiveHeight < 3.5) {
            defaultShadowDist = 160.0;
        } else {
            defaultShadowDist = 350.0;
        }

        this.#maxShadowDistance = options.maxShadowDistance !== undefined
            ? Math.max(0, Number(options.maxShadowDistance) || 0)
            : defaultShadowDist;

        this.#options = Object.freeze({
            name: options.name,
            lods: options.lods,
            maxInstances: resolvedMaxInstances,
            cullingDistance: this.#cullingDistance,
            minScale,
            maxScale,
            randomRotationY: options.randomRotationY ?? true,
            useImpostor: this.#useImpostor,
            bottomOffset: this.#bottomOffset,
            castShadow: this.#castShadow,
            maxShadowDistance: this.#maxShadowDistance,
            enableStreaming: options.enableStreaming !== false,
            streamingRadius,
            subCellSize,
            targetLayer: options.targetLayer,
            minSlope: options.minSlope ?? 0.0,
            maxSlope: options.maxSlope ?? 45.0,
            densityScaleByWeight: options.densityScaleByWeight !== false,
            densityPerHectare: resolvedDensityPerHectare,
            densityMultiplier,
            windMultiplier: resolvedWindMultiplier,
            windFlutterMultiplier: resolvedWindFlutterMultiplier,
            alignToNormal: resolvedAlignToNormal,
            alignFactor: resolvedAlignFactor,
            groundBlendStrength: this.#groundBlendStrength,
            groundBlendRange: this.#groundBlendRange
        });

        this.#enableStreaming = this.#options.enableStreaming!;
        this.#streamingRadius = this.#options.streamingRadius!;
        this.#subCellSize = this.#options.subCellSize!;
        this.#targetLayer = this.#options.targetLayer;
        this.#minSlope = this.#options.minSlope!;
        this.#maxSlope = this.#options.maxSlope!;
        this.#densityScaleByWeight = this.#options.densityScaleByWeight!;
        this.#densityPerHectare = resolvedDensityPerHectare;
        this.#densityMultiplier = this.#options.densityMultiplier!;

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
                effectiveShadowDist,
                this.#boundingHeight
            );
        }
    }

    get name(): string {
        return this.#options.name;
    }

    get nameHash(): number {
        return this.#nameHash;
    }

    get maxInstances(): number {
        return this.bufferCapacity;
    }

    get bufferCapacity(): number {
        return this.#allocation ? this.#allocation.maxInstances : (this.#options.maxInstances ?? 0);
    }

    get minScale(): readonly [number, number, number] {
        return this.#options.minScale;
    }

    get maxScale(): readonly [number, number, number] {
        return this.#options.maxScale;
    }

    get randomRotationY(): boolean {
        return this.#options.randomRotationY;
    }

    get options(): LandscapeFoliageOptions {
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

    get lod0SubMeshes(): readonly FoliageSubMesh[] {
        return this.#lod0SubMeshes;
    }

    get shadowMergedSubMeshes(): readonly FoliageShadowMergedSubMesh[] {
        return this.#shadowMergedSubMeshes;
    }

    get lodInfoList(): readonly FoliageLODInfo[] {
        return this.#lodInfoList;
    }

    get activeInstanceCount(): number {
        return this.#allocation?.activeCount ?? 0;
    }

    get totalInstanceCount(): number {
        return this.#streamer.totalInstanceCount;
    }

    get boundingRadius(): number {
        return this.#boundingRadius;
    }

    get boundingHeight(): number {
        return this.#boundingHeight;
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        if (this.#bottomOffset !== val) {
            this.#bottomOffset = val;
            this.#syncTypeParams();
            this.rebake();
        }
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, val);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.#fadeStartDistance = numVal * 0.75;
            this.#syncTypeParams();
        }
    }

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

    get enableStreaming(): boolean {
        return this.#enableStreaming;
    }

    set enableStreaming(value: boolean) {
        this.#enableStreaming = !!value;
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(value: number) {
        const numVal = Math.max(10.0, Number(value) || 10.0);
        if (this.#streamingRadius !== numVal) {
            this.#streamingRadius = numVal;
            this.#onDirty?.();
        }
    }

    get subCellSize(): number {
        return this.#subCellSize;
    }

    set subCellSize(value: number) {
        this.#subCellSize = Math.max(10.0, Number(value) || 10.0);
    }

    get targetLayer(): string | number | undefined {
        return this.#targetLayer;
    }

    set targetLayer(val: string | number | undefined) {
        if (this.#targetLayer !== val) {
            this.#targetLayer = val;
            this.#onRepopulateRequired?.(this);
        }
    }

    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#minSlope !== numVal) {
            this.#minSlope = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#maxSlope !== numVal) {
            this.#maxSlope = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(val: boolean) {
        const boolVal = !!val;
        if (this.#densityScaleByWeight !== boolVal) {
            this.#densityScaleByWeight = boolVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityPerHectare !== numVal) {
            this.#densityPerHectare = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get density(): number {
        return this.#densityPerHectare;
    }

    set density(val: number) {
        this.densityPerHectare = val;
    }

    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityMultiplier !== numVal) {
            this.#densityMultiplier = numVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get instancesPerCell(): number {
        const cellArea = this.#subCellSize * this.#subCellSize;
        return Math.max(0, Math.round((this.#densityPerHectare * (cellArea / 10000.0)) * this.#densityMultiplier));
    }

    get windMultiplier(): number {
        return this.#windMultiplier;
    }

    set windMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windMultiplier !== numVal) {
            this.#windMultiplier = numVal;
            this.#syncInternalWind();
            this.#onDirty?.();
        }
    }

    get windFlutterMultiplier(): number {
        return this.#windFlutterMultiplier;
    }

    set windFlutterMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#windFlutterMultiplier !== numVal) {
            this.#windFlutterMultiplier = numVal;
            this.#syncInternalWind();
            this.#onDirty?.();
        }
    }


    get alignToNormal(): boolean {
        return this.#alignToNormal;
    }

    set alignToNormal(val: boolean) {
        const boolVal = !!val;
        if (this.#alignToNormal !== boolVal) {
            this.#alignToNormal = boolVal;
            this.#onRepopulateRequired?.(this);
        }
    }

    get alignFactor(): number {
        return this.#alignFactor;
    }

    set alignFactor(val: number) {
        const numVal = Math.min(1.0, Math.max(0.0, Number(val) || 0.0));
        if (this.#alignFactor !== numVal) {
            this.#alignFactor = numVal;
            if (this.#alignToNormal) {
                this.#onRepopulateRequired?.(this);
            }
        }
    }

    syncWindToSubMeshes(
        gpuDevice: GPUDevice,
        windDirX: number,
        windDirY: number,
        windSpeed: number,
        windStrength: number,
        windFreq: number,
        windFlutterStrength: number,
        windEnabled: boolean
    ): void {
        this.#lastWindParams = {
            windDirX,
            windDirY,
            windSpeed,
            windStrength,
            windFreq,
            windFlutterStrength,
            windEnabled,
        };
        const subList = this.#subMeshes;
        const count = subList.length;
        const windMul = this.#windMultiplier;
        const flutterMul = this.#windFlutterMultiplier;
        const treeH = Math.max(5.0, this.#boundingRadius * 1.8);

        for (let i = 0; i < count; i++) {
            const sub = subList[i];

            const effectiveFlutterMul = sub.isMasked ? flutterMul : 0.0;
            sub.updateWindParams(
                gpuDevice,
                windDirX,
                windDirY,
                windSpeed,
                windStrength,
                windFreq,
                windFlutterStrength,
                windEnabled,
                windMul,
                effectiveFlutterMul,
                treeH
            );
        }

        const shadowList = this.#shadowMergedSubMeshes;
        const shadowCount = shadowList.length;
        for (let i = 0; i < shadowCount; i++) {
            shadowList[i].updateWindParams(
                gpuDevice,
                windDirX,
                windDirY,
                windSpeed,
                windStrength,
                windFreq,
                windFlutterStrength,
                windEnabled,
                windMul,
                flutterMul * 0.5,
                treeH
            );
        }
    }

    #syncInternalWind(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#lastWindParams) return;
        this.syncWindToSubMeshes(
            gpuDevice,
            this.#lastWindParams.windDirX,
            this.#lastWindParams.windDirY,
            this.#lastWindParams.windSpeed,
            this.#lastWindParams.windStrength,
            this.#lastWindParams.windFreq,
            this.#lastWindParams.windFlutterStrength,
            this.#lastWindParams.windEnabled
        );
    }

    clearTileCache(): void {
        this.#streamer.clear();
        this.#loadedTileKeys.clear();
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
    get useDepthPrepass(): boolean {
        return this.#useDepthPrepass;
    }
    get hasMaskedLOD0(): boolean {
        return this.#hasMaskedLOD0;
    }

    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(v: number) {
        const val = Math.max(0.0, Math.min(1.0, Number(v) || 0.0));
        if (this.#groundBlendStrength !== val) {
            this.#groundBlendStrength = val;
            this.#updateSubMeshGroundBlend();
        }
    }

    get groundBlendRange(): number {
        return this.#groundBlendRange;
    }

    set groundBlendRange(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#groundBlendRange !== val) {
            this.#groundBlendRange = val;
            this.#updateSubMeshGroundBlend();
        }
    }

    #updateSubMeshGroundBlend(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;
        const subCount = this.#subMeshes.length;
        for (let s = 0; s < subCount; s++) {
            const sub = this.#subMeshes[s];
            if (!sub.isImpostor) {
                sub.updateGroundBlendParams(gpuDevice, this.#groundBlendStrength, this.#groundBlendRange);
            }
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

    populateTile(comp: any, landscape?: any): void {
        if (!comp) return;
        const cz = (comp.componentZ ?? 0) & 0xffff;
        const cx = (comp.componentX ?? 0) & 0xffff;
        const key = (cz << 16) | cx;
        if (this.#loadedTileKeys.has(key)) return;

        if (landscape && typeof landscape.isTileLoaded === 'function') {
            if (!landscape.isTileLoaded(cz, cx)) {
                return;
            }
        }

        this.#loadedTileKeys.add(key);

        const chunks = FoliageSubCellPartitioner.partitionTile(
            comp,
            this,
            landscape,
            this.#subCellSize
        );
        this.#streamer.addChunks(chunks);

        if (!this.#enableStreaming) {
            this.#streamer.update(new Set(), new Int32Array(0), 0, 0, 0, false);
        }
    }

    updateStreaming(
        activeSubCellKeys: ReadonlySet<number>,
        activeKeyArray: Int32Array,
        activeKeyCount: number,
        camX: number,
        camZ: number
    ): void {
        this.#streamer.update(activeSubCellKeys, activeKeyArray, activeKeyCount, camX, camZ, this.#enableStreaming);
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

    uploadRangeToGPU(startIndex: number, count: number): void {
        if (this.#megaBuffer && this.#allocation) {
            this.#megaBuffer.uploadAllocationRangeToGPU(this.#allocation, startIndex, count);
            if (this.#baker && count > 0) {
                const globalIndex = this.#allocation.rawBaseOffset + startIndex;
                this.#baker.addBakeTasks(globalIndex, count, this.#allocation.typeId);
            }
        }
    }

    rebake(): void {
        if (this.#megaBuffer && this.#allocation && this.#baker && this.#allocation.activeCount > 0) {
            this.#baker.addBakeTasks(
                this.#allocation.rawBaseOffset,
                this.#allocation.activeCount,
                this.#allocation.typeId
            );
        }
    }

    destroy(): void {
        this.#streamer.clear();
        for (let i = 0; i < this.#subMeshes.length; i++) {
            const sub = this.#subMeshes[i];
            sub.destroy();
        }
        this.#subMeshes.length = 0;
        this.#lod0SubMeshes.length = 0;
        for (let i = 0; i < this.#shadowMergedSubMeshes.length; i++) {
            const shadowSub = this.#shadowMergedSubMeshes[i];
            shadowSub.destroy();
        }
        this.#shadowMergedSubMeshes.length = 0;
        this.#loadedTileKeys.clear();
    }

    #updatePassBuckets(): void {
        const useImp = this.#useImpostor;
        const useDepthPrepass = this.#useDepthPrepass;
        const subList = this.#subMeshes;
        const count = subList.length;

        const prepassList: FoliageSubMesh[] = [];
        const mainList: FoliageSubMesh[] = [];

        for (let i = 0; i < count; i++) {
            const sub = subList[i];
            if (!useImp && sub.isImpostor) continue;
            if (useDepthPrepass && sub.canRenderInPass('depthPrepass')) {
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
                effectiveShadowDist,
                this.#boundingHeight
            );
        }
    }
}

Object.freeze(LandscapeFoliage);
export default LandscapeFoliage;
