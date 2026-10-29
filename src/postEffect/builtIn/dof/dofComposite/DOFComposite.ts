import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import DOF_CONFIG from "../DOF_CONFIG";
import dofOpticsCommon from "../wgsl/dofOpticsCommon.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF`의 `DOF_Recombine` 패스와 동일하게 풀해상도(`1×1`) 깊이 복원 CoC, 미세 비초점 구간(`Slight Out-of-Focus`) 원본 8-Tap 직접 개더링, 배경 보케 양방향 업샘플링 및 전경 불투명도(`α_fg`) Porter-Duff `Over` 합성을 수행하는 내부 패스입니다.
 * [EN] Internal pass matching Unreal Engine's `Diaphragm DOF` `DOF_Recombine` pass, performing full-resolution (`1×1`) depth-reconstructed CoC, direct 8-Tap full-resolution slight out-of-focus gathering, background bokeh bilateral upsampling, and foreground opacity (`α_fg`) Porter-Duff `Over` composition.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFComposite extends ASinglePassPostEffect {
    #focusDistance: number = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
    #aperture: number = DOF_CONFIG.DEFAULT_APERTURE;
    #focalLength: number = DOF_CONFIG.DEFAULT_FOCAL_LENGTH;
    #sensorSize: number = DOF_CONFIG.DEFAULT_SENSOR_SIZE;
    #maxCoC: number = DOF_CONFIG.DEFAULT_MAX_COC;
    #useAutoFocus: number = 0;

    /**
     * [KO] `DOFComposite` 인스턴스를 생성합니다.
     * [EN] Creates a `DOFComposite` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_COMPOSITE',
            createBasicPostEffectCode(
                this,
                computeCode,
                `${dofOpticsCommon}\n${uniformStructCode}`,
                [
                    {name: 'sourceTexture'},
                    {name: 'cocTexture'},
                    {name: 'bgBokehTexture'},
                    {name: 'fgBokehTexture'},
                    {name: 'focusTexture'}
                ]
            )
        );
    }

    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCUS_DISTANCE, DOF_CONFIG.MAX_FOCUS_DISTANCE);
        if (this.#focusDistance === value) return;
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }

    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_APERTURE, DOF_CONFIG.MAX_APERTURE);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.updateUniform('aperture', value);
    }

    get focalLength(): number {
        return this.#focalLength;
    }

    set focalLength(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCAL_LENGTH, DOF_CONFIG.MAX_FOCAL_LENGTH);
        if (this.#focalLength === value) return;
        this.#focalLength = value;
        this.updateUniform('focalLength', value);
    }

    get sensorSize(): number {
        return this.#sensorSize;
    }

    set sensorSize(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_SENSOR_SIZE, DOF_CONFIG.MAX_SENSOR_SIZE);
        if (this.#sensorSize === value) return;
        this.#sensorSize = value;
        this.updateUniform('sensorSize', value);
    }

    get maxCoC(): number {
        return this.#maxCoC;
    }

    set maxCoC(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_MAX_COC, DOF_CONFIG.MAX_MAX_COC);
        if (this.#maxCoC === value) return;
        this.#maxCoC = value;
        this.updateUniform('maxCoC', value);
    }

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
    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult,
        cocTextureInfo: IPostEffectResult,
        bgBokehTextureInfo: IPostEffectResult,
        fgBokehTextureInfo: IPostEffectResult,
        focusTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, cocTextureInfo, bgBokehTextureInfo, fgBokehTextureInfo, focusTextureInfo);
    }
}

Object.freeze(DOFComposite);
export default DOFComposite;
