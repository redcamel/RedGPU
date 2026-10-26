import View3D from "../../display/view/View3D";
/**
 * [KO] 렌더링 유형(`'DEFAULT'`, `'SHADOW'`, `'PICKING'`)에 따라 렌더 패스의 Viewport와 Scissor 영역을 설정합니다.
 * [EN] Sets the Viewport and Scissor rectangle of the render pass according to the rendering type (`'DEFAULT'`, `'SHADOW'`, `'PICKING'`).
 *
 * @param view -
 * [KO] 대상 `View3D` 인스턴스
 * [EN] Target `View3D` instance
 * @param viewRenderPassEncoder -
 * [KO] 현재 활성화된 렌더 패스 엔코더 (`GPURenderPassEncoder`)
 * [EN] Currently active render pass encoder (`GPURenderPassEncoder`)
 * @param renderType -
 * [KO] 렌더링 유형 (`'DEFAULT'` | `'SHADOW'` | `'PICKING'`, 기본값: `'DEFAULT'`)
 * [EN] Rendering type (`'DEFAULT'` | `'SHADOW'` | `'PICKING'`, default: `'DEFAULT'`)
 * @category Renderer
 */
declare const updateViewportAndScissor: (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder, renderType?: "DEFAULT" | "SHADOW" | "PICKING") => void;
export default updateViewportAndScissor;
