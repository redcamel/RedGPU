import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../../display/mesh/Mesh";
import type Primitive from "../../../primitive/core/Primitive";
import assembleScatterRenderUnits from "../../core/scatter/assembleScatterRenderUnits";
import ScatterRenderUnit from "../../core/scatter/ScatterRenderUnit";
import AScatterType, {AScatterTypeInitOptions} from "../../core/scatter/AScatterType";
import type {GrassTypeAllocation} from "./buffer/GrassMegaBuffer";
import {GRASS_CELL_SIZE} from "./baking/GrassInstanceBaker";

export interface GrassOptions extends AScatterTypeInitOptions {
    mesh: Mesh;
    baseColorTexture?: string | BitmapTexture;
    minScale?: [number, number] | [number, number, number];
    maxScale?: [number, number] | [number, number, number];
    alphaCutoff?: number;
    roughness?: number;
    subsurfaceStrength?: number;
    subsurfaceColor?: [number, number, number];
    exposureBoost?: number;
    minY?: number;
    receiveShadow?: boolean;
    shadowStrength?: number;
    maxInstances?: number;
}

class Grass extends AScatterType<GrassTypeAllocation> {
    #mesh: Mesh;
    #geometry: Geometry | Primitive;
    #renderUnits: ScatterRenderUnit[] = [];
    #baseColorTexture: BitmapTexture;
    #minScale: [number, number] = [0.7, 0.7];
    #maxScale: [number, number] = [1.3, 1.4];
    #minY: number = 0.0;
    #exposureBoost: number = 1.0;
    #subsurfaceStrength: number = 0.25;
    #subsurfaceColor: [number, number, number] = [0.35, 0.65, 0.15];
    #alphaCutoff: number = 0.2;
    #roughness: number = 0.55;
    #receiveShadow: boolean = true;
    #shadowStrength: number = 1.0;
    #maxInstances?: number;
    #instancesPerCell: number = 1;

    #slotIndex: number = -1;
    #onUniformDirty: ((typeId: number) => void) | null = null;
    #onRepopulateRequired: ((typeId: number) => void) | null = null;
    #isUnifiedGeometryOwned: boolean = false;

    constructor(redGPUContext: RedGPUContext, options: GrassOptions) {
        super(redGPUContext, options.name);

        const {
            mesh,
            baseColorTexture,
            minY,
            height,
            receiveShadow = true,
            densityPerHectare = 5000.0,
            densityMultiplier = 1.0,
            densityScaleByWeight = true,
            minSlope = 0.0,
            maxSlope = 35.0,
            cullingDistance = 100.0,
            minScale,
            maxScale,
            groundBlendStrength = 1.0,
            alphaCutoff = 0.2,
            roughness,
            subsurfaceStrength = 0.25,
            subsurfaceColor,
            exposureBoost = 1.0,
            targetLayer = '',
            bottomOffset = 0.0,
            shadowStrength = 1.0,
            castShadow = true,
            maxInstances
        } = options;

        if (!mesh) {
            consoleAndThrowError(`[Grass] options.mesh is required and must contain a valid Mesh instance!`);
        }
        this.#mesh = mesh;

        const {
            groups,
            unifiedGeometry,
            minY: assembledMinY,
            boundingHeight,
            renderUnits
        } = assembleScatterRenderUnits(redGPUContext, mesh, {
            preservePivot: true,
            centerXZ: false
        });
        if (groups.length === 0 || !unifiedGeometry) {
            consoleAndThrowError(`[Grass] Failed to extract any valid geometry from mesh!`);
        }
        this.#geometry = unifiedGeometry;
        this.#isUnifiedGeometryOwned = true;

        const {material: targetMaterial} = groups[0];

        const resolvedTexture = baseColorTexture ?? targetMaterial.baseColorTexture;
        if (typeof resolvedTexture === 'string') {
            this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
        } else if (resolvedTexture) {
            this.#baseColorTexture = resolvedTexture;
        }

        this.#minY = minY ?? assembledMinY;
        const resolvedHeight = height ?? (boundingHeight > 0 ? boundingHeight : 1.0);

        this.#renderUnits = renderUnits;
        if (this.#baseColorTexture) {
            this.#renderUnits[0].baseColorTexture = this.#baseColorTexture;
        }

        if (this.#renderUnits.length > 1) {
            console.warn(
                `[Grass] "${this.name}" has ${this.#renderUnits.length} render units with distinct materials. ` +
                `For optimal grass rendering performance (millions of blades), merging textures into an atlas and using a single material is strongly recommended.`
            );
        }

        this.#receiveShadow = receiveShadow;

        this.setRawScatterProperties({
            height: resolvedHeight,
            bottomOffset,
            cullingDistance,
            shadowCullDistance: Math.max(15.0, Math.min(40.0, cullingDistance * 0.35)),
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare,
            densityMultiplier,
            castShadow,
            groundBlendStrength
        });

        if (minScale) {
            const [sx, sy] = minScale;
            this.#minScale[0] = sx;
            this.#minScale[1] = sy;
        }
        if (maxScale) {
            const [sx, sy] = maxScale;
            this.#maxScale[0] = sx;
            this.#maxScale[1] = sy;
        }

        this.#alphaCutoff = alphaCutoff;
        this.#roughness = roughness ?? targetMaterial.roughnessFactor ?? targetMaterial.roughness ?? 0.55;

        this.#subsurfaceStrength = subsurfaceStrength;
        if (subsurfaceColor) {
            const [r, g, b] = subsurfaceColor;
            this.#subsurfaceColor[0] = r;
            this.#subsurfaceColor[1] = g;
            this.#subsurfaceColor[2] = b;
        }
        this.#exposureBoost = exposureBoost;
        this.#shadowStrength = shadowStrength;

        if (maxInstances !== undefined) {
            this.#maxInstances = Math.max(1, Number(maxInstances) || 1);
        }

        this.#updateInstancesPerCell();
    }

    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    get mesh(): Mesh {
        return this.#mesh;
    }

    get renderUnits(): ScatterRenderUnit[] {
        return this.#renderUnits;
    }

    override get drawCallCount(): number {
        const alloc = this.allocation;
        if (alloc && alloc.instanceCount > 0) {
            const {nearSlots, farSlots} = alloc;
            return nearSlots.length + farSlots.length;
        }
        return this.#renderUnits.length * 2;
    }

    get farDistance(): number {
        return Math.max(15.0, Math.min(40.0, this.cullingDistance * 0.35));
    }

    get baseColorTexture(): BitmapTexture {
        return this.#baseColorTexture;
    }

    get baseColorTextureView(): GPUTextureView {
        const {resourceManager} = this;
        const {emptyBitmapTextureView} = resourceManager;
        return resourceManager.getGPUResourceBitmapTextureView(this.#baseColorTexture)
            ?? emptyBitmapTextureView;
    }

    get instancesPerCell(): number {
        return this.#instancesPerCell;
    }

    set minScale(v: [number, number] | [number, number, number]) {
        if (!v) return;
        const [vx, vy] = v;
        const s = this.#minScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        if (s[0] !== sx || s[1] !== sy) {
            s[0] = sx;
            s[1] = sy;
            this.onParameterChanged('minScale', s);
        }
    }

    get minScale(): [number, number] {
        return this.#minScale;
    }

    set maxScale(v: [number, number] | [number, number, number]) {
        if (!v) return;
        const [vx, vy] = v;
        const s = this.#maxScale;
        const sx = Math.max(0.01, Number(vx) || 0.01);
        const sy = Math.max(0.01, Number(vy) || 0.01);
        if (s[0] !== sx || s[1] !== sy) {
            s[0] = sx;
            s[1] = sy;
            this.onParameterChanged('maxScale', s);
        }
    }

    get maxScale(): [number, number] {
        return this.#maxScale;
    }

    set exposureBoost(v: number) {
        const val = Math.max(0.1, Number(v) || 0.1);
        if (this.#exposureBoost !== val) {
            this.#exposureBoost = val;
            this.onParameterChanged('exposureBoost', val);
        }
    }

    get minY(): number {
        return this.#minY;
    }

    get exposureBoost(): number {
        return this.#exposureBoost;
    }

    set alphaCutoff(v: number) {
        const val = Math.max(0.01, Math.min(1, Number(v) || 0.01));
        if (this.#alphaCutoff !== val) {
            this.#alphaCutoff = val;
            this.onParameterChanged('alphaCutoff', val);
        }
    }

    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set roughness(v: number) {
        const val = Math.max(0.04, Math.min(1, Number(v) || 0.04));
        if (this.#roughness !== val) {
            this.#roughness = val;
            this.onParameterChanged('roughness', val);
        }
    }

    get roughness(): number {
        return this.#roughness;
    }

    set subsurfaceStrength(v: number) {
        const val = Math.max(0.0, Math.min(3.0, Number(v) || 0.0));
        if (this.#subsurfaceStrength !== val) {
            this.#subsurfaceStrength = val;
            this.onParameterChanged('subsurfaceStrength', val);
        }
    }

    get subsurfaceStrength(): number {
        return this.#subsurfaceStrength;
    }

    set subsurfaceColor(v: [number, number, number]) {
        if (!v) return;
        const [vr, vg, vb] = v;
        const c = this.#subsurfaceColor;
        const r = Number(vr) || 0;
        const g = Number(vg) || 0;
        const b = Number(vb) || 0;
        if (c[0] !== r || c[1] !== g || c[2] !== b) {
            c[0] = r;
            c[1] = g;
            c[2] = b;
            this.onParameterChanged('subsurfaceColor', c);
        }
    }

    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set receiveShadow(v: boolean) {
        const boolVal = !!v;
        if (this.#receiveShadow !== boolVal) {
            this.#receiveShadow = boolVal;
            this.onParameterChanged('receiveShadow', boolVal);
        }
    }

    get receiveShadow(): boolean {
        return this.#receiveShadow;
    }

    set shadowStrength(v: number) {
        const val = Math.max(0.0, Math.min(1.0, Number(v) || 0.0));
        if (this.#shadowStrength !== val) {
            this.#shadowStrength = val;
            this.onParameterChanged('shadowStrength', val);
        }
    }

    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    override get shadowCullDistance(): number {
        return this.farDistance;
    }

    override set shadowCullDistance(_val: number) {
        console.warn(`[Grass] "${this.name}": shadowCullDistance is auto-derived from farDistance and cannot be set directly.`);
    }

    get shadowFadeStartDistance(): number {
        return this.shadowCullDistance * 0.5;
    }

    set shadowFadeStartDistance(_val: number) {
        console.warn(`[Grass] "${this.name}": shadowFadeStartDistance is auto-calculated and cannot be set directly.`);
    }

    set onUniformDirty(cb: ((typeId: number) => void) | null) {
        this.#onUniformDirty = cb;
    }

    set onRepopulateRequired(cb: ((typeId: number) => void) | null) {
        this.#onRepopulateRequired = cb;
    }

    get bakeRadius(): number {
        const margin = Math.max(GRASS_CELL_SIZE * 2, this.cullingDistance * 0.2);
        return this.cullingDistance + margin;
    }

    override onParameterChanged(prop: string, value: any, prevValue?: any): void {
        switch (prop) {
            case 'bottomOffset':
            case 'targetLayer':
            case 'minSlope':
            case 'maxSlope':
            case 'densityScaleByWeight':
            case 'minScale':
            case 'maxScale':
                this.#notifyRepopulateRequired();
                break;

            case 'densityPerHectare':
            case 'densityMultiplier':
                this.#updateInstancesPerCell();
                this.#notifyRepopulateRequired();
                break;

            case 'cullingDistance':
                this.#notifyRepopulateRequired();
                this.#notifyUniformDirty();
                break;

            case 'exposureBoost':
            case 'alphaCutoff':
            case 'roughness':
            case 'subsurfaceStrength':
            case 'subsurfaceColor':
            case 'receiveShadow':
            case 'shadowStrength':
            case 'castShadow':
            case 'groundBlendStrength':
                this.#notifyUniformDirty();
                break;
        }
    }

    get maxInstances(): number | undefined {
        return this.allocation?.maxInstances ?? this.#maxInstances;
    }

    get activeInstanceCount(): number {
        return this.allocation?.instanceCount ?? 0;
    }

    override destroy(): void {
        this.#slotIndex = -1;
        if (this.#isUnifiedGeometryOwned && this.#geometry instanceof Geometry) {
            this.#geometry.destroy();
        }
        this.#isUnifiedGeometryOwned = false;
        this.#geometry = null as any;
        this.#renderUnits.length = 0;
        this.#baseColorTexture = null as any;
        this.#mesh = null as any;
        this.#onUniformDirty = null;
        this.#onRepopulateRequired = null;
        super.destroy();
    }

    #notifyUniformDirty(): void {
        this.#onUniformDirty?.(this.typeId);
    }

    #updateInstancesPerCell(): void {
        const {densityPerHectare, densityMultiplier} = this;
        this.#instancesPerCell = Math.max(1, Math.round((densityPerHectare * 256.0 / 10000.0) * densityMultiplier));
    }

    get slotIndex(): number {
        return this.#slotIndex;
    }

    set slotIndex(val: number) {
        this.#slotIndex = val;
    }

    #notifyRepopulateRequired(): void {
        this.#onRepopulateRequired?.(this.typeId);
        this.#onUniformDirty?.(this.typeId);
    }
}

Object.freeze(Grass);
export default Grass;

