import ColorRGB from "../../../color/ColorRGB";
import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import defineColorRGB from "../../../defineProperty/funcs/color/defineColorRGB";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";
import defineUint from "../../../defineProperty/funcs/number/defineUint";
import ASingleRenderPassPostEffect from "../../core/ASingleRenderPassPostEffect";
import createBasicRenderPassPostEffectCode from "../../core/createBasicRenderPassPostEffectCode";
import {IPostEffectResult} from "../../core/types";
import fragmentCode from "./wgsl/fragmentCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface Fog {
    /**
     * [KO] 안개 밀도 (0 ~ 1)
     * [EN] Fog density (0 ~ 1)
     * @defaultValue 0.03
     */
    density: number;
    /**
     * [KO] 안개 시작 거리 (0 이상)
     * [EN] Fog start distance from camera (0 or greater)
     * @defaultValue 5.0
     */
    nearDistance: number;
    /**
     * [KO] 안개 최대 밀도 도달 거리 (0.1 이상)
     * [EN] Fog maximum density distance (0.1 or greater)
     * @defaultValue 50
     */
    farDistance: number;
    /**
     * [KO] 안개 최대 불투명도 상한 (0 ~ 1)
     * [EN] Maximum opacity cap of fog (0 ~ 1)
     * @defaultValue 1
     */
    maxOpacity: number;
    /**
     * [KO] 안개 계산 방식 (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1)
     * [EN] Fog calculation type (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1)
     * @defaultValue 0
     */
    fogType: number;
    /**
     * [KO] 안개 색상 객체 (`ColorRGB`)
     * [EN] Fog color object (`ColorRGB`)
     * @defaultValue '#c8d2ff'
     */
    fogColor: ColorRGB;
}

/**
 * [KO] 깊이 정보를 기반으로 선형 HDR 공간에서 원거리 물체를 안개 색상과 합성하는 거리 기반 안개 내장(Built-in) 후처리 이펙트입니다.
 * [EN] Distance-based Fog built-in post-processing effect that blends distant objects with fog color in Linear HDR space based on depth information.
 *
 * ::: warning
 * [KO] 이 클래스는 `BuiltInEffectManager`에 의해 내부적으로 자동 생성됩니다.<br/>`'new'` 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created internally by `BuiltInEffectManager`.<br/>Do not create an instance directly using the `'new'` keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * view.builtInEffectManager.useFog = true;
 * const fog = view.builtInEffectManager.fog;
 * fog.fogType = RedGPU.PostEffect.BuiltIn.Fog.EXPONENTIAL_SQUARED;
 * fog.density = 0.03;
 * fog.nearDistance = 5.0;
 * fog.farDistance = 40.0;
 * fog.fogColor.setColorByRGB(200, 210, 255);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/fog/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Fog example](/RedGPU/examples/postEffect/fog/fog/)
 * @category PostEffect
 */
class Fog extends ASingleRenderPassPostEffect {
    /**
     * [KO] 지수(Exponential) 안개 타입 (`0`)
     * [EN] Exponential fog type (`0`)
     */
    static EXPONENTIAL = 0;
    /**
     * [KO] 지수제곱(Exponential Squared) 안개 타입 (`1`)
     * [EN] Exponential Squared fog type (`1`)
     */
    static EXPONENTIAL_SQUARED = 1;

    /**
     * [KO] Fog 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a Fog instance. (Internal system use only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {
            isLdr: false,
            blendState: {
                color: {
                    srcFactor: 'src-alpha',
                    dstFactor: 'one-minus-src-alpha',
                    operation: 'add'
                },
                alpha: {
                    srcFactor: 'zero',
                    dstFactor: 'one',
                    operation: 'add'
                }
            }
        });
        this.init(
            redGPUContext,
            'POST_EFFECT_FOG',
            createBasicRenderPassPostEffectCode(fragmentCode, uniformStructCode)
        );
    }

    /**
     * [KO] 거리 기반 안개 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the distance-based fog post-processing effect.
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
        if (this.density <= 0 || this.maxOpacity <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

definePositiveNumber(Fog, [
    {key: 'density', value: 0.03, min: 0, max: 1},
    {key: 'maxOpacity', value: 1, min: 0, max: 1},
]);
defineNumber(Fog, [
    {key: 'nearDistance', value: 5.0, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
]);
defineUint(Fog, [
    {key: 'fogType', value: Fog.EXPONENTIAL, max: 1}
]);
defineColorRGB(Fog, [
    {key: 'fogColor', value: '#c8d2ff'},
]);
Object.freeze(Fog);
export default Fog;
