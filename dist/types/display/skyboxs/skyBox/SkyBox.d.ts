import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import CubeTexture from "../../../resources/texture/CubeTexture";
import HDRTexture from "../../../resources/texture/hdr/HDRTexture";
import ANoiseTexture from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import VertexGPURenderInfo from "../../mesh/core/VertexGPURenderInfo";
import RenderViewStateData from "../../view/core/RenderViewStateData";
/**
 * 3D 씬의 배경으로 사용되는 스카이박스 클래스
 *
 * 큐브 텍스처나 HDR 텍스처를 사용하여 360도 환경을 렌더링하며,
 * 텍스처 간 부드러운 전환 효과와 블러, 노출, 투명도 조절 기능을 제공합니다.
 *
 * @example
 * ```typescript
 * const skybox = new RedGPU.Display.SkyBox(redGPUContext, cubeTexture);
 * view.skybox = skybox
 * ```
 * <iframe src="/RedGPU/examples/3d/skybox/skybox/"></iframe>
 *
 * 아래는 Skybox의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Skybox using HDRTexture](/RedGPU/examples/3d/skybox/skyboxWithHDRTexture/)
 * @see [Skybox using IBL](/RedGPU/examples/3d/skybox/skyboxWithIbl/)
 *
 * @category SkyBox
 */
declare class SkyBox {
    #private;
    /**
     * 모델 변환 행렬 (4x4 매트릭스)
     * @public
     */
    modelMatrix: mat4;
    /**
     * GPU 렌더링 정보 객체
     * @public
     */
    gpuRenderInfo: VertexGPURenderInfo;
    /**
     * 새로운 SkyBox 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param cubeTexture - 스카이박스에 사용할 큐브 텍스처 또는 HDR 텍스처
     *
     * @throws {Error} redGPUContext가 유효하지 않은 경우
     *
     */
    constructor(redGPUContext: RedGPUContext, cubeTexture: CubeTexture | HDRTexture);
    /**
     * 전환 지속 시간을 반환합니다.
     * @returns 전환 지속 시간 (밀리초)
     */
    get transitionDuration(): number;
    /**
     * 전환 경과 시간을 반환합니다.
     * @returns 전환 경과 시간 (밀리초)
     */
    get transitionElapsed(): number;
    /**
     * 전환 진행률을 반환합니다.
     * @returns 0.0에서 1.0 사이의 전환 진행률
     */
    get transitionProgress(): number;
    /**
     * 스카이박스 블러 정도를 반환합니다.
     * @returns 0.0에서 1.0 사이의 블러 값
     */
    get blur(): number;
    /**
     * 스카이박스 블러 정도를 설정합니다.
     * @param value - 0.0에서 1.0 사이의 블러 값
     * @throws {Error} 값이 0.0-1.0 범위를 벗어나는 경우
     */
    set blur(value: number);
    /**
     * 스카이박스의 불투명도를 반환합니다.
     * @returns 0.0에서 1.0 사이의 불투명도 값
     */
    get opacity(): number;
    /**
     * 스카이박스의 불투명도를 설정합니다.
     * @param value - 0.0에서 1.0 사이의 불투명도 값
     * @throws {Error} 값이 0.0-1.0 범위를 벗어나는 경우
     */
    set opacity(value: number);
    /**
     * 현재 스카이박스 텍스처를 반환합니다.
     * @returns 현재 스카이박스 텍스처
     */
    get skyboxTexture(): CubeTexture | HDRTexture;
    /**
     * 스카이박스 텍스처를 설정합니다.
     * @param texture - 새로운 스카이박스 텍스처
     * @throws {Error} 텍스처가 null이거나 유효하지 않은 경우
     */
    set skyboxTexture(texture: CubeTexture | HDRTexture);
    /**
     * 전환 대상 텍스처를 반환합니다.
     * @returns 전환 대상 텍스처 (전환 중이 아니면 undefined)
     */
    get transitionTexture(): CubeTexture | HDRTexture;
    /**
     * 다른 텍스처로의 부드러운 전환을 시작합니다.
     *
     * @param transitionTexture - 전환할 대상 텍스처
     * @param duration - 전환 지속 시간 (밀리초, 기본값: 300)
     * @param transitionAlphaTexture - 전환 효과에 사용할 알파 노이즈 텍스처
     *
     * @example
     * ```typescript
     * // 1초 동안 새 텍스처로 전환
     * skybox.transition(newTexture, 1000, noiseTexture);
     * ```
     */
    transition(transitionTexture: CubeTexture | HDRTexture, duration: number, transitionAlphaTexture: ANoiseTexture): void;
    /**
     * 스카이박스를 렌더링합니다.
     *
     * 이 메서드는 매 프레임마다 호출되어야 하며, 다음 작업을 수행합니다:
     * - MSAA 상태 업데이트
     * - GPU 렌더 정보 초기화 (첫 렌더링 시)
     * - 파이프라인 업데이트 (필요 시)
     * - 텍스처 전환 진행 상황 업데이트
     * - 실제 렌더링 명령 실행
     *
     * @param renderViewStateData - 렌더링 상태 및 디버그 정보
     *
     * @example
     * ```typescript
     * // 렌더링 루프에서
     * skybox.render(renderViewState);
     * ```
     */
    render(renderViewStateData: RenderViewStateData): void;
}
export default SkyBox;
