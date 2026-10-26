import RedGPUContext from "../../../../context/RedGPUContext";
import ManagementResourceBase from "../../../core/ManagementResourceBase";
/** [KO] 노이즈 정의 인터페이스 [EN] Noise definition interface */
export interface NoiseDefine {
    mainLogic: string;
    uniformStruct: string;
    uniformDefaults: {};
    helperFunctions?: string;
}
/**
 * ::: warning [KO] 직접 인스턴스 생성 금지
 * 이 클래스는 추상 베이스 클래스로 설계되었으므로 직접 인스턴스를 생성할 수 없습니다.
 * 구체적인 서브클래스(예: `SimplexTexture`)를 인스턴스화하여 사용하십시오.
 * :::
 *
 * ::: warning [EN] Do Not Instantiate Directly
 * This class is designed as an abstract base class and cannot be instantiated directly.
 * Use concrete subclasses (e.g., `SimplexTexture`) instead.
 * :::
 *
 * [KO] 노이즈 텍스처의 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class for noise textures.
 *
 * [KO] 컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.
 * [EN] Provides functionality to generate noise patterns in real-time using compute shaders.
 *
 * @category NoiseTexture
 */
declare abstract class ANoiseTexture extends ManagementResourceBase {
    #private;
    mipLevelCount: number;
    useMipmap: boolean;
    src: string;
    /**
     * [KO] ANoiseTexture 인스턴스를 초기화합니다.
     * [EN] Initializes an ANoiseTexture instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 텍스처 너비 (기본값: 1024)
     * [EN] Texture width (default: 1024)
     * @param height -
     * [KO] 텍스처 높이 (기본값: 1024)
     * [EN] Texture height (default: 1024)
     * @param define -
     * [KO] 노이즈 정의 객체
     * [EN] Noise definition object
     * @param useMipmap -
     * [KO] 밉맵 사용 여부 (기본값: true)
     * [EN] Whether to use mipmaps (default: true)
     */
    constructor(redGPUContext: RedGPUContext, width: number, height: number, define: NoiseDefine, useMipmap?: boolean);
    /**
     * [KO] 비디오 메모리 사용량(byte)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     */
    get videoMemorySize(): number;
    /**
     * [KO] 리소스 매니저 상태 키를 반환합니다.
     * [EN] Returns the resource manager state key.
     */
    get resourceManagerKey(): string;
    /**
     * [KO] 애니메이션 속도를 반환합니다.
     * [EN] Returns the animation speed.
     */
    get animationSpeed(): number;
    /**
     * [KO] 애니메이션 속도를 설정합니다.
     * [EN] Sets the animation speed.
     *
     * @param value -
     * [KO] 애니메이션 속도
     * [EN] Animation speed
     */
    set animationSpeed(value: number);
    /**
     * [KO] X축 애니메이션 값을 반환합니다.
     * [EN] Returns the animation X value.
     */
    get animationX(): number;
    /**
     * [KO] X축 애니메이션 값을 설정합니다.
     * [EN] Sets the animation X value.
     *
     * @param value -
     * [KO] X축 애니메이션 값
     * [EN] Animation X value
     */
    set animationX(value: number);
    /**
     * [KO] Y축 애니메이션 값을 반환합니다.
     * [EN] Returns the animation Y value.
     */
    get animationY(): number;
    /**
     * [KO] Y축 애니메이션 값을 설정합니다.
     * [EN] Sets the animation Y value.
     *
     * @param value -
     * [KO] Y축 애니메이션 값
     * [EN] Animation Y value
     */
    set animationY(value: number);
    /**
     * [KO] 유니폼 정보를 반환합니다.
     * [EN] Returns the uniform information.
     */
    get uniformInfo(): any;
    /**
     * [KO] GPUTexture 객체를 반환합니다.
     * [EN] Returns the GPUTexture object.
     */
    get gpuTexture(): GPUTexture;
    /**
     * [KO] 현재 시간을 반환합니다.
     * [EN] Returns the current time.
     */
    get time(): number;
    /**
     * [KO] 현재 시간을 설정합니다.
     * [EN] Sets the current time.
     *
     * @param value -
     * [KO] 시간 (밀리초)
     * [EN] Time in milliseconds
     */
    set time(value: number);
    /**
     * [KO] 개별 유니폼 파라미터를 업데이트합니다.
     * [EN] Updates an individual uniform parameter.
     *
     * @param name -
     * [KO] 유니폼 이름
     * [EN] Uniform name
     * @param value -
     * [KO] 설정할 값
     * [EN] Value to set
     */
    updateUniform(name: string, value: any): void;
    /**
     * [KO] 여러 유니폼 파라미터를 일괄 업데이트합니다.
     * [EN] Updates multiple uniform parameters at once.
     *
     * @param uniforms -
     * [KO] 업데이트할 유니폼 키-값 레코드
     * [EN] Record of uniform key-value pairs to update
     */
    updateUniforms(uniforms: Record<string, any>): void;
    /**
     * [KO] 지정된 시간으로 노이즈를 렌더링합니다.
     * [EN] Renders noise at the specified time.
     *
     * @param time -
     * [KO] 렌더링할 시간
     * [EN] Time to render
     */
    render(time: number): void;
    /**
     * [KO] 리소스를 파괴합니다.
     * [EN] Destroys the resource.
     */
    destroy(): void;
}
export default ANoiseTexture;
