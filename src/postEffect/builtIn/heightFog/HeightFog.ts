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

interface HeightFog {
    /**
     * [KO] 안개 밀도 (0 ~ 5)
     * [EN] Fog density (0 ~ 5)
     * @defaultValue 0.02
     */
    density: number;
    /**
     * [KO] 안개 기준 높이 (월드 Y 좌표)
     * [EN] Base height of fog (world Y coordinate)
     * @defaultValue 0
     */
    baseHeight: number;
    /**
     * [KO] 기준 높이(`baseHeight`)로부터 안개가 피어오르는 높이(두께, 0.1 이상)
     * [EN] Height (thickness) of fog rising from `baseHeight` (0.1 or greater)
     * @defaultValue 20
     */
    height: number;
    /**
     * [KO] 안개 시작 거리 (0 이상)
     * [EN] Fog start distance from camera (0 or greater)
     * @defaultValue 0
     */
    nearDistance: number;
    /**
     * [KO] 안개 최대 적분 거리 (0.1 이상)
     * [EN] Fog maximum integration distance (0.1 or greater)
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
     * [KO] 안개 계산 방식 (`HeightFog.EXPONENTIAL`: 0, `HeightFog.EXPONENTIAL_SQUARED`: 1)
     * [EN] Fog calculation type (`HeightFog.EXPONENTIAL`: 0, `HeightFog.EXPONENTIAL_SQUARED`: 1)
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
 * [KO] 3D 광선-고도 해석적 선적분(Analytical Ray-Height Line Integral)을 기반으로 선형 HDR 공간에서 고도별 안개를 시뮬레이션하는 내장(Built-in) 후처리 이펙트입니다.
 * [EN] Height-based Fog built-in post-processing effect that simulates altitude-dependent fog in Linear HDR space using an Analytical 3D Ray-Height Line Integral.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 HeightFog 활성화 및 고도/거리 파라미터 설정
 * // [EN] Enable HeightFog and configure altitude/distance parameters through View3D's builtInEffectManager
 * view.builtInEffectManager.useHeightFog = true;
 * const heightFog = view.builtInEffectManager.heightFog;
 * heightFog.fogType = RedGPU.PostEffect.BuiltIn.HeightFog.EXPONENTIAL;
 * heightFog.density = 0.02;
 * heightFog.baseHeight = 0.0;
 * heightFog.height = 20.0;
 * heightFog.nearDistance = 0.0;
 * heightFog.farDistance = 50.0;
 * heightFog.fogColor.setColorByRGB(200, 210, 255);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/fog/heightFog/" style="width:100%; height:500px;"></iframe>
 *
 * @see [HeightFog example](/RedGPU/examples/postEffect/builtIn/fog/heightFog/)
 * @category PostEffect
 */
class HeightFog extends ASingleRenderPassPostEffect {
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
     * [KO] HeightFog 인스턴스를 생성합니다.
     * [EN] Creates a HeightFog instance.
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
            'POST_EFFECT_HEIGHT_FOG',
            createBasicRenderPassPostEffectCode(fragmentCode, uniformStructCode)
        );
    }

    /**
     * [KO] 고도별 안개 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the height-based fog post-processing effect.
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

definePositiveNumber(HeightFog, [
    {key: 'density', value: 0.02, min: 0, max: 5},
    {key: 'height', value: 20, min: 0.1},
    {key: 'maxOpacity', value: 1, min: 0, max: 1},
]);
defineNumber(HeightFog, [
    {key: 'baseHeight', value: 0},
    {key: 'nearDistance', value: 0, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
]);
defineUint(HeightFog, [
    {key: 'fogType', value: HeightFog.EXPONENTIAL, max: 1},
]);
defineColorRGB(HeightFog, [
    {key: 'fogColor', value: '#c8d2ff'},
]);
Object.freeze(HeightFog);
export default HeightFog;
