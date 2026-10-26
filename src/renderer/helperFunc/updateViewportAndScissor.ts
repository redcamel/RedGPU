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
const updateViewportAndScissor = (
    view: View3D,
    viewRenderPassEncoder: GPURenderPassEncoder,
    renderType: 'DEFAULT' | 'SHADOW' | 'PICKING' = 'DEFAULT'
) => {
    const {scene, pixelRectObject, pickingManager, redGPUContext} = view
    const {width, height} = pixelRectObject

    if (renderType === 'SHADOW') {
        const {shadowManager} = scene
        const {directionalShadowManager} = shadowManager
        const shadowSize = directionalShadowManager.shadowDepthTextureSize
        viewRenderPassEncoder.setViewport(0, 0, shadowSize, shadowSize, 0, 1);
        viewRenderPassEncoder.setScissorRect(0, 0, shadowSize, shadowSize);
    } else if (renderType === 'PICKING') {
        const dpr = window.devicePixelRatio;
        const renderScale = redGPUContext.renderScale;
        const combinedScale = dpr * renderScale;

        const physicalX = Math.floor(pickingManager.mouseX * combinedScale);
        const physicalY = Math.floor(pickingManager.mouseY * combinedScale);

        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(
            Math.max(0, Math.min(width - 1, physicalX)),
            Math.max(0, Math.min(height - 1, physicalY)),
            1, 1
        );
    } else {
        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(0, 0, width, height);
    }
}

export default updateViewportAndScissor