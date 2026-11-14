import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import { IPostEffectResult } from "./types";
interface ASingleRenderPassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean;
}
/**
 * [KO] 기존 컬러 버퍼 위에 단일 In-Place 렌더 패스(Full-Screen Triangle + Fragment Shader + ROP 하드웨어 블렌딩)로 직접 합성하는 후처리 이펙트의 추상 기본 클래스입니다.
 * [EN] Abstract base class for post-processing effects that composite directly onto the existing color buffer in a single In-Place render pass (Full-Screen Triangle + Fragment Shader + ROP hardware blending).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare abstract class ASingleRenderPassPostEffect extends RedGPUObject {
    #private;
    /**
     * [KO] ASingleRenderPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASingleRenderPassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 초기화 옵션 (`isLdr`, `blendState`)
     * [EN] Initialization options (`isLdr`, `blendState`)
     */
    protected constructor(redGPUContext: RedGPUContext, options?: {
        isLdr?: boolean;
        blendState?: GPUBlendState;
    });
    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.
     *
     * @defaultValue false
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean;
    /**
     * [KO] 렌더 파이프라인의 하드웨어 블렌딩 상태(`GPUBlendState`)를 반환합니다.
     * [EN] Returns the hardware blend state (`GPUBlendState`) of the render pipeline.
     *
     * @returns
     * [KO] 하드웨어 블렌딩 상태
     * [EN] Hardware blend state
     */
    get blendState(): GPUBlendState;
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
     * [KO] WGSL 셰이더 파싱 정보를 반환합니다.
     * [EN] Returns the WGSL shader parsing information.
     *
     * @returns
     * [KO] WGSL 셰이더 파싱 정보
     * [EN] WGSL shader parsing information
     */
    get shaderInfo(): any;
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
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear(): void;
    /**
     * [KO] 이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.
     * [EN] Destroys the effect's uniform buffer and cached resources.
     */
    destroy(): void;
    /**
     * [KO] 렌더 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating the render shader module and the uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param shaderCode -
     * [KO] 렌더 셰이더 WGSL 코드 문자열
     * [EN] Render shader WGSL code string
     */
    init(redGPUContext: RedGPUContext, name: string, shaderCode: string): void;
    /**
     * [KO] 입력 컬러 버퍼 위에 In-Place 렌더 패스를 실행하고 결과 텍스처 정보를 반환합니다.
     * [EN] Executes the In-Place render pass onto the input color buffer and returns the result texture information.
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
     * [KO] 입력 소스 텍스처 정보 목록 (`sourceTextureInfo[0]`은 합성 대상 컬러 버퍼, 이후 항목은 보조 샘플링 텍스처)
     * [EN] List of input source texture information (`sourceTextureInfo[0]` is the target color buffer, subsequent items are auxiliary sampled textures)
     * @returns
     * [KO] 렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Rendering result texture and view (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult;
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
}
export default ASingleRenderPassPostEffect;
