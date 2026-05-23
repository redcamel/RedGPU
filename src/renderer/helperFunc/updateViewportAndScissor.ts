import View3D from "../../display/view/View3D";

/**
 * [KO] 렌더 패스의 Viewport와 Scissor Rect를 업데이트합니다.
 * [EN] Updates the Viewport and Scissor Rect of the render pass.
 *
 * @param view - View3D 인스턴스
 * @param viewRenderPassEncoder - 현재 활성화된 렌더 패스 엔코더
 * @param renderType - 렌더링 유형 ('DEFAULT', 'SHADOW', 'PICKING')
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
        // [KO] 피킹 시 1x1 Scissor 최적화 적용
        // [EN] Apply 1x1 Scissor optimization for picking
        const dpr = window.devicePixelRatio;
        const renderScale = redGPUContext.renderScale;
        const combinedScale = dpr * renderScale;

        // [KO] 논리 좌표를 물리 픽셀 좌표로 변환 [EN] Convert logical coordinates to physical pixel coordinates
        const physicalX = Math.floor(pickingManager.mouseX * combinedScale);
        const physicalY = Math.floor(pickingManager.mouseY * combinedScale);

        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(
            Math.max(0, Math.min(width - 1, physicalX)),
            Math.max(0, Math.min(height - 1, physicalY)),
            1, 1
        );
    } else {
        // [KO] 기본 렌더링 (전체 영역) [EN] Default rendering (Full area)
        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(0, 0, width, height);
    }
}

export default updateViewportAndScissor