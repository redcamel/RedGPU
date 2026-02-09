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
 * [KO] 노이즈 텍스처의 기반이 되는 추상 클래스입니다.
 * [EN] Abstract base class for noise textures.
 *
 * [KO] 이 클래스는 컴퓨트 셰이더를 사용하여 실시간으로 노이즈 패턴을 생성하는 기능을 제공합니다.
 * [EN] This class provides functionality to generate noise patterns in real-time using compute shaders.
 *
 * @experimental
 * @category NoiseTexture
 */
declare abstract class ANoiseTexture extends ManagementResourceBase {
    #private;
    mipLevelCount: any;
    useMipmap: any;
    src: any;
    /**
     * [KO] ANoiseTexture 인스턴스를 생성합니다.
     * [EN] Creates an ANoiseTexture instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param width - [KO] 텍스처 너비 [EN] Texture width
     * @param height - [KO] 텍스처 높이 [EN] Texture height
     * @param define - [KO] 노이즈 정의 객체 [EN] Noise definition object
     */
    constructor(redGPUContext: RedGPUContext, width: number, height: number, define: NoiseDefine);
    /** [KO] 비디오 메모리 사용량(byte) [EN] Video memory usage in bytes */
    get videoMemorySize(): number;
    /** [KO] 리소스 매니저 키 [EN] Resource manager key */
    get resourceManagerKey(): string;
    /** [KO] 애니메이션 속도를 반환합니다. [EN] Returns the animation speed. */
    get animationSpeed(): number;
    /** [KO] 애니메이션 속도를 설정합니다. [EN] Sets the animation speed. */
    set animationSpeed(value: number);
    /** [KO] X축 애니메이션 값을 반환합니다. [EN] Returns the animation X value. */
    get animationX(): number;
    /** [KO] X축 애니메이션 값을 설정합니다. [EN] Sets the animation X value. */
    set animationX(value: number);
    /** [KO] Y축 애니메이션 값을 반환합니다. [EN] Returns the animation Y value. */
    get animationY(): number;
    /** [KO] Y축 애니메이션 값을 설정합니다. [EN] Sets the animation Y value. */
    set animationY(value: number);
    /** [KO] 유니폼 정보를 반환합니다. [EN] Returns the uniform information. */
    get uniformInfo(): any;
    /** [KO] GPUTexture 객체를 반환합니다. [EN] Returns the GPUTexture object. */
    get gpuTexture(): GPUTexture;
    /** [KO] 현재 시간을 반환합니다. [EN] Returns the current time. */
    get time(): number;
    /** [KO] 현재 시간을 설정합니다. [EN] Sets the current time. */
    set time(value: number);
    /** [KO] 개별 유니폼 파라미터를 업데이트합니다. [EN] Updates an individual uniform parameter. */
    updateUniform(name: string, value: any): void;
    /** [KO] 여러 유니폼 파라미터를 일괄 업데이트합니다. [EN] Updates multiple uniform parameters at once. */
    updateUniforms(uniforms: Record<string, any>): void;
    /** [KO] 지정된 시간으로 노이즈를 렌더링합니다. [EN] Renders noise at the specified time. */
    render(time: number): void;
    /** [KO] 리소스를 파괴합니다. [EN] Destroys the resource. */
    destroy(): void;
}
export default ANoiseTexture;
