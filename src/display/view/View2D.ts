import Camera2D from "../../camera/camera/Camera2D";
import RedGPUContext from "../../context/RedGPUContext";
import Scene from "../scene/Scene";
import View3D from "./View3D";

/**
 * [KO] 2D 렌더링을 위한 뷰 클래스입니다.
 * [EN] View class for 2D rendering.
 *
 * [KO] `View3D`를 확장하며, 내부적으로 `Camera2D`를 자동으로 생성하여 2D 환경에 최적화된 시점을 제공합니다.
 * [EN] Extends `View3D` and automatically creates a `Camera2D` internally to provide a viewpoint optimized for 2D environments.
 *
 * ### Example
 * ```typescript
 * const scene = new RedGPU.Display.Scene();
 * const view = new RedGPU.Display.View2D(redGPUContext, scene);
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/2d/helloWorld2D/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Multi View2D(2D + 2D) example](/RedGPU/examples/2d/view/multiView/)
 * @see [Multi View2D(2D + 3D) example](/RedGPU/examples/2d/view/multiViewWith3D/)
 * @category View
 */
class View2D extends View3D {
    /**
     * [KO] `View2D` 인스턴스를 생성합니다.
     * [EN] Creates a `View2D` instance.
     *
     * ### Example
     * ```typescript
     * const view = new RedGPU.Display.View2D(redGPUContext, scene, 'Main2DView');
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param scene -
     * [KO] 렌더링할 Scene 인스턴스
     * [EN] Scene instance to render
     * @param name -
     * [KO] 뷰 이름 (선택)
     * [EN] View name (optional)
     */
    constructor(redGPUContext: RedGPUContext, scene: Scene, name?: string) {
        const camera = new Camera2D()
        super(redGPUContext, scene, camera, name)
    }
}

Object.freeze(View2D)
export default View2D
