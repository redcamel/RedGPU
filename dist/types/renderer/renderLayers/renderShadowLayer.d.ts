import View3D from "../../display/view/View3D";
/**
 * [KO] 지정된 캐스케이드 인덱스에 대해 가시성 컬링을 수행하고 그림자 깊이 맵을 렌더링합니다.
 * [EN] Performs visibility culling for the specified cascade index and renders the shadow depth map.
 *
 * @param view -
 * [KO] 렌더링 대상 View3D 인스턴스
 * [EN] Target View3D instance for rendering
 * @param viewShadowRenderPassEncoder -
 * [KO] 그림자 렌더 패스 인코더
 * [EN] Shadow render pass encoder
 * @param cascadeIndex -
 * [KO] 렌더링할 캐스케이드 인덱스
 * [EN] Cascade index to render
 * @category Renderer
 */
declare const renderShadowLayer: (view: View3D, viewShadowRenderPassEncoder: GPURenderPassEncoder, cascadeIndex: number) => void;
export default renderShadowLayer;
