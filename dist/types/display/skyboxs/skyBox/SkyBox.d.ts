import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 3D 씬의 원경 및 환경 맵 정보로 사용되는 스카이박스(Skybox) 클래스입니다.
 * [EN] Skybox class used as the distant view and environment map information for 3D scenes.
 *
 * [KO] 큐브 맵 텍스처를 이용하여 무한한 공간 배경을 렌더링합니다. 물리 기반 렌더링에 적합한 물리적 휘도(Luminance) 설정, 아티스트용 강도 배율, 실시간 전환 효과(Transition) 및 블러(Blur)와 불투명도 조절 기능을 지원합니다.
 * [EN] Renders an infinite background space using a cube map texture. It supports physical luminance configuration suitable for PBR, artistic intensity multipliers, real-time transition effects, and control over blur and opacity.
 *
 * ### Example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" ></iframe>
 *
 * [KO] 아래는 SkyBox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SkyBox.
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @see [SkyBox transition example2](/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)
 *
 * @category SkyBox
 */
declare class SkyBox extends RedGPUObject {
    #private;
    /**
     * [KO] 스카이박스 메쉬 모델 변환 행렬
     * [EN] Skybox mesh model transformation matrix
     */
    modelMatrix: mat4;
    /**
     * [KO] GPU 렌더링 및 유니폼 정보 객체
     * [EN] GPU rendering and globalStruct information object
     */
    gpuRenderInfo: VertexGPURenderInfo;
    /**
     * [KO] SkyBox 인스턴스를 생성합니다.
     * [EN] Creates an instance of SkyBox.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param texture -
     * [KO] 배경으로 사용할 큐브 텍스처 객체
     * [EN] Cube texture object to use as the background
     * @param luminance -
     * [KO] 물리적 휘도 (단위: cd/m² 또는 Nit, 기본값: 25000 Nit)
     * [EN] Physical luminance (unit: cd/m² or Nit, default: 25000 Nit)
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture, luminance?: number);
    /**
     * [KO] 스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.
     * [EN] Gets or sets the current cube texture applied as the skybox background.
     */
    get texture(): CubeTexture | DirectCubeTexture;
    set texture(texture: CubeTexture | DirectCubeTexture);
    /**
     * [KO] 물리 기반 광학 시뮬레이션용 휘도(Nit) 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the luminance value (Nit) for physical optics simulation.
     */
    get luminance(): number;
    set luminance(value: number);
    /**
     * [KO] 시각적인 라이팅 강도를 조절하기 위한 강도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the intensity multiplier to adjust visual lighting strength.
     */
    get intensityMultiplier(): number;
    set intensityMultiplier(value: number);
    /**
     * [KO] 배경 텍스처의 블러 세기(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the blur strength (0.0 to 1.0) of the background texture.
     */
    get blur(): number;
    set blur(value: number);
    /**
     * [KO] 스카이박스 배경의 최종 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the final opacity (0.0 to 1.0) of the skybox background.
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * [KO] 텍스처 전환 애니메이션 도중의 목표가 되는 텍스처를 가져옵니다.
     * [EN] Gets the target texture during a texture transition animation.
     */
    get transitionTexture(): CubeTexture | DirectCubeTexture;
    /**
     * [KO] 지정된 다른 큐브 텍스처로 부드럽게 배경을 전환하는 마스킹 애니메이션을 기동합니다.
     * [EN] Starts a masking animation to smoothly transition the background to the specified target cube texture.
     * @param targetTexture -
     * [KO] 새롭게 전환할 대상 큐브 텍스처
     * [EN] The new target cube texture to transition to
     * @param duration -
     * [KO] 전환에 걸리는 지속 시간 (ms, 기본값: 300)
     * [EN] The duration of the transition (in ms, default: 300)
     * @param mask -
     * [KO] 전환 효과에 적용할 노이즈 마스크 텍스처
     * [EN] Noise mask texture to apply to the transition effect
     */
    transition(targetTexture: CubeTexture | DirectCubeTexture, duration: number, mask: ANoiseTexture): void;
    /**
     * [KO] 스카이박스를 화면 배경에 드로우합니다. 텍스처 전환이 진행 중이면 경과 시간을 기준으로 진척도를 계산해 업로드합니다.
     * [EN] Draws the skybox on the screen background. If a texture transition is in progress, computes and uploads progress based on elapsed time.
     * @param renderViewStateData -
     * [KO] 현재 뷰 및 렌더 상태 데이터
     * [EN] Current view and render state data
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default SkyBox;
