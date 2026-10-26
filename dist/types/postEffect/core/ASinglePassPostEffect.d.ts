import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import { IPostEffectResult } from "./types";
import RedGPUObject from "../../base/RedGPUObject";
interface ASinglePassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean;
}
/**
 * [KO] 단일 컴퓨트 패스(Compute Pass)로 동작하는 후처리 이펙트의 추상 기본 클래스입니다.
 * [EN] Abstract base class for post-processing effects that execute in a single compute pass.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare abstract class ASinglePassPostEffect extends RedGPUObject {
    #private;
    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 초기화 옵션 (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`)
     * [EN] Initialization options (`workSizeX`, `workSizeY`, `workSizeZ`, `isLdr`)
     */
    protected constructor(redGPUContext: RedGPUContext, options?: {
        workSizeX?: number;
        workSizeY?: number;
        workSizeZ?: number;
        isLdr?: boolean;
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
     * [KO] 이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the video memory usage (in bytes) of the effect's dedicated buffer.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number;
    /**
     * [KO] 파싱된 셰이더의 스토리지 바인딩 구조 정보를 반환합니다.
     * [EN] Returns the parsed shader's storage binding structure information.
     *
     * @returns
     * [KO] 스토리지 바인딩 구조 정보
     * [EN] Storage binding structure information
     */
    get storageInfo(): any;
    /**
     * [KO] 현재 MSAA 상태에 대응하는 WGSL 셰이더 파싱 정보를 반환합니다.
     * [EN] Returns the WGSL shader parsing information corresponding to the current MSAA state.
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
     * [KO] 시스템 공용 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the system common uniform struct information.
     *
     * @returns
     * [KO] 시스템 유니폼 구조체 정보
     * [EN] System uniform struct information
     */
    get systemUniformsInfo(): any;
    /**
     * [KO] 컴퓨트 워크그룹 X축 크기를 반환합니다.
     * [EN] Returns the compute workgroup X-axis size.
     *
     * @defaultValue 16
     * @returns
     * [KO] 워크그룹 X 크기
     * [EN] Workgroup X size
     */
    get WORK_SIZE_X(): number;
    /**
     * [KO] 컴퓨트 워크그룹 Y축 크기를 반환합니다.
     * [EN] Returns the compute workgroup Y-axis size.
     *
     * @defaultValue 16
     * @returns
     * [KO] 워크그룹 Y 크기
     * [EN] Workgroup Y size
     */
    get WORK_SIZE_Y(): number;
    /**
     * [KO] 컴퓨트 워크그룹 Z축 크기를 반환합니다.
     * [EN] Returns the compute workgroup Z-axis size.
     *
     * @defaultValue 1
     * @returns
     * [KO] 워크그룹 Z 크기
     * [EN] Workgroup Z size
     */
    get WORK_SIZE_Z(): number;
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
     * [KO] MSAA/Non-MSAA 컴퓨트 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating MSAA/Non-MSAA compute shader modules and the uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param computeCodes -
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드 객체
     * [EN] Compute shader code object for MSAA and Non-MSAA
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string;
        nonMsaa: string;
    }): void;
    /**
     * [KO] 텍스처 풀에서 출력 텍스처를 할당받아 컴퓨트 패스를 실행하고 결과 텍스처 정보를 반환합니다.
     * [EN] Allocates an output texture from the texture pool, executes the compute pass, and returns the result texture information.
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
     * [KO] 입력 소스 텍스처 정보 목록
     * [EN] List of input source texture information
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
export default ASinglePassPostEffect;
