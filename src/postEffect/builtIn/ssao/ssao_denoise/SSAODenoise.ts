import RedGPUContext from "../../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] 패킹된 GTAO 데이터(`visibility`, `linearDepth`, `octNormal`)를 이용해 깊이 및 법선 경계를 보존하며 노이즈를 제거하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that denoises GTAO while preserving depth and normal edges using packed GTAO data (`visibility`, `linearDepth`, `octNormal`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [SSAO example](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
 * @category PostEffect
 */
class SSAODenoise extends ASingleComputePassPostEffect {
    /**
     * [KO] SSAODenoise 인스턴스를 생성합니다.
     * [EN] Creates an SSAODenoise instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: false});
        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO_DENOISE',
            createBasicComputePassPostEffectCode(this, computeCode)
        );
    }
}

Object.freeze(SSAODenoise);
export default SSAODenoise;
