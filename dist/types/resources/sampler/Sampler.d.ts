import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "../core/ResourceBase";
/**
 * GPU 텍스처 샘플러를 관리하는 클래스입니다.
 *
 * - 샘플러의 필터, 어드레스 모드, 애니소트로피 등 다양한 옵션을 설정할 수 있습니다.
 * - 동일 옵션의 샘플러는 내부적으로 캐싱하여 중복 생성을 방지합니다.
 * - 옵션 변경 시 자동으로 샘플러를 갱신합니다.
 *
 * <iframe src="/RedGPU/examples/3d/texture/bitmapTextureSampler/"></iframe>
 *
 * 아래는 Sampler의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Sampler Combination example](/RedGPU/examples/3d/texture/samplerCombination/)
 * @see [Sampler AddressMode example](/RedGPU/examples/3d/texture/samplerAddressMode/)
 *
 * @category Sampler
 * @extends ResourceBase
 */
declare class Sampler extends ResourceBase {
    #private;
    /**
     * Sampler 인스턴스를 생성합니다.
     * @param redGPUContext RedGPUContext 인스턴스
     * @param options GPUSamplerDescriptor 옵션 객체
     */
    constructor(redGPUContext: RedGPUContext, options?: GPUSamplerDescriptor);
    get addressModeU(): GPUAddressMode;
    set addressModeU(value: GPUAddressMode);
    get addressModeV(): GPUAddressMode;
    set addressModeV(value: GPUAddressMode);
    get addressModeW(): GPUAddressMode;
    set addressModeW(value: GPUAddressMode);
    /**
     * Returns the MipmapFilter mode of the GPU object.
     *
     * @returns {GPUMipmapFilterMode} The MipmapFilter mode of the GPU.
     */
    get mipmapFilter(): GPUMipmapFilterMode;
    /**
     * Sets the mipmap filter mode.
     *
     * @param {GPUMipmapFilterMode} value - The filter mode to be set.
     */
    set mipmapFilter(value: GPUMipmapFilterMode);
    /**
     * Retrieves the GPU sampler associated with the current instance.
     *
     * @returns {GPUSampler} The GPU sampler.
     */
    get gpuSampler(): GPUSampler;
    /**
     * Retrieves the magnification filter mode used by the GPU.
     *
     * @return {GPUFilterMode} The magnification filter mode.
     */
    get magFilter(): GPUFilterMode;
    /**
     * Sets the magnification filter mode for the GPU texture.
     *
     * @param {GPUFilterMode} value - The magnification filter mode to be set.
     */
    set magFilter(value: GPUFilterMode);
    /**
     * Returns the minimum filter mode for the GPU filter.
     *
     * @returns {GPUFilterMode} The minimum filter mode for the GPU filter.
     */
    get minFilter(): GPUFilterMode;
    /**
     * Sets the value of `minFilter`.
     *
     * @param {GPUFilterMode} value - The new value for `minFilter`.
     */
    set minFilter(value: GPUFilterMode);
    /**
     * Retrieves the maximum anisotropy value.
     *
     * @return {number} The maximum anisotropy value.
     */
    get maxAnisotropy(): number;
    /**
     * Set the maximum anisotropy value for the sampler.
     *
     * @param {number} value - The value to set as maximum anisotropy. Must be within the range of 1 to 16.
     * @throws {RangeError} If the value is not within the specified range.

     */
    set maxAnisotropy(value: number);
    get isAnisotropyValid(): boolean;
}
export default Sampler;
