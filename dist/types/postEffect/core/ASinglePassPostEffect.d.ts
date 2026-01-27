import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
export type ASinglePassPostEffectResult = {
    texture: GPUTexture;
    textureView: GPUTextureView;
};
/**
 * [KO] 단일 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for single-pass post-processing effects.
 *
 * [KO] 한 번의 Compute 패스로 동작하는 후처리 이펙트의 기반 클래스입니다.
 * [EN] Base class for post-processing effects that operate in a single compute pass.
 *
 * @category Core
 */
declare abstract class ASinglePassPostEffect {
    #private;
    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] G-Buffer Normal 텍스처 사용 여부를 반환합니다.
     * [EN] Returns whether G-Buffer Normal texture is used.
     */
    get useGBufferNormalTexture(): boolean;
    /**
     * [KO] G-Buffer Normal 텍스처 사용 여부를 설정합니다.
     * [EN] Sets whether G-Buffer Normal texture is used.
     */
    set useGBufferNormalTexture(value: boolean);
    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 깊이 텍스처 사용 여부를 반환합니다.
     * [EN] Returns whether depth texture is used.
     */
    get useDepthTexture(): boolean;
    /**
     * [KO] 깊이 텍스처 사용 여부를 설정합니다.
     * [EN] Sets whether depth texture is used.
     */
    set useDepthTexture(value: boolean);
    /**
     * [KO] RedGPU 컨텍스트를 반환합니다.
     * [EN] Returns the RedGPU context.
     */
    get redGPUContext(): RedGPUContext;
    /**
     * [KO] 스토리지 정보를 반환합니다.
     * [EN] Returns storage information.
     */
    get storageInfo(): any;
    /**
     * [KO] 셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)
     * [EN] Returns shader information. (Depends on MSAA state)
     */
    get shaderInfo(): any;
    /**
     * [KO] 유니폼 버퍼를 반환합니다.
     * [EN] Returns the uniform buffer.
     */
    get uniformBuffer(): UniformBuffer;
    /**
     * [KO] 유니폼 정보를 반환합니다.
     * [EN] Returns uniform information.
     */
    get uniformsInfo(): any;
    /**
     * [KO] 시스템 유니폼 정보를 반환합니다.
     * [EN] Returns system uniform information.
     */
    get systemUuniformsInfo(): any;
    /**
     * [KO] Workgroup Size X
     * [EN] Workgroup Size X
     */
    get WORK_SIZE_X(): number;
    set WORK_SIZE_X(value: number);
    /**
     * [KO] Workgroup Size Y
     * [EN] Workgroup Size Y
     */
    get WORK_SIZE_Y(): number;
    set WORK_SIZE_Y(value: number);
    /**
     * [KO] Workgroup Size Z
     * [EN] Workgroup Size Z
     */
    get WORK_SIZE_Z(): number;
    set WORK_SIZE_Z(value: number);
    /**
     * [KO] 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the output texture view.
     */
    get outputTextureView(): GPUTextureView;
    /**
     * [KO] 이펙트를 초기화(해제)합니다.
     * [EN] Clears the effect.
     */
    clear(): void;
    /**
     * [KO] 이펙트를 초기화합니다.
     * [EN] Initializes the effect.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param name
     * [KO] 이펙트 이름
     * [EN] Effect name
     * @param computeCodes
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드
     * [EN] Compute shader codes for MSAA and Non-MSAA
     * @param bindGroupLayout
     * [KO] 바인드 그룹 레이아웃 (선택)
     * [EN] Bind group layout (optional)
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string;
        nonMsaa: string;
    }, bindGroupLayout?: GPUBindGroupLayout): void;
    /**
     * [KO] 이펙트를 실행합니다.
     * [EN] Executes the effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param gpuDevice
     * [KO] GPU 디바이스
     * [EN] GPU Device
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     */
    execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number): void;
    /**
     * [KO] 이펙트를 렌더링합니다.
     * [EN] Renders the effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보 리스트
     * [EN] Source texture info list
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: ASinglePassPostEffectResult[]): ASinglePassPostEffectResult;
    /**
     * [KO] 이펙트 상태를 업데이트합니다.
     * [EN] Updates the effect state.
     *
     * @param deltaTime
     * [KO] 델타 타임
     * [EN] Delta time
     */
    update(deltaTime: number): void;
    /**
     * [KO] 유니폼 값을 업데이트합니다.
     * [EN] Updates a uniform value.
     *
     * @param key
     * [KO] 유니폼 키
     * [EN] Uniform key
     * @param value
     * [KO] 유니폼 값
     * [EN] Uniform value
     */
    updateUniform(key: string, value: number | number[] | boolean): void;
}
export default ASinglePassPostEffect;
