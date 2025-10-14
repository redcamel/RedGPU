import renderListForLayer from "./core/renderListForLayer";
const render2PathLayer = (view, viewRenderPassEncoder) => {
    const { renderViewStateData, } = view;
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder;
    // render2PathLayer
    const { render2PathLayer } = renderViewStateData;
    renderListForLayer(render2PathLayer, renderViewStateData);
};
export default render2PathLayer;
