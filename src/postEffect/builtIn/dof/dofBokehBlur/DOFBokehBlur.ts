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
 * [KO] `Mip 0 ~ Mip 2` 적응형 샘플링과 조리개 날 꼭짓점 간 직선 선형 보간(`mix(V0, V1, t)`) 커널로 배경(`passMode = 0`) 및 전경(`passMode = 1`) 보케를 독립 개더링하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently gathers background (`passMode = 0`) and foreground (`passMode = 1`) bokeh using `Mip 0 ~ Mip 2` adaptive sampling and blade-vertex linear interpolation (`mix(V0, V1, t)`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFBokehBlur extends ASingleComputePassPostEffect {
    #bokehBrightness: number = DOF_CONFIG.DEFAULT_BOKEH_BRIGHTNESS;
    #bladeCount: number = DOF_CONFIG.DEFAULT_BLADE_COUNT;
    #passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND;

    constructor(redGPUContext: RedGPUContext, passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND) {
        super(redGPUContext, {workSizeX: 16, workSizeY: 16, workSizeZ: 1});
        this.#passMode = passMode;
        this.init(
            redGPUContext,
            `POST_EFFECT_DOF_BOKEH_BLUR_MODE_${passMode}`,
            createBasicComputePassPostEffectCode(
                this,
                computeCode,
                `${dofOpticsCommon}\n${uniformStructCode}`,
                [
                    {name: 'cocMip0Texture'},
                    {name: 'cocMip1Texture'},
                    {name: 'cocMip2Texture'},
                    {name: 'tileMaxTexture'}
                ],
                false
            )
        );
    }

    /**
     * [KO] 보케 하이라이트 부스트 배율을 반환합니다.
     * [EN] Returns the bokeh highlight boost multiplier.
     *
     * @returns
     * [KO] 보케 하이라이트 부스트 배율
     * [EN] Bokeh highlight boost multiplier
     */
    get bokehBrightness(): number {
        return this.#bokehBrightness;
    }

    set bokehBrightness(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_BOKEH_BRIGHTNESS, DOF_CONFIG.MAX_BOKEH_BRIGHTNESS);
        if (this.#bokehBrightness === value) return;
        this.#bokehBrightness = value;
        this.updateUniform('bokehBrightness', value);
    }

    /**
     * [KO] 조리개 날 개수를 반환합니다.
     * [EN] Returns the number of aperture blades.
     *
     * @returns
     * [KO] 조리개 날 개수
     * [EN] Number of aperture blades
     */
    get bladeCount(): number {
        return this.#bladeCount;
    }

    set bladeCount(value: number) {
        validateUintRange(value, DOF_CONFIG.MIN_BLADE_COUNT, DOF_CONFIG.MAX_BLADE_COUNT);
        if (this.#bladeCount === value) return;
        this.#bladeCount = value;
        this.updateUniform('bladeCount', value);
    }

    /**
     * [KO] 패스 모드(`0`: 배경 보케, `1`: 전경 보케)를 반환합니다.
     * [EN] Returns the pass mode (`0`: background bokeh, `1`: foreground bokeh).
     *
     * @returns
     * [KO] 패스 모드
     * [EN] Pass mode
     */
    get passMode(): number {
        return this.#passMode;
    }

    /**
     * [KO] 다중 해상도 CoC 밉맵과 타일 최대 CoC 정보를 기반으로 보케 블러를 렌더링합니다.
     * [EN] Renders bokeh blur based on multi-resolution CoC mipmaps and tile maximum CoC information.
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
     * @param cocMip0Info -
     * [KO] `1/2` 해상도 CoC 텍스처 정보 (`Mip 0`)
     * [EN] `1/2` resolution CoC texture information (`Mip 0`)
     * @param cocMip1Info -
     * [KO] `1/4` 해상도 CoC 텍스처 정보 (`Mip 1`)
     * [EN] `1/4` resolution CoC texture information (`Mip 1`)
     * @param cocMip2Info -
     * [KO] `1/8` 해상도 CoC 텍스처 정보 (`Mip 2`)
     * [EN] `1/8` resolution CoC texture information (`Mip 2`)
     * @param tileMaxTextureInfo -
     * [KO] 타일별 최대 CoC 텍스처 정보
     * [EN] Per-tile maximum CoC texture information
     * @returns
     * [KO] 렌더링된 보케 블러 텍스처 정보 (`IPostEffectResult`)
     * [EN] Rendered bokeh blur texture information (`IPostEffectResult`)
     */
    render(
        view: View3D,
        width: number,
        height: number,
        cocMip0Info: IPostEffectResult,
        cocMip1Info: IPostEffectResult,
        cocMip2Info: IPostEffectResult,
        tileMaxTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, cocMip0Info, cocMip1Info, cocMip2Info, tileMaxTextureInfo);
    }
}

Object.freeze(DOFBokehBlur);
export default DOFBokehBlur;
