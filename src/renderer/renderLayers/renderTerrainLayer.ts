import View3D from "../../display/view/View3D";

const renderTerrainLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, scene} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {terrainChildren} = scene
    let i = 0

    {
        const len = terrainChildren.length;
        for (i; i < len; i++) {
            terrainChildren[i].render(renderViewStateData);
        }
    }
    viewRenderPassEncoder.executeBundles(renderViewStateData.renderBundleResults.bundleListTerrainList);
}
export default renderTerrainLayer
