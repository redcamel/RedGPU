import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import { IPostEffectResult } from "../../../core/types";
/**
 * [KO] 풀해상도(`1×1`) 깊이 복원 CoC, 미세 비초점 구간(`Slight Out-of-Focus`) 원본 8-Tap 직접 개더링, 배경 보케 양방향 업샘플링 및 전경 불투명도(`α_fg`) Porter-Duff `Over` 합성을 수행하는 내부 패스입니다.
 * [EN] Internal pass performing full-resolution (`1×1`) depth-reconstructed CoC, direct 8-Tap full-resolution slight out-of-focus gathering, background bokeh bilateral upsampling, and foreground opacity (`α_fg`) Porter-Duff `Over` composition.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare class DOFComposite extends ASingleComputePassPostEffect {
    #private;
    /**
     * [KO] `DOFComposite` 인스턴스를 생성합니다.
     * [EN] Creates a `DOFComposite` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 초점 거리를 반환합니다.
     * [EN] Returns the focus distance.
     *
     * @returns
     * [KO] 초점 거리
     * [EN] Focus distance
     */
    get focusDistance(): number;
    set focusDistance(value: number);
    /**
     * [KO] 조리개 값(F-Stop)을 반환합니다.
     * [EN] Returns the aperture value (F-Stop).
     *
     * @returns
     * [KO] 조리개 값
     * [EN] Aperture value
     */
    get aperture(): number;
    set aperture(value: number);
    /**
     * [KO] 렌즈 초점 거리(mm)를 반환합니다.
     * [EN] Returns the lens focal length (mm).
     *
     * @returns
     * [KO] 렌즈 초점 거리
     * [EN] Lens focal length
     */
    get focalLength(): number;
    set focalLength(value: number);
    /**
     * [KO] 자동 초점 사용 여부 플래그(`0` 또는 `1`)를 반환합니다.
     * [EN] Returns the autofocus usage flag (`0` or `1`).
     *
     * @returns
     * [KO] 자동 초점 사용 여부 플래그
     * [EN] Autofocus usage flag
     */
    get useAutoFocus(): number;
    set useAutoFocus(value: number);
    /**
     * [KO] 이전 프레임 히스토리 유효성 플래그(`0` 또는 `1`)를 반환합니다.
     * [EN] Returns the previous frame history validity flag (`0` or `1`).
     *
     * @returns
     * [KO] 히스토리 유효성 플래그
     * [EN] History validity flag
     */
    get historyValid(): number;
    set historyValid(value: number);
    /**
     * [KO] 원본 HDR 텍스처, CoC 텍스처, 배경 보케 텍스처, 전경 보케 텍스처를 합성하여 풀해상도로 렌더링합니다.
     * [EN] Composites the original HDR texture, CoC texture, background bokeh texture, and foreground bokeh texture at full resolution.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 원본 풀해상도 HDR 텍스처 정보
     * [EN] Original full-resolution HDR texture information
     * @param cocTextureInfo -
     * [KO] `1/2` 해상도 CoC 텍스처 정보 (`cocMip0`)
     * [EN] `1/2` resolution CoC texture information (`cocMip0`)
     * @param bgBokehTextureInfo -
     * [KO] `1/2` 해상도 후처리된 배경 보케 텍스처 정보
     * [EN] `1/2` resolution post-filtered background bokeh texture information
     * @param fgBokehTextureInfo -
     * [KO] `1/2` 해상도 후처리된 전경 보케 및 불투명도 텍스처 정보
     * [EN] `1/2` resolution post-filtered foreground bokeh and opacity texture information
     * @param focusTextureInfo -
     * [KO] `1x1` 유효 초점 거리 상태 텍스처 정보
     * [EN] `1x1` effective focus distance state texture information
     * @returns
     * [KO] 최종 합성된 풀해상도 DOF 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final composited full-resolution DOF texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, cocTextureInfo: IPostEffectResult, bgBokehTextureInfo: IPostEffectResult, fgBokehTextureInfo: IPostEffectResult, focusTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default DOFComposite;
