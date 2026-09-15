import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import { IPostEffectResult } from "./types";
import RedGPUObject from "../../base/RedGPUObject";
interface ASinglePassPostEffect {
    isInstanceofPostEffect: boolean;
}
/**
 * [KO] 단일 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for single-pass post-processing effects.
 *
 * [KO] 한 번의 컴퓨트(Compute) 패스로 동작하는 후처리 이펙트의 기반 클래스입니다.
 * [EN] Base class for post-processing effects that operate in a single compute pass.
 *
 * @category Core
 */
declare abstract class ASinglePassPostEffect extends RedGPUObject {
    #private;
    /**
     * [KO] 이펙트가 LDR(Low Dynamic Range) 공간에서 동작하는지 여부
     * [EN] Whether the effect operates in LDR (Low Dynamic Range) space
     */
    isLdr: boolean;
    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param workSize -
     * [KO] 워크그룹 사이즈 설정 (선택, 기본값: {x: 16, y: 16, z: 1})
     * [EN] Workgroup size configuration (optional, default: {x: 16, y: 16, z: 1})
     */
    protected constructor(redGPUContext: RedGPUContext, workSize?: {
        x?: number;
        y?: number;
        z?: number;
    });
    /**
     * [KO] 비디오 메모리 사용량(Bytes)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (Bytes)
     * [EN] Video memory usage in bytes
     */
    get videoMemorySize(): number;
    /**
     * [KO] 셰이더의 스토리지 구조 정보를 반환합니다.
     * [EN] Returns storage info from the shader.
     *
     * @returns
     * [KO] 스토리지 구조 정보
     * [EN] Storage structure information
     */
    get storageInfo(): any;
    /**
     * [KO] 현재 MSAA 상태에 따른 셰이더 정보를 반환합니다.
     * [EN] Returns shader information based on the current MSAA state.
     *
     * @returns
     * [KO] WGSL 셰이더 분석 정보
     * [EN] WGSL shader analysis info
     */
    get shaderInfo(): any;
    /**
     * [KO] 이펙트 전용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the effect-specific globalStruct buffer.
     *
     * @returns
     * [KO] 유니폼 버퍼 인스턴스
     * [EN] Uniform buffer instance
     */
    get uniformBuffer(): UniformBuffer;
    /**
     * [KO] 이펙트 전용 유니폼 구조 정보를 반환합니다.
     * [EN] Returns the effect-specific globalStruct struct information.
     *
     * @returns
     * [KO] 유니폼 구조 정보
     * [EN] Uniform structure info
     */
    get uniformsInfo(): any;
    /**
     * [KO] 시스템 공용 유니폼 구조 정보를 반환합니다.
     * [EN] Returns the system common globalStruct struct information.
     *
     * @returns
     * [KO] 시스템 유니폼 구조 정보
     * [EN] System globalStruct structure info
     */
    get systemUniformsInfo(): any;
    /**
     * [KO] 워크그룹 사이즈 X를 반환합니다.
     * [EN] Returns the workgroup size X.
     *
     * @returns
     * [KO] 워크그룹 사이즈 X
     * [EN] Workgroup size X
     */
    get WORK_SIZE_X(): number;
    /**
     * [KO] 워크그룹 사이즈 Y를 반환합니다.
     * [EN] Returns the workgroup size Y.
     *
     * @returns
     * [KO] 워크그룹 사이즈 Y
     * [EN] Workgroup size Y
     */
    get WORK_SIZE_Y(): number;
    /**
     * [KO] 워크그룹 사이즈 Z를 반환합니다.
     * [EN] Returns the workgroup size Z.
     *
     * @returns
     * [KO] 워크그룹 사이즈 Z
     * [EN] Workgroup size Z
     */
    get WORK_SIZE_Z(): number;
    /**
     * [KO] 현재 할당된 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the currently allocated output texture view.
     *
     * @returns
     * [KO] 출력 GPUTextureView
     * [EN] Output GPUTextureView
     */
    get outputTextureView(): GPUTextureView;
    /**
     * [KO] 이펙트에서 사용 중인 리소스를 해제합니다.
     * [EN] Clears the resources used by the effect.
     */
    clear(): void;
    destroy(): void;
    /**
     * [KO] 이펙트를 초기화합니다. 컴퓨트 셰이더 및 유니폼 버퍼를 생성합니다.
     * [EN] Initializes the effect. Creates compute shaders and globalStruct buffers.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param name -
     * [KO] 이펙트 이름
     * [EN] Effect name
     * @param computeCodes -
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 소스 코드
     * [EN] Compute shader source codes for MSAA and Non-MSAA
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string;
        nonMsaa: string;
    }): void;
    /**
     * [KO] 이펙트를 렌더링하고 결과를 반환합니다. 필요한 경우 바인드 그룹을 갱신합니다.
     * [EN] Renders the effect and returns the result. Updates bind groups if necessary.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 입력으로 사용될 소스 텍스처 정보 리스트
     * [EN] List of source texture information to be used as input
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult;
    /**
     * [KO] 특정 유니폼 값을 업데이트합니다.
     * [EN] Updates a specific globalStruct value.
     *
     * @param key -
     * [KO] 유니폼 키 이름
     * [EN] Uniform key name
     * @param value -
     * [KO] 설정할 값
     * [EN] Value to set
     */
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default ASinglePassPostEffect;
