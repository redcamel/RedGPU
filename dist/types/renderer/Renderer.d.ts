import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
/**
 * [KO] RedGPU의 핵심 렌더러 클래스입니다.
 * [EN] The core renderer class of RedGPU.
 *
 * [KO] 렌더링 루프를 관리하고, 각 뷰(View3D)의 렌더링 패스를 실행하며, 최종적으로 화면에 결과를 표시합니다. 디버그 렌더링 및 애니메이션 업데이트도 담당합니다.
 * [EN] Manages the rendering loop, executes rendering passes for each View3D, and finally displays the result on the screen. It also handles debug rendering and animation updates.
 *
 * * ### Example
 * ```typescript
 * const renderer = new RedGPU.Renderer();
 * renderer.start(redGPUContext, (time) => {
 *     // 사용자 정의 렌더링 로직 (User custom rendering logic)
 * });
 * ```
 *
 * @category Renderer
 */
declare class Renderer {
    #private;
    constructor();
    /**
     * [KO] 렌더링 루프를 시작합니다.
     * [EN] Starts the rendering loop.
     *
     * * ### Example
     * ```typescript
     * renderer.start(redGPUContext, (time) => {
     *     // 매 프레임 호출되는 콜백 (Callback called every frame)
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param render -
     * [KO] 매 프레임 실행될 사용자 정의 콜백 함수
     * [EN] User-defined callback function to be executed every frame
     */
    start(redGPUContext: RedGPUContext, render: Function): void;
    /**
     * [KO] 렌더링 루프를 정지합니다.
     * [EN] Stops the rendering loop.
     *
     * * ### Example
     * ```typescript
     * renderer.stop(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    stop(redGPUContext: RedGPUContext): void;
    /**
     * [KO] 단일 프레임을 렌더링합니다. (내부적으로 호출됨)
     * [EN] Renders a single frame. (Called internally)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    renderFrame(redGPUContext: RedGPUContext, time: number): void;
    /**
     * [KO] 특정 View3D를 렌더링합니다.
     * [EN] Renders a specific View3D.
     *
     * @param view -
     * [KO] 렌더링할 View3D 인스턴스
     * [EN] View3D instance to render
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     * @returns
     * [KO] 생성된 렌더 패스 디스크립터
     * [EN] Generated render pass descriptor
     */
    renderView(view: View3D, time: number): GPURenderPassDescriptor;
}
export default Renderer;
