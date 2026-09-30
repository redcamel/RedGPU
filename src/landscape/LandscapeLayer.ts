/**
 * [KO] 지형 스플랫 텍스처 레이어 정의 및 파라미터 관리 모듈입니다.
 * [EN] Terrain splat texture layer definition and parameter management module.
 * @packageDocumentation
 */
import BitmapTexture from "../resources/texture/BitmapTexture";
import type RedGPUContext from "../context/RedGPUContext";
import LandscapeWeightMapCPUSampler from "./core/cache/LandscapeWeightMapCPUSampler";

/**
 * [KO] 스플랫 가중치 텍스처에서 샘플링할 채널 식별자 ('R' | 'G' | 'B' | 'A' 또는 0 | 1 | 2 | 3)
 * [EN] Channel identifier to sample from splat weight texture ('R' | 'G' | 'B' | 'A' or 0 | 1 | 2 | 3)
 */
export type LandscapeWeightMapChannel = 'R' | 'G' | 'B' | 'A' | 'r' | 'g' | 'b' | 'a' | 0 | 1 | 2 | 3;

/**
 * [KO] 지형 텍스처 레이어 생성 옵션 인터페이스입니다.
 * [EN] Options interface for creating a landscape texture layer.
 */
export interface LandscapeLayerOptions {
    /**
     * [KO] 레이어 식별 이름
     * [EN] Layer identification name
     */
    name: string;
    /**
     * [KO] 레이어 활성화 여부 (기본값: true)
     * [EN] Whether the layer is enabled (default: true)
     */
    enabled?: boolean;
    /**
     * [KO] 베이스 컬러 텍스처 (BitmapTexture 또는 이미지 URL)
     * [EN] Base color texture (BitmapTexture or image URL)
     */
    baseColorTexture?: BitmapTexture | string;
    /**
     * [KO] 노멀 텍스처 (BitmapTexture 또는 이미지 URL)
     * [EN] Normal texture (BitmapTexture or image URL)
     */
    normalTexture?: BitmapTexture | string;
    /**
     * [KO] ORM (Occlusion/Roughness/Metallic) 텍스처 (BitmapTexture 또는 이미지 URL)
     * [EN] ORM (Occlusion/Roughness/Metallic) texture (BitmapTexture or image URL)
     */
    ormTexture?: BitmapTexture | string;
    /**
     * [KO] 스플랫 가중치 텍스처 (BitmapTexture 또는 이미지 URL)
     * [EN] Splat weight texture (BitmapTexture or image URL)
     */
    weightTexture?: BitmapTexture | string;

    /**
     * [KO] 텍스처 UV 스케일 [u, v] (기본값: [20.0, 20.0])
     * [EN] Texture UV scale [u, v] (default: [20.0, 20.0])
     */
    uvScale?: [number, number];
    /**
     * [KO] 텍스처 UV 오프셋 [u, v] (기본값: [0.0, 0.0])
     * [EN] Texture UV offset [u, v] (default: [0.0, 0.0])
     */
    uvOffset?: [number, number];
    /**
     * [KO] 근거리 UV 스케일 배수 (기본값: 2.0)
     * [EN] Near distance UV scale multiplier (default: 2.0)
     */
    nearUVScaleMultiplier?: number;
    /**
     * [KO] 스플랫 가중치 텍스처에서 참조할 채널 (기본값: 'R')
     * [EN] Channel referenced in splat weight texture (default: 'R')
     */
    weightChannel?: LandscapeWeightMapChannel;

    /**
     * [KO] 표면 거칠기 (0.0~1.0, 기본값: 1.0)
     * [EN] Surface roughness (0.0-1.0, default: 1.0)
     */
    roughness?: number;
    /**
     * [KO] 금속성 (0.0~1.0, 기본값: 0.0)
     * [EN] Metallic value (0.0-1.0, default: 0.0)
     */
    metallic?: number;
    /**
     * [KO] 노멀 맵 강도 (기본값: 1.0)
     * [EN] Normal map intensity (default: 1.0)
     */
    normalIntensity?: number;
    /**
     * [KO] 앰비언트 오클루전 강도 (기본값: 1.0)
     * [EN] Ambient occlusion intensity (default: 1.0)
     */
    aoIntensity?: number;
}

/**
 * [KO] 지형 표면의 개별 스플랫 텍스처 레이어(베이스컬러, 노멀, ORM, 가중치 맵)를 정의하고 관리하는 클래스입니다.
 * [EN] Class that defines and manages an individual splat texture layer (base color, normal, ORM, weight map) on the terrain surface.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **지형 레이어 속성 캡슐화**: 풀(Grass), 흙(Dirt), 암석(Rock), 눈(Snow) 등 지형 표면을 구성하는 단일 재질의 Albedo, Normal, ORM(Occlusion, Roughness, Metallic) 텍스처 및 UV 타일링 파라미터를 캡슐화합니다.
 * - **스플랫 가중치 맵 바인딩**: `weightTexture`와 특정 채널(`weightChannel`: R, G, B, A)을 지정하여 지형 전체에서 해당 레이어가 차지하는 블렌딩 비율을 제어합니다.
 * - **반응형 리베이킹 통지 (`onLayerDirty`)**: 레이어의 텍스처나 UV 스케일, 거칠기 등의 파라미터가 변경되면 머티리얼과 타일 스트리머에 알림을 전송하여 VBT(가상 베이스 텍스처) 아틀라스의 자동 리베이킹을 유도합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Terrain Layer Property Encapsulation**: Encapsulates Albedo, Normal, ORM (Occlusion, Roughness, Metallic) textures and UV tiling parameters for individual surface materials like grass, dirt, rock, and snow.
 * - **Splat Weight Map Binding**: Governs the blending distribution across the terrain by associating a `weightTexture` with a dedicated channel (`weightChannel`: R, G, B, A).
 * - **Reactive Rebake Notifications (`onLayerDirty`)**: Emits dirty events upon modifications to textures, UV scaling, or roughness values to trigger automatic rebaking of the VBT (Virtual Base Texture) atlas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(`landscape.addLayer(options)`)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (`landscape.addLayer(options)`).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeLayer {
    #name: string;
    #enabled: boolean = true;

    #redGPUContext?: RedGPUContext;
    #baseColorTexture?: BitmapTexture;
    #normalTexture?: BitmapTexture;
    #ormTexture?: BitmapTexture;
    #weightTexture?: BitmapTexture;

    #pendingBaseColorSrc?: string;
    #pendingNormalSrc?: string;
    #pendingOrmSrc?: string;
    #pendingWeightSrc?: string;

    #uvScale: [number, number] = [20.0, 20.0];
    #uvOffset: [number, number] = [0.0, 0.0];
    #nearUVScaleMultiplier: number = 2.0;

    #weightChannel: LandscapeWeightMapChannel = 'R';
    #weightChannelIndex: number = 0;

    #roughness: number = 1.0;
    #metallic: number = 0.0;
    #normalIntensity: number = 1.0;
    #aoIntensity: number = 1.0;

    #weightMapCPUSampler?: LandscapeWeightMapCPUSampler;
    dirty: boolean = true;
    onChange?: () => void;

    /**
     * [KO] 지형 텍스처 레이어 인스턴스를 생성합니다. (사용자가 직접 생성하지 마시고 `Landscape.addLayer(options)` 팩토리 메서드를 사용하십시오.)
     * [EN] Creates a terrain texture layer instance. (Do not instantiate directly; use the `Landscape.addLayer(options)` factory method instead.)
     */
    constructor(redGPUContextOrOptions: RedGPUContext | LandscapeLayerOptions, options?: LandscapeLayerOptions) {
        let actualOptions: LandscapeLayerOptions;
        if (options) {
            this.#redGPUContext = redGPUContextOrOptions as RedGPUContext;
            actualOptions = options;
        } else {
            actualOptions = redGPUContextOrOptions as LandscapeLayerOptions;
        }

        const {
            name,
            enabled,
            baseColorTexture,
            normalTexture,
            ormTexture,
            weightTexture,
            uvScale,
            uvOffset,
            nearUVScaleMultiplier,
            weightChannel,
            roughness,
            metallic,
            normalIntensity,
            aoIntensity
        } = actualOptions;

        this.#name = name;
        if (enabled !== undefined) this.#enabled = enabled;

        if (baseColorTexture !== undefined) {
            this.baseColorTexture = baseColorTexture;
        }
        if (normalTexture !== undefined) {
            this.normalTexture = normalTexture;
        }
        if (ormTexture !== undefined) {
            this.ormTexture = ormTexture;
        }
        if (weightTexture !== undefined) {
            this.weightTexture = weightTexture;
        }

        if (uvScale) {
            const [u, v] = uvScale;
            this.#uvScale[0] = u;
            this.#uvScale[1] = v;
        }

        if (uvOffset) {
            const [u, v] = uvOffset;
            this.#uvOffset[0] = u;
            this.#uvOffset[1] = v;
        }

        if (nearUVScaleMultiplier !== undefined) {
            this.#nearUVScaleMultiplier = nearUVScaleMultiplier;
        }

        if (weightChannel !== undefined) {
            this.#weightChannel = weightChannel;
        }
        this.#updateWeightChannelIndex();

        if (roughness !== undefined) {
            this.#roughness = roughness;
        }

        if (metallic !== undefined) {
            this.#metallic = metallic;
        }

        if (normalIntensity !== undefined) {
            this.#normalIntensity = normalIntensity;
        }

        if (aoIntensity !== undefined) {
            this.#aoIntensity = aoIntensity;
        }
    }

    get name(): string {
        return this.#name;
    }

    get baseColorTexture(): BitmapTexture | undefined {
        return this.#baseColorTexture;
    }

    set baseColorTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#baseColorTexture = new BitmapTexture(this.#redGPUContext, val);
                this.#pendingBaseColorSrc = undefined;
            } else {
                this.#pendingBaseColorSrc = val;
                this.#baseColorTexture = undefined;
            }
        } else {
            this.#baseColorTexture = val;
            this.#pendingBaseColorSrc = undefined;
        }
        this.onChange?.();
    }

    get normalTexture(): BitmapTexture | undefined {
        return this.#normalTexture;
    }

    set normalTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#normalTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingNormalSrc = undefined;
            } else {
                this.#pendingNormalSrc = val;
                this.#normalTexture = undefined;
            }
        } else {
            this.#normalTexture = val;
            this.#pendingNormalSrc = undefined;
        }
        this.onChange?.();
    }

    get ormTexture(): BitmapTexture | undefined {
        return this.#ormTexture;
    }

    set ormTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#ormTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingOrmSrc = undefined;
            } else {
                this.#pendingOrmSrc = val;
                this.#ormTexture = undefined;
            }
        } else {
            this.#ormTexture = val;
            this.#pendingOrmSrc = undefined;
        }
        this.onChange?.();
    }

    get weightTexture(): BitmapTexture | undefined {
        return this.#weightTexture;
    }

    set weightTexture(val: BitmapTexture | string | undefined) {
        if (typeof val === 'string') {
            if (this.#redGPUContext) {
                this.#weightTexture = new BitmapTexture(this.#redGPUContext, val, true, undefined, undefined, this.#resolveLinearFormat());
                this.#pendingWeightSrc = undefined;
            } else {
                this.#pendingWeightSrc = val;
                this.#weightTexture = undefined;
            }
        } else {
            this.#weightTexture = val;
            this.#pendingWeightSrc = undefined;
        }
        this.onChange?.();
    }

    resolvePendingTextures(context: RedGPUContext): void {
        this.#redGPUContext = context;
        if (this.#pendingBaseColorSrc) {
            this.#baseColorTexture = new BitmapTexture(context, this.#pendingBaseColorSrc);
            this.#pendingBaseColorSrc = undefined;
        }
        if (this.#pendingNormalSrc) {
            this.#normalTexture = new BitmapTexture(context, this.#pendingNormalSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingNormalSrc = undefined;
        }
        if (this.#pendingOrmSrc) {
            this.#ormTexture = new BitmapTexture(context, this.#pendingOrmSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingOrmSrc = undefined;
        }
        if (this.#pendingWeightSrc) {
            this.#weightTexture = new BitmapTexture(context, this.#pendingWeightSrc, true, undefined, undefined, this.#resolveLinearFormat());
            this.#pendingWeightSrc = undefined;
        }
    }

    #resolveLinearFormat(): GPUTextureFormat {
        return 'rgba8unorm';
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(val: boolean) {
        if (this.#enabled === val) return;
        this.#enabled = val;
        this.dirty = true;
        this.onChange?.();
    }

    get uvScale(): [number, number] {
        return this.#uvScale;
    }

    set uvScale(val: [number, number]) {
        if (this.#uvScale[0] === val[0] && this.#uvScale[1] === val[1]) return;
        this.#uvScale[0] = val[0];
        this.#uvScale[1] = val[1];
        this.dirty = true;
        this.onChange?.();
    }

    get uvOffset(): [number, number] {
        return this.#uvOffset;
    }

    set uvOffset(val: [number, number]) {
        if (this.#uvOffset[0] === val[0] && this.#uvOffset[1] === val[1]) return;
        this.#uvOffset[0] = val[0];
        this.#uvOffset[1] = val[1];
        this.dirty = true;
        this.onChange?.();
    }

    get nearUVScaleMultiplier(): number {
        return this.#nearUVScaleMultiplier;
    }

    set nearUVScaleMultiplier(val: number) {
        const clamped = Math.max(0.1, val);
        if (this.#nearUVScaleMultiplier === clamped) return;
        this.#nearUVScaleMultiplier = clamped;
        this.dirty = true;
        this.onChange?.();
    }

    get weightChannel(): LandscapeWeightMapChannel {
        return this.#weightChannel;
    }

    set weightChannel(val: LandscapeWeightMapChannel) {
        if (this.#weightChannel === val) return;
        this.#weightChannel = val;
        this.#updateWeightChannelIndex();
        this.dirty = true;
        this.onChange?.();
    }

    get weightChannelIndex(): number {
        return this.#weightChannelIndex;
    }

    get roughness(): number {
        return this.#roughness;
    }

    set roughness(val: number) {
        if (this.#roughness === val) return;
        this.#roughness = val;
        this.dirty = true;
        this.onChange?.();
    }

    get metallic(): number {
        return this.#metallic;
    }

    set metallic(val: number) {
        if (this.#metallic === val) return;
        this.#metallic = val;
        this.dirty = true;
        this.onChange?.();
    }

    get normalIntensity(): number {
        return this.#normalIntensity;
    }

    set normalIntensity(val: number) {
        if (this.#normalIntensity === val) return;
        this.#normalIntensity = val;
        this.dirty = true;
        this.onChange?.();
    }

    get aoIntensity(): number {
        return this.#aoIntensity;
    }

    set aoIntensity(val: number) {
        if (this.#aoIntensity === val) return;
        this.#aoIntensity = val;
        this.dirty = true;
        this.onChange?.();
    }
    #updateWeightChannelIndex(): void {
        const ch = String(this.#weightChannel).toUpperCase();
        if (ch === 'G' || ch === '1') this.#weightChannelIndex = 1;
        else if (ch === 'B' || ch === '2') this.#weightChannelIndex = 2;
        else if (ch === 'A' || ch === '3') this.#weightChannelIndex = 3;
        else this.#weightChannelIndex = 0;
    }

    get weightMapCPUSampler(): LandscapeWeightMapCPUSampler | undefined {
        return this.#weightMapCPUSampler;
    }

    set weightMapCPUSampler(val: LandscapeWeightMapCPUSampler | undefined) {
        this.#weightMapCPUSampler = val;
    }

    getWeightAtUV(u: number, v: number): number {
        if (!this.#enabled) return 0.0;
        const src = this.#weightTexture?.src;
        if (!src || !this.#weightMapCPUSampler) return 1.0;
        return this.#weightMapCPUSampler.getWeight(src, u, v, this.#weightChannelIndex);
    }
}

Object.freeze(LandscapeLayer);
export default LandscapeLayer;
