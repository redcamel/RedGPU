import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import type {ScatterBaseSegmentAllocation} from "./AScatterMegaBuffer";
import type ScatterRenderUnit from "./ScatterRenderUnit";

export interface AScatterTypeInitOptions {
    name: string;

    cullingDistance?: number;

    shadowCullDistance?: number;

    bottomOffset?: number;

    height?: number;

    castShadow?: boolean;

    targetLayer?: string | number;

    minSlope?: number;

    maxSlope?: number;

    densityScaleByWeight?: boolean;

    densityPerHectare?: number;

    densityMultiplier?: number;

    groundBlendStrength?: number;
}

abstract class AScatterType<
    TAllocation extends ScatterBaseSegmentAllocation = ScatterBaseSegmentAllocation
> extends RedGPUObject {
    #name: string;
    #typeId: number;
    #allocation: TAllocation | null = null;

    #height: number = 1.0;
    #cullingDistance: number = 200.0;
    #shadowCullDistance: number = 50.0;
    #bottomOffset: number = 0.0;
    #targetLayer: string | number | undefined = '';
    #minSlope: number = 0.0;
    #maxSlope: number = 45.0;
    #densityScaleByWeight: boolean = true;
    #densityPerHectare: number = 1000.0;
    #densityMultiplier: number = 1.0;
    #castShadow: boolean = true;
    #groundBlendStrength: number = 1.0;

    constructor(redGPUContext: RedGPUContext, name: string, typeId: number = 0) {
        super(redGPUContext);

        if (typeof name !== 'string' || !name.trim()) {
            consoleAndThrowError(`[${new.target.name}] name is required and must be a non-empty string!`);
        }

        const trimmedName = name.trim();
        super.name = trimmedName;
        this.#name = trimmedName;
        this.#typeId = typeId;
    }

    override get name(): string {
        return this.#name;
    }

    override set name(_value: string) {
        consoleAndThrowError(`[${this.constructor.name}] name property is readonly and cannot be changed.`);
    }

    get typeId(): number {
        return this.#allocation?.typeId ?? this.#typeId;
    }

    set typeId(value: number) {
        this.#typeId = value;
        if (this.#allocation) {
            this.#allocation.typeId = value;
        }
    }

    abstract get renderUnits(): ScatterRenderUnit[];

    get renderUnitCount(): number {
        return this.renderUnits.length;
    }

    abstract get drawCallCount(): number;

    get allocation(): TAllocation | null {
        return this.#allocation;
    }

    bindAllocation(allocation: TAllocation | null): void {
        this.#allocation = allocation;
        if (allocation) {
            this.#typeId = allocation.typeId;
        }
    }

    get height(): number {
        return this.#height;
    }

    set height(val: number) {
        const numVal = Math.max(0.01, Number(val) || 0.01);
        if (this.#height !== numVal) {
            this.#height = numVal;
            this.onParameterChanged('height', numVal);
        }
    }

    get bottomOffset(): number {
        return this.#bottomOffset;
    }

    set bottomOffset(val: number) {
        const numVal = Number(val) || 0;
        if (this.#bottomOffset !== numVal) {
            this.#bottomOffset = numVal;
            this.onParameterChanged('bottomOffset', numVal);
        }
    }

    get cullingDistance(): number {
        return this.#cullingDistance;
    }

    set cullingDistance(val: number) {
        const numVal = Math.max(0, Number(val) || 0);
        if (this.#cullingDistance !== numVal) {
            this.#cullingDistance = numVal;
            this.onParameterChanged('cullingDistance', numVal);
        }
    }

    get shadowCullDistance(): number {
        return this.#shadowCullDistance;
    }

    set shadowCullDistance(val: number) {
        const numVal = Math.max(0, Number(val) || 0);
        if (this.#shadowCullDistance !== numVal) {
            this.#shadowCullDistance = numVal;
            this.onParameterChanged('shadowCullDistance', numVal);
        }
    }

    get targetLayer(): string | number | undefined {
        return this.#targetLayer;
    }

    set targetLayer(val: string | number | undefined) {
        if (this.#targetLayer !== val) {
            this.#targetLayer = val;
            this.onParameterChanged('targetLayer', val);
        }
    }

    get minSlope(): number {
        return this.#minSlope;
    }

    set minSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#minSlope !== numVal) {
            this.#minSlope = numVal;
            this.onParameterChanged('minSlope', numVal);
        }
    }

    get maxSlope(): number {
        return this.#maxSlope;
    }

    set maxSlope(val: number) {
        const numVal = Math.max(0.0, Math.min(90.0, Number(val) || 0.0));
        if (this.#maxSlope !== numVal) {
            this.#maxSlope = numVal;
            this.onParameterChanged('maxSlope', numVal);
        }
    }

    get densityScaleByWeight(): boolean {
        return this.#densityScaleByWeight;
    }

    set densityScaleByWeight(val: boolean) {
        const boolVal = !!val;
        if (this.#densityScaleByWeight !== boolVal) {
            this.#densityScaleByWeight = boolVal;
            this.onParameterChanged('densityScaleByWeight', boolVal);
        }
    }

    get densityPerHectare(): number {
        return this.#densityPerHectare;
    }

    set densityPerHectare(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityPerHectare !== numVal) {
            this.#densityPerHectare = numVal;
            this.onParameterChanged('densityPerHectare', numVal);
        }
    }

    get densityMultiplier(): number {
        return this.#densityMultiplier;
    }

    set densityMultiplier(val: number) {
        const numVal = Math.max(0.0, Number(val) || 0.0);
        if (this.#densityMultiplier !== numVal) {
            this.#densityMultiplier = numVal;
            this.onParameterChanged('densityMultiplier', numVal);
        }
    }

    get castShadow(): boolean {
        return this.#castShadow;
    }

    set castShadow(val: boolean) {
        const boolVal = !!val;
        if (this.#castShadow !== boolVal) {
            this.#castShadow = boolVal;
            this.onParameterChanged('castShadow', boolVal);
        }
    }

    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(val: number) {
        const numVal = Math.max(0.0, Math.min(1.0, Number(val) || 0.0));
        if (this.#groundBlendStrength !== numVal) {
            this.#groundBlendStrength = numVal;
            this.onParameterChanged('groundBlendStrength', numVal);
        }
    }

    setRawScatterProperties(values: {
        height?: number;
        cullingDistance?: number;
        shadowCullDistance?: number;
        bottomOffset?: number;
        targetLayer?: string | number | undefined;
        minSlope?: number;
        maxSlope?: number;
        densityScaleByWeight?: boolean;
        densityPerHectare?: number;
        densityMultiplier?: number;
        castShadow?: boolean;
        groundBlendStrength?: number;
    }): void {
        const {
            height,
            cullingDistance,
            shadowCullDistance,
            bottomOffset,
            targetLayer,
            minSlope,
            maxSlope,
            densityScaleByWeight,
            densityPerHectare,
            densityMultiplier,
            castShadow,
            groundBlendStrength
        } = values;
        if (height !== undefined) this.#height = height;
        if (cullingDistance !== undefined) {
            this.#cullingDistance = cullingDistance;
        }
        if (shadowCullDistance !== undefined) this.#shadowCullDistance = shadowCullDistance;
        if (bottomOffset !== undefined) this.#bottomOffset = bottomOffset;
        if (targetLayer !== undefined) this.#targetLayer = targetLayer;
        if (minSlope !== undefined) this.#minSlope = minSlope;
        if (maxSlope !== undefined) this.#maxSlope = maxSlope;
        if (densityScaleByWeight !== undefined) this.#densityScaleByWeight = densityScaleByWeight;
        if (densityPerHectare !== undefined) this.#densityPerHectare = densityPerHectare;
        if (densityMultiplier !== undefined) this.#densityMultiplier = densityMultiplier;
        if (castShadow !== undefined) this.#castShadow = castShadow;
        if (groundBlendStrength !== undefined) this.#groundBlendStrength = groundBlendStrength;
    }

    abstract onParameterChanged(prop: string, value: any, prevValue?: any): void;

    destroy(): void {
        this.#allocation = null;
    }
}

Object.freeze(AScatterType);
export default AScatterType;

