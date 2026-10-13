import RedGPUObject from "../../../base/RedGPUObject";
import View3D from "../../../display/view/View3D";
import RenderViewStateData from "../../../display/view/core/RenderViewStateData";
import type Landscape from "../../Landscape";
import type AScatterType from "./AScatterType";
import {AScatterTypeInitOptions} from "./AScatterType";

abstract class AScatterManager<
    TType extends AScatterType = AScatterType,
    TOptions extends AScatterTypeInitOptions = AScatterTypeInitOptions
> extends RedGPUObject {

    #landscape: Landscape;
    #enabled: boolean = true;
    #types: TType[] = [];
    #typesByName: Map<string, TType> = new Map();

    constructor(landscape: Landscape) {
        super(landscape.redGPUContext);
        this.#landscape = landscape;
    }

    get landscape(): Landscape {
        return this.#landscape;
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(val: boolean) {
        this.#enabled = val;
    }

    get types(): TType[] {
        return this.#types;
    }

    get typeCount(): number {
        return this.#types.length;
    }

    abstract get totalInstanceCount(): number;

    abstract get instanceCapacity(): number;

    get totalDrawCalls(): number {
        const {enabled, types} = this;
        if (!enabled) return 0;
        let count = 0;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            count += this.computeTypeDrawCalls(types[i]);
        }
        return count;
    }

    get shadowDrawCalls(): number {
        const {enabled, types} = this;
        if (!enabled) return 0;
        let count = 0;
        const len = types.length;
        for (let i = 0; i < len; i++) {
            const type = types[i];
            const {castShadow} = type;
            if (!castShadow) continue;
            count += this.computeTypeShadowDrawCalls(type);
        }
        return count;
    }

    abstract computeTypeDrawCalls(type: TType): number;

    abstract computeTypeShadowDrawCalls(type: TType): number;

    getTypeByName(name: string): TType | undefined {
        return this.#typesByName.get(name);
    }

    clearTypes(): void {
        const {types} = this;
        while (types.length > 0) {
            this.removeType(types[types.length - 1]);
        }
        this.#typesByName.clear();
    }

    abstract addType(options: TOptions): TType;

    abstract removeType(target: TType | string): boolean;

    abstract rebakeAll(): void;

    abstract update(renderViewStateData: RenderViewStateData): void;

    abstract render(view: View3D, passEncoder: GPURenderPassEncoder): void;

    abstract renderShadow(view: View3D, passEncoder: GPURenderPassEncoder): void;

    abstract destroy(): void;

    registerTypeInternal(type: TType): void {
        const {name} = type;
        this.#types.push(type);
        this.#typesByName.set(name, type);
    }

    unregisterTypeInternal(target: TType | string): TType | null {
        if (!target) return null;
        const lookupName = typeof target === 'string' ? target : target.name;
        const found = this.#typesByName.get(lookupName);
        if (!found) return null;

        const idx = this.#types.indexOf(found);
        if (idx !== -1) {
            this.#types.splice(idx, 1);
        }
        this.#typesByName.delete(lookupName);
        return found;
    }
}

Object.freeze(AScatterManager);
export default AScatterManager;

