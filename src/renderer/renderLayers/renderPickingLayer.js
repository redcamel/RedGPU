import renderListForLayer from "./core/renderListForLayer";
const renderPickingLayer = (view, viewRenderPassEncoder) => {
    const { renderViewStateData, pickingManager } = view;
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder;
    const { castingList } = pickingManager;
    renderListForLayer(castingList, renderViewStateData, 'pickingPipeline');
};
export default renderPickingLayer;
