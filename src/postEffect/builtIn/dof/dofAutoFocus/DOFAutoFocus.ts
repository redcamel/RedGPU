import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 화면 깊이 버퍼(`depthTexture`)의 9-Point Zone AF 다중 측거점과 지수 감쇠 보간(EMA)을 통해 CPU Readback 없이 GPU 내부에서 유효 초점 거리를 산출하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that computes effective focus distance inside the GPU without CPU readback via 9-Point Zone AF multi-point metering on `depthTexture` and Exponential Moving Average (EMA) damping.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFAutoFocus extends ASinglePassPostEffect {
    #focusDistance: number = 15.0;
    #deltaTime: number = 0.0166;
    #useAutoFocus: number = 0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 1, workSizeY: 1, workSizeZ: 1});
        const {msaa, nonMsaa} = createBasicPostEffectCode(
            this,
            computeCode,
            uniformStructCode,
            [
                {name: 'prevFocusTexture'}
            ]
        );
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_AUTO_FOCUS',
            {msaa, nonMsaa}
        );
        this.focusDistance = this.#focusDistance;
        this.deltaTime = this.#deltaTime;
        this.useAutoFocus = this.#useAutoFocus;
    }

    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, 0.1, 10000);
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }

    get deltaTime(): number {
        return this.#deltaTime;
    }

    set deltaTime(value: number) {
        this.#deltaTime = value;
        this.updateUniform('deltaTime', value);
    }

    get useAutoFocus(): number {
        return this.#useAutoFocus;
    }

    set useAutoFocus(value: number) {
        validateUintRange(value, 0, 1);
        this.#useAutoFocus = value;
        this.updateUniform('useAutoFocus', value);
    }

    render(
        view: View3D,
        width: number,
        height: number,
        prevFocusTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, prevFocusTextureInfo);
    }
}

Object.freeze(DOFAutoFocus);
export default DOFAutoFocus;
