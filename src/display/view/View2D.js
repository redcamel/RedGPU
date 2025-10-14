import Camera2D from "../../camera/camera/Camera2D";
import View3D from "./View3D";
/**
 * View2D 클래스는 2D 렌더링을 위한 뷰 클래스입니다.
 * View3D를 확장하며, 내부적으로 Camera2D를 사용하여 2D 환경에 최적화된 시점을 제공합니다.
 *
 * 이 클래스는 AView를 기반으로 하는 View3D를 상속하며,
 * RedGPU의 2D 시각화 및 UI 구성에 사용됩니다.
 *
 * ```javascript
 * const scene = new RedGPU.Display.Scene();
 * const view = new RedGPU.Display.View2D(redGPUContext, scene);
 * redGPUContext.addView(view);
 * ```
 * <iframe src="/RedGPU/examples/2d/helloWorld2D/" ></iframe>
 *
 * 아래는 View2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [Multi View2D(2D + 2D) example](/RedGPU/examples/2d/view/multiView/)
 * @see [Multi View2D(2D + 3D) example](/RedGPU/examples/2d/view/multiViewWith3D/)
 *
 * @extends View3D
 * @category View
 */
class View2D extends View3D {
    /**
     * View2D 생성자입니다.
     * Camera2D를 자동으로 생성하여 View3D의 생성자에 전달합니다.
     *
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param scene - Scene 인스턴스
     * @param name - 선택적 뷰 이름
     */
    constructor(redGPUContext, scene, name) {
        const camera = new Camera2D();
        super(redGPUContext, scene, camera, name);
    }
}
Object.freeze(View2D);
export default View2D;
