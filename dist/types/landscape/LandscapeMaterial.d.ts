import ColorRGBA from "../color/ColorRGBA";
import RedGPUContext from "../context/RedGPUContext";
import AUVTransformBaseMaterial from "../material/core/AUVTransformBaseMaterial";
import Sampler from "../resources/sampler/Sampler";
import LandscapeLayer from "./LandscapeLayer";
/**
 * [KO] `LandscapeMaterial`에 동적으로 정의되는 속성 인터페이스입니다.
 * [EN] Interface for properties dynamically defined on `LandscapeMaterial`.
 *
 * @category Landscape
 */
interface LandscapeMaterial {
    /**
     * [KO] 레이어가 없을 때 사용되는 지형 기본 베이스 컬러
     * [EN] Default terrain base color used when no layers are present
     */
    baseColor: ColorRGBA;
    /**
     * [KO] 지형 레이어 텍스처 샘플링에 사용되는 기본 샘플러
     * [EN] Default sampler used for terrain layer texture sampling
     */
    baseColorTextureSampler: Sampler;
}
/**
 * [KO] 최대 8개의 `LandscapeLayer`를 `2d-array` 텍스처로 통합 관리하고 단일 공유 RGBA 가중치 맵(`weightTexture`)을 기반으로 VBT 베이킹 및 근거리 디테일 블렌딩을 수행하는 지형 전용 머티리얼 클래스입니다. `Landscape` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Terrain-specific material class that consolidates up to 8 `LandscapeLayer` instances into `2d-array` textures and performs VBT baking and near-detail blending based on a single shared RGBA weight map (`weightTexture`). Automatically created internally when a `Landscape` is instantiated.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Landscape 인스턴스로부터 머티리얼 참조 및 근거리 디테일 거리 설정
 * // [EN] Reference material from a Landscape instance and set near-detail distance
 * const material = landscape.material;
 * material.nearDetailDistance = 300;
 * ```
 *
 * @see [Multi-Layer Splatting example](/RedGPU/examples/3d/landscape/multiLayerSplatting/)
 * @category Landscape
 */
declare class LandscapeMaterial extends AUVTransformBaseMaterial {
    #private;
    /**
     * [KO] `LandscapeMaterial` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeMaterial` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param baseColorHex -
     * [KO] 초기 베이스 컬러 HEX 문자열 (기본값: `'#387d42'`)
     * [EN] Initial base color HEX string (default: `'#387d42'`)
     * @param textureArraySize -
     * [KO] 레이어 `2d-array` 텍스처의 가로/세로 픽셀 해상도 (최솟값: `128`, 기본값: `1024`)
     * [EN] Width/height pixel resolution of the layer `2d-array` textures (minimum: `128`, default: `1024`)
     */
    constructor(redGPUContext: RedGPUContext, baseColorHex?: string, textureArraySize?: number);
    /**
     * [KO] 현재 머티리얼에 등록된 `LandscapeLayer` 배열을 반환합니다.
     * [EN] Returns the array of `LandscapeLayer` instances registered in the material.
     *
     * @returns
     * [KO] `LandscapeLayer` 배열
     * [EN] Array of `LandscapeLayer` instances
     */
    get layers(): LandscapeLayer[];
    /**
     * [KO] 고해상도 근접 디테일 텍스처 블렌딩이 유지되는 최대 거리(월드 단위, 최솟값: `0`)를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum distance (in world units, minimum: `0`) at which high-resolution near-detail texture blending is maintained.
     *
     * @returns
     * [KO] 근접 디테일 블렌딩 거리
     * [EN] Near-detail blending distance
     */
    get nearDetailDistance(): number;
    set nearDetailDistance(val: number);
    /**
     * [KO] 내부 레이어 `2d-array` 텍스처 뷰 객체(`baseColorView`, `normalView`, `ormView`, `weightMapView`)를 반환합니다.
     * [EN] Returns the internal layer `2d-array` texture views object (`baseColorView`, `normalView`, `ormView`, `weightMapView`).
     *
     * @returns
     * [KO] 레이어 텍스처 배열 뷰 모음 객체
     * [EN] Object containing layer texture array views
     */
    getInternalLayerViews(): {
        baseColorView: GPUTextureView | null;
        normalView: GPUTextureView | null;
        ormView: GPUTextureView | null;
        weightMapView: GPUTextureView | null;
    };
    /**
     * [KO] VBT 아틀라스 리베이킹이 요청될 때 실행할 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to execute when VBT atlas rebaking is requested.
     *
     * @param callback -
     * [KO] VBT 리베이킹 요청 시 호출될 콜백 함수
     * [EN] Callback function to be invoked when VBT rebaking is requested
     */
    setOnRebakeVBTRequested(callback?: () => void): void;
    /**
     * [KO] 레이어 텍스처 배열의 밉맵을 갱신하고 VBT 아틀라스 리베이킹을 요청합니다.
     * [EN] Updates mipmaps of the layer texture arrays and requests a VBT atlas rebake.
     *
     * @param immediate -
     * [KO] 디바운스 지연 없이 마이크로태스크로 즉시 실행할지 여부 (기본값: `false`)
     * [EN] Whether to execute immediately in a microtask without debounce delay (default: `false`)
     * @param debounceDelayMs -
     * [KO] 디바운스 대기 시간(밀리초, 기본값: `200`)
     * [EN] Debounce wait time in milliseconds (default: `200`)
     */
    requestVBTRebake(immediate?: boolean, debounceDelayMs?: number): void;
    /**
     * [KO] 머티리얼에 새로운 `LandscapeLayer`를 추가하고 텍스처 배열 재구축을 예약합니다. (최대 8개)
     * [EN] Adds a new `LandscapeLayer` to the material and schedules a texture array rebuild. (Maximum 8 layers)
     *
     * @param layer -
     * [KO] 추가할 `LandscapeLayer` 인스턴스
     * [EN] `LandscapeLayer` instance to add
     * @returns
     * [KO] 메서드 체이닝을 위한 현재 `LandscapeMaterial` 인스턴스
     * [EN] Current `LandscapeMaterial` instance for method chaining
     */
    addLayer(layer: LandscapeLayer): this;
    /**
     * [KO] 지정된 `LandscapeLayer` 인스턴스 또는 이름과 일치하는 레이어를 제거합니다.
     * [EN] Removes the specified `LandscapeLayer` instance or the layer matching the given name.
     *
     * @param layer -
     * [KO] 제거할 `LandscapeLayer` 인스턴스 또는 레이어 이름
     * [EN] `LandscapeLayer` instance or layer name to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether the layer was successfully removed
     */
    removeLayer(layer: LandscapeLayer | string): boolean;
    /**
     * [KO] 등록된 모든 `LandscapeLayer`를 제거합니다.
     * [EN] Removes all registered `LandscapeLayer` instances.
     */
    clearLayers(): void;
    /**
     * [KO] 지정된 이름과 일치하는 `LandscapeLayer`를 찾아 반환합니다.
     * [EN] Finds and returns the `LandscapeLayer` matching the specified name.
     *
     * @param layerName -
     * [KO] 조회할 레이어 이름
     * [EN] Layer name to look up
     * @returns
     * [KO] 일치하는 `LandscapeLayer` 인스턴스 또는 `undefined`
     * [EN] Matching `LandscapeLayer` instance or `undefined`
     */
    getLayer(layerName: string): LandscapeLayer | undefined;
    /**
     * [KO] 머티리얼과 모든 활성 레이어의 유니폼 데이터를 패킹하여 프래그먼트 유니폼 GPU 버퍼에 업로드합니다.
     * [EN] Packs uniform data of the material and all active layers and uploads it to the fragment uniform GPU buffer.
     */
    updateUniformsData(): void;
    /**
     * [KO] 프래그먼트 렌더 상태, 유니폼 버퍼 및 바인드 그룹을 갱신합니다.
     * [EN] Updates the fragment render state, uniform buffer, and bind group.
     */
    _updateFragmentState(): void;
    /**
     * [KO] 머티리얼의 `2d-array` GPU 텍스처 리소스, 타이머 및 등록된 모든 레이어를 해제합니다.
     * [EN] Releases the material's `2d-array` GPU texture resources, timers, and all registered layers.
     */
    destroy(): void;
}
export { LandscapeMaterial };
export default LandscapeMaterial;
