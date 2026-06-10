import { mat4 } from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import { IPostEffectResult } from "../../postEffect/core/types";
/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing effect.
 *
 * [KO] 이전 프레임들의 정보를 현재 프레임에 누적하여 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다. 화면이 정지해 있을 때도 부드러운 외곽선을 유지하며, MSAA보다 적은 비용으로 우수한 품질을 제공합니다.
 * [EN] A high-quality anti-aliasing technique that removes aliasing by accumulating information from previous frames into the current frame. It maintains smooth edges even when the screen is static and provides superior quality at a lower cost than MSAA.
 *
 * [KO] 이 효과는 지터링(Jittering)된 투영 행렬과 모션 벡터(Motion Vector)를 활용하여 프레임 간의 픽셀 대응점을 추적합니다.
 * [EN] This effect utilizes jittered projection matrices and motion vectors to track pixel correspondences between frames.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // [KO] AntialiasingManager를 통해 TAA를 활성화합니다.
 * // [EN] Enable TAA via AntialiasingManager.
 * redGPUContext.antialiasingManager.useTAA = true;
 * ```
 *
 * @category PostEffect
 */
declare class TAA extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] TAA 인스턴스를 생성합니다.
     * [EN] Creates a TAA instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 이전 프레임의 지터링 없는 투영 뷰(Projection-View) 행렬을 반환합니다.
     * [EN] Returns the non-jittered projection-view matrix of the previous frame.
     *
     * @returns
     * [KO] 이전 프레임의 투영 뷰 행렬
     * [EN] Non-jittered projection-view matrix of the previous frame
     */
    get prevNoneJitterProjectionViewMatrix(): mat4;
    /**
     * [KO] 프레임 인덱스를 반환합니다.
     * [EN] Returns the frame index.
     *
     * @returns
     * [KO] 프레임 인덱스
     * [EN] Frame index
     */
    get frameIndex(): number;
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     *
     * @returns
     * [KO] 비디오 메모리 바이트 수
     * [EN] Video memory size in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 지터링 강도를 반환합니다.
     * [EN] Returns the jitter strength.
     *
     * @returns
     * [KO] 지터링 강도 (기본값: 0.5)
     * [EN] Jitter strength (default: 0.5)
     */
    get jitterStrength(): number;
    /**
     * [KO] 지터링 강도를 설정합니다.
     * [EN] Sets the jitter strength.
     *
     * @param value -
     * [KO] 지터링 강도
     * [EN] Jitter strength to set
     */
    set jitterStrength(value: number);
    /**
     * [KO] TAA 이펙트를 렌더링합니다.
     * [EN] Renders the TAA effect.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 입력으로 사용될 소스 텍스처 정보
     * [EN] Source texture information to be used as input
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    /**
     * [KO] TAA 리소스를 해제합니다.
     * [EN] Clears TAA resources.
     */
    clear(): void;
}
export default TAA;
