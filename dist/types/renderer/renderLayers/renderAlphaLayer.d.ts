import View3D from "../../display/view/View3D";
/**
 * [KO] 알파 레이어, 투명 레이어, 파티클 레이어의 렌더 번들을 순서대로 실행합니다.
 * [EN] Executes the render bundles of the alpha, transparent, and particle layers in order.
 *
 * [KO] 투명 레이어 번들은 카메라 위치 기준으로 정렬한 뒤 실행합니다.
 * [EN] Transparent layer bundles are sorted by camera position before execution.
 *
 * @param view -
 * [KO] 렌더링할 View3D 인스턴스
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] 번들을 실행할 렌더 패스 인코더
 * [EN] Render pass encoder that executes the bundles
 * @category Renderer
 */
declare const renderAlphaLayer: (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => void;
export default renderAlphaLayer;
