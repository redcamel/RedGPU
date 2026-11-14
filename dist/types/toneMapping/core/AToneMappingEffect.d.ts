import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import { IPostEffectResult } from "../../postEffect/core/types";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
interface AToneMappingEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean;
    /**
     * [KO] 대비(Contrast) 값입니다. (기본값: 1.0, 범위: 0.5 ~ 20.0)
     * [EN] Contrast value. (Default: 1.0, Range: 0.5 ~ 20.0)
     */
    contrast: number;
    /**
     * [KO] 밝기(Brightness) 오프셋 값입니다. (기본값: 0.0, 범위: -1.0 ~ 1.0)
     * [EN] Brightness offset value. (Default: 0.0, Range: -1.0 ~ 1.0)
     */
    brightness: number;
}
/**
 * [KO] 모든 톤 매핑 이펙트의 기반이 되며, HDR(`rgba16float`) 입력을 LDR(`rgba8unorm`) 렌더 타겟으로 변환하는 Out-of-Place 렌더 패스 추상 클래스입니다.
 * [EN] Abstract base class for all tone mapping effects, converting HDR (`rgba16float`) input to an LDR (`rgba8unorm`) render target via an Out-of-Place render pass.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category ToneMapping
 */
declare abstract class AToneMappingEffect extends RedGPUObject {
    #private;
    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다. (하위 클래스 전용)
     * [EN] Creates an AToneMappingEffect instance. (Subclasses only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space.
     *
     * @defaultValue true
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean;
    /**
     * [KO] 이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the video memory usage (in bytes) of the effect's dedicated buffer.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 이펙트 전용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the effect-specific uniform buffer.
     *
     * @returns
     * [KO] `UniformBuffer` 인스턴스
     * [EN] `UniformBuffer` instance
     */
    get uniformBuffer(): UniformBuffer;
    /**
     * [KO] 이펙트 전용 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the effect-specific uniform struct information.
     *
     * @returns
     * [KO] 유니폼 구조체 정보
     * [EN] Uniform struct information
     */
    get uniformsInfo(): any;
    /**
     * [KO] 현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the output texture view allocated to the current pass.
     *
     * @returns
     * [KO] 출력 `GPUTextureView`
     * [EN] Output `GPUTextureView`
     */
    get outputTextureView(): GPUTextureView;
    /**
     * [KO] 톤 매핑 렌더 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating the tone mapping render shader module and uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param code -
     * [KO] 프래그먼트 본문 WGSL 코드
     * [EN] Fragment body WGSL code
     * @param uniformStruct -
     * [KO] 유니폼 구조체 및 헬퍼 함수 WGSL 코드
     * [EN] Uniform struct and helper function WGSL code
     */
    init(redGPUContext: RedGPUContext, name: string, code: string, uniformStruct?: string): void;
    /**
     * [KO] 지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.
     * [EN] Writes the value of the specified uniform member to the uniform buffer.
     *
     * @param key -
     * [KO] 유니폼 멤버 키 이름
     * [EN] Uniform member key name
     * @param value -
     * [KO] 기록할 값
     * [EN] Value to write
     */
    updateUniform(key: string, value: number | number[] | boolean): void;
    /**
     * [KO] HDR 입력 텍스처를 톤 매핑하여 LDR(`rgba8unorm`) 렌더 타겟에 기록하고 결과를 반환합니다.
     * [EN] Tone-maps the HDR input texture into an LDR (`rgba8unorm`) render target and returns the result.
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
     * [KO] 입력 HDR 소스 텍스처 정보
     * [EN] Input HDR source texture information
     * @returns
     * [KO] 톤 매핑된 LDR 렌더링 결과 (`IPostEffectResult`)
     * [EN] Tone-mapped LDR rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
    /**
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear(): void;
    /**
     * [KO] 이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.
     * [EN] Destroys the effect's uniform buffer and cached resources.
     */
    destroy(): void;
}
export default AToneMappingEffect;
