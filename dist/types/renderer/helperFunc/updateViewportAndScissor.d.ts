import View3D from "../../display/view/View3D";
/**
 * [KO] 렌더 패스의 Viewport와 Scissor Rect를 업데이트합니다.
 * [EN] Updates the Viewport and Scissor Rect of the render pass.
 *
 * @param view - View3D 인스턴스
 * @param viewRenderPassEncoder - 현재 활성화된 렌더 패스 엔코더
 * @param renderType - 렌더링 유형 ('DEFAULT', 'SHADOW', 'PICKING')
 */
declare const updateViewportAndScissor: (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder, renderType?: "DEFAULT" | "SHADOW" | "PICKING") => void;
export default updateViewportAndScissor;
