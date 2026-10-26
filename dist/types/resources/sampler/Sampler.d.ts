import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "../core/ResourceBase";
/**
 * [KO] GPU 텍스처 샘플러(`GPUSampler`)를 관리하는 클래스입니다.
 * [EN] Class that manages GPU texture samplers (`GPUSampler`).
 *
 * [KO] 필터링 모드, 어드레스 모드, 이방성 필터링(`maxAnisotropy`) 옵션을 설정할 수 있으며, 동일 옵션의 샘플러는 내부적으로 캐싱됩니다.
 * [EN] Configures filtering modes, address modes, and anisotropic filtering (`maxAnisotropy`) options, and caches samplers with identical options internally.
 *
 * ### Example
 * ```typescript
 * const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
 *   magFilter: 'linear',
 *   minFilter: 'linear',
 *   addressModeU: 'repeat',
 *   addressModeV: 'repeat'
 * });
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sampler Combination example](/RedGPU/examples/3d/texture/samplerCombination/)
 * @see [Sampler AddressMode example](/RedGPU/examples/3d/texture/samplerAddressMode/)
 *
 * @category Sampler
 */
declare class Sampler extends ResourceBase {
    #private;
    /**
     * [KO] Sampler 인스턴스를 생성합니다.
     * [EN] Creates a Sampler instance.
     *
     * ### Example
     * ```typescript
     * const sampler = new RedGPU.Resource.Sampler(redGPUContext, {
     *   magFilter: 'linear',
     *   minFilter: 'linear',
     *   addressModeU: 'repeat',
     *   addressModeV: 'repeat'
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] GPUSamplerDescriptor 옵션 객체 (선택)
     * [EN] GPUSamplerDescriptor options object (optional)
     */
    constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor);
    /**
     * [KO] U축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the U coordinate.
     *
     * @returns
     * [KO] U축 어드레스 모드
     * [EN] Address mode for the U coordinate
     */
    get addressModeU(): GPUAddressMode;
    set addressModeU(value: GPUAddressMode);
    /**
     * [KO] V축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the V coordinate.
     *
     * @returns
     * [KO] V축 어드레스 모드
     * [EN] Address mode for the V coordinate
     */
    get addressModeV(): GPUAddressMode;
    set addressModeV(value: GPUAddressMode);
    /**
     * [KO] W축 어드레스 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the address mode for the W coordinate.
     *
     * @returns
     * [KO] W축 어드레스 모드
     * [EN] Address mode for the W coordinate
     */
    get addressModeW(): GPUAddressMode;
    set addressModeW(value: GPUAddressMode);
    /**
     * [KO] 밉맵 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the mipmap filter mode.
     *
     * @returns
     * [KO] 밉맵 필터 모드
     * [EN] Mipmap filter mode
     */
    get mipmapFilter(): GPUMipmapFilterMode;
    set mipmapFilter(value: GPUMipmapFilterMode);
    /**
     * [KO] 생성된 `GPUSampler` 객체를 반환합니다.
     * [EN] Returns the created `GPUSampler` object.
     *
     * @returns
     * [KO] WebGPU `GPUSampler` 객체
     * [EN] WebGPU `GPUSampler` object
     */
    get gpuSampler(): GPUSampler;
    /**
     * [KO] 확대 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the magnification filter mode.
     *
     * @returns
     * [KO] 확대 필터 모드
     * [EN] Magnification filter mode
     */
    get magFilter(): GPUFilterMode;
    set magFilter(value: GPUFilterMode);
    /**
     * [KO] 축소 필터 모드를 반환하거나 설정합니다.
     * [EN] Gets or sets the minification filter mode.
     *
     * @returns
     * [KO] 축소 필터 모드
     * [EN] Minification filter mode
     */
    get minFilter(): GPUFilterMode;
    set minFilter(value: GPUFilterMode);
    /**
     * [KO] 최대 이방성 필터링(`maxAnisotropy`) 값을 반환하거나 설정합니다. (유효 범위: 1~16)
     * [EN] Gets or sets the maximum anisotropy (`maxAnisotropy`) value. (Valid range: 1–16)
     *
     * @returns
     * [KO] 최대 이방성 필터링 값
     * [EN] Maximum anisotropy value
     */
    get maxAnisotropy(): number;
    set maxAnisotropy(value: number);
    /**
     * [KO] 이방성 필터링 설정이 유효한지 여부를 반환합니다. (`magFilter`, `minFilter`, `mipmapFilter`가 모두 `'linear'`여야 유효)
     * [EN] Returns whether the anisotropy setting is valid. (Valid only when `magFilter`, `minFilter`, and `mipmapFilter` are all `'linear'`)
     *
     * @returns
     * [KO] 유효 여부
     * [EN] Whether the setting is valid
     */
    get isAnisotropyValid(): boolean;
}
export default Sampler;
