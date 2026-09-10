import RedGPUContext from "../../../context/RedGPUContext";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../mesh/Mesh";
import Primitive from "../../../primitive/core/Primitive";

export interface GrassLODConfig {
    mesh: Mesh;
    lodDistance?: number;
}

export interface GrassLODInfo {
    lodIndex: number;
    lodDistance: number;
    geometry: Geometry | Primitive;
    mesh: Mesh;
}

export interface GrassTypeOptions {
    name?: string;
    lods: GrassLODConfig[];
    baseColorTexture?: string | BitmapTexture;
    normalTexture?: string | BitmapTexture;
    ormTexture?: string | BitmapTexture;
    roughnessTexture?: string | BitmapTexture;
    metallicRoughnessTexture?: string | BitmapTexture;
    normalScale?: number;
    aoIntensity?: number;
    densityPerHectare?: number;
    densityMultiplier?: number;
    minWeightThreshold?: number;
    densityScaleByWeight?: boolean;
    minSlope?: number;
    maxSlope?: number;
    cullingDistance?: number;
    fadeStartDistance?: number;
    shrinkStartDistance?: number;
    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    height?: number;
    groundBlendStrength?: number;
    alphaCutoff?: number;
    roughness?: number;
    metallic?: number;
    subsurfaceStrength?: number;
    subsurfaceColor?: [number, number, number];
    subsurfaceDistortion?: number;
    exposureBoost?: number;
    minY?: number;
    targetLayer?: string | number;
    bottomOffset?: number;
    receiveShadow?: boolean;
    shadowStrength?: number;
}

export class GrassType {
    #redGPUContext: RedGPUContext;
    #mesh?: Mesh;
    #name: string;
    #geometry: Geometry | Primitive;
    #lods: GrassLODInfo[] = [];
    #baseColorTexture: BitmapTexture;
    #normalTexture: BitmapTexture | null = null;
    #ormTexture: BitmapTexture | null = null;
    #normalScale: number = 1.0;
    #aoIntensity: number = 1.0;
    #densityPerHectare: number = 5000.0;
    #densityMultiplier: number = 1.0;
    #minWeightThreshold: number = 0.05;
    #densityScaleByWeight: boolean = true;
    #minSlope: number = 0.0;
    #maxSlope: number = 35.0;
    #cullingDistance: number = 100.0;
    #fadeStartDistance: number = 75.0;
    #shrinkStartDistance: number = 60.0;
    #minScale: [number, number, number] = [0.7, 0.7, 0.7];
    #maxScale: [number, number, number] = [1.3, 1.4, 1.3];
    #meshHeight: number = 1.0;
    #minY: number = 0.0;
    #exposureBoost: number = 1.45;
    #subsurfaceStrength: number = 1.0;
    #subsurfaceColor: [number, number, number] = [0.45, 0.85, 0.15];
    #subsurfaceDistortion: number = 0.35;
    #groundBlendStrength: number = 0.75;
    #alphaCutoff: number = 0.45;
    #roughness: number = 0.55;
    #metallic: number = 0.0;
    #targetLayer: string | number = '';
    #bottomOffset: number = 0.0;
    #receiveShadow: boolean = true;
    #shadowStrength: number = 1.0;

    #typeId: number = 0;
    #onChanged: (() => void) | null = null;

    constructor(redGPUContext: RedGPUContext, options: GrassTypeOptions) {
        this.#redGPUContext = redGPUContext;

        if (!options.lods || options.lods.length === 0) {
            throw new Error(`[GrassType] 'lods' array must be provided with at least one LOD entry!`);
        }

        const sortedLods = [...options.lods].sort((a, b) => (a.lodDistance ?? 9999) - (b.lodDistance ?? 9999));
        const lod0 = sortedLods[0];
        const lod0Mesh = lod0.mesh;
        if (!lod0Mesh) {
            throw new Error(`[GrassType] LOD 0 must contain a valid Mesh instance!`);
        }
        this.#mesh = lod0Mesh;
        this.#name = options.name || lod0Mesh.name || `GrassType_${Math.random().toString(36).substring(2, 7)}`;

        const mat = lod0Mesh.material as any;
        const resolvedTexture = options.baseColorTexture ?? mat?.baseColorTexture ?? mat?.diffuseTexture;
        if (typeof resolvedTexture === 'string') {
            this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
        } else if (resolvedTexture) {
            this.#baseColorTexture = resolvedTexture;
        }

        const resolvedNormal = options.normalTexture ?? mat?.normalTexture;
        if (typeof resolvedNormal === 'string') {
            this.#normalTexture = new BitmapTexture(redGPUContext, resolvedNormal);
        } else if (resolvedNormal) {
            this.#normalTexture = resolvedNormal;
        }
        if (options.normalScale !== undefined) {
            this.#normalScale = options.normalScale;
        } else if (mat?.normalScale !== undefined) {
            this.#normalScale = mat.normalScale;
        }

        const resolvedORM = options.ormTexture ?? options.metallicRoughnessTexture ?? options.roughnessTexture ?? mat?.packedORMTexture ?? mat?.metallicRoughnessTexture ?? mat?.roughnessTexture;
        if (typeof resolvedORM === 'string') {
            this.#ormTexture = new BitmapTexture(redGPUContext, resolvedORM);
        } else if (resolvedORM) {
            this.#ormTexture = resolvedORM;
        }
        if (options.aoIntensity !== undefined) {
            this.#aoIntensity = options.aoIntensity;
        } else if (mat?.occlusionStrength !== undefined) {
            this.#aoIntensity = mat.occlusionStrength;
        }

        const lod0Geom = lod0Mesh.geometry;
        if (!lod0Geom) {
            throw new Error(`[GrassType] LOD 0 mesh must have a valid geometry!`);
        }
        this.#geometry = lod0Geom;

        const vol = this.#geometry.volume;
        if (options.minY !== undefined) {
            this.#minY = options.minY;
        } else if (vol && vol.minY !== undefined) {
            this.#minY = vol.minY;
        } else {
            this.#minY = 0.0;
        }

        if (options.height !== undefined) {
            this.#meshHeight = options.height;
        } else {
            const computedH = (vol && (vol.maxY !== undefined && vol.minY !== undefined)) ? (vol.maxY - vol.minY) : 1.0;
            this.#meshHeight = computedH > 0 ? computedH : 1.0;
        }

        const defaultCullDist = options.cullingDistance ?? 100.0;
        this.#lods = sortedLods.map((lodConfig, index) => {
            const m = lodConfig.mesh;
            return {
                lodIndex: index,
                lodDistance: lodConfig.lodDistance ?? defaultCullDist,
                geometry: m.geometry,
                mesh: m
            };
        });

        if (options.densityPerHectare !== undefined) this.#densityPerHectare = options.densityPerHectare;
        if (options.densityMultiplier !== undefined) this.#densityMultiplier = options.densityMultiplier;
        if (options.minWeightThreshold !== undefined) this.#minWeightThreshold = options.minWeightThreshold;
        if (options.densityScaleByWeight !== undefined) this.#densityScaleByWeight = options.densityScaleByWeight;
        if (options.minSlope !== undefined) this.#minSlope = options.minSlope;
        if (options.maxSlope !== undefined) this.#maxSlope = options.maxSlope;
        if (options.cullingDistance !== undefined) this.#cullingDistance = options.cullingDistance;
        if (options.fadeStartDistance !== undefined) this.#fadeStartDistance = options.fadeStartDistance;
        if (options.shrinkStartDistance !== undefined) this.#shrinkStartDistance = options.shrinkStartDistance;
        if (options.minScale) this.#minScale = [...options.minScale];
        if (options.maxScale) this.#maxScale = [...options.maxScale];
        if (options.groundBlendStrength !== undefined) this.#groundBlendStrength = options.groundBlendStrength;

        const inheritedCutoff = mat?.cutOff !== undefined ? mat.cutOff : mat?.alphaCutoff;
        if (options.alphaCutoff !== undefined) {
            this.#alphaCutoff = options.alphaCutoff;
        } else if (inheritedCutoff !== undefined) {
            this.#alphaCutoff = inheritedCutoff;
        }

        const inheritedRoughness = mat?.roughnessFactor ?? mat?.roughness;
        if (options.roughness !== undefined) {
            this.#roughness = options.roughness;
        } else if (inheritedRoughness !== undefined) {
            this.#roughness = inheritedRoughness;
        }

        if (options.metallic !== undefined) {
            this.#metallic = options.metallic;
        } else {
            this.#metallic = 0.0;
        }

        if (options.subsurfaceStrength !== undefined) this.#subsurfaceStrength = options.subsurfaceStrength;
        if (options.subsurfaceColor) this.#subsurfaceColor = [...options.subsurfaceColor];
        if (options.subsurfaceDistortion !== undefined) this.#subsurfaceDistortion = options.subsurfaceDistortion;
        if (options.exposureBoost !== undefined) this.#exposureBoost = options.exposureBoost;
        if (options.targetLayer !== undefined) this.#targetLayer = options.targetLayer;
        if (options.bottomOffset !== undefined) this.#bottomOffset = options.bottomOffset;
        if (options.receiveShadow !== undefined) this.#receiveShadow = options.receiveShadow;
        else if (lod0Mesh.receiveShadow !== undefined) this.#receiveShadow = lod0Mesh.receiveShadow;
        if (options.shadowStrength !== undefined) this.#shadowStrength = options.shadowStrength;
    }

    get name(): string {
        return this.#name;
    }

    get mesh(): Mesh | undefined {
        return this.#mesh;
    }

    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    get lods(): GrassLODInfo[] {
        return this.#lods;
    }

    get lodCount(): number {
        return this.#lods.length;
    }

    get baseColorTexture(): BitmapTexture {
        return this.#baseColorTexture;
    }

    get normalTexture(): BitmapTexture | null {
        return this.#normalTexture;
    }

    set normalTexture(v: BitmapTexture | null) {
        this.#normalTexture = v;
        this.#notifyChange();
    }

    get ormTexture(): BitmapTexture | null {
        return this.#ormTexture;
    }

    set ormTexture(v: BitmapTexture | null) {
        this.#ormTexture = v;
        this.#notifyChange();
    }

    get normalScale(): number {
        return this.#normalScale;
    }

    set normalScale(v: number) {
        this.#normalScale = v;
    }

    get aoIntensity(): number {
        return this.#aoIntensity;
    }

    set aoIntensity(v: number) {
        this.#aoIntensity = Math.max(0.0, Math.min(2.0, v));
    }

    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(v: number) {
        this.#densityPerHectare = Math.max(0, v);
        this.#notifyChange();
    }

    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(v: number) {
        this.#densityMultiplier = Math.max(0, v);
        this.#notifyChange();
    }

    get instancesPerCell(): number {
        return Math.max(1, Math.round((this.#densityPerHectare * 256.0 / 10000.0) * this.#densityMultiplier));
    }

    get minWeightThreshold(): number {
        return this.#minWeightThreshold;
    }

    set minWeightThreshold(v: number) {
        this.#minWeightThreshold = Math.max(0, Math.min(1, v));
        this.#notifyChange();
    }

    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(v: boolean) {
        this.#densityScaleByWeight = v;
        this.#notifyChange();
    }

    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(v: number) {
        this.#minSlope = Math.max(0, Math.min(90, v));
        this.#notifyChange();
    }

    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(v: number) {
        this.#maxSlope = Math.max(0, Math.min(90, v));
        this.#notifyChange();
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(v: number) {
        this.#cullingDistance = Math.max(10, v);
        this.#notifyChange();
    }

    get fadeStartDistance(): number {
        return this.#fadeStartDistance;
    }

    set fadeStartDistance(v: number) {
        this.#fadeStartDistance = Math.max(0, v);
        this.#notifyChange();
    }

    get shrinkStartDistance(): number {
        return this.#shrinkStartDistance;
    }

    set shrinkStartDistance(v: number) {
        this.#shrinkStartDistance = Math.max(0, v);
        this.#notifyChange();
    }

    get minScale(): [number, number, number] {
        return this.#minScale;
    }

    set minScale(v: [number, number, number]) {
        this.#minScale = [v[0], v[1], v[2]];
        this.#notifyChange();
    }

    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    set maxScale(v: [number, number, number]) {
        this.#maxScale = [v[0], v[1], v[2]];
        this.#notifyChange();
    }

    get meshHeight(): number {
        return this.#meshHeight;
    }

    get minY(): number {
        return this.#minY;
    }

    get exposureBoost(): number {
        return this.#exposureBoost;
    }

    set exposureBoost(v: number) {
        this.#exposureBoost = Math.max(0.1, v);
    }

    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(v: number) {
        this.#groundBlendStrength = Math.max(0, Math.min(1, v));
    }

    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set alphaCutoff(v: number) {
        this.#alphaCutoff = Math.max(0.01, Math.min(1, v));
    }

    get roughness(): number {
        return this.#roughness;
    }

    set roughness(v: number) {
        this.#roughness = Math.max(0.04, Math.min(1, v));
    }

    get subsurfaceStrength(): number {
        return this.#subsurfaceStrength;
    }

    set subsurfaceStrength(v: number) {
        this.#subsurfaceStrength = Math.max(0.0, Math.min(3.0, v));
    }

    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set subsurfaceColor(v: [number, number, number]) {
        this.#subsurfaceColor = [v[0], v[1], v[2]];
    }

    get subsurfaceDistortion(): number {
        return this.#subsurfaceDistortion;
    }

    set subsurfaceDistortion(v: number) {
        this.#subsurfaceDistortion = Math.max(0.0, Math.min(1.0, v));
    }

    get metallic(): number {
        return this.#metallic;
    }

    set metallic(v: number) {
        this.#metallic = Math.max(0, Math.min(1, v));
    }

    get targetLayer(): string | number {
        return this.#targetLayer;
    }

    set targetLayer(v: string | number) {
        this.#targetLayer = v;
        this.#notifyChange();
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(v: number) {
        this.#bottomOffset = v;
        this.#notifyChange();
    }

    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set receiveShadow(v: boolean) {
        this.#receiveShadow = v;
    }

    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    set shadowStrength(v: number) {
        this.#shadowStrength = Math.max(0.0, Math.min(1.0, v));
    }

    get typeId(): number {
        return this.#typeId;
    }

    set typeId(v: number) {
        this.#typeId = v;
    }

    set onChanged(cb: (() => void) | null) {
        this.#onChanged = cb;
    }

    getGeometryForLOD(lodIndex: number): Geometry | Primitive | undefined {
        return this.#lods[lodIndex]?.geometry ?? this.#geometry;
    }

    #notifyChange(): void {
        if (this.#onChanged) this.#onChanged();
    }
}

export default GrassType;
