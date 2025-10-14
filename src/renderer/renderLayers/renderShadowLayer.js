import renderListForLayer from "./core/renderListForLayer";
const renderShadowLayer = (view, viewRenderPassEncoder) => {
    const { renderViewStateData, scene, } = view;
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder;
    const { shadowManager } = scene;
    const { directionalShadowManager } = shadowManager;
    const { castingList } = directionalShadowManager;
    renderListForLayer(castingList, renderViewStateData, 'shadowPipeline');
};
export default renderShadowLayer;
