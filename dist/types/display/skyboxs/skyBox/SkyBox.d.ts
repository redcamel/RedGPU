import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../../../resources/texture/CubeTexture";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 큐브맵 텍스처를 사용하여 3D 씬의 무한 원경 배경을 렌더링하는 스카이박스 클래스입니다.
 * [EN] Skybox class that renders an infinite distant background for a 3D scene using a cubemap texture.
 *
 * [KO] 물리적 휘도(Nit), 강도 배율, 블러(Blur), 불투명도 조절 및 노이즈 마스크 기반의 실시간 텍스처 전환(Transition) 효과를 지원합니다.
 * [EN] Supports physical luminance (Nit), intensity multiplier, blur, opacity control, and real-time texture transition effects using a noise mask.
 *
 * ### Example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/" style="width:100%; height:500px;"></iframe>
 *
 * @see [SkyBox basic example](/RedGPU/examples/3d/skybox/skybox/)
 * @see [SkyBox IBL example](/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 * @see [SkyBox transition example](/RedGPU/examples/3d/skybox/transition/skyboxTransition/)
 * @see [SkyBox transition with noise texture](/RedGPU/examples/3d/skybox/transition/skyboxTransitionWithNoiseTexture/)
 * @category SkyBox
 */
declare class SkyBox extends RedGPUObject {
    #private;
    /**
     * [KO] 스카이박스 모델 변환 행렬
     * [EN] Skybox model transformation matrix
     */
    modelMatrix: mat4;
    /**
     * [KO] 버텍스 GPU 렌더링 정보 객체
     * [EN] Vertex GPU render info object
     */
    gpuRenderInfo: VertexGPURenderInfo;
    /**
     * [KO] SkyBox 인스턴스를 생성합니다.
     * [EN] Creates a SkyBox instance.
     *
     * ### Example
     * ```typescript
     * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture, 25000);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param texture -
     * [KO] 배경으로 사용할 큐브 텍스처 객체
     * [EN] Cube texture object to use as the background
     * @param luminance -
     * [KO] 물리적 휘도 (단위: Nit, 기본값: 25000)
     * [EN] Physical luminance (unit: Nit, default: 25000)
     */
    constructor(redGPUContext: RedGPUContext, texture: CubeTexture | DirectCubeTexture, luminance?: number);
    /**
     * [KO] 스카이박스 배경으로 적용된 현재 큐브 텍스처를 가져오거나 설정합니다.
     * [EN] Gets or sets the current cube texture applied as the skybox background.
     *
     * @returns
     * [KO] 현재 큐브 텍스처 인스턴스
     * [EN] Current cube texture instance
     */
    get texture(): CubeTexture | DirectCubeTexture;
    set texture(texture: CubeTexture | DirectCubeTexture);
    /**
     * [KO] 물리 기반 광학 시뮬레이션용 휘도(Nit) 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the luminance value (Nit) for physical optics simulation.
     *
     * @returns
     * [KO] 휘도 값 (단위: Nit)
     * [EN] Luminance value (unit: Nit)
     */
    get luminance(): number;
    set luminance(value: number);
    /**
     * [KO] 시각적 밝기 조절을 위한 강도 배율을 가져오거나 설정합니다.
     * [EN] Gets or sets the intensity multiplier for visual brightness adjustment.
     *
     * @returns
     * [KO] 강도 배율
     * [EN] Intensity multiplier
     */
    get intensityMultiplier(): number;
    set intensityMultiplier(value: number);
    /**
     * [KO] 배경 텍스처의 블러 강도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the blur strength (0.0 to 1.0) of the background texture.
     *
     * @returns
     * [KO] 블러 강도 (0.0 ~ 1.0)
     * [EN] Blur strength (0.0 to 1.0)
     */
    get blur(): number;
    set blur(value: number);
    /**
     * [KO] 스카이박스 배경의 불투명도(0.0 ~ 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the opacity (0.0 to 1.0) of the skybox background.
     *
     * @returns
     * [KO] 불투명도 (0.0 ~ 1.0)
     * [EN] Opacity (0.0 to 1.0)
     */
    get opacity(): number;
    set opacity(value: number);
    /**
     * [KO] 텍스처 전환 애니메이션의 목표 큐브 텍스처를 반환합니다.
     * [EN] Returns the target cube texture of the texture transition animation.
     *
     * @returns
     * [KO] 전환 목표 큐브 텍스처
     * [EN] Target cube texture for transition
     */
    get transitionTexture(): CubeTexture | DirectCubeTexture;
    /**
     * [KO] 지정된 대상 큐브 텍스처로 배경을 전환하는 애니메이션을 시작합니다.
     * [EN] Starts an animation that transitions the background to the specified target cube texture.
     *
     * ### Example
     * ```typescript
     * skybox.transition(nextCubeTexture, 500, noiseTexture);
     * ```
     *
     * @param targetTexture -
     * [KO] 전환할 대상 큐브 텍스처
     * [EN] Target cube texture to transition to
     * @param duration -
     * [KO] 전환 지속 시간 (단위: ms, 기본값: 300)
     * [EN] Transition duration (unit: ms, default: 300)
     * @param mask -
     * [KO] 전환 효과에 사용할 노이즈 마스크 텍스처
     * [EN] Noise mask texture to use for the transition effect
     */
    transition(targetTexture: CubeTexture | DirectCubeTexture, duration: number, mask: ANoiseTexture): void;
    /**
     * [KO] 스카이박스를 렌더링하고 진행 중인 텍스처 전환 상태를 갱신합니다.
     * [EN] Renders the skybox and updates any active texture transition state.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 스카이박스 인스턴스를 파기하고 할당된 GPU 리소스를 해제합니다.
     * [EN] Destroys the SkyBox instance and releases allocated GPU resources.
     */
    destroy(): void;
}
export default SkyBox;
