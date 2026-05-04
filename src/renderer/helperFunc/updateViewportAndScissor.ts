import View3D from "../../display/view/View3D";

const updateViewportAndScissor = (
    view: View3D,
    viewRenderPassEncoder: GPURenderPassEncoder,
    shadowRender: boolean = false,
) => {
    const {scene, pixelRectObject} = view
    const {shadowManager} = scene
    const {directionalShadowManager} = shadowManager
    if (shadowRender) {
        const width = directionalShadowManager.shadowDepthTextureSize
        const height = directionalShadowManager.shadowDepthTextureSize
        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(0, 0, width, height);
    } else {
        const {width, height} = pixelRectObject
        viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
        viewRenderPassEncoder.setScissorRect(0, 0, width, height);
    }
}

export default updateViewportAndScissor