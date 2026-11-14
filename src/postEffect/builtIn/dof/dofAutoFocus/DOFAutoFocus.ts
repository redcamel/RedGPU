import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import DOF_CONFIG from "../DOF_CONFIG";
import dofOpticsCommon from "../wgsl/dofOpticsCommon.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 화면 깊이 버퍼(`depthTexture`)의 9-Point Zone AF 다중 측거점과 지수 감쇠 보간(EMA)을 통해 CPU Readback 없이 GPU 내부에서 유효 초점 거리를 산출하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that computes effective focus distance inside the GPU without CPU readback via 9-Point Zone AF multi-point metering on `depthTexture` and Exponential Moving Average (EMA) damping.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFAutoFocus extends ASingleComputePassPostEffect {
    #focusDistance: number = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
    #historyMode: number = DOF_CONFIG.AF_HISTORY_MODE.NONE;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 1, workSizeY: 1, workSizeZ: 1});
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_AUTO_FOCUS',
            createBasicComputePassPostEffectCode(
                this,
                computeCode,
                `${uniformStructCode}\n${dofOpticsCommon}`,
                [
                    {name: 'prevFocusTexture'}
                ]
            )
        );
    }

    /**
     * [KO] 수동 초점 거리를 반환합니다.
     * [EN] Returns the manual focus distance.
     *
     * @returns
     * [KO] 수동 초점 거리
     * [EN] Manual focus distance
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
     * [KO] 자동 초점 히스토리 모드를 반환합니다.
     * [EN] Returns the autofocus history mode.
     *
     * @returns
     * [KO] 자동 초점 히스토리 모드
     * [EN] Autofocus history mode
     */
    get historyMode(): number {
        return this.#historyMode;
    }

    set historyMode(value: number) {
        validateUintRange(value, DOF_CONFIG.AF_HISTORY_MODE.NONE, DOF_CONFIG.AF_HISTORY_MODE.SEED_MANUAL);
        if (this.#historyMode === value) return;
        this.#historyMode = value;
        this.updateUniform('historyMode', value);
    }
}

Object.freeze(DOFAutoFocus);
export default DOFAutoFocus;
