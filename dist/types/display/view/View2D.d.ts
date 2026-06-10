import RedGPUContext from "../../context/RedGPUContext";
import Scene from "../scene/Scene";
import View3D from "./View3D";
/**
 * [KO] 2D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 2D rendering.
 *
 * [KO] View3D를 확장하며, 내부적으로 Camera2D를 사용하여 2D 환경에 최적화된 시점을 제공합니다. RedGPU의 2D 시각화 및 UI 구성에 사용됩니다.
 * [EN] Extends View3D and internally uses Camera2D to provide a viewpoint optimized for 2D environments. It is used for 2D visualization and UI composition in RedGPU.
 *
 * * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * const view = new RedGPU.Display.View2D(redGPUContext, scene);
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/2d/helloWorld2D/" ></iframe>
 *
 * [KO] 아래는 View2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of View2D.
 * @see [Multi View2D(2D + 2D) example](/RedGPU/examples/2d/view/multiView/)
 * @see [Multi View2D(2D + 3D) example](/RedGPU/examples/2d/view/multiViewWith3D/)
 *
 * @category View
 */
declare class View2D extends View3D {
    /**
     * [KO] View2D 생성자
     * [EN] View2D constructor
     * [KO] Camera2D를 자동으로 생성하여 View3D의 생성자에 전달합니다.
     * [EN] Automatically creates a Camera2D and passes it to the View3D constructor.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] Scene 인스턴스
     * [EN] Scene instance
     * @param name -
     * [KO] 선택적 뷰 이름
     * [EN] Optional view name
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, name?: string);
}
export default View2D;
