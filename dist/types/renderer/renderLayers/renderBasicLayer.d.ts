import View3D from "../../display/view/View3D";
/**
 * [KO] 씬의 자식 객체들을 렌더링하여 기본 레이어 렌더 번들을 수집한 뒤 실행합니다.
 * [EN] Renders the scene's children to collect basic layer render bundles and then executes them.
 *
 * @param view -
 * [KO] 렌더링할 View3D 인스턴스
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] 번들을 실행할 렌더 패스 인코더
 * [EN] Render pass encoder that executes the bundles
 * @category Renderer
 */
declare const renderBasicLayer: (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => void;
export default renderBasicLayer;
