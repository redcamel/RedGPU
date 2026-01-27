import { mat4 } from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import { ASinglePassPostEffectResult } from "../../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing effect.
 *
 * [KO] 이전 프레임들의 정보를 누적하여 현재 프레임의 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다.
 * [EN] A high-quality anti-aliasing technique that removes aliasing in the current frame by accumulating information from previous frames.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 TAA 설정 (Configure TAA via AntialiasingManager)
 * redGPUContext.antialiasingManager.useTAA = true;
 * ```
 *
 * @category PostEffect
 */
declare class TAA {
    #private;
    /**
     * [KO] TAA 인스턴스를 생성합니다.
     * [EN] Creates a TAA instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 이전 프레임의 지터링 없는 프로젝션 카메라 행렬을 반환합니다.
     * [EN] Returns the non-jittered projection camera matrix of the previous frame.
     *
     * @returns
     * [KO] 4x4 행렬
     * [EN] 4x4 matrix
     */
    get prevNoneJitterProjectionCameraMatrix(): mat4;
    /**
     * [KO] 프레임 인덱스를 반환합니다.
     * [EN] Returns the frame index.
     *
     * @returns
     * [KO] 현재 프레임 인덱스
     * [EN] Current frame index
     */
    get frameIndex(): number;
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     *
     * @returns
     * [KO] 메모리 사용량 (바이트)
     * [EN] Memory usage (bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 지터링 강도를 반환합니다.
     * [EN] Returns the jitter strength.
     *
     * @returns
     * [KO] 지터링 강도
     * [EN] Jitter strength
     */
    get jitterStrength(): number;
    /**
     * [KO] 지터링 강도를 설정합니다.
     * [EN] Sets the jitter strength.
     *
     * @param value -
     * [KO] 지터링 강도 (0.0 ~ 1.0)
     * [EN] Jitter strength (0.0 ~ 1.0)
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
     * [KO] 너비
     * [EN] Width
     * @param height -
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
    /**
     * [KO] TAA 리소스를 초기화합니다.
     * [EN] Clears TAA resources.
     */
    clear(): void;
    /**
     * [KO] 유니폼 값을 업데이트합니다.
     * [EN] Updates a uniform value.
     *
     * @param key -
     * [KO] 유니폼 키
     * [EN] Uniform key
     * @param value -
     * [KO] 유니폼 값
     * [EN] Uniform value
     */
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default TAA;
