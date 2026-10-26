import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 뷰포트 깊이 버퍼로부터 8단계 밉맵 깊이 피라미드를 생성하고 관리하는 클래스입니다.
 * [EN] Class that generates and manages an 8-level mipmap depth pyramid from the viewport depth buffer.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const hzb = view.hierarchicalZBuffer;
 * ```
 *
 * @category View
 */
declare class HierarchicalZBuffer extends RedGPUObject {
    #private;
    /**
     * [KO] HZB 피라미드의 기본 너비 (픽셀)
     * [EN] Base width of the HZB pyramid (pixels)
     */
    static HZB_WIDTH: number;
    /**
     * [KO] HZB 피라미드의 기본 높이 (픽셀)
     * [EN] Base height of the HZB pyramid (pixels)
     */
    static HZB_HEIGHT: number;
    /**
     * [KO] HZB 피라미드의 밉맵 단계 수
     * [EN] Number of mipmap levels in the HZB pyramid
     */
    static MIP_COUNT: number;
    /**
     * [KO] `HierarchicalZBuffer` 인스턴스를 생성합니다.
     * [EN] Creates a `HierarchicalZBuffer` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] HZB 밉맵 피라미드 `GPUTexture`를 반환합니다.
     * [EN] Returns the HZB mipmap pyramid `GPUTexture`.
     *
     * @returns
     * [KO] `GPUTexture` 또는 `null`
     * [EN] `GPUTexture` or `null`
     */
    get texture(): GPUTexture | null;
    /**
     * [KO] 전체 HZB 밉맵 레벨을 포함하는 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` covering all HZB mipmap levels.
     *
     * @returns
     * [KO] `GPUTextureView` 또는 `null`
     * [EN] `GPUTextureView` or `null`
     */
    get textureView(): GPUTextureView | null;
    /**
     * [KO] HZB 샘플러(`GPUSampler`)를 반환합니다.
     * [EN] Returns the HZB `GPUSampler`.
     *
     * @returns
     * [KO] `GPUSampler` 또는 `null`
     * [EN] `GPUSampler` or `null`
     */
    get sampler(): GPUSampler | null;
    /**
     * [KO] 소스 깊이 텍스처 뷰로부터 8단계 HZB 밉맵 피라미드를 SPD(Single-Pass Downsampler)로 생성합니다.
     * [EN] Generates an 8-level HZB mipmap pyramid from the source depth texture view using Single-Pass Downsampler (SPD).
     *
     * @param commandEncoder -
     * [KO] 컴퓨트 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the compute pass
     * @param sourceDepthTextureView -
     * [KO] 원본 깊이 텍스처 뷰
     * [EN] Source depth texture view
     * @param srcWidth -
     * [KO] 원본 깊이 텍스처 너비 (픽셀)
     * [EN] Source depth texture width (pixels)
     * @param srcHeight -
     * [KO] 원본 깊이 텍스처 높이 (픽셀)
     * [EN] Source depth texture height (pixels)
     * @param isMSAA -
     * [KO] 멀티샘플링(MSAA) 깊이 텍스처 여부 (기본값: `false`)
     * [EN] Whether the depth texture is multisampled (MSAA) (default: `false`)
     */
    generate(commandEncoder: GPUCommandEncoder, sourceDepthTextureView: GPUTextureView, srcWidth: number, srcHeight: number, isMSAA?: boolean): void;
    /**
     * [KO] HZB 피라미드 텍스처 및 컴퓨트 파이프라인 리소스를 해제합니다.
     * [EN] Destroys the HZB pyramid texture and compute pipeline resources.
     */
    destroy(): void;
}
export default HierarchicalZBuffer;
