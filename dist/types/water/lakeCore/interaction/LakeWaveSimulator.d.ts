import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 호수 수면의 파동 전파를 시뮬레이션하고 리플 노멀 텍스처를 생성하는 클래스입니다.
 * [EN] Class that simulates lake surface wave propagation and generates a ripple normal texture.
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
declare class LakeWaveSimulator extends RedGPUObject {
    #private;
    /**
     * [KO] 파동 시뮬레이션 텍스처의 가로·세로 해상도(픽셀)입니다. (기본값: `512`)
     * [EN] Width and height resolution of the wave simulation texture in pixels. (Default: `512`)
     */
    textureSize: number;
    /**
     * [KO] 시뮬레이션 결과 리플 노멀이 저장되는 `GPUTexture`입니다.
     * [EN] `GPUTexture` storing the simulated ripple normals.
     */
    rippleNormalTexture: GPUTexture;
    /**
     * [KO] `rippleNormalTexture`의 `GPUTextureView`입니다.
     * [EN] `GPUTextureView` of `rippleNormalTexture`.
     */
    rippleNormalTextureView: GPUTextureView;
    /**
     * [KO] 파동 전파 속도입니다. (기본값: `0.32`)
     * [EN] Wave propagation speed. (Default: `0.32`)
     */
    waveSpeed: number;
    /**
     * [KO] 프레임당 파동 에너지 감쇠율입니다. (기본값: `0.012`)
     * [EN] Wave energy damping factor per frame. (Default: `0.012`)
     */
    damping: number;
    /**
     * [KO] 생성되는 리플 노멀의 강도입니다. (기본값: `1.0`)
     * [EN] Strength of the generated ripple normal. (Default: `1.0`)
     */
    normalStrength: number;
    /**
     * [KO] `LakeWaveSimulator` 인스턴스를 생성합니다.
     * [EN] Creates a `LakeWaveSimulator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param textureSize -
     * [KO] 시뮬레이션 텍스처 해상도 (기본값: `512`)
     * [EN] Simulation texture resolution (default: `512`)
     */
    constructor(redGPUContext: RedGPUContext, textureSize?: number);
    /**
     * [KO] 캡처 패스의 침투 깊이 텍스처 뷰를 바인드 그룹에 연결합니다.
     * [EN] Binds the penetration depth texture view from the capture pass to the bind groups.
     *
     * @param captureTextureView -
     * [KO] 캡처 패스의 `GPUTextureView`
     * [EN] `GPUTextureView` from the capture pass
     */
    updateCaptureBinding(captureTextureView: GPUTextureView): void;
    /**
     * [KO] 파동 시뮬레이션 컴퓨트 패스를 실행합니다.
     * [EN] Executes the wave simulation compute pass.
     *
     * @param commandEncoder -
     * [KO] 컴퓨트 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the compute pass
     * @param shiftX -
     * [KO] 도메인 이동에 따른 X축 텍셀 오프셋 (기본값: `0`)
     * [EN] X-axis texel offset from domain movement (default: `0`)
     * @param shiftZ -
     * [KO] 도메인 이동에 따른 Z축 텍셀 오프셋 (기본값: `0`)
     * [EN] Z-axis texel offset from domain movement (default: `0`)
     */
    simulate(commandEncoder: GPUCommandEncoder, shiftX?: number, shiftZ?: number): void;
    /**
     * [KO] 파동 버퍼와 리플 노멀 텍스처를 0으로 초기화합니다.
     * [EN] Clears the wave buffers and ripple normal texture to zero.
     *
     * @param commandEncoder -
     * [KO] 클리어 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the clear pass
     */
    clear(commandEncoder: GPUCommandEncoder): void;
    /**
     * [KO] 할당된 GPU 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU resources.
     */
    destroy(): void;
}
export default LakeWaveSimulator;
