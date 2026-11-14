import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import { IPostEffectResult } from "../../core/types";
/**
 * [KO] 35mm 풀프레임 센서(`sensorSize = 24mm`) 기하광학 Thin-Lens 착란원(CoC), CoC-Aware 양방향 3단 밉체인(`Mip 0 ~ Mip 2`), 타일 최대 착란원 확장(`DOFTileMaxCoC`), 전/배경 Dual-Buffer 분리 정다각형 개더링, 및 풀해상도 Slight Out-of-Focus 8-Tap 직접 개더링·Recombine 기반의 차세대 물리 보케 피사계 심도(Physical Bokeh Depth of Field) 후처리 이펙트입니다.
 * [EN] Next-generation Physical Bokeh Depth of Field (DOF) post-processing effect featuring 35mm full-frame sensor (`sensorSize = 24mm`) geometric Thin-Lens Circle of Confusion (CoC), CoC-Aware bilateral 3-level mip chain (`Mip 0 ~ Mip 2`), dilated Tile Max CoC (`DOFTileMaxCoC`), foreground/background Dual-Buffer polygonal gathering, and full-resolution Slight Out-of-Focus 8-Tap direct gathering & Recombine.
 *
 * [KO] `View3D`의 `builtInEffectManager.useDOF`를 `true`로 설정하여 시스템 내부에서 자동 활성화하며, `view.builtInEffectManager.dof`를 통해 카메라 렌즈 파라미터 및 프리셋을 제어합니다.
 * [EN] Automatically activated by the system when setting `builtInEffectManager.useDOF` of `View3D` to `true`, and camera lens parameters and presets are controlled via `view.builtInEffectManager.dof`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 DOF 활성화 및 프리셋 적용
 * // [EN] Enable DOF and apply a preset through View3D's builtInEffectManager
 * view.builtInEffectManager.useDOF = true;
 * view.builtInEffectManager.dof.setCinematic();
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/dof/"></iframe>
 *
 * @see [DOF example](/RedGPU/examples/postEffect/builtIn/lens/dof/)
 * @see [DOF Auto Focus example](/RedGPU/examples/postEffect/builtIn/lens/dofAutoFocus/)
 * @category PostEffect
 */
declare class DOF extends AMultiPassPostEffect {
    #private;
    /**
     * [KO] `DOF` 인스턴스를 생성합니다.
     * [EN] Creates a `DOF` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 모든 내부 서브패스 및 영구 초점·착란원 히스토리 텍스처의 총 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the total video memory usage (in bytes) of all internal sub-passes and persistent focus/CoC history textures.
     *
     * @returns
     * [KO] 총 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Total video memory usage (in bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 초점이 맺히는 피사체 거리 $S_1$을 반환하거나 설정합니다. (단위: 월드 미터 `m`, 허용 범위: `0.1 ~ 10000`, 기본값: `10.0`)
     * [EN] Gets or sets the in-focus subject distance $S_1$. (Unit: world meters `m`, valid range: `0.1 ~ 10000`, default: `10.0`)
     *
     * @defaultValue 10.0
     * @returns
     * [KO] 피사체 초점 거리 (`m`)
     * [EN] Subject focus distance (`m`)
     */
    get focusDistance(): number;
    set focusDistance(value: number);
    /**
     * [KO] 조리개 F-값($N$, F-number)을 반환하거나 설정합니다. 낮을수록(`f/1.4`) 심도가 얕아지고 보케가 커지며, 높을수록(`f/8.0`) 전 영역이 선명해집니다. (`0.5 ~ 32.0`, 기본값: `2.0`)
     * [EN] Gets or sets the aperture F-number ($N$). Lower values (`f/1.4`) produce shallower depth of field and larger bokeh; higher values (`f/8.0`) keep the entire scene sharp. (`0.5 ~ 32.0`, default: `2.0`)
     *
     * @defaultValue 2.0
     * @returns
     * [KO] 조리개 F-값
     * [EN] Aperture F-number
     */
    get aperture(): number;
    set aperture(value: number);
    /**
     * [KO] 렌즈 초점 거리 $f$(단위: `mm`)를 반환하거나 설정합니다. 망원(`85mm ~ 135mm`)일수록 배경 압축과 보케 크기가 증가합니다. (`12.0 ~ 300.0`, 기본값: `65.0`)
     * [EN] Gets or sets the lens focal length $f$ (in `mm`). Longer telephoto focal lengths (`85mm ~ 135mm`) increase background compression and bokeh size. (`12.0 ~ 300.0`, default: `65.0`)
     *
     * @defaultValue 65.0
     * @returns
     * [KO] 렌즈 초점 거리 (`mm`)
     * [EN] Lens focal length (`mm`)
     */
    get focalLength(): number;
    set focalLength(value: number);
    /**
     * [KO] 조리개 날 개수(`0 ~ 9`)를 반환하거나 설정합니다. `0 ~ 2`는 완전 원형 보케, `3 ~ 9`는 정다각형 조리개 보케를 생성합니다. (기본값: `6`)
     * [EN] Gets or sets the aperture blade count (`0 ~ 9`). `0 ~ 2` produces circular bokeh; `3 ~ 9` produces regular polygonal aperture bokeh. (Default: `6`)
     *
     * @defaultValue 6
     * @returns
     * [KO] 조리개 날 개수
     * [EN] Aperture blade count
     */
    get bladeCount(): number;
    set bladeCount(value: number);
    /**
     * [KO] 고휘도 HDR 하이라이트 보케 디스크 강조 강도를 반환하거나 설정합니다. (`0.0 ~ 5.0`, 기본값: `1.5`)
     * [EN] Gets or sets the high-luminance HDR highlight bokeh disc boost intensity. (`0.0 ~ 5.0`, default: `1.5`)
     *
     * @defaultValue 1.5
     * @returns
     * [KO] 보케 하이라이트 강조 강도
     * [EN] Bokeh highlight boost intensity
     */
    get bokehBrightness(): number;
    set bokehBrightness(value: number);
    /**
     * [KO] 화면 깊이 버퍼 기반 9-Point Zone 연속 자동 초점(AF-C) 활성화 여부를 반환하거나 설정합니다. (기본값: `false`)
     * [EN] Gets or sets whether screen-depth-based 9-Point Zone continuous auto-focus (AF-C) is enabled. (Default: `false`)
     *
     * @defaultValue false
     * @returns
     * [KO] 자동 초점 활성화 여부
     * [EN] Whether auto-focus is enabled
     */
    get useAutoFocus(): boolean;
    set useAutoFocus(value: boolean);
    /**
     * [KO] 할당된 영구 초점·착란원 히스토리 텍스처 및 내부 서브패스의 바인드 그룹 캐시를 모두 정리합니다.
     * [EN] Clears allocated persistent focus/CoC history textures and bind group caches of all internal sub-passes.
     */
    clear(): void;
    /**
     * [KO] 내부 서브패스 및 영구 초점·착란원 상태 텍스처 리소스를 영구 파기합니다.
     * [EN] Permanently destroys internal sub-passes and persistent focus/CoC state texture resources.
     */
    destroy(): void;
    /**
     * [KO] 표준 게임 카메라(`65mm f/2.0`, 6날 조리개) 기본 프리셋을 적용합니다.
     * [EN] Applies the standard game camera (`65mm f/2.0`, 6-blade aperture) default preset.
     */
    setGameDefault(): void;
    /**
     * [KO] 대구경 시네마 프라임 렌즈 스타일의 시네마틱(`85mm f/1.4`, 8날 조리개) 프리셋을 적용합니다.
     * [EN] Applies a fast cinema prime lens Cinematic (`85mm f/1.4`, 8-blade aperture) preset.
     */
    setCinematic(): void;
    /**
     * [KO] 원형 조리개 기반의 인물 사진(`85mm f/1.4`, 원형 보케) 프리셋을 적용합니다.
     * [EN] Applies a circular-aperture Portrait (`85mm f/1.4`, circular bokeh) preset.
     */
    setPortrait(): void;
    /**
     * [KO] 깊은 피사계 심도를 제공하는 광각 풍경 사진(`24mm f/8.0`) 프리셋을 적용합니다.
     * [EN] Applies a wide-angle Landscape (`24mm f/8.0`) preset providing deep depth of field.
     */
    setLandscape(): void;
    /**
     * [KO] 근접 피사체에 초점을 맞추고 배경을 부드럽게 날리는 매크로(`105mm f/2.0`, 원형 보케) 프리셋을 적용합니다.
     * [EN] Applies a close-up Macro (`105mm f/2.0`, circular bokeh) preset that focuses on near subjects and smoothly blurs the background.
     */
    setMacro(): void;
    /**
     * [KO] 망원 액션 및 스포츠 촬영(`135mm f/2.8`) 프리셋을 적용합니다.
     * [EN] Applies a telephoto Action/Sports (`135mm f/2.8`) preset.
     */
    setSports(): void;
    /**
     * [KO] 야간 하이라이트 보케 디스크를 극대화하는 야간 촬영(`75mm f/1.2`, 6날 정육각 보케) 프리셋을 적용합니다.
     * [EN] Applies a Night Mode (`75mm f/1.2`, 6-blade hexagonal bokeh) preset that maximizes nocturnal highlight bokeh discs.
     */
    setNightMode(): void;
    /**
     * [KO] 3단 CoC 밉체인(`Mip 0 ~ Mip 2`), `1/16` 타일 확장, 전/배경 Dual-Buffer 정다각형 보케 개더링, 전/배경 독립 9-Tap Tent 스무딩, 및 풀해상도 Slight-DoF 8-Tap 직접 개더링·Recombine 패스를 순차 실행합니다.
     * [EN] Sequentially executes the 3-level CoC mip chain (`Mip 0 ~ Mip 2`), `1/16` tile dilation, foreground/background Dual-Buffer polygonal bokeh gathering, independent foreground/background 9-Tap Tent smoothing, and full-resolution Slight-DoF 8-Tap direct gathering & Recombine.
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
     * [KO] 입력 원본 HDR 소스 텍스처 정보
     * [EN] Input original HDR source texture information
     * @returns
     * [KO] DOF 처리된 최종 HDR 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Final DOF-processed HDR texture information (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default DOF;
