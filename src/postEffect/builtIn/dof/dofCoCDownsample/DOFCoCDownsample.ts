import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import DOF_CONFIG from "../DOF_CONFIG";
import dofOpticsCommon from "../wgsl/dofOpticsCommon.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 35mm 풀프레임 센서(`24mm`) 및 Thin-Lens 광학 공식으로 절반 해상도(`1/2`) 착란원 반경(단위: 텍셀)을 자동 산출하고 CoC-Aware 양방향 다운샘플링을 수행하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that automatically computes half-resolution (`1/2`) Circle of Confusion radius (in texels) using a 35mm full-frame sensor (`24mm`) and Thin-Lens optics, and performs CoC-aware bilateral downsampling.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFCoCDownsample extends ASingleComputePassPostEffect {
    #focusDistance: number = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
    #aperture: number = DOF_CONFIG.DEFAULT_APERTURE;
    #focalLength: number = DOF_CONFIG.DEFAULT_FOCAL_LENGTH;
    #useAutoFocus: number = 0;
    #historyValid: number = 0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_COC_DOWNSAMPLE',
            createBasicComputePassPostEffectCode(
                this,
                computeCode,
                `${dofOpticsCommon}\n${uniformStructCode}`,
                [
                    {name: 'sourceTexture'},
                    {name: 'focusTexture'},
                    {name: 'prevCoCTexture'}
                ]
            )
        );
    }

    /**
     * [KO] 초점 거리를 반환합니다.
     * [EN] Returns the focus distance.
     *
     * @returns
     * [KO] 초점 거리
     * [EN] Focus distance
     */
    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCUS_DISTANCE, DOF_CONFIG.MAX_FOCUS_DISTANCE);
        if (this.#focusDistance === value) return;
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }

    /**
     * [KO] 조리개 값(F-Stop)을 반환합니다.
     * [EN] Returns the aperture value (F-Stop).
     *
     * @returns
     * [KO] 조리개 값
     * [EN] Aperture value
     */
    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_APERTURE, DOF_CONFIG.MAX_APERTURE);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.updateUniform('aperture', value);
    }

    /**
     * [KO] 렌즈 초점 거리(mm)를 반환합니다.
     * [EN] Returns the lens focal length (mm).
     *
     * @returns
     * [KO] 렌즈 초점 거리
     * [EN] Lens focal length
     */
    get focalLength(): number {
        return this.#focalLength;
    }

    set focalLength(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCAL_LENGTH, DOF_CONFIG.MAX_FOCAL_LENGTH);
        if (this.#focalLength === value) return;
        this.#focalLength = value;
        this.updateUniform('focalLength', value);
    }

    /**
     * [KO] 자동 초점 사용 여부 플래그(`0` 또는 `1`)를 반환합니다.
     * [EN] Returns the autofocus usage flag (`0` or `1`).
     *
     * @returns
     * [KO] 자동 초점 사용 여부 플래그
     * [EN] Autofocus usage flag
     */
    get useAutoFocus(): number {
        return this.#useAutoFocus;
    }

    set useAutoFocus(value: number) {
        validateUintRange(value, 0, 1);
        if (this.#useAutoFocus === value) return;
        this.#useAutoFocus = value;
        this.updateUniform('useAutoFocus', value);
    }

    /**
     * [KO] 이전 프레임 CoC 히스토리 유효성 플래그(`0` 또는 `1`)를 반환합니다.
     * [EN] Returns the previous frame CoC history validity flag (`0` or `1`).
     *
     * @returns
     * [KO] 히스토리 유효성 플래그
     * [EN] History validity flag
     */
    get historyValid(): number {
        return this.#historyValid;
    }

    set historyValid(value: number) {
        validateUintRange(value, 0, 1);
        if (this.#historyValid === value) return;
        this.#historyValid = value;
        this.updateUniform('historyValid', value);
    }

    /**
     * [KO] 원본 HDR 텍스처와 깊이 정보를 기반으로 절반 해상도(`1/2`) CoC 계산 및 양방향 다운샘플링을 수행합니다.
     * [EN] Computes half-resolution (`1/2`) CoC and performs bilateral downsampling based on the original HDR texture and depth information.
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
     * @param focusTextureInfo -
     * [KO] `1x1` 유효 초점 거리 상태 텍스처 정보
     * [EN] `1x1` effective focus distance state texture information
     * @param prevCoCTextureInfo -
     * [KO] 이전 프레임의 `1/2` 해상도 CoC 텍스처 정보
     * [EN] Previous frame's `1/2` resolution CoC texture information
     * @returns
     * [KO] 다운샘플링된 `1/2` 해상도 CoC 및 컬러 텍스처 정보 (`IPostEffectResult`)
     * [EN] Downsampled `1/2` resolution CoC and color texture information (`IPostEffectResult`)
     */
    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult,
        focusTextureInfo: IPostEffectResult,
        prevCoCTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, focusTextureInfo, prevCoCTextureInfo);
    }
}

Object.freeze(DOFCoCDownsample);
export default DOFCoCDownsample;
