import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import Geometry from "../../../geometry/Geometry";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import Mesh from "../../../display/mesh/Mesh";
import Primitive from "../../../primitive/core/Primitive";

export interface GrassOptions {
    name: string;
    mesh: Mesh;
    baseColorTexture?: string | BitmapTexture;
    densityPerHectare?: number;
    densityMultiplier?: number;
    densityScaleByWeight?: boolean;
    minSlope?: number;
    maxSlope?: number;
    cullingDistance?: number;
    shrinkStartDistance?: number;
    farDistance?: number;
    minScale?: [number, number] | [number, number, number];
    maxScale?: [number, number] | [number, number, number];
    height?: number;
    groundBlendStrength?: number;
    alphaCutoff?: number;
    roughness?: number;
    subsurfaceStrength?: number;
    subsurfaceColor?: [number, number, number];
    exposureBoost?: number;
    minY?: number;
    targetLayer?: string | number;
    bottomOffset?: number;
    receiveShadow?: boolean;
    shadowStrength?: number;
    castShadow?: boolean;
    shadowCullDistance?: number;
    shadowShrinkStartDistance?: number;
}

export class Grass extends RedGPUObject {
    #mesh: Mesh;
    #geometry: Geometry | Primitive;
    #baseColorTexture: BitmapTexture;
    #densityPerHectare: number = 5000.0;
    #densityMultiplier: number = 1.0;
    #densityScaleByWeight: boolean = true;
    #minSlope: number = 0.0;
    #maxSlope: number = 35.0;
    #cullingDistance: number = 100.0;
    #shrinkStartDistance: number = 60.0;
    #farDistance: number = 35.0;
    #minScale: [number, number, number] = [0.7, 0.7, 0.7];
    #maxScale: [number, number, number] = [1.3, 1.4, 1.3];
    #meshHeight: number = 1.0;
    #minY: number = 0.0;
    #exposureBoost: number = 1.0;
    #subsurfaceStrength: number = 0.25;
    #subsurfaceColor: [number, number, number] = [0.35, 0.65, 0.15];
    #groundBlendStrength: number = 1.0;
    #alphaCutoff: number = 0.2;
    #roughness: number = 0.55;
    #targetLayer: string | number = '';
    #bottomOffset: number = 0.0;
    #receiveShadow: boolean = true;
    #shadowStrength: number = 1.0;
    #castShadow: boolean = true;
    #shadowCullDistance: number = 35.0;
    #shadowShrinkStartDistance: number = 26.25;

    #typeId: number = 0;
    #dirty: boolean = true;
    #onChanged: (() => void) | null = null;

    /**
     * [KO] 절차적 지형 잔디 인스턴스를 생성합니다.
     * @remarks 사용자가 직접 생성하지 마시고 `landscape.grassManager.addGrass(options)` 팩토리 메서드를 사용하십시오.
     * [EN] Creates a procedural landscape grass instance.
     * @remarks Do not instantiate directly; use the `landscape.grassManager.addGrass(options)` factory method instead.
     */
    constructor(redGPUContext: RedGPUContext, options: GrassOptions) {
        super(redGPUContext);

        const {
            name,
            mesh,
            baseColorTexture,
            minY,
            height,
            farDistance = 35.0,
            receiveShadow = true,
            densityPerHectare,
            densityMultiplier,
            densityScaleByWeight,
            minSlope,
            maxSlope,
            cullingDistance,
            shrinkStartDistance,
            minScale,
            maxScale,
            groundBlendStrength,
            alphaCutoff = 0.2,
            roughness,
            subsurfaceStrength,
            subsurfaceColor,
            exposureBoost,
            targetLayer,
            bottomOffset,
            shadowStrength,
            castShadow = true,
            shadowCullDistance,
            shadowShrinkStartDistance
        } = options || {};

        if (!name || typeof name !== 'string' || name.trim() === '') {
            consoleAndThrowError('[Grass] options.name is required and must be a non-empty string!');
        }
        super.name = name.trim();

        if (!mesh) {
            consoleAndThrowError(`[Grass] options.mesh is required and must contain a valid Mesh instance!`);
        }
        this.#mesh = mesh;

        const mat = mesh.material as any;
        const resolvedTexture = baseColorTexture ?? mat?.baseColorTexture ?? mat?.diffuseTexture;
        if (typeof resolvedTexture === 'string') {
            this.#baseColorTexture = new BitmapTexture(redGPUContext, resolvedTexture);
        } else if (resolvedTexture) {
            this.#baseColorTexture = resolvedTexture;
        }

        const geom = mesh.geometry;
        if (!geom) {
            consoleAndThrowError(`[Grass] Mesh must have a valid geometry!`);
        }
        this.#geometry = geom;

        const vol = this.#geometry.volume;
        if (minY !== undefined) {
            this.#minY = minY;
        } else if (vol && vol.minY !== undefined) {
            this.#minY = vol.minY;
        } else {
            this.#minY = 0.0;
        }

        if (height !== undefined) {
            this.#meshHeight = height;
        } else {
            const computedH = (vol && (vol.maxY !== undefined && vol.minY !== undefined)) ? (vol.maxY - vol.minY) : 1.0;
            this.#meshHeight = computedH > 0 ? computedH : 1.0;
        }

        this.#farDistance = Math.max(10.0, farDistance);
        this.#receiveShadow = receiveShadow;

        if (densityPerHectare !== undefined) this.#densityPerHectare = densityPerHectare;
        if (densityMultiplier !== undefined) this.#densityMultiplier = densityMultiplier;
        if (densityScaleByWeight !== undefined) this.#densityScaleByWeight = densityScaleByWeight;
        if (minSlope !== undefined) this.#minSlope = minSlope;
        if (maxSlope !== undefined) this.#maxSlope = maxSlope;
        if (cullingDistance !== undefined) this.#cullingDistance = cullingDistance;
        if (shrinkStartDistance !== undefined) {
            this.#shrinkStartDistance = shrinkStartDistance;
        } else {
            this.#shrinkStartDistance = this.#cullingDistance * 0.75;
        }
        if (minScale) this.#minScale = [minScale[0], minScale[1], minScale[2] ?? minScale[0]];
        if (maxScale) this.#maxScale = [maxScale[0], maxScale[1], maxScale[2] ?? maxScale[0]];
        if (groundBlendStrength !== undefined) this.#groundBlendStrength = groundBlendStrength;

        this.#alphaCutoff = alphaCutoff;

        const inheritedRoughness = mat?.roughnessFactor ?? mat?.roughness;
        if (roughness !== undefined) {
            this.#roughness = roughness;
        } else if (inheritedRoughness !== undefined) {
            this.#roughness = inheritedRoughness;
        }

        if (subsurfaceStrength !== undefined) this.#subsurfaceStrength = subsurfaceStrength;
        if (subsurfaceColor) this.#subsurfaceColor = [...subsurfaceColor];
        if (exposureBoost !== undefined) this.#exposureBoost = exposureBoost;
        if (targetLayer !== undefined) this.#targetLayer = targetLayer;
        if (bottomOffset !== undefined) this.#bottomOffset = bottomOffset;
        if (shadowStrength !== undefined) this.#shadowStrength = shadowStrength;
        this.#castShadow = castShadow;
        if (shadowCullDistance !== undefined) {
            this.#shadowCullDistance = Math.max(0.0, shadowCullDistance);
            this.#shadowShrinkStartDistance = shadowShrinkStartDistance !== undefined
                ? Math.max(0.0, shadowShrinkStartDistance)
                : Math.max(0.0, this.#shadowCullDistance * 0.75);
        } else if (shadowShrinkStartDistance !== undefined) {
            this.#shadowShrinkStartDistance = Math.max(0.0, shadowShrinkStartDistance);
        } else {
            this.#shadowShrinkStartDistance = this.#shadowCullDistance * 0.75;
        }
    }


    override get name(): string {
        return super.name;
    }

    override set name(_value: string) {
        consoleAndThrowError('[Grass] name property is readonly and cannot be changed.');
    }

    get mesh(): Mesh {
        return this.#mesh;
    }

    get geometry(): Geometry | Primitive {
        return this.#geometry;
    }

    get farDistance(): number {
        return this.#farDistance;
    }

    set farDistance(v: number) {
        this.#farDistance = Math.max(10.0, v);
        this.#dirty = true;
    }

    get baseColorTexture(): BitmapTexture {
        return this.#baseColorTexture;
    }

    /**
     * [KO] 잔디 렌더링에 사용되는 베이스 컬러 GPUTextureView를 반환합니다. (텍스처 미지정 또는 로딩 전일 경우 emptyBitmapTextureView 반환)
     * [EN] Returns the base color GPUTextureView used for grass rendering. (Returns emptyBitmapTextureView if texture is unspecified or pre-load)
     */
    get baseColorTextureView(): GPUTextureView {
        if (this.#baseColorTexture) {
            return this.resourceManager.getGPUResourceBitmapTextureView(this.#baseColorTexture)
                || this.resourceManager.emptyBitmapTextureView;
        }
        return this.resourceManager.emptyBitmapTextureView;
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
        this.#shrinkStartDistance = this.#cullingDistance * 0.75;
        this.#dirty = true;
    }

    get shrinkStartDistance(): number {
        return this.#shrinkStartDistance;
    }

    set shrinkStartDistance(v: number) {
        this.#shrinkStartDistance = Math.max(0, v);
        this.#dirty = true;
    }

    get minScale(): [number, number, number] {
        return this.#minScale;
    }

    set minScale(v: [number, number] | [number, number, number]) {
        this.#minScale = [v[0], v[1], v[2] ?? v[0]];
        this.#notifyChange();
    }

    get maxScale(): [number, number, number] {
        return this.#maxScale;
    }

    set maxScale(v: [number, number] | [number, number, number]) {
        this.#maxScale = [v[0], v[1], v[2] ?? v[0]];
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
        this.#dirty = true;
    }

    get groundBlendStrength(): number {
        return this.#groundBlendStrength;
    }

    set groundBlendStrength(v: number) {
        this.#groundBlendStrength = Math.max(0, Math.min(1, v));
        this.#dirty = true;
    }

    get alphaCutoff(): number {
        return this.#alphaCutoff;
    }

    set alphaCutoff(v: number) {
        this.#alphaCutoff = Math.max(0.01, Math.min(1, v));
        this.#dirty = true;
    }

    get roughness(): number {
        return this.#roughness;
    }

    set roughness(v: number) {
        this.#roughness = Math.max(0.04, Math.min(1, v));
        this.#dirty = true;
    }

    get subsurfaceStrength(): number {
        return this.#subsurfaceStrength;
    }

    set subsurfaceStrength(v: number) {
        this.#subsurfaceStrength = Math.max(0.0, Math.min(3.0, v));
        this.#dirty = true;
    }

    get subsurfaceColor(): [number, number, number] {
        return this.#subsurfaceColor;
    }

    set subsurfaceColor(v: [number, number, number]) {
        this.#subsurfaceColor = [v[0], v[1], v[2]];
        this.#dirty = true;
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
        this.#dirty = true;
    }

    get shadowStrength(): number {
        return this.#shadowStrength;
    }

    set shadowStrength(v: number) {
        this.#shadowStrength = Math.max(0.0, Math.min(1.0, v));
        this.#dirty = true;
    }

    get castShadow(): boolean {
        return this.#castShadow;
    }

    set castShadow(v: boolean) {
        this.#castShadow = v;
        this.#dirty = true;
    }

    get shadowCullDistance(): number {
        return this.#shadowCullDistance;
    }

    set shadowCullDistance(v: number) {
        this.#shadowCullDistance = Math.max(0.0, v);
        this.#shadowShrinkStartDistance = this.#shadowCullDistance * 0.75;
        this.#dirty = true;
    }

    get shadowShrinkStartDistance(): number {
        return this.#shadowShrinkStartDistance;
    }

    set shadowShrinkStartDistance(v: number) {
        this.#shadowShrinkStartDistance = Math.max(0.0, v);
        this.#dirty = true;
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

    get dirty(): boolean {
        return this.#dirty;
    }

    markClean(): void {
        this.#dirty = false;
    }

    #notifyChange(): void {
        this.#dirty = true;
        if (this.#onChanged) this.#onChanged();
    }
}

Object.freeze(Grass);
export default Grass;
