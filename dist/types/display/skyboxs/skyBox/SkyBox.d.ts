import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../../../resources/texture/CubeTexture";
import HDRTexture from "../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * [KO] 3D 씬의 배경으로 사용되는 스카이박스 클래스입니다.
 * [EN] Skybox class used as the background for 3D scenes.
 *
 * [KO] 큐브 텍스처나 HDR 텍스처를 사용하여 360도 환경을 렌더링하며, 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.
 * [EN] Renders a 360-degree environment using cube or HDR textures, providing smooth transitions between textures, blur, exposure, and transparency control.
 *
 * * ### Example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox
 * ```
 * <iframe src="/RedGPU/examples/3d/skybox/skybox/"></iframe>
 *
 * @see
 * [KO] 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of Skybox.
 * @see [Skybox using HDRTexture](/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 * @see [Skybox using IBL](/RedGPU/examples/3d/skybox/skyboxWithIbl/)
 *
 * @category SkyBox
 */
declare class SkyBox {
    #private;
    /**
     * [KO] 모델 변환 행렬 (4x4 매트릭스)
     * [EN] Model transformation matrix (4x4 matrix)
     */
    modelMatrix: mat4;
    /**
     * [KO] GPU 렌더링 정보 객체
     * [EN] GPU rendering information object
     */
    gpuRenderInfo: VertexGPURenderInfo;
    /**
     * [KO] 새로운 SkyBox 인스턴스를 생성합니다.
     * [EN] Creates a new SkyBox instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param cubeTexture -
     * [KO] 스카이박스에 사용할 큐브 텍스처 또는 HDR 텍스처
     * [EN] Cube texture or HDR texture to use for the skybox
     *
     * @throws
     * [KO] redGPUContext가 유효하지 않은 경우 에러 발생
     * [EN] Throws error if redGPUContext is invalid
     *
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture);
    /**
     * [KO] 전환 지속 시간을 반환합니다.
     * [EN] Returns the transition duration.
     * @returns
     * [KO] 전환 지속 시간 (밀리초)
     * [EN] Transition duration (ms)
     */
    get transitionDuration(): number;
    /**
     * [KO] 전환 경과 시간을 반환합니다.
     * [EN] Returns the transition elapsed time.
     * @returns
     * [KO] 전환 경과 시간 (밀리초)
     * [EN] Transition elapsed time (ms)
     */
    get transitionElapsed(): number;
    /**
     * [KO] 전환 진행률을 반환합니다.
     * [EN] Returns the transition progress.
     * @returns
     * [KO] 0.0에서 1.0 사이의 전환 진행률
     * [EN] Transition progress between 0.0 and 1.0
     */
    get transitionProgress(): number;
    /**
     * [KO] 스카이박스 블러 정도를 반환합니다.
     * [EN] Returns the skybox blur amount.
     * @returns
     * [KO] 0.0에서 1.0 사이의 블러 값
     * [EN] Blur value between 0.0 and 1.0
     */
    get blur(): number;
    /**
     * [KO] 스카이박스 블러 정도를 설정합니다.
     * [EN] Sets the skybox blur amount.
     * @param value -
     * [KO] 0.0에서 1.0 사이의 블러 값
     * [EN] Blur value between 0.0 and 1.0
     * @throws
     * [KO] 값이 0.0-1.0 범위를 벗어나는 경우 에러 발생
     * [EN] Throws error if value is out of 0.0-1.0 range
     */
    set blur(value: number);
    /**
     * [KO] 스카이박스의 불투명도를 반환합니다.
     * [EN] Returns the skybox opacity.
     * @returns
     * [KO] 0.0에서 1.0 사이의 불투명도 값
     * [EN] Opacity value between 0.0 and 1.0
     */
    get opacity(): number;
    /**
     * [KO] 스카이박스의 불투명도를 설정합니다.
     * [EN] Sets the skybox opacity.
     * @param value -
     * [KO] 0.0에서 1.0 사이의 불투명도 값
     * [EN] Opacity value between 0.0 and 1.0
     * @throws
     * [KO] 값이 0.0-1.0 범위를 벗어나는 경우 에러 발생
     * [EN] Throws error if value is out of 0.0-1.0 range
     */
    set opacity(value: number);
    /**
     * [KO] 현재 스카이박스 텍스처를 반환합니다.
     * [EN] Returns the current skybox texture.
     * @returns
     * [KO] 현재 스카이박스 텍스처
     * [EN] Current skybox texture
     */
    get skyboxTexture(): CubeTexture | HDRTexture;
    /**
     * [KO] 스카이박스 텍스처를 설정합니다.
     * [EN] Sets the skybox texture.
     * @param texture -
     * [KO] 새로운 스카이박스 텍스처
     * [EN] New skybox texture
     * @throws
     * [KO] 텍스처가 유효하지 않은 경우 에러 발생
     * [EN] Throws error if texture is invalid
     */
    set skyboxTexture(texture: CubeTexture | HDRTexture);
    /**
     * [KO] 전환 대상 텍스처를 반환합니다.
     * [EN] Returns the transition target texture.
     * @returns
     * [KO] 전환 대상 텍스처 (전환 중이 아니면 undefined)
     * [EN] Transition target texture (undefined if not transitioning)
     */
    get transitionTexture(): CubeTexture | HDRTexture;
    /**
     * [KO] 다른 텍스처로의 부드러운 전환을 시작합니다.
     * [EN] Starts a smooth transition to another texture.
     *
     * * ### Example
     * ```typescript
     * // 1초 동안 새 텍스처로 전환
     * skybox.transition(newTexture, 1000, noiseTexture);
     * ```
     * @param transitionTexture -
     * [KO] 전환할 대상 텍스처
     * [EN] Target texture to transition to
     * @param duration -
     * [KO] 전환 지속 시간 (밀리초, 기본값: 300)
     * [EN] Transition duration (ms, default: 300)
     * @param transitionAlphaTexture -
     * [KO] 전환 효과에 사용할 알파 노이즈 텍스처
     * [EN] Alpha noise texture to use for the transition effect
     */
    transition(transitionTexture: CubeTexture | HDRTexture, duration: number, transitionAlphaTexture: ANoiseTexture): void;
    /**
     * [KO] 스카이박스를 렌더링합니다.
     * [EN] Renders the skybox.
     *
     * [KO] 이 메서드는 매 프레임마다 호출되어야 하며, MSAA 상태, 텍스처 전환 진행 상황 업데이트 및 실제 렌더링 명령 실행을 수행합니다.
     * [EN] This method should be called every frame, performing MSAA state check, texture transition updates, and executing actual rendering commands.
     *
     * * ### Example
     * ```typescript
     * // 렌더링 루프에서
     * skybox.render(renderViewState);
     * ```
     * @param renderViewStateData -
     * [KO] 렌더링 상태 및 디버그 정보
     * [EN] Rendering state and debug info
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default SkyBox;
