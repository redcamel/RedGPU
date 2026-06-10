import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "../core/ResourceBase";
/**
 * [KO] GPU 텍스처 샘플러를 관리하는 클래스입니다.
 * [EN] Class that manages GPU texture samplers.
 *
 * [KO] 샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.
 * [EN] Various options such as sampler's filter, address mode, and anisotropy can be set.
 * [KO] 동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지하며, 옵션 변경 시 자동으로 샘플러를 갱신합니다.
 * [EN] Samplers with the same options are cached internally to prevent redundant creation, and the sampler is automatically updated when options change.
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>
 *
 * @see
 * [KO] 아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Sampler.
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
     * * ### Example
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
     * [KO] GPUSamplerDescriptor 옵션 객체
     * [EN] GPUSamplerDescriptor options object
     */
    constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor);
    /**
     * [KO] U축 어드레스 모드를 반환합니다.
     * [EN] Returns the address mode for the U coordinate.
     * @returns - [KO] 어드레스 모드 [EN] Address mode
     */
    get addressModeU(): GPUAddressMode;
    /**
     * [KO] U축 어드레스 모드를 설정합니다.
     * [EN] Sets the address mode for the U coordinate.
     * @param value - [KO] 설정할 어드레스 모드 [EN] Address mode to set
     */
    set addressModeU(value: GPUAddressMode);
    /**
     * [KO] V축 어드레스 모드를 반환합니다.
     * [EN] Returns the address mode for the V coordinate.
     * @returns - [KO] 어드레스 모드 [EN] Address mode
     */
    get addressModeV(): GPUAddressMode;
    /**
     * [KO] V축 어드레스 모드를 설정합니다.
     * [EN] Sets the address mode for the V coordinate.
     * @param value - [KO] 설정할 어드레스 모드 [EN] Address mode to set
     */
    set addressModeV(value: GPUAddressMode);
    /**
     * [KO] W축 어드레스 모드를 반환합니다.
     * [EN] Returns the address mode for the W coordinate.
     * @returns - [KO] 어드레스 모드 [EN] Address mode
     */
    get addressModeW(): GPUAddressMode;
    /**
     * [KO] W축 어드레스 모드를 설정합니다.
     * [EN] Sets the address mode for the W coordinate.
     * @param value - [KO] 설정할 어드레스 모드 [EN] Address mode to set
     */
    set addressModeW(value: GPUAddressMode);
    /**
     * [KO] 밉맵 필터 모드를 반환합니다.
     * [EN] Returns the mipmap filter mode.
     * @returns - [KO] 밉맵 필터 모드 [EN] Mipmap filter mode
     */
    get mipmapFilter(): GPUMipmapFilterMode;
    /**
     * [KO] 밉맵 필터 모드를 설정합니다.
     * [EN] Sets the mipmap filter mode.
     * @param value - [KO] 설정할 밉맵 필터 모드 [EN] Mipmap filter mode to set
     */
    set mipmapFilter(value: GPUMipmapFilterMode);
    /**
     * [KO] GPU 샘플러 객체를 반환합니다.
     * [EN] Returns the GPU sampler object.
     * @returns - [KO] WebGPU GPU 샘플러 객체 [EN] WebGPU GPU sampler object
     */
    get gpuSampler(): GPUSampler;
    /**
     * [KO] 확대 필터 모드를 반환합니다.
     * [EN] Returns the magnification filter mode.
     * @returns - [KO] 확대 필터 모드 [EN] Magnification filter mode
     */
    get magFilter(): GPUFilterMode;
    /**
     * [KO] 확대 필터 모드를 설정합니다.
     * [EN] Sets the magnification filter mode.
     * @param value - [KO] 설정할 확대 필터 모드 [EN] Magnification filter mode to set
     */
    set magFilter(value: GPUFilterMode);
    /**
     * [KO] 축소 필터 모드를 반환합니다.
     * [EN] Returns the minification filter mode.
     * @returns - [KO] 축소 필터 모드 [EN] Minification filter mode
     */
    get minFilter(): GPUFilterMode;
    /**
     * [KO] 축소 필터 모드를 설정합니다.
     * [EN] Sets the minification filter mode.
     * @param value - [KO] 설정할 축소 필터 모드 [EN] Minification filter mode to set
     */
    set minFilter(value: GPUFilterMode);
    /**
     * [KO] 최대 애니소트로피 값을 반환합니다.
     * [EN] Returns the maximum anisotropy value.
     * @returns - [KO] 최대 애니소트로피 값 [EN] Maximum anisotropy value
     */
    get maxAnisotropy(): number;
    /**
     * [KO] 최대 애니소트로피 값을 설정합니다. (1~16 사이)
     * [EN] Sets the maximum anisotropy value. (Between 1 and 16)
     * @param value - [KO] 애니소트로피 값 [EN] Anisotropy value
     * @throws
     * [KO] 1 미만 또는 16 초과 시 RangeError 발생
     * [EN] Throws RangeError if value is less than 1 or greater than 16
     */
    set maxAnisotropy(value: number);
    /**
     * [KO] 애니소트로피 설정이 유효한지 확인합니다. (모든 필터가 'linear'여야 함)
     * [EN] Checks if the anisotropy setting is valid. (All filters must be 'linear')
     * @returns - [KO] 유효 여부 [EN] Whether it is valid
     */
    get isAnisotropyValid(): boolean;
}
export default Sampler;
