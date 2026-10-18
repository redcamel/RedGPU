import View3D from "../../display/view/View3D";
import sortTransparentObjects from "../../math/sortTransparentObjects";

/**
 * [KO] ?뚰뙆 ?덉씠?? ?щ챸 ?덉씠?? ?뚰떚???덉씠?댁쓽 ?뚮뜑 踰덈뱾???쒖꽌?濡??ㅽ뻾?⑸땲??
 * [EN] Executes the render bundles of the alpha, transparent, and particle layers in order.
 *
 * [KO] ?щ챸 ?덉씠??踰덈뱾? 移대찓???꾩튂 湲곗??쇰줈 ?뺣젹?????ㅽ뻾?⑸땲??
 * [EN] Transparent layer bundles are sorted by camera position before execution.
 *
 * @param view -
 * [KO] ?뚮뜑留곹븷 View3D ?몄뒪?댁뒪
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] 踰덈뱾???ㅽ뻾???뚮뜑 ?⑥뒪 ?몄퐫?? * [EN] Render pass encoder that executes the bundles
 */
const renderAlphaLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, rawCamera,} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {
        bundleListAlphaLayer,
        bundleListTransparentLayer,
        bundleListParticleLayer
    } = renderViewStateData.renderBundleResults
    if (bundleListAlphaLayer.length) {
        viewRenderPassEncoder.executeBundles(bundleListAlphaLayer);
    }
    const {x, y, z} = rawCamera
    if (bundleListTransparentLayer.length) {
        viewRenderPassEncoder.executeBundles(sortTransparentObjects({x, y, z}, bundleListTransparentLayer))
    }
    if (bundleListParticleLayer.length) {
        viewRenderPassEncoder.executeBundles(bundleListParticleLayer);
    }
}
export default renderAlphaLayer