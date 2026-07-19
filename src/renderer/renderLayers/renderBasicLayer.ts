import View3D from "../../display/view/View3D";

const renderBasicLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, scene} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {children} = scene
    let i = 0
    {
        const len = children.length;
        for (i; i < len; i++) {
            children[i].render(renderViewStateData);
        }
    }
    viewRenderPassEncoder.executeBundles(renderViewStateData.renderBundleResults.bundleListBasicList);
}
export default renderBasicLayer
