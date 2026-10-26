import BitmapTexture from "../resources/texture/BitmapTexture";
import type RedGPUContext from "../context/RedGPUContext";
import LandscapeWeightMapCPUSampler from "./core/cache/LandscapeWeightMapCPUSampler";
/**
 * [KO] 지형 레이어 가중치 맵에서 샘플링할 RGBA 색상 채널 식별자 타입입니다.
 * [EN] RGBA color channel identifier type to sample from a terrain layer weight map.
 *
 * @category Landscape
 */
export type LandscapeWeightMapChannel = 'R' | 'G' | 'B' | 'A' | 'r' | 'g' | 'b' | 'a' | 0 | 1 | 2 | 3;
/**
 * [KO] `LandscapeLayer` 생성 시 전달하는 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface passed when creating a `LandscapeLayer`.
 *
 * @category Landscape
 */
export interface LandscapeLayerOptions {
    /**
     * [KO] 레이어의 고유 이름
     * [EN] Unique name of the layer
     */
    name: string;
    /**
     * [KO] 레이어 활성화 여부 (기본값: `true`)
     * [EN] Whether the layer is enabled (default: `true`)
     */
    enabled?: boolean;
    /**
     * [KO] 베이스 컬러(BaseColor) 텍스처 인스턴스 또는 이미지 URL
     * [EN] Base color texture instance or image URL
     */
    baseColorTexture?: BitmapTexture | string;
    /**
     * [KO] 노멀(Normal) 텍스처 인스턴스 또는 이미지 URL
     * [EN] Normal texture instance or image URL
     */
    normalTexture?: BitmapTexture | string;
    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 텍스처 인스턴스 또는 이미지 URL
     * [EN] ORM (Occlusion, Roughness, Metallic) texture instance or image URL
     */
    ormTexture?: BitmapTexture | string;
    /**
     * [KO] 스플래팅 가중치(Weight) 텍스처 인스턴스 또는 이미지 URL (지형 전체에서 단일 RGBA 가중치 맵 1장을 공유하여 `weightChannel`로 R/G/B/A 채널을 참조합니다)
     * [EN] Splatting weight texture instance or image URL (shares a single RGBA weight map across the terrain, referencing R/G/B/A channels via `weightChannel`)
     */
    weightTexture?: BitmapTexture | string;
    /**
     * [KO] 텍스처 UV 타일링 스케일 `[u, v]` (기본값: `[20.0, 20.0]`)
     * [EN] Texture UV tiling scale `[u, v]` (default: `[20.0, 20.0]`)
     */
    uvScale?: [number, number];
    /**
     * [KO] 텍스처 UV 오프셋 `[u, v]` (기본값: `[0.0, 0.0]`)
     * [EN] Texture UV offset `[u, v]` (default: `[0.0, 0.0]`)
     */
    uvOffset?: [number, number];
    /**
     * [KO] 근접 디테일 영역에 적용되는 UV 스케일 배율 (기본값: `2.0`)
     * [EN] UV scale multiplier applied to the near-detail region (default: `2.0`)
     */
    nearUVScaleMultiplier?: number;
    /**
     * [KO] 가중치 텍스처에서 참조할 색상 채널 (기본값: `'R'`)
     * [EN] Color channel to reference in the weight texture (default: `'R'`)
     */
    weightChannel?: LandscapeWeightMapChannel;
    /**
     * [KO] 표면 거칠기(Roughness) 계수 (기본값: `1.0`)
     * [EN] Surface roughness factor (default: `1.0`)
     */
    roughness?: number;
    /**
     * [KO] 노멀 맵 강도 (기본값: `1.0`)
     * [EN] Normal map intensity (default: `1.0`)
     */
    normalIntensity?: number;
    /**
     * [KO] 앰비언트 오클루전(AO) 강도 (기본값: `1.0`)
     * [EN] Ambient occlusion (AO) intensity (default: `1.0`)
     */
    aoIntensity?: number;
    /**
     * [KO] 높이 기반 레이어 블렌딩 대비 계수 (범위: `0.0 ~ 5.0`, 기본값: `1.0`)
     * [EN] Height-based layer blending contrast factor (range: `0.0 to 5.0`, default: `1.0`)
     */
    heightBlendFactor?: number;
    /**
     * [KO] 반복 패턴 억제를 위한 스토캐스틱 타일링(Stochastic Tiling) 사용 여부 (기본값: `true`)
     * [EN] Whether to use stochastic tiling to suppress repetitive patterns (default: `true`)
     */
    stochasticTiling?: boolean;
    /**
     * [KO] 스토캐스틱 타일링 셀 스케일 (최솟값: `0.01`, 기본값: `1.0`)
     * [EN] Stochastic tiling cell scale (minimum: `0.01`, default: `1.0`)
     */
    stochasticScale?: number;
}
/**
 * [KO] 지형 멀티 레이어 스플래팅에 사용되는 개별 재질 레이어의 텍스처, UV 변환, PBR 속성 및 가중치 채널을 정의하는 클래스입니다. `landscape.addLayer()`를 통해 내부적으로 자동 생성됩니다.
 * [EN] Class that defines the textures, UV transform, PBR properties, and weight channel of an individual material layer used in terrain multi-layer splatting. Automatically created internally via `landscape.addLayer()`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 지형에 새로운 스플래팅 레이어 추가 및 참조
 * // [EN] Add and reference a new splatting layer on the landscape
 * const rockLayer = landscape.addLayer({
 *     name: 'Rock',
 *     baseColorTexture: './assets/rock_diff.jpg',
 *     normalTexture: './assets/rock_norm.jpg',
 *     uvScale: [30, 30],
 *     roughness: 0.85
 * });
 * ```
 *
 * @see [Multi-Layer Splatting example](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 * @category Landscape
 */
declare class LandscapeLayer {
    #private;
    /**
     * [KO] 단일 레이어 유니폼 구조체가 차지하는 `f32` 요소 개수(16 floats = 64 bytes)입니다.
     * [EN] Number of `f32` elements occupied by a single layer uniform struct (16 floats = 64 bytes).
     */
    static readonly UNIFORM_FLOAT_COUNT = 16;
    /**
     * [KO] 레이어의 텍스처 또는 베이킹 관련 속성이 변경될 때 호출되는 콜백 함수입니다.
     * [EN] Callback function invoked when a layer's texture or baking-related property changes.
     */
    onChange?: () => void;
    /**
     * [KO] VBT 리베이킹 없이 유니폼 버퍼 데이터만 갱신해야 할 때 호출되는 콜백 함수입니다.
     * [EN] Callback function invoked when only uniform buffer data needs to be updated without VBT rebaking.
     */
    onUniformChange?: () => void;
    /**
     * [KO] `LandscapeLayer` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeLayer` instance.
     *
     * @param redGPUContextOrOptions -
     * [KO] `RedGPUContext` 인스턴스 또는 `LandscapeLayerOptions` 설정 객체
     * [EN] `RedGPUContext` instance or `LandscapeLayerOptions` configuration object
     * @param options -
     * [KO] 첫 번째 인자로 `RedGPUContext`를 전달한 경우의 `LandscapeLayerOptions` 설정 객체
     * [EN] `LandscapeLayerOptions` configuration object when `RedGPUContext` is passed as the first argument
     */
    constructor(redGPUContextOrOptions: RedGPUContext | LandscapeLayerOptions, options?: LandscapeLayerOptions);
    /**
     * [KO] 레이어의 고유 이름을 반환합니다.
     * [EN] Returns the unique name of the layer.
     *
     * @returns
     * [KO] 레이어 이름
     * [EN] Layer name
     */
    get name(): string;
    set baseColorTexture(val: BitmapTexture | string | undefined);
    /**
     * [KO] 레이어의 베이스 컬러(BaseColor) 텍스처를 반환하거나 설정합니다.
     * [EN] Gets or sets the base color texture of the layer.
     *
     * @returns
     * [KO] `BitmapTexture` 인스턴스 또는 `undefined`
     * [EN] `BitmapTexture` instance or `undefined`
     */
    get baseColorTexture(): BitmapTexture | undefined;
    set normalTexture(val: BitmapTexture | string | undefined);
    /**
     * [KO] 레이어의 노멀(Normal) 텍스처를 반환하거나 설정합니다.
     * [EN] Gets or sets the normal texture of the layer.
     *
     * @returns
     * [KO] `BitmapTexture` 인스턴스 또는 `undefined`
     * [EN] `BitmapTexture` instance or `undefined`
     */
    get normalTexture(): BitmapTexture | undefined;
    set ormTexture(val: BitmapTexture | string | undefined);
    /**
     * [KO] 레이어의 ORM(Occlusion, Roughness, Metallic) 텍스처를 반환하거나 설정합니다.
     * [EN] Gets or sets the ORM (Occlusion, Roughness, Metallic) texture of the layer.
     *
     * @returns
     * [KO] `BitmapTexture` 인스턴스 또는 `undefined`
     * [EN] `BitmapTexture` instance or `undefined`
     */
    get ormTexture(): BitmapTexture | undefined;
    set weightTexture(val: BitmapTexture | string | undefined);
    /**
     * [KO] 레이어의 스플래팅 가중치(Weight) 텍스처를 반환하거나 설정합니다. (지형 전체에서 단일 RGBA 가중치 맵 1장만 공유 지원)
     * [EN] Gets or sets the splatting weight texture of the layer. (Supports a single shared RGBA weight map across the terrain)
     *
     * @returns
     * [KO] `BitmapTexture` 인스턴스 또는 `undefined`
     * [EN] `BitmapTexture` instance or `undefined`
     */
    get weightTexture(): BitmapTexture | undefined;
    /**
     * [KO] 레이어 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the layer is enabled.
     *
     * @returns
     * [KO] 활성화 상태 (`boolean`)
     * [EN] Enabled state (`boolean`)
     */
    get enabled(): boolean;
    set enabled(val: boolean);
    /**
     * [KO] 레이어 텍스처의 UV 타일링 스케일 `[u, v]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the UV tiling scale `[u, v]` of the layer texture.
     *
     * @returns
     * [KO] UV 스케일 튜플 `[number, number]`
     * [EN] UV scale tuple `[number, number]`
     */
    get uvScale(): [number, number];
    set uvScale(val: [number, number]);
    /**
     * [KO] 레이어 텍스처의 UV 오프셋 `[u, v]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the UV offset `[u, v]` of the layer texture.
     *
     * @returns
     * [KO] UV 오프셋 튜플 `[number, number]`
     * [EN] UV offset tuple `[number, number]`
     */
    get uvOffset(): [number, number];
    set uvOffset(val: [number, number]);
    /**
     * [KO] 근접 디테일 영역에 적용되는 UV 스케일 배율을 반환하거나 설정합니다. (최솟값: `0.1`)
     * [EN] Gets or sets the UV scale multiplier applied to the near-detail region. (Minimum: `0.1`)
     *
     * @returns
     * [KO] 근접 디테일 UV 스케일 배율
     * [EN] Near-detail UV scale multiplier
     */
    get nearUVScaleMultiplier(): number;
    set nearUVScaleMultiplier(val: number);
    /**
     * [KO] 가중치 텍스처에서 참조하는 색상 채널 식별자를 반환하거나 설정합니다.
     * [EN] Gets or sets the color channel identifier referenced in the weight texture.
     *
     * @returns
     * [KO] 가중치 채널 식별자 (`LandscapeWeightMapChannel`)
     * [EN] Weight channel identifier (`LandscapeWeightMapChannel`)
     */
    get weightChannel(): LandscapeWeightMapChannel;
    set weightChannel(val: LandscapeWeightMapChannel);
    /**
     * [KO] 현재 설정된 가중치 채널의 숫자 인덱스(0: R, 1: G, 2: B, 3: A)를 반환합니다.
     * [EN] Returns the numeric index (0: R, 1: G, 2: B, 3: A) of the currently configured weight channel.
     *
     * @returns
     * [KO] 채널 인덱스 (`0 ~ 3`)
     * [EN] Channel index (`0 to 3`)
     */
    get weightChannelIndex(): number;
    /**
     * [KO] 레이어의 표면 거칠기(Roughness) 계수를 반환하거나 설정합니다.
     * [EN] Gets or sets the surface roughness factor of the layer.
     *
     * @returns
     * [KO] 거칠기 계수
     * [EN] Roughness factor
     */
    get roughness(): number;
    set roughness(val: number);
    /**
     * [KO] 레이어의 노멀 맵 강도를 반환하거나 설정합니다.
     * [EN] Gets or sets the normal map intensity of the layer.
     *
     * @returns
     * [KO] 노멀 맵 강도
     * [EN] Normal map intensity
     */
    get normalIntensity(): number;
    set normalIntensity(val: number);
    set aoIntensity(val: number);
    /**
     * [KO] 레이어의 앰비언트 오클루전(AO) 강도를 반환하거나 설정합니다.
     * [EN] Gets or sets the ambient occlusion (AO) intensity of the layer.
     *
     * @returns
     * [KO] AO 강도
     * [EN] AO intensity
     */
    get aoIntensity(): number;
    /**
     * [KO] 높이 기반 레이어 블렌딩 대비 계수(범위: `0.0 ~ 5.0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the height-based layer blending contrast factor (range: `0.0 to 5.0`).
     *
     * @returns
     * [KO] 높이 블렌드 계수
     * [EN] Height blend factor
     */
    get heightBlendFactor(): number;
    set heightBlendFactor(val: number);
    /**
     * [KO] 반복 패턴 억제를 위한 스토캐스틱 타일링 활성화 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether stochastic tiling is enabled to suppress repetitive patterns.
     *
     * @returns
     * [KO] 스토캐스틱 타일링 활성화 여부
     * [EN] Whether stochastic tiling is enabled
     */
    get stochasticTiling(): boolean;
    set stochasticTiling(val: boolean);
    /**
     * [KO] 스토캐스틱 타일링 셀 스케일(최솟값: `0.01`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the stochastic tiling cell scale (minimum: `0.01`).
     *
     * @returns
     * [KO] 스토캐스틱 타일링 스케일
     * [EN] Stochastic tiling scale
     */
    get stochasticScale(): number;
    set stochasticScale(val: number);
    /**
     * [KO] 레이어의 CPU 측 가중치 맵 샘플러를 반환하거나 설정합니다.
     * [EN] Gets or sets the CPU-side weight map sampler for the layer.
     *
     * @returns
     * [KO] `LandscapeWeightMapCPUSampler` 인스턴스 또는 `undefined`
     * [EN] `LandscapeWeightMapCPUSampler` instance or `undefined`
     */
    get weightMapCPUSampler(): LandscapeWeightMapCPUSampler | undefined;
    set weightMapCPUSampler(val: LandscapeWeightMapCPUSampler | undefined);
    /**
     * [KO] 대상 `Float32Array` 버퍼의 지정된 오프셋부터 단일 레이어 유니폼 영역(16 floats)을 0으로 초기화합니다.
     * [EN] Fills a single layer uniform region (16 floats) with zeros starting at the specified offset in the target `Float32Array` buffer.
     *
     * @param targetBuffer -
     * [KO] 기록할 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer to write into
     * @param offset -
     * [KO] 기록을 시작할 배열 요소 인덱스 오프셋
     * [EN] Array element index offset to start writing at
     */
    static writeZeroUniformData(targetBuffer: Float32Array, offset: number): void;
    /**
     * [KO] 문자열 URL로 보류 중이던 텍스처 경로들을 주어진 `RedGPUContext`를 사용하여 `BitmapTexture` 인스턴스로 생성합니다.
     * [EN] Instantiates pending string URL texture paths into `BitmapTexture` instances using the provided `RedGPUContext`.
     *
     * @param context -
     * [KO] 텍스처 생성에 사용할 `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance to use for texture creation
     */
    resolvePendingTextures(context: RedGPUContext): void;
    /**
     * [KO] 지정된 정규화 지형 UV 좌표(`0.0 ~ 1.0`)에서 이 레이어의 스플래팅 가중치를 반환합니다.
     * [EN] Returns the splatting weight of this layer at the specified normalized terrain UV coordinates (`0.0 to 1.0`).
     *
     * @param u -
     * [KO] 정규화된 U 좌표 (`0.0 ~ 1.0`)
     * [EN] Normalized U coordinate (`0.0 to 1.0`)
     * @param v -
     * [KO] 정규화된 V 좌표 (`0.0 ~ 1.0`)
     * [EN] Normalized V coordinate (`0.0 to 1.0`)
     * @returns
     * [KO] 샘플링된 가중치 값 (`0.0 ~ 1.0`)
     * [EN] Sampled weight value (`0.0 to 1.0`)
     */
    getWeightAtUV(u: number, v: number): number;
    /**
     * [KO] 현재 레이어의 속성 데이터를 대상 `Float32Array` 유니폼 버퍼의 지정된 오프셋에 기록합니다.
     * [EN] Writes the current layer's property data into the target `Float32Array` uniform buffer at the specified offset.
     *
     * @param targetBuffer -
     * [KO] 기록할 대상 `Float32Array` 버퍼
     * [EN] Target `Float32Array` buffer to write into
     * @param offset -
     * [KO] 기록을 시작할 배열 요소 인덱스 오프셋
     * [EN] Array element index offset to start writing at
     */
    writeUniformData(targetBuffer: Float32Array, offset: number): void;
}
export default LandscapeLayer;
