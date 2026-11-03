import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";


interface LensDistortion {
    /**
     * [KO] 왜곡 강도 (-1.0 ~ 1.0, 양수: 배럴 왜곡, 음수: 핀쿠션 왜곡)
     * [EN] Distortion strength (-1.0 ~ 1.0, positive: barrel distortion, negative: pincushion distortion)
     * @defaultValue 0.2
     */
    distortion: number;
}

/**
 * [KO] 실제 카메라 구면 렌즈의 광학 축(화면 정중앙)을 기준으로 배럴(볼록) 또는 핀쿠션(오목) 정원형 렌즈 왜곡과 자동 오버스캔(Auto-Overscan)을 시뮬레이션하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that simulates circular spherical barrel (convex) or pincushion (concave) lens distortion with auto-overscan relative to the physical optical center.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 LensDistortion 활성화 및 설정
 * // [EN] Enable and configure LensDistortion through View3D's builtInEffectManager
 * view.builtInEffectManager.useLensDistortion = true;
 * view.builtInEffectManager.lensDistortion.distortion = 0.2;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/lensDistortion/" style="width:100%; height:500px;"></iframe>
 *
 * @see [LensDistortion example](/RedGPU/examples/postEffect/lens/lensDistortion/)
 * @category PostEffect
 */
class LensDistortion extends ASinglePassPostEffect {
    /**
     * [KO] LensDistortion 인스턴스를 생성합니다.
     * [EN] Creates a LensDistortion instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_LENS_DISTORTION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    /**
     * [KO] 렌즈 왜곡 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the lens distortion post-processing effect.
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
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 렌더링 결과 (`IPostEffectResult`)
     * [EN] Rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (Math.abs(this.distortion) <= 1e-6) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

defineNumber(LensDistortion, [
    {key: 'distortion', value: 0.2, min: -1, max: 1},
]);
Object.freeze(LensDistortion);
export default LensDistortion;
